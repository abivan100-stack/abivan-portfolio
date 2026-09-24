import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { formatDate, formatDateRange, isUpcoming, projectAnchor, GITHUB_URL, type Project, type Recognition } from '../lib/portfolio'
import { useToday } from '../lib/useToday'

const rulerNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
const rulerLetters = ['A', 'B', 'C', 'D', 'E', 'F']
// The sheet's file name, from its title rather than the repo name: "WriteWise AI" becomes writewise-ai.
const sheetFileName = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// A link that opens in a new tab, and says so to screen readers.
export function NewTabLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} target="_blank" rel="noreferrer">
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}

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
          <a className="wordmark" href={homeHref} aria-label="Abivan, home">
            {/* A tiny U1: the same chip as the hero and the tab icon */}
            <svg className="wordmark-chip" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path className="wordmark-pins" d="M1 10h7M1 16h7M1 22h7M24 10h7M24 16h7M24 22h7" />
              <rect x="8" y="3" width="16" height="26" />
              <text x="16" y="20.5" textAnchor="middle">a</text>
            </svg>
            <span>abivan</span>
          </a>
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
            <NewTabLink href={GITHUB_URL}>GitHub</NewTabLink>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site-footer">{footer}</footer>
      </div>
    </div>
  )
}

// A net label is the section heading. On the projects and toolkit pages it is the page's only h1.
export function NetLabel({ id, level = 2, children }: { id: string; level?: 1 | 2; children: string }) {
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <Heading className="net-label" id={id}>
      <span>{children}</span>
    </Heading>
  )
}

// headingLevel is one below the section heading: 3 under the home page's h2, 2 under the projects page's h1.
export function ProjectSheet({ project, index, headingLevel = 3 }: { project: Project; index: number; headingLevel?: 2 | 3 }) {
  const today = useToday()
  const [projectTitle, projectSubtitle] = project.name.split(/\s+--\s+/, 2)
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <li className="sub-sheet" id={projectAnchor(project.slug)} style={{ '--n': index } as CSSProperties}>
      {/* The title is plain text: the source and demo links below say where each one goes */}
      <Heading className="sheet-name">{projectTitle}</Heading>
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
                  {isUpcoming(recognition.dates, today) && <span className="upcoming-tag">Upcoming: {formatDateRange(recognition.dates)}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(project.url || project.demoUrl) && (
          <div className="sheet-pins">
            {project.url && <NewTabLink className="hier-pin" href={project.url}>Source repository</NewTabLink>}
            {project.demoUrl && <NewTabLink className="hier-pin" href={project.demoUrl}>Open live demo</NewTabLink>}
          </div>
        )}
      </div>
      <p className="sheet-file">
        <span>File: {sheetFileName(projectTitle)}</span>
        <span>{project.language || 'Project'}</span>
        <span>Updated {formatDate(project.updatedAt)}</span>
      </p>
    </li>
  )
}
