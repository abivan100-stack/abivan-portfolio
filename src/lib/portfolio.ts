import projects from '../data/projects.json'
import events from '../data/events.json'
import toolkitData from '../data/toolkit.json'

export type Project = (typeof projects)[number]
export type Recognition = { text: string; dates: string[] }

export const GITHUB_URL = 'https://github.com/abivan100-stack'
export const EMAIL = 'abivan100@gmail.com'

// Page URLs respect Vite's base path, so the site still works if it is served from a subfolder.
export const HOME_URL = import.meta.env.BASE_URL
export const PROJECTS_URL = `${import.meta.env.BASE_URL}projects/`
export const TOOLKIT_URL = `${import.meta.env.BASE_URL}toolkit/`

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

// One day, or a first and last day: "29–30 Aug 2026" within a month, otherwise both dates in full.
export const formatDateRange = ([first, last]: string[]) => {
  if (!last || last === first) return formatDate(first)
  if (first.slice(0, 7) === last.slice(0, 7)) return `${Number(first.slice(8))}–${formatDate(last)}`
  return `${formatDate(first)} to ${formatDate(last)}`
}

// A result dated after today (visitor's local date) is still to come; it turns into a normal entry
// on its own once the day arrives.
export const isUpcoming = (dates: string[]) => dates[0] > new Date().toLocaleDateString('en-CA')

export const projectAnchor = (slug: string) => `project-${slug}`

export const orderedProjects = [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
export const lastUpdated = orderedProjects[0] ? formatDate(orderedProjects[0].updatedAt) : ''

// The home page shows these; every project is on the projects page.
const FEATURED_SLUGS = new Set(['robotics-for-good', 'c.r.a.s.h', 'freshsense', 'vault', 'volt-ledger'])
export const featuredProjects = orderedProjects.filter((project) => FEATURED_SLUGS.has(project.slug.toLowerCase()))

// Links to a project's sheet: on the home page for featured projects, otherwise on the projects page.
export const projectHref = (slug: string, onHome: boolean) =>
  onHome && FEATURED_SLUGS.has(slug.toLowerCase()) ? `#${projectAnchor(slug)}` : `${PROJECTS_URL}#${projectAnchor(slug)}`

// Every result across all projects, plus events not tied to a project (events.json), newest first,
// for the timeline, so upcoming events and the latest results lead. A project milestone links to its sheet; an event has no slug and no link.
export const milestones: (Recognition & { slug: string | null; title: string })[] = [
  ...projects.flatMap((project) => (project.recognitions as Recognition[]).map((recognition) => ({
    ...recognition,
    slug: project.slug,
    title: project.name.split(/\s+--\s+/, 1)[0],
  }))),
  ...events.map((event) => ({ ...event, slug: null })),
].sort((a, b) => b.dates[0].localeCompare(a.dates[0]))

// The toolkit (bill of materials): each part links to the projects that use it. Qty is the number of
// those projects, so it stays right as projects are added; unknown slugs are skipped rather than
// rendered as broken links.
type ToolkitRow = { group: string; part: string; note: string; projects: string[] | 'all' }
// Keyed by lower-cased slug so toolkit.json matches regardless of letter case (repo names like C.R.A.S.H).
const projectsBySlug = new Map(projects.map((project) => [
  project.slug.toLowerCase(),
  { slug: project.slug, title: project.name.split(/\s+--\s+/, 1)[0] },
]))

export const toolkit = (toolkitData as ToolkitRow[]).map((row) => {
  const used = row.projects === 'all'
    ? null
    : row.projects.flatMap((slug) => projectsBySlug.get(slug.toLowerCase()) ?? [])
  return { ...row, used, qty: used ? used.length : projects.length }
})
