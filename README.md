# cass-website

Cassidy Prather's personal website.

https://wirenook.net/

## Local development

[Hugo](https://gohugo.io/) extended v0.140.0+

```bash
hugo server -D    # live-reload dev server on http://localhost:1313
hugo --minify     # one-shot production build into ./public
```

## Layout conventions

- Content *families* (multiple pages sharing a design) set `type` in front
  matter and get a directory: `layouts/<type>/single.html` renders each page
  (e.g. `lancer`, `vrchat`). No `layout` key needed — `single` is Hugo's
  default for regular pages.
- One-off pages set `layout` instead and live in
  `layouts/_default/<layout>.html` (e.g. `licenses`, `guestbook`, `archive`).
  Their markdown files are URL stubs; the body lives in the template so it
  can use template functions like `relURL`.

## Images

All images live under `static/images/`, one subdirectory per license tier —
see [`static/images/README.md`](./static/images/README.md) for the layout,
naming, and source-file conventions. `data/image_licenses.toml` is the single
source of truth per directory; it drives both the licenses page and the
gallery on [`/style/`](https://wirenook.net/style/).

CI keeps XMP metadata on the raster files consistent. After adding or editing
images (needs [exiftool](https://exiftool.org/)):

```bash
python3 tools/images.py check   # what CI runs
python3 tools/images.py fix     # strip + restamp non-compliant files
```

Python under `tools/` lints with the ruff/ty config from
[python-template](https://github.com/CassidyPrather/python-template)
(see `pyproject.toml`).

## Licenses

See [`/licenses/`](https://wirenook.net/licenses/)
or [`LICENSE`](./LICENSE).
