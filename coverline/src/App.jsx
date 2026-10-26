import { useEffect, useState, useCallback } from 'react'
import { LayoutGrid, Box, Timer, ShieldCheck, Layers, Bell, ChevronDown, Download, Menu, X, Check } from 'lucide-react'
import Overview from './Overview.jsx'
import Stock from './Stock.jsx'
import Freshness from './Freshness.jsx'
import QA from './QA.jsx'
import Materials from './Materials.jsx'
import { downloadCsv } from './ui.jsx'
import { TODAY, risks, stock, batches, qa, materials } from './data.js'

const pages = {
  overview: { label: 'Overview', icon: LayoutGrid, title: 'Overview', sub: `Daily organisational review · ${TODAY.label}, week ${TODAY.week}.`, team: 'Head office planning', user: ['AO', 'Adaeze'], export: 'Export DOR summary' },
  stock: { label: 'Stock', icon: Box, title: 'Stock', sub: 'Stock across factory, transit, warehouses and trade. Updated 07:42 today.', team: 'Head office planning', user: ['AO', 'Adaeze'] },
  freshness: { label: 'Freshness', icon: Timer, title: 'Freshness review', sub: 'Batches for the freshness review. Staff pack window opens 90 days before expiry.', team: 'Demand planning', user: ['FB', 'Femi'], count: 2 },
  qa: { label: 'QA release', icon: ShieldCheck, title: 'QA release', sub: 'Batches QA is holding. Nothing here can be dispatched or routed until QA releases it.', team: 'Demand planning', user: ['FB', 'Femi'] },
  materials: { label: 'Materials', icon: Layers, title: 'Materials', sub: 'Raw and packaging materials against the production plan, 10 weeks ahead. Inbound shipments included.', team: 'MRP team', user: ['TA', 'Tola'], count: 1 },
}

const exporters = {
  overview: () => [['Product', 'Week', 'Status', 'Detail'], ...risks.map(r => [r.product, r.week, r.status, r.text])],
  stock: () => [['Product', 'SKU', 'Warehouse', 'On hand (cases)', 'Days of cover', 'Shelf life (days)', 'Status'], ...stock.map(s => [s.name, s.sku, s.wh, s.cases, s.cover, s.life ?? '', s.status])],
  freshness: () => [['Batch', 'Product', 'Warehouse', 'Cases', 'Days left', 'Expires', 'Decision'], ...batches.map(b => [b.id, b.name, b.wh, b.cases, b.days, b.expires, b.decision || 'Not decided'])],
  qa: () => [['Batch', 'Product', 'Location', 'Cases', 'Hold reason', 'Days on hold', 'Results due', 'QA stage'], ...qa.map(r => [r.id, r.name, r.loc, r.cases, r.reason, r.held, r.due, r.stage.text])],
  materials: () => [['Material', 'Code', 'On hand', 'Cover now (wks)', 'Production at risk'], ...materials.map(m => [m.name, m.code, m.onHand, m.cover, m.risk.title])],
}

function Logo() {
  return <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1a1918" /><path d="M7 21l5.5-9 4 6 3.5-5 5 8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

const readHash = () => { const h = window.location.hash.replace('#', ''); return pages[h] ? h : 'overview' }

export default function App() {
  const [page, setPage] = useState(readHash)
  const [menu, setMenu] = useState(false)
  const [msg, setMsg] = useState(null)
  const [synced, setSynced] = useState(false)
  useEffect(() => { const on = () => setPage(readHash()); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on) }, [])
  useEffect(() => { document.title = `${pages[page].title} · Coverline`; window.scrollTo(0, 0); setMenu(false) }, [page])
  const go = useCallback(p => { window.location.hash = p }, [])
  const toast = useCallback(t => { setMsg(t); clearTimeout(window.__t); window.__t = setTimeout(() => setMsg(null), 3600) }, [])
  const P = pages[page]
  const Page = { overview: Overview, stock: Stock, freshness: Freshness, qa: QA, materials: Materials }[page]

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" style={{ padding: 0 }}><Logo />Coverline</div>
        <button type="button" className="icon-btn" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>{menu ? <X size={18} /> : <Menu size={18} />}</button>
      </header>

      <nav className={`side ${menu ? 'open' : ''}`} aria-label="Main">
        <div className="brand"><Logo />Coverline</div>
        <div className="team"><b>{P.team}</b><span>1 factory · 4 warehouses</span></div>
        <div className="label">Main</div>
        {Object.entries(pages).map(([k, p]) => {
          const I = p.icon
          return (
            <button key={k} type="button" className="nav-item" aria-current={page === k ? 'page' : undefined} onClick={() => go(k)}>
              <I size={18} strokeWidth={1.75} aria-hidden="true" />{p.label}{p.count && <span className="count num">{p.count}</span>}
            </button>
          )
        })}
        <div className="side-bottom">
          <div className="sync">
            {synced
              ? <><b style={{ color: 'var(--safe)' }}><Check size={14} />Sync requested</b><p>Kano warehouse will recount and push figures. Until then, treat Kano stock as of 04:40.</p></>
              : <><b><span className="dot" style={{ color: 'var(--brand-amber)' }} />Kano warehouse is behind</b><p>Last stock count synced at 04:40. Kano figures may be out of date.</p>
                <button type="button" className="linkbtn" onClick={() => { setSynced(true); toast('Sync request sent to Kano warehouse') }}>Ask warehouse to sync</button></>}
          </div>
          <p className="credit">A concept by <a href="https://x.com/duo_persona" target="_blank" rel="noreferrer">Ugonwa Ohagwasi</a>. All data is sample data.</p>
        </div>
      </nav>

      <main className="main">
        <div className="page-head">
          <div><h1>{P.title}</h1><p>{P.sub}</p></div>
          <div className="head-actions">
            <button type="button" className={`btn ${P.export ? 'primary' : ''}`} onClick={() => { downloadCsv(`coverline-${page}.csv`, exporters[page]()); toast('Export downloaded as CSV') }}>
              <Download size={16} strokeWidth={1.75} aria-hidden="true" /><span>{P.export || 'Export'}</span>
            </button>
            <button type="button" className="icon-btn" aria-label="Notifications, 1 new" onClick={() => go('materials')}><Bell size={16} strokeWidth={1.75} /><span className="ping" /></button>
            <div className="user"><span className="avatar">{P.user[0]}</span><span>{P.user[1]}</span><ChevronDown size={14} aria-hidden="true" /></div>
          </div>
        </div>
        <Page go={go} toast={toast} />
      </main>

      {msg && <div className="toast" role="status"><Check size={16} />{msg}</div>}
    </div>
  )
}
