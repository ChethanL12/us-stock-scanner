// Vercel Serverless: /api/scanner/pattern-scan — v3 (strict swing-point rules)

const YAHOO_BASE = "https://query1.finance.yahoo.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const SP500 = [
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
const NDX = [
  "AAPL","MSFT","NVDA","AMZN","META","TSLA","AVGO","GOOGL","GOOG","COST","NFLX","AMD","ADBE",
  "QCOM","TMUS","AMAT","AMGN","PEP","INTU","CMCSA","TXN","CSCO","BKNG","ADP","ISRG","HON",
  "VRTX","PANW","MU","REGN","GILD","MDLZ","KLAC","ADI","LRCX","INTC","SNPS","CEG","CDNS",
  "MCHP","FTNT","CSGP","MRNA","CRWD","MELI","KDP","CSX","PYPL","WDAY","DXCM","PCAR","ABNB",
  "NXPI","ORLY","IDXX","ROST","PAYX","ODFL","EXC","FAST","VRSK","TTD","GEHC","BIIB","ON",
  "DDOG","ZS","MNST","EA","FANG","TEAM","LULU","CHTR","ANSS","CPRT","CTAS","ROP","NDAQ",
  "COIN","HOOD",
];
const ALL = [...new Set([...SP500, ...NDX])];

// ── Math helpers ──────────────────────────────────────────────────────────────
function linReg(pts) {
  const n = pts.length;
  if (n < 2) return { slope: 0, intercept: pts[0]?.y ?? 0, r2: 0, at: x => pts[0]?.y ?? 0 };
  const xm = pts.reduce((s, p) => s + p.x, 0) / n;
  const ym = pts.reduce((s, p) => s + p.y, 0) / n;
  let num = 0, den = 0, tot = 0;
  for (const { x, y } of pts) { num += (x - xm) * (y - ym); den += (x - xm) ** 2; tot += (y - ym) ** 2; }
  const slope = den ? num / den : 0;
  const int   = ym - slope * xm;
  const res   = pts.reduce((s, { x, y }) => s + (y - (slope * x + int)) ** 2, 0);
  const r2    = tot > 0 ? Math.max(0, 1 - res / tot) : 0;
  return { slope, intercept: int, r2, at: x => slope * x + int };
}

// ── Swing pivot detection ─────────────────────────────────────────────────────
// window = bars required to be lower (for highs) / higher (for lows) on each side
function swingHighs(bars, window = 6) {
  const out = [];
  for (let i = window; i < bars.length - window; i++) {
    const h = bars[i].high;
    let ok = true;
    for (let j = i - window; j <= i + window; j++) { if (j !== i && bars[j].high >= h) { ok = false; break; } }
    if (ok) out.push({ idx: i, val: h });
  }
  return out;
}
function swingLows(bars, window = 6) {
  const out = [];
  for (let i = window; i < bars.length - window; i++) {
    const l = bars[i].low;
    let ok = true;
    for (let j = i - window; j <= i + window; j++) { if (j !== i && bars[j].low <= l) { ok = false; break; } }
    if (ok) out.push({ idx: i, val: l });
  }
  return out;
}

// Check every element is strictly less than the previous, with a minimum % drop
function isStrictlyDecreasing(arr, minPctDrop = 0) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].val >= arr[i - 1].val) return false;
    if (minPctDrop > 0 && (arr[i - 1].val - arr[i].val) / arr[i - 1].val * 100 < minPctDrop) return false;
  }
  return true;
}
// Check every element is strictly greater than the previous, with a minimum % rise
function isStrictlyIncreasing(arr, minPctRise = 0) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].val <= arr[i - 1].val) return false;
    if (minPctRise > 0 && (arr[i].val - arr[i - 1].val) / arr[i - 1].val * 100 < minPctRise) return false;
  }
  return true;
}

// ── Pattern detectors v3 ──────────────────────────────────────────────────────

/**
 * FALLING WEDGE
 * Rules (confirmed from TA literature):
 *  1. BOTH trendlines slope downward (both negative slopes)
 *  2. Upper trendline STEEPER (more negative) than lower trendline → they converge
 *  3. Each swing high STRICTLY LOWER than previous, by ≥1.5%  ← KEY FIX vs v1/v2
 *  4. Each swing low STRICTLY LOWER than previous, by ≥1.0%   ← KEY FIX vs v1/v2
 *  5. At least 3 swing highs AND 3 swing lows
 *  6. Trendline R² ≥ 0.75 on both lines
 *  7. Width compresses ≥ 30%
 *  8. Pattern spans 15–65 bars
 *  9. Most recent swing must be within last 18 bars (active, not historical)
 */
