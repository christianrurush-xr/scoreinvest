const API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
const BASE = 'https://financialmodelingprep.com/api/v3';

export async function fetchStockQuotes(tickers) {
  const list = tickers.join(',');
  const res = await fetch(`${BASE}/quote/${list}?apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching quotes');
  return res.json();
}

export async function fetchFinancialRatios(ticker) {
  const res = await fetch(`${BASE}/ratios-ttm/${ticker}?apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching ratios');
  return res.json();
}

export async function fetchKeyMetrics(ticker) {
  const res = await fetch(`${BASE}/key-metrics-ttm/${ticker}?apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching key metrics');
  return res.json();
}

export async function fetchIncomeGrowth(ticker) {
  const res = await fetch(`${BASE}/income-statement-growth/${ticker}?limit=1&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching income growth');
  return res.json();
}

export async function fetchInsiderTrading(ticker) {
  const res = await fetch(`${BASE}/insider-trading?symbol=${ticker}&limit=10&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching insider trading');
  return res.json();
}

export async function fetchAnalystEstimates(ticker) {
  const res = await fetch(`${BASE}/analyst-estimates/${ticker}?limit=1&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching estimates');
  return res.json();
}

export async function fetchTechnicalIndicator(ticker) {
  const res = await fetch(`${BASE}/technical_indicator/daily/${ticker}?type=rsi&period=14&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching RSI');
  return res.json();
}

export async function fetchEarningsSurprises(ticker) {
  const res = await fetch(`${BASE}/earnings-surprises/${ticker}?apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching earnings surprises');
  return res.json();
}

// Fetch all data for a single company and return a unified object
export async function fetchFullCompanyData(ticker) {
  try {
    const [quotes, ratios, metrics, growth, insider, estimates, rsiData, surprises] = await Promise.all([
      fetchStockQuotes([ticker]),
      fetchFinancialRatios(ticker),
      fetchKeyMetrics(ticker),
      fetchIncomeGrowth(ticker),
      fetchInsiderTrading(ticker),
      fetchAnalystEstimates(ticker),
      fetchTechnicalIndicator(ticker),
      fetchEarningsSurprises(ticker),
    ]);

    const quote = quotes?.[0] || {};
    const ratio = ratios?.[0] || {};
    const metric = metrics?.[0] || {};
    const grow = growth?.[0] || {};
    const est = estimates?.[0] || {};
    const rsi = rsiData?.[0]?.rsi || 50;
    const surprise = surprises?.[0] || {};

    const insiderBuys = (insider || []).filter(t => t.transactionType === 'P-Purchase').length;
    const insiderSells = (insider || []).filter(t => t.transactionType === 'S-Sale').length;

    return {
      ticker: quote.symbol || ticker,
      name: quote.name || ticker,
      sector: quote.exchange || '',
      price: quote.price || 0,
      change: quote.changesPercentage || 0,
      pe: quote.pe || ratio.peRatioTTM || 0,
      peg: ratio.pegRatioTTM || 0,
      revenueGrowth: Math.round((grow.growthRevenue || 0) * 100),
      fcfGrowth: Math.round((grow.growthFreeCashFlow || 0) * 100),
      roic: Math.round((metric.roicTTM || 0) * 100 * 10) / 10,
      debtEquity: Math.round((ratio.debtEquityRatioTTM || 0) * 100) / 100,
      insiderBuy: insiderBuys > insiderSells,
      insiderBuys,
      insiderSells,
      rsi: Math.round(rsi),
      shortInterest: 0, // FMP free tier doesn't include this
      analystTarget: est.estimatedEpsAvg ? quote.price * 1.15 : quote.price,
      earningsSurprise: surprise.actualEarningResult && surprise.estimatedEarning
        ? Math.round(((surprise.actualEarningResult - surprise.estimatedEarning) / Math.abs(surprise.estimatedEarning)) * 100)
        : 0,
      margin: Math.round((ratio.netProfitMarginTTM || 0) * 100 * 10) / 10,
      marketCap: quote.marketCap || 0,
      volume: quote.volume || 0,
    };
  } catch (err) {
    console.error(`Error fetching ${ticker}:`, err);
    return null;
  }
}

// NASDAQ 100 tickers
export const NASDAQ_100 = [
  'AAPL','MSFT','AMZN','NVDA','META','GOOGL','TSLA','AVGO','COST','NFLX',
  'AMD','PEP','ADBE','CSCO','TMUS','INTC','TXN','QCOM','AMGN','INTU',
  'HON','AMAT','ISRG','BKNG','SBUX','LRCX','ADI','VRTX','GILD','MU',
  'PANW','REGN','KLAC','SNPS','CDNS','MELI','ABNB','PYPL','MAR','ORLY',
  'CRWD','CTAS','MNST','MRVL','FTNT','DASH','UBER','ARM','CEG','LIN',
];
