---
title: "Social Agents"
date: 2026-08-15T18:30:00-07:00
highlight: false
---


AI agents are quite good at technical work, but obviously, they struggle at social tasks. They're no good at creative writing (in fact, I'd go so far as to say they're awful at it)... But I dunno, I would be willing to bet a non-negligible part of that is due to the fact that a big chunk of the money in AI research goes towards more profitable areas (like coding). Similarly, I bet a bunch of the people who *do* want it to be good at creative writing just... *Don't care*. Like, do you mean to tell me the army of people on Replika-slop apps care about whether they're using the best technological service available? Or are they just falling for some crazy predatory business practices gated behind a company who only really cares about the value they can extract from that demographic more than any degree of artistic excellence <span class="prose-aside"><label class="prose-aside-marker"><input type="checkbox">note</label><span class="prose-aside-note">(I think working on FOSS creative stuff has the side benefit of providing people with alternatives to the awful, predatory AI companionship apps on the app-store. Right now, the target audience of those apps is 100% being preyed on and I want to help shred their moat to smithereens.)</span></span>? Anyway, my point is, it doesn't have to be this way.

<!--more-->

First and foremost, trying to conventionally RL an "artistic" AI is bound to fail. I mean, for one, creativity is an extremely fickle metric to begin with, which I won't bother unpacking. But even fine-tuning for a specific creative goal- a *fraction* of general-purpose creativity- fails spectacularly at our scale. [Cor discovered that.](https://cor.gg/blog/personality-core/) ([Though not impossible, apparently.](https://arxiv.org/abs/2508.18642)). I guess that makes sense- it took the concentrated power of all of humanity to just RL these things to *call tools at all*, no hobbyist is going to rival that.

I'm not convinced that existing research and RL patterns are *entirely* worthless, though. I mean, we now know that a good "long-horizon" bot can stay focused on really any arbitrary task that's empirically verifiable, a whole bunch of *atomic* stuff can be more or less cut and dried. I first saw this working with [recast](https://github.com/closuretxt/recast-post-processing), and I'm thinking... Surely we can go on to do better, no?

Anyhow, to keep the empirical evals I'll inevitably have to do clean, I want to start with a simple architecture.

Roleplay agent: Heavy-duty technical-RL'd model with creative assignment and architecture details in system prompt.
Tools:
- History management (probably several tools): All this context has to work somehow!
- Prose generator: Baseline prose generating LLM. Maybe different models or finetunes or different purposes?
- Post-processing: Select which post-processing steps to run and run them
- Papercut logger. Always gotta have the papercut logger.

You'll see that this is actually a conductor/orchestrator workflow in a trench-coat. Definitely been tried before. That's a reasonable pattern! Another nice thing about this design is that I can swap in and out tools without re-archictecting the whole thing from the ground up. The hardest part is probably going to be deciding the rules for when things get called, where they get put, and where stuff gets stored.

I'm trying as hard as I can not to scope-creep and usher in the daemons, too... But the daemons are so tempting... Daemon that keeps track of a detail and injects it into the storytelling context when that detail may become relevant, but otherwise maintains its own context garden? Yes PLEASE! But augh, I must resist... It's *more* important that I get classifiers implemented at the scope of each tool-call result so I can start passively collecting efficacy data before I mess with that.

Two projects I'm going experiment with this in the context of:
- [HI BLUE](https://hi-blue.cor.gg/)
- [Familiar-Connect](https://github.com/CorVous/Familiar-Connect)

I have to actually beat HI BLUE though, that game is currently crazy difficult.

In two years from now, this post is going to look pretty dated... I'm sure plenty of people are working hard at cracking the creativity pinata. But for now, maybe these research directions are good enough to lead towards a stop-gap?

