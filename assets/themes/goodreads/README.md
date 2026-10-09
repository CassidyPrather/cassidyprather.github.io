# goodreads

A sub-theme of [`../wirenook/`](../wirenook/README.md) that dresses a review
mirrored from Goodreads the way Goodreads prints it: the cover small on the
left, the title in a brown serif, "by" and the author, the orange stars and
Goodreads' phrase for the rating ("really liked it"), and the review under a
hairline in a reading serif, on cream. The page around it — sky, window,
topline — stays wirenook's.

One of three review skins, with [`../steam/`](../steam/README.md) and
[`../vndb/`](../vndb/README.md). All three are built the same way; the Steam
README has the details on how they are loaded and what they need.

| File | What it holds |
| --- | --- |
| `01-tokens.css` | the cream, the brown, the teal links, the star orange, the two stacks |
| `02-theme.css` | the box, the head, the review, the footer and its buttons |

## Spoilers

Goodreads only publishes reviews through a feed that removes spoiler-tagged
passages, so what reaches this site has the words `[spoilers removed]` where
each one was. `tools/reviews.py` swaps each for a "(view spoiler)" link back
to the review, which is the phrase Goodreads uses for its own toggle; this
theme sets the link small, as Goodreads does.

## Licence

AGPLv3, as the rest of the site. The colours are Goodreads'.
