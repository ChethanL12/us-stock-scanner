// Vercel Serverless Function: /api/scanner/pattern-scan

const YAHOO_BASE = "https://query1.finance.yahoo.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ── Stock Universes ───────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// Linear regression: returns { slope, intercept, r2 }
function linReg(ys) {
  const n = ys.length;
  if (n < 2) return { slope: 0, intercept: ys[0] ?? 0, r2: 0 };
  const xs = ys.map((_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
    ssTot += (ys[i] - yMean) ** 2;
  }
  const slope = den !== 0 ? num / den : 0;
  const intercept = yMean - slope * xMean;
  const ssRes = ys.reduce((acc, y, i) => acc + (y - (slope * i + intercept)) ** 2, 0);
  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
  return { slope, intercept, r2 };
}

// Find local swing lows and highs
function swingLows(lows, window = 3) {
  const out = [];
  for (let i = window; i < lows.length - window; i++) {
    const slice = lows.slice(i - window, i + window + 1);
    if (lows[i] === Math.min(...slice)) out.push({ idx: i, val: lows[i] });
  }
  return out;
}

function swingHighs(highs, window = 3) {
  const out = [];
  for (let i = window; i < highs.length - window; i++) {
    const slice = highs.slice(i - window, i + window + 1);
    if (highs[i] === Math.max(...slice)) out.push({ idx: i, val: highs[i] });
  }
  return out;
}

// ── Pattern Detectors ─────────────────────────────────────────────────────────

function detectBullFlag(bars) {
  if (bars.length < 25) return null;
  const closes = bars.map(b => b.close);
  const volumes = bars.map(b => b.volume);

  // Look for pole in the last 30–80 bars, then consolidation in last 5–20 bars
  for (let consLen = 5; consLen <= 20; consLen++) {
    for (let poleLen = 5; poleLen <= 15; poleLen++) {
      const totalNeed = poleLen + consLen;
      if (bars.length < totalNeed + 5) continue;

      const poleStart = bars.length - totalNeed - 1;
      const poleEnd = bars.length - consLen - 1;
      const consStart = poleEnd;

      const poleGain = (closes[poleEnd] - closes[poleStart]) / closes[poleStart] * 100;
      if (poleGain < 7) continue; // Pole must be ≥7%

      // Consolidation: tight range, slight drift
      const consPrices = closes.slice(consStart);
      const consHigh = Math.max(...consPrices);
      const consLow = Math.min(...consPrices);
      const consRange = (consHigh - consLow) / consHigh * 100;
      if (consRange > 8) continue; // tight consolidation

      const consReg = linReg(consPrices);
      // Flags drift slightly down or sideways
      const flagDrift = (consReg.slope / closes[consStart]) * 100;
      if (flagDrift > 0.5) continue; // should not be aggressively trending up

      // Volume: higher during pole, lower during consolidation
      const poleVol = volumes.slice(poleStart, poleEnd).reduce((a, b) => a + b, 0) / poleLen;
      const consVol = volumes.slice(consStart).reduce((a, b) => a + b, 0) / consLen;
      const volRatio = consVol > 0 ? poleVol / consVol : 1;

      const baseConf = Math.min(poleGain * 4, 50); // up to 50 from pole strength
      const rangeConf = Math.max(0, (8 - consRange) * 3); // up to 24 from tightness
      const volConf = Math.min(volRatio * 5, 20); // up to 20 from volume contraction
      const confidence = Math.round(Math.min(baseConf + rangeConf + volConf, 95));
      if (confidence < 50) continue;

      return {
        name: "Bull Flag",
        icon: "🏳️",
        confidence,
        description: `Pole: +${poleGain.toFixed(1)}% in ${poleLen} bars · Consolidation range: ${consRange.toFixed(1)}% · Vol contraction: ${volRatio.toFixed(1)}x`,
        color: "emerald",
      };
    }
  }
  return null;
}

function detectFallingWedge(bars) {
  if (bars.length < 25) return null;
  const lookback = Math.min(40, bars.length - 2);
  const slice = bars.slice(-lookback);
  const highs = slice.map(b => b.high);
  const lows = slice.map(b => b.low);

  const highReg = linReg(highs);
  const lowReg = linReg(lows);

  // Both must be declining
  if (highReg.slope >= 0 || lowReg.slope >= 0) return null;
  // Highs must fall faster than lows (converging from above)
  if (highReg.slope >= lowReg.slope) return null;

  // Width must narrow: end width < 70% of start width
  const startWidth = (highReg.intercept) - (lowReg.intercept);
  const endWidth = (highReg.slope * (lookback - 1) + highReg.intercept) -
                   (lowReg.slope * (lookback - 1) + lowReg.intercept);
  if (startWidth <= 0 || endWidth <= 0) return null;
  const convergence = 1 - endWidth / startWidth;
  if (convergence < 0.25) return null;

  // Last close should be above middle of wedge (early breakout attempt)
  const lastHigh = highReg.slope * (lookback - 1) + highReg.intercept;
  const lastLow = lowReg.slope * (lookback - 1) + lowReg.intercept;
  const lastClose = slice[slice.length - 1].close;
  const position = (lastClose - lastLow) / (lastHigh - lastLow); // 0 = at low, 1 = at high

  const r2Score = (highReg.r2 + lowReg.r2) / 2;
  const convConf = Math.round(convergence * 40);
  const r2Conf = Math.round(r2Score * 30);
  const posConf = Math.round(position * 25);
  const confidence = Math.min(convConf + r2Conf + posConf, 95);
  if (confidence < 45) return null;

  return {
    name: "Falling Wedge",
    icon: "📐",
    confidence,
    description: `Convergence: ${(convergence * 100).toFixed(0)}% · Trendline fit: ${(r2Score * 100).toFixed(0)}% · Price position: ${(position * 100).toFixed(0)}% in wedge`,
    color: "violet",
  };
}

function detectRisingWedge(bars) {
  if (bars.length < 25) return null;
  const lookback = Math.min(40, bars.length - 2);
  const slice = bars.slice(-lookback);
  const highs = slice.map(b => b.high);
  const lows = slice.map(b => b.low);

  const highReg = linReg(highs);
  const lowReg = linReg(lows);

  // Both must be rising
  if (highReg.slope <= 0 || lowReg.slope <= 0) return null;
  // Lows must rise faster (converging from below)
  if (lowReg.slope <= highReg.slope) return null;

  const startWidth = highReg.intercept - lowReg.intercept;
  const endWidth = (highReg.slope * (lookback - 1) + highReg.intercept) -
                   (lowReg.slope * (lookback - 1) + lowReg.intercept);
  if (startWidth <= 0 || endWidth <= 0) return null;
  const convergence = 1 - endWidth / startWidth;
  if (convergence < 0.25) return null;

  const r2Score = (highReg.r2 + lowReg.r2) / 2;
  const confidence = Math.round(Math.min(convergence * 40 + r2Score * 30 + 20, 95));
  if (confidence < 45) return null;

  return {
    name: "Rising Wedge",
    icon: "⚠️",
    confidence,
    description: `Bearish pattern · Convergence: ${(convergence * 100).toFixed(0)}% · Trendline fit: ${(r2Score * 100).toFixed(0)}%`,
    color: "amber",
  };
}

function detectAscendingTriangle(bars) {
  if (bars.length < 20) return null;
  const lookback = Math.min(35, bars.length - 2);
  const slice = bars.slice(-lookback);
  const highs = slice.map(b => b.high);
  const lows = slice.map(b => b.low);

  const sHighs = swingHighs(highs, 2);
  const sLows = swingLows(lows, 2);
  if (sHighs.length < 2 || sLows.length < 2) return null;

  // Resistance: swing highs are flat (within 2.5%)
  const highVals = sHighs.map(s => s.val);
  const maxH = Math.max(...highVals);
  const minH = Math.min(...highVals);
  const resistanceFlat = (maxH - minH) / maxH * 100;
  if (resistanceFlat > 3.5) return null;

  // Support: swing lows rising
  const lowReg = linReg(sLows.map(s => s.val));
  if (lowReg.slope <= 0) return null;

  // Current price approaching resistance
  const lastClose = slice[slice.length - 1].close;
  const nearResistance = (lastClose / maxH) * 100;

  const flatConf = Math.round(Math.max(0, (3.5 - resistanceFlat) / 3.5 * 40));
  const slopeConf = Math.round(Math.min(lowReg.slope / lows[0] * 5000, 30));
  const nearConf = nearResistance > 96 ? 25 : nearResistance > 92 ? 15 : 5;
  const confidence = Math.min(flatConf + slopeConf + nearConf + 5, 95);
  if (confidence < 45) return null;

  return {
    name: "Ascending Triangle",
    icon: "🔺",
    confidence,
    description: `Resistance cluster: ${minH.toFixed(2)}–${maxH.toFixed(2)} · Rising lows · Price at ${nearResistance.toFixed(1)}% of resistance`,
    color: "sky",
  };
}

function detectDoubleBottom(bars) {
  if (bars.length < 30) return null;
  const lookback = Math.min(60, bars.length - 2);
  const slice = bars.slice(-lookback);
  const lows = slice.map(b => b.low);
  const closes = slice.map(b => b.close);

  const sLows = swingLows(lows, 3);
  if (sLows.length < 2) return null;

  // Find two prominent lows
  const sorted = [...sLows].sort((a, b) => a.val - b.val).slice(0, 4);
  if (sorted.length < 2) return null;

  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const b1 = sorted[i], b2 = sorted[j];
      const [first, second] = b1.idx < b2.idx ? [b1, b2] : [b2, b1];

      // Both lows within 3% of each other
      const diff = Math.abs(first.val - second.val) / first.val * 100;
      if (diff > 4) continue;

      // Must be separated by at least 5 bars
      if (second.idx - first.idx < 5) continue;

      // Peak between the two bottoms must be at least 5% higher
      const between = lows.slice(first.idx, second.idx);
      const peakBetween = Math.max(...slice.slice(first.idx, second.idx).map(b => b.high));
      const peakLift = (peakBetween - first.val) / first.val * 100;
      if (peakLift < 5) continue;

      // Current price recovering (above or near peak)
      const lastClose = closes[closes.length - 1];
      const recovery = (lastClose - second.val) / (peakBetween - second.val) * 100;

      const symmetryConf = Math.round(Math.max(0, (4 - diff) / 4 * 30));
      const peakConf = Math.round(Math.min(peakLift * 2, 30));
      const recovConf = Math.round(Math.min(recovery * 0.35, 35));
      const confidence = Math.min(symmetryConf + peakConf + recovConf, 95);
      if (confidence < 45) continue;

      return {
        name: "Double Bottom",
        icon: "🔁",
        confidence,
        description: `Two lows: ~${first.val.toFixed(2)} · Symmetry: ${(100 - diff * 25).toFixed(0)}% · Neckline lift: +${peakLift.toFixed(1)}% · Recovery: ${Math.min(recovery, 100).toFixed(0)}%`,
        color: "cyan",
      };
    }
  }
  return null;
}

