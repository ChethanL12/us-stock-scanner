import { useState } from "react";
import { useGetWatchlist, useRemoveFromWatchlist, useAddToWatchlist, getGetWatchlistQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { List, Plus, Trash2, Loader2 } from "lucide-react";

export default function WatchlistPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: watchlist, isLoading } = useGetWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const [newSymbol, setNewSymbol] = useState("");
  const [notes, setNotes] = useState("");

  function handleAdd() {
    if (!newSymbol.trim()) return;
    addToWatchlist.mutate({ data: { symbol: newSymbol.toUpperCase().trim(), notes: notes.trim() || null } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWatchlistQueryKey() });
        setNewSymbol("");
        setNotes("");
        toast({ title: `${newSymbol.toUpperCase()} added to watchlist` });
      },
      onError: () => toast({ title: "Failed to add symbol", variant: "destructive" }),
    });
  }

  function handleRemove(symbol: string) {
    removeFromWatchlist.mutate({ symbol }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWatchlistQueryKey() });
        toast({ title: `${symbol} removed` });
      },
      onError: () => toast({ title: "Failed to remove symbol", variant: "destructive" }),
    });
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <List className="w-5 h-5 text-primary" />
          Watchlist
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Track symbols for your pre-market routine</p>
      </div>

      {/* Add symbol */}
      <div className="border border-border rounded-lg bg-card p-4 space-y-3">
        <div className="text-xs font-medium text-muted-foreground">Add Symbol</div>
        <div className="flex gap-2">
          <Input
            value={newSymbol}
            onChange={e => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="AAPL"
            className="font-mono text-sm bg-secondary border-border h-9 w-32"
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            data-testid="input-new-symbol"
          />
          <Input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="text-sm bg-secondary border-border h-9 flex-1"
            data-testid="input-notes"
          />
          <Button
            onClick={handleAdd}
            disabled={!newSymbol.trim() || addToWatchlist.isPending}
            size="sm"
            className="h-9 gap-1.5"
            data-testid="button-add-symbol"
          >
            {addToWatchlist.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : !watchlist || watchlist.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground" data-testid="state-watchlist-empty">
            <List className="w-7 h-7 mx-auto mb-2 opacity-40" />
            <div className="text-sm">No symbols in watchlist</div>
            <div className="text-xs mt-1">Add symbols above to track them</div>
          </div>
        ) : (
          <table className="w-full" data-testid="table-watchlist">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Symbol</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Notes</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Added</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map(item => (
                <tr key={item.symbol} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors" data-testid={`row-watchlist-${item.symbol}`}>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-mono font-bold text-primary border-primary/30">{item.symbol}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{item.notes ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(item.addedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-muted-foreground hover:text-red-400"
                      onClick={() => handleRemove(item.symbol)}
                      disabled={removeFromWatchlist.isPending}
                      data-testid={`button-remove-${item.symbol}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
