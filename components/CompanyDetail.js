'use client';

import ScoreGauge from './ScoreGauge';

function MetricBar({ label, value, max, color, suffix = '' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
        <div style={{
          height: 4, width: `${pct}%`, background: color,
          borderRadius: 2, transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}

export default function CompanyDetail({ company, onClose }) {
  if (!company) return null;

  return (
    <div style={{
      margin: '12px 20px', background: 'var(--bg-card)',
      border: `1px solid ${company.signalColor}22`,
      borderRadius: 12, padding: 16, animation: 'slideUp 0.3s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{company.ticker}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{company.name}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{company.sector}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ScoreGauge score={company.score} signalColor={company.signalColor} size={75} />
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border-light)',
            color: 'var(--text-muted)', borderRadius: 6, padding: '4px 8px', fontSize: 10,
          }}>✕</button>
        </div>
      </div>

      {/* Signal badge */}
      <div style={{
        display: 'inline-block', background: company.signalColor + '15',
        border: `1px solid ${company.signalColor}33`, borderRadius: 6,
        padding: '4px 12px', fontSize: 12, fontWeight: 600, color: company.signalColor,
        marginBottom: 14,
      }}>
        {company.signal} · Upside {company.upside}%
      </div>

      {/* Quick metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Precio', value: `$${company.price?.toFixed(2)}` },
          { label: 'P/E', value: `${company.pe?.toFixed(1)}x` },
          { label: 'PEG', value: company.peg?.toFixed(2) },
          { label: 'Margen', value: `${company.margin}%` },
        ].map((m, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Visual bars */}
      <div style={{ marginBottom: 14 }}>
        <MetricBar label="Crecimiento Ingresos" value={Math.max(0, company.revenueGrowth)} max={50} color="var(--green)" suffix="%" />
        <MetricBar label="Crecimiento FCF" value={Math.max(0, company.fcfGrowth)} max={100} color="var(--blue)" suffix="%" />
        <MetricBar label="ROIC" value={Math.max(0, company.roic)} max={70} color="var(--purple)" suffix="%" />
        <MetricBar label="RSI" value={company.rsi} max={100} color={company.rsi > 70 ? 'var(--red)' : company.rsi < 35 ? 'var(--green)' : 'var(--text-secondary)'} />
      </div>

      {/* Score breakdown */}
      <div style={{
        fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8,
        fontFamily: 'var(--font-display)',
      }}>
        DESGLOSE DEL SCORE ({company.details?.length || 0} señales)
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {(company.details || []).map((d, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 10px', background: d.good ? '#00ff8808' : '#ff334408',
            borderRadius: 6, borderLeft: `3px solid ${d.good ? 'var(--green)' : 'var(--red)'}`,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: d.good ? '#88ffbb' : '#ff8888' }}>{d.metric}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{d.desc}</div>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, minWidth: 35, textAlign: 'right',
              color: d.good ? 'var(--green)' : 'var(--red)',
            }}>
              {d.pts > 0 ? '+' : ''}{d.pts}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{ fontSize: 9, color: 'var(--text-dark)', marginTop: 12, lineHeight: 1.5 }}>
        ⚠️ Este análisis es generado por un modelo cuantitativo con fines educativos y no constituye asesoría de inversión.
        Los resultados pasados no garantizan rendimientos futuros. Siempre haz tu propia investigación (DYOR).
      </div>
    </div>
  );
}
