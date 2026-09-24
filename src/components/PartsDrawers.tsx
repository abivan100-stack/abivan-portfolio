import { useState } from 'react'
import { PROJECTS_URL, projectHref, toolkit } from '../lib/portfolio'

const idFor = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

// The toolkit as a parts cabinet: one cabinet per group, one labelled drawer per part. Opening a drawer
// shows the projects that use that part. Several drawers can be open at once.
export function PartsDrawers() {
  const [openParts, setOpenParts] = useState<Set<string>>(() => new Set())
  const toggle = (part: string) => setOpenParts((current) => {
    const next = new Set(current)
    if (next.has(part)) next.delete(part)
    else next.add(part)
    return next
  })

  return (
    <div className="cabinets">
      {[...new Set(toolkit.map((row) => row.group))].map((group) => (
        <section className="cabinet" key={group} aria-labelledby={`cabinet-${idFor(group)}`}>
          <h2 className="cabinet-plate" id={`cabinet-${idFor(group)}`}>{group}</h2>
          <ul className="drawers">
            {toolkit.filter((row) => row.group === group).map((row) => {
              const isOpen = openParts.has(row.part)
              const trayId = `tray-${idFor(row.part)}`
              return (
                <li className={isOpen ? 'drawer is-open' : 'drawer'} key={row.part}>
                  <button type="button" className="drawer-front" aria-expanded={isOpen} aria-controls={trayId} onClick={() => toggle(row.part)}>
                    <span className="drawer-label">
                      <span className="drawer-part">{row.part}</span>
                      <span className="drawer-note">{row.note}</span>
                    </span>
                    <span className="drawer-qty">
                      ×{row.qty}
                      <span className="visually-hidden"> {row.qty === 1 ? 'project' : 'projects'}</span>
                    </span>
                    <span className="drawer-handle" aria-hidden="true" />
                  </button>
                  <div className="drawer-tray" id={trayId}>
                    <div className="drawer-tray-inner">
                      <p className="drawer-tray-title">Used in</p>
                      {row.used ? (
                        <ul>
                          {row.used.map((project) => (
                            <li key={project.slug}><a href={projectHref(project.slug, false)}>{project.title}</a></li>
                          ))}
                        </ul>
                      ) : (
                        <p className="drawer-every"><a href={PROJECTS_URL}>Every project</a></p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
