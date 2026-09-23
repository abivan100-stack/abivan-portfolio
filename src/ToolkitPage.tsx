import { BomTable } from './components/BomTable'
import { NetLabel, PageFrame } from './components/Sheet'
import { useNetFlash } from './lib/hooks'
import { HOME_URL, PROJECTS_URL } from './lib/portfolio'
import './App.css'

// Sheet 3 of 3: the toolkit as a bill of materials. Reached from the Toolkit link in the header.
// "Back to top" targets #top, which PageFrame (components/Sheet.tsx) puts on its outer frame.
function ToolkitPage() {
  useNetFlash()

  const nav = [
    { href: `${HOME_URL}#about`, label: 'About' },
    { href: PROJECTS_URL, label: 'Projects' },
    { href: '#toolkit', label: 'Toolkit', active: true, current: 'page' as const },
    { href: `${HOME_URL}#contact`, label: 'Contact' },
  ]

  return (
    <PageFrame
      homeHref={HOME_URL}
      nav={nav}
      footer={<><span>Sheet 3 of 3, drawn by Abivan in Chennai</span><a href="#top">Back to top</a></>}
    >
      <section className="toolkit section" id="toolkit" aria-labelledby="toolkit-title">
        <nav className="sheet-path" aria-label="Breadcrumb">
          <a href={HOME_URL}>abivan</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">toolkit</span>
        </nav>
        <div className="toolkit-head">
          <NetLabel id="toolkit-title">toolkit</NetLabel>
          <p>A bill of materials for my builds: the boards, parts, and software they use. Qty is how many projects use each one.</p>
        </div>
        <BomTable onHome={false} />
        <div className="work-outro toolkit-outro">
          <a className="hier-pin see-all back" href={HOME_URL}>Back to home</a>
          <a className="hier-pin see-all" href={PROJECTS_URL}>See all projects</a>
        </div>
      </section>
    </PageFrame>
  )
}

export default ToolkitPage
