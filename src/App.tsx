import { useEffect, useRef, useState, type CSSProperties } from 'react'
import projects from './data/projects.json'
import './App.css'

type Project = (typeof projects)[number]

const GITHUB_URL = 'https://github.com/abivan100-stack'
const EMAIL = 'abivan100@gmail.com'

const inputPins = ['ideas', 'Claude Code', 'Codex', 'hardware']
const outputPins = [
  { num: 8, name: 'about', href: '#about' },
  { num: 7, name: 'projects', href: '#work' },
  { num: 6, name: 'contact', href: '#contact' },
  { num: 5, name: 'GitHub', href: GITHUB_URL, external: true },
]
type HeroView = 'schematic' | 'board'
const VIEW_KEY = 'u1-view'

const readSavedView = (): HeroView => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'board' ? 'board' : 'schematic'
  } catch {
    return 'schematic'
  }
}

const rulerNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
const rulerLetters = ['A', 'B', 'C', 'D', 'E', 'F']

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

function NetLabel({ id, children }: { id: string; children: string }) {
  return (
    <h2 className="net-label" id={id}>
      <span>{children}</span>
    </h2>
  )
}

function ProjectSheet({ project, index }: { project: Project; index: number }) {
  const [projectTitle, projectSubtitle] = project.name.split(/\s+--\s+/, 2)
  return (
    <li className="sub-sheet" style={{ '--n': index } as CSSProperties}>
      <h3 className="sheet-name">
        <a href={project.url} target="_blank" rel="noreferrer">{projectTitle}</a>
      </h3>
      <div className="sheet-box">
        {projectSubtitle && <p className="sheet-subtitle">{projectSubtitle}</p>}
        <p>{project.summary || 'Project description coming soon.'}</p>
        {project.contextNote && project.contextNote.trim() !== project.summary.trim() && (
          <p className="sheet-context">{project.contextNote}</p>
        )}
        {project.recognition && (
          <p className="sheet-recognition">
            <span className="recognition-label">Results &amp; Recognition</span>
            {project.recognition}
          </p>
        )}
        <div className="sheet-pins">
          <a className="hier-pin" href={project.url} target="_blank" rel="noreferrer">Source repository</a>
          {project.demoUrl && <a className="hier-pin" href={project.demoUrl} target="_blank" rel="noreferrer">Open live demo</a>}
        </div>
      </div>
      <p className="sheet-file">
        <span>File: {project.slug}</span>
        <span>{project.language || 'Project'}</span>
        <span>Updated {formatDate(project.updatedAt)}</span>
      </p>
    </li>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [heroView, setHeroView] = useState<HeroView>(readSavedView)
  const workRef = useRef<HTMLElement>(null)
  const orderedProjects = [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  const lastUpdated = orderedProjects[0] ? formatDate(orderedProjects[0].updatedAt) : ''

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const sections = ['about', 'work', 'contact']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setActiveSection(current.target.id)
    }, { rootMargin: '-20% 0px -30% 0px', threshold: 0 })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, heroView)
    } catch {
      // Storage can be unavailable (private windows, blocked site data); the toggle still works for this visit.
    }
  }, [heroView])

  // The projects bus is drawn in the first time it scrolls into view. Wires are only hidden once JS
  // has armed the section, so without IntersectionObserver or with reduced motion they simply show.
  useEffect(() => {
    const work = workRef.current
    if (!work || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    work.classList.add('is-armed')
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      work.classList.add('is-live')
      observer.disconnect()
    }, { threshold: 0.12 })
    observer.observe(work)
    return () => observer.disconnect()
  }, [])

  // Following an in-page link highlights the destination's net label, the way KiCad highlights a net you click.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      const id = link?.getAttribute('href')?.slice(1)
      const target = id ? document.getElementById(id) : null
      // Only section links have a label to highlight; #top wraps the whole page.
      const label = target?.tagName === 'SECTION' ? target.querySelector<HTMLElement>('.net-label') : null
      if (!label) return
      label.classList.remove('is-flashing')
      void label.offsetWidth // restart the animation if the same label is clicked twice
      label.classList.add('is-flashing')
    }
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === 'net-flash' && event.target instanceof Element) event.target.classList.remove('is-flashing')
    }
    document.addEventListener('click', onClick)
    document.addEventListener('animationend', onAnimationEnd)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('animationend', onAnimationEnd)
    }
  }, [])

  const navLink = (id: string, label: string) => (
    <a
      href={`#${id}`}
      className={activeSection === id ? 'is-active' : undefined}
      aria-current={activeSection === id ? 'location' : undefined}
    >
      {label}
    </a>
  )

  return (
    <div className="frame" id="top">
      <div className="ruler ruler-top" aria-hidden="true">{rulerNumbers.map((n) => <span key={n}>{n}</span>)}</div>
      <div className="ruler ruler-left" aria-hidden="true">{rulerLetters.map((l) => <span key={l}>{l}</span>)}</div>
      <div className="ruler ruler-right" aria-hidden="true">{rulerLetters.map((l) => <span key={l}>{l}</span>)}</div>
      <div className="ruler ruler-bottom" aria-hidden="true">{rulerNumbers.map((n) => <span key={n}>{n}</span>)}</div>

      <div className="sheet">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Abivan, back to top">abivan</a>
          <nav aria-label="Main navigation">
            {navLink('about', 'About')}
            {navLink('work', 'Projects')}
            {navLink('contact', 'Contact')}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </header>

        <main>
          <section className={`hero is-${heroView}`} aria-labelledby="intro-title">
            <div className="view-switch" role="group" aria-label="Show U1 as">
              {(['schematic', 'board'] as const).map((view) => (
                <button key={view} type="button" aria-pressed={heroView === view} onClick={() => setHeroView(view)}>
                  {view === 'schematic' ? 'Schematic' : 'Board'}
                </button>
              ))}
            </div>
            <div className="chip">
              <span className="chip-ref" aria-hidden="true">U1</span>
              <div className="chip-body">
                <ol className="pins pins-in" aria-label="What goes in">
                  {inputPins.map((name, i) => (
                    <li key={name} style={{ '--i': i } as CSSProperties}>
                      <span className="pin-num" aria-hidden="true">{i + 1}</span>
                      <span className="pin-name">{name}</span>
                      <span className="pulse" aria-hidden="true" />
                    </li>
                  ))}
                </ol>
                <div className="chip-core">
                  <p className="chip-location">Chennai, India</p>
                  <h1 id="intro-title">Abivan</h1>
                  <p className="chip-description">I’m 14. I turn ideas into software, experiments, and things that move.</p>
                </div>
                <ul className="pins pins-out" aria-label="Where to go next">
                  {outputPins.map((pin, i) => (
                    <li key={pin.name} style={{ '--i': i + inputPins.length } as CSSProperties}>
                      <span className="pin-num" aria-hidden="true">{pin.num}</span>
                      <a
                        className="pin-name"
                        href={pin.href}
                        {...(pin.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {pin.name}
                      </a>
                      <span className="pulse" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
              <span className="chip-value">Robotics enthusiast and vibe coder</span>
              <span className="board-led" aria-hidden="true"><span className="led" />D1</span>
            </div>
          </section>

          <section className="about section" id="about" aria-labelledby="about-title">
            <NetLabel id="about-title">about</NetLabel>
            <div className="about-copy">
              <p className="about-lead">I’m Abivan, a 14-year-old robotics enthusiast and vibe coder based in Chennai.</p>
              <p>I study at Velammal Academy, Nolambur. Claude Code and Codex are my main coding tools; I use them to explore ideas, build software, and experiment with how hardware and code can work together.</p>
            </div>
          </section>

          <section ref={workRef} className="work section" id="work" aria-labelledby="work-title">
            <div className="work-head">
              <NetLabel id="work-title">projects</NetLabel>
              <p>Five projects across energy, health, cities, and agriculture, newest first.</p>
            </div>
            <ol className="sheet-bus">
              {orderedProjects.map((project, index) => <ProjectSheet project={project} index={index} key={project.slug} />)}
            </ol>
            <p className="work-outro">
              More experiments live on <a href={GITHUB_URL} target="_blank" rel="noreferrer">my GitHub</a>.
            </p>
          </section>

          <section className="contact section" id="contact" aria-labelledby="contact-title">
            <NetLabel id="contact-title">contact</NetLabel>
            <div className="title-block">
              <div className="tb-main">
                <p className="tb-heading">Have a project in mind? I’d love to hear about it.</p>
                <a className="tb-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
              <dl className="tb-grid">
                <div><dt>GitHub</dt><dd><a href={GITHUB_URL} target="_blank" rel="noreferrer">abivan100-stack</a></dd></div>
                <div><dt>Location</dt><dd>Chennai, India</dd></div>
                <div><dt>Updated</dt><dd>{lastUpdated}</dd></div>
                <div><dt>Sheet</dt><dd>1 of 1</dd></div>
              </dl>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>Drawn by Abivan in Chennai</span>
          <a href="#top">Back to top</a>
        </footer>
      </div>
    </div>
  )
}

export default App
