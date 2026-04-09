import { useGetScanHistory } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, TrendingUp } from "lucide-react";

export default function HistoryPage() {
  const { data: history, isLoading } = useGetScanHistory();

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Scan History
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Past pre-market scan runs</p>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : !history || history.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground" data-testid="state-history-empty">
            <Clock className="w-7 h-7 mx-auto mb-2 opacity-40" />
            <div className="text-sm">No scan history yet</div>
            <div className="text-xs mt-1">Run a scan on the Scanner page to get started</div>
          </div>
        ) : (
          <table className="w-full" data-testid="table-history">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Date / Time</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">Scanned</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">Passed</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">Pass Rate</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Top Picks</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => {
                const passRate = entry.totalScanned > 0 ? Math.round((entry.totalPassed / entry.totalScanned) * 100) : 0;
                return (
                  <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors" data-testid={`row-history-${entry.id}`}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-mono">{new Date(entry.scannedAt).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">{new Date(entry.scannedAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm">{entry.totalScanned}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-sm text-primary">{entry.totalPassed}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={passRate >= 50 ? "text-green-400 text-sm font-mono" : "text-amber-400 text-sm font-mono"}>{passRate}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1" data-testid={`text-top-symbols-${entry.id}`}>
                        {entry.topSymbols.length > 0 ? (
                          entry.topSymbols.map(sym => (
                            <Badge key={sym} variant="outline" className="font-mono text-xs text-primary border-primary/30">{sym}</Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
