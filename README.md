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

The feed on `/blog/` gets there gradually rather than all at once. Each entry
carries a `--drift` between 0 and 1 — 0 for a post written here, climbing to 1
across the first `blog.archiveFade` posts of the archive (8, in `hugo.toml`) —
and `assets/blog-drift.css` interpolates the card against it: cyan panel to
white post box, square to rounded, flat to shadowed, Unique to Atkinson.
`layouts/partials/blog/drift.html` works the numbers out. Scrolling into 2024
should feel like the page changing its mind about what it is, so that opening
one of these and landing in cohost's skin is the end of a slide rather than a
surprise.

The page around the cards follows them. `.index-window`'s stripes, the
highlights rail, the intro panel, the sky and all five cloud layers drift
against a second number, `--page-drift` on `<html>`, which `script.js` keeps as
the overlap-weighted mean drift of whatever entries are on screen — so the room
agrees with what the reader is actually looking at rather than with raw scroll
distance. Two things there are load-bearing. The sky is repainted by a single
fixed sheet on `.page-shell::after`: every backdrop layer sits at `z-index: -1`
or below and `::after` generates last among its siblings, so one rule covers the
lot without any of them needing a drift-aware opacity of its own. And
`.index-window::before` is inset by `-5px` rather than `0`, because `inset`
resolves against the padding box while a background paints under its own border
— at `0` the stripes show through the faded 5px double border as two ruled lines
down each side of the window.

That is the only JavaScript involved, and it is not required: with it off the
cards still drift and the page simply stays wirenook.

That stylesheet is the entire cost of the effect, and `layouts/blog/list.html`
only links it when the page it is building actually renders an archive-era
entry. This matters once the feed paginates: page one will be recent posts
only, and it will ship none of it — no stylesheet, no inline custom properties.
The partial is where that decision is made, and its header comment says what to
change to turn pagination on (one line: point `$shown` at `.Paginator.Pages`).
Two things to leave alone if you touch it — call the partial with `partial` and
not `partialCached`, since every pager page renders from the same `Page` and a
cache keyed on it would hand page two page one's numbers; and keep every rule
in `blog-drift.css` a re-pointing of something `styles.css` has already set, so
a browser without `color-mix()` drops them and gets the ordinary feed.

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

It measures every page at every width in the sweep, which takes minutes, so
it spreads the pages over one worker per two cores — `--jobs 1` to get a
serial run back. CI goes further and splits the pages across four runners
with `--shard i/n`, each writing `--json` that a final `report` merges; the
merge exists because the stale-allowlist check cannot tell "nothing matches
this entry" from "not my pages" until it has seen all of them.

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
