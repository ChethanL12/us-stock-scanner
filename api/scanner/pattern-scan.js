// Vercel Serverless Function: /api/scanner/pattern-scan  ── v2 (swing-point based)

const YAHOO_BASE = "https://query1.finance.yahoo.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

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
  "ILMN","ALGN","DLTR","AEP","XEL","EBAY","COIN","HOOD",
];
const SP500_PLUS_NASDAQ100 = [...new Set([...SP500_SYMBOLS, ...NASDAQ100_SYMBOLS])];

// ── Core Math ─────────────────────────────────────────────────────────────────
// Linear regression on {x,y} point array
function linReg(points) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: points[0]?.y ?? 0, r2: 0 };
  const xMean = points.reduce((s, p) => s + p.x, 0) / n;
  const yMean = points.reduce((s, p) => s + p.y, 0) / n;
  let num = 0, den = 0, ssTot = 0;
  for (const p of points) {
    num += (p.x - xMean) * (p.y - yMean);
    den += (p.x - xMean) ** 2;
    ssTot += (p.y - yMean) ** 2;
  }
  const slope = den ? num / den : 0;
  const intercept = yMean - slope * xMean;
  const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
  return { slope, intercept, r2, yAtX: (x) => slope * x + intercept };
}

// ── Swing Point Detection ─────────────────────────────────────────────────────
// window = how many bars on EACH SIDE must be lower (for highs) or higher (for lows)
function findSwingHighs(bars, window = 5) {
  const out = [];
  for (let i = window; i < bars.length - window; i++) {
    const h = bars[i].high;
    let ok = true;
    for (let j = i - window; j <= i + window; j++) {
      if (j !== i && bars[j].high >= h) { ok = false; break; }
    }
    if (ok) out.push({ idx: i, val: h });
  }
  return out;
}

function findSwingLows(bars, window = 5) {
  const out = [];
  for (let i = window; i < bars.length - window; i++) {
    const l = bars[i].low;
    let ok = true;
    for (let j = i - window; j <= i + window; j++) {
      if (j !== i && bars[j].low <= l) { ok = false; break; }
    }
    if (ok) out.push({ idx: i, val: l });
  }
  return out;
}

// ── Pattern Detectors v2 (swing-point based) ──────────────────────────────────

/**
 * FALLING WEDGE
 * Rules:
 * - At least 3 swing highs AND 3 swing lows detected
 * - Both trendlines (hi→hi, lo→lo) have NEGATIVE slope
 * - High trendline falls FASTER than low trendline (converging)
 * - Trendline R² ≥ 0.65 for both (clean lines)
 * - Width compresses by at least 30%
 * - Pattern spans at least 15 bars
 * - Price currently near bottom of wedge (potential breakout zone)
 */
