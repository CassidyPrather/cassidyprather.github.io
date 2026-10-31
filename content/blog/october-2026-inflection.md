---
title: "Exploring the October 2026 Inflection"
date: 2026-10-31T12:00:00-07:00
highlight: false
---

I agree that the [October Inflection Point](https://simonwillison.net/2026/Oct/28/vibe-game-development/) exists, but capabilities are still so jagged, and I have no idea what "fun" really looks like.

<!--more-->

I've been trying to think of ways to improve [extraction](https://github.com/CassidyPrather/extraction) while not being mirco-manage-y. AI capabilities are ballooning so fast that I do not trust anything I come up with to be durable. It has happened before and will happen again.

I have been recording my playtests as videos and sending it to the "project manager", and that's definitely unavoidable to make something suited to my tastes... But like... What currently exists doesn't read as if it's suited to *anyone's* tastes!

I would like to take different parts of the game and modularize them more formally. I know that the AI is already delegating things out to sub-agents, so an attempt is being made, but I do not see deep into that process.

Take, for example, modelling the guns. They're still lacking in a way that's hard to articulate, but somehow I get the picture that in a project fully dedicated to it, they would end up under closer scrutiny with a higher level of attention to detail in their designs. Now, the theory behind a dedicated sub-agent is that it removes this problem: After all, that sub-agent's sole purpose is to lock in on the modeling and qol for that one specific mechanic, right? But for whatever reason, that's not happening. 

I feel like I should not have to give the instruction to "make an isolated gun system that is in portable between games" and instruct it to build the mechanical actuation context free from the constraints of the "extraction" project. If the AI really was indeed infinitely, it would have done that if it was the best path forward. The fact that it hasn't done that makes me feel like I'm wrong Maybe RSI just hasn't had enough time to take off, or there is something about this domain not being well-verifiable that makes it difficult to improve on.

Another thing that has been bothering me is how poor the onboarding worked out. In my head, I'm not using some genius or creative spark to figure out the core issue- I'm just using a combination of experience and deductive reasoning. Like, the following feel like common knowledge: 
1. Do not present too much at once
2. The onboarding itself should be part of the fun, not a chore

And when I looked at the design of extraction, that just was not happening.

I feel like map design is also a huge area where the process I would expect just isn't being followed. Like, every now and then you need to check the point around where a player is standing and ask:
1. How does their vista look from this angle?
2. What's discoverable?
3. What's this moment in time for the experience trying to explore? 

If I were doing this by hand, I would be making higher level abstract sorts of flow charts. Lots and lots of them. Oh, and I would be writing checklists that I have to follow. Even if I bend or break the rules every now and again, that kind of guide would be something I personally find helpful... But I don't often see AI agents doing that for themselves (though I **have** seen a different, horrid incarnation of checklists that are more there to keep the AI from getting de-railed, that's not what I'm referring to- this is more, reusable documentation and self-help manuals).

And like, I don't feel like it's my place as a brutish, unintelligent, and biased human to be promoting thinking in this direction! But maybe we're still there, for now- or maybe even a bit of prompting to *think* in this direction will have positive knock-on effects down the line.

And who knows maybe there are things that are just intuitively fun to a human and intuitively fun to an AI system, and the venn diagram isn't a perfect overlap. While mapping "fun" back and forth doesn't really apply super well, one thing that came to mind while playing in the demo is... "Wow. I have been bombarded with too many item types at once." And that recurred during the explicit onboarding (tutorial) and implicit onboarding (first real map) both. Like, running around in the houses there were so many different types of items, so much so that I think it made it harder to appreciate what was happening? I dunno. Like, I imagine you can still have a breadth of items, and if you have knowledge about where those items might tend to show up you can prioritize one thing over another, but I just got... It felt muddy? Anyway, I'm not sure what's going on there.

I'm reminded about how conflicted I feel about adding skill files. I feel like I should be trusting the machine to know what it needs to best solve this genre of problems. I'm not an AI researcher, what do I know?

