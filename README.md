# Aquilo

A static personal literature cabinet for books, reading traces, fiction fragments, reflection notes, and loose extras.

## Local Preview

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This site is plain HTML, CSS, and JavaScript. It can be deployed directly with GitHub Pages from the repository root.

## Editing Published Content

The public website is read-only. For writing pages, edit Markdown files in `content/`, then generate JSON:

```sh
python3 scripts/build_content.py
```

Use these folders:

- `content/fiction/`: Fiction page entries.
- `content/reflections/`: Reflection page entries.
- `content/extra/`: Extra page entries.

Each Markdown file starts with front matter:

```md
---
title: "A Small Fiction Fragment"
date: "2026-08-30"
category: "Draft"
tags: ["memory", "house"]
---

Write the public text here.
```

The build command writes:

- `data/fiction.json`
- `data/reflections.json`
- `data/extra.json`

For books and site labels, edit JSON directly:

- `data/books.json`: Library books.
- `data/site-content.json`: page labels, module text, and bilingual UI copy.

Preview through a local server after changing JSON, because browsers block `fetch()` for local files opened directly from Finder.

## Assets

The painted page background is saved locally at `assets/monet-la-seine-argenteuil.jpg` so the site does not depend on a remote image URL at runtime.
