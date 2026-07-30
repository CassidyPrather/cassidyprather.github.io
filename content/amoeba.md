---
title: "Amoeba RL"
description: "7DRL 2021 — you are the blob"
author: "Cassidy Prather"
# /amoeba-rl/ is deploy target of the corresponding repo
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
    <span class="amoeba-stamp">7DRL 2021 · browser port · Rust + WebAssembly</span>
  </p>
</div>

Play as a giant, constantly evolving amoeba and fight off intensifying waves of humans trying to protect their cities. Craft new organelles and cores to respond to escalating threats. Can you destroy enough city gates to escape to the surface?

Post-post 7DRL patch (v4.0.0): It's on webasm now lol
Original game: <a href="https://vectis.itch.io/amoeba-roguelike">https://vectis.itch.io/amoeba-roguelike</a> (submission was to the 2021 [Seven Day Roguelike](https://7drl.com/) challenge)

## How to play

"GJ" is the hardest difficulty.

Arrow keys: Move
Space: Wait
A, D: Go to previous/next nucleus
Z: Organelle mode toggle
    Arrow keys (Organelle mode): Select organelle
X: Examine mode toggle
    Arrow keys (Examine mode): Move examine cursor
Destroy all city gates to win

### Tips

Stuck? Try reviewing the following information:

- When you move (not swap), you drag a path of organelles behind you. The highlighted slime shows which tiles will be dragged! This can be used to position organelles strategically and quickly.
- To learn what something is, e\[x\]amine it.
- Pressing space to pass a turn or luring enemies can break an otherwise impenetrable formation.
- In the early game, it is easy to find new base organelles but hard to find crafting materials. This inverts as time goes on.
- Find the right balance between combat, exploration, and organelle management for your play-style; all of these cost time and come with different risks and rewards.

## Credits

Original game and design by me. Extensive playtesting, design and support on the original from JackNine; further playtesting from Qu and Decinym. The tileset is libtcod's `terminal12x12_gs_ro.png`.

Source on [GitHub](https://github.com/CassidyPrather/amoeba_rl).