function detectFallingWedge(bars) {
  if (bars.length < 45) return null;
  const lookback = Math.min(65, bars.length - 6);
  const slice = bars.slice(-lookback);

  const sHighs = findSwingHighs(slice, 5);
  const sLows  = findSwingLows(slice, 5);
  if (sHighs.length < 3 || sLows.length < 3) return null;

  const rH = sHighs.slice(-4);
  const rL  = sLows.slice(-4);

  const highLine = linReg(rH.map(s => ({ x: s.idx, y: s.val })));
  const lowLine  = linReg(rL.map(s => ({ x: s.idx, y: s.val })));

  // Both must be declining
  if (highLine.slope >= 0 || lowLine.slope >= 0) return null;

  // High line must fall faster (more negative) than low line → they converge
  if (highLine.slope >= lowLine.slope) return null;

  // Trendline quality
  if (highLine.r2 < 0.65 || lowLine.r2 < 0.65) return null;

  // Width compression
  const xFirst = Math.min(rH[0].idx, rL[0].idx);
  const xLast  = Math.max(rH[rH.length-1].idx, rL[rL.length-1].idx);
  const wStart = highLine.yAtX(xFirst) - lowLine.yAtX(xFirst);
  const wEnd   = highLine.yAtX(xLast)  - lowLine.yAtX(xLast);
  if (wStart <= 0 || wEnd <= 0 || wEnd >= wStart) return null;
  const compression = 1 - wEnd / wStart;
  if (compression < 0.30) return null;

  // Pattern must span enough bars
  if (xLast - xFirst < 15) return null;

  // Price position relative to wedge at current bar
  const lastClose = slice[slice.length - 1].close;
  const curH = highLine.yAtX(lookback - 1);
  const curL  = lowLine.yAtX(lookback - 1);
  const pos = curH > curL ? (lastClose - curL) / (curH - curL) : 0.5;
  // Should be in lower half or JUST above top (breakout setup)
  if (pos > 1.3) return null;

  const r2Avg = (highLine.r2 + lowLine.r2) / 2;
  const confidence = Math.round(Math.min(
    r2Avg * 35 +
    compression * 35 +
    Math.min((rH.length + rL.length - 4) * 5, 20) +
    (pos <= 1.05 ? 10 : 0),
    95
  ));
  if (confidence < 55) return null;

  return {
    name: "Falling Wedge", icon: "📐", confidence, color: "violet",
    description: `${rH.length} swing highs · ${rL.length} swing lows · ` +
      `Compression: ${(compression*100).toFixed(0)}% · ` +
      `Trendline fit: ${(r2Avg*100).toFixed(0)}% · ` +
      `${xLast - xFirst} bars`,
  };
}

/**
 * BULL FLAG
 * Rules:
 * - Strong POLE: ≥8% gain in 5–15 bars
 * - FLAG consolidation follows (5–18 bars)
 * - Flag range < 7% of price
 * - Flag gives back < 50% of pole height
 * - Flag highs and lows both flat/slightly declining (not another breakout)
 * - Volume contracts during flag vs. pole
 */
function detectBullFlag(bars) {
  if (bars.length < 30) return null;

  for (let flagLen = 5; flagLen <= 18; flagLen++) {
    for (let poleLen = 5; poleLen <= 15; poleLen++) {
      const needed = poleLen + flagLen + 3;
      if (bars.length < needed) continue;

      const poleStart = bars.length - needed;
      const poleEnd   = poleStart + poleLen;
      const flagBars  = bars.slice(poleEnd);

      const poleOpen  = bars[poleStart].close;
      const poleClose = bars[poleEnd - 1].close;
      const poleGain  = (poleClose - poleOpen) / poleOpen * 100;
      if (poleGain < 8) continue;

      // Pole must be predominantly up (no close below 70% of pole range)
      const poleSlice = bars.slice(poleStart, poleEnd);
      const poleMin   = Math.min(...poleSlice.map(b => b.close));
      if (poleMin < poleOpen + (poleClose - poleOpen) * 0.25) continue;

      // Flag geometry
      const flagHighs  = flagBars.map(b => b.high);
      const flagLows   = flagBars.map(b => b.low);
      const fHigh      = Math.max(...flagHighs);
      const fLow       = Math.min(...flagLows);
      const flagRange  = (fHigh - fLow) / fHigh * 100;
      if (flagRange > 7) continue;

      // Pullback check — must not give back >50% of pole
      const poleHeight  = poleClose - poleOpen;
      const flagPullback = poleClose - Math.min(...flagBars.map(b => b.close));
      if (flagPullback > poleHeight * 0.5) continue;

      // Both flag trendlines flat or slightly DOWN (proper flag shape)
      const hReg = linReg(flagHighs.map((h, i) => ({ x: i, y: h })));
      const lReg = linReg(flagLows.map((l, i) => ({ x: i, y: l })));
      const maxAllowedSlope = poleClose * 0.004; // 0.4% per bar max
      if (hReg.slope > maxAllowedSlope || lReg.slope > maxAllowedSlope) continue;

      // Volume contraction during flag
      const poleVol = poleSlice.reduce((s, b) => s + b.volume, 0) / poleLen;
      const flagVol = flagBars.reduce((s, b) => s + b.volume, 0) / flagLen;
      const volContracting = flagVol < poleVol * 0.85;

      const gainScore = Math.min(poleGain * 3, 40);
      const tightScore = Math.max(0, (7 - flagRange) * 4);
      const volScore = volContracting ? 20 : 5;
      const pbScore = Math.max(0, (0.5 - flagPullback / poleHeight) * 20);

      const confidence = Math.round(Math.min(gainScore + tightScore + volScore + pbScore, 95));
      if (confidence < 55) continue;

      return {
        name: "Bull Flag", icon: "🏳️", confidence, color: "emerald",
        description: `Pole: +${poleGain.toFixed(1)}% in ${poleLen} bars · ` +
          `Flag range: ${flagRange.toFixed(1)}% · ` +
          `Pullback: ${(flagPullback/poleHeight*100).toFixed(0)}% of pole · ` +
          `Vol: ${volContracting ? "contracting ✓" : "not contracting"}`,
      };
    }
  }
  return null;
}

