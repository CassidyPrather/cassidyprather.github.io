# steam

A sub-theme of [`../wirenook/`](../wirenook/README.md) that dresses a review
mirrored from Steam the way Steam prints it: the game's capsule art, a dark
vote bar with the thumb, the verdict and the hours, and the review in
steel-blue text on navy. The page around it — sky, window, topline — stays
wirenook's.

One of three review skins, with [`../goodreads/`](../goodreads/README.md) and
[`../vndb/`](../vndb/README.md). All three are built the same way.

## Using it

Load the whole of wirenook first, then this. It dresses two things:

- **a review's own page**, with `theme-steam` on `<body>`. In this repo that is
  `theme: "steam"` in the post's front matter, which `tools/reviews.py` writes
  and `layouts/review/single.html` reads.
- **its card on the blog feed**, `.blog-entry.entry-steam`.
  `layouts/blog/list.html` links this file only when a Steam card on the page
  will wear it — not for one inside the cohost era, which wears the era.

Unlike the other sub-themes, the feed card is dressed here rather than in the
base theme. A review skin exists to look like one other site, and keeping the
page and the card in one file keeps them looking like the same one.

| File | What it holds |
| --- | --- |
| `01-tokens.css` | the navy, the steel blues, the bright blue, the thumb-down orange |
| `02-theme.css` | the box, the vote bar, the review, the footer and its buttons |

## What the host page has to supply

The markup in `layouts/partials/review/` — `.review-head` with an optional
`.review-cover`, a `.review-heading` holding the title and the
`.review-verdict`, then the review body — and the base theme's shape for it,
in the reviews section of `../wirenook/07-blog.css`. No fonts, no images: the
thumb is inline SVG and the art is the game's own, hotlinked.

## Contrast

Every text colour is measured against the box in `01-tokens.css`. The one
value moved from Steam's own is the hover fill on the footer buttons, which
Steam takes to a bright blue that white text reads at 2.1:1 on.

## Licence

AGPLv3, as the rest of the site. The colours are Steam's.
