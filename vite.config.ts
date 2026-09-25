import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The api/ functions only run on Vercel, where the GitHub token lives. Locally, dev and preview pass them to
// the deployed site, so the GitHub activity calendar shows real data without a token.
const apiProxy = { '/api': { target: 'https://abivan-dev.vercel.app', changeOrigin: true } }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
  build: {
    // Real pages, so /projects/ and /toolkit/ work on any static host without rewrite rules.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        projects: fileURLToPath(new URL('./projects/index.html', import.meta.url)),
        toolkit: fileURLToPath(new URL('./toolkit/index.html', import.meta.url)),
      },
    },
  },
})
