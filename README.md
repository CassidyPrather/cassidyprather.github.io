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

Overflow is a pain:

```sh
pip install playwright && playwright install chromium
hugo --minify                                    # build ./public first
python tools/overflow.py check                   # exit 1 on any overflow
python tools/overflow.py -v check --widths 1380-1420:2
```

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
