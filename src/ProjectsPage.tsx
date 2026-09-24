import { useState } from 'react'
import { NetLabel, NewTabLink, PageFrame, ProjectSheet } from './components/Sheet'
import { usePowerUp, useNetFlash } from './lib/hooks'
import { GITHUB_URL, getProjectCategories, HOME_URL, TOOLKIT_URL, orderedProjects, type ProjectCategory } from './lib/portfolio'
import './App.css'
import './ProjectsPage.css'

// Sheet 2 of 3: every project, as sub-sheets on one bus. Reached from "See all projects" on the home page.
function ProjectsPage() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const visibleProjects = filter === 'All'
    ? orderedProjects
    : orderedProjects.filter((project) => getProjectCategories(project.slug).includes(filter))
  usePowerUp()
  useNetFlash()

  const chooseFilter = (category: 'All' | ProjectCategory) => {
    let id = window.location.hash.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch {
      id = ''
    }
    const linkedProject = orderedProjects.find((project) => `project-${project.slug}` === id)
    if (category !== 'All' && linkedProject && !getProjectCategories(linkedProject.slug).includes(category)) {
      setFilter('All')
      return
    }
    setFilter(category)
  }

  const nav = [
    { href: `${HOME_URL}#about`, label: 'About' },
    { href: '#all-projects', label: 'Projects', active: true, current: 'page' as const },
    { href: TOOLKIT_URL, label: 'Toolkit' },
    { href: `${HOME_URL}#contact`, label: 'Contact' },
  ]

  return (
    <PageFrame
      homeHref={HOME_URL}
      nav={nav}
      footer={<><span>Sheet 2 of 3, drawn by Abivan</span><a href="#top">Back to top</a></>}
    >
      <section className="work section" id="all-projects" aria-labelledby="all-projects-title" data-power-up>
        <nav className="sheet-path" aria-label="Breadcrumb">
          <a href={HOME_URL}>abivan</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">projects</span>
        </nav>
        <div className="work-head">
          <NetLabel id="all-projects-title" level={1}>projects</NetLabel>
          <div className="projects-controls">
            <div className="view-switch project-filter" role="group" aria-label="Filter projects by type">
              {(['All', 'Hardware', 'Software'] as const).map((category) => (
                <button key={category} type="button" aria-pressed={filter === category} onClick={() => chooseFilter(category)}>
                  {category}
                </button>
              ))}
            </div>
            <p aria-live="polite" aria-atomic="true">
              Showing {visibleProjects.length} {filter === 'All' ? 'projects' : `${filter.toLowerCase()} projects`}, newest first.
            </p>
          </div>
        </div>
        <ol className="sheet-bus">
          {visibleProjects.map((project, index) => <ProjectSheet project={project} index={index} headingLevel={2} key={project.slug} />)}
        </ol>
        <div className="work-outro">
          <a className="hier-pin see-all back" href={HOME_URL}>Back to home</a>
          <p>More experiments live on <NewTabLink href={GITHUB_URL}>my GitHub</NewTabLink>.</p>
        </div>
      </section>
    </PageFrame>
  )
}

export default ProjectsPage
