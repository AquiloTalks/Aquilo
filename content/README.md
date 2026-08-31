# Writing Content

Put public Markdown entries in these folders:

- `fiction/`: Fiction page.
- `reflections/`: Reflection page.
- `extra/`: Extra page.

Use the front matter block at the top of each file to set title, date, category, and tags.

```md
---
title: "A Small Fiction Fragment"
date: "2026-08-30"
category: "Draft"
tags: ["memory", "house"]
---

Write the public text here.
```

After editing Markdown files, run:

```sh
python3 scripts/build_content.py
```

That command updates the matching JSON files in `data/`.
