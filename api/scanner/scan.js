// Vercel Serverless Function: /api/scanner/scan

const YAHOO_BASE = "https://query1.finance.yahoo.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ── Stock Universes ──────────────────────────────────────────────────────────
const SP500_SYMBOLS = [
  "MMM","AOS","ABT","ABBV","ACN","ADBE","AMD","AES","AFL","A","APD","ABNB","AKAM","ALB","ARE",
  "ALGN","ALLE","LNT","ALL","GOOGL","GOOG","MO","AMZN","AMCR","AEE","AAL","AEP","AXP","AIG",
  "AMT","AWK","AMP","AME","AMGN","APH","ADI","ANSS","AON","APA","AAPL","AMAT","APTV","ACGL",
  "ADM","ANET","AJG","AIZ","T","ATO","ADSK","AZO","AVB","AVY","AXON","BKR","BALL","BAC","BAX",
  "BDX","BBY","BIO","TECH","BIIB","BLK","BX","BA","BMY","AVGO","BR","BRO","BLDR","BG","CDNS",
  "CZR","CPT","CPB","COF","CAH","KMX","CCL","CARR","CAT","CBOE","CBRE","CDW","CE","COR","CNC",
  "CNP","CF","CRL","SCHW","CHTR","CVX","CMG","CB","CHD","CI","CINF","CTAS","CSCO","C","CFG",
  "CLX","CME","CMS","KO","CTSH","CL","CMCSA","CAG","COP","ED","STZ","CEG","COO","CPRT","GLW",
  "CPAY","CTVA","CSGP","COST","CTRA","CRWD","CCI","CSX","CMI","CVS","DHR","DRI","DVA","DE",
  "DAL","DVN","DXCM","FANG","DLR","DFS","DG","DLTR","D","DPZ","DOV","DOW","DHI","DTE","DUK",
  "DD","EMN","ETN","EBAY","ECL","EIX","EW","EA","ELV","LLY","EMR","ENPH","ETR","EOG","EFX",
  "EQIX","EQR","ESS","EL","ETSY","EG","EVRG","ES","EXC","EXPE","EXPD","EXR","XOM","FFIV","FDS",
  "FICO","FAST","FDX","FIS","FITB","FSLR","FE","FI","FLT","FMC","F","FTNT","FTV","BEN","FCX",
  "GRMN","IT","GE","GEHC","GEV","GEN","GNRC","GD","GIS","GM","GPC","GILD","GPN","GL","GDDY",
  "GS","HAL","HIG","HAS","HCA","HSIC","HSY","HES","HPE","HLT","HOLX","HD","HON","HRL","HST",
  "HWM","HPQ","HUBB","HUM","HBAN","HII","IBM","IEX","IDXX","ITW","INCY","IR","PODD","INTC",
  "ICE","IFF","IP","IPG","INTU","ISRG","IVZ","INVH","IQV","IRM","JBHT","JBL","JKHY","J","JNJ",
  "JCI","JPM","JNPR","K","KVUE","KDP","KEY","KEYS","KMB","KIM","KMI","KLAC","KHC","KR","LHX",
  "LH","LRCX","LW","LVS","LDOS","LEN","LIN","LYV","LKQ","LMT","L","LOW","LULU","LYB","MTB",
  "MRO","MPC","MKTX","MAR","MMC","MLM","MAS","MA","MTCH","MKC","MCD","MCK","MDT","MRK","META",
  "MET","MTD","MGM","MCHP","MU","MSFT","MAA","MRNA","MHK","MOH","TAP","MDLZ","MPWR","MNST",
  "MCO","MS","MOS","MSI","MSCI","NDAQ","NTAP","NFLX","NEM","NEE","NKE","NI","NSC","NTRS","NOC",
  "NCLH","NRG","NUE","NVDA","NVR","NXPI","ORLY","OXY","ODFL","OMC","ON","OKE","ORCL","OTIS",
  "PCAR","PKG","PANW","PH","PAYX","PAYC","PYPL","PNR","PEP","PFE","PCG","PM","PSX","PNC","POOL",
  "PPG","PPL","PFG","PG","PGR","PLD","PRU","PEG","PWR","QCOM","RTX","O","REG","REGN","RF","RSG",
  "RMD","RVTY","ROK","ROL","ROP","ROST","RCL","SPGI","CRM","SBAC","SLB","STX","SRE","NOW","SHW",
  "SPG","SWKS","SJM","SNA","SOLV","SO","LUV","SWK","SBUX","STT","STLD","STE","SYK","SYF","SNPS",
  "SYY","TMUS","TROW","TTWO","TPR","TRGP","TGT","TEL","TDY","TFX","TER","TSLA","TXN","TPL",
  "TXT","TMO","TJX","TSCO","TT","TDG","TRV","TRMB","TFC","TYL","TSN","USB","UBER","UDR","ULTA",
  "UNP","UAL","UPS","URI","UNH","UHS","VLO","VTR","VRSN","VRSK","VZ","VRTX","VTRS","VICI","V",
  "VST","VMC","GWW","WAB","WBA","WMT","DIS","WBD","WM","WAT","WEC","WFC","WELL","WST","WDC",
  "WY","WMB","WTW","WYNN","XEL","XYL","YUM","ZBRA","ZBH","ZTS"
];

