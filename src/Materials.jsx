import { useState, useCallback, useEffect } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Chip, Seg, Search, Btn, Drawer, Tabs, Empty, Stages, fmt } from './ui.jsx'
import { materials as seedMat, weeks, safety, flagsSent as seedFlags, inbound, repack as seedRepack, skus as seedSkus } from './data.js'

const SUBS = {
  cover: 'Raw and packaging materials against the production plan, 10 weeks ahead. Inbound shipments included.',
  inbound: 'Every open order for materials, from supplier to factory. Stages come from the import team. Last update today, 08:15.',
  repack: 'Cartons the freshness review needs for repackaging. Anything not covered from stock goes on the next flag to factory planning.',
  skus: 'Packaging for new SKUs. Packaging sets the sizes, procurement finds the vendor, MRP sets the quantity, factory planning buys.',
  flags: 'Every flag sent to factory planning and what they did about it. A flag closes when the order is placed.',
}

const kind = m => m.cells.some(c => c[0] === 'S') ? 'short' : m.cells.some(c => c[0] < safety[m.origin]) ? 'below' : 'covered'
const firstShort = m => { const i = m.cells.findIndex(c => c[0] === 'S' || c[0] < safety[m.origin]); return i < 0 ? 99 : i }

function Cell({ c, origin }) {
  const [v, note, late] = c
  const tone = v === 'S' ? 'out' : v < safety[origin] ? 'low' : 'safe'
  return (
    <div className={`mc ${tone}`} title={v === 'S' ? 'Short: line stops' : `${v} weeks of cover`}>
      <span className="num">{v === 'S' ? 'Short' : v.toFixed(1)}</span>
      {note && <small className={late ? 'late' : ''}>{note}</small>}
    </div>
  )
}

function FlagDrawer({ onClose, onSend }) {
  const [qty, setQty] = useState('25')
  const [pick, setPick] = useState('Bridge with a local buy')
  const [note, setNote] = useState('Line 2 runs malt drink all of W45 and W46. A local buy covers it if clearing cannot move.')
  return (
    <Drawer title="Flag malt extract to factory planning" sub="Factory planning places the order. Their reply shows under Flags sent." onClose={onClose}
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" disabled={!qty} onClick={() => onSend({ qty, pick, note })}>Send flag to factory planning</Btn></>}>
      <div className="alert"><small>Runs out Mon 2 Nov · W45</small><p>Line 2 stops making Malt drink 33cl ×24 unless 25 t arrives before the W47 shipment.</p></div>
      <div className="facts" style={{ background: 'var(--panel)', border: '1px solid var(--line)' }}>
        <div className="fact"><span>On hand</span><b className="num">18 t</b></div>
        <div className="fact"><span>Weekly need, from production plan</span><b className="num">12.5 t</b></div>
        <div className="fact"><span>Next shipment</span><b>60 t · ETA W47, 23 Nov</b></div>
        <div className="fact"><span>Gap until it lands</span><b className="out num">25 t</b></div>
      </div>
      <div className="facts">
        <div className="fact"><span>A new order today lands</span><b>W03, 21 Jan 2027</b></div>
        <div className="lead-bar" aria-hidden="true"><div style={{ flex: 4, background: '#6b6863' }} /><div style={{ flex: 5, background: '#1a1918' }} /><div style={{ flex: 3, background: '#a8550c' }} /><div style={{ flex: 1, background: '#b5b0aa' }} /></div>
        <span className="muted" style={{ fontSize: 13 }}>Supplier 4 wks · Sea 5 wks · Port and clearing 3 wks · Road 1 wk</span>
        <span style={{ fontSize: 13 }}>Too late for W45. Only faster clearing on the W47 shipment or a local buy closes the gap.</span>
      </div>
      <div className="field">
        <div className="fact" style={{ fontSize: 14 }}><b style={{ textAlign: 'left' }}>W47 shipment · PO 4500-3318</b><span style={{ color: 'var(--low)' }}>At Apapa, 9 days</span></div>
        <div className="steps">
          <div className="done"><b>Ordered</b><span>24 Aug</span></div>
          <div className="done"><b>Shipped</b><span>21 Sep</span></div>
          <div className="now"><b>At port</b><span>14 Oct</span></div>
          <div><b className="faint">Cleared</b></div>
          <div><b className="faint">At factory</b><span>23 Nov</span></div>
        </div>
      </div>
      <div className="two">
        <div className="field"><label htmlFor="qty">Quantity needed (t)</label><input id="qty" className="input num" inputMode="decimal" value={qty} onChange={e => setQty(e.target.value.replace(/[^\d.]/g, ''))} /></div>
        <div className="field"><label htmlFor="by">At the factory by</label><input id="by" className="input" type="date" defaultValue="2026-10-30" /></div>
      </div>
      <div className="field">
        <span className="flabel">Your suggestion <span className="faint" style={{ fontWeight: 400, fontSize: 13 }}>Optional, factory planning decides</span></span>
        <div className="pills">{['Push clearing forward', 'Bridge with a local buy', 'Both'].map(p => <button key={p} type="button" className="pill" aria-pressed={pick === p} onClick={() => setPick(pick === p ? '' : p)}>{p}</button>)}</div>
      </div>
      <div className="field"><label htmlFor="fnote">Note for factory planning</label><textarea id="fnote" className="input" value={note} onChange={e => setNote(e.target.value)} /></div>
    </Drawer>
  )
}

