import { NetLabel, NewTabLink, PageFrame, ProjectSheet } from './components/Sheet'
import { usePowerUp, useNetFlash } from './lib/hooks'
import { GITHUB_URL, HOME_URL, TOOLKIT_URL, orderedProjects } from './lib/portfolio'
import './App.css'

// Sheet 2 of 3: every project, as sub-sheets on one bus. Reached from "See all projects" on the home page.
function ProjectsPage() {
  usePowerUp()
  useNetFlash()

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
          <p>All {orderedProjects.length} projects: robots, hardware builds, web apps, and fan tributes, newest first.</p>
        </div>
        <ol className="sheet-bus">
          {orderedProjects.map((project, index) => <ProjectSheet project={project} index={index} headingLevel={2} key={project.slug} />)}
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