const NASDAQ100_SYMBOLS = [
  "AAPL","MSFT","NVDA","AMZN","META","TSLA","AVGO","GOOGL","GOOG","COST","NFLX","AMD","ADBE",
  "QCOM","TMUS","AMAT","AMGN","PEP","INTU","CMCSA","TXN","CSCO","BKNG","ADP","ISRG","HON",
  "VRTX","PANW","MU","REGN","GILD","MDLZ","KLAC","ADI","LRCX","INTC","SNPS","CEG","CDNS",
  "MCHP","FTNT","CSGP","MRNA","CRWD","MELI","KDP","CSX","PYPL","WDAY","DXCM","PCAR","ABNB",
  "NXPI","ORLY","IDXX","ROST","PAYX","ODFL","EXC","FAST","VRSK","TTD","GEHC","BIIB","ON",
  "DDOG","ZS","MNST","EA","FANG","TEAM","LULU","CHTR","ANSS","CPRT","CTAS","ROP","NDAQ",
  "ILMN","ALGN","DLTR","SIRI","AEP","XEL","EBAY","COIN","HOOD",
];

const SP500_PLUS_NASDAQ100 = [...new Set([...SP500_SYMBOLS, ...NASDAQ100_SYMBOLS])];

// ── Technical Indicators ─────────────────────────────────────────────────────
function calcEma(prices, period) {
  if (prices.length < period) return [];
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const result = [ema];
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

function calcRsi(prices, period = 14) {
  if (prices.length < period + 1) return 50;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  const recent = changes.slice(-period);
  const avgGain = recent.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
  const avgLoss = Math.abs(recent.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

// ── Yahoo Finance Fetchers ────────────────────────────────────────────────────
async function yahooFetch(url, timeoutMs = 10000) {
  const resp = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!resp.ok) throw new Error(`Yahoo ${resp.status} for ${url}`);
  return resp.json();
}

async function batchQuote(symbols) {
  const joined = symbols.join(",");
  const url = `${YAHOO_BASE}/v8/finance/spark?symbols=${joined}&range=1d&interval=5m`;
  try {
    const json = await yahooFetch(url, 12000);
    return Object.values(json)
      .filter(d => d && d.close?.length > 0)
      .map(d => {
        const price = d.close[d.close.length - 1] ?? d.previousClose;
        const prevClose = d.previousClose;
        const change = price - prevClose;
        const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;
        return {
          symbol: d.symbol,
          shortName: d.symbol,
          regularMarketPrice: price,
          regularMarketChangePercent: changePct,
        };
      })
      .filter(q => q.regularMarketPrice > 1);
  } catch {
    return [];
  }
}

async function batchQuoteAll(symbols) {
  const chunks = [];
  for (let i = 0; i < symbols.length; i += 20) chunks.push(symbols.slice(i, i + 20));
  const all = [];
  const concurrency = 8;
  for (let i = 0; i < chunks.length; i += concurrency) {
    const wave = chunks.slice(i, i + concurrency);
    const results = await Promise.all(wave.map(c => batchQuote(c)));
    all.push(...results.flat());
    if (i + concurrency < chunks.length) await new Promise(r => setTimeout(r, 150));
  }
  return all;
}

async function fetchYahooChart(symbol) {
  const url = `${YAHOO_BASE}/v8/finance/chart/${symbol}?interval=1d&range=6mo&includePrePost=false`;
  const json = await yahooFetch(url, 8000);
  const result = json.chart?.result?.[0];
  if (!result?.timestamp || !result.indicators?.quote?.[0]) return [];
  const { open, high, low, close, volume } = result.indicators.quote[0];
  return result.timestamp.map((ts, i) => ({
    open: open[i] ?? 0, high: high[i] ?? 0, low: low[i] ?? 0,
    close: close[i] ?? 0, volume: volume[i] ?? 0, timestamp: ts,
  })).filter(b => b.close > 0);
}

// ── Breakout Analysis ─────────────────────────────────────────────────────────
function analyzeBreakout(bars, symbol, name, quickChangePct) {
  if (bars.length < 55) return null;
  const closes = bars.map(b => b.close);
  const volumes = bars.map(b => b.volume);
  const highs = bars.map(b => b.high);
  const lastBar = bars[bars.length - 1];
  const prevBar = bars[bars.length - 2];
  const price = lastBar.close;
  const open = lastBar.open;
  const change = price - prevBar.close;
  const changePct = quickChangePct ?? ((change / prevBar.close) * 100);
  const ema20Arr = calcEma(closes, 20);
  const ema50Arr = calcEma(closes, 50);
  const ema20 = ema20Arr[ema20Arr.length - 1] ?? price;
  const ema50 = ema50Arr[ema50Arr.length - 1] ?? price;
  const rsi = calcRsi(closes);
  const last20Highs = highs.slice(-20);
  const highestHigh20 = Math.max(...last20Highs);
  const last20Volumes = volumes.slice(-21, -1);
  const avgVolume20 = last20Volumes.reduce((a, b) => a + b, 0) / 20;
  const volumeRatio = avgVolume20 > 0 ? lastBar.volume / avgVolume20 : 1;
  const nearHighPct = ((price - highestHigh20) / highestHigh20) * 100;
  const closeAboveEma20 = price > ema20;
  const ema20AboveEma50 = ema20 > ema50;
  const rsiAbove50 = rsi >= 50;
  const volumeAboveAvg = lastBar.volume >= avgVolume20;
  const nearHighestHigh = price >= 0.98 * highestHigh20;
  const greenCandle = price > open;
  const signals = { closeAboveEma20, ema20AboveEma50, rsiAbove50, volumeAboveAvg, nearHighestHigh, greenCandle };
  const signalDetails = [
    closeAboveEma20 ? `Above EMA20 (${ema20.toFixed(1)})` : `Below EMA20 (${ema20.toFixed(1)})`,
    ema20AboveEma50 ? "EMA20 > EMA50" : "EMA20 < EMA50",
    rsiAbove50 ? `RSI ${rsi.toFixed(1)} ≥ 50` : `RSI ${rsi.toFixed(1)} < 50`,
    volumeAboveAvg ? `Vol ${volumeRatio.toFixed(1)}x avg` : `Vol ${volumeRatio.toFixed(1)}x avg (low)`,
    nearHighestHigh ? `Within 2% of 20D High (${nearHighPct > 0 ? "+" : ""}${nearHighPct.toFixed(1)}%)` : `${Math.abs(nearHighPct).toFixed(1)}% below 20D High`,
    greenCandle ? "Green Candle" : "Red Candle",
  ];
  const signalCount = [closeAboveEma20, ema20AboveEma50, rsiAbove50, volumeAboveAvg, nearHighestHigh, greenCandle].filter(Boolean).length;
  const convictionScore = Math.round((signalCount / 6) * 100);
  return {
    symbol, name,
    price: +price.toFixed(2), open: +open.toFixed(2),
    change: +change.toFixed(2), changePct: +changePct.toFixed(2),
    volume: Math.round(lastBar.volume), avgVolume20: Math.round(avgVolume20),
    volumeRatio: +volumeRatio.toFixed(2),
    rsi: +rsi.toFixed(2), ema20: +ema20.toFixed(2), ema50: +ema50.toFixed(2),
    highestHigh20: +highestHigh20.toFixed(2), nearHighPct: +nearHighPct.toFixed(2),
    signals, signalCount, convictionScore, signalDetails,
  };
}

function quickScore(q) {
  const momScore = Math.min(Math.abs(q.regularMarketChangePercent) * 10, 80);
  const priceScore = q.regularMarketPrice > 10 && q.regularMarketPrice < 2000 ? 20 : 0;
  return momScore + priceScore;
}

function getUniverse(universe, customSymbols) {
  if (universe === "sp500") return SP500_SYMBOLS;
  if (universe === "nasdaq100") return NASDAQ100_SYMBOLS;
  if (universe === "custom") return customSymbols.length > 0 ? customSymbols : ["SPY","QQQ","AAPL","TSLA","NVDA","AMD","META","AMZN","MSFT","GOOGL","NFLX","COIN","PLTR","SOFI","NIO","UBER","SHOP","HOOD","RIVN","MARA"];
  return SP500_PLUS_NASDAQ100;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    symbols: customSymbols = [],
    universe = "sp500_nasdaq100",
    minSignals = 4,
    minConviction = 60,
    maxDeepAnalysis = 35,
  } = req.body ?? {};

  try {
    const allSymbols = getUniverse(universe, customSymbols);

    // Phase 1: Batch Spark quotes
    const allQuotes = await batchQuoteAll(allSymbols);

    // Phase 2: Pre-filter - top N by momentum
    const preFiltered = allQuotes
      .filter(q => q.regularMarketPrice > 1)
      .sort((a, b) => quickScore(b) - quickScore(a))
      .slice(0, Math.min(maxDeepAnalysis, 35)); // cap at 35 for Vercel timeout safety

    // Phase 3: Deep breakout analysis
    const results = [];
    const concurrency = 6;
    for (let i = 0; i < preFiltered.length; i += concurrency) {
      const batch = preFiltered.slice(i, i + concurrency);
      const settled = await Promise.allSettled(batch.map(async q => {
        const bars = await fetchYahooChart(q.symbol);
        if (bars.length < 55) return null;
        return analyzeBreakout(bars, q.symbol, q.shortName || q.symbol, q.regularMarketChangePercent);
      }));
      for (const r of settled) {
        if (r.status === "fulfilled" && r.value) results.push(r.value);
      }
    }

    // Apply filters & sort
    const candidates = results
      .filter(c => c.signalCount >= minSignals && c.convictionScore >= minConviction)
      .sort((a, b) => b.convictionScore - a.convictionScore || b.signalCount - a.signalCount);

    return res.status(200).json({
      candidates,
      scannedAt: new Date().toISOString(),
      totalScanned: allQuotes.length,
      totalPassed: candidates.length,
      scanId: Math.random().toString(36).slice(2),
    });
  } catch (err) {
    console.error("Scan error:", err);
    return res.status(500).json({ error: err.message ?? "Scan failed" });
  }
}
