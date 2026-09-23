import { motion, MotionConfig, useReducedMotion } from 'motion/react'
import projects from './data/projects.json'
import './App.css'

type Project = (typeof projects)[number]

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.article
      className="project-row"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.25 }}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: index * 0.06 } } }}
    >
      <div className="project-name">
        <span className="project-type">{project.language || 'Project'}</span>
        <h3>{project.name}</h3>
      </div>
      <div className="project-detail">
        <p>{project.summary || 'The repository does not include a project description yet.'}</p>
        {project.contextNote && project.contextNote.trim() !== project.summary.trim() && <p className="project-context">{project.contextNote}</p>}
        <div className="project-links">
          <a href={project.url} target="_blank" rel="noreferrer">Source repository <span aria-hidden="true">↗</span></a>
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">Open live demo <span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </motion.article>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const orderedProjects = [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  const entrance = (delay: number) => reduceMotion ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } } }

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell" id="top">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Abivan, back to top">abivan<span aria-hidden="true">.</span></a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#work">Selected work</a>
            <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
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
            <a className="scroll-cue" href="#about"><span aria-hidden="true" /> Scroll to explore</a>
          </section>

          <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
            <div className="section-side">
              <span className="section-mark" aria-hidden="true">✳</span>
              <h2 id="about-title">A bit<br />about me</h2>
            </div>
            <motion.div className="about-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
              <p className="about-lead">I’m Abivan, a 14-year-old robotics enthusiast and vibe coder based in Chennai.</p>
              <p>I study at Velammal Academy, Nolambur. Claude Code and Codex are my main coding tools; I use them to explore ideas, build software, and experiment with how hardware and code can work together.</p>
              <a className="text-link" href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">Find me on GitHub <span aria-hidden="true">↗</span></a>
            </motion.div>
          </section>

          <section className="work-section" id="work" aria-labelledby="work-title">
            <div className="work-top section-wrap">
              <div>
                <span className="work-kicker">A few things I’ve made</span>
                <h2 id="work-title">Selected work<span className="hero-period">.</span></h2>
              </div>
              <p>Small and large ideas, built with care.<br />The details are in each repository.</p>
            </div>
            <div className="project-list section-wrap">
              {orderedProjects.map((project, index) => <ProjectRow project={project} index={index} key={project.slug} />)}
            </div>
            <div className="work-outro section-wrap">
              <span>More experiments and source code</span>
              <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">Explore my GitHub <span aria-hidden="true">↗</span></a>
            </div>
          </section>

          <section className="closing-note" aria-label="Contact and profile links">
            <div className="closing-inner">
              <div>
                <span className="closing-kicker">Have something in mind?</span>
                <h2>Let’s make it<br />work beautifully.</h2>
              </div>
              <a href="https://github.com/abivan100-stack" target="_blank" rel="noreferrer">Say hello on GitHub <span aria-hidden="true">↗</span></a>
              <span className="closing-orbit" aria-hidden="true"><i /><i /><i /></span>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>Abivan <span className="footer-dot">/</span> Chennai, India</span>
          <span>Designed and built with care</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default App
