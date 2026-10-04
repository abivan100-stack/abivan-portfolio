import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const pages = [
  { name: 'home', file: 'index.html' },
  { name: 'projects', file: 'projects/index.html' },
  { name: 'toolkit', file: 'toolkit/index.html' },
  { name: 'achievements', file: 'achievements/index.html' },
]
// The build cannot know each visitor's local date. Leave date-dependent labels off the static markup;
// TodayProvider fills in the visitor's date immediately after hydration.
const renderDate = ''
const siteUrl = 'https://abivan-dev.vercel.app'
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js')
const { renderPage, renderProjectPage, projectPages } = await import(`${pathToFileURL(serverEntry).href}?v=${Date.now()}`)
const placeholder = '<div id="root"></div>'

for (const page of pages) {
  const outputPath = path.join(root, 'dist', page.file)
  const html = await readFile(outputPath, 'utf8')
  if (!html.includes(placeholder)) throw new Error(`Could not find the empty #root element in ${page.file}.`)

  const markup = renderPage(page.name, renderDate)
  if (!markup.includes('<main')) throw new Error(`The ${page.name} page rendered without its main content.`)
  const renderedRoot = `<div id="root" data-render-date="${renderDate}">${markup}</div>`
  await writeFile(outputPath, html.replace(placeholder, renderedRoot))
}

// Each project gets its own page, written from the built project/ page as a template. The template is
// not a page of the site, so it is removed afterwards.
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const templateDir = path.join(root, 'dist', 'project')
const template = await readFile(path.join(templateDir, 'index.html'), 'utf8')
if (!template.includes(placeholder)) throw new Error('Could not find the empty #root element in project/index.html.')

for (const project of projectPages) {
  const markup = renderProjectPage(project.path, renderDate)
  if (!markup.includes('<main')) throw new Error(`The ${project.path} page rendered without its main content.`)
  const values = { title: project.title, description: project.description, url: `${siteUrl}/projects/${project.path}/` }
  const html = template
    .replace(placeholder, `<div id="root" data-render-date="${renderDate}" data-project="${project.path}">${markup}</div>`)
    .replace(/\{\{(title|description|url)\}\}/g, (_, key) => escapeHtml(values[key]))
  const outputDir = path.join(root, 'dist', 'projects', project.path)
  await mkdir(outputDir, { recursive: true })
  await writeFile(path.join(outputDir, 'index.html'), html)
}
await rm(templateDir, { recursive: true, force: true })

console.log(`Pre-rendered ${pages.length} pages and ${projectPages.length} project pages with visitor-local date labels deferred until hydration.`)
