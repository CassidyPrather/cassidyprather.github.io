---
title: "Thinking Scientifically about Using Technology"
date: 2026-07-28T00:00:00Z
highlight: true
---

This one's for my friends.

Misinformation is bad! Please do not spread misinformation on the internet! I think we all know this is important and could do with checking our sources more often. The bigger your audience, the more important such diligence becomes.

In particular, I  *really* want to drive home is "how do we think scientifically". I know we went over the scientific method in school, but here's a bit of a refresher.

<!--more-->

```goat
                              +--------------+
                              |  Hypothesis  |
                              +-------+------+
                                      |
                                      v
                              +--------------+
                              |  Experiment  |
                              +-------+------+
                                      |
                                      v
                 .-----------------------------------------.
                 |  Does the result match the prediction?  |
                 '--------------------+--------------------'
                                      |
                 .--------------------+----------------------.
                 |                                           |
                 | yes                                       | no
                 v                                           v
      +--------------------+                     +------------------------+
      |  Hypothesis holds  |                     | Hypothesis unsupported |
      +--------------------+                     +------------------------+
```

That's it. That's all you have to do, my guys. I am begging you.

Your science teacher over-complicated it. You don't need those seven-step laminated posters on the wall in the classroom. And a bunch of stuff like peer-review, replication, control vs. treatment trials, statistics... You use all of those tools to **support** this very simple core method of inquiry.

