import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// The api/ functions only run on Vercel, where the GitHub token lives. Locally, dev and preview pass them to
// the deployed site, so the GitHub activity calendar shows real data without a token.
const apiProxy = { '/api': { target: 'https://abivan-dev.vercel.app', changeOrigin: true } }

// Project pages (/projects/<slug>/) are written out by the build. The dev server has no such files, so it
// serves the project/ template for them and the page reads its slug from the path.
const projectPagesInDev: Plugin = {
  name: 'project-pages-in-dev',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      const [path, query = ''] = (request.url ?? '').split('?')
      if (/^\/projects\/[^/.]+\/?$/.test(path)) request.url = `/project/index.html${query ? `?${query}` : ''}`
      next()
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), projectPagesInDev],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
  build: {
    // Real pages, so /projects/ and /toolkit/ work on any static host without rewrite rules.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        projects: fileURLToPath(new URL('./projects/index.html', import.meta.url)),
        project: fileURLToPath(new URL('./project/index.html', import.meta.url)),
        toolkit: fileURLToPath(new URL('./toolkit/index.html', import.meta.url)),
      },
    },
  },
})
