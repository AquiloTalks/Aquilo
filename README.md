# Aquilo Workflow

## 1. Edit Content

Edit Markdown files in `content/`.

- `content/library/`: books, one file per book
- `content/fiction/`: fiction pieces
- `content/reflections/`: reflection notes
- `content/extra/`: extra notes

Each folder has a `_template.md`. Copy it, rename the copy, then edit the new file.

For bilingual content, use matching filenames:

- `my-piece.en.md`
- `my-piece.zh.md`

If only one language exists, the site uses that version.

## 2. Generate Website Data

After editing content, run:

```sh
python3 scripts/build_content.py
```

If you only changed Library books, you can run:

```sh
python3 scripts/build_content.py library
```

The website reads generated JSON files from `data/`.

The Timeline uses each book's `readDates` and each writing file's `date`. Books without `readDates` do not appear on the Timeline.

## 3. Preview Locally

Run:

```sh
python3 scripts/preview.py
```

Open the URL it prints, such as `http://127.0.0.1:8000`.

## 4. Publish

Commit and push the changes to GitHub.

GitHub Pages updates the live website after the push.
