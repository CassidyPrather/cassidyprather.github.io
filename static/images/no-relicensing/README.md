# No relicensing

These aren't mine, no license granted. The `archive/` subdirectory holds files
pulled from other tiers over an unresolved licensing question; they stay out of
the galleries until sorted.

| File                       | Source                                                                   |
| -------------------------- | ------------------------------------------------------------------------ |
| `agplv3-155x51.png`        | [gnu.org license logos](https://www.gnu.org/graphics/license-logos.html) |
| `corru.observer-88x31.gif` | [corru.observer](https://corru.observer/)                                |
| `neocities.png`            | [Neocities](https://neocities.org/)                                      |
| `thegorkhonarchives.net-88x31.png` | [The Gorkhon Archives](https://thegorkhonarchives.net/)          |
| `vrchat-background-lines.svg` | [VRChat](https://hello.vrchat.com/)                                         |
| `cohost-88x31.png`         | [cohost](https://en.wikipedia.org/wiki/Cohost), by [anti software software club](https://antisoftware.club/) |
| `slide-shield.png`         | Screenshot taken in [VRChat](https://hello.vrchat.com/)                  |
| `slide-earmuff.png`        | Screenshot taken in [VRChat](https://hello.vrchat.com/)                  |
| `slide-culling-performance.png` | Screenshot taken in [VRChat](https://hello.vrchat.com/)             |

## `cohost/`

The media from Cassidy's cohost data export, staged for the archive under
[`/cohost/`](https://wirenook.net/cohost/) and `content/blog/cohost/`. cohost
itself closed at the end of 2024; eggbug and the site's own art belong to
[anti software software club](https://antisoftware.club/), and the avatars
belong to the people they picture.

Unlike the rest of this tier these are *not* byte-identical to what cohost
served. The export ships nine 2560x1440 VRChat captures at 5-6 MB each — 47 MB
of PNG, five times the whole image library — and `static/` is published
verbatim, so all of it would go out on every deploy. The continuous-tone files
are therefore downscaled to 1920px and encoded as WebP q88 (1.8 MB for the
set), which `layouts/shortcodes/co-image.html` resizes again to the post
column. The UI screenshots stay PNG, where lossy chroma would smear the text.
The untouched originals live in Cassidy's export zip, which is the archive of
record. `tools/images.py` neither stamps nor recompresses anything in this
tier, so re-running it will not undo that.

| File                        | Source                                                              |
| --------------------------- | ------------------------------------------------------------------- |
| `eggbug*.png`               | cohost's built-in emoji, by [anti software software club](https://antisoftware.club/) |
| `cass-avatar.png`, `cass-header.webp` | @CassidyCo's own profile art                              |
| `root-avatar.jpg`, `mtrc-avatar.gif`, `trashbang-avatar.jpg`, `swordbroken-avatar.png` | Avatars of the people whose posts she shared |
| `vyre-koshiro-*.webp`, `vket-*.webp`, `strange-pear-gallery.webp` | Screenshots taken in [VRChat](https://hello.vrchat.com/) |
| `those-close-banner.webp`   | World banner for [Those Close](https://vrclist.com/world/306545)    |
| `threads-suspension.png`, `reol-discord.png`, `discord-conversation.png` | Screenshots of Threads and Discord         |
| `chimpanzee-typewriter.jpg` | [Wikimedia Commons](https://en.wikipedia.org/wiki/Infinite_monkey_theorem#/media/File:Chimpanzee_seated_at_typewriter.jpg) |
