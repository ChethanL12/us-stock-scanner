import { useState, useCallback } from "react";
import { useAddToWatchlist, getGetWatchlistQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

type Universe = "sp500" | "nasdaq100" | "sp500_nasdaq100" | "custom";

interface Signals {
  closeAboveEma20: boolean;
  ema20AboveEma50: boolean;
  rsiAbove50: boolean;
  volumeAboveAvg: boolean;
  nearHighestHigh: boolean;
  greenCandle: boolean;
}

interface BreakoutCandidate {
  symbol: string;
  name: string;
  price: number;
  open: number;
  change: number;
  changePct: number;
  volume: number;
  avgVolume20: number;
  volumeRatio: number;
  rsi: number;
  ema20: number;
  ema50: number;
  highestHigh20: number;
  nearHighPct: number;
  signals: Signals;
  signalCount: number;
  convictionScore: number;
  signalDetails: string[];
}

interface ScanResult {
  candidates: BreakoutCandidate[];
  scannedAt: string;
  totalScanned: number;
  totalPassed: number;
  scanId: string;
}

const UNIVERSE_LABELS: Record<Universe, string> = {
  sp500: "S&P 500",
  nasdaq100: "NASDAQ-100",
  sp500_nasdaq100: "S&P 500 + NDX",
  custom: "Custom",
};

const DEFAULT_CUSTOM = "SPY, QQQ, AAPL, TSLA, NVDA, AMD, META, AMZN, MSFT, GOOGL, NFLX, COIN, PLTR, SOFI, NIO, UBER, SHOP, HOOD, RIVN, MARA";

const SIGNAL_KEYS: (keyof Signals)[] = [
  "closeAboveEma20", "ema20AboveEma50", "rsiAbove50", "volumeAboveAvg", "nearHighestHigh", "greenCandle",
];

const SIGNAL_DISPLAY: Record<keyof Signals, string> = {
  closeAboveEma20: "Close > EMA20",
  ema20AboveEma50: "EMA20 > EMA50",
  rsiAbove50: "RSI ≥ 50",
  volumeAboveAvg: "Vol ≥ AvgVol",
  nearHighestHigh: "Near 20D High",
  greenCandle: "Green Candle",
};

function formatVolume(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toString();
}

function ConvictionBar({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div style={{ width: `${score}%`, backgroundColor: color }} className="h-full rounded-full transition-all" />
      </div>
      <span style={{ color }} className="text-xs font-bold tabular-nums w-8 text-right">{score}</span>
    </div>
  );
}

function SignalDots({ signals, signalCount }: { signals: Signals; signalCount: number }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {SIGNAL_KEYS.map(key => (
        <span
          key={key}
          title={SIGNAL_DISPLAY[key]}
          className={`w-2.5 h-2.5 rounded-full inline-block ${signals[key] ? "bg-blue-400" : "bg-gray-700"}`}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">{signalCount}/6</span>
    </div>
  );
}

function CandidateRow({ c, rank, onAddWatchlist }: {
  c: BreakoutCandidate;
  rank: number;
  onAddWatchlist: (s: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isGreen = c.changePct >= 0;

  return (
    <>
      <tr
        className="border-b border-gray-800 hover:bg-gray-800/40 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
        data-testid={`row-candidate-${c.symbol}`}
      >
        <td className="px-3 py-3 text-gray-500 text-xs tabular-nums w-8">{rank}</td>
        <td className="px-3 py-3">
          <div className="font-bold text-white text-sm" data-testid={`text-symbol-${c.symbol}`}>{c.symbol}</div>
          <div className="text-xs text-gray-400 truncate max-w-[140px]">{c.name}</div>
        </td>
        <td className="px-3 py-3 tabular-nums text-right">
          <div className="text-white text-sm font-medium" data-testid={`text-price-${c.symbol}`}>${c.price.toFixed(2)}</div>
          <div className={`text-xs font-medium ${isGreen ? "text-green-400" : "text-red-400"}`}>
            {isGreen ? "+" : ""}{c.changePct.toFixed(2)}%
          </div>
        </td>
        <td className="px-3 py-3 tabular-nums text-right">
          <div className={`text-sm font-medium ${c.rsi < 35 ? "text-green-400" : c.rsi > 70 ? "text-red-400" : "text-gray-300"}`} data-testid="text-rsi">
            {c.rsi.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">{c.rsi < 35 ? "OS" : c.rsi > 70 ? "OB" : "RSI"}</div>
        </td>
        <td className="px-3 py-3 tabular-nums text-right">
          <div className={`text-sm font-medium ${c.volumeRatio >= 1.5 ? "text-yellow-400" : "text-gray-300"}`} data-testid="text-rel-vol">
            {c.volumeRatio.toFixed(1)}x
          </div>
          <div className="text-xs text-gray-500">{formatVolume(c.volume)}</div>
        </td>
        <td className="px-3 py-3 text-right w-8">
          <div className="text-xs text-gray-400">{expanded ? "▲" : "▼"}</div>
        </td>
        <td className="px-3 py-3 min-w-[180px]">
          <ConvictionBar score={c.convictionScore} />
          <div className="mt-1.5">
            <SignalDots signals={c.signals} signalCount={c.signalCount} />
          </div>
        </td>
        <td className="px-3 py-3 text-center">
          <button
            onClick={e => { e.stopPropagation(); onAddWatchlist(c.symbol); }}
            title="Add to watchlist"
            className="text-gray-600 hover:text-blue-400 transition-colors text-base"
            data-testid={`button-add-watchlist-${c.symbol}`}
          >
            +
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-800 bg-gray-900/60">
          <td colSpan={8} className="px-4 py-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-xs mb-3">
              <div>
                <span className="text-gray-500">Open</span>
                <span className="ml-2 text-gray-200">${c.open.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">EMA20</span>
                <span className="ml-2 text-gray-200">${c.ema20.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">EMA50</span>
                <span className="ml-2 text-gray-200">${c.ema50.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">20D High</span>
                <span className="ml-2 text-gray-200">${c.highestHigh20.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">From High</span>
                <span className={`ml-2 ${c.nearHighPct >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {c.nearHighPct >= 0 ? "+" : ""}{c.nearHighPct.toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Avg Vol (20D)</span>
                <span className="ml-2 text-gray-200">{formatVolume(c.avgVolume20)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {c.signalDetails.map((d, i) => {
                const isPositive = SIGNAL_KEYS[i] !== undefined && c.signals[SIGNAL_KEYS[i]];
                return (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${
                      isPositive
                        ? "bg-blue-950 border-blue-800 text-blue-300"
                        : "bg-gray-800 border-gray-700 text-gray-400"
                    }`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ScannerPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const addToWatchlist = useAddToWatchlist();

  const [universe, setUniverse] = useState<Universe>("sp500_nasdaq100");
  const [customSymbols, setCustomSymbols] = useState(DEFAULT_CUSTOM);
  const [minSignals, setMinSignals] = useState(4);
  const [minConviction, setMinConviction] = useState(60);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const handleScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    const t0 = Date.now();

    try {
      const symbols = universe === "custom"
        ? customSymbols.split(/[\s,]+/).map(s => s.trim().toUpperCase()).filter(Boolean)
        : [];

      const resp = await fetch("/api/scanner/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbols,
          universe,
          maxDeepAnalysis: 80,
          filters: {},
          minSignals,
          minConviction,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error((err as { error?: string }).error || "Scan failed");
      }

      const data = await resp.json() as ScanResult;
      setResult(data);
      setElapsed(Date.now() - t0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [universe, customSymbols, minSignals, minConviction]);

  function exportToExcel() {
    if (!result) return;
    const rows = result.candidates.map((c, i) => ({
      Rank: i + 1,
      Symbol: c.symbol,
      Name: c.name,
      "Price (USD)": c.price,
      "Change %": c.changePct,
      RSI: c.rsi,
      EMA20: c.ema20,
      EMA50: c.ema50,
      "20D High": c.highestHigh20,
      "From High %": c.nearHighPct,
      Volume: c.volume,
      "Avg Vol (20D)": c.avgVolume20,
      "Vol Ratio": c.volumeRatio,
      "Signal Count": c.signalCount,
      "Conviction Score": c.convictionScore,
      "Close > EMA20": c.signals.closeAboveEma20 ? "Yes" : "No",
      "EMA20 > EMA50": c.signals.ema20AboveEma50 ? "Yes" : "No",
      "RSI ≥ 50": c.signals.rsiAbove50 ? "Yes" : "No",
      "Vol ≥ Avg": c.signals.volumeAboveAvg ? "Yes" : "No",
      "Near 20D High": c.signals.nearHighestHigh ? "Yes" : "No",
      "Green Candle": c.signals.greenCandle ? "Yes" : "No",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 10 }, { wch: 28 }, { wch: 12 }, { wch: 10 },
      { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 13 }, { wch: 16 },
      { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 11 }, { wch: 14 }, { wch: 14 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "US Breakout Scan");
    const dateStr = new Date(result.scannedAt).toISOString().slice(0, 10);
    XLSX.writeFile(wb, `US_Breakout_Scan_${dateStr}.xlsx`);
  }

  function handleAddWatchlist(symbol: string) {
    addToWatchlist.mutate({ data: { symbol, notes: null } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWatchlistQueryKey() });
        toast({ title: `${symbol} added to watchlist` });
      },
      onError: () => {
        toast({ title: "Failed to add to watchlist", variant: "destructive" });
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-0">
          {/* Universe */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Universe</label>
            <div className="flex gap-1 flex-wrap">
              {(["sp500_nasdaq100", "sp500", "nasdaq100", "custom"] as Universe[]).map(u => (
                <button
                  key={u}
                  onClick={() => setUniverse(u)}
                  data-testid={`button-universe-${u}`}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    universe === u
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {UNIVERSE_LABELS[u]}
                </button>
              ))}
            </div>
          </div>

          {/* Min Signals */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Min Signals (of 6)</label>
            <div className="flex gap-1">
              {[3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  onClick={() => setMinSignals(n)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    minSignals === n
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          {/* Min Conviction */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Min Conviction Score</label>
            <div className="flex gap-1">
              {[50, 60, 70, 80].map(n => (
                <button
                  key={n}
                  onClick={() => setMinConviction(n)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    minConviction === n
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Scan button */}
          <div className="flex items-end">
            <button
              onClick={handleScan}
              disabled={loading}
              data-testid="button-run-scan"
              className={`w-full px-4 py-2 rounded text-sm font-bold border transition-all ${
                loading
                  ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 border-blue-500 text-white cursor-pointer"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Scanning...
                </span>
              ) : (
                "▶ Run Scan"
              )}
            </button>
          </div>
        </div>

        {/* Custom symbols */}
        {universe === "custom" && (
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">Custom Symbols (comma separated)</label>
            <textarea
              value={customSymbols}
              onChange={e => setCustomSymbols(e.target.value)}
              rows={2}
              data-testid="input-custom-symbols"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-600 resize-none font-mono"
            />
          </div>
        )}
      </div>

      {/* Signals legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-400">Signals:</span>
        {SIGNAL_KEYS.map(key => (
          <span key={key} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
            {SIGNAL_DISPLAY[key]}
          </span>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/60 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-10 text-center" data-testid="state-loading">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-gray-400 text-sm">Batch quoting {UNIVERSE_LABELS[universe]} · Running breakout analysis...</p>
            <p className="text-gray-600 text-xs">30–90 seconds for full index scans</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-gray-400" data-testid="text-scan-summary">
            <span>
              <span className="text-white font-medium">{result.totalPassed}</span> breakout candidates
            </span>
            <span>·</span>
            <span>{result.totalScanned} scanned</span>
            <span>·</span>
            <span>{UNIVERSE_LABELS[universe]}</span>
            {elapsed && (
              <>
                <span>·</span>
                <span>{(elapsed / 1000).toFixed(1)}s</span>
              </>
            )}
            <span>·</span>
            <span className="text-gray-600">
              {new Date(result.scannedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            {result.candidates.length > 0 && (
              <button
                onClick={exportToExcel}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border bg-green-950 border-green-800 text-green-300 hover:bg-green-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Excel
              </button>
            )}
          </div>

          {result.candidates.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-400 text-sm">No breakout candidates matched the current filters.</p>
              <p className="text-gray-600 text-xs mt-1">Try lowering Min Signals or Min Conviction Score.</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden" data-testid="table-results">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-xs">
                      <th className="px-3 py-2 text-left w-8">#</th>
                      <th className="px-3 py-2 text-left">Symbol</th>
                      <th className="px-3 py-2 text-right">Price / Change</th>
                      <th className="px-3 py-2 text-right">RSI</th>
                      <th className="px-3 py-2 text-right">Vol Ratio</th>
                      <th className="px-3 py-2 w-8" />
                      <th className="px-3 py-2 text-left min-w-[180px]">Conviction / Signals</th>
                      <th className="px-3 py-2 text-center w-10">+W</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.candidates.map((c, i) => (
                      <CandidateRow key={c.symbol} c={c} rank={i + 1} onAddWatchlist={handleAddWatchlist} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial state */}
      {!result && !loading && !error && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center" data-testid="state-empty">
          <div className="text-4xl mb-3">📡</div>
          <p className="text-gray-400 text-sm font-medium">Ready to scan US equities for breakout patterns</p>
          <p className="text-gray-600 text-xs mt-1 mb-4">Select universe and click Run Scan</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
            {[
              { icon: "📈", label: "Close > EMA20", desc: "Price above 20-day EMA" },
              { icon: "⬆️", label: "EMA20 > EMA50", desc: "Uptrend alignment" },
              { icon: "💪", label: "RSI ≥ 50", desc: "Bullish momentum" },
              { icon: "🔊", label: "Volume ≥ Avg", desc: "Above 20-day avg volume" },
              { icon: "🎯", label: "Near 20D High", desc: "Within 2% of recent high" },
              { icon: "🟢", label: "Green Candle", desc: "Close > Open today" },
            ].map(item => (
              <div key={item.label} className="bg-gray-800/60 rounded p-2.5">
                <div className="text-base mb-0.5">{item.icon}</div>
                <div className="text-xs font-medium text-gray-200">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
