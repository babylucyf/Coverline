import { useState, useCallback, useEffect } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Chip, Seg, Search, Btn, Drawer, Empty, Tabs, Filter, ViewToggle, Popover, fmt } from './ui.jsx'
import { batches as seedBatches, routes, damaged as seedDamaged, tasks as seedTasks, missed } from './data.js'

const SUBS = {
  next: 'Batches for the freshness review. Staff pack window opens 90 days before expiry.',
  damaged: 'Damage the warehouses have reported for the freshness review. Every report needs a route, whatever the expiry date.',
  tasks: 'Routes sent to Onitsha warehouse by demand planning. Confirm each one when the stock has moved.',
  routed: 'Every batch with a route, and where its task stands at the warehouse.',
  missed: 'Batches destroyed after missing the staff pack window, and the handoff where each one got stuck.',
}

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
      <div className="field"><label htmlFor="carry">Carry out by</label><input id="carry" className="input" type="date" value={date} min="2026-10-22" onChange={e => setDate(e.target.value)} /><span className="hint">Inventory team sees this as the task deadline.</span></div>
      <div className="field"><label htmlFor="assign">Assign to</label><select id="assign" className="select input"><option>Inventory team, {batch.wh} warehouse</option></select></div>
      <div className="field"><label htmlFor="note">Note for the team (optional)</label><textarea id="note" className="input" value={note} onChange={e => setNote(e.target.value)} /></div>
    </Drawer>
  )
}