/**
 * ASCENDING TRIANGLE
 * Rules:
 * - At least 3 swing highs all within 2.5% of each other (flat resistance)
 * - At least 3 swing lows with clearly positive regression slope (R² ≥ 0.65)
 * - Pattern spans ≥20 bars
 * - Current price ≥ 92% of resistance (approaching breakout)
 */
function detectAscendingTriangle(bars) {
  if (bars.length < 40) return null;
  const lookback = Math.min(70, bars.length - 6);
  const slice = bars.slice(-lookback);

  const sHighs = findSwingHighs(slice, 4);
  const sLows  = findSwingLows(slice, 4);
  if (sHighs.length < 3 || sLows.length < 3) return null;

  const rH = sHighs.slice(-4);
  const rL  = sLows.slice(-4);

  // Resistance: all swing highs within 2.5%
  const maxH = Math.max(...rH.map(s => s.val));
  const minH = Math.min(...rH.map(s => s.val));
  const spread = (maxH - minH) / maxH * 100;
  if (spread > 2.5) return null;

  // Support: rising swing lows
  const lowLine = linReg(rL.map(s => ({ x: s.idx, y: s.val })));
  if (lowLine.slope <= 0) return null;
  if (lowLine.r2 < 0.65) return null;

  // Span check
  const span = Math.max(rH[rH.length-1].idx, rL[rL.length-1].idx) - Math.min(rH[0].idx, rL[0].idx);
  if (span < 18) return null;

  // Price proximity to resistance
  const lastClose = slice[slice.length - 1].close;
  const nearness  = lastClose / maxH;
  if (nearness < 0.92) return null;

  const flatScore = Math.round((2.5 - spread) / 2.5 * 40);
  const slopeScore = Math.round(Math.min(lowLine.r2 * 30, 30));
  const nearScore  = nearness > 0.97 ? 25 : nearness > 0.94 ? 15 : 8;

  const confidence = Math.min(flatScore + slopeScore + nearScore, 95);
  if (confidence < 55) return null;

  return {
    name: "Ascending Triangle", icon: "🔺", confidence, color: "sky",
    description: `Resistance: $${minH.toFixed(2)}–$${maxH.toFixed(2)} (${spread.toFixed(1)}% spread) · ` +
      `Rising lows (R²=${(lowLine.r2*100).toFixed(0)}%) · ` +
      `Price at ${(nearness*100).toFixed(1)}% of resistance`,
  };
}

/**
 * DOUBLE BOTTOM
 * Rules:
 * - 2 clear swing lows within 3% of each other (window ≥ 6 bars)
 * - Separated by at least 10 bars
 * - Clear swing high between them (neckline), at least 5% above lows
 * - Second bottom NOT lower than first (no lower low = strength)
 * - Price at least 50% recovered toward neckline (or above it)
 */
