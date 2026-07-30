# cass-website

Cassidy Prather's personal website.

https://wirenook.net/

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

`check` fails on any managed PNG deeper than 8 bits per channel. The art tools
export 16-bit RGBA whose own sBIT chunk declares 8 significant bits, so the top
half of every sample is a copy of the bottom half — `optimize` narrows that back
down, which is pixel-exact, and re-runs `fix` afterwards because recompression
strips the XMP tags along with everything else. `no-relicensing/` is never
touched by either.

Pages ship right-sized art via `layouts/partials/responsive-image.html`, which
resizes the full-resolution masters under `static/images/` through Hugo's image
pipeline. Read its header comment before adding a call: whether an image wants
WebP or PNG there depends on its content, and getting it backwards costs bytes
or edges.

Overflow is a pain:

```sh
pip install playwright && playwright install chromium
hugo --minify                                    # build ./public first
python tools/overflow.py check                   # exit 1 on any overflow
python tools/overflow.py -v check --widths 1380-1420:2
```

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
