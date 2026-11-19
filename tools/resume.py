#!/usr/bin/env python3
"""Print the resume to PDF, and prove a machine can read it back.

The resume is one plain Markdown file, ``content/resume/index.md``. Hugo
renders it as the page at /resume/ (``layouts/_default/resume.html``), and
this script prints that page with Chromium into the PDF that goes out with
applications, written next to the Markdown so the site publishes it too:
``content/resume/<params.resume.pdf from hugo.toml>``.

A resume PDF is read by a parser or a language model long before a person
sees it, so ``build`` ends by running ``check``, which reads the PDF the way
they do and fails if it doesn't say what the Markdown says:

* every page has a text layer, and every font is embedded with a ToUnicode
  map (without one, extracted text is glyph ids, not letters);
* the text pypdf extracts (and poppler's ``pdftotext``, if installed) holds
  the Markdown's words, in the Markdown's order -- reading order, ligatures
  and hyphenation are all ways for that to go wrong;
* the PDF was printed from the Markdown as it is now. ``build`` stamps the
  source's hash into the PDF's metadata, so an edit without a rebuild is
  caught rather than sent.

docs/resume.md has the research behind the layout and these checks.

Usage::

    pip install playwright pypdf     # the browser: `playwright install chromium`
    python tools/resume.py build     # hugo, print, check
    python tools/resume.py check     # just the check

``build`` needs ``hugo`` on the PATH. ``--chromium PATH`` (or the
``RESUME_CHROMIUM`` environment variable) points Playwright at a browser of
your own instead of the one it downloads.
"""

from __future__ import annotations

import argparse
import contextlib
import difflib
import functools
import hashlib
import http.server
import logging
import os
import re
import shutil
import subprocess  # ruff: ignore[suspicious-subprocess-import] -- runs hugo and pdftotext, fixed argv
import sys
import tempfile
import threading
import tomllib
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Generator

_logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE = REPO_ROOT / "content" / "resume" / "index.md"

# The metadata key build stamps the source's hash under.
HASH_KEY = "/WirenookSourceSHA256"

# How much of the Markdown's text has to come back out of the PDF, in order.
# Not 1.0: Markdown has characters a rendered page doesn't (a bare URL's
# angle brackets, say) that the normalisation below can't all anticipate.
MIN_COVERAGE = 0.97


def _pdf_path() -> Path:
    with (REPO_ROOT / "hugo.toml").open("rb") as handle:
        name = tomllib.load(handle)["params"]["resume"]["pdf"]
    return SOURCE.parent / name


def _source_hash() -> str:
    return hashlib.sha256(SOURCE.read_bytes()).hexdigest()


# ------------------------------------------------------------------ build


@contextlib.contextmanager
def _serving(root: Path) -> Generator[str, None, None]:
    """Serve a directory on a loopback port for as long as the block runs.

    :param root: The directory.
    :yield: Its base URL.
    """

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format: str, *args: object) -> None:  # ruff: ignore[builtin-argument-shadowing]
            pass

    handler = functools.partial(Quiet, directory=str(root))
    with http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{server.server_address[1]}"
        finally:
            server.shutdown()


