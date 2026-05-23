# Editable Site Data

Edit these files when you want the deployed website to change, then commit and push.

- `books.json`: public Library entries.
- `fiction.json`: public Fiction pieces.
- `reflections.json`: public Reflection notes.
- `extra.json`: public Extra posts.
- `site-content.json`: navigation text, module copy, bilingual labels, and reusable page text.

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

### `fiction.json`, `reflections.json`, `extra.json`

```json
{
  "id": "unique-id",
  "title": "Entry title",
  "category": "Optional category",
  "body": "Your text",
  "createdAt": "2026-05-23T00:00:00.000Z"
}
```

For `extra.json`, `category` is optional and can be omitted.