function QtyDrawer({ sku, onClose, onSend }) {
  const [qty, setQty] = useState('')
  return (
    <Drawer title="Send quantity to factory planning" sub={`${sku.sku} · ${sku.comp}`} onClose={onClose}
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" disabled={!qty} onClick={() => onSend(qty)}>Send quantity to factory planning</Btn></>}>
      <div className="facts">
        <div className="fact"><span>Launch</span><b>{sku.launch}, {sku.launchSub}</b></div>
        <div className="fact"><span>Vendor</span><b>Confirmed Thu 15 Oct</b></div>
        <div className="fact"><span>Order by</span><b className="low">{sku.orderBy}, {sku.orderSub.toLowerCase()}</b></div>
      </div>
      <div className="field"><label htmlFor="q">Pouches needed</label><input id="q" className="input num" inputMode="numeric" placeholder="Enter a quantity" value={qty} onChange={e => setQty(e.target.value.replace(/\D/g, ''))} /><span className="hint">Cover the launch volume plus 4 weeks of sales after it.</span></div>
      <div className="field"><label htmlFor="d">At the factory by</label><input id="d" className="input" type="date" defaultValue="2026-11-30" /></div>
    </Drawer>
  )
}

function Cover({ rows, onFlag }) {
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')
  const [byShort, setByShort] = useState(true)
  const base = rows.filter(m => !q || (m.name + m.code).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(m => f === 'all' || kind(m) === f).sort((a, b) => byShort ? firstShort(a) - firstShort(b) : a.name.localeCompare(b.name))
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search material or code" />
      <Seg label="Cover" value={f} onChange={setF} options={[
        { key: 'all', label: 'All', count: base.length }, { key: 'short', label: 'Runs short', count: base.filter(m => kind(m) === 'short').length },
        { key: 'below', label: 'Below safety', count: base.filter(m => kind(m) === 'below').length }, { key: 'covered', label: 'Covered', count: base.filter(m => kind(m) === 'covered').length }]} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setByShort(!byShort)}>{byShort ? 'First short week' : 'Material: A to Z'}</Btn>
    </div>
    <div className="table-wrap">
      <table className="mat" style={{ minWidth: 1140 }}>
        <thead><tr>
          <th>Material</th><th className="r">On hand</th><th className="r">Cover now</th>
          {weeks.map(([w, d]) => <th key={w} className="wk-h"><b>{w}</b><span>{d}</span></th>)}
          <th>Production at risk</th><th>Action</th>
        </tr></thead>
        <tbody>{list.map(m => (
          <tr key={m.code}>
            <td style={{ minWidth: 168 }}><div className="cell-main">{m.name}</div><div className="cell-sub">{m.code} · {m.origin} · {m.lead}</div></td>
            <td className="r num" style={{ whiteSpace: 'nowrap' }}>{m.onHand}</td>
            <td className="r num" style={{ whiteSpace: 'nowrap', fontWeight: 500, color: m.coverTone ? `var(--${m.coverTone})` : undefined }}>{m.cover} wks</td>
            {m.cells.map((c, i) => <td key={i} className="wk"><Cell c={c} origin={m.origin} /></td>)}
            <td style={{ minWidth: 156 }}>
              <div className={m.risk.title === 'None' ? 'faint' : ''}>{m.risk.title}</div>
              {m.risk.note && <div className={`cell-sub ${m.risk.tone === 'out' ? 'out' : m.risk.tone === 'low' ? 'low' : ''}`}>{m.risk.note}</div>}
            </td>
            <td style={{ minWidth: 190 }}>
              {m.action === 'flag' && <Btn kind="primary" onClick={onFlag}>Flag to factory planning</Btn>}
              {m.action === 'flagged' && <div><div>Flagged {m.flaggedOn}</div><div className="cell-sub">{m.flagStatus}</div></div>}
            </td>
          </tr>
        ))}</tbody>
      </table>
      {list.length === 0 && <Empty title="No materials match">Clear the search to see all seven.</Empty>}
      <div className="table-foot">
        <span>{list.length} materials · {base.filter(m => kind(m) === 'short').length} run short before their next shipment lands</span>
        <div className="legend">
          <span><i style={{ background: 'var(--safe-bg)' }} />Above safety</span>
          <span><i style={{ background: 'var(--low-bg)' }} />Below safety: 2 wks local, 8 wks imported</span>
          <span><i style={{ background: 'var(--out-bg)' }} />Short, line stops</span>
          <span>"in 60 t" = 60 t arrives that week (k = thousand)</span>
        </div>
      </div>
    </div>
  </>
}

