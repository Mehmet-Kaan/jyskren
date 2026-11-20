# jyskren

Redesigned JYSKREN website with the original Danish content preserved.

Customer preview: https://Mehmet-Kaan.github.io/jyskren/

## Local preview

Run `npm start`, then open http://127.0.0.1:3000/.

## GitHub Pages

Pushes to `main` build the static website and publish it through the `Publish customer preview` workflow. The build copies `site/` into `dist/` and adapts internal links and assets to the `/jyskren/` project address. Original source pages remain usable locally.

Run `npm run build:pages` to prepare the same output locally. Set `PAGES_BASE_PATH=/` to build for a root domain.

This is a static customer preview. Contact-form delivery requires a backend; the existing phone and email links remain available.

## Files

- `site/`: complete website and locally hosted assets
- `src/`: editable source pages, styling, scripts, and image assets
- `scripts/build-pages.mjs`: static GitHub Pages preparation
- `.github/workflows/pages.yml`: automatic publishing
