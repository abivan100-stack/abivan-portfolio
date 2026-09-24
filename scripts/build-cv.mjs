// Prints cv/abivan-vijay-cv.html to public/abivan-vijay-cv.pdf with a locally installed Chrome or Edge.
// Not part of `npm run build`: the host has no browser, so the PDF is committed. Run `npm run cv` after editing the CV.
import { execFile } from 'node:child_process'
import { access, mkdtemp, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const sourcePath = fileURLToPath(new URL('../cv/abivan-vijay-cv.html', import.meta.url))
const outputPath = fileURLToPath(new URL('../public/abivan-vijay-cv.pdf', import.meta.url))

const browserCandidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

async function findBrowser() {
  for (const candidate of browserCandidates) {
    try {
      await access(candidate)
      return candidate
    } catch {
      // Try the next location.
    }
  }
  throw new Error('No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser and run again.')
}

const browser = await findBrowser()
// A throwaway profile, so an open browser window cannot take over the headless run.
const profile = await mkdtemp(path.join(tmpdir(), 'abivan-cv-'))
try {
  await run(browser, [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${profile}`,
    '--no-pdf-header-footer',
    // Gives the web font time to load before the page is printed.
    '--virtual-time-budget=10000',
    `--print-to-pdf=${outputPath}`,
    pathToFileURL(sourcePath).href,
  ])
} finally {
  await rm(profile, { recursive: true, force: true })
}

const { size } = await stat(outputPath)
console.log(`Wrote ${path.relative(process.cwd(), outputPath)} (${Math.round(size / 1024)} KB) with ${path.basename(browser)}.`)
