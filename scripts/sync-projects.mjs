import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const owner = 'abivan100-stack'
const selectedRepositories = [
  'volt-ledger',
  'vault',
  'C.R.A.S.H',
  'Write-Wise',
  'rutu-gaikwad-fansite',
]
// Results and recognition are not on GitHub, so they are kept here and merged into each synced record.
// Each project lists its results oldest first. dates holds the event day, or the first and last
// day of a multi-day event (YYYY-MM-DD).
const recognitionsByRepository = {
  'c.r.a.s.h': [
    { text: 'Selected for the National Robotics Championship (NRC)', dates: ['2026-07-22'] },
  ],
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
      { text: 'Participated in the RoboWunder International Competition Regionals', dates: ['2026-01-02'] },
      { text: 'Winner, school-level expo', dates: ['2026-02-16'] },
    ],
    url: null,
    demoUrl: null,
    language: 'Arduino C++',
    topics: [],
    stars: 0,
    updatedAt: '2026-02-13T00:00:00Z',
  },
  {
    slug: 'smart-guard',
    name: 'Smart Guard -- Smart Home Multi-Sensor System',
    summary: 'An ESP32 smart home model that puts security and home monitoring in one unit. An RFID reader checks each card against a list of known IDs and shows a welcome message or Access Denied. A DHT22 tracks temperature and humidity, a capacitive probe measures soil moisture, an MQ2 sensor reads gas levels, and a rain sensor detects water, all shown on an OLED screen with the time from a DS3231 clock. Built as a three-person team project.',
    contextNote: null,
    recognitions: [
      { text: 'Participated in the expo held by SRM University, Ramapuram', dates: ['2025-11-29'] },
    ],
    url: null,
    demoUrl: null,
    language: 'Arduino C++',
    topics: [],
    stars: 0,
    updatedAt: '2025-11-19T00:00:00Z',
  },
  {
    slug: 'robotics-for-good',
    name: 'Robotics for Good -- Autonomous Public-Health Response Robot',
    summary: 'A fully autonomous LEGO SPIKE Prime robot for the Robotics for Good Youth Challenge 2026–2027, run by the ITU with make+learn. In 2-minute matches that simulate a public-health emergency response, it moves samples to a lab and closes a quarantine zone with upright beams, then delivers medical kits and colour-sorts patient cylinders to the hospital, primary care centres and recovery zone. Competing in the Senior category.',
    contextNote: null,
    recognitions: [
      { text: 'Selected for the national round, Senior category', dates: ['2026-09-22'] },
      { text: 'National round in Delhi', dates: ['2026-10-10'] },
    ],
    url: null,
    demoUrl: null,
    language: 'SPIKE word blocks',
    topics: [],
    stars: 0,
    updatedAt: '2026-09-23T00:00:00Z',
  },
  {
    slug: 'sewer-gas-detector',
    name: 'Sewer Gas Detector -- Wearable Safety Device for Sanitation Workers',
    summary: 'A two-unit ESP32 system for sanitation workers who enter manholes. The clip-on worker unit reads an MQ136 hydrogen sulfide sensor and an MQ4 methane sensor every second, shows the levels on an OLED, and sounds a buzzer at warning and danger thresholds. It sends its status over ESP-NOW, with no router or internet needed, to a receiver held by the supervisor at the manhole opening, which raises its own alarm until the supervisor resets it.',
    contextNote: null,
    recognitions: [
      { text: 'Participated in Young Environmental Scientist 2026, run by IWMA with IIT Madras', dates: ['2026-08-17'] },
    ],
    url: null,
    demoUrl: null,
    language: 'Arduino C++',
    topics: [],
    stars: 0,
    updatedAt: '2026-08-13T00:00:00Z',
  },
  {
    slug: 'landmine-shoe',
    name: 'Landmine Detection Shoe -- Metal-Sensing Prototype',
    summary: 'An early prototype of a shoe that senses buried metal. An ESP32 sends short pulses through a coil and reads the response, calibrates a baseline away from metal at start-up, then reports how far each new reading moves from that baseline.',
    contextNote: null,
    recognitions: [],
    url: null,
    demoUrl: null,
    language: 'Arduino C++',
    topics: [],
    stars: 0,
    updatedAt: '2026-04-28T00:00:00Z',
  },
  {
    slug: 'rfid-door-lock',
    name: 'RFID Door Lock -- Card-Operated Servo Lock',
    summary: 'An Arduino door lock opened with RFID cards. Scanning a known card turns a servo between open and locked and greets the card holder by name on a 16x2 LCD; an unknown card gets Access Denied.',
    contextNote: null,
    recognitions: [],
    url: null,
    demoUrl: null,
    language: 'Arduino C++',
    topics: [],
    stars: 0,
    updatedAt: '2024-11-29T00:00:00Z',
  },
]
// Card copy and detail-page highlights are curated here, not scraped: the card overview is a short
// rewrite of the summary, and highlights only restate what the summary or the project's README says.
// Keyed by lower-cased slug. Every project needs an overview (the sync fails without one).
const detailsBySlug = {
  'c.r.a.s.h': {
    overview: 'A web app that maps road accidents across Greater Chennai, ranks the deadliest junctions by risk score and recommends an intervention for each hotspot.',
    highlights: [
      'Interactive hotspot map with severity-coded incident points and a ranked top-10 danger index.',
      'Live filters for severity, time of day, weather, day of week and cause.',
      'Analytics dashboards and a side-by-side comparison of any two areas.',
      'Monte Carlo projection of an intervention over 1 to 24 months.',
      'Citizen reporting with a map picker, synced across devices through MongoDB.',
      'An AI data assistant that answers questions about the dataset, and PDF safety reports.',
    ],
  },
  'volt-ledger': {
    overview: 'A tamper-evident ledger for peer-to-peer rooftop-solar energy trading on a simulated neighbourhood microgrid. All data is simulated.',
    highlights: [
      'Every trade is sealed into a SHA-256 hash chain computed in the browser, so editing a past entry breaks verification from that block onward.',
      'A live energy map of ten rooftops, with a dossier for each household.',
      'A tamper test: retype any kWh figure and the chain visibly fails verification.',
      'Metrics for carbon avoided, grid dependence, neighbourhood autonomy and fairness.',
      'Ledger export as CSV or PDF, and shareable scenario links.',
    ],
  },
  vault: {
    overview: 'A cold-chain console for a vaccine shipment: simulated temperature readings, a hash-chained ledger that can be verified, and tracking from loading bay to handoff.',
    highlights: [
      'A temperature reading is simulated every 2 seconds against a safe corridor of 2 to 8 °C, and each reading is marked SAFE or EXCURSION.',
      'Events are recorded to a hash-chained ledger that can be verified after the fact.',
      'One box is tracked from loading bay to handoff, with a closing report.',
      'Runs entirely in the browser by default. An optional backend adds organisations, roles, a protected copy of the ledger and Telegram alerts.',
    ],
  },
  'write-wise': {
    overview: 'An AI-powered grammar analysis agent built with Flask and Claude, presented as a writing studio.',
    highlights: [],
  },
  'rutu-gaikwad-fansite': {
    overview: 'A scroll-driven fan tribute with an animated hero, live canvas visualisations, a trivia quiz and four colour themes. An unofficial fan project.',
    highlights: [
      'A hero with a live particle field and a marquee that reacts to scroll speed.',
      'A pinned, scroll-driven career timeline with animated stats.',
      'A hand-drawn canvas shot map and a stats explorer with a radar chart.',
      'A trivia quiz of 10 questions reshuffled from a larger pool each play.',
      'Four colour themes, and support for reduced-motion preferences.',
    ],
  },
  freshsense: {
    overview: 'An ESP32 conveyor-belt build that checks food for spoilage with gas sensors, and shows FRESH or ROTTEN on an LCD and in the Blynk IoT cloud.',
    highlights: [
      'An IR sensor stops each item under two gas sensors.',
      'Readings are compared against a clean-air baseline that the system calibrates at start-up.',
      'The verdict, FRESH or ROTTEN, shows on an LCD.',
      'The verdict is also sent to the Blynk IoT cloud for remote monitoring.',
      'Built as a three-person team project.',
    ],
  },
  'smart-guard': {
    overview: 'An ESP32 smart-home model that puts RFID access control and temperature, humidity, soil-moisture, gas and rain sensing in one unit.',
    highlights: [
      'An RFID reader checks each card against a list of known IDs and shows a welcome message or Access Denied.',
      'A DHT22 tracks temperature and humidity, a capacitive probe measures soil moisture, an MQ2 sensor reads gas levels and a rain sensor detects water.',
      'Everything shows on an OLED screen, with the time from a DS3231 clock.',
      'Built as a three-person team project.',
    ],
  },
  'robotics-for-good': {
    overview: 'A fully autonomous LEGO SPIKE Prime robot for the Robotics for Good Youth Challenge 2026–2027, built for a simulated public-health emergency response. Senior category.',
    highlights: [
      'The challenge is run by the ITU with make+learn.',
      'Matches last 2 minutes and simulate a public-health emergency response.',
      'The robot moves samples to a lab and closes a quarantine zone with upright beams.',
      'It then delivers medical kits and colour-sorts patient cylinders to the hospital, primary care centres and recovery zone.',
    ],
  },
  'sewer-gas-detector': {
    overview: 'A two-unit ESP32 system that warns sanitation workers of hydrogen sulfide and methane in manholes, and relays the alarm to a supervisor over ESP-NOW.',
    highlights: [
      'A clip-on worker unit reads an MQ136 hydrogen sulfide sensor and an MQ4 methane sensor every second.',
      'Levels show on an OLED, and a buzzer sounds at warning and danger thresholds.',
      'Status is sent over ESP-NOW, with no router or internet needed, to a receiver held by the supervisor at the manhole opening.',
      'The receiver raises its own alarm until the supervisor resets it.',
    ],
  },
  'landmine-shoe': {
    overview: 'An early prototype of a shoe that senses buried metal, using an ESP32 and a coil.',
    highlights: [
      'The ESP32 sends short pulses through a coil and reads the response.',
      'It calibrates a baseline away from metal at start-up.',
      'It then reports how far each new reading moves from that baseline.',
    ],
  },
  'rfid-door-lock': {
    overview: 'An Arduino door lock opened with RFID cards: a servo turns, and an LCD greets known card holders or shows Access Denied.',
    highlights: [
      'Scanning a known card turns a servo between open and locked.',
      'The card holder is greeted by name on a 16x2 LCD.',
      'An unknown card gets Access Denied.',
    ],
  },
}
const withDetails = (project) => {
  const details = detailsBySlug[project.slug.toLowerCase()]
  if (!details) throw new Error(`Add an overview and highlights for ${project.slug} to detailsBySlug.`)
  return { ...project, ...details }
}
// README notes that describe repo housekeeping rather than the project, so they are not shown.
const hiddenContextNotes = new Set(['vault'])
// Wording that replaces what a README gives: a better description when the README is only a title, or a
// project renamed since its repo was created.
// Live demos for repos with no website set on GitHub. A repo's own website link always wins.
const fallbackDemoUrls = {
  'c.r.a.s.h': 'https://crash-chennai.vercel.app/',
  'rutu-gaikwad-fansite': 'https://rutu-31.onrender.com',
  'write-wise': 'https://write-wise-wbxl.onrender.com',
}
const readmeOverrides = {
  'write-wise': {
    name: 'WriteWise AI -- Writing Studio',
  },
}
const excludedRepositories = ['epl-predictor', 'lebron-fan-page', 'spike_fit', 'cr7-fan-page', 'abivan-portfolio', 'agrifly', 'pulse-fit', 'raghav-dev-portfolio']
const outputPath = fileURLToPath(new URL('../src/data/projects.json', import.meta.url))
const apiHeaders = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'abivan-portfolio-project-index',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function getJson(url) {
  const response = await fetch(url, { headers: apiHeaders })
  if (!response.ok) {
    await response.body?.cancel()
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
  const readContextNote = () => {
    if (!paragraph.length) return null
    const text = paragraph.join(' ')
      .replace(/^>\s?/, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~`]/g, '')
      .replace(/\u26A0\uFE0F?/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return /all data is simulated|nothing real was metered|unofficial fan project|frontend prototype|static prototype/i.test(text)
      ? text
      : null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!started) {
      if (line.startsWith('#')) started = true
      continue
    }
    if (!line) {
      if (paragraph.length) {
        const contextNote = readContextNote()
        if (contextNote) return contextNote
        paragraph.length = 0
      }
      continue
    }
    if (line.startsWith('#') || line.startsWith('![') || line.startsWith('---')) continue
    paragraph.push(line)
  }

  return readContextNote()
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

// README titles read "Name — Subtitle". The site splits title from subtitle on " -- ", so the
// em dash becomes that separator (which also keeps em dashes out of the page copy).
function cleanName(text = '') {
  return text.replace(/\s*—\s*/g, ' -- ')
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
  const allRepositories = []
  for (let page = 1; ; page += 1) {
    const repositories = await getJson(
      `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&type=owner&sort=updated`,
    )
    allRepositories.push(...repositories)
    if (repositories.length < 100) break
  }
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
      contextNote: hiddenContextNotes.has(repository.name.toLowerCase()) ? null : contextNote ? cleanDescription(contextNote, repository.name) : null,
      ...readmeOverrides[repository.name.toLowerCase()],
      recognitions: recognitionsByRepository[repository.name.toLowerCase()] ?? [],
      url: repository.html_url,
      demoUrl: repository.homepage || fallbackDemoUrls[repository.name.toLowerCase()] || null,
      language: repository.language,
      topics: repository.topics ?? [],
      stars: repository.stargazers_count,
      updatedAt: repository.pushed_at,
    }
  }))

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify([...projects, ...offlineProjects].map(withDetails), null, 2)}\n`)
  console.log(`Wrote ${projects.length + offlineProjects.length} verified project records to ${outputPath}`)
} catch (error) {
  if (process.env.ALLOW_STALE_PROJECT_SNAPSHOT !== '1') {
    console.error(`GitHub project sync failed: ${error.message}. To intentionally use the committed snapshot offline, set ALLOW_STALE_PROJECT_SNAPSHOT=1.`)
    process.exitCode = 1
  } else {
    const hasSnapshot = await access(outputPath).then(() => true).catch(() => false)
    if (!hasSnapshot) throw error
    const snapshot = JSON.parse(await readFile(outputPath, 'utf8'))
    if (!Array.isArray(snapshot)) throw error
    const offlineSlugs = new Set(offlineProjects.map((project) => project.slug))
    const syncedRecords = snapshot.filter((project) => !offlineSlugs.has(project.slug))
    const syncedSlugs = new Set(syncedRecords.map((project) => project.slug.toLowerCase()))
    if (syncedRecords.length !== selectedRepositories.length || selectedRepositories.some((slug) => !syncedSlugs.has(slug.toLowerCase()))) throw error
    await writeFile(outputPath, `${JSON.stringify([...syncedRecords, ...offlineProjects].map(withDetails), null, 2)}\n`)
    console.warn(`GitHub refresh failed (${error.message}); retaining the committed project snapshot.`)
  }
}
