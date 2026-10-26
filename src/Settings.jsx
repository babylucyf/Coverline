import { useState, useEffect, useCallback } from 'react'
import { Chip, Seg, Search, Btn, Tabs, Drawer, Empty, fmt } from './ui.jsx'
import { leadTimes, rules, locations, people, stock } from './data.js'

function AddMaterial({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [src, setSrc] = useState('Local')
  const [sup, setSup] = useState('')
  const ok = name.trim() && code.trim() && sup.trim()
  return (
    <Drawer title="Add material" sub="It joins the Cover projection from the next morning run." onClose={onClose}
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" disabled={!ok} onClick={() => onAdd({ name, code, src, sup })}>Add material</Btn></>}>
      <div className="field"><label htmlFor="mn">Material name</label><input id="mn" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="For example, Sugar, granulated" /></div>
      <div className="field"><label htmlFor="mc">Code</label><input id="mc" className="input" value={code} onChange={e => setCode(e.target.value)} placeholder="RM-0000" /></div>
      <div className="field"><span className="flabel">Source</span><div className="pills">{['Local', 'Imported'].map(s => <button key={s} type="button" className="pill" aria-pressed={src === s} onClick={() => setSrc(s)}>{s}</button>)}</div><span className="hint">Safety level is set from this: {src === 'Local' ? '2 weeks' : '8 weeks'} of cover.</span></div>
      <div className="field"><label htmlFor="ms">Supplier lead time</label><input id="ms" className="input" value={sup} onChange={e => setSup(e.target.value)} placeholder="For example, 2 wks" /></div>
    </Drawer>
  )
}

export default function Settings({ toast }) {
  const [tab, setTab] = useState('materials')
  const [rows, setRows] = useState(leadTimes)
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')
  const [adding, setAdding] = useState(false)
  const close = useCallback(() => setAdding(false), [])
  const base = rows.filter(r => !q || (r.name + r.code).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(r => f === 'all' || r.src === f)
  const add = m => {
    setRows(rs => [...rs, { name: m.name, code: m.code, src: m.src, unit: 't', sup: m.sup, sea: m.src === 'Imported' ? 'Not set' : null, port: m.src === 'Imported' ? 'Not set' : null, road: 'Not set', total: 'Not set', safety: m.src === 'Local' ? '2 wks' : '8 wks', by: 'You', when: 'Just now' }])
    setAdding(false); toast(`${m.name} added. It shows in Cover from tomorrow's run`)
  }
  return (
    <div className="panel">
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'products', label: 'Products', count: stock.length }, { key: 'materials', label: 'Materials', count: rows.length }, { key: 'rules', label: 'Rules' }, { key: 'locations', label: 'Locations', count: locations.length }, { key: 'users', label: 'Users and roles' }]} />
      {tab === 'materials' && <>
        <div className="toolbar">
          <Search value={q} onChange={setQ} placeholder="Search material or code" />
          <Seg label="Source" value={f} onChange={setF} options={[{ key: 'all', label: 'All', count: base.length }, { key: 'Imported', label: 'Imported', count: base.filter(r => r.src === 'Imported').length }, { key: 'Local', label: 'Local', count: base.filter(r => r.src === 'Local').length }]} />
          <span className="grow" />
          <Btn onClick={() => setAdding(true)}>Add material</Btn>
        </div>
        <div className="table-wrap">
          <table className="mat">
            <thead><tr><th>Material</th><th>Source</th><th>Unit</th><th className="r">Supplier</th><th className="r">Sea</th><th className="r">Port and clearing</th><th className="r">Road</th><th className="r">Total lead</th><th className="r">Safety level</th><th>Last changed</th></tr></thead>
            <tbody>{list.map(r => (
              <tr key={r.code}>
                <td><div className="cell-main">{r.name}</div><div className="cell-sub">{r.code}</div></td>
                <td className="muted">{r.src}</td><td className="muted">{r.unit}</td>
                <td className="r num">{r.sup}</td>
                <td className="r num">{r.sea || <span className="faint">None</span>}</td>
                <td className="r num">{r.port ? <><div style={{ color: r.portWas ? 'var(--low)' : undefined }}>{r.port}</div>{r.portWas && <div className="cell-sub">{r.portWas}</div>}</> : <span className="faint">None</span>}</td>
                <td className="r num">{r.road}</td>
                <td className="r num" style={{ fontWeight: 500 }}>{r.total}</td>
                <td className="r num">{r.safety}</td>
                <td style={{ whiteSpace: 'nowrap' }}><div>{r.by}</div><div className={`cell-sub ${r.whenTone || ''}`}>{r.when}</div></td>
              </tr>
            ))}</tbody>
          </table>
          {list.length === 0 && <Empty title="No materials match">Clear the search.</Empty>}
          <div className="table-foot"><span>Lead time and safety level feed the Cover projection and the flag drawer.</span><span>Changes apply from the next morning run.</span></div>
        </div>
      </>}
      {tab === 'products' && (
        <div className="table-wrap">
          <table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Main warehouse</th><th className="r">Cases on hand</th></tr></thead>
            <tbody>{stock.map(s => <tr key={s.sku}><td className="cell-main">{s.name}</td><td className="num muted">{s.sku}</td><td>{s.cat}</td><td>{s.wh}</td><td className="r num">{fmt(s.cases)}</td></tr>)}</tbody></table>
          <div className="table-foot"><span>{stock.length} sample products</span><span>A full catalogue would load from the ERP</span></div>
        </div>
      )}
      {tab === 'rules' && (
        <div className="table-wrap">
          <table><thead><tr><th>Rule</th><th>Value</th><th>What it does</th></tr></thead>
            <tbody>{rules.map(r => <tr key={r.name}><td className="cell-main">{r.name}</td><td><Chip tone="neutral">{r.value}</Chip></td><td className="muted">{r.note}</td></tr>)}</tbody></table>
          <div className="table-foot"><span>Head office planning sets these. Every change is logged.</span></div>
        </div>
      )}
      {tab === 'locations' && (
        <div className="table-wrap">
          <table><thead><tr><th>Location</th><th>Type</th><th>Last stock count</th><th>Sync</th></tr></thead>
            <tbody>{locations.map(l => <tr key={l.name}><td className="cell-main">{l.name}</td><td className="muted">{l.kind}</td><td className="num">Today {l.sync}</td><td>{l.ok ? <Chip tone="safe" dot>Up to date</Chip> : <Chip tone="low" dot>Behind</Chip>}</td></tr>)}</tbody></table>
        </div>
      )}
      {tab === 'users' && (
        <div className="table-wrap">
          <table><thead><tr><th>Person</th><th>Team</th><th>Can do</th></tr></thead>
            <tbody>{people.map(p => <tr key={p.name}><td className="cell-main">{p.name}</td><td>{p.role}</td><td className="muted">{p.access}</td></tr>)}</tbody></table>
          <div className="table-foot"><span>Sample team. Names are fictional.</span></div>
        </div>
      )}
      {adding && <AddMaterial onClose={close} onAdd={add} />}
    </div>
  )
}
