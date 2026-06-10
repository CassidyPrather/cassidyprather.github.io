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

## Licenses

See [`/licenses/`](https://wirenook.net/licenses/)
or [`LICENSE`](./LICENSE).
