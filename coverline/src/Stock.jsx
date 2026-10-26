import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Chip, Seg, Search, Btn, Empty, fmt } from './ui.jsx'
import { stock } from './data.js'

const statusLabel = { out: 'Out of stock', low: 'Low cover', safe: 'Safe' }
const coverColor = { out: 'var(--out)', low: 'var(--low)', safe: 'var(--safe)' }

export default function Stock() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [wh, setWh] = useState('all')
  const [asc, setAsc] = useState(true)
  const whs = [...new Set(stock.map(s => s.wh))].sort()
  const base = stock.filter(s => (wh === 'all' || s.wh === wh) && (!q || (s.name + s.sku).toLowerCase().includes(q.toLowerCase())))
  const rows = useMemo(() => base.filter(s => status === 'all' || s.status === status).sort((a, b) => asc ? a.cover - b.cover : b.cover - a.cover), [base, status, asc])
  const count = k => base.filter(s => k === 'all' || s.status === k).length
  return (
    <div className="panel">
      <div className="toolbar">
        <Search value={q} onChange={setQ} placeholder="Search products or SKU" />
        <select className="select" value={wh} onChange={e => setWh(e.target.value)} aria-label="Warehouse">
          <option value="all">All warehouses</option>{whs.map(w => <option key={w}>{w}</option>)}
        </select>
        <Seg label="Status" value={status} onChange={setStatus} options={[
          { key: 'all', label: 'All', count: count('all') }, { key: 'out', label: 'Out of stock', count: count('out') },
          { key: 'low', label: 'Low cover', count: count('low') }, { key: 'safe', label: 'Safe', count: count('safe') }]} />
        <span className="grow" />
        <Btn icon={ArrowUpDown} onClick={() => setAsc(!asc)}>{asc ? 'Cover: lowest first' : 'Cover: highest first'}</Btn>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Product</th><th>Warehouse</th><th className="r">On hand (cases)</th><th>Days of cover</th><th>Shelf life left</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map(s => (
              <tr key={s.sku}>
                <td><div className="cell-main">{s.name}</div><div className="cell-sub">{s.sku}</div></td>
                <td>{s.wh}</td>
                <td className="r num">{fmt(s.cases)}</td>
                <td>
                  <div className="coverbar">
                    <div className="track"><div className="fill" style={{ width: `${Math.min(100, s.cover / 15 * 100)}%`, background: coverColor[s.status] }} /></div>
                    <span className="num" style={{ color: s.status === 'safe' ? 'var(--ink)' : coverColor[s.status] }}>{s.cover === 0 ? '0' : s.cover.toFixed(1)} days</span>
                  </div>
                </td>
                <td>
                  {s.life === null ? <span className="faint">No stock</span> : <>
                    <div className="num" style={{ color: s.lifeTone ? `var(--${s.lifeTone})` : undefined }}>{s.life} days</div>
                    <div className={`cell-sub ${s.lifeTone || ''}`}>{s.lifeNote}</div>
                  </>}
                </td>
                <td><Chip tone={s.status} dot>{statusLabel[s.status]}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <Empty title="No products match">Try another warehouse or clear the search.</Empty>}
        <div className="table-foot"><span>{rows.length} of {stock.length} sample products</span><span>Cover = cases on hand ÷ average daily sales, last 4 weeks</span></div>
      </div>
    </div>
  )
}