function DamageDrawer({ rep, onClose, onSend }) {
  const comp = rep.cond === 'compromised'
  const [route, setRoute] = useState(comp ? 'Destroy' : (rep.decision || 'Repackage'))
  const blockedWhy = {
    'Staff pack': 'Product is compromised. It cannot go to staff.',
    'Trade priority': 'Product is compromised. It cannot be sold.',
    'Repackage': 'New cartons will not fix compromised product.',
  }
  const desc = {
    'Staff pack': 'Batch is near 3 months and the product is fine.',
    'Trade priority': 'Push to distributors ahead of newer stock.',
    'Repackage': 'Good product in a damaged carton. MRP gets a carton request.',
    'Destroy': comp ? `Only route for compromised product. ${rep.cases} cases recorded as a write-off.` : 'Cannot be used or sold. Recorded as a write-off.',
  }
  const opts = ['Staff pack', 'Trade priority', 'Repackage', 'Destroy']
  const allowed = k => comp ? k === 'Destroy' : (k !== 'Staff pack' || rep.life <= 90)
  return (
    <Drawer title="Route this damage report" sub={`Your decision goes back to the ${rep.wh} inventory team as a task.`} onClose={onClose}
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" onClick={() => onSend(rep.id, route)}>Send {route.toLowerCase()} task to {rep.wh}</Btn></>}>
      <div className={comp ? 'alert' : 'facts'} style={comp ? {} : { background: 'var(--low-bg)' }}>
        <small style={comp ? {} : { color: 'var(--low)', display: 'block', fontSize: 11.5, letterSpacing: '.06em', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>{comp ? 'Product compromised' : 'Carton only'} · {rep.reported}</small>
        <p style={{ margin: '0 0 6px' }}>{rep.what}</p>
        {rep.detail && <span style={{ fontWeight: 400, fontSize: 13.5, display: 'block' }}>{rep.detail}</span>}
        <span className="cell-sub" style={{ display: 'block', marginTop: 8 }}>{rep.by}</span>
      </div>
      <div className="facts">
        <div className="t">{rep.name}</div>
        <div className="fact"><span>Batch</span><b className="num">{rep.id}</b></div>
        <div className="fact"><span>Warehouse</span><b>{rep.wh}</b></div>
        <div className="fact"><span>Cases affected</span><b className="num">{rep.cases} of {fmt(rep.of)}</b></div>
        <div className="fact"><span>Expires</span><b>{rep.expires}</b></div>
        <div className="fact"><span>Shelf life left</span><b className="num">{rep.life} days</b></div>
      </div>
      <div className="field" role="radiogroup" aria-label="Route">
        <span className="flabel">Route</span>
        {opts.map(k => {
          const ok = allowed(k)
          return (
            <button key={k} type="button" role="radio" className="option" aria-checked={route === k} disabled={!ok} onClick={() => setRoute(k)}>
              <span className="radio" /><span><b>{k}{ok ? '' : ' · not available'}</b><span>{ok ? desc[k] : (comp ? blockedWhy[k] : 'Batch is not in the staff pack window yet.')}</span></span>
            </button>
          )
        })}
      </div>
      {rep.of > rep.cases && <div className="facts" style={{ fontSize: 14 }}>The other {fmt(rep.of - rep.cases)} cases stay in stock and keep their expiry route.</div>}
    </Drawer>
  )
}

function ReportDamage({ onClose, onSend }) {
  const [cases, setCases] = useState('30')
  const [what, setWhat] = useState('Rain or water')
  const [cond, setCond] = useState('compromised')
  const [text, setText] = useState('Rain came in under the loading door. Bottom layer of the pallet is soaked, labels peeling and tins starting to rust.')
  const [photos, setPhotos] = useState(2)
  const ready = cases && text.trim() && photos > 0
  return (
    <Drawer title="Report damage" sub="Demand planning decides the route from what you log here." onClose={onClose}
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" disabled={!ready} onClick={() => onSend({ cases, what, cond, text })}>Send to demand planning</Btn></>}>
      <div className="field"><label htmlFor="rb">Batch</label><select id="rb" className="select input"><option>Evaporated milk 160g · B-2410-20</option><option>Malt drink 33cl ×24 · B-2409-03</option></select><span className="hint">Onitsha · Bay B3 · 800 cases · expires 2 May 2027</span></div>
      <div className="field"><label htmlFor="rc">Cases affected</label><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><input id="rc" className="input num" style={{ width: 120 }} inputMode="numeric" value={cases} onChange={e => setCases(e.target.value.replace(/\D/g, ''))} /><span className="muted">of 800 in this batch</span></div></div>
      <div className="field"><span className="flabel">What happened</span><div className="pills">{['Rain or water', 'Crushed or torn in handling', 'Pests', 'Leak or burst packs', 'Damaged in transit', 'Other'].map(p => <button key={p} type="button" className="pill" aria-pressed={what === p} onClick={() => setWhat(p)}>{p}</button>)}</div></div>
      <div className="field" role="radiogroup" aria-label="Product state">
        <span className="flabel">What state is the product in? <span className="faint" style={{ fontWeight: 400, fontSize: 13 }}>Required</span></span>
        {[['carton', 'Carton only', 'The packs inside are intact. Demand planning will ask for new cartons.'], ['compromised', 'Product compromised', 'Packs are wet, burst, rusted, chewed or contaminated. Will be destroyed.'], ['unsure', 'Not sure', 'QA checks it first. The cases stay on hold until they decide.']].map(([k, t, d]) => (
          <button key={k} type="button" role="radio" className="option" aria-checked={cond === k} onClick={() => setCond(k)}><span className="radio" /><span><b style={k === 'compromised' && cond === k ? { color: 'var(--out)' } : {}}>{t}</b><span>{d}</span></span></button>
        ))}
      </div>
      <div className="field"><label htmlFor="rt">Describe what you see <span className="faint" style={{ fontWeight: 400, fontSize: 13 }}>Required</span></label><textarea id="rt" className="input" value={text} onChange={e => setText(e.target.value)} /></div>
      <div className="field"><span className="flabel">Photos <span className="faint" style={{ fontWeight: 400, fontSize: 13 }}>At least one</span></span>
        <div className="photos">{Array.from({ length: photos }, (_, i) => <span key={i} className="photo">Photo {i + 1}</span>)}<button type="button" className="photo add" aria-label="Add photo" onClick={() => setPhotos(p => Math.min(p + 1, 6))}>+</button></div></div>
      <div className="facts"><b style={{ fontWeight: 500 }}>These {cases || 0} cases go on hold when you send</b><span className="muted" style={{ fontSize: 13 }}>They will not be picked for orders until demand planning routes them.</span></div>
    </Drawer>
  )
}

function NextTab({ rows, setRows, toast }) {
  const [q, setQ] = useState('')
  const [wh, setWh] = useState(null)
  const [cat, setCat] = useState(null)
  const [dec, setDec] = useState(null)
  const [ts, setTs] = useState(null)
  const [asc, setAsc] = useState(true)
  const [view, setView] = useState('list')
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const taskGroup = b => b.task.text === 'Done' ? 'Done' : b.task.text === 'Not decided' ? 'Not sent' : 'Waiting at warehouse'
  const list = rows.filter(b => (!wh || b.wh === wh) && (!cat || b.cat === cat) && (!dec || (dec === 'Not decided' ? !b.decision : b.decision === dec)) && (!ts || taskGroup(b) === ts) && (!q || (b.name + b.id).toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => asc ? a.days - b.days : b.days - a.days)
  const send = (id, route, date) => {
    const nice = new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    const b = rows.find(x => x.id === id)
    setRows(rs => rs.map(x => x.id === id ? { ...x, decision: route, task: { tone: 'low', text: `Sent, due ${nice}` } } : x))
    setOpen(null); toast(`${route} task sent to the ${b.wh} inventory team`)
  }
  const decisionCell = b => b.decision
    ? <button type="button" className="chip plain" onClick={() => setOpen(b)} aria-label={`Change route for ${b.name}, now ${b.decision}`}>{b.decision}</button>
    : <Btn kind="primary" onClick={() => setOpen(b)}>Decide route</Btn>
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search products or batch" />
      <Filter label="Warehouse" value={wh} onChange={setWh} options={[...new Set(rows.map(b => b.wh))].sort()} />
      <Filter label="Category" value={cat} onChange={setCat} options={[...new Set(rows.map(b => b.cat))].sort()} />
      <Filter label="Decision" value={dec} onChange={setDec} options={['Not decided', 'Staff pack', 'Trade priority', 'Repackage', 'Destroy']} />
      <Filter label="Task status" value={ts} onChange={setTs} options={['Not sent', 'Waiting at warehouse', 'Done']} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setAsc(!asc)}>{asc ? 'Days left: fewest first' : 'Days left: most first'}</Btn>
      <ViewToggle value={view} onChange={setView} />
    </div>
    {view === 'list' ? (
      <div className="table-wrap">
        <table>
          <thead><tr><th>Batch</th><th>Warehouse</th><th className="r">Cases</th><th>Expiry runway <span className="faint" style={{ fontWeight: 400, fontSize: 12 }}>today to 150 days</span></th><th>Expires</th><th>Decision</th><th>Task</th></tr></thead>
          <tbody>{list.map(b => (
            <tr key={b.id}>
              <td><div className="cell-main">{b.name}</div><div className="cell-sub">Batch {b.id}</div></td>
              <td>{b.wh}</td><td className="r num">{fmt(b.cases)}</td><td><Runway days={b.days} /></td>
              <td><div>{b.expires}</div><div className={`cell-sub ${b.days <= 90 ? 'out' : ''}`} style={{ whiteSpace: 'nowrap' }}>{b.window}</div></td>
              <td>{decisionCell(b)}</td><td><Chip tone={b.task.tone} dot>{b.task.text}</Chip></td>
            </tr>
          ))}</tbody>
        </table>
        {list.length === 0 && <Empty title="No batches match these filters">Try another warehouse or decision.</Empty>}
        <div className="table-foot">
          <span className="num">{list.length} batches · {fmt(list.reduce((s, b) => s + b.cases, 0))} cases</span>
          <div className="legend"><span><i style={{ background: '#fbe8e6', border: '1px solid #b8352a' }} />Window open: pull now</span><span><i style={{ background: '#fcf0e1', border: '1px solid #a8550c' }} />Window opens soon</span><span><i style={{ width: 2, background: '#1a1918' }} />Today</span></div>
        </div>
      </div>
    ) : list.length ? (
      <div className="cards">{list.map(b => (
        <article className="pcard" key={b.id}>
          <div className="top"><div><h3>{b.name}</h3><div className="cell-sub">Batch {b.id} · {b.wh}</div></div><Chip tone={b.task.tone} dot>{b.task.text}</Chip></div>
          <Runway days={b.days} />
          <div className="row"><span>Expires</span><span>{b.expires}</span></div>
          <div className="row"><span>Cases</span><span className="num">{fmt(b.cases)}</span></div>
          <div>{decisionCell(b)}</div>
        </article>
      ))}</div>
    ) : <Empty title="No batches match these filters">Try another warehouse or decision.</Empty>}
    {open && <RouteDrawer batch={open} onClose={close} onSend={send} />}
  </>
}

function DamagedTab({ reps, setReps, toast }) {
  const [q, setQ] = useState('')
  const [wh, setWh] = useState(null)
  const [cond, setCond] = useState(null)
  const [what, setWhat] = useState(null)
  const [dec, setDec] = useState(null)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const condLabel = c => c === 'compromised' ? 'Product compromised' : 'Carton only'
  const list = reps.filter(r => (!wh || r.wh === wh) && (!cond || condLabel(r.cond) === cond) && (!what || r.type === what) && (!dec || (dec === 'Needs a decision' ? !r.decision : r.decision === dec)) && (!q || (r.name + r.id).toLowerCase().includes(q.toLowerCase())))
  const send = (id, route) => { const r = reps.find(x => x.id === id); setReps(rs => rs.map(x => x.id === id ? { ...x, decision: route } : x)); setOpen(null); toast(`${route} task sent to ${r.wh}`) }
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search products or batch" />
      <Filter label="Warehouse" value={wh} onChange={setWh} options={[...new Set(reps.map(r => r.wh))].sort()} />
      <Filter label="Condition" value={cond} onChange={setCond} options={['Product compromised', 'Carton only']} />
      <Filter label="What happened" value={what} onChange={setWhat} options={[...new Set(reps.map(r => r.type))]} />
      <Filter label="Decision" value={dec} onChange={setDec} options={['Needs a decision', 'Repackage', 'Destroy']} />
    </div>
    <div className="table-wrap">
      <table>
        <thead><tr><th>Report</th><th>Warehouse</th><th className="r">Cases affected</th><th>What happened</th><th>Condition</th><th>Decision</th></tr></thead>
        <tbody>{list.map(r => (
          <tr key={r.id}>
            <td><div className="cell-main">{r.name}</div><div className="cell-sub">Batch {r.id}</div></td>
            <td>{r.wh}</td>
            <td className="r"><div className="num">{r.cases}</div><div className="cell-sub num">of {fmt(r.of)}</div></td>
            <td><div>{r.what}</div><div className="cell-sub">{r.whatSub}</div></td>
            <td><Chip tone={r.cond === 'compromised' ? 'out' : 'low'} dot>{condLabel(r.cond)}</Chip></td>
            <td>{r.decision ? <button type="button" className="chip plain" onClick={() => setOpen(r)}>{r.decision}</button> : <Btn kind="primary" onClick={() => setOpen(r)}>Decide route</Btn>}</td>
          </tr>
        ))}</tbody>
      </table>
      {list.length === 0 && <Empty title="No reports match these filters">Clear a filter to see more.</Empty>}
      <div className="table-foot"><span className="num">{list.length} reports · {list.reduce((s, r) => s + r.cases, 0)} cases affected · {list.filter(r => !r.decision).length} need a decision</span><span>Product compromised: destroy only. Carton only: repackage is open.</span></div>
    </div>
    {open && <DamageDrawer rep={open} onClose={close} onSend={send} />}
  </>
}

function TasksTab({ tasks, setTasks, toast }) {
  const [q, setQ] = useState('')
  const [g, setG] = useState('all')
  const [asc, setAsc] = useState(true)
  const [openId, setOpenId] = useState('B-2408-19')
  const [pulled, setPulled] = useState('1410')
  const [why, setWhy] = useState('Not found at Bay A2')
  const order = ['B-2407-31', 'B-2408-19', 'B-2409-12', 'B-2410-05', 'B-2409-03']
  const base = tasks.filter(t => !q || (t.name + t.id).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(t => g === 'all' || t.group === g).sort((a, b) => (order.indexOf(a.id) - order.indexOf(b.id)) * (asc ? 1 : -1))
  const statusChip = t => ({ overdue: <Chip tone="out" dot>Overdue</Chip>, progress: <Chip tone="low" dot>In progress</Chip>, todo: <Chip tone="neutral" dot>To do</Chip>, new: <Chip tone="neutral" dot>New</Chip>, done: <Chip tone="safe" dot>Done</Chip> })[t.status]
  const start = t => { setTasks(ts => ts.map(x => x.id === t.id ? { ...x, status: 'progress', pulled: x.pulled || 0 } : x)); setPulled(String(t.pulled || t.cases)); setOpenId(t.id) }
  const confirm = t => {
    const n = Number(pulled) || 0
    setTasks(ts => ts.map(x => x.id === t.id ? { ...x, status: 'done', pulled: n } : x)); setOpenId(null)
    toast(n < t.cases ? `Confirmed ${fmt(n)} cases. ${fmt(t.cases - n)} short flagged to demand planning` : `Confirmed all ${fmt(n)} cases`)
  }
  const done = tasks.filter(t => t.status === 'done')
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search tasks or batch" />
      <Seg label="Due" value={g} onChange={setG} options={[{ key: 'all', label: 'All', count: base.length }, { key: 'overdue', label: 'Overdue', count: base.filter(t => t.group === 'overdue').length }, { key: 'week', label: 'Due this week', count: base.filter(t => t.group === 'week').length }, { key: 'later', label: 'Later', count: base.filter(t => t.group === 'later').length }]} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setAsc(!asc)}>{asc ? 'Due: soonest first' : 'Due: latest first'}</Btn>
    </div>
    <div className="table-wrap">
      <table>
        <thead><tr><th>Task</th><th>Route</th><th>Bay</th><th className="r">Cases</th><th>Due</th><th>Sent by</th><th>Status</th><th><span className="sr">Action</span></th></tr></thead>
        <tbody>{list.map(t => {
          const isOpen = openId === t.id && t.status === 'progress'
          const n = Number(pulled) || 0
          return [
            <tr key={t.id}>
              <td><div className="cell-main">{t.name}</div><div className="cell-sub">Batch {t.id}</div></td>
              <td>{t.route}</td><td>{t.bay}</td>
              <td className="r"><div className="num">{fmt(t.cases)}</div>{t.pulled > 0 && t.status !== 'done' && <div className="cell-sub low num">{fmt(t.pulled)} pulled so far</div>}{t.status === 'done' && <div className="cell-sub num">{fmt(t.pulled ?? t.cases)} confirmed</div>}</td>
              <td style={{ whiteSpace: 'nowrap' }}><div>{t.due}</div><div className={`cell-sub ${t.dueTone || ''}`}>{t.dueSub}</div></td>
              <td><div>{t.from}</div><div className="cell-sub">{t.fromSub}</div></td>
              <td>{statusChip(t)}</td>
              <td className="r">{t.status === 'done' ? null : t.status === 'progress' ? <Btn onClick={() => setOpenId(isOpen ? null : t.id)}>{isOpen ? 'Close' : 'Open'}</Btn> : <Btn onClick={() => start(t)}>Start</Btn>}</td>
            </tr>,
            isOpen && <tr key={t.id + '-x'} className="expand"><td colSpan={8}>
              <div className="expand-grid">
                <div style={{ display: 'grid', gap: 14 }}>
                  <div><b style={{ fontWeight: 500, fontSize: 16 }}>Confirm the {t.route === 'Staff pack' ? 'pull' : 'task'}</b><p className="muted" style={{ margin: '4px 0 0' }}>Count what has actually moved. Demand planning sees this number, not the plan.</p></div>
                  <div className="field"><label htmlFor="pulled">Cases {t.route === 'Staff pack' ? 'pulled' : 'done'}</label><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><input id="pulled" className="input num" style={{ width: 160 }} inputMode="numeric" value={pulled} onChange={e => setPulled(e.target.value.replace(/\D/g, ''))} /><span className="muted">of {fmt(t.cases)} planned</span></div></div>
                  {n < t.cases && <>
                    <div className="note-box"><b>{fmt(t.cases - n)} cases short</b>Femi in demand planning gets the gap and your reason, and decides what happens to the {fmt(t.cases - n)} cases. The task stays open until then.</div>
                    <div className="field"><label htmlFor="why">Why is it short?</label><select id="why" className="select input" value={why} onChange={e => setWhy(e.target.value)}><option>Not found at {t.bay}</option><option>Damaged, reported separately</option><option>Already sold</option><option>Other</option></select></div>
                  </>}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Btn onClick={() => { setTasks(ts => ts.map(x => x.id === t.id ? { ...x, pulled: n } : x)); toast('Progress saved') }}>Save progress</Btn>
                    <Btn kind="primary" onClick={() => confirm(t)}>{n < t.cases ? `Confirm ${fmt(n)} cases and flag ${fmt(t.cases - n)}` : `Confirm ${fmt(n)} cases`}</Btn>
                  </div>
                </div>
                <div>
                  <div className="menu-label" style={{ padding: 0, marginBottom: 8, letterSpacing: '.06em', textTransform: 'uppercase' }}>From demand planning</div>
                  <div className="quote"><small>{t.route} · {t.from}, {t.fromSub}</small>{t.note}</div>
                  <div className="timeline">
                    <div><small>{t.fromSub}</small>Sent to Onitsha inventory team</div>
                    {t.pulled > 0 && <div className="now"><small>Tue 20 Oct</small>Amaka started. {fmt(t.pulled)} cases pulled</div>}
                    <div><small>{t.due}</small>Due. Shown as overdue after 18:00</div>
                  </div>
                </div>
              </div>
            </td></tr>,
          ]
        })}</tbody>
      </table>
      {list.length === 0 && <Empty title="No tasks here">Nothing due in this group.</Empty>}
      <div className="table-foot"><span className="num">{list.filter(t => t.status !== 'done').length} open tasks · {fmt(list.filter(t => t.status !== 'done').reduce((s, t) => s + t.cases, 0))} cases to move</span><span>Done this week: {3 + done.length} tasks</span></div>
    </div>
  </>
}

function RoutedTab({ rows, reps }) {
  const list = [
    ...rows.filter(b => b.decision && !reps.some(r => r.id === b.id && r.decision)).map(b => ({ id: b.id, name: b.name, wh: b.wh, cases: b.cases, route: b.decision, why: 'Freshness window', task: b.task })),
    ...reps.filter(r => r.decision).map(r => ({ id: r.id, name: r.name, wh: r.wh, cases: r.cases, route: r.decision, why: 'Damage report', task: { tone: 'low', text: 'Waiting at warehouse' } })),
  ]
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Batch</th><th>Warehouse</th><th className="r">Cases</th><th>Route</th><th>Reason</th><th>Task</th></tr></thead>
        <tbody>{list.map(b => (
          <tr key={b.id + b.why}><td><div className="cell-main">{b.name}</div><div className="cell-sub">Batch {b.id}</div></td><td>{b.wh}</td><td className="r num">{fmt(b.cases)}</td><td>{b.route}</td><td className="muted">{b.why}</td><td><Chip tone={b.task.tone} dot>{b.task.text}</Chip></td></tr>
        ))}</tbody>
      </table>
      <div className="table-foot"><span>{list.length} routed batches</span><span>Route more from Next 120 days or Damaged</span></div>
    </div>
  )
}

function MissedTab() {
  const [q, setQ] = useState('')
  const [s, setS] = useState('all')
  const [period, setPeriod] = useState('Last 90 days')
  const inPeriod = m => period === 'Last 90 days' || ['Sat 17 Oct', 'Mon 12 Oct', 'Mon 28 Sep'].includes(m.expired)
  const base = missed.filter(m => inPeriod(m) && (!q || (m.name + m.id).toLowerCase().includes(q.toLowerCase())))
  const list = base.filter(m => s === 'all' || m.stuck === s)
  const chip = { decision: <Chip tone="out" dot>Demand planning</Chip>, warehouse: <Chip tone="low" dot>Inventory team</Chip>, qa: <Chip tone="neutral" dot>QA</Chip> }
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search products or batch" />
      <Seg label="Stuck at" value={s} onChange={setS} options={[{ key: 'all', label: 'All', count: base.length }, { key: 'decision', label: 'Stuck at decision', count: base.filter(m => m.stuck === 'decision').length }, { key: 'warehouse', label: 'Stuck at warehouse', count: base.filter(m => m.stuck === 'warehouse').length }, { key: 'qa', label: 'Stuck at QA', count: base.filter(m => m.stuck === 'qa').length }]} />
      <span className="grow" />
      <Popover align="right" width={180} trigger={({ toggle, open }) => <Btn icon={ArrowUpDown} aria-expanded={open} onClick={toggle}>{period}</Btn>}>
        {close => ['Last 30 days', 'Last 90 days'].map(p => <button key={p} type="button" className="menu-item" role="menuitemradio" aria-checked={period === p} onClick={() => { setPeriod(p); close() }}>{p}</button>)}
      </Popover>
    </div>
    <div className="table-wrap">
      <table>
        <thead><tr><th>Batch</th><th>Warehouse</th><th className="r">Destroyed</th><th>Expired</th><th>Window opened</th><th>What happened</th><th>Stuck at</th></tr></thead>
        <tbody>{list.map(m => (
          <tr key={m.id}><td><div className="cell-main">{m.name}</div><div className="cell-sub">Batch {m.id}</div></td><td>{m.wh}</td>
            <td className="r"><div className="num" style={{ color: 'var(--out)' }}>{fmt(m.destroyed)}</div><div className="cell-sub num">of {fmt(m.of)}</div></td>
            <td style={{ whiteSpace: 'nowrap' }}>{m.expired}</td><td className="muted" style={{ whiteSpace: 'nowrap' }}>{m.opened}</td><td style={{ minWidth: 260 }}>{m.what}</td><td>{chip[m.stuck]}</td></tr>
        ))}</tbody>
      </table>
      {list.length === 0 && <Empty title="Nothing missed in this period">That is the goal.</Empty>}
      <div className="table-foot"><span className="num">{list.length} batches · {fmt(list.reduce((a, m) => a + m.destroyed, 0))} cases destroyed, {period.toLowerCase()}</span><span>Bring this to the freshness review: it shows which handoff to fix.</span></div>
    </div>
  </>
}

export default function Freshness({ toast, setSub, setActions }) {
  const [tab, setTab] = useState('next')
  const [rows, setRows] = useState(seedBatches)
  const [reps, setReps] = useState(seedDamaged)
  const [tasks, setTasks] = useState(seedTasks)
  const [reporting, setReporting] = useState(false)
  useEffect(() => { setSub(SUBS[tab]) }, [tab, setSub])
  useEffect(() => { setActions(<Btn kind="primary" onClick={() => setReporting(true)}>Report damage</Btn>); return () => setActions(null) }, [setActions])
  const closeReport = useCallback(() => setReporting(false), [])
  const sendReport = ({ cases, cond, text }) => {
    setReps(rs => [{ id: 'B-2410-20', name: 'Evaporated milk 160g', wh: 'Onitsha', cases: Number(cases), of: 800, what: 'Rain came in under the loading door', whatSub: 'Reported just now', type: 'Rain or water', cond: cond === 'carton' ? 'carton' : 'compromised', expires: '2 May 2027', life: 192, reported: 'Reported just now', by: 'Amaka Nwosu, Onitsha inventory team', detail: text, decision: null }, ...rs.filter(r => r.id !== 'B-2410-20')])
    setReporting(false); setTab('damaged'); toast(`${cases} cases on hold. Report sent to demand planning`)
  }
  const openTasks = tasks.filter(t => t.status !== 'done').length
  return (
    <div className="panel">
      <Tabs value={tab} onChange={setTab} tabs={[
        { key: 'next', label: 'Next 120 days' }, { key: 'damaged', label: 'Damaged', count: reps.filter(r => !r.decision).length || undefined },
        { key: 'tasks', label: 'Tasks', count: openTasks || undefined }, { key: 'routed', label: 'Routed' }, { key: 'missed', label: 'Missed', count: missed.length }]} />
      {tab === 'next' && <NextTab rows={rows} setRows={setRows} toast={toast} />}
      {tab === 'damaged' && <DamagedTab reps={reps} setReps={setReps} toast={toast} />}
      {tab === 'tasks' && <TasksTab tasks={tasks} setTasks={setTasks} toast={toast} />}
      {tab === 'routed' && <RoutedTab rows={rows} reps={reps} />}
      {tab === 'missed' && <MissedTab />}
      {reporting && <ReportDamage onClose={closeReport} onSend={sendReport} />}
    </div>
  )
}
