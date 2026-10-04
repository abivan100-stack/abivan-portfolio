import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import ProjectDetailPage from './ProjectDetailPage'
import ProjectsPage from './ProjectsPage'
import ToolkitPage from './ToolkitPage'
import { TodayProvider } from './lib/today'
import { findProjectByPathSlug, orderedProjects, projectPathSlug, splitProjectName } from './lib/portfolio'

export type PageName = 'home' | 'projects' | 'toolkit'

// One page per project, for the build to write out at /projects/<path>/.
export const projectPages = orderedProjects.map((project) => ({
  path: projectPathSlug(project.slug),
  title: splitProjectName(project.name)[0],
  description: project.overview,
}))

function renderMarkup(content: React.ReactNode, today: string) {
  return renderToString(
    <StrictMode>
      <TodayProvider initialToday={today}>{content}</TodayProvider>
    </StrictMode>,
  )
}

export function renderPage(page: PageName, today: string) {
  const content = page === 'home'
    ? <App initialView="schematic" />
    : page === 'projects'
      ? <ProjectsPage />
      : <ToolkitPage />

  return renderMarkup(content, today)
}

export function renderProjectPage(path: string, today: string) {
  const project = findProjectByPathSlug(path)
  if (!project) throw new Error(`No project has the page path "${path}".`)
  return renderMarkup(<ProjectDetailPage project={project} />, today)
}
