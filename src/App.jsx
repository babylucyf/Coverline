import { useEffect, useState, useCallback } from 'react'
import { LayoutGrid, Box, Timer, ShieldCheck, Layers, Bell, ChevronDown, Download, Menu, X, Check, SlidersHorizontal, Headphones, PanelLeft, ArrowLeftRight } from 'lucide-react'
import Overview from './Overview.jsx'
import Stock from './Stock.jsx'
import Freshness from './Freshness.jsx'
import QA from './QA.jsx'
import Materials from './Materials.jsx'
import Settings from './Settings.jsx'
import { downloadCsv, Popover, Drawer, Btn } from './ui.jsx'
import { TODAY, risks, stock, batches, qa, materials, teams, warehouses, notifications } from './data.js'

const pages = {
  overview: { label: 'Overview', icon: LayoutGrid, title: 'Overview', sub: `Daily organisational review · ${TODAY.label}, week ${TODAY.week}.`, export: 'Export DOR summary' },
  stock: { label: 'Stock', icon: Box, title: 'Stock', sub: 'Stock across factory, transit, warehouses and trade. Updated 07:42 today.' },
  freshness: { label: 'Freshness', icon: Timer, title: 'Freshness review', count: 2 },
  qa: { label: 'QA release', icon: ShieldCheck, title: 'QA release' },
  materials: { label: 'Materials', icon: Layers, title: 'Materials', count: 1 },
  settings: { label: 'Settings', icon: SlidersHorizontal, title: 'Settings', sub: 'The numbers Coverline calculates with. Head office planning sets them, the import team updates sea and port times, and every change is logged.', bottom: true },
}

const exporters = {
  overview: () => [['Product', 'Week', 'Status', 'Detail'], ...risks.map(r => [r.product, r.week, r.status, r.text])],
  stock: () => [['Product', 'SKU', 'Warehouse', 'On hand (cases)', 'Days of cover', 'Shelf life (days)', 'Status'], ...stock.map(s => [s.name, s.sku, s.wh, s.cases, s.cover, s.life ?? '', s.status])],
  freshness: () => [['Batch', 'Product', 'Warehouse', 'Cases', 'Days left', 'Expires', 'Decision'], ...batches.map(b => [b.id, b.name, b.wh, b.cases, b.days, b.expires, b.decision || 'Not decided'])],
  qa: () => [['Batch', 'Product', 'Location', 'Cases', 'Hold reason', 'Days on hold', 'Results due', 'QA stage'], ...qa.map(r => [r.id, r.name, r.loc, r.cases, r.reason, r.held, r.due, r.stage.text])],
  materials: () => [['Material', 'Code', 'On hand', 'Cover now (wks)', 'Production at risk'], ...materials.map(m => [m.name, m.code, m.onHand, m.cover, m.risk.title])],
  settings: () => [['Material', 'Code'], ...materials.map(m => [m.name, m.code])],
}