function detectFallingWedge(bars) {
  if (bars.length < 50) return null;
  const slice = bars.slice(-65);
  const n = slice.length;

  const sH = swingHighs(slice, 6);
  const sL  = swingLows(slice, 6);
  if (sH.length < 3 || sL.length < 3) return null;

  const rH = sH.slice(-4);   // up to 4 most recent swing highs
  const rL  = sL.slice(-4);

  // ① Each high must be strictly lower than the last by ≥1.5%
  if (!isStrictlyDecreasing(rH, 1.5)) return null;
  // ② Each low must be strictly lower than the last by ≥1.0%
  if (!isStrictlyDecreasing(rL, 1.0)) return null;

  const highLine = linReg(rH.map(s => ({ x: s.idx, y: s.val })));
  const lowLine  = linReg(rL.map(s => ({ x: s.idx, y: s.val })));

  // ③ Both trendlines must have negative slope
  if (highLine.slope >= 0 || lowLine.slope >= 0) return null;

  // ④ High line must fall faster (more negative) → lines CONVERGE
  if (highLine.slope >= lowLine.slope) return null;
  if (Math.abs(highLine.slope) < Math.abs(lowLine.slope) * 1.15) return null; // must be meaningfully steeper

  // ⑤ Trendline quality
  if (highLine.r2 < 0.75 || lowLine.r2 < 0.75) return null;

  // ⑥ Width compression
  const xFirst = Math.min(rH[0].idx, rL[0].idx);
  const xLast  = Math.max(rH[rH.length - 1].idx, rL[rL.length - 1].idx);
  const wStart = highLine.at(xFirst) - lowLine.at(xFirst);
  const wEnd   = highLine.at(xLast)  - lowLine.at(xLast);
  if (wStart <= 0 || wEnd <= 0 || wEnd >= wStart) return null;
  const compression = 1 - wEnd / wStart;
  if (compression < 0.30) return null;

  // ⑦ Duration
  const spanBars = xLast - xFirst;
  if (spanBars < 15 || spanBars > 65) return null;

  // ⑧ RECENCY: most recent swing must be within last 18 bars
  const lastSwing = Math.max(rH[rH.length - 1].idx, rL[rL.length - 1].idx);
  if (n - 1 - lastSwing > 18) return null;

  // ⑨ Price must be within the wedge or just above (not already far broken out)
  const lastClose = slice[n - 1].close;
  const curH = highLine.at(n - 1);
  const curL  = lowLine.at(n - 1);
  if (curH > curL && (lastClose - curL) / (curH - curL) > 1.3) return null;

  const r2Avg = (highLine.r2 + lowLine.r2) / 2;
  const confidence = Math.round(Math.min(
    r2Avg * 30 + compression * 35 + Math.min((rH.length + rL.length - 4) * 5, 20) + 10,
    95
  ));
  if (confidence < 57) return null;

  return {
    name: "Falling Wedge", icon: "📐", confidence, color: "violet",
    description: `${rH.length} strictly lower highs + ${rL.length} strictly lower lows · ` +
      `Compression: ${(compression * 100).toFixed(0)}% · Fit: ${(r2Avg * 100).toFixed(0)}% · ${spanBars} bars`,
  };
}

/**
 * BULL FLAG
 * Rules:
 *  1. Pole: sharp clean rally ≥10% in 5–15 bars (max intra-pole drawdown <6%)
 *  2. Flag: PARALLEL channel (slope difference between high/low lines < threshold)
 *  3. Flag slopes flat or slightly DOWN  (not up)
 *  4. Flag range ≤ 6% of price
 *  5. Retracement ≤ 50% of pole height
 *  6. Volume contracts ≥20% during flag vs pole
 *  7. Flag is the CURRENT most recent bars (inherent from loop placement)
 */