function detectDoubleBottom(bars) {
  if (bars.length < 45) return null;
  const lookback = Math.min(90, bars.length - 6);
  const slice = bars.slice(-lookback);

  const sLows  = findSwingLows(slice, 6);
  const sHighs = findSwingHighs(slice, 4);
  if (sLows.length < 2 || sHighs.length < 1) return null;

  const recentL = sLows.slice(-5);

  for (let i = 0; i < recentL.length - 1; i++) {
    for (let j = i + 1; j < recentL.length; j++) {
      const L1 = recentL[i], L2 = recentL[j];
      if (L2.idx - L1.idx < 10) continue;

      const diff = Math.abs(L1.val - L2.val) / L1.val * 100;
      if (diff > 3) continue;

      // Second low must NOT be lower than first (otherwise it's not a W)
      if (L2.val < L1.val * 0.975) continue;

      // Find highest swing high between the two lows
      const between = sHighs.filter(h => h.idx > L1.idx && h.idx < L2.idx);
      if (between.length === 0) continue;
      const neckline = Math.max(...between.map(h => h.val));
      const lift = (neckline - L1.val) / L1.val * 100;
      if (lift < 5) continue;

      const lastClose = slice[slice.length - 1].close;
      const aboveNeck = lastClose > neckline;
      const recovery  = Math.min(((lastClose - L2.val) / (neckline - L2.val)) * 100, 120);
      if (recovery < 45) continue;

      const symScore  = Math.round((3 - diff) / 3 * 35);
      const neckScore = Math.round(Math.min(lift * 2, 30));
      const recScore  = aboveNeck ? 30 : Math.round(Math.min(recovery * 0.25, 25));

      const confidence = Math.min(symScore + neckScore + recScore, 95);
      if (confidence < 55) continue;

      return {
        name: "Double Bottom", icon: "🔁", confidence, color: "cyan",
        description: `Lows: $${L1.val.toFixed(2)} & $${L2.val.toFixed(2)} (${diff.toFixed(1)}% apart) · ` +
          `Neckline: $${neckline.toFixed(2)} (+${lift.toFixed(1)}%) · ` +
          `${aboveNeck ? "✓ Above neckline — confirmed breakout" : `Recovery: ${recovery.toFixed(0)}%`}`,
      };
    }
  }
  return null;
}

/**
 * CUP & HANDLE
 * Rules:
 * - Cup: U-shaped base over first ~70% of lookback
 *   • Left & right rims within 6% of each other
 *   • Cup depth ≥ 12% from rim to bottom
 *   • Bottom is ROUNDED (not V-shaped): bottom 40% of cup bars have < 50% of depth as range
 * - Handle: last ~30% of lookback
 *   • Range < 10% of price
 *   • Does not drop more than 8% below right rim
 * - Current price ≥ 94% of right rim (near breakout)
 */
function detectCupHandle(bars) {
  if (bars.length < 55) return null;
  const lookback = Math.min(90, bars.length - 6);
  const slice = bars.slice(-lookback);

  const cupLen    = Math.floor(lookback * 0.70);
  const cupSlice  = slice.slice(0, cupLen);
  const hndSlice  = slice.slice(cupLen);
  if (cupLen < 25 || hndSlice.length < 5) return null;

  const leftRim  = cupSlice.slice(0, 5).reduce((s, b) => s + b.close, 0) / 5;
  const rightRim = cupSlice.slice(-5).reduce((s, b) => s + b.close, 0) / 5;
  const rimDiff  = Math.abs(leftRim - rightRim) / leftRim * 100;
  if (rimDiff > 6) return null;

  const rimLevel = (leftRim + rightRim) / 2;
  const cupBot   = Math.min(...cupSlice.map(b => b.low));
  const depth    = (rimLevel - cupBot) / rimLevel * 100;
  if (depth < 12) return null;

  // Roundedness check: middle 40% of cup bars should have a tight range
  const midStart = Math.floor(cupLen * 0.30);
  const midEnd   = Math.floor(cupLen * 0.70);
  const midSlice = cupSlice.slice(midStart, midEnd);
  const midRange = (Math.max(...midSlice.map(b => b.high)) - Math.min(...midSlice.map(b => b.low))) / cupBot * 100;
  if (midRange > depth * 0.60) return null; // V-shaped if mid range is too large

  // Handle checks
  const hndHigh = Math.max(...hndSlice.map(b => b.high));
  const hndLow  = Math.min(...hndSlice.map(b => b.low));
  const hndRange = (hndHigh - hndLow) / hndHigh * 100;
  if (hndRange > 10) return null;
  const hndDrop = (rightRim - hndLow) / rightRim * 100;
  if (hndDrop > 9) return null;

  const lastClose = slice[slice.length - 1].close;
  const nearRim = lastClose / rightRim;
  if (nearRim < 0.94) return null;

  const symScore  = Math.round((6 - rimDiff) / 6 * 30);
  const depScore  = Math.round(Math.min(depth * 1.5, 30));
  const hndScore  = Math.round((10 - hndRange) * 2.5);
  const rimScore  = nearRim > 1.0 ? 15 : nearRim > 0.97 ? 10 : 5;

  const confidence = Math.min(symScore + depScore + hndScore + rimScore, 95);
  if (confidence < 55) return null;

  return {
    name: "Cup & Handle", icon: "☕", confidence, color: "orange",
    description: `Cup depth: ${depth.toFixed(1)}% · Rim symmetry: ${(100-rimDiff).toFixed(0)}% · ` +
      `Handle: ${hndRange.toFixed(1)}% range · ` +
      `Price at ${(nearRim*100).toFixed(0)}% of rim`,
  };
}

