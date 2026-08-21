---
title: "Rapid prototyping is cool"
date: 2026-08-21T17:10:00-07:00
---

I hit a really interesting design epiphany while working on
Space Trucking (one of [Cor's](https://cor.gg/) dream games).
I had been working in a very conventional way concerning progression:
It's fun to start out with very few things,
and then gradually work up to many things!

... Right?

<!--more-->

Well it turns out the first leg of the game **sucks**,
and nothing about the design as written will fix that.
There is no way to sugar-coat it:
If you're going to trap somebody in a tiny room for an hour with nothing to do,
the game just sucks.
Now, Space Trucking isn't *always* about giving you something to do...
It's main design purpose is to be a better idle-game world than similar titles,
and it needs to be unobtrusive so it doesn't impair your ability to just 
hang out with your friends.
But to the extent that it's *not* that,
it should still be good.
What a rancid dual mandate!

Anyway, after much pondering about how to mitigate this suck-i-ness,
I realized I was designing for a constraint
that was doing more harm than good:
The player must start out with few things, and then get many things!

But as it turns out, any purpose that serves
could **also** be served numerous other ways
that *don't* require the first leg of the game to be empty.

Fill the cargo hold with a bunch of cheap, random items.
When you're playing with your friends, that immediately gives you things
to organize and shuffle around,
while also not *requiring* you to do it,
and- since I can set the market of things however I please-
leave plenty to change as the game goes on.
The example I used in my notes was couch colors-
if Alice really wants a red couch, but spawned with a green one,
but Bob has a red armchair they think is ugly,
there's *something* there of a social nature to dig my claws into
and try to make fun.

![Cluttered standard Stardew Valley farm plot](/images/no-relicensing/standard-farm.png)

*See how Stardew Valley filling the starting map with junk improves the game?*

Anyway, this is just an example of one of many changes made to the prototype
in this early phase.
It's the nice thing about having a flexible prototype you can move fast in:
Issues like these arise very early and are easy to fix!
If I had started implementing this in Unity,
I would have gone mad from the tedious boredom
of clawing through all the udon scripts, networking guarantees, and mechanics
to try and get something sorted out...
But instead, I can do it basically for free!

I've been using [Bevy](https://bevy.org/) to prototype the game.
While I am not confident that the leadership of the project is managed right,
that's not exactly unheard of for open source repositories.
What's *really* important is that it's free and open source,
so if there are any glaring issues causing me pain,
I can just fix them myself
(and I suspect as a side effect, it's an engine free of many painful issues).

It also helps that it's very easy for version control software and AI
to work in the context of Rust
without all the engine overhead and UX bloat it brings.

I might write more about Space Trucking's development in the long run,
when I have more of a benefit of hindsight,
but this cool property of the workflow was just too awesome not to share.
