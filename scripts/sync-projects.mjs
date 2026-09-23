import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const owner = 'abivan100-stack'
const selectedRepositories = [
  'volt-ledger',
  'vault',
  'C.R.A.S.H',
  'pulse-fit',
  'agrifly',
]
// Results and recognition are not on GitHub, so they are kept here and merged into each synced record.
// Each project lists its results oldest first. dates holds the event day, or the first and last
// day of a multi-day event (YYYY-MM-DD).
const recognitionsByRepository = {
  'c.r.a.s.h': [{ text: 'Selected for the National Robotics Championship (NRC)', dates: ['2026-07-22'] }],
  'volt-ledger': [{ text: "Presented at the school's Shark Tank-style pitch competition, with all 14 branches competing", dates: ['2026-08-22'] }],
  vault: [{ text: 'Consolation prize at PEC Hacks 4.0 (hackathon)', dates: ['2026-08-29', '2026-08-30'] }],
}
// Projects without a public GitHub repository, listed as-is alongside the synced ones.
const offlineProjects = [
  {
    slug: 'freshsense',
    name: 'FreshSense -- Automated Food Spoilage Detection System',
    summary: 'An ESP32 build that checks food for spoilage on a conveyor belt. An IR sensor stops each item under two gas sensors, which compare its reading against a clean-air baseline the system calibrates at start-up. The verdict, FRESH or ROTTEN, shows on an LCD and is sent to the Blynk IoT cloud for remote monitoring. Built as a three-person team project.',
    contextNote: null,
    recognitions: [
      { text: 'Participated in the RoboWunder International Competition regionals', dates: ['2026-01-02'] },
      { text: 'Winner, school-level expo', dates: ['2026-02-16'] },
    ],
    url: null,
    demoUrl: null,
    language: 'Arduino C++',
    topics: [],
    stars: 0,
    updatedAt: '2026-02-13T00:00:00Z',
  },
]
const excludedRepositories = ['epl-predictor', 'lebron-fan-page', 'CR7-fan-page', 'rutu-gaikwad-fansite', 'Spike_Fit', 'abivan-portfolio']
const outputPath = fileURLToPath(new URL('../src/data/projects.json', import.meta.url))
const apiHeaders = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'abivan-portfolio-project-index',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function getJson(url) {
  const response = await fetch(url, { headers: apiHeaders })
  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} for ${url}`)
  }
  return response.json()
}

function readmeSummary(markdown = '') {
  const lines = markdown.replace(/\r/g, '').split('\n')
  let started = false
  const summary = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!started) {
      if (line.startsWith('#')) started = true
      continue
    }
    if (!line) {
      if (summary.length) break
      continue
    }
    if (
      line.startsWith('#') ||
      line.startsWith('![') ||
      line.startsWith('<') ||
      line.startsWith('---') ||
      line.startsWith('[![')
    ) continue
    summary.push(line)
  }

  return summary.join(' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function sourceNote(markdown = '') {
  const lines = markdown.replace(/\r/g, '').split('\n')
  const paragraph = []
  let started = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!started) {
      if (line.startsWith('#')) started = true
      continue
    }
    if (!line) {
      if (paragraph.length) {
        const text = paragraph.join(' ')
          .replace(/^>\s?/, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/[*_~`]/g, '')
          .replace(/\u26A0\uFE0F?/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        if (/all data is simulated|nothing real was metered|unofficial fan project|frontend prototype|static prototype/i.test(text)) return text
        paragraph.length = 0
      }
      continue
    }
    if (line.startsWith('#') || line.startsWith('![') || line.startsWith('---')) continue
    paragraph.push(line)
  }

  return null
}

function htmlProjectSummary(html = '') {
  const candidate = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1]
  if (!candidate) return ''
  const text = candidate
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  return text.includes('{{') ? '' : text
}

async function readProjectSnapshot() {
  try {
    const snapshot = JSON.parse(await readFile(outputPath, 'utf8'))
    return Array.isArray(snapshot) ? snapshot : []
  } catch {
    return []
  }
}

function cleanName(text = '') {
  return text.replace(/\s*—\s*/g, ': ')
}

function cleanDescription(text = '', repositoryName = '') {
  let cleaned = text
    .replace(/\s+—\s+/g, '. ')
    .replace(/so you act on what is happening now, not on what already went wrong/gi, 'You can act on current conditions as they unfold')
  cleaned = cleaned.replace(/([.!?]\s+)([a-z])/g, (_, punctuation, letter) => `${punctuation}${letter.toUpperCase()}`)
  if (repositoryName.toLowerCase() === 'vault') {
    cleaned = cleaned.replace(/^A frontend prototype/i, 'A hardware and software project')
  }
  return cleaned
}

