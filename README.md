# Aquilo

A static personal literature cabinet for books, reading traces, fiction fragments, reflection notes, and loose extras.

## Local Preview

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This site is plain HTML, CSS, and JavaScript. It can be deployed directly with GitHub Pages from the repository root.

Note: user-added books, writing pieces, reflection notes, and extra posts are saved in the visitor's browser via `localStorage`.

## Assets

The painted page background is saved locally at `assets/monet-la-seine-argenteuil.jpg` so the site does not depend on a remote image URL at runtime.
