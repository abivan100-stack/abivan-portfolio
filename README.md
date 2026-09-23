# Abivan's personal portfolio

A minimalist personal portfolio for Abivan, with a short introduction, About section, and selected work backed by public GitHub repositories.

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
