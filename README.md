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
python tools/images.py check   # report drift, bad names, stray files
python tools/images.py fix     # strip + restamp anything non-compliant
```

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
