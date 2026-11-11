---
title: "Space Trucking"
date: 2026-11-10T23:01:00-07:00
tags: ["reflection"]
---

Wow, this one was a long time ago. Storytime!

For a couple of years now (and then extending into some time before I met her), my partner [Cor Vous](https://cor.gg/) had a dream for a [VRChat](https://hello.vrchat.com/) game. I don't understand the inner machinations of her mind particularly well, but I have no doubt that many of the finer details are just things she thinks are cool. But, anyway: There was a bit of a problem she was facing that spurred this from being a dream to something we should actively work on: The entire platform was filled to the brim with sloppy, Robloxified idle games of an exceptionally low quality that more or less amount to a bunch of people playing concurrent solitaire without any interaction with each other. And I mean, that's really sad, you know? No social interaction in a game on the social networking platform we literally get on to socialize!

There is a dream vision of her game, which at time of writing has yet to be achieved: A polished, high-fidelity social game experience she can enjoy with her friends in VR that has a general positive impact on the general sorts of social media environment people on the platform are in. If you ask me *personally,* "face-to-face" interactions are so critically important for NEETs and shut-ins and is a huge step up for mental health and rehabilitation than other platforms. Anyway, so that's why we have a game where there are huge 5-30 minute stretches of downtime where literally nothing is happening. In the vision, it's very much "you're cramped in a tight space with your friends, now socialize" *disguised* as a trendslop brain-rot-em-up. That's how I see it, anyway, I'm sure Cor would interpret that vision as a bit harsh.

Anyway, there's your context. Now, in the Summer of 2026, something interesting happened: Coding agents got good, and I mean *really* good. It wasn't anywhere near the level of the [October Inflection Point](https://simonwillison.net/2026/Oct/28/vibe-game-development/), sure, but it was definitely good enough to help. Before AI was even capable of doing any coding at all, we had originally planned to open the project with some very simple technical prototypes. If you looked at the whole system architecture of the project, there were a bunch of isolated "modules" that could be built, tested, and iterated upon independently of each other. Now, all of the sudden, coding agents come along, that can do these precisely defined tasks automatically... And volia, the very first prototype is born.

It's mostly glue-ware. The 2D game prototype you find on my website was designed to actuate, basically, the navigation and persistence logic, and not too much else. It wasn't fun (not to me, anyway- interestingly, it *was* fun to people who didn't know there wasn't more to it, which is a finding I'll have to file away for later). But I figured, "oh, hey, this is real now."

After that, I tried a white-box 3D version of the game which looked and felt terrible. *Far* worse than the 2D one. But hey, at least it showed that the theoretical process of transferring the reusable behind-the-scenes game code wasn't just theoretical! Even if the experience was a straight-up downgrade.

screenshot_of_crummy_boxxy_3D_cabin

I'm currently working on and off on a prototype that uses Synty assets. I will be honest, it looks bad for reasons Bennett Foddy described:

> For years now, people have been predicting that games would soon be made out of pre-fabricated objects; bought in a store and assembled into a world, and for the most part that hasn’t happened, because the objects in the stores are trash. I don’t mean that they look bad, or that they’re badly made- although a lot of them are- I mean they’re trash in the way that food becomes trash as soon as you put it in the sink. Things are made to be consumed and used in a certain context, and once the moment is gone they transform into garbage. In the context of technology, those moments pass by in seconds.

Long term, I do not want to use Synty assets anymore. Me and a team had been paying for them for a year and a half at this point for an unrelated project, so applying them to Space Trucking was more or less a side-gig to begin with. And so, I think personally that it would be absolutely unacceptable to release the game with the demo assets.

Cor wants to model the game herself, eventually, which is a pretty tall ask, given that at the rate we are currently allocating time in our lives she'd be done in several years- a future so far out as to be pretty much nothing like the social environment of today. But, I don't know. She's my partner, right? I want to see her dream come true, and I guess that means working as hard as I can and use every tool in my disposal to make that happen... And I guess that means making a workable prototype and then iterating on it a dozen times or so, to minimize the amount of work she has to do that's outside of the scope of what she explicitly wants.