function Inbound() {
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')
  const [soon, setSoon] = useState(true)
  const base = inbound.filter(s => !q || (s.mat + s.po + s.vessel).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(s => f === 'all' || (f === 'late' ? s.late : s.origin === f))
  const ordered = soon ? list : [...list].reverse()
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search material, PO or vessel" />
      <Seg label="Origin" value={f} onChange={setF} options={[{ key: 'all', label: 'All', count: base.length }, { key: 'Imported', label: 'Imported', count: base.filter(s => s.origin === 'Imported').length }, { key: 'Local', label: 'Local', count: base.filter(s => s.origin === 'Local').length }, { key: 'late', label: 'Late for need', count: base.filter(s => s.late).length }]} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setSoon(!soon)}>{soon ? 'Needed by: soonest' : 'Needed by: latest'}</Btn>
    </div>
    <div className="table-wrap">
      <table className="mat">
        <thead><tr><th>Shipment</th><th>Route</th><th className="r">Quantity</th><th>Where it is</th><th>At factory</th><th>Needed by</th><th>Against need</th><th>Import team</th></tr></thead>
        <tbody>{ordered.map(s => (
          <tr key={s.po}>
            <td><div className="cell-main">{s.mat}</div><div className="cell-sub">{s.po} · {s.origin}</div></td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{s.from}</div>{s.vessel && <div className="cell-sub">{s.vessel}</div>}</td>
            <td className="r num">{s.qty}</td>
            <td><Stages stages={s.stages} at={s.at} tone={s.whereTone ? 'var(--brand-amber)' : '#8f8b84'} /><div className={`cell-sub ${s.whereTone || ''}`} style={{ marginTop: 4 }}>{s.where}</div></td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{s.fac}</div><div className={`cell-sub ${s.facTone || ''}`}>{s.facSub}</div></td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{s.need}</div><div className="cell-sub">{s.needSub}</div></td>
            <td><Chip tone={s.against.tone} dot>{s.against.text}</Chip></td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{s.team}</div><div className="cell-sub">{s.teamSub}</div></td>
          </tr>
        ))}</tbody>
      </table>
      {ordered.length === 0 && <Empty title="No shipments match">Clear the search to see all open orders.</Empty>}
      <div className="table-foot"><span>{ordered.length} open orders · {ordered.filter(s => s.late).length} land after the week they are needed</span><span>Needed by comes from the Cover tab. Import stages come from the import team update.</span></div>
    </div>
  </>
}

