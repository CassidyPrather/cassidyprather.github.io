# wirenook.net

https://wirenook.net/

Cassidy Prather's personal website.

I thought it would be funny to host the source code of my personal website.
You can see version histories of pages and blog posts here.
That way, we don't have to rely on the lovely folks at https://archive.org/!

## Development

[Hugo](https://gohugo.io/) extended v0.140.0+

```sh
hugo server -D    # live-reload dev server on http://localhost:1313
hugo --minify     # one-shot production build into ./public
```

```sh
python tools/images.py check   # report drift, bad names, stray files, fat bit depths
python tools/images.py fix     # strip + restamp anything non-compliant
pip install pyoxipng           # only `optimize` needs this
python tools/images.py optimize  # losslessly recompress the tiers, then restamp
```

Reviews from Steam, Goodreads and VNDB are mirrored into the blog under
`content/blog/reviews/`. The posts are generated — fix a review where it was
written, then pull it back down — and committed, so a pull is a diff to read:

```sh
python tools/reviews.py pull           # rewrite every review post from the sources
python tools/reviews.py pull steam     # ...or just one site
python tools/reviews.py check          # say what a pull would change; write nothing
```

### Wet and dry

The site has two faces. **Wet** is everything. **Dry** is a portfolio: the home
page and the blog cut down to a resume, a few posts kept with `dry: true` in
their front matter (or, for a mirrored review, listed under `dry` in
`data/reviews.toml`), email and phone, and one game. Every other page still
builds and answers a direct link. `mode` under `[params]` in `hugo.toml` picks
what a stranger sees; `?wet` or `?dry` on any URL switches a browser, and the
browser remembers.

```sh
HUGO_PARAMS_MODE=dry hugo server   # preview dry without touching hugo.toml
```

### Resume

`content/resume/index.md`, plain Markdown, becomes `/resume/` and a PDF.
[`docs/resume.md`](./docs/resume.md) has the conventions and the research
behind the layout.

```sh
pip install playwright pypdf && playwright install chromium
python tools/resume.py build   # print the PDF, then prove it reads back
```

See also (closely related): [`CassidyPrather/game-prototypes`](https://github.com/CassidyPrather/game-prototypes)

Overflow is a pain:

```sh
pip install playwright && playwright install chromium
hugo --minify                                    # build ./public first
python tools/overflow.py check                   # exit 1 on any overflow
python tools/overflow.py -v check --widths 1380-1420:2
```

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
