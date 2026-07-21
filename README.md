# cass-website

Cassidy Prather's personal website.

https://wirenook.net/

## Blog

Posts live in `content/blog/` as Markdown files. Front matter:

- `date` — required; drives feed order, timestamps, and permalink `#` anchors.
- `micro: true` — the whole post renders on the feed (no title, no "read the rest").
- `highlight: true` — adds the post to the Highlights column beside the feed.
- `description` — optional; shown on the feed for major posts instead of the
  auto summary. A `<!--more-->` line in the body marks the summary cut.

Search is client-side over `/blog/index.json`, generated at build time from
the full text of every post.

## Development

[Hugo](https://gohugo.io/) extended v0.140.0+

```sh
hugo server -D    # live-reload dev server on http://localhost:1313
hugo --minify     # one-shot production build into ./public
```

```sh
python tools/images.py check   # report drift, bad names, stray files
python tools/images.py fix     # strip + restamp anything non-compliant
```

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
