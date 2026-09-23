import { useEffect, useState } from 'react'
import { motion, MotionConfig, useReducedMotion } from 'motion/react'
import projects from './data/projects.json'
import './App.css'

type Project = (typeof projects)[number]

function ProjectRow({ project }: { project: Project }) {
  const [projectTitle, projectSubtitle] = project.name.split(/\s+--\s+/, 2)
  return (
    <article className="project-row">
      <div className="project-name">
        <span className="project-type">{project.language || 'Project'}</span>
        <h3><a href={project.url} target="_blank" rel="noreferrer">{projectSubtitle ? projectTitle : project.name}</a></h3>
        {projectSubtitle && <span className="project-subtitle">{projectSubtitle}</span>}
      </div>
      <div className="project-detail">
        <p>{project.summary || 'Project description coming soon.'}</p>
        {project.contextNote && project.contextNote.trim() !== project.summary.trim() && <p className="project-context">{project.contextNote}</p>}
        <div className="project-links">
          <a href={project.url} target="_blank" rel="noreferrer">Source repository</a>
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">Open live demo</a>}
        </div>
      </div>
    </article>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const orderedProjects = [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  const entrance = (delay: number) => reduceMotion ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } } }

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

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell" id="top">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Abivan, back to top">abivan<span aria-hidden="true">.</span></a>
          <nav aria-label="Main navigation">
            <a href="#about" className={activeSection === 'about' ? 'is-active' : undefined} aria-current={activeSection === 'about' ? 'location' : undefined}>About</a>
            <a href="#work" className={activeSection === 'work' ? 'is-active' : undefined} aria-current={activeSection === 'work' ? 'location' : undefined}>Work</a>
            <a href="#contact" className={activeSection === 'contact' ? 'is-active' : undefined} aria-current={activeSection === 'contact' ? 'location' : undefined}>Contact</a>
            <a className="github-nav-link" href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">
              <svg className="github-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.64-1.24-1.64-1.01-.7.08-.69.08-.69 1.12.08 1.7 1.15 1.7 1.15 1 .1.76 2.04 3.3 2.04.29-.72.72-1.22 1.23-1.5-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.61 5.22-5.1 5.5.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>
              GitHub
            </a>
          </nav>
        </header>

        <main>
          <section className="hero" aria-labelledby="intro-title">
            <div className="hero-main">
              <motion.p className="hero-location" {...entrance(0.05)}><span className="location-mark" aria-hidden="true" /> Chennai, India</motion.p>
              <motion.h1 id="intro-title" {...entrance(0.14)}>Hello,<br />I’m Abivan<span className="hero-period">.</span></motion.h1>
              <motion.div className="hero-bottom" {...entrance(0.26)}>
                <p className="hero-role">Robotics enthusiast &amp; vibe coder</p>
                <p className="hero-description">I turn ideas into software, experiments, and things that move.</p>
              </motion.div>
            </div>
            <motion.aside className="hero-note" {...entrance(0.3)} aria-label="A little about Abivan">
              <span className="note-symbol" aria-hidden="true"><span /><span /><span /></span>
              <p>Exploring robotics, code, and the ideas that bring them together.</p>
              <a href="#about">A little about me <span aria-hidden="true">↓</span></a>
              <span className="note-index" aria-hidden="true">AB / 01</span>
            </motion.aside>
          </section>

          <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
            <div className="section-side">
              <span className="section-mark" aria-hidden="true">✳</span>
              <h2 id="about-title">A bit<br />about me</h2>
            </div>
            <div className="about-copy">
              <p className="about-lead">I’m Abivan, a 14-year-old robotics enthusiast and vibe coder based in Chennai.</p>
              <p>I study at Velammal Academy, Nolambur. Claude Code and Codex are my main coding tools; I use them to explore ideas, build software, and experiment with how hardware and code can work together.</p>
              <a className="text-link" href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">
                <svg className="github-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.64-1.24-1.64-1.01-.7.08-.69.08-.69 1.12.08 1.7 1.15 1.7 1.15 1 .1.76 2.04 3.3 2.04.29-.72.72-1.22 1.23-1.5-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.61 5.22-5.1 5.5.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
                <span>Find me on GitHub</span>
              </a>
            </div>
          </section>

          <section className="work-section" id="work" aria-labelledby="work-title">
            <div className="work-top section-wrap">
              <div>
                <span className="work-kicker">A few things I’ve made</span>
                <h2 id="work-title">Selected work<span className="hero-period">.</span></h2>
              </div>
              <p>Five projects across energy, health, cities, and agriculture.</p>
            </div>
            <div className="project-list section-wrap">
              {orderedProjects.map((project) => <ProjectRow project={project} key={project.slug} />)}
            </div>
            <div className="work-outro section-wrap">
              <span>More experiments and source code</span>
              <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">Explore my GitHub</a>
            </div>
          </section>

          <section className="closing-note" id="contact" aria-labelledby="contact-title">
            <div className="closing-inner">
              <div>
                <span className="closing-kicker">Have a project in mind?</span>
                <h2 id="contact-title">I’d love to<br />hear about it.</h2>
              </div>
              <div className="closing-links">
                <a className="closing-email" href="mailto:abivan100@gmail.com">abivan100@gmail.com</a>
                <a className="closing-github" href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">Visit GitHub</a>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>Abivan <span className="footer-dot">/</span> Chennai, India</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default App
