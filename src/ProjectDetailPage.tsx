import { useEffect, type CSSProperties } from 'react'
import { NewTabLink, PageFrame, SheetBreadcrumb } from './components/Sheet'
import { usePowerUp } from './lib/hooks'
import { useToday } from './lib/useToday'
import {
  HOME_URL,
  PROJECTS_URL,
  formatDate,
  formatDateRange,
  getProjectCategories,
  getProjectParts,
  isUpcoming,
  orderedProjects,
  projectPageHref,
  splitProjectName,
  type Project,
  type Recognition,
} from './lib/portfolio'
import './App.css'
import './ProjectDetailPage.css'

// A project's own page: the detail behind "Know more" on the cards. Each section is a sub-sheet on the
// same bus as the projects list, so the page reads as one sheet opened from the hierarchy above it.
function ProjectDetailPage({ project }: { project: Project }) {
  const today = useToday()
  const [title, subtitle] = splitProjectName(project.name)
  const categories = getProjectCategories(project.slug)
  const parts = getProjectParts(project.slug)
  const recognitions = project.recognitions as Recognition[]
  const position = orderedProjects.findIndex((candidate) => candidate.slug === project.slug)
  const newer = orderedProjects[position - 1]
  const older = orderedProjects[position + 1]
  usePowerUp()

  useEffect(() => {
    document.title = `${title} | Abivan`
  }, [title])

  const sections = [
    { id: 'about', name: 'Overview' },
    ...(project.highlights.length ? [{ id: 'highlights', name: 'What it does' }] : []),
    ...(recognitions.length ? [{ id: 'results', name: 'Results & recognition' }] : []),
    ...(parts.length ? [{ id: 'parts', name: 'Built with' }] : []),
    { id: 'details', name: 'Details' },
  ]

  return (
    <PageFrame
      page="project"
      homeHref={HOME_URL}
      footer={<><span>Sheet 2 of 4, drawn by Abivan</span><a href="#top">Back to top</a></>}
    >
      <article className="work project-detail section" aria-labelledby="detail-title" data-power-up>
        <SheetBreadcrumb current={title} via={{ label: 'projects', href: PROJECTS_URL }} />
        <header className="detail-head">
          <p className="detail-kind">
            {[...categories, project.language].filter(Boolean).join(' · ') || 'Project'}
          </p>
          <h1 id="detail-title">{title}</h1>
          {subtitle && <p className="detail-subtitle">{subtitle}</p>}
          <p className="detail-lead">{project.overview}</p>
          {(project.url || project.demoUrl) && (
            <div className="sheet-pins">
              {project.demoUrl && <NewTabLink className="hier-pin" href={project.demoUrl}>Open live demo</NewTabLink>}
              {project.url && <NewTabLink className="hier-pin" href={project.url}>Source repository</NewTabLink>}
            </div>
          )}
        </header>

        <ol className="sheet-bus">
          {sections.map((section, index) => (
            <li className="sub-sheet" key={section.id} style={{ '--n': index } as CSSProperties}>
              <h2 className="sheet-name">{section.name}</h2>
              <div className="sheet-box" id={`detail-${section.id}`}>
                {section.id === 'about' && (
                  <>
                    <p>{project.summary || 'Project description coming soon.'}</p>
                    {project.contextNote && project.contextNote.trim() !== project.summary.trim() && (
                      <p className="sheet-context">{project.contextNote}</p>
                    )}
                  </>
                )}
                {section.id === 'highlights' && (
                  <ul className="detail-list">
                    {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                )}
                {section.id === 'results' && (
                  <ul className="detail-results">
                    {recognitions.map((recognition) => (
                      <li key={recognition.text}>
                        <time dateTime={recognition.dates[0]}>{formatDateRange(recognition.dates)}</time>
                        <span>
                          {recognition.text}
                          {isUpcoming(recognition.dates, today) && <span className="upcoming-tag">Upcoming</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.id === 'parts' && (
                  <ul className="detail-parts">
                    {parts.map((part) => (
                      <li key={part.part}>
                        <span className="part-group">{part.group}</span>
                        <span className="part-name">{part.part}</span>
                        <span className="part-note">{part.note}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.id === 'details' && (
                  <dl className="detail-facts">
                    <div><dt>Type</dt><dd>{categories.join(' and ') || 'Project'}</dd></div>
                    <div><dt>Language</dt><dd>{project.language || 'Not listed'}</dd></div>
                    <div><dt>Last updated</dt><dd>{formatDate(project.updatedAt)}</dd></div>
                    <div>
                      <dt>Source</dt>
                      <dd>{project.url ? <NewTabLink href={project.url}>GitHub repository</NewTabLink> : 'No public repository'}</dd>
                    </div>
                    <div>
                      <dt>Live demo</dt>
                      <dd>{project.demoUrl ? <NewTabLink href={project.demoUrl}>Open live demo</NewTabLink> : 'No live demo'}</dd>
                    </div>
                  </dl>
                )}
              </div>
            </li>
          ))}
        </ol>

        <nav className="detail-outro" aria-label="More projects">
          <a className="hier-pin see-all back" href={PROJECTS_URL}>All projects</a>
          {newer && <a className="hier-pin see-all back" href={projectPageHref(newer.slug)} rel="prev">Newer: {splitProjectName(newer.name)[0]}</a>}
          {older && <a className="hier-pin see-all" href={projectPageHref(older.slug)} rel="next">Older: {splitProjectName(older.name)[0]}</a>}
        </nav>
      </article>
    </PageFrame>
  )
}

export default ProjectDetailPage