def _print(site: Path, out: Path, chromium: str | None) -> None:
    from playwright.sync_api import sync_playwright  # ruff: ignore[import-outside-top-level]

    with _serving(site) as base, sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=chromium)
        try:
            page = browser.new_page()
            page.goto(f"{base}/resume/", wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.emulate_media(media="print")
            page.pdf(
                path=str(out),
                prefer_css_page_size=True,
                # Tagged: headings, lists and paragraphs survive into the file
                # as structure, and reading order is declared, not guessed.
                tagged=True,
                outline=True,
            )
        finally:
            browser.close()


def _stamp(path: Path) -> None:
    from pypdf import PdfWriter  # ruff: ignore[import-outside-top-level]

    with path.open("rb") as handle:
        writer = PdfWriter(clone_from=handle)
    author = "Cassidy Prather"
    writer.add_metadata({
        "/Title": f"{author} — Resume",
        "/Author": author,
        "/Subject": "Resume",
        HASH_KEY: _source_hash(),
    })
    with path.open("wb") as handle:
        writer.write(handle)


def cmd_build(chromium: str | None) -> int:
    if not SOURCE.exists():
        _logger.error("no resume at %s", SOURCE.relative_to(REPO_ROOT))
        return 1
    hugo = shutil.which("hugo")
    if not hugo:
        _logger.error("hugo is not on the PATH")
        return 1
    out = _pdf_path()
    with tempfile.TemporaryDirectory() as site:
        subprocess.run(  # ruff: ignore[subprocess-without-shell-equals-true]
            [hugo, "--quiet", "--source", str(REPO_ROOT), "--destination", site],
            check=True,
        )
        _print(Path(site), out, chromium)
    _stamp(out)
    _logger.info("wrote %s", out.relative_to(REPO_ROOT))
    return cmd_check()


# ------------------------------------------------------------------ check


def _words(text: str) -> list[str]:
    """Reduce text to comparable words: lowercase letters and digits only.

    :param text: Any text.
    :return: Its words.
    """
    text = text.replace("­", "")  # soft hyphens
    return re.findall(r"[a-z0-9]+", text.lower())


def _markdown_words(markdown: str) -> list[str]:
    """Return the words a reader of the rendered resume sees, in order.

    Not a Markdown parser -- just enough to drop syntax that never reaches
    the page: link targets, image references, HTML comments.

    :param markdown: The source.
    :return: Its visible words.
    """
    text = re.sub(r"<!--.*?-->", " ", markdown, flags=re.DOTALL)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    return _words(text)


def _coverage(source: list[str], extracted: list[str]) -> tuple[float, list[str]]:
    matcher = difflib.SequenceMatcher(None, source, extracted, autojunk=False)
    matched = sum(block.size for block in matcher.get_matching_blocks())
    missing = [
        " ".join(source[i1:i2])
        for tag, i1, i2, _, _ in matcher.get_opcodes()
        if tag in {"delete", "replace"}
    ]
    return matched / max(len(source), 1), missing


def _fonts_ok(reader: object) -> list[str]:
    """List every font that is not embedded or has no ToUnicode map.

    :param reader: A pypdf PdfReader.
    :return: One line per problem.
    """
    problems = []
    seen = set()
    for number, page in enumerate(reader.pages, 1):  # type: ignore[attr-defined]
        fonts = page.get("/Resources", {}).get("/Font", {})
        for ref in fonts.values():
            font = ref.get_object()
            name = str(font.get("/BaseFont", "?"))
            if name in seen:
                continue
            seen.add(name)
            descriptor = font
            if "/DescendantFonts" in font:
                descriptor = font["/DescendantFonts"][0].get_object()
            descriptor = descriptor.get("/FontDescriptor", {})
            if not any(
                k in descriptor for k in ("/FontFile", "/FontFile2", "/FontFile3")
            ):
                problems.append(f"page {number}: {name} is not embedded")
            if "/ToUnicode" not in font:
                problems.append(f"page {number}: {name} has no ToUnicode map")
    return problems


def cmd_check() -> int:
    from pypdf import PdfReader  # ruff: ignore[import-outside-top-level]

    out = _pdf_path()
    if not out.exists():
        _logger.error("no PDF at %s; run build", out.relative_to(REPO_ROOT))
        return 1
    reader = PdfReader(out)
    failed = False

    stamp = (reader.metadata or {}).get(HASH_KEY)
    if stamp != _source_hash():
        _logger.error("the PDF is out of date with %s; run build", SOURCE.name)
        failed = True

    for problem in _fonts_ok(reader):
        _logger.error("%s", problem)
        failed = True

    pages = [page.extract_text() or "" for page in reader.pages]
    for number, text in enumerate(pages, 1):
        if not text.strip():
            _logger.error("page %d has no text layer", number)
            failed = True

    source = _markdown_words(SOURCE.read_text(encoding="utf-8"))
    extractors = {"pypdf": "\n".join(pages)}
    pdftotext = shutil.which("pdftotext")
    if pdftotext:
        extractors["pdftotext"] = subprocess.run(  # ruff: ignore[subprocess-without-shell-equals-true]
            [pdftotext, "-layout", str(out), "-"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout
    for name, text in extractors.items():
        coverage, missing = _coverage(source, _words(text))
        level = logging.INFO if coverage >= MIN_COVERAGE else logging.ERROR
        _logger.log(
            level,
            "%s: %.1f%% of the resume's words read back in order",
            name,
            100 * coverage,
        )
        for gap in missing[:10]:
            _logger.log(level, "  not read back: %s", gap)
        failed |= coverage < MIN_COVERAGE

    tagged = "/StructTreeRoot" in reader.trailer["/Root"]
    _logger.info(
        "%d page(s), %s, %s",
        len(reader.pages),
        "tagged" if tagged else "untagged",
        "fonts embedded with ToUnicode" if not _fonts_ok(reader) else "font problems",
    )
    return int(failed)


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n", 1)[0])
    commands = parser.add_subparsers(dest="command", required=True)
    build = commands.add_parser("build", help="print the PDF, then check it")
    build.add_argument(
        "--chromium",
        default=os.environ.get("RESUME_CHROMIUM"),
        help="a Chromium executable for Playwright to drive",
    )
    commands.add_parser("check", help="check the PDF against the Markdown")
    args = parser.parse_args()
    if args.command == "build":
        return cmd_build(args.chromium)
    return cmd_check()


if __name__ == "__main__":
    sys.exit(main())
