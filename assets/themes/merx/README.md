# merx

The skin of one page: the notice a fictional agency leaves on a domain it has
seized, at the end of the short story ["Moloch"](https://wirenook.net/blog/moloch/).

Not a sub-theme. `../wirenook-vrchat/` and `../fake-news/` layer over
[`../wirenook/`](../wirenook/README.md) and keep the site's page underneath
them; this one replaces it, because the whole point of the page is that it
does not look like it came from this site. Nothing here is a wirenook value:
no sky, no clouds, no Unique, no Atkinson. It is still scoped to a class on
`<body>`, for the same reason the sub-themes are — a stylesheet that can only
reach the page that asked for it cannot leak into one that did not.

| File | What it holds |
| --- | --- |
| `01-tokens.css` | the field, the ink, the one warm colour, the two stacks |
| `02-notice.css` | the crest, the headline block, the statute, the docket |

## Using it

Load this alone — not after wirenook — and put `merx-notice` on `<body>`:

```html
<body class="merx-notice">
  <main class="merx-sheet">
    <div class="merx-crest"><img class="merx-seal" src="…" alt=""></div>
    <p class="merx-agency">…</p>
    <h1 class="merx-band">This domain name has been seized</h1>
    <div class="merx-statute"><p>…</p></div>
    <dl class="merx-docket">
      <dt>Docket</dt><dd>…</dd>
    </dl>
    <p class="merx-postscript">…</p>
    <p class="merx-return">…<a href="…">…</a>…</p>
  </main>
</body>
```

`layouts/_default/paracausal.html` is the only caller in this repo, and it fills those
strings from the page's front matter.

## What the host page has to supply

**The seal.** Any square mark will do; this repo's is black line art on white,
which `02-notice.css` inverts and screens over the field so the plate it was
drawn on disappears. Two things follow from that. A mark that is already light
on dark wants neither the filter nor the blend. And a blend only composites
with what is painted beneath it *inside the same stacking context*, which is
why `.merx-crest` paints the page colour itself rather than letting the page's
show through — see the note above that rule before moving the background off
it.

**Nothing else.** System faces, one image, no script.

## Contrast

Every value in `01-tokens.css` is measured against the field: text 14.4:1,
the muted tier 7.2:1, the agency line and the docket's labels 9.1:1. The
hairline colour is the one thing here that does not clear anything, and
nothing is ever set in it.

The page's last line is the way back out of the fiction, and it is the one
place where quiet must not turn into invisible: it is small and it is at the
bottom, but it is set at the muted tier like everything else.

## Licence

AGPLv3, as the rest of the site. The MERX mark itself is
`static/images/no-relicensing/merx-design.png`, under that directory's terms.
