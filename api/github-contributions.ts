type ApiRequest = { method?: string }
type ApiResponse = {
  setHeader(name: string, value: string): void
  status(code: number): ApiResponse
  json(body: unknown): void
}

type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'

const username = 'abivan100-stack'
const githubGraphqlUrl = 'https://api.github.com/graphql'
const allowedLevels = new Set<ContributionLevel>(['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'])

const query = `
  query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeDay(value: unknown) {
  if (!isRecord(value)) return null
  const { date, contributionCount, contributionLevel } = value
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  if (!Number.isInteger(contributionCount) || (contributionCount as number) < 0) return null
  if (typeof contributionLevel !== 'string' || !allowedLevels.has(contributionLevel as ContributionLevel)) return null
  return { date, count: contributionCount as number, level: contributionLevel as ContributionLevel }
}

function getDateRange() {
  const to = new Date()
  const from = new Date(to)
  const dayOfMonth = from.getUTCDate()
  from.setUTCDate(1)
  from.setUTCFullYear(from.getUTCFullYear() - 1)
  const lastDayOfMonth = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0)).getUTCDate()
  from.setUTCDate(Math.min(dayOfMonth, lastDayOfMonth))
  return { from: from.toISOString(), to: to.toISOString() }
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const token = process.env.GITHUB_CONTRIBUTIONS_TOKEN
  if (!token) return response.status(503).json({ error: 'GitHub activity is not configured.' })

  try {
    const { from, to } = getDateRange()
    const upstream = await fetch(githubGraphqlUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Abivan-Portfolio',
      },
      body: JSON.stringify({ query, variables: { login: username, from, to } }),
      signal: AbortSignal.timeout(8000),
    })

    if (!upstream.ok) return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })

    const payload: unknown = await upstream.json()
    if (!isRecord(payload) || (Array.isArray(payload.errors) && payload.errors.length > 0) || !isRecord(payload.data)) {
      return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })
    }

    const user = payload.data.user
    const collection = isRecord(user) ? user.contributionsCollection : null
    const calendar = isRecord(collection) ? collection.contributionCalendar : null
    if (!isRecord(calendar) || !Number.isInteger(calendar.totalContributions) || (calendar.totalContributions as number) < 0 || !Array.isArray(calendar.weeks)) {
      return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })
    }

    const weeks: { days: NonNullable<ReturnType<typeof normalizeDay>>[] }[] = []
    for (const week of calendar.weeks) {
      if (!isRecord(week) || !Array.isArray(week.contributionDays)) {
        return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })
      }
      const days = week.contributionDays.map(normalizeDay)
      if (days.length === 0 || days.some((day) => day === null)) {
        return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })
      }
      weeks.push({ days: days as NonNullable<ReturnType<typeof normalizeDay>>[] })
    }
    if (weeks.length === 0) return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })
    const contributionCount = weeks.flatMap((week) => week.days).reduce((total, day) => total + day.count, 0)
    if (contributionCount !== calendar.totalContributions) {
      return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })
    }

    response.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return response.status(200).json({
      from: from.slice(0, 10),
      to: to.slice(0, 10),
      totalContributions: calendar.totalContributions,
      weeks,
    })
  } catch {
    return response.status(502).json({ error: 'GitHub activity is temporarily unavailable.' })
  }
}
