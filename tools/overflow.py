#!/usr/bin/env python3
"""Catch layout overflow in the built site before it ships.

Overflow is a property of the *computed* layout, not of the CSS text, so no
amount of reading styles.css can predict it: the width of any given panel is
a function of the viewport, the wave gutter, three ``minmax()`` tracks, a
handful of ``clamp()`` gaps, the loaded font's metrics, and every image's
intrinsic ratio. This tool does the only thing that actually answers the
question -- it runs the real layout engine over the built site at a sweep of
viewport widths and measures every box.

Three things are reported:

``escape``
    A box sticks out past its parent's padding box while the parent is
    ``overflow-x: visible``. This is the one that shows as content spilling
    over a panel's edge, and it is the check that earns the tool's keep.
``self``
    An element's content is wider than its own content box.
``viewport``
    A box reaches past the right edge of the viewport, or the document itself
    scrolls horizontally.

Because breakpoints create *bands* rather than thresholds -- a layout can be
correct at 1366px and at 1440px and broken at every width in between -- the
sweep is dense by default. Spot-checking a handful of device widths is
exactly how these bugs survive.

The viewport width is not the only knob real readers turn, and the first
overflow that shipped past this tool's green run taught it three lessons:

* Every ``<details>`` is opened before measuring. A closed spoiler renders
  nothing, so whatever it holds was invisible to the sweep until a reader
  clicked it.
* The sweep starts at 240px, not a "sensible" phone width -- cover displays
  (a folding phone's front screen) and split-screen windows go narrower
  than any device-preset list.
* Every page is measured twice: once at the browser-default 16px font and
  once at 24px, Chrome's "very large" preset (from phone widths up -- see
  ``FONT_PASS_MIN_WIDTH``). This site sets no root font-size on purpose, so
  a reader's font preference scales every rem -- and a layout that only
  works at one rem size is a layout that overflows on someone's phone.

Deliberate bleeds (the feature bunny, the rail charms) are not bugs, so they
are listed in ``ALLOWED`` with a reason instead of being silently ignored.

Usage::

    hugo --minify                    # build ./public first
    python tools/overflow.py check   # report overflow; exit 1 if any
    python tools/overflow.py check --widths 1380-1420 --verbose
"""

from __future__ import annotations

import argparse
import contextlib
import functools
import http.server
import logging
import socketserver
import sys
import threading
from dataclasses import dataclass, field
from fnmatch import fnmatch
from pathlib import Path
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from collections.abc import Iterator

    from playwright.sync_api import Page

_logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PUBLIC = REPO_ROOT / "public"

# Sub-pixel differences are layout rounding, not overflow.
TOLERANCE_PX = 1.0

# Narrow bands hide between the sensible device widths everyone tests, so the
# default sweep is fine-grained where the layout is tightest and coarsens once
# the columns have room to breathe. Resizing an already-loaded page is cheap;
# the cost here is layout passes, not page loads.
DEFAULT_BANDS = ((240, 800, 4), (800, 1600, 8), (1600, 2560, 32))

# The second measuring pass raises the browser's default font to Chrome's
# "very large" preset. rem-sized boxes grow 1.5x while the viewport doesn't,
# which is how a layout that swept clean at every width still shoved the
# "<- Blog" chip off a phone screen for readers with a large-text setting.
#
# The two axes are swept to their extremes independently, not multiplied:
# the font pass starts at phone width rather than the sweep's 240px floor.
# At a 24px base font a 240px viewport is a 10rem-wide layout -- narrower
# than single heading words at the design's minimum sizes -- and holding
# that line would mean word-breaking headings and shrinking fixed widgets
# for a screen-and-preference combination no device produces.
FONT_PASS_PX = 24
FONT_PASS_MIN_WIDTH = 320

