import { motion, MotionConfig, useReducedMotion } from 'motion/react'
import projects from './data/projects.json'
import './App.css'

type Project = (typeof projects)[number]

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="project-row">
      <div className="project-heading">
        <h3>{project.name}</h3>
        {project.language && <span className="project-language">{project.language}</span>}
      </div>
      <div className="project-description-block">
        <p>{project.summary || 'The repository does not include a project description yet.'}</p>
        {project.contextNote && project.contextNote.trim() !== project.summary.trim() && <p className="project-context">{project.contextNote}</p>}
        <div className="project-links">
          <a href={project.url} target="_blank" rel="noreferrer">Repository</a>
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">Live demo</a>}
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
          <a className="wordmark" href="#top" aria-label="Abivan, back to top">Abivan<span className="wordmark-dot" /></a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#work">Selected work</a>
            <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </header>

        <main>
          <section className="personal-intro" aria-labelledby="intro-title">
            <h1 id="intro-title">Abivan</h1>
            <motion.div className="signature-rule" aria-hidden="true"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }} />
            <div className="intro-details">
              <div className="intro-role">
                <p>Software developer</p>
                <span>Based in Chennai</span>
              </div>
              <p className="intro-description">I build practical digital products, from clear interfaces to the systems behind them.</p>
              <a className="intro-link" href="#about">About Abivan</a>
            </div>
          </section>

          <section className="about-section" id="about" aria-labelledby="about-title">
            <h2 id="about-title">About Abivan</h2>
            <div className="about-copy">
              <p>I’m Abivan, a software developer in Chennai. I build practical digital products, bringing together clear interfaces and the systems behind them.</p>
              <p>Recent work spans energy, health, fitness, agriculture and civic technology.</p>
            </div>
          </section>

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
            <div>
              <h2>More of my work</h2>
              <p>Browse the complete project history on GitHub.</p>
            </div>
            <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">Visit GitHub profile</a>
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