function detectBullFlag(bars) {
  if (bars.length < 30) return null;
  const N = bars.length;

  for (let flagLen = 5; flagLen <= 18; flagLen++) {
    for (let poleLen = 5; poleLen <= 15; poleLen++) {
      const needed = poleLen + flagLen + 3;
      if (N < needed) continue;

      const poleStart = N - needed;
      const poleEnd   = poleStart + poleLen;
      const poleBars  = bars.slice(poleStart, poleEnd);
      const flagBars  = bars.slice(poleEnd);

      const poleOpen  = poleBars[0].close;
      const poleClose = poleBars[poleBars.length - 1].close;
      const poleGain  = (poleClose - poleOpen) / poleOpen * 100;
      if (poleGain < 10) continue;

      // Pole must be clean (no close below 25% of pole range)
      const poleFloor = poleOpen + (poleClose - poleOpen) * 0.25;
      if (poleBars.some(b => b.close < poleFloor)) continue;

      // Intra-pole max drawdown < 6%
      let peak = poleOpen, maxDD = 0;
      for (const b of poleBars) {
        peak  = Math.max(peak, b.high);
        maxDD = Math.max(maxDD, (peak - b.low) / peak * 100);
      }
      if (maxDD > 6) continue;

      // Flag geometry
      const fHighs   = flagBars.map(b => b.high);
      const fLows    = flagBars.map(b => b.low);
      const fMax     = Math.max(...fHighs);
      const fMin     = Math.min(...fLows);
      const fRange   = (fMax - fMin) / fMax * 100;
      if (fRange > 6) continue;

      // Pullback ≤ 50%
      const poleH    = poleClose - poleOpen;
      const pullback = poleClose - Math.min(...flagBars.map(b => b.close));
      if (pullback > poleH * 0.50) continue;

      // PARALLEL CHANNEL: both line slopes within 0.4% of price per bar of each other
      const hReg = linReg(fHighs.map((h, i) => ({ x: i, y: h })));
      const lReg = linReg(fLows.map((l, i)  => ({ x: i, y: l })));
      const slopeDiff = Math.abs(hReg.slope - lReg.slope);
      if (slopeDiff > poleClose * 0.004) continue; // not parallel → not a flag

      // Both lines must be flat or slightly down (not trending up)
      const maxUpSlope = poleClose * 0.003;
      if (hReg.slope > maxUpSlope || lReg.slope > maxUpSlope) continue;

      // Volume contraction during flag
      const poleVol = poleBars.reduce((s, b) => s + b.volume, 0) / poleLen;
      const flagVol = flagBars.reduce((s, b) => s + b.volume, 0) / flagLen;
      const volOK   = flagVol < poleVol * 0.80;

      const gainScore = Math.min(poleGain * 2.5, 40);
      const tightScore = Math.max(0, (6 - fRange) * 5);
      const volScore  = volOK ? 20 : 5;
      const pbScore   = Math.max(0, (0.50 - pullback / poleH) * 20);

      const confidence = Math.round(Math.min(gainScore + tightScore + volScore + pbScore, 95));
      if (confidence < 57) continue;

      return {
        name: "Bull Flag", icon: "🏳️", confidence, color: "emerald",
        description: `Pole: +${poleGain.toFixed(1)}% (${poleLen} bars) · ` +
          `Flag range: ${fRange.toFixed(1)}% · Pullback: ${(pullback / poleH * 100).toFixed(0)}% of pole · ` +
          `Vol: ${volOK ? "contracting ✓" : "not contracting"}`,
      };
    }
  }
  return null;
}

/**
 * ASCENDING TRIANGLE
 * Rules:
 *  1. Flat resistance: ≥3 swing highs all within 2% of each other
 *  2. Rising support:  ≥3 swing lows, EACH STRICTLY HIGHER than previous by ≥0.5%
 *  3. Regression of lows: positive slope, R² ≥ 0.70
 *  4. Pattern spans ≥ 20 bars
 *  5. Current price between 93%–103% of resistance (approaching breakout zone)
 *  6. Most recent swing within last 15 bars
 */