Now, that's not to say all those extra bits of process are *useless.* But they're not the essential part, and you can still think scientifically without them. There are tons of strategies that serve to build confidence in findings, and that can be valuable, especially when your measurements are [imprecise](https://en.wikipedia.org/wiki/Accuracy_and_precision) and it's difficult to control confounding factors. Maybe you don't want to go through all those painful, tedious steps! And that's okay! Admitting what you don't know is *fine*, and will earn you respect from anybody who matters. It's much better than exaggerating (and yes, exaggerating is lying). Pursue knowledge! Talk about open questions! Conjecture about the world in terms of falsifiable claims!

So many parts of our lives can be improved by applying the scientific method to them! Even the soft and squishy things, and even if you *can't* pop out a magnum opus, it's worth doing. You don't need a scientific journal, or the highest degree of rigor. In fact, it's not entirely clear if scientific journals *can* persist in the format in which they have, or what's going to replace them. [They have issues](https://en.wikipedia.org/wiki/Replication_crisis). *All* of science has issues right now, honestly. But that's no excuse to throw our hands up and stop trying.

I was reading [Working with Legacy Code](https://archive.org/details/working-effectively-with-legacy-code) by [Michael Feathers](https://michaelfeathers.silvrback.com/bio), which reads very well. It's extremely persuasive, and constructs its arguments about software development practices in such a way as to latch into my gray matter like a drywall anchor. Still, I couldn't shake the idea that there was something wrong with it. I only recently noticed the reason why: Everything he says is completely unfounded. The construction is sound, and it makes sense, but there's absolutely no evidence to suggest that his way of working with software is the *right* way of writing software. It's full of 2000s-decade OOP brainrot, suppositions about the failure points of code and development, and consultant-speak. As a book, it clearly did very well, and much of modern software development- particularly in the realm of testing best practices, can be traced back to it. My boss even has a copy of the book on his desk at work, which he is proud to have read cover to cover! And that's frustrating and sad, because Feather's negligence is now impacting me in a very viscerally personal way. Overall, though...

## Yes This Is About The Jarred Blog Post

https://bun.com/blog/bun-in-rust

Don't get me wrong, it's sick as heck that we live in a timeline where we can re-write Bun in Rust <!-- unless your self-worth depends on being an insufferable contrarian -->. Despite the controversy, it's pretty obviously an extremely good thing! And it's *because* I want more software to be better that it's *extra* important everyone pays attention to the epistemics of how we're discussing it.

[Jarred says](https://bun.com/blog/bun-in-rust#adversarial-review):

<blockquote class="bun-quote" cite="https://bun.com/blog/bun-in-rust#adversarial-review">
<div class="bun-prose">
<h3><a href="https://bun.com/blog/bun-in-rust#adversarial-review">Adversarial review</a></h3>
<p>Adversarial review asks Claude (in a separate context window) to exhaustively come up with reasons why the changes create bugs or do not work.</p>
<h4>Split context windows</h4>
<p>Usually with humans, the person reviewing the code is not the person who authored the code. The person writing the code wants to merge the code, which can bias their actions to ship before it's ready.</p>
<p>Claude is the same way. The Claude that wrote the code wants the code to get accepted. The Claude that reviews wants to find issues in the code.</p>
<p>1 implementer, 2 or more adversarial reviewers per implementer. The reviewer's only job: find bugs &amp; reasons why the code does not work. The implementer doesn't review. The reviewer doesn't implement.</p>
</div>
</blockquote>

Jarred. Jarred, my sweet boy. You knew there would be a huge horde of people reading this blog post and debating it to hell and back on the most [vile, toxic places imaginable](https://news.ycombinator.com/item?id=48837877), and a bunch of people would be [chomping at the bit to find every tiny little hole in your strategy](https://web.archive.org/web/20260711080618/https://andrewkelley.me/post/my-thoughts-bun-rust-rewrite.html). Why did you do this?!

Is there a hypothesis? Sort of! But it's not well laid out at all! Let's do an exercise: How would you write a testable hypothesis for Jarred's claims about the merits of adversarial code review? Pause for a moment and think about it.

<details>

<summary>My answers (click to reveal)</summary>

1. Blinded adversarial code review by AI produces fewer regressions than non-blinded review.
2. Blinded adversarial code review is more cost-effective than spending the same budget on an anti-regression suite.
3. Blinded, adversarially reviewed code written blind to future requirements makes it cheaper to implement those future requirements than non-blinded reviewed code.

</details>
<br/>

Weird, isn't it? Thinking in terms of a hypothesis is useful work!

Anyway, if you're on board with Jarred's zeal here (as I am), you should value quality science communication. We certainly can do better, even in such a way as not making bold claims without evidence! If you're anything like me, you could even have a hunch that Jarred's prescription is a solid one! But the onus is on him to prove it, whether by citing another study or doing the work himself.

Obviously, it's not *free* to get evidence. You have to refine the experiment, control for confounding junk, spend the effort to conduct it, and all the other stuff. That's annoying, sure. But it's not worth writing about if it's just your hunch! And Jarred has no excuse, he has the budget of kings at his disposal. He doesn't even have to cheap-out and only answer the question for one model configuration, he could test the whole *sea* of them!

It is important to care about science and the scientific process! It is important to interrogate how these people are getting their results! Otherwise we end up with [negligence](https://openai.com/index/separating-signal-from-noise-coding-evaluations/) and fraud.

## Money Where My Mouth Is

So I figured, "before I publish this blog post, I had better at least *try* to test one of my hypotheses before throwing this out there." Those who live in glass houses, and all that. Sure, I'm just a hobbyist. I don't have Anthropic budgets, and between a full-time job and my personal life, time is tight! So if even *I* can run these experiments, it's reasonable to expect a bare minimum from people in better positions.

Honestly, I wasn't expecting to find anything interesting. I wanted to criticize the Bun blog post because it left itself open to huge gaping criticisms from a massive audience and didn't treat the impact it was going to have with the level of diligence it deserved...

I didn't expect that when I ran an experiment that I'd *not find a measurable improvement at all.*

![Did review reduce regressions?](../../images/wirenook/blog/prove-it/fig1-forest-ci.png)

Yup. It appears that blinded adversarial review doesn't, as a blanket rule, find issues in the code. In fact, sometimes it's worse! You're better off just letting the agent check its own work. If there *is* a positive effect, it's so noisy and small that it'll take a massive study with budget I could only dream of to tease out.

I wonder why this is the case? I can only speculate, but my hypothesis is that it has something to do with reinforcement learning. After all, Jarred claims that "the person writing the code wants to merge the code" when talking about humans and just *assumes* that also applies to AI agents... But in any post-training worth its salt, such a self-sabotaging bias would surely be eradicated, right? I can also speculate as to why Jarred made this mistake in the first place, for which there's a couple of options:

1. Anthropomorphizing the AI makes us assume it'll behave like a human in a similar circumstance. Of course, better to look at what previous research they might have gotten wrong than to presume such a trivial error:
1. Over-extrapolating from [Panickssery, Bowman & Feng](https://arxiv.org/abs/2404.13076): They identified a self-preference, but not an effect size on task efficacy... So naturally:
1. Failing to account for the [KV cache](https://huggingface.co/blog/not-lain/kv-caching) and cost of discovery. In order for the prescriptive advice of "do blinded adversarial code review" to hold, it has to be **better** than having the author agent check its own work. After all, an adversary agent must re-discover all of the context about the problem on its own, which will mostly be repeating the very same work.

You can review my findings and replicate the procedure yourself! [The code's on GitHub](https://github.com/CassidyPrather/ai-benchmark). I imagine, if you're especially curious, you'll want to run a follow-up experiment, so go crazy. The raw data's packaged as a release, but I didn't put a bunch of effort into formatting it, so peruse at your own peril. It'd be cool to upload something to [Zenodo](https://zenodo.org/) one day, though...

As for me, well... Anthropic made a bold claim to the open internet about the best way to use AI which appears to be based on hot air. They did not do science to prescribe this advice, and right now, Jarred is no better than another Michael Feathers, misleading the next generation of software engineers. The burden of proof was on him to begin with, anyway, and I'd like to spend my remaining budget on more fruitful pastures (unless I get sponsored, in which case I'll go crazy scaling up this experiment haha).

[Lucky for Anthropic](https://en.wikipedia.org/wiki/Jevons_paradox), this suggests that the $165k price tag Jarred cited was probably wasted (at least a fair amount), and you could get away with an even *more* ambitious AI project for *less money*. Useful!

<details>

<summary>Lab assistant Claube also had a few interesting things to say about it.</summary>

Pardon the scuffed formatting.

```
H1 is not supported

Primary contrast — blinded adversarial review vs. non-blinded self-review, paired over 65 complete triplets:
- Regression rate: adversarial 20.0% vs self_review 13.8%
- Paired difference +0.062 — adversarial regressed slightly more, the opposite direction to H1
- McNemar exact p = 0.39; bootstrap 95% CI [−0.046, +0.169] (spans 0); Wilcoxon p = 0.53

So not only is there no significant advantage for blinded adversarial review over plain self-review — the point estimate leans the wrong way.

The guardrail holds, so this isn't an artifact. Resolution (all FAIL_TO_PASS passing) is essentially identical across arms — control 56.9%, self_review 58.5%, adversarial 58.5%. The arms solved tasks equally often; they weren't regressing less by doing less. That's the check that makes the regression comparison meaningful, and it passes cleanly.

Secondary picture:

┌────────────────────────────┬───────────────────┬──────────────────┬───────────┬──────┐
│          Contrast          │ Δ regression rate │   bootstrap CI   │ McNemar p │ Holm │
├────────────────────────────┼───────────────────┼──────────────────┼───────────┼──────┤
│ adversarial vs control     │ −0.046            │ [−0.169, +0.062] │ 0.61      │ 0.78 │
├────────────────────────────┼───────────────────┼──────────────────┼───────────┼──────┤
│ self_review vs control     │ −0.108            │ [−0.200, −0.015] │ 0.065     │ 0.20 │
├────────────────────────────┼───────────────────┼──────────────────┼───────────┼──────┤
│ adversarial vs self_review │ +0.062            │ [−0.046, +0.169] │ 0.39      │ 0.78 │
└────────────────────────────┴───────────────────┴──────────────────┴───────────┴──────┘

The only arm showing any signal of reducing regressions vs. no review is self-review (same-context, non-blinded) — its bootstrap CI excludes zero — but it does not survive multiplicity correction (Holm p = 0.20). The mixed-effects model agrees directionally (self_review effect −1.11 ± 0.43; adversarial −0.44 ± 0.38, indistinguishable from zero).

What this means, honestly

For the "Prove It" thesis this is a clean result: in a pre-registered test, the intuitively-appealing move — blinded adversarial review — bought nothing over simple self-review, and didn't clearly beat no review at all. If anything, the cheaper same-context self-review did marginally better. The split-context-escapes-self-preference premise the bun post leans on gets no support here.

But the caveats are load-bearing, and belong up front in the write-up (this is exactly the epistemic honesty the project is about):
- Underpowered. The primary contrast rests on 12 discordant pairs. This can only detect a large effect; a modest real benefit of adversarial review would likely be missed. "Not significant" ≠ "no effect" — it's evidence against a big benefit here, not proof of none.
- Narrow scope, by design. One model (qwen3-coder), one repo (Django), one seed. Not generalizable.
- Contamination. SWE-bench Verified is almost certainly in the model's training data, which compresses differences between arms toward null.
- Even the self-review signal is not robust to correction.
```

Thanks Claube. Maybe in the future I'll use a better chat exporter.

More:
- [Prior work agent](https://claude.ai/share/882ede2b-39b2-4f5d-88d4-9d1f0d1873d8)
- [Implementation agent](https://claude.ai/code/session_0157C5YH9KzWghjybjGbCmsq)

</details>

Obviously, my strategy had a lot of limitations. I didn't take a representative sample of the agents people typically use (do I look like King Midas to you?), I didn't guarantee the trial scenarios were never-before seen, either. I also could have used different prompts, switched models half-way through the experiment, tried different call parameterization and cache settings... I'm certainly no oracle who knows all the confounds, and I'm *most definitely* not a lab director with the budget to try everything! And despite it all, this was still an incredibly fruitful endeavor.

This was supposed to be a post about technical and scientific communication (see [a video on pseudoscience](https://www.youtube.com/watch?v=DpGU8NARX-s) by [the science communication guy](https://www.hankgreen.com/))... I honestly figured that Jarred was probably right- after all, his claim was obvious and intuitive. And- like- you still *should* dot your `i`s and cross your `t`s! But I guess it's ended up as more of a post about not making up random stuff that sounds good and passing it off as fact. Please don't do that either. Check yourself before you wreck yourself.
