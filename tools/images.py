#!/usr/bin/env python3
"""Keep the metadata on the site's images consistent.

Every directory under static/images/ is a license tier (see
static/images/README.md and data/image_licenses.toml). This tool strips
incidental metadata (GIMP junk, screenshot world/instance details, ...)
from the raster files in the managed tiers and stamps the tier's XMP
license tags instead, using exiftool.

Usage::

    python tools/images.py check   # report drift; exit 1 if any
    python tools/images.py fix     # restamp non-compliant files
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import shutil
import subprocess  # noqa: S404
import sys
from pathlib import Path

_logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = REPO_ROOT / "static" / "images"

# Lowercase kebab-case; dots only for domain-named files (lobste.rs.svg).
NAME_RE = re.compile(r"^[a-z0-9]+(?:[.-][a-z0-9]+)*$")

# exiftool can write XMP into these. SVG and XCF sources are read-only to
# exiftool and carry their license by directory instead.
STAMPABLE = frozenset({".png", ".gif"})

# Directory -> XMP tags every stampable file in it must carry. "no-relicensing"
# is deliberately absent: those files stay byte-identical to upstream.
# The wirenook license still needs updating once the IP transfer concludes.
POLICIES: dict[str, dict[str, str]] = {
    "wirenook": {
        "XMP-dc:Creator": "Ron Kyle Almira",
        "XMP-dc:Rights": "CC0 1.0 - no rights reserved",
        "XMP-cc:License": "https://creativecommons.org/publicdomain/zero/1.0/",
    },
    "lancer": {
        "XMP-dc:Source": "https://github.com/massif-press/compcon",
        "XMP-dc:Rights": "GPL-3.0; Lancer and COMP/CON are (c) Massif Press",
        "XMP-cc:License": "https://www.gnu.org/licenses/gpl-3.0.html",
    },
    "OPL": {
        "XMP-dc:Creator": "Ron Kyle Almira",
        "XMP-dc:Rights": "Open Pixel License version 1.1",
        "XMP-cc:License": "https://pixel20012.github.io/OPLV1.1.html",
    },
}
UNMANAGED = frozenset({"no-relicensing"})


def _as_text(value: object) -> str:
    """Normalize an exiftool JSON value to a comparable string.

    :param value: Raw value as decoded from exiftool's JSON output.
    :return: The value flattened to a string.
    """
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return str(value)


def _read_tags(
    exiftool: str, tier_dir: Path, tags: list[str]
) -> dict[str, dict[str, str]]:
    """Read the given XMP tags from every stampable file in a tier.

    Recurses into nested subdirectories; a subdir inherits its tier's policy.

    :param exiftool: Path to the exiftool executable.
    :param tier_dir: Tier directory to scan, including nested subdirectories.
    :param tags: Tag names in exiftool GROUP:Name form.
    :return: Mapping of each file's path (as exiftool reports it) to its tags.
    """
    files = sorted(
        p for p in tier_dir.rglob("*") if p.is_file() and p.suffix.lower() in STAMPABLE
    )
    if not files:
        return {}
    cmd = [
        exiftool,
        "-json",
        "-G1",
        "-charset",
        "utf8",
        *(f"-{tag}" for tag in tags),
        *(str(f) for f in files),
    ]
    result = subprocess.run(  # noqa: S603
        cmd, capture_output=True, encoding="utf-8", check=True
    )
    found: dict[str, dict[str, str]] = {}
    for entry in json.loads(result.stdout):
        source = entry["SourceFile"]
        found[source] = {k: _as_text(v) for k, v in entry.items() if k != "SourceFile"}
    return found


def _stamp(exiftool: str, files: list[Path], tags: dict[str, str]) -> None:
    """Strip all metadata from the files and stamp the policy tags.

    :param exiftool: Path to the exiftool executable.
    :param files: Files to rewrite in place.
    :param tags: Tag assignments in exiftool GROUP:Name form.
    """
    cmd = [
        exiftool,
        "-quiet",
        "-overwrite_original",
        "-charset",
        "utf8",
        "-all=",
        "--icc_profile:all",  # color rendering data, not metadata: keep it
        *(f"-{tag}={value}" for tag, value in tags.items()),
        *(str(f) for f in files),
    ]
    subprocess.run(cmd, check=True)  # noqa: S603


def _check_layout() -> list[str]:
    """Validate the directory structure and naming convention.

    Tiers may nest subdirectories freely; names are checked at every depth.

    :return: Human-readable problem descriptions.
    """
    expected = set(POLICIES) | set(UNMANAGED)
    problems: list[str] = []
    for entry in sorted(IMAGES_DIR.iterdir()):
        if entry.is_dir():
            if entry.name not in expected:
                problems.append(
                    f"unexpected directory {entry}: add it to tools/images.py"
                    " and data/image_licenses.toml"
                )
            continue
        if entry.name != "README.md":
            problems.append(
                f"stray file {entry}: images belong in a license-tier subdirectory"
            )
    for tier in sorted(expected):
        tier_dir = IMAGES_DIR / tier
        if not tier_dir.is_dir():
            problems.append(f"missing directory {tier_dir}")
            continue
        for entry in sorted(tier_dir.rglob("*")):
            if entry.name == "README.md":
                continue
            if not NAME_RE.fullmatch(entry.name):
                kind = "directory" if entry.is_dir() else "file"
                problems.append(f"bad {kind} name {entry}: use lowercase kebab-case")
    return problems


def _find_drift(exiftool: str) -> dict[str, list[Path]]:
    """Find stampable files whose tags do not match their tier's policy.

    :param exiftool: Path to the exiftool executable.
    :return: Mapping of tier name to non-compliant files.
    """
    drift: dict[str, list[Path]] = {}
    for tier, policy in POLICIES.items():
        tier_dir = IMAGES_DIR / tier
        if not tier_dir.is_dir():
            continue
        actual = _read_tags(exiftool, tier_dir, list(policy))
        bad = sorted(
            Path(source)
            for source, tags in actual.items()
            if any(tags.get(tag) != value for tag, value in policy.items())
        )
        if bad:
            drift[tier] = bad
    return drift


def cmd_check(exiftool: str) -> int:
    """Report layout and metadata drift without changing anything.

    :param exiftool: Path to the exiftool executable.
    :return: Process exit code.
    """
    problems = _check_layout()
    drift = _find_drift(exiftool)
    for problem in problems:
        _logger.warning("%s", problem)
    for tier, files in sorted(drift.items()):
        for file in files:
            _logger.warning("%s: metadata does not match the %s policy", file, tier)
    total = len(problems) + sum(len(files) for files in drift.values())
    if total:
        _logger.error(
            "%d problem(s); run `python tools/images.py fix` to restamp", total
        )
        return 1
    _logger.info("all image metadata is consistent")
    return 0


def cmd_fix(exiftool: str) -> int:
    """Restamp every non-compliant file; layout problems are only reported.

    :param exiftool: Path to the exiftool executable.
    :return: Process exit code.
    """
    problems = _check_layout()
    for problem in problems:
        _logger.warning("%s (not auto-fixable)", problem)
    drift = _find_drift(exiftool)
    for tier, files in sorted(drift.items()):
        _stamp(exiftool, files, POLICIES[tier])
        for file in files:
            _logger.info("restamped %s", file)
    if not drift:
        _logger.info("no metadata drift to fix")
    return 1 if problems else 0


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
    subparsers.add_parser("check", help="Report metadata drift; exit 1 if any")
    subparsers.add_parser("fix", help="Strip and restamp non-compliant files")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s: %(message)s",
    )

    exiftool = shutil.which("exiftool")
    if exiftool is None:
        _logger.error(
            "exiftool not found on PATH"
            " (apt: libimage-exiftool-perl; brew/winget/choco: exiftool)"
        )
        return 2

    try:
        result = cmd_check(exiftool) if args.command == "check" else cmd_fix(exiftool)
    except subprocess.CalledProcessError as err:
        _logger.error(
            "exiftool failed with exit code %d: %s", err.returncode, err.stderr or ""
        )
        return 2
    return result


if __name__ == "__main__":
    sys.exit(main())
