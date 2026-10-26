import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Chip, Search, Btn, Empty, Tabs, Filter, ViewToggle, fmt } from './ui.jsx'
import { stock, batches, qa, locations } from './data.js'

const statusLabel = { out: 'Out of stock', low: 'Low cover', safe: 'Safe' }
const coverColor = { out: 'var(--out)', low: 'var(--low)', safe: 'var(--safe)' }
const coverBand = c => c < 3 ? 'Under 3 days' : c <= 7 ? '3 to 7 days' : 'Over 7 days'

function CoverBar({ s }) {
  return (
    <div className="coverbar">
      <div className="track"><div className="fill" style={{ width: `${Math.min(100, s.cover / 15 * 100)}%`, background: coverColor[s.status] }} /></div>
      <span className="num" style={{ color: s.status === 'safe' ? 'var(--ink)' : coverColor[s.status] }}>{s.cover === 0 ? '0' : s.cover.toFixed(1)} days</span>
    </div>
  )
}

function ByProduct() {
  const [q, setQ] = useState('')
  const [wh, setWh] = useState(null)
  const [cat, setCat] = useState(null)
  const [band, setBand] = useState(null)
  const [status, setStatus] = useState(null)
  const [asc, setAsc] = useState(true)
  const [view, setView] = useState('list')
  const rows = stock
    .filter(s => (!wh || s.wh === wh) && (!cat || s.cat === cat) && (!band || coverBand(s.cover) === band) && (!status || statusLabel[s.status] === status))
    .filter(s => !q || (s.name + s.sku).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => asc ? a.cover - b.cover : b.cover - a.cover)
  const clear = () => { setQ(''); setWh(null); setCat(null); setBand(null); setStatus(null) }
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search products or SKU" />
      <Filter label="Warehouse" value={wh} onChange={setWh} options={[...new Set(stock.map(s => s.wh))].sort()} />
      <Filter label="Category" value={cat} onChange={setCat} options={[...new Set(stock.map(s => s.cat))].sort()} />
      <Filter label="Days of cover" value={band} onChange={setBand} options={['Under 3 days', '3 to 7 days', 'Over 7 days']} />
      <Filter label="Status" value={status} onChange={setStatus} options={['Out of stock', 'Low cover', 'Safe']} />
      <span className="grow" />
      <Btn icon={ArrowUpDown} onClick={() => setAsc(!asc)}>{asc ? 'Cover: lowest first' : 'Cover: highest first'}</Btn>
      <ViewToggle value={view} onChange={setView} />
    </div>
    {view === 'list' ? (
      <div className="table-wrap">
        <table>
          <thead><tr><th>Product</th><th>Warehouse</th><th className="r">On hand (cases)</th><th>Days of cover</th><th>Shelf life left</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map(s => (
              <tr key={s.sku}>
                <td><div className="cell-main">{s.name}</div><div className="cell-sub">{s.sku}</div></td>
                <td>{s.wh}</td>
                <td className="r num">{fmt(s.cases)}</td>
                <td><CoverBar s={s} /></td>
                <td>{s.life === null ? <span className="faint">No stock</span> : <><div className="num" style={{ color: s.lifeTone ? `var(--${s.lifeTone})` : undefined }}>{s.life} days</div><div className={`cell-sub ${s.lifeTone || ''}`}>{s.lifeNote}</div></>}</td>
                <td><Chip tone={s.status} dot>{statusLabel[s.status]}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <Empty title="No products match these filters"><button type="button" className="linkbtn" onClick={clear}>Clear filters</button></Empty>}
        <div className="table-foot"><span>{rows.length} of {stock.length} sample products</span><span>Days of cover = cases on hand ÷ average daily sales, last 4 weeks</span></div>
      </div>
    ) : (
      rows.length ? <div className="cards">
        {rows.map(s => (
          <article className="pcard" key={s.sku}>
            <div className="top"><div><h3>{s.name}</h3><div className="cell-sub">{s.sku} · {s.wh}</div></div><Chip tone={s.status} dot>{statusLabel[s.status]}</Chip></div>
            <div className="row"><span>On hand</span><span className="num">{fmt(s.cases)} cases</span></div>
            <CoverBar s={s} />
            <div className="row"><span>Shelf life</span><span style={{ color: s.lifeTone ? `var(--${s.lifeTone})` : undefined }}>{s.life === null ? 'No stock' : s.lifeNote}</span></div>
          </article>
        ))}
      </div> : <Empty title="No products match these filters"><button type="button" className="linkbtn" onClick={clear}>Clear filters</button></Empty>
    )}
  </>
}

function ByBatch() {
  const [q, setQ] = useState('')
  const [wh, setWh] = useState(null)
  const all = [
    ...batches.map(b => ({ id: b.id, name: b.name, wh: b.wh, cases: b.cases, expires: b.expires, days: b.days, state: b.days <= 90 ? { tone: 'out', text: 'In staff pack window' } : { tone: 'low', text: 'Window opens soon' } })),
    ...qa.filter(r => r.locSub === 'Warehouse').map(r => ({ id: r.id, name: r.name, wh: r.loc, cases: r.cases, expires: '', days: null, state: { tone: 'neutral', text: 'On QA hold' } })),
  ]
  const rows = all.filter(b => (!wh || b.wh === wh) && (!q || (b.name + b.id).toLowerCase().includes(q.toLowerCase())))
  return <>
    <div className="toolbar">
      <Search value={q} onChange={setQ} placeholder="Search batch or product" />
      <Filter label="Warehouse" value={wh} onChange={setWh} options={[...new Set(all.map(b => b.wh))].sort()} />
    </div>
    <div className="table-wrap">
      <table>
        <thead><tr><th>Batch</th><th>Product</th><th>Warehouse</th><th className="r">Cases</th><th>Expires</th><th>Status</th></tr></thead>
        <tbody>{rows.map(b => (
          <tr key={b.id}><td className="num cell-main">{b.id}</td><td>{b.name}</td><td>{b.wh}</td><td className="r num">{fmt(b.cases)}</td>
            <td>{b.expires ? <><div>{b.expires}</div><div className="cell-sub">{b.days} days left</div></> : <span className="faint">Held until QA releases</span>}</td>
            <td><Chip tone={b.state.tone} dot>{b.state.text}</Chip></td></tr>
        ))}</tbody>
      </table>
      {rows.length === 0 && <Empty title="No batches match">Clear the search or pick another warehouse.</Empty>}
      <div className="table-foot"><span>{rows.length} batches that need attention</span><span>Batches with nothing to act on are hidden</span></div>
    </div>
  </>
}

function ByLocation() {
  const rows = locations.filter(l => l.kind === 'Warehouse').map(l => {
    const items = stock.filter(s => s.wh === l.name)
    return { ...l, products: items.length, cases: items.reduce((a, s) => a + s.cases, 0), low: items.filter(s => s.status !== 'safe').length }
  })
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Warehouse</th><th className="r">Products tracked</th><th className="r">Cases on hand</th><th>Low or out</th><th>Last stock count</th></tr></thead>
        <tbody>{rows.map(l => (
          <tr key={l.name}><td className="cell-main">{l.name}</td><td className="r num">{l.products}</td><td className="r num">{fmt(l.cases)}</td>
            <td>{l.low ? <Chip tone="low" dot>{l.low} {l.low === 1 ? 'product' : 'products'}</Chip> : <span className="faint">None</span>}</td>
            <td>{l.ok ? <span className="num">Today {l.sync}</span> : <><div className="num" style={{ color: 'var(--low)' }}>Today {l.sync}</div><div className="cell-sub low">Behind. Figures may be out of date</div></>}</td></tr>
        ))}</tbody>
      </table>
      <div className="table-foot"><span>6 warehouses · sample products only</span><span>Counts sync from each warehouse every morning</span></div>
    </div>
  )
}

export default function Stock() {
  const [tab, setTab] = useState('product')
  return (
    <div className="panel">
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'product', label: 'By product' }, { key: 'batch', label: 'By batch' }, { key: 'location', label: 'By location' }]} />
      {tab === 'product' && <ByProduct />}
      {tab === 'batch' && <ByBatch />}
      {tab === 'location' && <ByLocation />}
    </div>
  )
}
