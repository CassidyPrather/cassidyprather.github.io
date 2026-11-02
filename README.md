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

The accounts are in `data/reviews.toml`. CI runs `check` weekly and reports how
far behind the committed posts are; it never pulls.

The games live in their own repo,
[`CassidyPrather/game-prototypes`](https://github.com/CassidyPrather/game-prototypes),
which deploys itself to [`/game-prototypes/`](https://wirenook.net/game-prototypes/)
on this domain. This repo only links there; the path is `params.games.url` in
`hugo.toml`. Each game gets a *reflection*: a blog post looking back on it.
Reflections are written here and only here — the game repo links to a game's
reflection and never keeps a copy, so this site is the source of truth for
them. The convention, which the game repo documents too:

- one post per game, at `content/blog/reflections/<slug>.md`, served at
  `/blog/reflections/<slug>/`
- front matter `game: <slug>` and `tags: ["reflection"]`
- slugs: `leitmotif`, `sand-nomad`, `space-trucking`, `kitchen-garden`, `amoeba`

```sh
hugo new content blog/reflections/leitmotif.md   # a draft, with game and tags filled in
```

`archetypes/blog.md` does that for anything created under `reflections/`.
A post with `game` set links to the games from under its date, and every
reflection collects on [`/blog/tags/reflection/`](https://wirenook.net/blog/tags/reflection/).
Don't give `reflections/` an `_index.md`: that would make it a section of its
own, and its posts would drop out of the blog feed and its search index.

Overflow is a pain:

```sh
pip install playwright && playwright install chromium
hugo --minify                                    # build ./public first
python tools/overflow.py check                   # exit 1 on any overflow
python tools/overflow.py -v check --widths 1380-1420:2
```

[`/licenses/`](https://wirenook.net/licenses/) / [`LICENSE`](./LICENSE).
