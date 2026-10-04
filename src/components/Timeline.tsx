import type { CSSProperties } from 'react'
import { NetLabel } from './Sheet'
import { formatDateRange, isUpcoming, milestones, projectPageHref } from '../lib/portfolio'
import { useToday } from '../lib/useToday'

// Results and recognition across every project, newest first, as test points on one wire.
export function Timeline() {
  const today = useToday()

  return (
    <section className="timeline section" id="timeline" aria-labelledby="timeline-title" data-power-up>
      <div className="timeline-head">
        <NetLabel id="timeline-title">timeline</NetLabel>
        <p>Results and recognition, newest first. Each is a test point (TP) on the wire, numbered in the order it happened, like the probe points on a circuit board.</p>
      </div>
      {/* TP numbers count in date order, so a result keeps its number as newer ones are added in front */}
      <ol className="tp-wire">
        {milestones.map((milestone, index) => (
          <li className={isUpcoming(milestone.dates, today) ? 'tp is-upcoming' : 'tp'} key={`${milestone.slug ?? milestone.title}-${milestone.dates[0]}`} style={{ '--n': index } as CSSProperties}>
            <span className="tp-ref" aria-hidden="true">TP{milestones.length - index}</span>
            <span className="tp-mark" aria-hidden="true" />
            <div className="tp-when">
              <time dateTime={milestone.dates[0]}>{formatDateRange(milestone.dates)}</time>
              {isUpcoming(milestone.dates, today) && <span className="upcoming-tag">Upcoming</span>}
            </div>
            {milestone.slug
              ? <a className="tp-project" href={projectPageHref(milestone.slug)}>{milestone.title}</a>
              : <span className="tp-project">{milestone.title}</span>}
            <p>{milestone.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
