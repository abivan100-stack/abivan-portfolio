import { motion, MotionConfig, useReducedMotion } from 'motion/react'
import projects from './data/projects.json'
import './App.css'

type Project = (typeof projects)[number]

function PersonalMark() {
  return (
    <div className="personal-mark" role="img" aria-label="Geometric A monogram for Abivan">
      <svg viewBox="0 0 340 340" aria-hidden="true">
        <circle className="mark-orbit" cx="170" cy="170" r="148" />
        <circle className="mark-orbit mark-orbit-inner" cx="170" cy="170" r="128" />
        <path className="mark-letter" d="M88 260 170 74l82 186M119 190h102" />
        <path className="mark-inscription" d="M44 170h18m216 0h18M170 22v18m0 260v18" />
        <circle className="mark-spark" cx="268" cy="90" r="5" />
      </svg>
      <span>Abivan<br />Chennai</span>
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
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Abivan, back to top">Abivan<span>.</span></a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#work">Selected work</a>
            <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </nav>
        </header>

        <main id="top">
          <motion.section className="personal-intro" aria-labelledby="intro-title"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}>
            <div className="intro-copy">
              <p className="location-line"><span className="location-dot" aria-hidden="true" />Based in Chennai</p>
              <h1 id="intro-title">Hi, I’m<br /><span>Abivan.</span></h1>
              <p className="intro-description">Software builder, based in Chennai.</p>
              <a className="intro-link" href="#about">A little about me <span aria-hidden="true">↓</span></a>
            </div>
            <PersonalMark />
          </motion.section>

          <motion.section className="about-section" id="about" aria-labelledby="about-title"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}>
            <h2 id="about-title">About Abivan</h2>
            <div className="about-copy">
              <p>I’m Abivan, a software builder based in Chennai. I work on web experiences and digital tools, moving between ideas, interface design, and the systems underneath.</p>
              <p>This portfolio brings a selection of that work together in one place.</p>
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
