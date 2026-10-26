import { Chip, fmt } from './ui.jsx'
import { kpis, production, risks, stages, shipments, launches } from './data.js'

function ProductionChart() {
  const W = 640, H = 300, left = 40, right = 8, top = 16, base = 244
  const max = 22000
  const y = v => base - (v / max) * (base - top)
  const step = (W - left - right) / production.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Production against plan, weeks 38 to 44">
      {[0, 10000, 20000].map(v => (
        <g key={v}>
          <line x1={left} x2={W - right} y1={y(v)} y2={y(v)} stroke="#e8e6e3" />
          <text x={left - 10} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#8f8b84">{v ? `${v / 1000}k` : '0'}</text>
        </g>
      ))}
      {production.map((p, i) => {
        const cx = left + step * i + step / 2
        const fill = p.current ? '#dedad5' : p.short ? '#a8550c' : '#1a1918'
        return (
          <g key={p.wk}>
            {!p.future && <rect x={cx - 20} y={y(p.produced)} width="40" height={base - y(p.produced)} rx="3" fill={fill}><title>{`${p.wk}: ${fmt(p.produced)} of ${fmt(p.plan)} cases`}</title></rect>}
            <line x1={cx - 28} x2={cx + 28} y1={y(p.plan)} y2={y(p.plan)} stroke="#8f8b84" strokeWidth="2" />
            <text x={cx} y={base + 22} textAnchor="middle" fontSize="13" fill={p.current ? '#1a1918' : '#6b6863'} fontWeight={p.current ? 600 : 400}>{p.wk}</text>
            <text x={cx} y={base + 40} textAnchor="middle" fontSize="12" fill={p.short ? '#a8550c' : '#8f8b84'}>{p.note}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Overview({ go }) {
  const tones = { 1: '#dedad5', 2: '#b5b0aa', 3: '#6b6863', 4: '#1a1918' }
  return (
    <div className="panel">
      <div className="kpis">
        {kpis.map(k => (
          <div className="card kpi" key={k.label}>
            <span className="l">{k.label}</span>
            <span className="v num">{k.value}</span>
            <span className="s">{k.sub}</span>
            {k.chip && <Chip tone={k.chip.tone}>{k.chip.text}</Chip>}
          </div>
        ))}
      </div>

      <div className="ov-row">
        <section className="card" aria-labelledby="ch-prod">
          <div className="card-head">
            <h2 id="ch-prod">Production against plan, cases</h2>
            <div className="chart-legend">
              <span><span className="sq" style={{ background: '#1a1918' }} />Produced</span>
              <span><span style={{ width: 14, height: 2, background: '#8f8b84', display: 'inline-block' }} />Plan</span>
              <span><span className="sq" style={{ background: '#a8550c' }} />Short of plan</span>
            </div>
          </div>
          <ProductionChart />
        </section>

        <section className="card" aria-labelledby="ch-risk">
          <div className="card-head"><h2 id="ch-risk">Risks to week 43 and 44</h2></div>
          {risks.map(r => (
            <button type="button" className="risk" key={r.product} onClick={() => go(r.to)}>
              <span className="risk-top"><span className="risk-t">{r.product}</span><span className="wk">{r.week}</span><Chip tone={r.tone} dot>{r.status}</Chip></span>
              <p>{r.text}</p>
            </button>
          ))}
        </section>
      </div>

      <div className="ov-row3">
        <section className="card" aria-labelledby="ch-stage">
          <h2 id="ch-stage">Stock by stage, cases</h2>
          <div className="stagebar" aria-hidden="true">
            {stages.map(s => <div key={s.name} style={{ flex: Math.max(s.share, 4), background: tones[s.tone] }} />)}
          </div>
          {stages.map(s => (
            <div className="rowline" key={s.name}>
              <span className="k"><span className="sq" style={{ background: tones[s.tone] }} />{s.name}</span>
              <span className="muted num">{fmt(s.cases)} · {s.share}%</span>
            </div>
          ))}
        </section>

        <section className="card" aria-labelledby="ch-ship">
          <div className="card-head"><h2 id="ch-ship">Raw material shipments</h2><button type="button" className="btn" onClick={() => go('materials')}>Materials cover</button></div>
          {shipments.map(s => (
            <div className="ship" key={s.name}>
              <span>{s.name}</span><span className="muted num">{s.qty}</span><span className="muted">{s.eta}</span><Chip tone={s.tone} dot>{s.status}</Chip>
            </div>
          ))}
        </section>

        <section className="card" aria-labelledby="ch-sku">
          <h2 id="ch-sku">Promo and new SKU readiness</h2>
          {launches.map(l => (
            <div className="launch" key={l.name}>
              <div><b>{l.name}</b><span>{l.sub}</span></div>
              <Chip tone={l.tone} dot>{l.status}</Chip>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
