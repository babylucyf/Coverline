import { useState, useCallback } from 'react'
import { Chip, Seg, Search, Btn, Drawer, Tabs, Empty } from './ui.jsx'
import { materials as seed, weeks, safety, flagsSent as seedFlags } from './data.js'

const kind = m => m.cells.some(c => c[0] === 'S') ? 'short' : m.cells.some(c => c[0] < safety[m.origin]) ? 'below' : 'covered'

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
        <div className="fact"><span>A new order today lands</span><b>W02, 14 Jan 2027</b></div>
        <div className="lead-bar" aria-hidden="true"><div style={{ flex: 4, background: '#6b6863' }} /><div style={{ flex: 5, background: '#1a1918' }} /><div style={{ flex: 2, background: '#a8550c' }} /><div style={{ flex: 1, background: '#b5b0aa' }} /></div>
        <span className="muted" style={{ fontSize: 13 }}>Supplier 4 wks · Sea 5 wks · Port and clearing 2 wks · Road 1 wk</span>
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

export default function Materials({ toast }) {
  const [rows, setRows] = useState(seed)
  const [flags, setFlags] = useState(seedFlags)
  const [tab, setTab] = useState('cover')
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')
  const [open, setOpen] = useState(false)
  const base = rows.filter(m => !q || (m.name + m.code).toLowerCase().includes(q.toLowerCase()))
  const list = base.filter(m => f === 'all' || kind(m) === f)
  const close = useCallback(() => setOpen(false), [])
  const send = ({ qty, pick }) => {
    setRows(rs => rs.map(m => m.name === 'Malt extract' ? { ...m, action: 'flagged', flaggedOn: '22 Oct', flagStatus: 'Awaiting reply' } : m))
    setFlags(fs => [{ material: 'Malt extract', product: 'Malt drink 33cl ×24', qty: `${qty} t`, by: 'Fri 30 Oct', sent: 'Thu 22 Oct', reply: null, who: 'Factory planning, Lagos', suggestion: pick, status: { tone: 'neutral', text: 'Awaiting reply' } }, ...fs])
    setOpen(false)
    toast('Flag sent to factory planning. Their reply will show under Flags sent.')
  }
  return (
    <div className="panel">
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'cover', label: 'Cover' }, { key: 'flags', label: 'Flags sent', count: flags.length }]} />
      {tab === 'cover' ? <>
        <div className="toolbar">
          <Search value={q} onChange={setQ} placeholder="Search material or code" />
          <Seg label="Cover" value={f} onChange={setF} options={[
            { key: 'all', label: 'All', count: base.length }, { key: 'short', label: 'Runs short', count: base.filter(m => kind(m) === 'short').length },
            { key: 'below', label: 'Below safety', count: base.filter(m => kind(m) === 'below').length }, { key: 'covered', label: 'Covered', count: base.filter(m => kind(m) === 'covered').length }]} />
        </div>
        <div className="table-wrap">
          <table className="mat" style={{ minWidth: 1040 }}>
            <thead><tr>
              <th>Material</th><th className="r">On hand</th><th className="r">Cover now</th>
              {weeks.map(([w, d]) => <th key={w} className="wk-h"><b>{w}</b><span>{d}</span></th>)}
              <th>Production at risk</th>
            </tr></thead>
            <tbody>
              {list.map(m => (
                <tr key={m.code}>
                  <td style={{ minWidth: 180 }}><div className="cell-main">{m.name}</div><div className="cell-sub">{m.code} · {m.origin} · {m.lead}</div></td>
                  <td className="r num" style={{ whiteSpace: 'nowrap' }}>{m.onHand}</td>
                  <td className="r num" style={{ whiteSpace: 'nowrap', fontWeight: 500, color: m.coverTone ? `var(--${m.coverTone})` : undefined }}>{m.cover} wks</td>
                  {m.cells.map((c, i) => <td key={i} className="wk"><Cell c={c} origin={m.origin} /></td>)}
                  <td style={{ minWidth: 212 }}>
                    <div className={m.risk.title === 'None' ? 'faint' : ''}>{m.risk.title}</div>
                    {m.risk.note && <div className={`cell-sub ${m.risk.tone === 'out' ? 'out' : m.risk.tone === 'low' ? 'low' : ''}`}>{m.risk.note}</div>}
                    {m.action === 'flag' && <div style={{ marginTop: 8 }}><Btn kind="primary" onClick={() => setOpen(true)}>Flag to factory planning</Btn></div>}
                    {m.action === 'flagged' && <div className="flagged" style={{ marginTop: 6 }}><b>Flagged {m.flaggedOn}</b><span className="cell-sub">{m.flagStatus}</span></div>}
                  </td>
                </tr>
              ))}
            </tbody>
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
      </> : (
        <div className="flags">
          {flags.map(fl => (
            <article className="flag-card" key={fl.material + fl.sent}>
              <div>
                <h3>{fl.material} for {fl.product}</h3>
                <div className="meta">{fl.qty} needed by {fl.by} · sent {fl.sent}{fl.suggestion ? ` · suggested: ${fl.suggestion.toLowerCase()}` : ''}</div>
              </div>
              <Chip tone={fl.status.tone} dot>{fl.status.text}</Chip>
              <blockquote>{fl.reply || 'No reply yet.'}<span>{fl.reply ? fl.who : 'Waiting on factory planning'}</span></blockquote>
            </article>
          ))}
        </div>
      )}
      {open && <FlagDrawer onClose={close} onSend={send} />}
    </div>
  )
}
