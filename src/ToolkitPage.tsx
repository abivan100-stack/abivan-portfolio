import { PartsDrawers } from './components/PartsDrawers'
import { NetLabel, PageFrame, SheetBreadcrumb } from './components/Sheet'
import { useNetFlash } from './lib/hooks'
import { HOME_URL, PROJECTS_URL } from './lib/portfolio'
import './App.css'

// Sheet 3 of 3: the toolkit as a parts cabinet. Reached from the Toolkit link in the header.
// "Back to top" targets #top, which PageFrame (components/Sheet.tsx) puts on its outer frame.
function ToolkitPage() {
  useNetFlash()

  return (
    <PageFrame
      page="toolkit"
      homeHref={HOME_URL}
      footer={<><span>Sheet 3 of 3, drawn by Abivan</span><a href="#top">Back to top</a></>}
    >
      <section className="toolkit section" id="toolkit" aria-labelledby="toolkit-title">
        <SheetBreadcrumb current="toolkit" />
        <div className="toolkit-head">
          <NetLabel id="toolkit-title" level={1}>toolkit</NetLabel>
          <p>The boards, parts, and software my builds use, sorted into drawers. The number on each drawer is how many projects use it; open one to see them.</p>
        </div>
        <PartsDrawers />
        <div className="work-outro toolkit-outro">
          <a className="hier-pin see-all back" href={HOME_URL}>Back to home</a>
          <a className="hier-pin see-all" href={PROJECTS_URL}>See all projects</a>
        </div>
      </section>
    </PageFrame>
  )
}

export default ToolkitPage