function detectCupHandle(bars) {
  if (bars.length < 45) return null;
  const lookback = Math.min(80, bars.length - 2);
  const slice = bars.slice(-lookback);
  const closes = slice.map(b => b.close);

  // Cup: look for a U-shape — high at start, decline, then recovery
  const cupLen = Math.floor(lookback * 0.7);
  const cupSlice = closes.slice(0, cupLen);
  const handleSlice = closes.slice(cupLen);

  const cupLeft = cupSlice[0];
  const cupRight = cupSlice[cupSlice.length - 1];
  const cupBot = Math.min(...cupSlice);

  // Cup should go down and come back up (both sides near same level)
  const leftDepth = (cupLeft - cupBot) / cupLeft * 100;
  const rightDepth = (cupRight - cupBot) / cupRight * 100;
  if (leftDepth < 8 || rightDepth < 8) return null;

  const symmetry = 100 - Math.abs(leftDepth - rightDepth) * 5;
  if (symmetry < 50) return null;

  // Handle: slight pullback from cup right (≤8%), then flat/up
  const handleHigh = Math.max(...handleSlice);
  const handleLow = Math.min(...handleSlice);
  const handleDrop = (handleHigh - handleSlice[handleSlice.length - 1]) / handleHigh * 100;
  const handleRange = (handleHigh - handleLow) / handleHigh * 100;
  if (handleRange > 10) return null; // handle too wide

  // Handle should not drop more than 8% from cup right
  const handlePullback = (cupRight - handleLow) / cupRight * 100;
  if (handlePullback > 10) return null;

  const depthConf = Math.round(Math.min(leftDepth * 1.5, 30));
  const symConf = Math.round((symmetry - 50) / 50 * 30);
  const handleConf = Math.round(Math.max(0, (10 - handleRange) * 3));
  const confidence = Math.min(depthConf + symConf + handleConf + 5, 95);
  if (confidence < 45) return null;

  return {
    name: "Cup & Handle",
    icon: "☕",
    confidence,
    description: `Cup depth: ${leftDepth.toFixed(1)}% · Symmetry: ${symmetry.toFixed(0)}% · Handle range: ${handleRange.toFixed(1)}%`,
    color: "orange",
  };
}

