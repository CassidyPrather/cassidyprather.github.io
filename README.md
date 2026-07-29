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

### Layout overflow

Panels spilling their contents is the site's recurring bug, and it is not
visible in the CSS: how wide any given panel ends up is a function of the
viewport, the wave gutter, three `minmax()` tracks, several `clamp()`ed gaps,
the loaded font's metrics, and every image's intrinsic ratio. Only the layout
engine knows. So `tools/overflow.py` runs it — Chromium over the built site at
every width from 320px to 2560px — and measures whether any box sticks out of
its parent.

```sh
pip install playwright && playwright install chromium
hugo --minify                                    # build ./public first
python tools/overflow.py check                   # exit 1 on any overflow
python tools/overflow.py -v check --widths 1380-1420:2
```

Breakpoints fail in *bands*, not at thresholds — the badge grid was fine at
1366px, fine at 1440px, and broken at every width between 1378px and 1416px —
so the sweep is dense and checking a handful of device widths is not a
substitute. CI runs it on every push that touches the site.

Deliberate bleeds (the feature bunny, the rail charms) live in that script's
`ALLOWED` list with a reason each. The check fails if an entry there stops
matching anything, so the list cannot quietly grow into a place bugs hide.

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