try {
  const savedProjects = await readProjectSnapshot()
  const savedByName = new Map(savedProjects.map((project) => [project.slug.toLowerCase(), project]))
  const allRepositories = await getJson(
    `https://api.github.com/users/${owner}/repos?per_page=100&type=owner&sort=updated`,
  )
  const byName = new Map(allRepositories.map((repo) => [repo.name.toLowerCase(), repo]))

  if (selectedRepositories.some((slug) => excludedRepositories.some((excluded) => excluded.toLowerCase() === slug.toLowerCase()))) {
    throw new Error('The selected portfolio list contains an explicitly excluded repository.')
  }

  const projects = await Promise.all(selectedRepositories.map(async (slug) => {
    const repository = byName.get(slug.toLowerCase())
    if (!repository || repository.fork || repository.private) {
      throw new Error(`Expected public, owner-created repository was not found: ${slug}`)
    }

    let summary = repository.description ?? ''
    let readmeTitle = ''
    let contextNote = null
    try {
      const readme = await getJson(`https://api.github.com/repos/${owner}/${encodeURIComponent(repository.name)}/readme`)
      const bytes = Buffer.from(readme.content, 'base64')
      const hasUtf16Nulls = bytes.length > 4 && bytes.filter((byte) => byte === 0).length / bytes.length > 0.12
      const markdown = (hasUtf16Nulls ? bytes.toString('utf16le') : bytes.toString('utf8'))
        .replace(/^[\uFEFF\uFFFD]+/, '')
      readmeTitle = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? ''
      const excerpt = readmeSummary(markdown)
      if (excerpt.length > summary.length) summary = excerpt
      contextNote = sourceNote(markdown)
    } catch (error) {
      console.warn(`README unavailable for ${slug}: ${error.message}`)
      const savedProject = savedByName.get(slug.toLowerCase())
      if (savedProject) {
        readmeTitle = savedProject.name
        summary = savedProject.summary
        contextNote = savedProject.contextNote
      }
    }

    if (!summary) {
      for (const sourceFile of ['index.html', 'PULSE.dc.html']) {
        try {
          const pageResponse = await fetch(`https://raw.githubusercontent.com/${owner}/${repository.name}/${repository.default_branch}/${sourceFile}`, { headers: apiHeaders })
          if (pageResponse.ok) summary = htmlProjectSummary(await pageResponse.text())
          if (summary) break
        } catch (error) {
          console.warn(`Project page unavailable for ${slug}: ${error.message}`)
        }
      }
    }

    return {
      slug: repository.name,
      name: cleanName(readmeTitle || repository.name),
      summary: cleanDescription(summary, repository.name),
      contextNote: repository.name.toLowerCase() === 'vault' ? null : contextNote ? cleanDescription(contextNote, repository.name) : null,
      recognitions: recognitionsByRepository[repository.name.toLowerCase()] ?? [],
      url: repository.html_url,
      demoUrl: repository.homepage || null,
      language: repository.language,
      topics: repository.topics ?? [],
      stars: repository.stargazers_count,
      updatedAt: repository.pushed_at,
    }
  }))

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify([...projects, ...offlineProjects], null, 2)}\n`)
  console.log(`Wrote ${projects.length + offlineProjects.length} verified project records to ${outputPath}`)
} catch (error) {
  const hasSnapshot = await access(outputPath).then(() => true).catch(() => false)
  if (!hasSnapshot) throw error
  const snapshot = JSON.parse(await readFile(outputPath, 'utf8'))
  if (!Array.isArray(snapshot)) throw error
  const offlineSlugs = new Set(offlineProjects.map((project) => project.slug))
  const syncedRecords = snapshot.filter((project) => !offlineSlugs.has(project.slug))
  const syncedSlugs = new Set(syncedRecords.map((project) => project.slug.toLowerCase()))
  if (syncedRecords.length !== selectedRepositories.length || selectedRepositories.some((slug) => !syncedSlugs.has(slug.toLowerCase()))) throw error
  await writeFile(outputPath, `${JSON.stringify([...syncedRecords, ...offlineProjects], null, 2)}\n`)
  console.warn(`GitHub refresh failed (${error.message}); retaining the committed project snapshot.`)
}
