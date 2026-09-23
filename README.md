# Abivan's personal portfolio

A personal portfolio for Abivan, drawn as a KiCad-style schematic sheet. The LeBron fan page and the EPL predictor are intentionally excluded from the portfolio index.

The site has two pages: the home page (`index.html`) shows a few highlighted projects, and the projects page (`projects/index.html`, served at `/projects/`) lists every project. Both are built as real pages, so no host rewrite rules are needed. Projects come from public GitHub repositories plus hand-listed builds without a repo; results and dates live in `scripts/sync-projects.mjs`, and timeline events not tied to a project live in `src/data/events.json`.

## Develop locally

```sh
npm install
npm run sync:projects
npm run dev
```

`sync:projects` refreshes the committed project snapshot from GitHub metadata and repository READMEs. `npm run build` refreshes it before compiling; if GitHub is unavailable, the build keeps using the committed snapshot.

## Build and inspect

```sh
npm run build
npm run preview
npm run lint
```

## Stack

- React and TypeScript
- Vite
- Motion for React
- GitHub REST API for build-time project metadata
