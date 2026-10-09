# vndb

A sub-theme of [`../wirenook/`](../wirenook/README.md) that dresses a review
mirrored from VNDB the way VNDB's default skin prints it: a flat navy box with
a hairline blue border on black, small Tahoma text, the title in Futura, the
vote picked out in red. The page around it — sky, window, topline — stays
wirenook's.

One of three review skins, with [`../steam/`](../steam/README.md) and
[`../goodreads/`](../goodreads/README.md). All three are built the same way;
the Steam README has the details on how they are loaded and what they need.

| File | What it holds |
| --- | --- |
| `01-tokens.css` | VNDB's custom properties, prefixed, two of them lifted for contrast |
| `02-theme.css` | the box, the head, the review, the footer and its tabs |

## Contrast

VNDB's heading blue and small-print blue measure 2.4:1 and 3.8:1 on its own
box. Both are lifted here, keeping the hue; `01-tokens.css` has the numbers.
The borders keep the original #258.

## Cover art

VNDB rates every cover on how sexual and how violent it is, by user vote.
`tools/reviews.py` only keeps a cover that VNDB itself would call safe on
both; anything else is left off and the review shows without one.

## Licence

AGPLv3, as the rest of the site. The colours are VNDB's.
