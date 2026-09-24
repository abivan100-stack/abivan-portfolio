import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import ProjectsPage from './ProjectsPage'
import ToolkitPage from './ToolkitPage'
import { TodayProvider } from './lib/today'

export type PageName = 'home' | 'projects' | 'toolkit'

export function renderPage(page: PageName, today: string) {
  const content = page === 'home'
    ? <App initialView="schematic" />
    : page === 'projects'
      ? <ProjectsPage />
      : <ToolkitPage />

  return renderToString(
    <StrictMode>
      <TodayProvider initialToday={today}>{content}</TodayProvider>
    </StrictMode>,
  )
}
