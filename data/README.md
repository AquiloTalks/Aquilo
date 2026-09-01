# Editable Site Data

Edit these files when you want the deployed website to change, then commit and push.

- `books.json`: generated from `content/library/*.md`.
- `fiction.json`: generated from `content/fiction/*.md`.
- `reflections.json`: generated from `content/reflections/*.md`.
- `extra.json`: generated from `content/extra/*.md`.
- `site-content.json`: navigation text, module copy, bilingual labels, and reusable page text.

Prefer editing Markdown files in `content/`. Run `python3 scripts/build_content.py` after changing Markdown, or `python3 scripts/build_content.py library` when you only changed books.

The generated JSON may include a `translations` object when you create paired files such as `my-note.en.md` and `my-note.zh.md`. The website chooses the right translation automatically when the language toggle changes.

## Entry Formats

### Generated Book JSON

```json
{
  "id": 1,
  "title": "Book title",
  "author": "Author name",
  "year": 2026,
  "status": "unread",
  "readDates": [],
  "mood": "short note",
  "tags": ["tag one", "tag two"],
  "why": "Why I read this",
  "favoriteQuote": "A short quote",
  "keyThemes": "Themes or motifs",
  "literaryContext": "Context notes",
  "personalReview": "Your review",
  "relatedBooks": ["Another book"],
  "authorInfo": {
    "nationality": "Nationality",
    "genre": "Genre",
    "knownFor": "Known for..."
  }
}
```

These book entries are generated from one-file-per-book Markdown files in `content/library/`. Put the reading response below the front matter in the book file; it becomes `personalReview`.

### Generated Writing JSON

```json
{
  "id": "unique-id",
  "title": "Entry title",
  "category": "Optional category",
  "tags": ["tag one", "tag two"],
  "body": "Your text",
  "createdAt": "2026-05-23T00:00:00.000Z",
  "sourceFile": "content/fiction/example.md"
}
```

These files are generated, so manual edits may be overwritten the next time you run `python3 scripts/build_content.py`.