function detectAscendingTriangle(bars) {
  if (bars.length < 45) return null;
  const slice = bars.slice(-70);
  const n = slice.length;

  const sH = swingHighs(slice, 4);
  const sL  = swingLows(slice, 4);
  if (sH.length < 3 || sL.length < 3) return null;

  const rH = sH.slice(-5);
  const rL  = sL.slice(-5);

  // ① Flat resistance: all highs within 2%
  const maxH   = Math.max(...rH.map(s => s.val));
  const minH   = Math.min(...rH.map(s => s.val));
  const spread = (maxH - minH) / maxH * 100;
  if (spread > 2.0) return null;

  // ② Strictly increasing lows, each ≥0.5% above previous
  if (!isStrictlyIncreasing(rL, 0.5)) return null;

  const lowLine = linReg(rL.map(s => ({ x: s.idx, y: s.val })));
  if (lowLine.slope <= 0 || lowLine.r2 < 0.70) return null;

  // ③ Pattern span ≥ 20 bars
  const xFirst = Math.min(rH[0].idx, rL[0].idx);
  const xLast  = Math.max(rH[rH.length - 1].idx, rL[rL.length - 1].idx);
  if (xLast - xFirst < 20) return null;

  // ④ Recency: most recent swing within last 15 bars
  if (n - 1 - xLast > 15) return null;

  // ⑤ Current price approaching resistance (93%–103%)
  const lastClose = slice[n - 1].close;
  const nearness  = lastClose / maxH;
  if (nearness < 0.93 || nearness > 1.03) return null;

  const flatScore  = Math.round((2.0 - spread) / 2.0 * 40);
  const slopeScore = Math.round(Math.min(lowLine.r2 * 30, 30));
  const nearScore  = nearness > 0.98 ? 25 : nearness > 0.95 ? 15 : 8;

  const confidence = Math.min(flatScore + slopeScore + nearScore, 95);
  if (confidence < 57) return null;

  return {
    name: "Ascending Triangle", icon: "🔺", confidence, color: "sky",
    description: `Resistance: $${minH.toFixed(2)}–$${maxH.toFixed(2)} (${spread.toFixed(1)}% spread) · ` +
      `${rL.length} rising lows (R²=${(lowLine.r2 * 100).toFixed(0)}%) · ` +
      `Price at ${(nearness * 100).toFixed(1)}% of resistance`,
  };
}

/**
 * DOUBLE BOTTOM
 * Rules:
 *  1. Prior downtrend: avg price 20 bars before L1 must be ≥12% above L1
 *  2. Two prominent swing lows within 2.5% of each other
 *  3. Second low ≥ first low × 0.975 (second not below first)
 *  4. Separated by 15–55 bars
 *  5. Neckline (highest high between bottoms) ≥8% above the lows
 *  6. L2 WITHIN LAST 25 BARS  ← KEY FIX that eliminates historical patterns
 *  7. Current price ≥55% recovered from L2 toward neckline (or above it)
 */
function detectDoubleBottom(bars) {
  if (bars.length < 50) return null;
  const slice = bars.slice(-85);
  const n = slice.length;

  const sL = swingLows(slice, 7);    // window=7 → only prominent lows
  const sH = swingHighs(slice, 4);
  if (sL.length < 2 || sH.length < 1) return null;

  const recentL = sL.slice(-6);

  for (let i = 0; i < recentL.length - 1; i++) {
    for (let j = i + 1; j < recentL.length; j++) {
      const L1 = recentL[i], L2 = recentL[j];

      // ① Separation 15–55 bars
      const sep = L2.idx - L1.idx;
      if (sep < 15 || sep > 55) continue;

      // ② RECENCY: L2 must be within last 25 bars ← THE KEY FIX
      if (n - 1 - L2.idx > 25) continue;

      // ③ Within 2.5% of each other
      const diff = Math.abs(L1.val - L2.val) / L1.val * 100;
      if (diff > 2.5) continue;

      // ④ L2 not below L1 (if L2 lower, bearish momentum not exhausted)
      if (L2.val < L1.val * 0.975) continue;

      // ⑤ Prior downtrend before L1
      const preStart = Math.max(0, L1.idx - 30);
      const preEnd   = Math.max(0, L1.idx - 5);
      if (preEnd <= preStart) continue;
      const preAvg = slice.slice(preStart, preEnd).reduce((s, b) => s + b.close, 0) / (preEnd - preStart);
      const drawdownPct = (preAvg - L1.val) / preAvg * 100;
      if (drawdownPct < 10) continue; // must have been a real downtrend into L1

      // ⑥ Neckline = highest swing high strictly between L1 and L2
      const between = sH.filter(h => h.idx > L1.idx && h.idx < L2.idx);
      if (between.length === 0) continue;
      const neckline = Math.max(...between.map(h => h.val));
      const lift     = (neckline - L1.val) / L1.val * 100;
      if (lift < 8) continue;

      // ⑦ Current price recovery
      const lastClose = slice[n - 1].close;
      const aboveNeck = lastClose > neckline;
      const recovery  = Math.min(((lastClose - L2.val) / (neckline - L2.val)) * 100, 120);
      if (recovery < 55) continue;

      const symScore  = Math.round((2.5 - diff) / 2.5 * 35);
      const neckScore = Math.round(Math.min(lift * 2, 30));
      const recScore  = aboveNeck ? 30 : Math.round(Math.min(recovery * 0.27, 26));
      const confidence = Math.min(symScore + neckScore + recScore, 95);
      if (confidence < 57) continue;

      return {
        name: "Double Bottom", icon: "🔁", confidence, color: "cyan",
        description: `Lows: $${L1.val.toFixed(2)} & $${L2.val.toFixed(2)} (${diff.toFixed(1)}% apart) · ` +
          `Neckline: $${neckline.toFixed(2)} (+${lift.toFixed(1)}%) · ` +
          (aboveNeck ? "✓ Confirmed — above neckline" : `Recovery: ${recovery.toFixed(0)}%`) +
          ` · Prior decline: ${drawdownPct.toFixed(0)}%`,
      };
    }
  }
  return null;
}