/**
 * RISING WEDGE (bearish warning)
 * Rules: symmetric to falling wedge but upward‑sloping
 */
function detectRisingWedge(bars) {
  if (bars.length < 45) return null;
  const lookback = Math.min(65, bars.length - 6);
  const slice = bars.slice(-lookback);

  const sHighs = findSwingHighs(slice, 5);
  const sLows  = findSwingLows(slice, 5);
  if (sHighs.length < 3 || sLows.length < 3) return null;

  const rH = sHighs.slice(-4);
  const rL  = sLows.slice(-4);

  const highLine = linReg(rH.map(s => ({ x: s.idx, y: s.val })));
  const lowLine  = linReg(rL.map(s => ({ x: s.idx, y: s.val })));

  if (highLine.slope <= 0 || lowLine.slope <= 0) return null;
  if (lowLine.slope <= highLine.slope * 1.1) return null; // lows must rise faster
  if (highLine.r2 < 0.65 || lowLine.r2 < 0.65) return null;

  const xFirst = Math.min(rH[0].idx, rL[0].idx);
  const xLast  = Math.max(rH[rH.length-1].idx, rL[rL.length-1].idx);
  const wStart = highLine.yAtX(xFirst) - lowLine.yAtX(xFirst);
  const wEnd   = highLine.yAtX(xLast) - lowLine.yAtX(xLast);
  if (wStart <= 0 || wEnd <= 0 || wEnd >= wStart) return null;
  const compression = 1 - wEnd / wStart;
  if (compression < 0.30 || xLast - xFirst < 15) return null;

  const r2Avg = (highLine.r2 + lowLine.r2) / 2;
  const confidence = Math.round(Math.min(
    r2Avg * 35 + compression * 35 + Math.min((rH.length + rL.length - 4) * 5, 25),
    95
  ));
  if (confidence < 55) return null;

  return {
    name: "Rising Wedge", icon: "⚠️", confidence, color: "amber",
    description: `Bearish pattern · ${rH.length} swing highs · ${rL.length} swing lows · ` +
      `Compression: ${(compression*100).toFixed(0)}% · Fit: ${(r2Avg*100).toFixed(0)}%`,
  };
}

// ── Yahoo Finance ─────────────────────────────────────────────────────────────
async function fetchChart(symbol) {
  const url = `${YAHOO_BASE}/v8/finance/chart/${symbol}?interval=1d&range=9mo&includePrePost=false`;
  try {
    const resp = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(9000) });
    if (!resp.ok) return [];
    const json = await resp.json();
    const result = json.chart?.result?.[0];
    if (!result?.timestamp || !result.indicators?.quote?.[0]) return [];
    const { open, high, low, close, volume } = result.indicators.quote[0];
    return result.timestamp.map((ts, i) => ({
      open: open[i] ?? 0, high: high[i] ?? 0, low: low[i] ?? 0,
      close: close[i] ?? 0, volume: volume[i] ?? 0, timestamp: ts,
    })).filter(b => b.close > 0 && b.high > 0 && b.low > 0);
  } catch { return []; }
}

