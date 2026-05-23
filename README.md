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

The public website is read-only. Edit the files in `data/`, then commit and push to update the deployed site:

- `data/books.json`: Library books.
- `data/fiction.json`: Fiction pieces.
- `data/reflections.json`: Reflection notes.
- `data/extra.json`: Extra posts.
- `data/site-content.json`: page labels, module text, and bilingual UI copy.

Preview through a local server after changing JSON, because browsers block `fetch()` for local files opened directly from Finder.

## Assets

The painted page background is saved locally at `assets/monet-la-seine-argenteuil.jpg` so the site does not depend on a remote image URL at runtime.