/**
 * CUP & HANDLE
 * Rules:
 *  1. Left rim must be a high point: formed by price DECLINING into cup (not flat start)
 *  2. Cup depth ≥12% from rim to bottom
 *  3. U-shaped base (NOT V): mid-section range < 55% of total depth
 *  4. Both rims within 5% of each other
 *  5. Handle: slight downward channel, range <10%, stays above 50% of cup, drop <8% below rim
 *  6. Current price 95%–108% of right rim (approaching breakout)
 */
function detectCupHandle(bars) {
  if (bars.length < 60) return null;
  const lookback = Math.min(90, bars.length - 6);
  const slice    = bars.slice(-lookback);
  const n        = slice.length;

  const cupLen   = Math.floor(n * 0.70);
  const cupSlice = slice.slice(0, cupLen);
  const hndSlice = slice.slice(cupLen);
  if (cupLen < 25 || hndSlice.length < 5) return null;

  // Left rim: max close in first 15% of cup
  const leftW   = Math.max(3, Math.ceil(cupLen * 0.15));
  const leftRim = Math.max(...cupSlice.slice(0, leftW).map(b => b.close));

  // Right rim: max close in last 15% of cup
  const rightW   = Math.max(3, Math.ceil(cupLen * 0.15));
  const rightRim = Math.max(...cupSlice.slice(-rightW).map(b => b.close));

  // Rims within 5%
  const rimDiff = Math.abs(leftRim - rightRim) / leftRim * 100;
  if (rimDiff > 5) return null;

  const rimLevel = (leftRim + rightRim) / 2;

  // Cup bottom = min low in middle 40%
  const midS   = Math.floor(cupLen * 0.30);
  const midE   = Math.floor(cupLen * 0.70);
  const midSlc = cupSlice.slice(midS, midE);
  const cupBot = Math.min(...midSlc.map(b => b.low));
  const depth  = (rimLevel - cupBot) / rimLevel * 100;
  if (depth < 12) return null;

  // U-shape: mid-section high-low range must be < 55% of depth
  const midH     = Math.max(...midSlc.map(b => b.high));
  const midRange = (midH - cupBot) / rimLevel * 100;
  if (midRange > depth * 0.55) return null; // V-shaped → reject

  // Confirm left side had prior high (left rim is meaningfully higher than mid prices)
  const leftAvg = cupSlice.slice(0, leftW).reduce((s, b) => s + b.close, 0) / leftW;
  const midAvg  = midSlc.reduce((s, b) => s + b.close, 0) / midSlc.length;
  if (midAvg > leftAvg * 0.88) return null; // cup bottom is not deep enough relative to rim

  // Handle: flat or slightly down, not spiking above rim, not falling too far
  const hndH   = Math.max(...hndSlice.map(b => b.high));
  const hndL   = Math.min(...hndSlice.map(b => b.low));
  const hndRng = (hndH - hndL) / hndH * 100;
  if (hndRng > 10) return null;

  // Handle stays above mid-cup price
  const cupMidPrice = (rimLevel + cupBot) / 2;
  if (hndL < cupMidPrice) return null;

  // Handle drop from right rim < 8%
  const hndDrop = (rightRim - hndL) / rightRim * 100;
  if (hndDrop > 8) return null;

  // Handle not sloping up
  const hndReg = linReg(hndSlice.map((b, i) => ({ x: i, y: b.high })));
  if (hndReg.slope > rightRim * 0.003) return null;

  // Price near rim
  const lastClose = slice[n - 1].close;
  const nearRim   = lastClose / rightRim;
  if (nearRim < 0.95 || nearRim > 1.08) return null;

  const symScore  = Math.round((5 - rimDiff) / 5 * 30);
  const depScore  = Math.round(Math.min(depth * 1.5, 30));
  const hndScore  = Math.round((10 - hndRng) * 2.5);
  const rimScore  = nearRim > 1.0 ? 15 : nearRim > 0.97 ? 10 : 5;

  const confidence = Math.min(symScore + depScore + hndScore + rimScore, 95);
  if (confidence < 57) return null;

  return {
    name: "Cup & Handle", icon: "☕", confidence, color: "orange",
    description: `Cup depth: ${depth.toFixed(1)}% · Rim match: ${(100 - rimDiff).toFixed(0)}% · ` +
      `Handle: ${hndRng.toFixed(1)}% range · Price at ${(nearRim * 100).toFixed(0)}% of rim`,
  };
}

