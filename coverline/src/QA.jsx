import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Chip, Seg, Search, Btn, Empty, fmt } from './ui.jsx'
import { qa as seed } from './data.js'

export default function QA({ toast }) {
  const [rows, setRows] = useState(seed)
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [desc, setDesc] = useState(true)
  const types = ['Factory output', 'Warehouse stock', 'Staff pack by mistake', 'Damage check']
  const base = rows.filter(r => !q || (r.name + r.id).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(r => type === 'all' || r.type === type).sort((a, b) => desc ? b.held - a.held : a.held - b.held)
  const chase = r => { setRows(rs => rs.map(x => x.id === r.id ? { ...x, chased: true } : x)); toast(`QA chased for ${r.name}, batch ${r.id}`) }
  const total = list.reduce((s, r) => s + r.cases, 0)
  return (
    <div className="panel">
      <div className="toolbar">
        <Search value={q} onChange={setQ} placeholder="Search batch or product" />
        <Seg label="Hold reason" value={type} onChange={setType} options={[{ key: 'all', label: 'All', count: base.length }, ...types.map(t => ({ key: t, label: t, count: base.filter(r => r.type === t).length }))]} />
        <span className="grow" />
        <Btn icon={ArrowUpDown} onClick={() => setDesc(!desc)}>{desc ? 'Longest on hold first' : 'Newest hold first'}</Btn>
      </div>
      <div className="table-wrap">
        <table className="mat">
          <thead><tr><th>Batch</th><th>Location</th><th className="r">Cases</th><th>Hold reason</th><th>On hold</th><th>Results due</th><th>QA stage</th><th>On release</th></tr></thead>
          <tbody>
            {list.map(r => (
              <tr key={r.id}>
                <td><div className="cell-main">{r.name}</div><div className="cell-sub">Batch {r.id}</div></td>
                <td><div>{r.loc}</div><div className="cell-sub">{r.locSub}</div></td>
                <td className="r num">{fmt(r.cases)}</td>
                <td style={{ minWidth: 190 }}><div>{r.reason}</div><div className="cell-sub">{r.reasonSub}</div></td>
                <td className="num" style={{ color: r.heldTone ? `var(--${r.heldTone})` : undefined }}>{r.held} {r.held === 1 ? 'day' : 'days'}</td>
                <td style={{ whiteSpace: 'nowrap' }}><div>{r.due}</div><div className={`cell-sub ${r.dueTone || ''}`}>{r.dueSub}</div></td>
                <td style={{ whiteSpace: 'nowrap' }}><Chip tone={r.stage.tone} dot>{r.stage.text}</Chip>{r.chase && <div style={{ marginTop: 8 }}>{r.chased ? <span className="cell-sub">Chased today</span> : <Btn kind="primary" onClick={() => chase(r)}>Chase QA</Btn>}</div>}</td>
                <td style={{ minWidth: 160 }}><div>{r.next}</div><div className="cell-sub">{r.nextSub}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <Empty title="Nothing on hold here">No batches match this filter.</Empty>}
        <div className="table-foot"><span className="num">{list.length} batches on hold · {fmt(total)} cases · {list.filter(r => r.dueTone === 'out').length} past its results date</span><span>Nothing here can be dispatched or routed until QA releases it.</span></div>
      </div>
    </div>
  )
}
