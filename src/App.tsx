import { useEffect, useState, type CSSProperties } from 'react'
import { NetLabel, PageFrame, ProjectSheet } from './components/Sheet'
import { usePowerUp, useNetFlash } from './lib/hooks'
import {
  EMAIL, GITHUB_URL, PROJECTS_URL, featuredProjects, formatDateRange, isUpcoming, lastUpdated, milestones, orderedProjects, projectHref,
} from './lib/portfolio'
import './App.css'

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

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [heroView, setHeroView] = useState<HeroView>(readSavedView)
  usePowerUp()
  useNetFlash()

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

  const nav = [
    { href: '#about', label: 'About', active: activeSection === 'about' },
    { href: '#work', label: 'Projects', active: activeSection === 'work' },
    { href: '#contact', label: 'Contact', active: activeSection === 'contact' },
  ]

  return (
    <PageFrame
      homeHref="#top"
      nav={nav}
      footer={<><span>Drawn by Abivan in Chennai</span><a href="#top">Back to top</a></>}
    >
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

      <section className="timeline section" id="timeline" aria-labelledby="timeline-title" data-power-up>
        <div className="timeline-head">
          <NetLabel id="timeline-title">timeline</NetLabel>
          <p>Results and recognition so far, in order. Each one is a test point (TP) on the wire, like the numbered probe points on a circuit board.</p>
        </div>
        <ol className="tp-wire">
          {milestones.map((milestone, index) => (
            <li className={isUpcoming(milestone.dates) ? 'tp is-upcoming' : 'tp'} key={`${milestone.slug ?? milestone.title}-${milestone.dates[0]}`} style={{ '--n': index } as CSSProperties}>
              <span className="tp-ref" aria-hidden="true" title={`Test point ${index + 1}`}>TP{index + 1}</span>
              <span className="tp-mark" aria-hidden="true" />
              <div className="tp-when">
                <time dateTime={milestone.dates[0]}>{formatDateRange(milestone.dates)}</time>
                {isUpcoming(milestone.dates) && <span className="upcoming-tag">Upcoming</span>}
              </div>
              {milestone.slug
                ? <a className="tp-project" href={projectHref(milestone.slug, true)}>{milestone.title}</a>
                : <span className="tp-project">{milestone.title}</span>}
              <p>{milestone.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="work section" id="work" aria-labelledby="work-title" data-power-up>
        <div className="work-head">
          <NetLabel id="work-title">projects</NetLabel>
          <p>Four highlights, newest first.</p>
        </div>
        <ol className="sheet-bus">
          {featuredProjects.map((project, index) => <ProjectSheet project={project} index={index} key={project.slug} />)}
        </ol>
        <div className="work-outro">
          <a className="hier-pin see-all" href={PROJECTS_URL}>See all {orderedProjects.length} projects</a>
          <p>More experiments live on <a href={GITHUB_URL} target="_blank" rel="noreferrer">my GitHub</a>.</p>
        </div>
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
            <div><dt>Sheet</dt><dd>1 of 2</dd></div>
          </dl>
        </div>
      </section>
    </PageFrame>
  )
}

export default App
