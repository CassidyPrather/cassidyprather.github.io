# wirenook

The skin wirenook.net wears. Plain CSS in nine numbered files, meant to be
concatenated in filename order — the numbers are the load order, not
decoration. Later files re-point earlier ones at equal specificity, and
`09-responsive.css` is nothing but overrides, so shuffling them breaks the
cascade.

| File | What it holds |
| --- | --- |
| `01-tokens.css` | `:root` custom properties, `@font-face` |
| `02-base.css` | element defaults: `html`, `body`, links, focus rings |
| `03-backdrop.css` | `.page-shell` and the fixed decorative layers behind it |
| `04-shell.css` | banner, layout grid, link rail, the index-window frame |
| `05-widgets.css` | panels, socials, badges, webring, death clock, footer |
| `06-pages.css` | licenses/archive lists, galleries, press-kit notes, guestbook |
| `07-blog.css` | blog feed, post bodies, Markdown prose, code blocks |
| `08-works.css` | per-work card skins (Amoeba, Space Trucking) |
| `09-responsive.css` | the breakpoints and `prefers-reduced-motion` |

Files 08 and 09 are the only ones tied to this site in particular, and 09 is
still load-bearing for everything above it. A consumer that wants the shell
without the Works cards can drop 08 and keep the rest.

## Using it

```html
<link rel="stylesheet" href="wirenook/01-tokens.css">
<!-- ...through... -->
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

`../wirenook-vrchat/` layers over this one. A sub-theme loads *after* the
whole of wirenook and scopes itself to a class on `<body>`, so it can only
reach the pages that opt in.

## Licence

AGPLv3, with the fonts under the SIL Open Font License 1.1 — see
[`/licenses/`](https://wirenook.net/licenses/).