function Repack({ rows, onFlag }) {
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')
  const [newest, setNewest] = useState(true)
  const base = rows.filter(r => !q || (r.name + r.id + r.code).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(r => f === 'all' || (f === 'order' ? r.state === 'order' : r.state !== 'order'))
  const ordered = newest ? list : [...list].reverse()
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search product, batch or carton" />
      <Seg label="Status" value={f} onChange={setF} options={[{ key: 'all', label: 'All', count: base.length }, { key: 'order', label: 'Needs ordering', count: base.filter(r => r.state === 'order').length }, { key: 'covered', label: 'Covered from stock', count: base.filter(r => r.state !== 'order').length }]} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setNewest(!newest)}>{newest ? 'Newest request first' : 'Oldest request first'}</Btn>
    </div>
    <div className="table-wrap">
      <table className="mat">
        <thead><tr><th>Request</th><th>Damage</th><th className="r">Cases to repack</th><th>Carton needed</th><th className="r">In stock</th><th className="r">To order</th><th>Requested by</th><th><span className="sr">Action</span></th></tr></thead>
        <tbody>{ordered.map(r => (
          <tr key={r.id}>
            <td><div className="cell-main">{r.name}</div><div className="cell-sub">{r.id} · {r.wh}</div></td>
            <td><div>{r.damage}</div><div className="cell-sub">{r.damageSub}</div></td>
            <td className="r num">{fmt(r.cases)}</td>
            <td><div>{r.carton}</div><div className="cell-sub">{r.code}</div></td>
            <td className="r num">{fmt(r.stock)}</td>
            <td className="r num" style={{ color: r.order ? 'var(--out)' : 'var(--ink-3)' }}>{r.order}</td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{r.by}</div><div className="cell-sub">{r.bySub}</div></td>
            <td className="r" style={{ minWidth: 190 }}>
              {r.state === 'order' && <Btn kind="primary" onClick={() => onFlag(r)}>Add {r.order} to next flag</Btn>}
              {r.state === 'flagged' && <Chip tone="neutral" dot>On flag, sent today</Chip>}
              {r.state === 'covered' && <Chip tone="safe" dot>Covered from stock</Chip>}
              {r.state === 'done' && <Chip tone="neutral" dot>{r.doneText}</Chip>}
            </td>
          </tr>
        ))}</tbody>
      </table>
      <div className="table-foot"><span className="num">{fmt(rows.reduce((t, r) => t + r.cases, 0))} cartons requested · {fmt(rows.reduce((t, r) => t + r.cases - r.order, 0))} from stock · {rows.filter(r => r.state === 'order').reduce((t, r) => t + r.order, 0)} to order</span><span>Requests arrive when demand planning routes a batch to Repackage.</span></div>
    </div>
  </>
}

