// ─── ScoreInvest Scoring Engine ───
// 12 variables, each weighted by importance

export function calculateScore(company) {
  let score = 0;
  const details = [];

  if (!company) return { score: 0, rawScore: 0, signal: 'SIN DATOS', signalColor: '#555', details: [], upside: '0' };

  const c = company;

  // 1. PEG Ratio (max +15 / -10)
  if (c.peg > 0 && c.peg < 1) {
    score += 15;
    details.push({ metric: 'PEG < 1', pts: 15, desc: `PEG de ${c.peg.toFixed(2)}: subvalorada vs su crecimiento`, good: true });
  } else if (c.peg >= 1 && c.peg <= 1.5) {
    score += 8;
    details.push({ metric: 'PEG 1-1.5', pts: 8, desc: `PEG de ${c.peg.toFixed(2)}: precio justo`, good: true });
  } else if (c.peg > 2) {
    score -= 5;
    details.push({ metric: 'PEG > 2', pts: -5, desc: `PEG de ${c.peg.toFixed(2)}: posiblemente sobrevalorada`, good: false });
  } else if (c.peg < 0) {
    score -= 10;
    details.push({ metric: 'PEG negativo', pts: -10, desc: 'Empresa con pérdidas, PEG no es útil', good: false });
  }

  // 2. Revenue Growth (max +12 / -8)
  if (c.revenueGrowth > 20) {
    score += 12;
    details.push({ metric: 'Ingresos +20%', pts: 12, desc: `Crecimiento de ingresos del ${c.revenueGrowth}%`, good: true });
  } else if (c.revenueGrowth > 10) {
    score += 7;
    details.push({ metric: 'Ingresos +10%', pts: 7, desc: `Crecimiento de ingresos del ${c.revenueGrowth}%`, good: true });
  } else if (c.revenueGrowth > 0) {
    score += 3;
    details.push({ metric: 'Ingresos positivos', pts: 3, desc: `Crecimiento de ingresos del ${c.revenueGrowth}%`, good: true });
  } else if (c.revenueGrowth < 0) {
    score -= 8;
    details.push({ metric: 'Ingresos en caída', pts: -8, desc: `Los ingresos cayeron ${c.revenueGrowth}%`, good: false });
  }

  // 3. Free Cash Flow Growth (max +12 / -10)
  if (c.fcfGrowth > 30) {
    score += 12;
    details.push({ metric: 'FCF fuerte', pts: 12, desc: `Flujo de caja libre creció ${c.fcfGrowth}%`, good: true });
  } else if (c.fcfGrowth > 10) {
    score += 6;
    details.push({ metric: 'FCF positivo', pts: 6, desc: `Flujo de caja libre creció ${c.fcfGrowth}%`, good: true });
  } else if (c.fcfGrowth < -10) {
    score -= 10;
    details.push({ metric: 'FCF en caída', pts: -10, desc: `Flujo de caja libre cayó ${c.fcfGrowth}%`, good: false });
  }

  // 4. ROIC - Return on Invested Capital (max +10 / -8)
  if (c.roic > 20) {
    score += 10;
    details.push({ metric: 'ROIC excelente', pts: 10, desc: `Retorno sobre capital invertido del ${c.roic}%`, good: true });
  } else if (c.roic > 10) {
    score += 5;
    details.push({ metric: 'ROIC bueno', pts: 5, desc: `Retorno sobre capital invertido del ${c.roic}%`, good: true });
  } else if (c.roic < 0) {
    score -= 8;
    details.push({ metric: 'ROIC negativo', pts: -8, desc: `Destruye valor: ROIC del ${c.roic}%`, good: false });
  }

  // 5. Debt/Equity (max +8 / -5)
  if (c.debtEquity < 0.5) {
    score += 8;
    details.push({ metric: 'Deuda baja', pts: 8, desc: `Deuda/Capital de ${c.debtEquity}x — finanzas sólidas`, good: true });
  } else if (c.debtEquity < 1) {
    score += 4;
    details.push({ metric: 'Deuda moderada', pts: 4, desc: `Deuda/Capital de ${c.debtEquity}x`, good: true });
  } else if (c.debtEquity > 2) {
    score -= 5;
    details.push({ metric: 'Deuda elevada', pts: -5, desc: `Deuda/Capital de ${c.debtEquity}x — riesgo alto`, good: false });
  }

  // 6. Insider Activity (max +8)
  if (c.insiderBuy) {
    score += 8;
    details.push({ metric: 'Insiders comprando', pts: 8, desc: `Directivos compraron más de lo que vendieron`, good: true });
  }

  // 7. RSI (max +5 / -5)
  if (c.rsi > 70) {
    score -= 5;
    details.push({ metric: 'RSI sobrecompra', pts: -5, desc: `RSI de ${c.rsi}: señal de sobrecompra`, good: false });
  } else if (c.rsi < 35) {
    score += 5;
    details.push({ metric: 'RSI sobreventa', pts: 5, desc: `RSI de ${c.rsi}: posible oportunidad`, good: true });
  }

  // 8. Short Interest (max -6)
  if (c.shortInterest > 5) {
    score -= 6;
    details.push({ metric: 'Short alto', pts: -6, desc: `${c.shortInterest}% del float en posiciones cortas`, good: false });
  }

  // 9. Earnings Surprise (max +8 / -8)
  if (c.earningsSurprise > 10) {
    score += 8;
    details.push({ metric: 'Sorpresa positiva', pts: 8, desc: `Superó expectativas por ${c.earningsSurprise}%`, good: true });
  } else if (c.earningsSurprise > 0) {
    score += 3;
    details.push({ metric: 'Beat leve', pts: 3, desc: `Superó expectativas por ${c.earningsSurprise}%`, good: true });
  } else if (c.earningsSurprise < -10) {
    score -= 8;
    details.push({ metric: 'Miss fuerte', pts: -8, desc: `Falló expectativas por ${Math.abs(c.earningsSurprise)}%`, good: false });
  }

  // 10. Analyst Target / Upside (max +8 / -5)
  const upside = c.analystTarget && c.price ? ((c.analystTarget - c.price) / c.price) * 100 : 0;
  if (upside > 20) {
    score += 8;
    details.push({ metric: 'Upside > 20%', pts: 8, desc: `Analistas ven ${upside.toFixed(0)}% de potencial alcista`, good: true });
  } else if (upside > 10) {
    score += 4;
    details.push({ metric: 'Upside > 10%', pts: 4, desc: `Analistas ven ${upside.toFixed(0)}% de potencial`, good: true });
  } else if (upside < -5) {
    score -= 5;
    details.push({ metric: 'Sin upside', pts: -5, desc: `Precio ya superó el objetivo de analistas`, good: false });
  }

  // 11. Net Margin (max +6 / -8)
  if (c.margin > 25) {
    score += 6;
    details.push({ metric: 'Margen fuerte', pts: 6, desc: `Margen neto del ${c.margin}% — muy rentable`, good: true });
  } else if (c.margin > 10) {
    score += 3;
    details.push({ metric: 'Margen sano', pts: 3, desc: `Margen neto del ${c.margin}%`, good: true });
  } else if (c.margin < 0) {
    score -= 8;
    details.push({ metric: 'Sin ganancia', pts: -8, desc: `Margen neto del ${c.margin}% — pierde dinero`, good: false });
  }

  // 12. P/E sanity check (bonus/penalty)
  if (c.pe > 0 && c.pe < 15) {
    score += 4;
    details.push({ metric: 'P/E bajo', pts: 4, desc: `P/E de ${c.pe.toFixed(1)}x — precio atractivo`, good: true });
  } else if (c.pe > 60) {
    score -= 3;
    details.push({ metric: 'P/E elevado', pts: -3, desc: `P/E de ${c.pe.toFixed(1)}x — expectativas muy altas`, good: false });
  } else if (c.pe < 0) {
    score -= 5;
    details.push({ metric: 'P/E negativo', pts: -5, desc: 'La empresa reporta pérdidas', good: false });
  }

  // Normalize to 0-100
  const maxPossible = 100;
  const normalized = Math.max(0, Math.min(100, Math.round(((score + 40) / (maxPossible + 40)) * 100)));

  // Signal
  let signal, signalColor;
  if (normalized >= 75) { signal = 'COMPRA FUERTE'; signalColor = '#00ff88'; }
  else if (normalized >= 60) { signal = 'COMPRA'; signalColor = '#66ddaa'; }
  else if (normalized >= 45) { signal = 'MANTENER'; signalColor = '#ffaa33'; }
  else if (normalized >= 30) { signal = 'PRECAUCIÓN'; signalColor = '#ff6644'; }
  else { signal = 'EVITAR'; signalColor = '#ff2222'; }

  return {
    score: normalized,
    rawScore: score,
    signal,
    signalColor,
    details: details.sort((a, b) => b.pts - a.pts),
    upside: upside.toFixed(1),
  };
}
