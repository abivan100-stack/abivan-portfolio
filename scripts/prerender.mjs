import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const pages = [
  { name: 'home', file: 'index.html' },
  { name: 'projects', file: 'projects/index.html' },
  { name: 'toolkit', file: 'toolkit/index.html' },
]
// The build cannot know each visitor's local date. Leave date-dependent labels off the static markup;
// TodayProvider fills in the visitor's date immediately after hydration.
const renderDate = ''
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js')
const { renderPage } = await import(`${pathToFileURL(serverEntry).href}?v=${Date.now()}`)

for (const page of pages) {
  const outputPath = path.join(root, 'dist', page.file)
  const html = await readFile(outputPath, 'utf8')
  const placeholder = '<div id="root"></div>'
  if (!html.includes(placeholder)) throw new Error(`Could not find the empty #root element in ${page.file}.`)

  const markup = renderPage(page.name, renderDate)
  if (!markup.includes('<main')) throw new Error(`The ${page.name} page rendered without its main content.`)
  const renderedRoot = `<div id="root" data-render-date="${renderDate}">${markup}</div>`
  await writeFile(outputPath, html.replace(placeholder, renderedRoot))
}

console.log(`Pre-rendered ${pages.length} pages with visitor-local date labels deferred until hydration.`)
