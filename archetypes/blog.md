{{- /* What `hugo new content blog/...` starts a post from. Hugo picks an
   archetype by content type, and everything under content/blog/ is type
   "blog" however deep it sits, so this one file is the blank page for all of
   it and has to tell a reflection apart by the directory it is going into.

   An ordinary post gets exactly what Hugo's built-in default would have given
   it: a title made from the file name, the date, and draft. Reflections -- Cassidy looking back
   at one of the games in the game-prototypes repo -- get two more lines, and
   the README at the root of this repo has the convention behind them. The file
   is named for the game's slug, so `game` is read straight off the name.

   Draft so a post can be committed half-written: `hugo server -D` shows it,
   and the deploy does not until the line goes. */ -}}
{{- $reflection := eq (path.Base .File.Dir) "reflections" -}}
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
{{- if $reflection }}
game: "{{ .File.ContentBaseName }}"
tags: ["reflection"]
{{- end }}
---
