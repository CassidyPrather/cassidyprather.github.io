---
title: "Amoeba RL"
description: "7DRL 2021 — you are the blob"
author: "Cassidy Prather"
# /amoeba/, not /amoeba-rl/: the game bundle's intended home on this domain is
# /amoeba-rl/ (see docs/DEPLOYING.md in the game's repo), and a page rendered
# to the same path would collide with the static files once they land here.
type: amoeba
---

<div class="amoeba-console">
  <pre class="amoeba-map" aria-hidden="true"><span class="w">##############################</span>
<span class="w">#</span><span class="f">....</span><span class="i">%</span><span class="f">......</span><span class="w">#</span><span class="f">................</span><span class="w">#</span>
<span class="w">#</span><span class="f">...</span><span class="o">   </span><span class="n">@</span><span class="o"> </span><span class="f">...</span><span class="w">#</span><span class="f">.......</span><span class="h">m</span><span class="f">........</span><span class="w">#</span>
<span class="w">#</span><span class="f">..</span><span class="o">       </span><span class="f">..</span><span class="w">#</span><span class="f">................</span><span class="w">#</span>
<span class="w">#</span><span class="f">...</span><span class="o">  </span><span class="n">@</span><span class="o">   </span><span class="f">..</span><span class="w">#</span><span class="f">....</span><span class="i">%</span><span class="f">.......</span><span class="c">C</span><span class="f">...</span><span class="w">#</span>
<span class="w">#</span><span class="f">....</span><span class="o">   </span><span class="f">....</span><span class="w">##########</span><span class="f">.......</span><span class="w">#</span>
<span class="w">#</span><span class="f">.....</span><span class="r">$</span><span class="f">.....</span><span class="w">#</span><span class="f">........</span><span class="w">#</span><span class="f">...</span><span class="h">m</span><span class="f">...</span><span class="w">#</span>
<span class="w">#</span><span class="f">...........</span><span class="w">#</span><span class="f">........</span><span class="w">#</span><span class="f">.......</span><span class="w">#</span>
<span class="w">##############################</span></pre>

  <!-- The chips are hidden from assistive tech: read aloud they are a string
       of punctuation names, and the label beside each one is the whole point.
       &nbsp; in the first, not a plain space — cytoplasm has no glyph of its
       own, and the minifier collapses a whitespace-only span away to nothing. -->
  <ul class="amoeba-legend">
    <li><span class="glyph o" aria-hidden="true">&nbsp;</span> cytoplasm</li>
    <li><span class="glyph n" aria-hidden="true">@</span> nucleus</li>
    <li><span class="glyph i" aria-hidden="true">%</span> nutrient</li>
    <li><span class="glyph r" aria-hidden="true">$</span> material</li>
    <li><span class="glyph h" aria-hidden="true">m</span> militia</li>
    <li><span class="glyph c" aria-hidden="true">C</span> city gate</li>
  </ul>

  <p class="amoeba-launch">
    <a class="amoeba-play" href="https://wirenook.net/amoeba_rl/">Play in the browser</a>
    <span class="amoeba-stamp">7DRL 2021 · Rust + WebAssembly · AGPL-3.0</span>
  </p>
</div>

Play as a giant, constantly evolving amoeba and fight off intensifying waves of
humans trying to protect their cities. Engulf and digest them, craft new
organelles and cores from their remains, and destroy the city gates to escape to
the surface.

Built in a week for the 2021 [Seven Day Roguelike](https://7drl.com/) challenge
and submitted as Vectis, originally in C# on RogueSharp and RLNET. It has since
been rewritten in Rust: the game proper is a deterministic, unit-tested library,
and the frontend is a thin shell that draws it with the original's CP437
tileset. The same build runs natively and in a browser tab.

## How to play

Destroy the required number of city gates (`C`) by walking into them with enough
mass. You lose when your last nucleus dies.

Moving — as opposed to swapping — drags a path of organelles along behind you,
and the highlighted slime shows which tiles are coming with you. Enemies sealed
in with no walkable escape are engulfed and digested. Crafting materials upgrade
whatever organelles sit next to them, or the nucleus you swap with.

| Key | Action |
|---|---|
| Arrows | Move / steer the cursor or sidebar |
| Space or `.` | Wait |
| `A` / `D` | Previous / next nucleus |
| `Z` | Organelle browser |
| `X` | Examine mode |
| `Q` / `E` | Page the sidebar |
| `F1` | Help |
| `M` | Mute |
| `R` | Restart, once the run has ended |

Normal, Easy and GJ difficulty are picked on the title screen. On a phone you
get an on-screen pad and buttons: a tap next to the active nucleus moves it, and
a tap in examine mode sends the cursor there.

## Credits

Original game and design by me. Extensive playtesting, design and support on the
original from JackNine; further playtesting from Qu and Decinym. The tileset is
libtcod's `terminal12x12_gs_ro.png`.

Source is on [GitHub](https://github.com/CassidyPrather/amoeba_rl), under
AGPL-3.0-or-later.
