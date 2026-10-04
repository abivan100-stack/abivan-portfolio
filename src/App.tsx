import { useEffect, useState, type CSSProperties } from 'react'
import { NetLabel, NewTabLink, PageFrame, ProjectCard } from './components/Sheet'
import { usePowerUp, useNetFlash } from './lib/hooks'
import { useToday } from './lib/useToday'
import { type HeroView, VIEW_KEY } from './lib/hero-view'
import {
  CV_URL, EMAIL, GITHUB_URL, PROJECTS_URL, projectPageHref, featuredProjects, formatDateRange, heroResults, lastUpdated, nextUp, orderedProjects,
} from './lib/portfolio'
import './App.css'

const inputPins = ['ideas', 'Claude Code', 'Codex', 'hardware']
const outputPins = [
  { num: 8, name: 'about', href: '#about' },
  { num: 7, name: 'projects', href: '#work' },
  { num: 6, name: 'contact', href: '#contact' },
  { num: 5, name: 'GitHub', href: GITHUB_URL, external: true },
]
function App({ initialView = 'schematic' }: { initialView?: HeroView }) {
  const today = useToday()
  const upcoming = nextUp(today)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [heroView, setHeroView] = useState<HeroView>(initialView)
  usePowerUp()
  useNetFlash()

  // The nav highlights the last section whose top has passed a line 35% down the viewport. The hero has
  // no nav link, so nothing is highlighted over it. Contact is too short to reach the line, so it wins
  // once the page is scrolled to the bottom.
  useEffect(() => {
    const ids = ['about', 'work', 'contact']
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.35
      let current: string | null = null
      for (const id of ids) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= line) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = 'contact'
      setActiveSection(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, heroView)
    } catch {
      // Storage can be unavailable (private windows, blocked site data); the toggle still works for this visit.
    }
  }, [heroView])

  return (
    <PageFrame
      page="home"
      activeSection={activeSection}
      homeHref="#top"
      footer={<><span>Drawn by Abivan</span><a href="#top">Back to top</a></>}
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
              <h1 id="intro-title">Abivan Vijay</h1>
              <p className="chip-description">I’m 14. I turn ideas into software, experiments, and things that move.</p>
            </div>
            <ul className="pins pins-out" aria-label="Where to go next">
              {outputPins.map((pin, i) => (
                <li key={pin.name} style={{ '--i': i + inputPins.length } as CSSProperties}>
                  <span className="pin-num" aria-hidden="true">{pin.num}</span>
                  {pin.external
                    ? <NewTabLink className="pin-name" href={pin.href}>{pin.name}</NewTabLink>
                    : <a className="pin-name" href={pin.href}>{pin.name}</a>}
                  <span className="pulse" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
          <span className="chip-value">Robotics enthusiast and vibe coder</span>
          <span className="board-led" aria-hidden="true"><span className="led" />D1</span>
        </div>
        <ul className="hero-results" aria-label="Recent results">
          {heroResults.map((result, i) => (
            <li key={result.slug} style={{ '--i': i } as CSSProperties}>
              <a href={projectPageHref(result.slug)}>
                <span className="result-label">{result.label}</span>
                <span className="result-title">{result.title}</span>
                <span className="result-detail">{result.detail}</span>
                <time dateTime={result.dates[0]}>{formatDateRange(result.dates)}</time>
              </a>
            </li>
          ))}
        </ul>
        <div className="hero-foot">
          {/* Reserved height: the date is only known after hydration, so this fills in without moving the page */}
          <p className="hero-next">
            {upcoming && (
              <>
                <span className="upcoming-tag">Next up</span>
                <time dateTime={upcoming.dates[0]}>{formatDateRange(upcoming.dates)}</time>
                <span>{upcoming.title}: {upcoming.text}</span>
              </>
            )}
          </p>
          <div className="hero-actions">
            <a className="hier-pin see-all hier-pin-primary" href="#work">See my projects</a>
            <a className="hier-pin see-all" href="#contact">Get in touch</a>
          </div>
        </div>
      </section>

      <section className="about section" id="about" aria-labelledby="about-title">
        <NetLabel id="about-title">about</NetLabel>
        <div className="about-copy">
          <p className="about-lead">I build robots, ESP32 hardware and web apps, and take them to competitions and expos.</p>
          <p>I study at Velammal Academy, Nolambur. Claude Code and Codex are my main coding tools; I use them to explore ideas, build software, and experiment with how hardware and code can work together.</p>
        </div>
      </section>

      <section className="work section" id="work" aria-labelledby="work-title" data-power-up>
        <div className="work-head">
          <NetLabel id="work-title">projects</NetLabel>
          <p>The projects that came with a result, newest first.</p>
        </div>
        <ol className="sheet-bus">
          {featuredProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}
        </ol>
        <div className="work-outro">
          <a className="hier-pin see-all" href={PROJECTS_URL}>See all {orderedProjects.length} projects</a>
          <p>More experiments live on <NewTabLink href={GITHUB_URL}>my GitHub</NewTabLink>.</p>
        </div>
      </section>

      <section className="contact section" id="contact" aria-labelledby="contact-title">
        <NetLabel id="contact-title">contact</NetLabel>
        <div className="title-block">
          <div className="tb-main">
            <p className="tb-heading">Want to know more about a build? Email me.</p>
            <a className="tb-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <p className="tb-cv"><NewTabLink href={CV_URL}>View my CV</NewTabLink> (PDF, 1 page)</p>
          </div>
          <dl className="tb-grid">
            <div><dt>GitHub</dt><dd><NewTabLink href={GITHUB_URL}>abivan100-stack</NewTabLink></dd></div>
            <div><dt>Location</dt><dd>Chennai, India</dd></div>
            <div><dt>Updated</dt><dd>{lastUpdated}</dd></div>
            <div><dt>Sheet</dt><dd>1 of 3</dd></div>
          </dl>
        </div>
      </section>
    </PageFrame>
  )
}

export default App
