# Writing Content

Put public Markdown entries in these folders:

- `library/`: Library page, one file per book.
- `fiction/`: Fiction page.
- `reflections/`: Reflection page.
- `extra/`: Extra page.

Each folder has its own `_template.md`. Copy that file in the same folder, rename the copy, then edit the copy. Files that start with `_` are templates and will not be published.

For bilingual content, use the same filename with a language suffix:

- `my-piece.en.md`
- `my-piece.zh.md`

Those two files become one website entry. When the site language changes, the title and body switch with it. If only one language exists, the site uses that version as the fallback.

Use the front matter block at the top of each file to set title, date, category, and tags.

## Library Books

Each book in `library/` is one Markdown file. Edit the fields at the top, then write the reading response below the second `---`.

```md
---
id: "1"
title: "Book title"
author: "Author name"
year: "2026"
status: "unread"
readDates: []
mood: "short note"
tags: ["fiction", "classic"]
why: "Why I want to read this book"
favoriteQuote: |
  First quote.

  Second quote.
keyThemes: ""
literaryContext: ""
relatedBooks: []
authorNationality: ""
authorGenre: ""
authorKnownFor: ""
---

Write your reading response here.
```

For `status`, use one of these values: `unread`, `reading`, `completed`.

For `readDates`, use dates like `["2026-08-30"]`. If you read it more than once, use more dates: `["2024-05-01", "2026-08-30"]`.

The Timeline is grouped by the month in `readDates`. You can also write month-only dates like `[08/2026]`. If `readDates` is empty, that book will not appear on the Timeline.

For multiple `favoriteQuote` entries, use `favoriteQuote: |`, then put one blank line between quotes.

After editing Library files only, run:

```sh
python3 scripts/build_content.py library
```

You can start from `library/_template.md` when adding a new book.

Library also supports bilingual book notes. For example:

- `001-book-title.en.md`
- `001-book-title.zh.md`

Use the same `id` in both files so they clearly belong to the same book.

## Writing Entries

Use the template in the matching folder:

- `fiction/_template.md`
- `reflections/_template.md`
- `extra/_template.md`

For translated versions, copy the same template twice and name the files like `essay-title.en.md` and `essay-title.zh.md`.

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
