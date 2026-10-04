import { NewTabLink, PageFrame, SheetBreadcrumb } from './components/Sheet'
import { Timeline } from './components/Timeline'
import { usePowerUp, useNetFlash } from './lib/hooks'
import { GITHUB_URL, HOME_URL, PROJECTS_URL } from './lib/portfolio'
import './App.css'

// Sheet 4 of 4: results and recognition across every project, as the timeline. Reached from the Achievements link in the header.
function AchievementsPage() {
  usePowerUp()
  useNetFlash()

  return (
    <PageFrame
      page="achievements"
      homeHref={HOME_URL}
      footer={<><span>Sheet 4 of 4, drawn by Abivan</span><a href="#top">Back to top</a></>}
    >
      <Timeline level={1} breadcrumb={<SheetBreadcrumb current="achievements" />} />
      <div className="work-outro achievements-outro">
        <a className="hier-pin see-all back" href={HOME_URL}>Back to home</a>
        <a className="hier-pin see-all" href={PROJECTS_URL}>See all projects</a>
        <p>More experiments live on <NewTabLink href={GITHUB_URL}>my GitHub</NewTabLink>.</p>
      </div>
    </PageFrame>
  )
}

export default AchievementsPage