// ── Yahoo Finance Fetchers ─────────────────────────────────────────────────────
async function yahooFetch(url, timeoutMs = 10000) {
  const resp = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!resp.ok) throw new Error(`Yahoo ${resp.status}`);
  return resp.json();
}

async function fetchChart(symbol) {
  const url = `${YAHOO_BASE}/v8/finance/chart/${symbol}?interval=1d&range=6mo&includePrePost=false`;
  try {
    const json = await yahooFetch(url, 9000);
    const result = json.chart?.result?.[0];
    if (!result?.timestamp || !result.indicators?.quote?.[0]) return [];
    const { open, high, low, close, volume } = result.indicators.quote[0];
    return result.timestamp.map((ts, i) => ({
      open: open[i] ?? 0, high: high[i] ?? 0, low: low[i] ?? 0,
      close: close[i] ?? 0, volume: volume[i] ?? 0, timestamp: ts,
    })).filter(b => b.close > 0);
  } catch { return []; }
}

async function batchQuote(symbols) {
  const url = `${YAHOO_BASE}/v8/finance/spark?symbols=${symbols.join(",")}&range=1d&interval=5m`;
  try {
    const json = await yahooFetch(url, 12000);
    const map = new Map();
    for (const d of Object.values(json)) {
      if (d && d.close?.length > 0) {
        const price = d.close[d.close.length - 1] ?? d.previousClose;
        const changePct = d.previousClose > 0 ? ((price - d.previousClose) / d.previousClose) * 100 : 0;
        map.set(d.symbol, { price, changePct });
      }
    }
    return map;
  } catch { return new Map(); }
}

