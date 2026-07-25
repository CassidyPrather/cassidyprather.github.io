---
title: "Prove it!"
date: 2026-07-26T00:00:00Z
highlight: true
---

Misinformation is bad! Please do not spread misinformation on the internet! I think we all know this is important and believe in it, and could do with checking our sources a little more often.

But what I *really* want to drive home is "how do we prove things scientifically". I know we went over the scientific method in high school, but here's a bit of a refresher.

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
                 .--------------------+-----------------------.
                 |                                            |
                 | yes                                        | no
                 v                                            v
      +--------------------+                      +-----------------------+
      |  Hypothesis holds  |                      |  Hypothesis is wrong  |
      +--------------------+                      +-----------------------+
```

That's it. That's all you have to do, my guys. I am begging you.

Your middle-school science teacher over-complicated it. You don't need those  7 step posters that were hanging in the classroom. And a bunch of stuff like peer-review, replication, control vs. treatment trials, statistics, and etc. all **exists only to aid** those two steps.

## Yes This Is About The Jarred Blog Post

https://bun.com/blog/bun-in-rust

Don't get me wrong, it's sick as heck that we live in a timeline where we can re-write Bun in Rust. Despite the controversy, it's pretty obviously an extremely good thing! And it's *because* I want more software to be better, it's *extra* important that everyone pays attention to the epistemics of how we're discussing it.

[Jarred says](https://bun.com/blog/bun-in-rust#adversarial-review):

> ## Adversarial review
> 
> Adversarial review asks Claude (in a separate context window) to exhaustively come up with reasons why the changes create bugs or do not work.
Split context windows
> 
> Usually with humans, the person reviewing the code is not the person who authored the code. The person writing the code wants to merge the code, which can bias their actions to ship before it's ready.
> 
> Claude is the same way. The Claude that wrote the code wants the code to get accepted. The Claude that reviews wants to find issues in the code.
> 
> 1 implementer, 2 or more adversarial reviewers per implementer. The reviewer's only job: find bugs & reasons why the code does not work. The implementer doesn't review. The reviewer doesn't implement.

Jarred. Jarred, my sweet boy. You knew there would be a huge hoard of people reading this blog post and debating it to hell and back on the most [vile, toxic places imaginable](https://news.ycombinator.com/item?id=48837877), and a bunch of people would be [chomping at the bit to find every tiny little hole in your strategy](https://web.archive.org/web/20260711080618/https://andrewkelley.me/post/my-thoughts-bun-rust-rewrite.html). Why did you do this?!

Is there a hypothesis! Sort of? But it's not well laid out or falsifiable! Let's do an exercise: How would you write a testable hypothesis for Jarred's claims about the merits of adversarial code review?

My answers (TODO Cassidy wrap these in a click-to-reveal block).

1. Blinded adversarial code review by AI produces fewer regressions than non-blinded review.
2. Blinded adversarial code review is more cost-effective than  spending the same budget on an anti-regression suite.
3. Blinded, adversarially reviewed code written blind to future requirements makes it cheaper to implement those future requirements than non-blinded reviewed code.

Hopefully that wasn't too hard. If you agree with Jarred's spirit here (as I do), you should want to do better, and to pose and answer such questions before making the bold claim. You could even have hunches that Jarred is right! But the onus is on him to prove it, whether by citing another study or doing the work himself.

Obviously, you have to refine the experiment, control for as much as you can, spend the effort to conduct it, and all the other stuff. That's annoying, sure. But it's not worth writing about if it's just your hunch! And Jarred has no excuse, he has the budget of kings at his disposal. He doesn't even have to cheap-out and only answer the question for one model configuration, he could test the whole *sea* of them!

It is important to care about science and the scientific process. It is important to interrogate how these people are getting their results. Otherwise we end up with [negligence](https://openai.com/index/separating-signal-from-noise-coding-evaluations/) and fraud.

## But It's Not Just About AI

So many parts of our lives can be improved by applying the scientific method to them! Even the soft and squishy things, and even if you *can't* get a perfect laboratory experimental control, it's worth doing.

1. Improve the energy efficiency of your home
2. Optimize your health
3. Write a more persuasive blog post

You don't need a scientific journal, or the highest degree of rigor. In fact, it's not entirely clear if scientific journals *can* persist in the format in which they have, or what's going to replace them. [They have issues.](https://en.wikipedia.org/wiki/Replication_crisis). *All* of science has issues right now, honestly. But that's no excuse to throw our hands up and stop trying.

## Money Where my Mouth Is

I am a hobbyist. I don't have Anthropic budgets, and between a full-time job and my personal life, time is tight! So if even *I* can run these experiments, it's reasonable to expect a bare minimum from people in better positions.

# TODO write the "results" section



# Cool Further Watching

If you'd like to hear the talky man ramble about science a bit, try: [The Trick Pseudoscience Always Uses](https://www.youtube.com/watch?v=DpGU8NARX-s) ([Hank Green](https://www.hankgreen.com/))
