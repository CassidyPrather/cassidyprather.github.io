---
title: "Lazuli (Aether)"
description: "Old nostalgic Lazuli character sheet for Aether Chronicles"
author: "Cassidy Prather"
type: vrchat
build:
  list: never
---

<script>
  const bloodTypes = [
    { type: "A+", weight: 35 },
    { type: "A-", weight: 6 },
    { type: "B+", weight: 25 },
    { type: "B-", weight: 3 },
    { type: "AB+", weight: 4 },
    { type: "AB-", weight: 1 },
    { type: "O+", weight: 25 },
    { type: "O-", weight: 6 }
  ];

  function pickBloodType() {
    const totalWeight = bloodTypes.reduce((acc, bloodType) => acc + bloodType.weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (let i = 0; i < bloodTypes.length; i++) {
      if (randomNum < bloodTypes[i].weight) {
        document.getElementById("result").innerText = "Random Blood Type: " + bloodTypes[i].type;
        return;
      }
      randomNum -= bloodTypes[i].weight;
    }
  }
</script>

<div class="contentBubble">
  <h1>Lazuli Calliope (Aether)</h1>
</div>
<div class="contentBubble">
  <img class="HorizontalImage" src="../images/no-relicensing/archive/extra-art.png"/>
</div>
<div class="contentBubble">
  <p>Hey there! Been a minute, hasn't it? Wild that anyone still has a link to this webpage.</p>
  <p>This is all really old, out of date information. Right now (2025-08-01), I'm only keeping track of <a href="https://docs.google.com/spreadsheets/d/1EM3F_hE9FJaHlNv3JMvZLk9Dde8y4_u26KzTVqJ74Jk/edit?usp=sharing">Lazuli's Inventory.</a> That still contains pretty much all you need to know about her.</p>
</div>
<div class="contentBubble">
  <h2>Notes</h2>
  <ul style="text-align: left">
    <li>1st circle magic maximum</li>
    <li>Spellcasts = Injuries:<ul>
      <li>Minor injury: 1 circle</li>
      <li>Major injury: 3 circles</li>
    </ul></li>
    <li><s>When casting with her right hand, once per day, cast at adept level (4th circle maximum).</s> Haha, she doesn't even have that arm anymore!</li>
    <li>O- blood</li>
  </ul>
  <button onclick="pickBloodType()">Weighted random blood type generator :)</button>
  <p id="result"></p>
  <p>152cm 45kg female human (not counting the arm)</p>
  <h2><a href="https://docs.google.com/spreadsheets/d/1EM3F_hE9FJaHlNv3JMvZLk9Dde8y4_u26KzTVqJ74Jk/edit?usp=sharing">Inventory</a></h2>
  <!--<li>Dr. Fester's Diagnostic Kit: 1/day, identify disease.<span style="font-size:0.5em;">Wait, isn't this supposed to be at the healer's guild?</span></li>-->
  <h3>Attuned Magic Items</h3>
  <ul style="text-align: left">
    <s><li>Soul Saber: <i>(AndreiRathias)</i>
      <ul>
        <li>Physical mode: Cuts through inorganic (up to hardened steel) like knife through butter. Phases through inorganic.</li>
        <li>Ghost mode: The opposite</li>
        <li>Mode swap requires concentration, blade in air.</li>
      </ul>
    </li></s>
    <p>That got stolen! Emi has it now.</p>
    <li>Glasses: <i>(Classic)</i>
    <ul>
      <li>Affinity Sight</li>
      <li>Enables reaction spell: Negate affinity clash</li>
    </ul>
    <p><i>She actually lost her old pair. She's borrowing Julian's now.</i></p>
    <li>Cloak of Protection: Non-tearing Kevlar <i>(PeakBoat)</i>
    </li>
  </ul>
</div>
<div class="contentBubble">
  <h2>Credit</h2>
  <span style="text-align: left">
    <p>Icons:</p>
    <ul>
      <li>Game Icons<i>For full list, see: <a href="https://game-icons.net/">https://game-icons.net/</a></i> Lorc and Delapouite under CC BY 3.0</li>
      <li>Affinities: Lt. Dan</li>
      <li>Monstrous syringe: Dead by Daylight</li>
      <li>Brand, trim, backgrund: <a href="https://bsky.app/profile/pixel20012.bsky.social">Pixel</a> | https://x.com/pixel20012<br/></li>
      <li>Art: Wryyto, Feldor55, Nilphoenix</li>
      <li>Model edits and assembly: Cor Vous https://linktr.ee/corvous</li>
      <li>Base: Manuka by STUDIO JINGO https://booth.pm/en/items/5058077</li>
      <li>Hair: Rom Hair by SweetCloud_3D https://booth.pm/en/items/5377746</li>
      <li>Outfit: Diplomat of the Abyss by Cyber Critter https://booth.pm/en/items/5167716</li>
      <li>Outfit: Haruspex's Outfit from Pathologic 2, rigged for Manuka by RheploidSham</li>
      <li>Weapon system: Two Handed Weapon System by Liindy https://jinxxy.com/Liindy/TwoHandedWeaponSystem</li>
      <li><a href="https://skfb.ly/6xrpn">"Saw Cleaver | Bloodborne"</a> by vishnevsky.yaroslav is licensed under <a href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial</a>.</li>
      <li><a href="https://rytshop.booth.pm/items/3740338">Elessar</a> by Zorra Arce</li>
      <li><a href="https://payhip.com/b/7Jn1c">Hydro-bending</a> by GM</li>
      <li>Lantern system: Liindy</li>
    </ul>
    <p>I use more stuff now, so that's probably not a complete list.</p>
  </span>
</div>
<div class="contentBubble">
  <p>Last updated 2025-08-01</p>
</div>
