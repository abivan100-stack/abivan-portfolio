import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { NetLabel } from './Sheet'
import { GITHUB_URL } from '../lib/portfolio'
import './GitHubActivity.css'

const contributionLevels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'] as const
type ContributionLevel = typeof contributionLevels[number]

type ContributionDay = {
  date: string
  count: number
  level: ContributionLevel
}

type ContributionWeek = {
  days: ContributionDay[]
}

type CalendarData = {
  from: string
  to: string
  totalContributions: number
  weeks: ContributionWeek[]
}

const dayFormatter = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })
const numberFormatter = new Intl.NumberFormat('en')

function dateValue(value: string) {
  return new Date(`${value}T00:00:00Z`)
}

function isCalendarData(value: unknown): value is CalendarData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<CalendarData>
  if (typeof candidate.from !== 'string' || typeof candidate.to !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.from) || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.to)) return false
  if (Number.isNaN(dateValue(candidate.from).getTime()) || Number.isNaN(dateValue(candidate.to).getTime())) return false
  if (!Number.isInteger(candidate.totalContributions) || (candidate.totalContributions ?? -1) < 0) return false
  if (!Array.isArray(candidate.weeks) || candidate.weeks.length === 0) return false

  const validWeeks = candidate.weeks.every((week) => (
    week && Array.isArray(week.days) && week.days.every((day) => (
      day && typeof day.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day.date)
      && !Number.isNaN(dateValue(day.date).getTime())
      && Number.isInteger(day.count) && day.count >= 0
      && contributionLevels.includes(day.level)
    ))
  ))
  if (!validWeeks) return false
  const total = candidate.weeks.flatMap((week) => week.days).reduce((sum, day) => sum + day.count, 0)
  return total === candidate.totalContributions
}

function formatDay(day: ContributionDay) {
  return `${dayFormatter.format(dateValue(day.date))}: ${numberFormatter.format(day.count)} ${day.count === 1 ? 'contribution' : 'contributions'}`
}

function GitHubCalendar({ data }: { data: CalendarData }) {
  const days = data.weeks.flatMap((week) => week.days)
  const dayIndexes = new Map(days.map((day, index) => [day.date, index]))
  const [focusedIndex, setFocusedIndex] = useState(Math.max(0, days.length - 1))
  const [selectedIndex, setSelectedIndex] = useState(Math.max(0, days.length - 1))
  const [activeDay, setActiveDay] = useState(days[days.length - 1])
  const scrollRef = useRef<HTMLDivElement>(null)

  // On narrow screens the calendar scrolls sideways; open it on the latest weeks, where the recent activity is
  useEffect(() => {
    const scroller = scrollRef.current
    if (scroller) scroller.scrollLeft = scroller.scrollWidth
  }, [])

  const monthLabels = data.weeks.map((week, index) => {
    const firstDay = week.days[0]
    if (!firstDay) return null
    const month = firstDay.date.slice(0, 7)
    const previousMonth = data.weeks[index - 1]?.days[0]?.date.slice(0, 7)
    return month === previousMonth ? null : { index, label: monthFormatter.format(dateValue(firstDay.date)) }
  })

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const offset = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }[event.key]
    if (offset === undefined) return

    event.preventDefault()
    const nextDate = dateValue(days[index].date)
    nextDate.setUTCDate(nextDate.getUTCDate() + offset)
    const nextIndex = dayIndexes.get(nextDate.toISOString().slice(0, 10))
    if (nextIndex === undefined) return

    setFocusedIndex(nextIndex)
    setSelectedIndex(nextIndex)
    setActiveDay(days[nextIndex])
    const calendar = event.currentTarget.closest('.github-calendar')
    calendar?.querySelector<HTMLButtonElement>(`[data-day-index="${nextIndex}"]`)?.focus()
  }

  return (
    <div className="github-calendar-wrap">
      <p className="github-calendar-period"><span>{dayFormatter.format(dateValue(data.from))}</span> — <span>{dayFormatter.format(dateValue(data.to))}</span></p>
      <div className="github-calendar-scroll" ref={scrollRef} role="region" aria-label="Scrollable contribution calendar">
        <div className="github-calendar" style={{ '--week-count': data.weeks.length } as CSSProperties}>
          <div className="github-months" aria-hidden="true">
            {monthLabels.map((month, index) => month && (
              <span key={`${month.index}-${index}`} style={{ gridColumn: month.index + 1 }}>{month.label}</span>
            ))}
          </div>
          <div className="github-weekdays" aria-hidden="true">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="github-weeks" role="group" aria-label="Daily contributions. Use the arrow keys to move between days.">
            {data.weeks.map((week, weekIndex) => (
              <div className="github-week" role="group" aria-label={`Contribution week ${weekIndex + 1}`} key={week.days[0]?.date ?? weekIndex}>
                {week.days.map((day) => {
                  const dayIndex = dayIndexes.get(day.date) ?? 0
                  const weekday = dateValue(day.date).getUTCDay() + 1
                  return (
                    <button
                      aria-label={formatDay(day)}
                      aria-pressed={selectedIndex === dayIndex}
                      className={`github-day level-${day.level.toLowerCase()}`}
                      data-day-index={dayIndex}
                      key={day.date}
                      onClick={() => { setSelectedIndex(dayIndex); setActiveDay(day) }}
                      onFocus={() => { setFocusedIndex(dayIndex); setSelectedIndex(dayIndex); setActiveDay(day) }}
                      onMouseEnter={() => setActiveDay(day)}
                      onKeyDown={(event) => moveFocus(event, dayIndex)}
                      style={{ gridRow: weekday }}
                      tabIndex={focusedIndex === dayIndex ? 0 : -1}
                      title={formatDay(day)}
                      type="button"
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="github-calendar-meta">
        <p className="github-day-detail">{activeDay ? formatDay(activeDay) : 'Focus or point to a day for its contribution count.'}</p>
        <div className="github-legend" role="group" aria-label="Contribution level legend">
          <span>Less</span>
          {contributionLevels.map((level) => <span className={`github-day-swatch level-${level.toLowerCase()}`} aria-hidden="true" key={level} />)}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

export function GitHubActivity() {
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetch('/api/github-contributions')
      .then(async (response) => {
        if (!response.ok) throw new Error('Contribution data is unavailable.')
        const result: unknown = await response.json()
        if (!isCalendarData(result)) throw new Error('Contribution data could not be read.')
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [retry])

  return (
    <section className="github-activity section" id="activity" aria-labelledby="github-activity-title" aria-busy={loading}>
      <div className="github-activity-head">
        <div>
          <NetLabel id="github-activity-title">GitHub activity</NetLabel>
          <p>Contributions over the last 12 months.</p>
        </div>
        {data && <p className="github-total"><strong>{numberFormatter.format(data.totalContributions)}</strong> contributions</p>}
      </div>

      {loading
        ? <p className="github-activity-status is-loading" role="status">Loading contribution activity…</p>
        : data
          ? <GitHubCalendar data={data} />
          : <div className="github-activity-status" role="status">
            <p>Activity is temporarily unavailable. You can still view the public profile on GitHub.</p>
            <div className="github-activity-actions">
              <button type="button" onClick={() => { setLoading(true); setRetry((value) => value + 1) }}>Try again</button>
              <a href={GITHUB_URL} rel="noreferrer" target="_blank">View GitHub profile<span className="visually-hidden"> (opens in a new tab)</span></a>
            </div>
          </div>}
    </section>
  )
}
