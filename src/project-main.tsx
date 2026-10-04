import './index.css'
import ProjectDetailPage from './ProjectDetailPage.tsx'
import { mountPage } from './lib/mount'
import { PROJECTS_URL, findProjectByPathSlug } from './lib/portfolio'

// The pre-rendered page names its project on #root. In dev there is no pre-rendering, so the slug comes from the path.
const root = document.getElementById('root')
const pathSlug = root?.dataset.project || window.location.pathname.split('/').filter(Boolean).pop() || ''
const project = findProjectByPathSlug(pathSlug)

if (project) mountPage(<ProjectDetailPage project={project} />)
else window.location.replace(PROJECTS_URL)
