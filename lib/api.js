const API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
const BASE = 'https://financialmodelingprep.com/stable';

export async function fetchStockQuotes(tickers) {
  const list = tickers.join(',');
  const res = await fetch(`${BASE}/batch-quote-short?symbols=${list}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Error fetching quotes');
  return res.json();
}

export async function fetchFinancialRatios(ticker) {
  const res = await fetch(`${BASE}/ratios?symbol=${ticker}&period=ttm&apikey=${API_KEY}`);
  if (!res.ok) return [{}];
  return res.json();
}

export async function fetchKeyMetrics(ticker) {
  const res = await fetch(`${BASE}/key-metrics?symbol=${ticker}&period=ttm&apikey=${API_KEY}`);
  if (!res.ok) return [{}];
  return res.json();
}

export async function fetchIncomeGrowth(ticker) {
  const res = await fetch(`${BASE}/income-statement-growth?symbol=${ticker}&limit=1&apikey=${API_KEY}`);
  if (!res.ok) return [{}];
  return res.json();
}

export const NASDAQ_100 = [
  'AAPL','MSFT','AMZN','NVDA','META','GOOGL','TSLA','AVGO','COST','NFLX',
  'AMD','PEP','ADBE','CSCO','TMUS','INTC','TXN','QCOM','AMGN','INTU',
  'HON','AMAT','ISRG','BKNG','SBUX','LRCX','ADI','VRTX','GILD','MU',
  'PANW','REGN','KLAC','SNPS','CDNS','MELI','ABNB','PYPL','MAR','ORLY',
  'CRWD','CTAS','MNST','MRVL','FTNT','DASH','UBER','ARM','CEG','LIN',
];