# Findings whose key matches one of these patterns are expected. Keep the
# reason honest: an entry here is a promise that the bleed is designed, not a
# place to park a bug that is annoying to fix.
ALLOWED: tuple[tuple[str, str], ...] = (
    (
        "* escape img.feature-image in section.feature-object",
        (
            "the feature bunny is drawn oversized on purpose and bleeds out of"
            " its cell; .page-shell clips the result"
        ),
    ),
    (
        "* viewport img.feature-image",
        "same bleed, measured against the viewport instead of the cell",
    ),
    (
        "* self section.feature-object",
        "container of the deliberate bunny bleed",
    ),
    (
        "* self aside.right-stack",
        "container of the deliberate bunny bleed",
    ),
    (
        "* self main.layout-grid",
        "container of the deliberate bunny bleed",
    ),
    (
        "* self a.rail-link",
        "the link charm hangs off the button's edge by design",
    ),
    (
        "* self nav.link-rail",
        "container of the deliberate charm overhang",
    ),
    (
        "* self div.spinner",
        "webring buttons are positioned around the ring, outside its circle",
    ),
    (
        "* self *.social-button",
        (
            "the ::after tooltip is wider than its button; it only paints on"
            " hover and is clamped to the viewport by max-width"
        ),
    ),
    (
        "* self li",
        "socials list item wrapping a tooltip-bearing button",
    ),
    (
        "* self ul.socials-list",
        "socials list wrapping a tooltip-bearing button",
    ),
    (
        "* self article#connect.socials-panel",
        "socials panel wrapping a tooltip-bearing button",
    ),
    (
        "* self div.content-grid",
        "socials panel wrapping a tooltip-bearing button",
    ),
    (
        "* self section.index-window",
        "socials panel wrapping a tooltip-bearing button",
    ),
)

# Measure the laid-out geometry of every visible box. Runs in page context.
PROBE_JS = """
(tolerance) => {
  const findings = [];
  const label = (el) => {
    if (el === document.body) return 'body';
    let out = el.tagName.toLowerCase();
    if (el.id) out += '#' + el.id;
    for (const name of el.classList) out += '.' + name;
    return out;
  };
  const docWidth = document.documentElement.clientWidth;
  const record = (kind, el, by, parent) => findings.push({
    kind,
    by: Math.round(by * 10) / 10,
    element: label(el),
    parent: parent ? label(parent) : null,
  });

  // Content inside a horizontal scroll container sits past the viewport by
  // design -- that is what makes it pannable -- so measuring its rect against
  // the viewport says nothing about the layout. A code block wide enough to
  // scroll would otherwise report its own <code> as viewport overflow forever.
  // Only auto/scroll counts: a clip/hidden ancestor genuinely loses whatever
  // sticks out, which is why .page-shell's clip stays reportable.
  const inScroller = (el) => {
    for (let node = el.parentElement;
         node && node !== document.documentElement;
         node = node.parentElement) {
      const overflowX = getComputedStyle(node).overflowX;
      if (overflowX === 'auto' || overflowX === 'scroll') return true;
    }
    return false;
  };

  for (const el of document.body.querySelectorAll('*')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;

    // Content wider than the box it is laid out in.
    if (style.overflowX === 'visible'
        && el.scrollWidth - el.clientWidth > tolerance) {
      record('self', el, el.scrollWidth - el.clientWidth, null);
    }

    // A box escaping its parent's padding box. Out-of-flow and transformed
    // boxes are placed by hand, so their position is not a layout failure;
    // a parent that is not overflow-x:visible has said it handles this.
    const parent = el.parentElement;
    const placed = style.position === 'absolute' || style.position === 'fixed';
    const moved = style.transform !== 'none';
    if (parent && parent !== document.documentElement && !placed && !moved) {
      const parentStyle = getComputedStyle(parent);
      if (parentStyle.overflowX === 'visible') {
        const parentRect = parent.getBoundingClientRect();
        const inner = {
          left: parentRect.left
            + parseFloat(parentStyle.borderLeftWidth)
            + parseFloat(parentStyle.paddingLeft),
          right: parentRect.right
            - parseFloat(parentStyle.borderRightWidth)
            - parseFloat(parentStyle.paddingRight),
        };
        const by = Math.max(rect.right - inner.right, inner.left - rect.left);
        if (by > tolerance) record('escape', el, by, parent);
      }
    }

    // A box reaching past the viewport. Fixed decoration is meant to, and so
    // is anything a scroll container is holding.
    if (style.position !== 'fixed' && rect.right - docWidth > tolerance
        && !inScroller(el)) {
      record('viewport', el, rect.right - docWidth, null);
    }
  }

  const documentBy = document.documentElement.scrollWidth - docWidth;
  return {
    documentBy: documentBy > tolerance ? documentBy : 0,
    findings,
  };
}
"""


