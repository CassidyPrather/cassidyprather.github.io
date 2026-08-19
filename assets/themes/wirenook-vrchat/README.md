# wirenook-vrchat

A sub-theme of [`../wirenook/`](../wirenook/README.md) for the VRChat pages.
It keeps the wirenook page — the sky, the clouds, the frame, every
breakpoint — and brings three things across from VRChat's interface:

- **the banner down the left gutter**, where wirenook's sparkle field is
  replaced by VRChat's diagonal line art;
- **the typeface**, VRChat's own stack with their icon font in front of it;
- **the panels**, VRChat's rounded dark cards, as `.contentBubble`.

Everything else is inherited. When something here and something in wirenook
could both do the job, wirenook does it.

The panels are named one by one rather than matched by shape, so the skin
covers exactly what it knows about: the VRChat pages' `.contentBubble`s and
VPM listing, and — because the blog post about VRChat may as well wear it —
wirenook's own `.post-body` and `.post-meta`. In this repo a post opts in
through `theme` in its front matter; see `layouts/blog/single.html`.

## Using it

Load the whole of wirenook first, then this, then put
`theme-wirenook-vrchat` on `<body>`:

```html
<body class="page-body theme-wirenook-vrchat">
```

Every rule is scoped to that class, so the sub-theme cannot reach a page
that has not asked for it. Files load in filename order, same as the parent:

| File | What it holds |
| --- | --- |
| `01-tokens.css` | VRChat's palette, the font stack, the `VRCCustom` face |
| `02-theme.css` | the gutter banner, the panels, the VPM listing, a blog post |
| `optional/glitch.css` | glitch text; not loaded, not concatenated |

## What the host page has to supply

**The line art.** `02-theme.css` masks the gutter with
`images/no-relicensing/vrchat-background-lines.svg`, resolved relative to the
served stylesheet. A consumer that does not mirror that file gets an empty
gutter and a page that is otherwise intact.

**The icon font** is fetched from VRChat's CDN and is restricted to
`U+E000-E0FF`, so it downloads only on a page that actually renders one of
their trust-rank or status glyphs. Drop the `@font-face` block if a
third-party request is unwanted; the rest of the stack is system faces.

**`vpm-listing.js`**, if the VPM listing is wanted — see
`assets/vpm-listing.js` in this repo. The classes it fills in
(`.vpm-listing` and everything under it) are styled here whatever renders
them.

## Contrast

The panels are dark cards on a light page, which is the one place a sub-theme
can quietly break the parent: wirenook resolves link and focus colours
against whichever surface holds them, and its defaults are tuned for light
panels. Every dark surface here re-points `--link-hover`, `--link-active`
and `--focus-ring` for that reason. A new panel needs the same treatment —
add it to the shared selector list in `02-theme.css` rather than styling it
alone.

## Licence

AGPLv3, as the rest of the site. The line art and the VRChat palette are
VRChat's; wirenook is unaffiliated with VRChat.
