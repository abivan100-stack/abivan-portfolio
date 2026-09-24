import { StrictMode, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { localToday } from './local-date'
import { TodayProvider } from './today'

export function mountPage(page: ReactNode) {
  const root = document.getElementById('root')
  if (!(root instanceof HTMLElement)) throw new Error('The page root element is missing.')

  const app = (
    <StrictMode>
      <TodayProvider initialToday={root.dataset.renderDate ?? localToday()}>{page}</TodayProvider>
    </StrictMode>
  )

  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