@dataclass
class Finding:
    """One distinct overflow, with every width it was seen at."""

    key: str
    widths: list[int] = field(default_factory=list)
    worst: float = 0.0

    def bands(self) -> str:
        """Collapse the widths into readable contiguous ranges.

        :return: A summary such as ``1378-1420px`` or ``320px, 1440-1600px``.
        """
        runs: list[list[int]] = []
        for width in self.widths:
            if runs and width - runs[-1][-1] <= _step_for(width):
                runs[-1].append(width)
            else:
                runs.append([width])
        parts = [
            f"{run[0]}px" if run[0] == run[-1] else f"{run[0]}-{run[-1]}px"
            for run in runs
        ]
        return ", ".join(parts)


def _step_for(width: int) -> int:
    """Return the sweep step in force at a width, for collapsing runs.

    :param width: Viewport width in CSS pixels.
    :return: The largest configured step at or below that width.
    """
    step = DEFAULT_BANDS[0][2]
    for start, _stop, band_step in DEFAULT_BANDS:
        if width >= start:
            step = band_step
    return step


def _sweep(spec: str | None) -> list[int]:
    """Build the list of viewport widths to measure.

    :param spec: ``None`` for the default sweep, or ``lo-hi`` / ``lo-hi:step``
        / a comma-separated list of explicit widths.
    :return: Ascending widths in CSS pixels.
    """
    if spec is None:
        widths: set[int] = set()
        for start, stop, step in DEFAULT_BANDS:
            widths.update(range(start, stop + 1, step))
        return sorted(widths)
    if "," in spec or "-" not in spec:
        return sorted({int(part) for part in spec.split(",")})
    span, _, step_text = spec.partition(":")
    low, _, high = span.partition("-")
    return list(range(int(low), int(high) + 1, int(step_text or 1)))


def _pages(root: Path) -> list[str]:
    """Find every rendered page under a built site.

    :param root: The Hugo output directory.
    :return: Site-root-relative URL paths, ascending.
    """
    return sorted(
        "/" + str(path.parent.relative_to(root)).replace("\\", "/").removeprefix(".")
        for path in root.rglob("index.html")
    )


@contextlib.contextmanager
def _serving(root: Path) -> Iterator[str]:
    """Serve a directory over loopback HTTP for the duration of the block.

    Loading over ``file://`` would change how relative URLs and the guestbook
    iframe resolve, so the pages are measured the way they are served.

    :param root: Directory to serve.
    :yield: The base URL the site is reachable at.
    """

    class Quiet(http.server.SimpleHTTPRequestHandler):
        """A static handler that does not narrate every asset request."""

        def log_message(
            self,
            format: str,  # noqa: A002
            *args: object,
        ) -> None:
            """Swallow the access log.

            :param format: Unused printf-style template.
            :param args: Unused template arguments.
            """

    handler = functools.partial(Quiet, directory=str(root))
    with socketserver.TCPServer(("127.0.0.1", 0), handler) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{server.server_address[1]}"
        finally:
            server.shutdown()
            thread.join(timeout=5)