function Skus({ rows, onSend, toast, setRows }) {
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')
  const [soon, setSoon] = useState(true)
  const base = rows.filter(r => !q || (r.sku + r.comp).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(r => f === 'all' || (f === 'you' ? r.waiting === 'You' : r.waiting !== 'You' && r.waiting !== 'Nobody'))
  const ordered = soon ? list : [...list].reverse()
  const nudge = r => { setRows(rs => rs.map(x => x === r ? { ...x, nudged: true } : x)); toast(`Nudged the ${r.waiting.toLowerCase()} about ${r.comp.toLowerCase()}`) }
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search SKU or component" />
      <Seg label="Waiting on" value={f} onChange={setF} options={[{ key: 'all', label: 'All', count: base.length }, { key: 'you', label: 'Waiting on you', count: base.filter(r => r.waiting === 'You').length }, { key: 'others', label: 'Waiting on others', count: base.filter(r => r.waiting !== 'You' && r.waiting !== 'Nobody').length }]} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setSoon(!soon)}>{soon ? 'Order by: soonest' : 'Order by: latest'}</Btn>
    </div>
    <div className="table-wrap">
      <table className="mat">
        <thead><tr><th>New SKU and component</th><th>Launch</th><th>Handoff</th><th>Order by</th><th>Waiting on</th><th><span className="sr">Action</span></th></tr></thead>
        <tbody>{ordered.map(r => (
          <tr key={r.sku + r.comp}>
            <td><div className="cell-main">{r.sku}</div><div className="cell-sub" style={{ color: 'var(--ink-2)' }}>{r.comp}</div></td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{r.launch}</div><div className="cell-sub">{r.launchSub}</div></td>
            <td><Stages stages={['Packaging', 'Procurement', 'MRP', 'Factory planning']} at={r.at} tone={r.waiting === 'You' ? 'var(--brand-amber)' : '#8f8b84'} /><div className={`cell-sub ${r.noteTone || ''}`} style={{ marginTop: 4, whiteSpace: 'normal' }}>{r.note}</div></td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{r.orderBy}</div><div className="cell-sub">{r.orderSub}</div></td>
            <td style={{ whiteSpace: 'nowrap' }}><div style={{ color: r.waiting === 'You' ? 'var(--low)' : r.waiting === 'Nobody' ? 'var(--ink-3)' : undefined }}>{r.waiting}</div>{r.waitingSub && <div className="cell-sub">{r.waitingSub}</div>}</td>
            <td className="r" style={{ minWidth: 250 }}>
              {r.action === 'send' && <Btn kind="primary" onClick={() => onSend(r)}>Send quantity to factory planning</Btn>}
              {r.action === 'nudge' && (r.nudged ? <span className="cell-sub">Nudged today</span> : <Btn onClick={() => nudge(r)}>Nudge</Btn>)}
              {r.action === 'ordered' && <Chip tone="safe" dot>Ordered</Chip>}
              {r.action === 'sent' && <Chip tone="neutral" dot>Quantity sent today</Chip>}
            </td>
          </tr>
        ))}</tbody>
      </table>
      <div className="table-foot"><span>2 new SKUs · {rows.length} packaging components · {rows.filter(r => r.action === 'ordered').length} ordered</span><span>Order by = launch date minus lead time (local packaging 1 to 2 weeks) and filling time.</span></div>
    </div>
  </>
}

function Flags({ flags, setFlags, toast }) {
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')
  const [newest, setNewest] = useState(true)
  const base = flags.filter(x => !q || (x.material + x.sub).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(x => f === 'all' || (f === 'open' ? x.open : !x.open))
  const ordered = newest ? list : [...list].reverse()
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search material or PO" />
      <Seg label="Status" value={f} onChange={setF} options={[{ key: 'all', label: 'All', count: base.length }, { key: 'open', label: 'Open', count: base.filter(x => x.open).length }, { key: 'closed', label: 'Closed', count: base.filter(x => !x.open).length }]} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setNewest(!newest)}>{newest ? 'Newest first' : 'Oldest first'}</Btn>
    </div>
    <div className="table-wrap">
      <table className="mat">
        <thead><tr><th>Flag</th><th className="r">Quantity</th><th>Needed at factory</th><th>Sent</th><th>Factory planning reply</th><th>Status</th><th><span className="sr">Action</span></th></tr></thead>
        <tbody>{ordered.map(x => (
          <tr key={x.id}>
            <td><div className="cell-main">{x.material}</div><div className="cell-sub">{x.sub}</div></td>
            <td className="r num" style={{ whiteSpace: 'nowrap' }}>{x.qty}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{x.by}</td>
            <td style={{ whiteSpace: 'nowrap' }}><div>{x.sent}</div><div className="cell-sub">by {x.sentBy}</div></td>
            <td style={{ minWidth: 280 }}>{x.reply ? <><div>{x.reply}</div><div className="cell-sub">{x.replyBy}</div></> : <><div className="faint">No reply yet</div>{x.suggestion && <div className="cell-sub">Suggested: {x.suggestion.toLowerCase()}</div>}</>}</td>
            <td><Chip tone={x.status.tone} dot>{x.status.text}</Chip></td>
            <td className="r" style={{ minWidth: 90 }}>{!x.reply && (x.nudged ? <span className="cell-sub">Nudged</span> : <Btn onClick={() => { setFlags(fs => fs.map(y => y.id === x.id ? { ...y, nudged: true } : y)); toast('Factory planning nudged') }}>Nudge</Btn>)}</td>
          </tr>
        ))}</tbody>
      </table>
      <div className="table-foot"><span>{flags.length} flags · {flags.filter(x => x.open).length} open · {flags.filter(x => !x.open).length} ordered</span><span>Replies come from factory planning; a flag closes when a PO number is added.</span></div>
    </div>
  </>
}

