---
title: "VRChat Development Stack: August 2026"
date: 2026-08-18T23:50:00-07:00
highlight: true
theme: "wirenook-vrchat"
---

It's been a **crazy** year so far.
Technology has moved so fast in every way of life,
both inside and outside the context of VRChat content creation.
Me, personally?
I'm at a unique point in my life
where I'm used to adapting to new, hostile development environments
(I have to wrap around the MathWorks ecosystem, for goodness sake),
and I'm now better equipped to tackle the challenges that come with that.
Well...
Maybe "better equipped" isn't the *right* term,
but I'm certainly more opinionated!
And now, I'm going to apply that knowledge
to try to come up with the most idiomatic VRChat development process ever!

<!--more-->

This is going to be expressed mostly through the context of Avatar creation,
but I'll touch on world authorship (and Udon) briefly.

## High-Level Tools

[VRCX](https://github.com/vrcx-team/VRCX/) is an absolutely essential
tool for any VRChat player, I feel. It saves so much good data and makes things
like finding old world links and tracing photos to places so much easier!
It's wild that it markets itself as a "Friendship management" tool,
since it does so much more...
But hey, anyway, it's basically the gold standard
for interfacing with VRChat's API,
auto-launching applications,
and stuff like that.
I also won't complain about MIT licensing!
Oh, and I just learned about [VRCX-0](https://github.com/Map1en/VRCX-0),
this is sick as heck.

[vrc-get](https://github.com/vrc-get/vrc-get/) is also truly incredible.
The VRChat Creator Companion is truly a leaky boat pile of garbage,
and since it's the official (read: closed source) option
I kind of just have to suck it up and deal with any issues.
Using vrc-get seems like a good way to at least own any issues that arise
so I can like, fix them and stuff.
I have only really ever heard to other people refer to it as "Alcom"
for some reason or another.

[CATS](https://github.com/teamneoneko/Cats-Blender-Plugin) is very useful
when working in blender.
However, it appears- wait, what?!
This just in, at the time of writing this blog post, [**it's been shut down**](https://github.com/teamneoneko/Cats-Blender-Plugin/blob/0568e72557ac3c0921d54ed768ee099295c3d58b/README.md).
Yup, as of Februrary this year. WILD.
Dude, CATS is just a cursed project.
I'm sure there's an active fork out there **somewhere,**
but again,
troubled waters.
Praise be unto the Blender ecosystem...

## Components

You can't really FOSS-max while developing for VRChat,
but you can sure try your hardest!
In that sense, there's quite a few common land-mines:

- GoGoLoco provides all sorts of things while having a rancid, vain license
- Poiyomi, despite unfortunately having been adopted as the gold standard,
  is this weird ugly amalgamation with a paywall behind upcoming features.
- VRCFury uses a [weird custom license](https://github.com/VRCFury/VRCFury/blob/main/LICENSE.md)
  that makes it basically unusuable for me.
  Like, it's *so crazy strict* on so many stupid things!
  For the longest time, I was a big fan of VRCFury
  until I learned about *this mess* behind the scenes.
  <span class="prose-aside"><label class="prose-aside-marker"><input type="checkbox">note</label><span class="prose-aside-note">
  What do you **mean** "neither Unity nor the VRCSDK are GPL-compatible"???
  May I present to you:
  > GPLv3 §7
  > As a special exception, the copyright holders give permission to link this Program with the VRChat SDK and with Unity Technologies' proprietary engine components, and to convey the resulting work under terms of your choice, provided that you also convey the Corresponding Source of this Program under the terms of the GNU Affero General Public License version 3 in all other respects.
  </span></span>

Some things have replacements: 
[lilToon](https://github.com/lilxyzw/lilToon) as a shader builder,
[modular avatar](https://modular-avatar.nadena.dev/) for nondestructive
Unity workflows, and so on and so forth...
But there isn't a good substitute for the convenience of GoGo Loco.

Also, you... Don't have to use a shader builder.
You just don't!
You also don't need to use VRChat-specific tooling!

### Optimizers

I used [d4rkAvatarOptimizer](https://github.com/d4rkc0d3r/d4rkAvatarOptimizer) for a while
but it was *sooo clunky*,
so I've been on the lookout for alternatives.
Maybe [anatawa12's avatar optimizer](https://github.com/anatawa12/AvatarOptimizer) is better?

[One of my friends made an awesome optimizer for VRChat worlds](https://github.com/BlueAmulet/UdonSharpOptimizer),
which was rad.
But it's *completely unlicensed* so I'm hesitant to use it,
and I'm really anxious about nagging it to apply a license.

Also, I guess it barely counts as an optimizer,
but [VRC Light Volumes](https://github.com/REDSIM/VRCLightVolumes) is the coolest thing ever.

I don't know,
there's a lot of cases in VRChat where you're better off
just using games-industry level wisdom and strategies rather than our hacks.

## Note on Playspace Movers and overlays

I cannot emphasize enough how scummy it was for OVR Advanced Settings
to [cost money](https://store.steampowered.com/app/1009850).
It's so awful to build up years of community reputation by being great,
then rug-pull by suddenly starting to charge money.
All the sudden, you're the only guy in town,
and you can profit massively over the fact
that there's never needed to be competition yet, and sponge up the differential.
Being GPLv3 doesn't excuse this misbehavior,
it severely robs the majority of VRChat users who don't know about or
care about any of this stuff and just don't know any better.
Like, there's just a level of social scumminess even if you're *technically* above board.
You're not making your money through a legitimate venue,
if you were you wouldn't rely on the steam store to get it!

Also I need to try out [DesktopPlus](https://github.com/elvissteinjr/DesktopPlus)...
That's on me...

## Note on Controller Editor

The Dreadrith rugpull was an absolute disaster,
the sort of thing I thought would never happen to me.
One day, I'm on my merry way,
the next a malicious update is pushed and the tool I paid money for bricked.
The guy responsible for this put up a refund form, but the refund never came.
So far as I can tell, he took the money and ran.

I guess I have this whole fiasco to thank for developing an extreme distrust
of DRM-locked software.

## Note on VRChat

[BasisVR](https://github.com/BasisVR/basis) looks like a cool and promising project.
It's the only "competitor" I'd consider legitimate in the "VRChat but not VRChat" space!
But even still...
At a certain point, you can't stick to your morals at the expense of practicality.
VRChat is funded and developed actively,
which is nice,
but **much more importantly** that's where all the people are.
All these personal development-side-of things gripes and preferences I have
really only impact my personal ability to get stuff done,
at the end of the day.
But VRChat has something valuable that I can't give up for my principles:
My friends hang out there.