def _allowance(key: str) -> str | None:
    """Return the reason a finding is expected, if it is.

    :param key: The finding's key.
    :return: The allowlist reason, or ``None`` when the finding is a bug.
    """
    for pattern, reason in ALLOWED:
        if fnmatch(key, pattern):
            return reason
    return None


def _prepare(page: Page, url: str) -> None:
    """Load a page and settle everything that would perturb measurement.

    Lazy images are forced eager (an image that has not loaded has no
    intrinsic ratio, and boxes sized from that ratio would measure wrong),
    every ``<details>`` is opened (a closed one renders nothing, so its
    contents would go unmeasured until a reader clicks), and animations are
    frozen so a mid-flight transform is not mistaken for a layout escape.

    :param page: The Playwright page to load into.
    :param url: Absolute URL to load.
    """
    page.goto(url, wait_until="load")
    page.eval_on_selector_all(
        "img[loading=lazy]",
        "images => images.forEach(image => { image.loading = 'eager'; })",
    )
    page.eval_on_selector_all(
        "details",
        "all => all.forEach(details => { details.open = true; })",
    )
    with contextlib.suppress(Exception):
        page.wait_for_function(
            "() => [...document.images].every(image => image.complete)",
            timeout=5000,
        )
    with contextlib.suppress(Exception):
        page.wait_for_function("() => document.fonts.status === 'loaded'", timeout=5000)
    page.add_style_tag(
        content="*, *::before, *::after {"
        " animation: none !important; transition: none !important; }",
    )


def _measure(
    page: Page,
    url_path: str,
    widths: list[int],
    findings: dict[str, Finding],
    key_prefix: str = "",
) -> None:
    """Sweep one already-loaded page across widths, folding results in.

    :param page: A page sitting on the URL to measure.
    :param url_path: Site-relative path, used to key findings.
    :param widths: Viewport widths to measure at.
    :param findings: Accumulator, mutated in place.
    :param key_prefix: Scenario tag prepended to finding keys, so the same
        overflow at two font sizes reports as two findings.
    """

    def fold(key: str, width: int, by: float) -> None:
        found = findings.setdefault(key, Finding(key))
        found.widths.append(width)
        found.worst = max(found.worst, by)

    for width in widths:
        page.set_viewport_size({"width": width, "height": 1400})
        result: dict[str, Any] = page.evaluate(PROBE_JS, TOLERANCE_PX)
        for item in result["findings"]:
            target = item["element"]
            if item["parent"]:
                target = f"{target} in {item['parent']}"
            fold(
                f"{key_prefix}{url_path} {item['kind']} {target}",
                width,
                item["by"],
            )
        if result["documentBy"]:
            fold(
                f"{key_prefix}{url_path} document <html>",
                width,
                result["documentBy"],
            )


def _report(findings: dict[str, Finding], *, full_sweep: bool) -> int:
    """Log the findings, splitting expected bleeds from bugs.

    :param findings: Every distinct finding from the sweep.
    :param full_sweep: Whether every width was measured, so an allowlist entry
        that matched nothing can be called stale rather than merely unvisited.
    :return: Process exit code.
    """
    bugs = []
    expected = 0
    used: set[str] = set()
    for key in sorted(findings):
        reason = _allowance(key)
        if reason is None:
            bugs.append(findings[key])
        else:
            expected += 1
            used.add(reason)
            _logger.debug("allowed: %s (%s)", key, reason)
    for bug in sorted(bugs, key=lambda found: -found.worst):
        _logger.warning(
            "%s\n    overflows by %gpx at %s",
            bug.key,
            bug.worst,
            bug.bands(),
        )
    _logger.info("%d expected bleed(s) suppressed by the allowlist", expected)

    # An entry that stops matching is a bleed that got fixed or renamed. Left
    # in place it silently widens the hole the next bug slips through, so the
    # allowlist is only trustworthy if it is required to stay minimal.
    stale = [pattern for pattern, reason in ALLOWED if reason not in used]
    if stale and full_sweep:
        for pattern in stale:
            _logger.warning("stale ALLOWED entry, nothing matches it: %s", pattern)

    if bugs:
        _logger.error("%d element(s) overflow their container", len(bugs))
        return 1
    if stale and full_sweep:
        _logger.error("%d stale allowlist entry(s); remove them", len(stale))
        return 1
    _logger.info("no unexpected overflow")
    return 0