function Logo() {
  return <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1a1918" /><path d="M7 21l5.5-9 4 6 3.5-5 5 8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function TransferDrawer({ onClose, onSend }) {
  const [product, setProduct] = useState(stock[2].name)
  const [from, setFrom] = useState('Lagos')
  const [to, setTo] = useState('Kano')
  const [cases, setCases] = useState('')
  const same = from === to
  return (
    <Drawer title="New transfer" sub="Move stock between warehouses. Both inventory teams get a task." onClose={onClose}
      footer={<><Btn onClick={onClose}>Cancel</Btn><Btn kind="primary" disabled={!cases || same} onClick={() => onSend({ product, from, to, cases })}>Send transfer</Btn></>}>
      <div className="field"><label htmlFor="tp">Product</label><select id="tp" className="select input" value={product} onChange={e => setProduct(e.target.value)}>{stock.map(s => <option key={s.sku}>{s.name}</option>)}</select></div>
      <div className="two">
        <div className="field"><label htmlFor="tf">From</label><select id="tf" className="select input" value={from} onChange={e => setFrom(e.target.value)}>{warehouses.map(w => <option key={w}>{w}</option>)}</select></div>
        <div className="field"><label htmlFor="tt">To</label><select id="tt" className="select input" value={to} onChange={e => setTo(e.target.value)}>{warehouses.map(w => <option key={w}>{w}</option>)}</select></div>
      </div>
      {same && <span className="cell-sub out">Pick two different warehouses.</span>}
      <div className="field"><label htmlFor="tc">Cases</label><input id="tc" className="input num" inputMode="numeric" placeholder="How many cases" value={cases} onChange={e => setCases(e.target.value.replace(/\D/g, ''))} /></div>
      <div className="field"><label htmlFor="tw">Why</label><select id="tw" className="select input"><option>Low cover at the receiving warehouse</option><option>Freshness: sell faster elsewhere</option><option>Promo or launch</option><option>Other</option></select></div>
    </Drawer>
  )
}

function SupportDrawer({ onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText('ugonwaohagwasi@gmail.com'); setCopied(true) } catch { setCopied(false) } }
  return (
    <Drawer title="Support" sub="About this demo" onClose={onClose}>
      <div className="facts">
        <div className="t">Coverline is a concept project</div>
        <span style={{ fontSize: 14 }}>A planning dashboard for FMCG teams, designed and built by Ugonwa Ohagwasi. Every figure, name and batch here is sample data.</span>
      </div>
      <div className="field"><span className="flabel">Try these</span>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6, color: 'var(--ink-2)' }}>
          <li>Freshness review: route the malt drink batch. Repackage stays locked because no damage was reported.</li>
          <li>Freshness review, Tasks: confirm the noodles pull with fewer cases than planned.</li>
          <li>Materials: flag malt extract to factory planning, then see it under Flags sent.</li>
          <li>Materials, Repackaging: add the 90 missing cartons to a flag.</li>
        </ul>
      </div>
      <div className="field"><span className="flabel">Get in touch</span><div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span className="num" style={{ userSelect: 'all' }}>ugonwaohagwasi@gmail.com</span><Btn onClick={copy}>{copied ? 'Copied' : 'Copy email'}</Btn></div></div>
    </Drawer>
  )
}

const readHash = () => { const h = window.location.hash.replace('#', ''); return pages[h] ? h : 'overview' }

