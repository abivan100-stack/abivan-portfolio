import { motion, MotionConfig, useReducedMotion } from 'motion/react'
import projects from './data/projects.json'
import './App.css'

type Project = (typeof projects)[number]

function BuildTrace() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="build-trace" aria-hidden="true">
      <svg viewBox="0 0 420 360" fill="none">
        <motion.path className="trace-line trace-line-main" d="M28 266C78 263 79 151 143 130C195 113 225 153 252 203C280 254 327 272 390 226" pathLength={1} initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.35, delay: 0.35, ease: 'easeInOut' }} />
        <motion.path className="trace-line trace-line-second" d="M55 302C100 233 138 191 193 190C252 189 284 133 353 72" pathLength={1} initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.15, delay: 0.55, ease: 'easeInOut' }} />
        <motion.path className="trace-line trace-line-third" d="M66 75C122 94 150 53 204 66C265 81 264 135 316 161C348 177 372 158 395 128" pathLength={1} initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.7, ease: 'easeInOut' }} />
        <circle className="trace-point trace-point-one" cx="28" cy="266" r="4" />
        <circle className="trace-point trace-point-two" cx="353" cy="72" r="4" />
        <circle className="trace-point trace-point-three" cx="395" cy="128" r="4" />
      </svg>
      <span className="trace-caption">Ideas take shape</span>
    </div>
  )
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="project-row">
      <div className="project-name-block">
        <h3>{project.name}</h3>
        {project.language && <span className="project-language">{project.language}</span>}
      </div>
      <div className="project-description-block">
        <p>{project.summary || 'The repository does not include a project description yet.'}</p>
        {project.contextNote && project.contextNote.trim() !== project.summary.trim() && <p className="project-context">{project.contextNote}</p>}
        <div className="project-links">
          <a href={project.url} target="_blank" rel="noreferrer">Repository <span aria-hidden="true">↗</span></a>
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </article>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const orderedProjects = [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <header className="site-header" id="top">
          <a className="wordmark" href="#top" aria-label="Abivan, back to top">Abivan<span>.</span></a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#work">Selected work</a>
            <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </nav>
        </header>

        <main>
          <motion.section className="personal-intro" aria-labelledby="intro-title"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}>
            <div className="intro-copy">
              <p className="location-line"><span className="location-dot" aria-hidden="true" />Based in Chennai</p>
              <h1 id="intro-title">Hi, I’m<br /><span>Abivan.</span></h1>
              <p className="intro-description">I build useful digital tools.</p>
              <a className="intro-link" href="#about">A little about me <span aria-hidden="true">↓</span></a>
            </div>
            <BuildTrace />
          </motion.section>

          <motion.section className="about-section" id="about" aria-labelledby="about-title"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}>
            <h2 id="about-title">About Abivan</h2>
            <div className="about-copy">
              <p>I’m Abivan, a software developer based in Chennai. I build useful digital tools, shaping both the experience people see and the systems that make it work.</p>
              <p>My projects span energy, health, fitness, agriculture and civic data.</p>
            </div>
          </motion.section>

          <section className="work-section" id="work" aria-labelledby="work-title">
            <div className="work-heading">
              <h2 id="work-title">Selected work</h2>
              <p>Projects and experiments from my public repositories.</p>
            </div>
            <div className="project-list">
              {orderedProjects.map((project) => <ProjectRow project={project} key={project.slug} />)}
            </div>
          </section>

          <section className="closing-note" aria-label="GitHub profile">
            <p>The full project history lives on GitHub.</p>
            <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">Visit Abivan on GitHub <span aria-hidden="true">↗</span></a>
          </section>
        </main>

        <footer className="site-footer">
          <span>Abivan · Chennai</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default App
