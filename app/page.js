'use client';

import { useState, useEffect } from 'react';
import { fetchStockQuotes, fetchFinancialRatios, fetchIncomeGrowth, fetchKeyMetrics, NASDAQ_100 } from '../lib/api';
import { calculateScore } from '../lib/scoring';
import ScoreGauge from '../components/ScoreGauge';
import CompanyDetail from '../components/CompanyDetail';

const DEMO_DATA = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', sector: 'Semiconductors', price: 135.20, pe: 55.2, peg: 0.92, fcfGrowth: 142, revenueGrowth: 122, roic: 68.5, debtEquity: 0.41, insiderBuy: true, rsi: 62, shortInterest: 1.8, analystTarget: 175, earningsSurprise: 12.5, margin: 55.8 },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Social / AI', price: 595.40, pe: 25.8, peg: 0.75, fcfGrowth: 35, revenueGrowth: 22, roic: 28.4, debtEquity: 0.28, insiderBuy: false, rsi: 64, shortInterest: 1.1, analystTarget: 650, earningsSurprise: 8.9, margin: 34.1 },
  { ticker: 'UBER', name: 'Uber Technologies', sector: 'Mobility', price: 77.20, pe: 16.0, peg: 0.46, fcfGrowth: 45, revenueGrowth: 18, roic: 15.2, debtEquity: 1.15, insiderBuy: true, rsi: 48, shortInterest: 2.8, analystTarget: 95, earningsSurprise: 15.3, margin: 19.0 },
  { ticker: 'GOOGL', name: 'Alphabet Inc', sector: 'Search / AI', price: 175.60, pe: 22.1, peg: 1.05, fcfGrowth: 28, revenueGrowth: 14, roic: 26.8, debtEquity: 0.05, insiderBuy: false, rsi: 53, shortInterest: 0.6, analystTarget: 205, earningsSurprise: 11.2, margin: 28.7 },
  { ticker: 'AMZN', name: 'Amazon.com', sector: 'E-Commerce / Cloud', price: 205.30, pe: 42.8, peg: 1.1, fcfGrowth: 85, revenueGrowth: 12, roic: 18.7, debtEquity: 0.58, insiderBuy: false, rsi: 51, shortInterest: 0.9, analystTarget: 240, earningsSurprise: 22.1, margin: 10.5 },
  { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Software', price: 445.80, pe: 35.4, peg: 1.9, fcfGrowth: 18, revenueGrowth: 16, roic: 31.2, debtEquity: 0.35, insiderBuy: true, rsi: 55, shortInterest: 0.5, analystTarget: 510, earningsSurprise: 5.8, margin: 36.2 },
  { ticker: 'AAPL', name: 'Apple Inc', sector: 'Tech Hardware', price: 228.50, pe: 32.1, peg: 2.8, fcfGrowth: 5, revenueGrowth: 4, roic: 52.3, debtEquity: 1.52, insiderBuy: false, rsi: 58, shortInterest: 0.7, analystTarget: 248, earningsSurprise: 3.2, margin: 26.4 },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Semiconductors', price: 118.40, pe: 38.2, peg: 1.15, fcfGrowth: 42, revenueGrowth: 18, roic: 12.5, debtEquity: 0.04, insiderBuy: true, rsi: 45, shortInterest: 4.1, analystTarget: 155, earningsSurprise: 6.8, margin: 22.3 },
  { ticker: 'AVGO', name: 'Broadcom Inc', sector: 'Semiconductors', price: 185.50, pe: 38.0, peg: 1.3, fcfGrowth: 25, revenueGrowth: 44, roic: 18.9, debtEquity: 1.02, insiderBuy: true, rsi: 59, shortInterest: 1.2, analystTarget: 230, earningsSurprise: 7.2, margin: 38.5 },
  { ticker: 'NFLX', name: 'Netflix Inc', sector: 'Streaming', price: 1050.00, pe: 48.5, peg: 1.6, fcfGrowth: 55, revenueGrowth: 16, roic: 22.1, debtEquity: 0.68, insiderBuy: false, rsi: 66, shortInterest: 1.5, analystTarget: 1100, earningsSurprise: 9.1, margin: 26.2 },
  { ticker: 'TSLA', name: 'Tesla Inc', sector: 'EV / Energy', price: 255.00, pe: 95.2, peg: 3.8, fcfGrowth: -15, revenueGrowth: 1, roic: 8.2, debtEquity: 0.15, insiderBuy: false, rsi: 71, shortInterest: 3.2, analystTarget: 220, earningsSurprise: -18.5, margin: 7.6 },
  { ticker: 'CRWD', name: 'CrowdStrike', sector: 'Cybersecurity', price: 365.00, pe: 92.0, peg: 2.4, fcfGrowth: 32, revenueGrowth: 29, roic: 9.8, debtEquity: 0.32, insiderBuy: false, rsi: 68, shortInterest: 2.1, analystTarget: 400, earningsSurprise: 14.2, margin: 21.0 },
  { ticker: 'INTC', name: 'Intel Corp', sector: 'Semiconductors', price: 22.40, pe: -5.2, peg: -1.8, fcfGrowth: -62, revenueGrowth: -2, roic: -3.1, debtEquity: 0.47, insiderBuy: false, rsi: 38, shortInterest: 5.8, analystTarget: 25, earningsSurprise: -45.0, margin: -1.2 },
  { ticker: 'MRNA', name: 'Moderna Inc', sector: 'Biotech', price: 28.50, pe: -3.8, peg: -0.5, fcfGrowth: -78, revenueGrowth: -55, roic: -18.5, debtEquity: 0.12, insiderBuy: true, rsi: 32, shortInterest: 8.2, analystTarget: 45, earningsSurprise: -22.0, margin: -65.0 },
  { ticker: 'COST', name: 'Costco Wholesale', sector: 'Retail', price: 920.00, pe: 52.8, peg: 3.2, fcfGrowth: 8, revenueGrowth: 7, roic: 22.5, debtEquity: 0.35, insiderBuy: false, rsi: 61, shortInterest: 0.8, analystTarget: 950, earningsSurprise: 2.1, margin: 3.6 },
];

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [showPro, setShowPro] = useState(false);

  useEffect(() => {
    async function loadData() {
      const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

      if (!apiKey || apiKey === 'TU_API_KEY_AQUI') {
        const scored = DEMO_DATA.map(c => ({ ...c, ...calculateScore(c) }));
        setCompanies(scored.sort((a, b) => b.score - a.score));
        setIsDemo(true);
        setLoading(false);
        return;
      }

      try {
        const quotes = await fetchStockQuotes(NASDAQ_100);
        if (!quotes || !Array.isArray(quotes) || quotes.length === 0) throw new Error('No quotes');

        const enriched = [];
        const batch = quotes.slice(0, 50);

        for (let i = 0; i < batch.length; i++) {
          const q = batch[i];
          try {
            const [ratios, growth, metrics] = await Promise.all([
              fetchFinancialRatios(q.symbol).catch(() => [{}]),
              fetchIncomeGrowth(q.symbol).catch(() => [{}]),
              fetchKeyMetrics(q.symbol).catch(() => [{}]),
            ]);

            const r = ratios?.[0] || {};
            const g = growth?.[0] || {};
            const m = metrics?.[0] || {};

            enriched.push({
              ticker: q.symbol,
              name: q.name || q.symbol,
              sector: '',
              price: q.price || 0,
              change: q.changesPercentage || 0,
              pe: q.pe || r.peRatioTTM || 0,
              peg: r.pegRatioTTM || 0,
              revenueGrowth: Math.round((g.growthRevenue || 0) * 100),
              fcfGrowth: Math.round((g.growthFreeCashFlow || 0) * 100),
              roic: Math.round((m.roicTTM || r.returnOnCapitalEmployedTTM || 0) * 100 * 10) / 10,
              debtEquity: Math.round((r.debtEquityRatioTTM || 0) * 100) / 100,
              insiderBuy: false,
              rsi: 50,
              shortInterest: 0,
              analystTarget: q.price ? q.price * 1.1 : 0,
              earningsSurprise: 0,
              margin: Math.round((r.netProfitMarginTTM || 0) * 100 * 10) / 10,
              marketCap: q.marketCap || 0,
              volume: q.volume || 0,
            });
          } catch {
            enriched.push({
              ticker: q.symbol, name: q.name || q.symbol, price: q.price || 0,
              pe: 0, peg: 0, revenueGrowth: 0, fcfGrowth: 0, roic: 0,
              debtEquity: 0, insiderBuy: false, rsi: 50, shortInterest: 0,
              analystTarget: q.price || 0, earningsSurprise: 0, margin: 0,
              sector: '', change: 0,
            });
          }
        }

        const scored = enriched.map(c => ({ ...c, ...calculateScore(c) }));
        setCompanies(scored.sort((a, b) => b.score - a.score));
        setIsDemo(false);
      } catch (err) {
        console.error('API Error:', err);
        const scored = DEMO_DATA.map(c => ({ ...c, ...calculateScore(c) }));
        setCompanies(scored.sort((a, b) => b.score - a.score));
        setIsDemo(true);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const filtered = companies
    .filter(s => {
      if (filter === 'buy') return s.score >= 60;
      if (filter === 'hold') return s.score >= 30 && s.score < 60;
      if (filter === 'avoid') return s.score < 30;
      return true;
    })
    .filter(s => s.ticker?.toLowerCase().includes(search.toLowerCase()) || s.name?.toLowerCase().includes(search.toLowerCase()));

  const detail = selected ? companies.find(c => c.ticker === selected) : null;
  const buyCount = companies.filter(s => s.score >= 60).length;
  const holdCount = companies.filter(s => s.score >= 30 && s.score < 60).length;
  const avoidCount = companies.filter(s => s.score < 30).length;

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1.5s ease infinite' }} />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
          Analizando empresas del Nasdaq 100...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', maxWidth: 600, margin: '0 auto' }}>

      <div style={{
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border)', padding: '18px 20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--green)' }}>●</span> ScoreInvest
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textTransform: 'capitalize' }}>
              {today}
            </div>
          </div>
          <button onClick={() => setShowPro(!showPro)} style={{
            background: 'linear-gradient(135deg, var(--gold) 0%, #e8a020 100%)',
            border: 'none', borderRadius: 6, padding: '6px 14px',
            fontSize: 10, fontWeight: 700, color: '#000',
            fontFamily: 'var(--font-display)', letterSpacing: '0.5px',
          }}>PRO $9.99/mes</button>
        </div>

        {isDemo && (
          <div style={{
            marginTop: 10, background: '#ffaa3310', border: '1px solid #ffaa3322',
            borderRadius: 6, padding: '6px 10px', fontSize: 10, color: 'var(--yellow)',
          }}>
            📊 Modo demo — Agrega tu API key de Financial Modeling Prep para datos en tiempo real
          </div>
        )}

        {showPro && (
          <div style={{
            marginTop: 14, background: 'var(--bg-card)', border: '1px solid #f0c04033',
            borderRadius: 10, padding: 16, animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: 8 }}>
              ScoreInvest PRO
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              ✦ Análisis diario de las 100 empresas del Nasdaq<br />
              ✦ Alertas cuando el score cambia drásticamente<br />
              ✦ Desglose completo de las 12 variables<br />
              ✦ Historial de scores por empresa<br />
              ✦ Detector GAAP vs Non-GAAP<br />
              ✦ Acceso al grupo privado
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-dark)', marginTop: 10, lineHeight: 1.5 }}>
              ⚠️ No constituye asesoría financiera. Siempre investiga por tu cuenta.
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, background: '#00ff8808', border: '1px solid #00ff8818', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>{buyCount}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>COMPRA</div>
          </div>
          <div style={{ flex: 1, background: '#ffaa3308', border: '1px solid #ffaa3318', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--yellow)', fontFamily: 'var(--font-display)' }}>{holdCount}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>MANTENER</div>
          </div>
          <div style={{ flex: 1, background: '#ff334408', border: '1px solid #ff334418', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--font-display)' }}>{avoidCount}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>EVITAR</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
        <input
          type="text" placeholder="Buscar empresa o ticker..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '9px 12px', color: 'var(--text-primary)',
            fontSize: 12, outline: 'none', marginBottom: 10,
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Todas', color: 'var(--text-secondary)' },
            { key: 'buy', label: '▲ Compra', color: 'var(--green)' },
            { key: 'hold', label: '● Mantener', color: 'var(--yellow)' },
            { key: 'avoid', label: '▼ Evitar', color: 'var(--red)' },
          ].map(f => (
            <button key={f.key} onClick={() => { setFilter(f.key); setSelected(null); }} style={{
              background: filter === f.key ? 'var(--bg-hover)' : 'transparent',
              border: `1px solid ${filter === f.key ? f.color : 'var(--border)'}`,
              color: filter === f.key ? f.color : 'var(--text-muted)',
              borderRadius: 6, padding: '5px 12px', fontSize: 10,
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {detail && <CompanyDetail company={detail} onClose={() => setSelected(null)} />}

      <div style={{ padding: '8px 20px 24px' }}>
        <div style={{ fontSize: 9, color: 'var(--text-dark)', marginBottom: 10 }}>
          {filtered.length} empresas · ordenadas por score
        </div>

        {filtered.map((stock, idx) => (
          <div
            key={stock.ticker}
            onClick={() => setSelected(selected === stock.ticker ? null : stock.ticker)}
            style={{
              display: 'grid', gridTemplateColumns: '28px 1fr 65px 48px',
              alignItems: 'center', padding: '11px 10px', gap: 8,
              borderBottom: '1px solid var(--bg-secondary)', cursor: 'pointer',
              background: selected === stock.ticker ? 'var(--bg-card)' : 'transparent',
              borderRadius: selected === stock.ticker ? 8 : 0,
              transition: 'background 0.15s',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 600, color: idx < 3 ? 'var(--gold)' : 'var(--text-dark)', textAlign: 'center' }}>
              {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{stock.ticker}</span>
                <span style={{
                  fontSize: 8, padding: '1px 6px', borderRadius: 3,
                  background: stock.signalColor + '18', color: stock.signalColor, fontWeight: 600,
                }}>{stock.signal}</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{stock.name}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>${stock.price?.toFixed(2)}</div>
              <div style={{ fontSize: 9, color: parseFloat(stock.upside) > 0 ? 'var(--green)' : 'var(--red)' }}>
                {parseFloat(stock.upside) > 0 ? '▲' : '▼'} {stock.upside}%
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 17, fontWeight: 800, color: stock.signalColor,
                fontFamily: 'var(--font-display)',
              }}>{stock.score}</div>
              <div style={{ fontSize: 7, color: 'var(--text-dark)' }}>pts</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: 'var(--text-dark)', lineHeight: 1.6 }}>
          ScoreInvest · Modelo de 12 variables · {companies.length} empresas analizadas<br />
          ⚠️ No constituye asesoría financiera. Invertir conlleva riesgos.<br />
          Siempre consulta con un profesional antes de tomar decisiones de inversión.
        </div>
      </div>
    </div>
  );
}
