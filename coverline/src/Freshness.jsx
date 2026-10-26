import { useState, useCallback } from 'react'
import { Chip, Seg, Search, Btn, Drawer, Empty, fmt } from './ui.jsx'
import { batches as seed, routes } from './data.js'

function Runway({ days }) {
  const W = 170, max = 150, x = 4 + (days / max) * (W - 8)
  const open = days <= 90
  const c = open ? '#b8352a' : '#a8550c'
  return (
    <div className="runway">
      <svg width={W} height="18" aria-hidden="true">
        <line x1="4" x2={W - 4} y1="9" y2="9" stroke="#e8e6e3" strokeWidth="2" />
        <rect x="6" y="5" width={x - 6} height="8" rx="4" fill={open ? '#fbe8e6' : '#fcf0e1'} stroke={c} strokeWidth="1.25" />
        <circle cx={x} cy="9" r="3.5" fill={c} />
        <line x1="3" x2="3" y1="1" y2="17" stroke="#1a1918" strokeWidth="2" />
      </svg>
      <span className="num" style={{ color: open ? 'var(--out)' : 'var(--ink-3)', fontWeight: open ? 500 : 400 }}>{days}d</span>
    </div>
  )
}

function RouteDrawer({ batch, onClose, onSend }) {
  const firstOk = routes.find(r => !r.needsDamage || batch.damaged)
  const [route, setRoute] = useState(batch.decision || firstOk.key)
  const [date, setDate] = useState('2026-10-30')
  const [note, setNote] = useState(`Pull all ${fmt(batch.cases)} cases before the end-of-month staff sale.`)
  const team = `Inventory team, ${batch.wh} warehouse`
  return (
    <Drawer title="Route this batch" sub={`Your decision goes to the ${batch.wh} inventory team as a task.`} onClose={onClose}
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" onClick={() => onSend(batch.id, route, date)}>Send to inventory team</Btn></>}>
      <div className="facts">
        <div className="t">{batch.name}</div>
        <div className="fact"><span>Batch</span><b className="num">{batch.id}</b></div>
        <div className="fact"><span>Warehouse</span><b>{batch.wh}</b></div>
        <div className="fact"><span>Cases</span><b className="num">{fmt(batch.cases)}</b></div>
        <div className="fact"><span>Expires</span><b>{batch.expires}</b></div>
        <div className="fact"><span>Staff pack window</span><b className={batch.days <= 90 ? 'out' : 'low'}>{batch.windowLong || batch.window}</b></div>
      </div>
      <div className="field" role="radiogroup" aria-label="Route">
        <span className="flabel">Route</span>
        {routes.map(r => {
          const blocked = r.needsDamage && !batch.damaged
          return (
            <button key={r.key} type="button" role="radio" className="option" aria-checked={route === r.key} disabled={blocked} onClick={() => setRoute(r.key)}>
              <span className="radio" /><span><b>{r.key}{blocked ? ' · not available' : ''}</b><span>{blocked ? r.blocked : r.desc}</span></span>
            </button>
          )
        })}
      </div>
      <div className="field">
        <label htmlFor="carry">Carry out by</label>
        <input id="carry" className="input" type="date" value={date} min="2026-10-22" onChange={e => setDate(e.target.value)} />
        <span className="hint">Inventory team sees this as the task deadline.</span>
      </div>
      <div className="field"><label htmlFor="assign">Assign to</label><select id="assign" className="select input"><option>{team}</option></select></div>
      <div className="field"><label htmlFor="note">Note for the team (optional)</label><textarea id="note" className="input" value={note} onChange={e => setNote(e.target.value)} /></div>
    </Drawer>
  )
}

export default function Freshness({ toast }) {
  const [rows, setRows] = useState(seed)
  const [q, setQ] = useState('')
  const [wh, setWh] = useState('all')
  const [dec, setDec] = useState('all')
  const [open, setOpen] = useState(null)
  const whs = [...new Set(seed.map(b => b.wh))].sort()
  const base = rows.filter(b => (wh === 'all' || b.wh === wh) && (!q || (b.name + b.id).toLowerCase().includes(q.toLowerCase())))
  const list = base.filter(b => dec === 'all' || (dec === 'none' ? !b.decision : !!b.decision))
  const close = useCallback(() => setOpen(null), [])
  const send = (id, route, date) => {
    const d = new Date(date + 'T12:00:00')
    const nice = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    setRows(rs => rs.map(b => b.id === id ? { ...b, decision: route, task: { tone: 'low', text: `Sent, due ${nice}` } } : b))
    const b = rows.find(x => x.id === id)
    setOpen(null)
    toast(`${route} task sent to the ${b.wh} inventory team`)
  }
  const total = list.reduce((s, b) => s + b.cases, 0)
  return (
    <div className="panel">
      <div className="toolbar">
        <Search value={q} onChange={setQ} placeholder="Search products or batch" />
        <select className="select" value={wh} onChange={e => setWh(e.target.value)} aria-label="Warehouse">
          <option value="all">All warehouses</option>{whs.map(w => <option key={w}>{w}</option>)}
        </select>
        <Seg label="Decision" value={dec} onChange={setDec} options={[
          { key: 'all', label: 'All', count: base.length }, { key: 'none', label: 'Not decided', count: base.filter(b => !b.decision).length },
          { key: 'done', label: 'Decided', count: base.filter(b => b.decision).length }]} />
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Batch</th><th>Warehouse</th><th className="r">Cases</th><th>Expiry runway <span className="faint" style={{ fontWeight: 400, fontSize: 12 }}>today to 150 days</span></th><th>Expires</th><th>Decision</th><th>Task</th></tr></thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id}>
                <td><div className="cell-main">{b.name}</div><div className="cell-sub">Batch {b.id}</div></td>
                <td>{b.wh}</td>
                <td className="r num">{fmt(b.cases)}</td>
                <td><Runway days={b.days} /></td>
                <td><div>{b.expires}</div><div className={`cell-sub ${b.days <= 90 ? 'out' : ''}`}>{b.window}</div></td>
                <td>{b.decision
                  ? <button type="button" className="chip plain" onClick={() => setOpen(b)} aria-label={`Change route for ${b.name}, now ${b.decision}`}>{b.decision}</button>
                  : <Btn kind="primary" onClick={() => setOpen(b)}>Decide route</Btn>}</td>
                <td><Chip tone={b.task.tone} dot>{b.task.text}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <Empty title="No batches match">Clear the search or pick another warehouse.</Empty>}
        <div className="table-foot">
          <span className="num">{list.length} batches · {fmt(total)} cases</span>
          <div className="legend">
            <span><i style={{ background: '#fbe8e6', border: '1px solid #b8352a' }} />Window open: pull now</span>
            <span><i style={{ background: '#fcf0e1', border: '1px solid #a8550c' }} />Window opens soon</span>
            <span><i style={{ width: 2, background: '#1a1918' }} />Today</span>
          </div>
        </div>
      </div>
      {open && <RouteDrawer batch={open} onClose={close} onSend={send} />}
    </div>
  )
}
