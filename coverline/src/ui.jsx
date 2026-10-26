import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export const fmt = n => n.toLocaleString('en-GB')

export function Chip({ tone = 'neutral', dot = false, children }) {
  return <span className={`chip ${tone}`}>{dot && <span className="dot" />}{children}</span>
}

export function Btn({ kind, icon: Icon, children, ...rest }) {
  return (
    <button type="button" className={`btn ${kind || ''}`} {...rest}>
      {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
      {children && <span>{children}</span>}
    </button>
  )
}

export function Seg({ options, value, onChange, label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(o => (
        <button key={o.key} type="button" className={value === o.key ? 'on' : ''} aria-pressed={value === o.key} onClick={() => onChange(o.key)}>
          {o.label}{o.count !== undefined && <span className="c num">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map(t => (
        <button key={t.key} role="tab" className="tab" aria-selected={value === t.key} onClick={() => onChange(t.key)}>
          {t.label}{t.count !== undefined && <span className="c num">· {t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Search({ value, onChange, placeholder }) {
  const ref = useRef(null)
  useEffect(() => {
    const onKey = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ref.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <label className="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <span className="sr">{placeholder}</span>
      <input ref={ref} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      <kbd>Ctrl K</kbd>
    </label>
  )
}

export function Drawer({ title, sub, onClose, children, footer }) {
  const ref = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    ref.current?.querySelector('button, input, textarea, select')?.focus()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [onClose])
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <div className="drawer-head">
          <div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </>
  )
}

export function Empty({ title, children }) {
  return <div className="empty"><b>{title}</b>{children}</div>
}

export function downloadCsv(name, rows) {
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = rows.map(r => r.map(esc).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
