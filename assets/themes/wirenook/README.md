# wirenook

The skin wirenook.net wears. Plain CSS in eight numbered files, meant to be
concatenated in filename order — the numbers are the load order, not
decoration. Later files re-point earlier ones at equal specificity, and
`09-responsive.css` is nothing but overrides, so shuffling them breaks the
cascade. There is no 08: it held the skins for a list of works the site no
longer has, and closing the gap would rename a file for nothing.

| File | What it holds |
| --- | --- |
| `01-tokens.css` | `:root` custom properties, `@font-face` |
| `02-base.css` | element defaults: `html`, `body`, links, focus rings |
| `03-backdrop.css` | `.page-shell` and the fixed decorative layers behind it |
| `04-shell.css` | banner, layout grid, link rail, the index-window frame |
| `05-widgets.css` | panels, socials, badges, the archive list, webring, death clock, footer |
| `06-pages.css` | licenses list, section intros, guestbook |
| `07-blog.css` | blog feed, post bodies, Markdown prose, code blocks |
| `09-responsive.css` | the breakpoints and `prefers-reduced-motion` |

`09-responsive.css` is the one file tied to this site's own markup in
particular, and it is still load-bearing for everything above it.

## Using it

```html
<link rel="stylesheet" href="wirenook/01-tokens.css">
<!-- ...through 07, then... -->
<link rel="stylesheet" href="wirenook/09-responsive.css">
```

or, better, concatenate them into one file at build time. Hugo:

```go-html-template
{{ $parts := sort (resources.Match "themes/wirenook/*.css") "Name" }}
{{ with resources.Concat "styles.css" $parts | minify | fingerprint }}
    <link rel="stylesheet" href="{{ .RelPermalink }}">
{{ end }}
```

## What the host page has to supply

**Fonts.** `01-tokens.css` loads five faces from `fonts/` *relative to the
served stylesheet*. Concatenating the theme to a file at the site root, as
above, means `/fonts/Unique.ttf` and `/fonts/AtkinsonHyperlegible-*.ttf`.
Serve them there or rewrite the four `@font-face` rules; every fallback stack
in the theme names a system face, so a missing webfont degrades rather than
breaking.

**`--cloud-backdrop`.** `03-backdrop.css` tiles the page's cloud wallpaper
from this property. It falls back to
`url("images/wirenook/volumetric-clouds.png")`, again relative to the
stylesheet, so mirroring that one image is enough. To point it at a smaller
derived image instead, set it before the theme loads:

```html
<style>:root { --cloud-backdrop: url("/clouds.webp"); }</style>
```

**Markup.** The theme styles classes, not a component library. The structural
ones are `.page-shell` (the outer wrapper, which owns the left gutter and
clips the decorative bleeds), `.site-header`, `.layout-grid`, `.index-window`
with a `.window-topline` inside it, and `.site-footer`. The decorative
backdrop layers — `.wave-field`, `.cloud-field`, `.sigil-lines`,
`.tick-rulers` — are empty `aria-hidden` elements; omit them and the page
still lays out.

**Scripts.** Three effects are inert without JS, and degrade quietly: the
cloud parallax reads a `--scrolly` counter off `<html>`, `.tick-rulers` is a
`<canvas>` something has to draw into, and the webring spinner and death
clock are driven entirely from script. See `assets/script.js` in this repo.

## Sub-themes

`../wirenook-vrchat/` and `../fake-news/` layer over this one. A sub-theme
loads *after* the whole of wirenook and scopes itself to a class on `<body>`,
so it can only reach the pages that opt in.

`../steam/`, `../goodreads/` and `../vndb/` do the same for reviews mirrored
from those sites, with one difference: each also dresses its review's card on
the blog feed, scoped to that card's class rather than to `<body>`, and the
feed links whichever it needs. The shape they all dress is here, in the
reviews section of `07-blog.css`.

`../merx/` is scoped the same way and is not one of them: it replaces this
theme rather than layering over it, for a page that is deliberately not
supposed to look like this site.

## Licence

AGPLv3, with the fonts under the SIL Open Font License 1.1 — see
[`/licenses/`](https://wirenook.net/licenses/).
