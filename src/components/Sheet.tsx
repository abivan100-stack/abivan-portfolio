import type { CSSProperties, ReactNode } from 'react'
import { formatDate, formatDateRange, isUpcoming, projectAnchor, GITHUB_URL, type Project, type Recognition } from '../lib/portfolio'

const rulerNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
const rulerLetters = ['A', 'B', 'C', 'D', 'E', 'F']

export type NavItem = { href: string; label: string; active?: boolean; current?: 'location' | 'page' }

// The drawing frame shared by every page: zone rulers, the sheet, the header and the footer.
export function PageFrame({ homeHref, nav, footer, children }: { homeHref: string; nav: NavItem[]; footer: ReactNode; children: ReactNode }) {
  return (
    <div className="frame" id="top">
      <div className="ruler ruler-top" aria-hidden="true">{rulerNumbers.map((n) => <span key={n}>{n}</span>)}</div>
      <div className="ruler ruler-left" aria-hidden="true">{rulerLetters.map((l) => <span key={l}>{l}</span>)}</div>
      <div className="ruler ruler-right" aria-hidden="true">{rulerLetters.map((l) => <span key={l}>{l}</span>)}</div>
      <div className="ruler ruler-bottom" aria-hidden="true">{rulerNumbers.map((n) => <span key={n}>{n}</span>)}</div>

      <div className="sheet">
        <header className="site-header">
          <a className="wordmark" href={homeHref} aria-label="Abivan, home">abivan</a>
          <nav aria-label="Main navigation">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={item.active ? 'is-active' : undefined}
                aria-current={item.active ? item.current ?? 'location' : undefined}
              >
                {item.label}
              </a>
            ))}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site-footer">{footer}</footer>
      </div>
    </div>
  )
}

export function NetLabel({ id, children }: { id: string; children: string }) {
  return (
    <h2 className="net-label" id={id}>
      <span>{children}</span>
    </h2>
  )
}

export function ProjectSheet({ project, index }: { project: Project; index: number }) {
  const [projectTitle, projectSubtitle] = project.name.split(/\s+--\s+/, 2)
  return (
    <li className="sub-sheet" id={projectAnchor(project.slug)} style={{ '--n': index } as CSSProperties}>
      <h3 className="sheet-name">
        {project.url ? <a href={project.url} target="_blank" rel="noreferrer">{projectTitle}</a> : projectTitle}
      </h3>
      <div className="sheet-box">
        {projectSubtitle && <p className="sheet-subtitle">{projectSubtitle}</p>}
        <p>{project.summary || 'Project description coming soon.'}</p>
        {project.contextNote && project.contextNote.trim() !== project.summary.trim() && (
          <p className="sheet-context">{project.contextNote}</p>
        )}
        {project.recognitions.length > 0 && (
          <div className="sheet-recognition">
            <span className="recognition-label">Results &amp; Recognition</span>
            <ul>
              {(project.recognitions as Recognition[]).map((recognition) => (
                <li key={recognition.text}>
                  {recognition.text}
                  {isUpcoming(recognition.dates) && <span className="upcoming-tag">Upcoming: {formatDateRange(recognition.dates)}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(project.url || project.demoUrl) && (
          <div className="sheet-pins">
            {project.url && <a className="hier-pin" href={project.url} target="_blank" rel="noreferrer">Source repository</a>}
            {project.demoUrl && <a className="hier-pin" href={project.demoUrl} target="_blank" rel="noreferrer">Open live demo</a>}
          </div>
        )}
      </div>
      <p className="sheet-file">
        <span>File: {project.slug}</span>
        <span>{project.language || 'Project'}</span>
        <span>Updated {formatDate(project.updatedAt)}</span>
      </p>
    </li>
  )
}