export default function App() {
  const [page, setPage] = useState(readHash)
  const [menu, setMenu] = useState(false)
  const [rail, setRail] = useState(false)
  const [team, setTeam] = useState(teams[0])
  const [msg, setMsg] = useState(null)
  const [synced, setSynced] = useState(false)
  const [sub, setSubState] = useState(null)
  const [actions, setActionsState] = useState(null)
  const [drawer, setDrawer] = useState(null)
  const [read, setRead] = useState(false)
  useEffect(() => { const on = () => setPage(readHash()); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on) }, [])
  useEffect(() => { document.title = `${pages[page].title} · Coverline`; window.scrollTo(0, 0); setMenu(false); setSubState(null) }, [page])
  const go = useCallback(p => { window.location.hash = p }, [])
  const toast = useCallback(t => { setMsg(t); clearTimeout(window.__t); window.__t = setTimeout(() => setMsg(null), 3600) }, [])
  const setSub = useCallback(s => setSubState(s), [])
  const setActions = useCallback(a => setActionsState(a), [])
  const closeDrawer = useCallback(() => setDrawer(null), [])
  const P = pages[page]
  const Page = { overview: Overview, stock: Stock, freshness: Freshness, qa: QA, materials: Materials, settings: Settings }[page]

  const navBtn = (k, p) => {
    const I = p.icon
    return (
      <button key={k} type="button" className="nav-item" aria-current={page === k ? 'page' : undefined} onClick={() => go(k)} title={p.label}>
        <I size={18} strokeWidth={1.75} aria-hidden="true" /><span className="nav-label">{p.label}</span>{p.count && <span className="count num">{p.count}</span>}
      </button>
    )
  }

  return (
    <div className={`app ${rail ? 'rail' : ''}`}>
      <header className="topbar">
        <div className="brand" style={{ padding: 0 }}><Logo />Coverline</div>
        <button type="button" className="icon-btn" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>{menu ? <X size={18} /> : <Menu size={18} />}</button>
      </header>

      <nav className={`side ${menu ? 'open' : ''}`} aria-label="Main">
        <div className="side-top">
          <div className="brand"><Logo /><span className="brand-name">Coverline</span></div>
          <button type="button" className="icon-btn collapse" aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setRail(!rail)}><PanelLeft size={16} strokeWidth={1.75} /></button>
        </div>
        <Popover width={240} trigger={({ toggle, open }) => (
          <button type="button" className="team-btn" aria-expanded={open} onClick={toggle}>
            <b>{team.name}<ChevronDown size={14} aria-hidden="true" /></b><span>{team.sub}</span>
          </button>
        )}>
          {close => <>
            <div className="menu-label">View as</div>
            {teams.map(t => <button key={t.key} type="button" className="menu-item" role="menuitemradio" aria-checked={team.key === t.key} onClick={() => { setTeam(t); close(); toast(`Now viewing as ${t.name}`) }}>{t.name}</button>)}
          </>}
        </Popover>
        <button type="button" className="btn newt" onClick={() => setDrawer('transfer')} title="New transfer"><ArrowLeftRight size={16} strokeWidth={1.75} aria-hidden="true" /><span className="nav-label">New transfer</span></button>
        <div className="label">Main</div>
        {Object.entries(pages).filter(([, p]) => !p.bottom).map(([k, p]) => navBtn(k, p))}
        <div className="side-bottom">
          <div style={{ display: 'grid', gap: 2 }}>
            {navBtn('settings', pages.settings)}
            <button type="button" className="nav-item" onClick={() => setDrawer('support')} title="Support"><Headphones size={18} strokeWidth={1.75} aria-hidden="true" /><span className="nav-label">Support</span></button>
          </div>
          <div className="sync">
            {synced
              ? <><b style={{ color: 'var(--safe)' }} title="Sync requested"><Check size={14} /><span className="sync-title">Sync requested</span></b><p>Kano warehouse will recount and push figures. Until then, treat Kano stock as of 04:40.</p></>
              : <><b title="Kano warehouse is behind"><span className="dot" style={{ color: 'var(--brand-amber)' }} /><span className="sync-title">Kano warehouse is behind</span></b><p>Last stock count synced at 04:40. Kano figures may be out of date.</p>
                <button type="button" className="linkbtn" onClick={() => { setSynced(true); toast('Sync request sent to Kano warehouse') }}>Ask warehouse to sync</button></>}
          </div>
          <p className="credit">A concept by Ugonwa Ohagwasi. All data is sample data.</p>
        </div>
      </nav>

      <main className="main">
        <div className="page-head">
          <div><h1>{P.title}</h1><p>{sub || P.sub}</p></div>
          <div className="head-actions">
            {actions}
            <button type="button" className={`btn ${P.export ? 'primary' : ''}`} onClick={() => { downloadCsv(`coverline-${page}.csv`, exporters[page]()); toast('Export downloaded as CSV') }}>
              <Download size={16} strokeWidth={1.75} aria-hidden="true" /><span>{P.export || 'Export'}</span>
            </button>
            <Popover align="right" width={320} trigger={({ toggle, open }) => (
              <button type="button" className="icon-btn" aria-label={read ? 'Notifications' : 'Notifications, 3 new'} aria-expanded={open} onClick={() => { toggle(); setRead(true) }}><Bell size={16} strokeWidth={1.75} />{!read && <span className="ping" />}</button>
            )}>
              {close => <>
                <div className="menu-label">Notifications</div>
                {notifications.map(n => <button key={n.text} type="button" className="notif" onClick={() => { go(n.to); close() }}><span>{n.text}</span><small>{n.when}</small></button>)}
              </>}
            </Popover>
            <Popover align="right" width={240} trigger={({ toggle, open }) => (
              <button type="button" className="user" aria-expanded={open} onClick={toggle}><span className="avatar">{team.user[0]}</span><span>{team.user[1]}</span><ChevronDown size={14} aria-hidden="true" /></button>
            )}>
              {close => <>
                <div className="menu-label">{team.user[1]} · {team.name}</div>
                {teams.map(t => <button key={t.key} type="button" className="menu-item" role="menuitemradio" aria-checked={team.key === t.key} onClick={() => { setTeam(t); close() }}>Switch to {t.name}</button>)}
                <button type="button" className="menu-item" onClick={() => { close(); setDrawer('support') }}>About this demo</button>
              </>}
            </Popover>
          </div>
        </div>
        <Page key={page} go={go} toast={toast} setSub={setSub} setActions={setActions} />
      </main>

      {drawer === 'transfer' && <TransferDrawer onClose={closeDrawer} onSend={({ cases, product, from, to }) => { setDrawer(null); toast(`Transfer sent: ${cases} cases of ${product}, ${from} to ${to}`) }} />}
      {drawer === 'support' && <SupportDrawer onClose={closeDrawer} />}
      {msg && <div className="toast" role="status"><Check size={16} />{msg}</div>}
    </div>
  )
}
