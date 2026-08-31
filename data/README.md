# Editable Site Data

Edit these files when you want the deployed website to change, then commit and push.

- `books.json`: public Library entries.
- `fiction.json`: generated from `content/fiction/*.md`.
- `reflections.json`: generated from `content/reflections/*.md`.
- `extra.json`: generated from `content/extra/*.md`.
- `site-content.json`: navigation text, module copy, bilingual labels, and reusable page text.

Prefer editing Markdown files in `content/` for writing entries. Run `python3 scripts/build_content.py` after changing Markdown.

## Entry Formats

### `books.json`

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
