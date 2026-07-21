# cass-website

Cassidy Prather's personal website.

https://wirenook.net/

## Blog

Posts live in `content/blog/` as Markdown files. Front matter:

- `date` — required; drives feed order, timestamps, and permalink `#` anchors.
  Future-dated posts still publish (`buildFuture`), so a timestamp a few hours
  ahead never silently hides a post.
- `title` — optional; untitled posts render with no heading on the feed,
  which suits micro-posts.
- `highlight: true` — adds the post to the Highlights column beside the feed.
- `description` — optional; shown on the feed instead of the auto summary
  when a post is collapsed.

The feed decides collapsing automatically: posts short enough to fit render
whole; longer posts show a summary plus a "read the rest" link. A `<!--more-->`
line in the body sets the summary cut explicitly.

Search is client-side over `/blog/index.json`, generated at build time from
the full text of every post. The RSS feed is at `/blog/index.xml`.

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
