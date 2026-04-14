import { useState } from "react";
import { History, TrendingUp, TrendingDown, Filter } from "lucide-react";
import type { BetRecord } from "@/hooks/useWallet";

interface BetHistoryProps {
  bets: BetRecord[];
}

type FilterType = "all" | "win" | "loss" | "pending";

const BetHistory = ({ bets }: BetHistoryProps) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? bets : bets.filter((b) => b.result === filter);
  const totalProfit = bets.reduce((sum, b) => sum + (b.result === "win" ? b.payout - b.amount : b.result === "loss" ? -b.amount : 0), 0);

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "win", label: "Won" },
    { id: "loss", label: "Lost" },
  ];

  return (
    <div className="px-3 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
          <History size={14} /> Bet History
        </h2>
        <span className={`text-xs font-bold ${totalProfit >= 0 ? "text-success" : "text-destructive"}`}>
          P/L: {totalProfit >= 0 ? "+" : ""}{totalProfit}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
              filter === f.id ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground border border-border"
            }`}
          >
            {f.label} {f.id === "all" ? `(${bets.length})` : `(${bets.filter((b) => b.result === f.id).length})`}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface rounded-lg border border-border p-2.5 text-center">
          <p className="text-lg font-bold text-foreground">{bets.length}</p>
          <p className="text-[9px] text-muted-foreground">Total Bets</p>
        </div>
        <div className="bg-surface rounded-lg border border-success/30 p-2.5 text-center">
          <p className="text-lg font-bold text-success flex items-center justify-center gap-1">
            <TrendingUp size={12} /> {bets.filter((b) => b.result === "win").length}
          </p>
          <p className="text-[9px] text-muted-foreground">Won</p>
        </div>
        <div className="bg-surface rounded-lg border border-destructive/30 p-2.5 text-center">
          <p className="text-lg font-bold text-destructive flex items-center justify-center gap-1">
            <TrendingDown size={12} /> {bets.filter((b) => b.result === "loss").length}
          </p>
          <p className="text-[9px] text-muted-foreground">Lost</p>
        </div>
      </div>

      {/* Bet list */}
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No bets yet. Place your first bet!</p>
        )}
        {filtered.map((bet) => (
          <div key={bet.id} className={`bg-surface rounded-lg border p-3 ${
            bet.result === "win" ? "border-success/30" : bet.result === "loss" ? "border-destructive/30" : "border-border"
          }`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-foreground">{bet.matchTitle}</p>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                bet.result === "win" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              }`}>
                {bet.result === "win" ? "WON ✅" : "LOST ❌"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground">
                  {bet.team} • Odds: {bet.odds}x
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {new Date(bet.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Stake: {bet.amount}</p>
                <p className={`text-xs font-bold ${bet.result === "win" ? "text-success" : "text-destructive"}`}>
                  {bet.result === "win" ? `+${bet.payout}` : `-${bet.amount}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetHistory;