/**
 * RISING WEDGE (bearish)
 * Mirror of Falling Wedge:
 *  1. Each swing high STRICTLY HIGHER than previous by ≥1.5%
 *  2. Each swing low STRICTLY HIGHER than previous by ≥1.0%
 *  3. Lower trendline rises FASTER (steeper positive slope) than upper → convergence
 *  4. R² ≥ 0.75 both, compression ≥30%, span 15–65 bars, recency ≤18 bars
 */
function detectRisingWedge(bars) {
  if (bars.length < 50) return null;
  const slice = bars.slice(-65);
  const n = slice.length;

  const sH = swingHighs(slice, 6);
  const sL  = swingLows(slice, 6);
  if (sH.length < 3 || sL.length < 3) return null;

  const rH = sH.slice(-4);
  const rL  = sL.slice(-4);

  if (!isStrictlyIncreasing(rH, 1.5)) return null;
  if (!isStrictlyIncreasing(rL, 1.0)) return null;

  const highLine = linReg(rH.map(s => ({ x: s.idx, y: s.val })));
  const lowLine  = linReg(rL.map(s => ({ x: s.idx, y: s.val })));

  if (highLine.slope <= 0 || lowLine.slope <= 0) return null;
  if (lowLine.slope <= highLine.slope * 1.15) return null; // low line must be meaningfully steeper
  if (highLine.r2 < 0.75 || lowLine.r2 < 0.75) return null;

  const xFirst = Math.min(rH[0].idx, rL[0].idx);
  const xLast  = Math.max(rH[rH.length - 1].idx, rL[rL.length - 1].idx);
  const wStart = highLine.at(xFirst) - lowLine.at(xFirst);
  const wEnd   = highLine.at(xLast)  - lowLine.at(xLast);
  if (wStart <= 0 || wEnd <= 0 || wEnd >= wStart) return null;
  const compression = 1 - wEnd / wStart;
  if (compression < 0.30 || xLast - xFirst < 15) return null;

  const lastSwing = Math.max(rH[rH.length - 1].idx, rL[rL.length - 1].idx);
  if (n - 1 - lastSwing > 18) return null;

  const r2Avg = (highLine.r2 + lowLine.r2) / 2;
  const confidence = Math.round(Math.min(
    r2Avg * 30 + compression * 35 + Math.min((rH.length + rL.length - 4) * 5, 20) + 10, 95
  ));
  if (confidence < 57) return null;

  return {
    name: "Rising Wedge", icon: "⚠️", confidence, color: "amber",
    description: `Bearish · ${rH.length} strictly higher highs + ${rL.length} strictly higher lows · ` +
      `Compression: ${(compression * 100).toFixed(0)}% · Fit: ${(r2Avg * 100).toFixed(0)}%`,
  };
}

