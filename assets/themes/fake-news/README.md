# fake-news

A sub-theme of [`../wirenook/`](../wirenook/README.md) that prints a blog post
as the front page of a broadsheet. It keeps the wirenook page — the sky, the
clouds, the window frame, the topline chip, every breakpoint — and replaces
the prose panel inside it with a sheet of newsprint:

- **the sheet**, warm paper with a shadow under it in place of the light panel;
- **the type**, a system serif set small, leaded tight, justified and
  hyphenated, in columns sized so the count follows the width;
- **the furniture**, the parts a front page has and a blog post does not —
  nameplate, folio line, banner headline, deck, byline, and lead art with a
  caption under it;
- **the marks**, a drop cap and a small-capped opening line at the start of
  the story and an end mark at the finish of it.

Everything else is inherited. Where something here and something in wirenook
could both do the job, wirenook does it.

No webfonts. The site ships a display face and Atkinson Hyperlegible and
nothing with serifs, and a broadsheet is a serif or it is nothing, so the
stacks in `01-tokens.css` are system faces — Times first, which is a newspaper
face by descent, with the Liberation/Nimbus/DejaVu names Linux substitutes
behind it. A reader downloads nothing for this skin.

## Using it

Load the whole of wirenook first, then this, then put `theme-fake-news` on
`<body>`:

```html
<body class="page-body theme-fake-news">
```

Every rule is scoped to that class, so the sub-theme cannot reach a page that
has not asked for it. Files load in filename order, same as the parent:

| File | What it holds |
| --- | --- |
| `01-tokens.css` | the paper, the ink, the rules, the spot colour, the two stacks |
| `02-theme.css` | the sheet, the furniture, the lead art, the columns |

In this repo a post opts in through `theme` in its front matter; see
`layouts/blog/single.html`. The feed's card for the same post is dressed
separately and in the base theme, because `/blog/` is a wirenook page and
never loads this file — `.entry-fake-news` in `../wirenook/07-blog.css`.

## What the host page has to supply

**The markup.** A post body is whatever its Markdown renders to, so the
front-page furniture has to come from somewhere. In this repo that is two
shortcodes — `layouts/shortcodes/newsprint-head.html` and
`newsprint-photo.html` — and what they emit is this:

```html
<div class="post-body">
  <aside class="newsprint-slug">…</aside>

  <header class="newsprint-head">
    <p class="newsprint-nameplate">The Independent Tribunal</p>
    <p class="newsprint-motto">…</p>
    <p class="newsprint-folio"><span>…</span><span>…</span><span>…</span></p>
    <h2 class="newsprint-headline">…</h2>
    <p class="newsprint-deck">…</p>
    <p class="newsprint-byline">…</p>
  </header>

  <figure class="newsprint-figure">
    <div class="newsprint-plate"><img src="…" alt="…"></div>
    <figcaption class="newsprint-caption">…
      <span class="newsprint-credit">…</span>
    </figcaption>
  </figure>

  <p>The story, one paragraph per element.</p>
</div>
```

Every one of those blocks is optional; a page with none of them is a sheet of
newsprint with an article on it. Two structural rules, though, and both are
about being a *direct child* of `.post-body`:

- `.newsprint-slug`, `.newsprint-head` and `.newsprint-figure` span the
  columns, and `column-span` only works on a direct child of the multicol box;
- the drop cap and the small-capped opening line land on the first `<p>`
  child, which is why the three blocks above are an `aside`, a `header` and a
  `figure` rather than paragraphs.

For a picture inside a column rather than across the page, add
`newsprint-figure-column` to the figure. For the space where a picture will
go, swap the plate for the placeholder — it takes its shape from a custom
property, defaulting to 3 / 2:

```html
<div class="newsprint-plate newsprint-plate-empty"
     style="--newsprint-plate-ratio: 16 / 9" aria-hidden="true">
  <span class="newsprint-tk">Photo TK</span>
</div>
```

**Nothing else.** No fonts, no images, no script. The paper's tooth, the
halftone screen over the photograph and the cross rules in the placeholder are
all gradients.

## Contrast

The sheet is a light surface, which is what the base theme's own colours are
tuned for, so this skin is the easy direction: ink reads 16.3:1 on the paper
and the muted tier 8.1:1. The one value that had to move is the link hover —
wirenook's magenta lands at 3.4:1 on newsprint — and `02-theme.css` re-points
`--link-hover`, `--link-active` and `--focus-ring` on every surface this skin
owns. A new surface goes in that same selector list rather than restating the
colours somewhere else.

The photograph is greyed and screened, so a picture that carries meaning
through its colour needs its caption to carry that meaning too.

## Licence

AGPLv3, as the rest of the site.