def cmd_check(
    root: Path,
    widths: list[int],
    chromium: str | None,
    *,
    full_sweep: bool,
) -> int:
    """Sweep the built site and report every unexpected overflow.

    :param root: The Hugo output directory to measure.
    :param widths: Viewport widths to measure at.
    :param chromium: Explicit Chromium path, or ``None`` to use Playwright's.
    :param full_sweep: Whether ``widths`` is the default full sweep.
    :return: Process exit code.
    """
    from playwright.sync_api import sync_playwright  # noqa: PLC0415

    pages = _pages(root)
    if not pages:
        _logger.error("no index.html under %s; run `hugo --minify` first", root)
        return 1
    _logger.info(
        "measuring %d page(s) at %d width(s) from %dpx to %dpx,"
        " at default and %dpx base fonts",
        len(pages),
        len(widths),
        widths[0],
        widths[-1],
        FONT_PASS_PX,
    )

    findings: dict[str, Finding] = {}
    with _serving(root) as base, sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=chromium,
            args=["--no-sandbox"],
        )
        for key_prefix, font_px in (("", None), ("font24 ", FONT_PASS_PX)):
            pass_widths = widths
            if font_px is not None:
                pass_widths = [
                    width for width in widths if width >= FONT_PASS_MIN_WIDTH
                ]
                if not pass_widths:
                    continue
            context = browser.new_context(
                viewport={"width": 1280, "height": 1400},
            )
            # Third-party embeds carry their own width/height, so blocking
            # them keeps the measurement hermetic without changing the layout.
            context.route("**://**", lambda route: route.abort())
            context.route(
                "http://127.0.0.1/**",
                lambda route: route.continue_(),
            )
            context.route(f"{base}/**", lambda route: route.continue_())
            page = context.new_page()
            if font_px is not None:
                # The CDP knob is the browser's font-settings preference --
                # the same one Chrome's appearance settings drive -- so this
                # measures what a large-text reader's layout engine computes,
                # not a CSS override painted on top of it.
                context.new_cdp_session(page).send(
                    "Page.setFontSizes",
                    {
                        "fontSizes": {
                            "standard": font_px,
                            "fixed": round(font_px * 13 / 16),
                        },
                    },
                )
            for url_path in pages:
                _logger.debug("measuring %s%s", key_prefix, url_path)
                _prepare(page, base + url_path)
                _measure(page, url_path, pass_widths, findings, key_prefix)
            context.close()
        browser.close()

    return _report(findings, full_sweep=full_sweep)


def main() -> int:
    """Execute the CLI entry point.

    :return: Exit code (0 for success, non-zero for error).
    """
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="count",
        default=0,
        help="Increase verbosity (can be repeated)",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    check = subparsers.add_parser(
        "check",
        help="Measure the built site; exit 1 on unexpected overflow",
    )
    check.add_argument(
        "--public",
        type=Path,
        default=DEFAULT_PUBLIC,
        help="Hugo output directory to measure (default: ./public)",
    )
    check.add_argument(
        "--widths",
        default=None,
        help="Widths to sweep: 'lo-hi', 'lo-hi:step', or a comma-separated list",
    )
    check.add_argument(
        "--chromium",
        default=None,
        help="Path to a Chromium binary (default: the one Playwright installed)",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s: %(message)s",
    )

    if not args.public.is_dir():
        _logger.error("%s does not exist; run `hugo --minify` first", args.public)
        return 1
    return cmd_check(
        args.public,
        _sweep(args.widths),
        args.chromium,
        full_sweep=args.widths is None,
    )


if __name__ == "__main__":
    sys.exit(main())