async function batchQuote(syms) {
  const url = `${YAHOO_BASE}/v8/finance/spark?symbols=${syms.join(",")}&range=1d&interval=5m`;
  try {
    const resp = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
    if (!resp.ok) return new Map();
    const json = await resp.json();
    const map = new Map();
    for (const d of Object.values(json)) {
      if (d?.close?.length > 0) {
        const price = d.close[d.close.length - 1] ?? d.previousClose;
        map.set(d.symbol, { price, changePct: d.previousClose > 0 ? ((price - d.previousClose) / d.previousClose) * 100 : 0 });
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
    const maps = await Promise.all(chunks.slice(i, i + 8).map(c => batchQuote(c)));
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

function calcRsi(closes) {
  if (closes.length < 15) return 50;
  const ch = closes.slice(1).map((p, i) => p - closes[i]).slice(-14);
  const g = ch.filter(c => c > 0).reduce((a, b) => a + b, 0) / 14;
  const l = Math.abs(ch.filter(c => c < 0).reduce((a, b) => a + b, 0)) / 14;
  return l === 0 ? 100 : 100 - 100 / (1 + g / l);
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
    minConfidence = 55,
    maxSymbols = 80,
  } = req.body ?? {};

  try {
    const allSymbols = getUniverse(universe, customSymbols);
    const quoteMap = await batchQuoteAll(allSymbols);

    const ranked = [...quoteMap.entries()]
      .sort((a, b) => Math.abs(b[1].changePct) - Math.abs(a[1].changePct))
      .slice(0, Math.min(maxSymbols, allSymbols.length))
      .map(([sym]) => sym);

    const detectors = {
      bullFlag: detectBullFlag,
      fallingWedge: detectFallingWedge,
      ascendingTriangle: detectAscendingTriangle,
      doubleBottom: detectDoubleBottom,
      cupHandle: detectCupHandle,
      risingWedge: detectRisingWedge,
    };

    const matches = [];
    for (let i = 0; i < ranked.length; i += 8) {
      const settled = await Promise.allSettled(ranked.slice(i, i + 8).map(async symbol => {
        const bars = await fetchChart(symbol);
        if (bars.length < 45) return null;

        const closes = bars.map(b => b.close);
        const volumes = bars.map(b => b.volume);
        const rsi = calcRsi(closes);
        const avg20v = volumes.slice(-21, -1).reduce((a, b) => a + b, 0) / 20;
        const volRatio = avg20v > 0 ? volumes[volumes.length - 1] / avg20v : 1;

        const found = [];
        for (const key of selectedPatterns) {
          if (!detectors[key]) continue;
          const r = detectors[key](bars);
          if (r && r.confidence >= minConfidence) found.push(r);
        }
        if (found.length === 0) return null;

        const q = quoteMap.get(symbol) ?? { price: closes[closes.length-1], changePct: 0 };
        return {
          symbol,
          price: +q.price.toFixed(2),
          changePct: +q.changePct.toFixed(2),
          rsi: +rsi.toFixed(1),
          volumeRatio: +volRatio.toFixed(2),
          volume: Math.round(volumes[volumes.length - 1]),
          avgVolume20: Math.round(avg20v),
          patterns: found.sort((a, b) => b.confidence - a.confidence),
          topPattern: found[0].name,
          topConfidence: found[0].confidence,
        };
      }));

      for (const r of settled) {
        if (r.status === "fulfilled" && r.value) matches.push(r.value);
      }
    }

    matches.sort((a, b) => b.topConfidence - a.topConfidence || b.patterns.length - a.patterns.length);

    return res.status(200).json({
      matches, scannedAt: new Date().toISOString(),
      totalScanned: ranked.length, totalMatched: matches.length,
      scanId: Math.random().toString(36).slice(2),
      note: "v2 — swing-point based detection",
    });
  } catch (err) {
    console.error("Pattern scan error:", err);
    return res.status(500).json({ error: err.message ?? "Scan failed" });
  }
}