export default function Materials({ toast, setSub }) {
  const [tab, setTab] = useState('cover')
  const [rows, setRows] = useState(seedMat)
  const [flags, setFlags] = useState(seedFlags)
  const [reps, setReps] = useState(seedRepack)
  const [skus, setSkus] = useState(seedSkus)
  const [flagOpen, setFlagOpen] = useState(false)
  const [qtyFor, setQtyFor] = useState(null)
  useEffect(() => { setSub(SUBS[tab]) }, [tab, setSub])
  const closeFlag = useCallback(() => setFlagOpen(false), [])
  const closeQty = useCallback(() => setQtyFor(null), [])
  const sendFlag = ({ qty, pick }) => {
    setRows(rs => rs.map(m => m.name === 'Malt extract' ? { ...m, action: 'flagged', flaggedOn: '22 Oct', flagStatus: 'Waiting on reply' } : m))
    setFlags(fs => [{ id: 'f-malt', material: 'Malt extract', sub: 'RM-1042 · Line 2 stops W45', qty: `${qty} t`, by: 'Fri 30 Oct', sent: 'Today', sentBy: 'Tola Ajayi', reply: null, suggestion: pick, open: true, status: { tone: 'low', text: 'Waiting' } }, ...fs])
    setFlagOpen(false); toast('Flag sent to factory planning. Their reply will show under Flags sent')
  }
  const flagCartons = r => {
    setReps(rs => rs.map(x => x.id === r.id ? { ...x, state: 'flagged' } : x))
    setFlags(fs => [{ id: 'f-cart', material: `Shipper cartons ${r.code}`, sub: `For ${r.wh} repackaging`, qty: String(r.order), by: 'Fri 30 Oct', sent: 'Today', sentBy: 'Tola Ajayi', reply: null, open: true, status: { tone: 'low', text: 'Waiting' } }, ...fs])
    toast(`${r.order} cartons sent to factory planning`)
  }
  const sendQty = qty => {
    setSkus(ss => ss.map(s => s === qtyFor ? { ...s, at: 3, waiting: 'Factory planning', waitingSub: 'Since today', note: `Quantity sent today: ${fmt(Number(qty))} pouches`, noteTone: '', action: 'sent' } : s))
    setQtyFor(null); toast('Quantity sent to factory planning')
  }
  const openFlags = flags.filter(f => f.open).length
  return (
    <div className="panel">
      <Tabs value={tab} onChange={setTab} tabs={[
        { key: 'cover', label: 'Cover' }, { key: 'inbound', label: 'Inbound shipments', count: inbound.length },
        { key: 'repack', label: 'Repackaging', count: reps.length }, { key: 'skus', label: 'New SKUs', count: skus.length },
        { key: 'flags', label: 'Flags sent', count: openFlags }]} />
      {tab === 'cover' && <Cover rows={rows} onFlag={() => setFlagOpen(true)} />}
      {tab === 'inbound' && <Inbound />}
      {tab === 'repack' && <Repack rows={reps} onFlag={flagCartons} />}
      {tab === 'skus' && <Skus rows={skus} setRows={setSkus} onSend={setQtyFor} toast={toast} />}
      {tab === 'flags' && <Flags flags={flags} setFlags={setFlags} toast={toast} />}
      {flagOpen && <FlagDrawer onClose={closeFlag} onSend={sendFlag} />}
      {qtyFor && <QtyDrawer sku={qtyFor} onClose={closeQty} onSend={sendQty} />}
    </div>
  )
}
