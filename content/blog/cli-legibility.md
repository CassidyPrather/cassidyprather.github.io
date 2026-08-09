---
title: "CLI Legibility"
date: 2026-08-09T16:00:00-07:00
highlight: true
---

Old, popular software isn't sacred.
The more I learn about technology, the more obvious that becomes.
Now, I didn't always think that way; I used to be very trusting.
But now, I'm fairly convinced anybody who evangelizes anything
is more often full of hot air than not.

I've been *extremely* frustrated lately about CLI design,
particularly the fact that nobody seems capable of even *imagining* better.
There's like, a million low-hanging fruit design principles you *could* follow
while making decisions, but nobody ever *does*. Things are just arbitrary.

<!--more-->

Take, for instance, [git](https://git-scm.com/).
It appears to be a Linus Torvalds app from 2005 or so...
And somehow, everybody's really decided it's the bees knees!
The gold standard of version control!
Everybody I've interrogated about it, though,
has never been able to *actually* defend it with respect to other options.
In fact, people *mistakenly* attribute design patterns to git that predate it!

But in this particular instance, I want to hone in on git's awful CLI:

```sh
$ git fetch
$ git branch
- *main
- b
- c
$ # alright, cool
$ git checkout c
```

This looks like all branches are present.
This is simply not true:
If the repository has an upstream remote (let's call it `origin`),
that origin may have a completely separate set of branches
that are **entirely excluded** from the results.
A casual user couldn't know that from reading the above command output!

An expert (somebody who wasted their life
memorizing this god-forsaken tool's specific flags)
would know to run `git branch -a`,
a secret sauce on *branch* (not fetch),
to get the results.

In a better world, this would be the other way around: The **advanced** user, who doesn't want to see very many things, would use:

```sh
$ git fetch
$ git branch --local
- *main
- b
- c
$ # alright, cool
$ git checkout c
```

See how this is more legible?
A novice user doesn't need to constantly be worried
that they're missing some secret advanced command this way.
When they encounter something they **don't** know-
say, an argument like `--local` (or flag like `-l`)-
they will know
"hey, this command output has something going on that I don't understand".
This requires them to check the manual to understand the sequence.
If there were no unrecognized flag,
there'd be no indicator there's something fishy going on.

I picked on git a fair bit here,
but I'm even **more** jaded
by the fact that this design deficiency has lasted 20 years.
Take [jujutsu](https://docs.jj-vcs.dev/latest/), for example!

```sh
[cass@cass-yoga cass-website]$ jj log
@  kwwsyzql cassidy@wirenook.net 2026-08-09 12:24:25 71ae65db
│  feat: CLI UX blog post
◆  voppzrrq cassidy@wirenook.net 2026-08-05 19:54:53 main@origin ea0f4867
│  fix: remove navlink
~
[cass@cass-yoga cass-website]$ 
```

At least this has a little tilde
to indicate that history continues further back.
But from this log, you'd have no idea that I have multiple branches!

Wanna know how to see all the branches?

```bash
$ jj git fetch
$ # ...
$ jj log -r "all()"
```

Do you see that? I have to include a flippin'
[*domain specific language*](https://en.wikipedia.org/wiki/Domain-specific_language)
as a quoted argument **just to get what should be the default behavior!**

We should be collectively ashamed of this regression.

I think this brainrot came from *good* design patterns being misunderstood:
[ls](https://en.wikipedia.org/wiki/Ls), for instance,
excludes hidden directories/files from results.
Those directories are *explicitly ignored.*
That's what makes it fine to make `ls -a` *opt-in.*
[ripgrep](https://github.com/burntsushi/ripgrep),
thank goodness, seemed to understand that.
That should be proof enough that we can do better!
