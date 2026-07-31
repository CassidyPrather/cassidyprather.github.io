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

## The cohost archive

`content/blog/cohost/` is the backfill of Cassidy's [cohost](https://cohost.org/)
posts, 2022–2024, imported from her data export after the site shut down. They
are ordinary blog entries — they appear in the feed, the RSS, and the search
index with everything else — but each one carries `type: cohost`, which is how
Hugo picks `layouts/cohost/` for it. That directory has a `baseof.html` of its
own, so those pages replace the wirenook shell outright: cohost's top bar,
cohost's post boxes, `assets/cohost.css` instead of `assets/styles.css`.
`/cohost/` (`content/cohost.md`) is the profile page they hang off.

Nothing in the chrome is decorative. cohost has been dark since the end of
2024, so every control points at whatever does its job now — the logo and nav
come home, comments and the like button go to the guestbook, "follow" is the
blog's RSS feed, tags run the blog's own search, and the one link that really
does want cohost goes by way of the Internet Archive.

Two things about the imported markdown are worth knowing before editing it:

- **Hard line breaks are deliberate.** cohost rendered a single newline as
  `<br>`; Goldmark collapses it. Every line that continues a paragraph
  therefore ends in a backslash, which is CommonMark's hard break. Dropping
  one reflows a poem.
- **Some raw HTML spans blocks.** cohost rendered each block separately and
  concatenated the results, so a `<details>` can open in one paragraph and
  close several paragraphs later. That is why `<!--more-->` sits where it does
  in `reading-poetry.md` and `pathologic-is-the-best-video-game-ever.md`:
  folding inside one of those regions would put unclosed markup in the feed
  summary.

The staged media is described in
[`static/images/no-relicensing/cohost/`](static/images/no-relicensing/README.md)
— unlike the rest of that tier it is downscaled rather than byte-identical, and
that README says why.

Overflow is a pain:

```sh
pip install playwright && playwright install chromium
hugo --minify                                    # build ./public first
python tools/overflow.py check                   # exit 1 on any overflow
python tools/overflow.py -v check --widths 1380-1420:2
```

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
