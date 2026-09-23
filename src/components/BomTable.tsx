import { projectHref, toolkit } from '../lib/portfolio'

// The toolkit as a bill of materials: numbered parts, grouped, each linked to the projects that use it.
export function BomTable({ onHome }: { onHome: boolean }) {
  const groups = [...new Set(toolkit.map((row) => row.group))]
  return (
    <table className="bom">
      <thead>
        <tr><th scope="col">Item</th><th scope="col">Part</th><th scope="col">Qty</th><th scope="col">Used in</th></tr>
      </thead>
      {groups.map((group) => (
        <tbody key={group}>
          <tr className="bom-group"><th scope="colgroup" colSpan={4}>{group}</th></tr>
          {toolkit.map((row, index) => row.group === group && (
            <tr key={row.part}>
              <td className="bom-item">{index + 1}</td>
              <td><span className="bom-part">{row.part}</span><span className="bom-note">{row.note}</span></td>
              <td className="bom-qty">{row.qty}</td>
              <td className="bom-used">
                {row.used
                  ? row.used.map((project, i) => (
                      <span key={project.slug}>{i > 0 && ', '}<a href={projectHref(project.slug, onHome)}>{project.title}</a></span>
                    ))
                  : 'Every project'}
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  )
}