async function batchQuoteAll(symbols) {
  const all = new Map();
  const chunks = [];
  for (let i = 0; i < symbols.length; i += 20) chunks.push(symbols.slice(i, i + 20));
  for (let i = 0; i < chunks.length; i += 8) {
    const wave = chunks.slice(i, i + 8);
    const maps = await Promise.all(wave.map(c => batchQuote(c)));
    for (const m of maps) for (const [k, v] of m) all.set(k, v);
    if (i + 8 < chunks.length) await new Promise(r => setTimeout(r, 150));
  }
  return all;
}

function getUniverse(universe, customSymbols) {
  if (universe === "sp500") return SP500_SYMBOLS;
  if (universe === "nasdaq100") return NASDAQ100_SYMBOLS;
  if (universe === "custom") return customSymbols.length > 0 ? customSymbols : ["SPY","QQQ","AAPL","TSLA","NVDA","AMD","META","AMZN","MSFT","GOOGL"];
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
    universe = "sp500_nasdaq100",
    symbols: customSymbols = [],
    patterns: selectedPatterns = ["bullFlag","fallingWedge","ascendingTriangle","doubleBottom","cupHandle","risingWedge"],
    minConfidence = 60,
    maxSymbols = 60,
  } = req.body ?? {};

  try {
    const allSymbols = getUniverse(universe, customSymbols);

    // Phase 1: Quick batch quote for all symbols
    const quoteMap = await batchQuoteAll(allSymbols);

    // Phase 2: Sort by absolute change (more active stocks first), take top N
    const ranked = [...quoteMap.entries()]
      .sort((a, b) => Math.abs(b[1].changePct) - Math.abs(a[1].changePct))
      .slice(0, Math.min(maxSymbols, allSymbols.length))
      .map(([sym]) => sym);

    // Phase 3: Deep OHLC fetch + pattern detection
    const matches = [];
    const CONCURRENCY = 8;

    for (let i = 0; i < ranked.length; i += CONCURRENCY) {
      const batch = ranked.slice(i, i + CONCURRENCY);
      const settled = await Promise.allSettled(batch.map(async symbol => {
        const bars = await fetchChart(symbol);
        if (bars.length < 25) return null;

        const closes = bars.map(b => b.close);
        const volumes = bars.map(b => b.volume);
        const rsi = (() => {
          if (closes.length < 15) return 50;
          const changes = closes.slice(1).map((p, i) => p - closes[i]);
          const recent = changes.slice(-14);
          const avgGain = recent.filter(c => c > 0).reduce((a, b) => a + b, 0) / 14;
          const avgLoss = Math.abs(recent.filter(c => c < 0).reduce((a, b) => a + b, 0)) / 14;
          return avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
        })();

        const last20Vol = volumes.slice(-21, -1);
        const avgVol20 = last20Vol.reduce((a, b) => a + b, 0) / 20;
        const volumeRatio = avgVol20 > 0 ? volumes[volumes.length - 1] / avgVol20 : 1;

        const detectors = {
          bullFlag: detectBullFlag,
          fallingWedge: detectFallingWedge,
          ascendingTriangle: detectAscendingTriangle,
          doubleBottom: detectDoubleBottom,
          cupHandle: detectCupHandle,
          risingWedge: detectRisingWedge,
        };

        const foundPatterns = [];
        for (const key of selectedPatterns) {
          if (detectors[key]) {
            const result = detectors[key](bars);
            if (result && result.confidence >= minConfidence) {
              foundPatterns.push(result);
            }
          }
        }

        if (foundPatterns.length === 0) return null;

        const q = quoteMap.get(symbol) ?? { price: closes[closes.length - 1], changePct: 0 };

        return {
          symbol,
          price: +q.price.toFixed(2),
          changePct: +q.changePct.toFixed(2),
          rsi: +rsi.toFixed(1),
          volumeRatio: +volumeRatio.toFixed(2),
          volume: Math.round(volumes[volumes.length - 1]),
          avgVolume20: Math.round(avgVol20),
          patterns: foundPatterns.sort((a, b) => b.confidence - a.confidence),
          topPattern: foundPatterns[0].name,
          topConfidence: foundPatterns[0].confidence,
        };
      }));

      for (const r of settled) {
        if (r.status === "fulfilled" && r.value) matches.push(r.value);
      }
    }

    matches.sort((a, b) => b.topConfidence - a.topConfidence || b.patterns.length - a.patterns.length);

    return res.status(200).json({
      matches,
      scannedAt: new Date().toISOString(),
      totalScanned: ranked.length,
      totalMatched: matches.length,
      scanId: Math.random().toString(36).slice(2),
    });
  } catch (err) {
    console.error("Pattern scan error:", err);
    return res.status(500).json({ error: err.message ?? "Pattern scan failed" });
  }
}