// ── Yahoo Finance data ────────────────────────────────────────────────────────
async function fetchChart(symbol) {
  const url = `${YAHOO_BASE}/v8/finance/chart/${symbol}?interval=1d&range=9mo&includePrePost=false`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(9000) });
    if (!r.ok) return [];
    const j = await r.json();
    const res = j.chart?.result?.[0];
    if (!res?.timestamp || !res.indicators?.quote?.[0]) return [];
    const { open, high, low, close, volume } = res.indicators.quote[0];
    return res.timestamp.map((ts, i) => ({
      open: open[i] ?? 0, high: high[i] ?? 0, low: low[i] ?? 0,
      close: close[i] ?? 0, volume: volume[i] ?? 0,
    })).filter(b => b.close > 0 && b.high > 0 && b.low > 0);
  } catch { return []; }
}

async function batchQuote(syms) {
  const url = `${YAHOO_BASE}/v8/finance/spark?symbols=${syms.join(",")}&range=1d&interval=5m`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
    if (!r.ok) return new Map();
    const j = await r.json();
    const map = new Map();
    for (const d of Object.values(j)) {
      if (d?.close?.length > 0) {
        const price = d.close[d.close.length - 1] ?? d.previousClose ?? 0;
        map.set(d.symbol, {
          price,
          changePct: d.previousClose > 0 ? (price - d.previousClose) / d.previousClose * 100 : 0,
        });
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
    const maps = await Promise.all(chunks.slice(i, i + 8).map(batchQuote));
    for (const m of maps) for (const [k, v] of m) all.set(k, v);
    if (i + 8 < chunks.length) await new Promise(r => setTimeout(r, 150));
  }
  return all;
}

function universe(u, custom) {
  if (u === "sp500") return SP500;
  if (u === "nasdaq100") return NDX;
  if (u === "custom") return custom.length ? custom : NDX;
  return ALL;
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
    universe: u  = "sp500_nasdaq100",
    symbols: sym = [],
    patterns: sel = ["bullFlag","fallingWedge","ascendingTriangle","doubleBottom","cupHandle","risingWedge"],
    minConfidence = 57,
    maxSymbols    = 80,
  } = req.body ?? {};

  try {
    const syms  = universe(u, sym);
    const qmap  = await batchQuoteAll(syms);
    const ranked = [...qmap.entries()]
      .sort((a, b) => Math.abs(b[1].changePct) - Math.abs(a[1].changePct))
      .slice(0, Math.min(maxSymbols, syms.length))
      .map(([s]) => s);

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
        if (bars.length < 50) return null;
        const closes  = bars.map(b => b.close);
        const volumes = bars.map(b => b.volume);
        const rsi  = calcRsi(closes);
        const avg20 = volumes.slice(-21, -1).reduce((a, b) => a + b, 0) / 20;
        const volRatio = avg20 > 0 ? volumes[volumes.length - 1] / avg20 : 1;

        const found = [];
        for (const key of sel) {
          if (!detectors[key]) continue;
          try {
            const r = detectors[key](bars);
            if (r && r.confidence >= minConfidence) found.push(r);
          } catch { /* skip */ }
        }
        if (!found.length) return null;

        const q = qmap.get(symbol) ?? { price: closes[closes.length - 1], changePct: 0 };
        return {
          symbol,
          price: +q.price.toFixed(2),
          changePct: +q.changePct.toFixed(2),
          rsi: +rsi.toFixed(1),
          volumeRatio: +volRatio.toFixed(2),
          volume: Math.round(volumes[volumes.length - 1]),
          avgVolume20: Math.round(avg20),
          patterns: found.sort((a, b) => b.confidence - a.confidence),
          topPattern: found[0].name,
          topConfidence: found[0].confidence,
        };
      }));
      for (const r of settled) if (r.status === "fulfilled" && r.value) matches.push(r.value);
    }

    matches.sort((a, b) => b.topConfidence - a.topConfidence || b.patterns.length - a.patterns.length);

    return res.status(200).json({
      matches,
      scannedAt: new Date().toISOString(),
      totalScanned: ranked.length,
      totalMatched: matches.length,
      scanId: Math.random().toString(36).slice(2),
      version: "v3-strict",
    });
  } catch (err) {
    console.error("pattern-scan error:", err);
    return res.status(500).json({ error: err.message ?? "Scan failed" });
  }
}
