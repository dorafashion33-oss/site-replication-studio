import { useState } from "react";
import { ArrowLeft, Filter, TrendingUp, TrendingDown, Clock } from "lucide-react";
import BetHistory from "@/components/BetHistory";
import type { BetRecord } from "@/hooks/useWallet";

interface MyBetsPageProps {
  bets: BetRecord[];
  onBack: () => void;
}

const MyBetsPage = ({ bets, onBack }: MyBetsPageProps) => {
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all");

  const now = Date.now();
  const filtered = bets.filter((b) => {
    if (dateFilter === "today") return now - b.timestamp < 86400000;
    if (dateFilter === "week") return now - b.timestamp < 604800000;
    if (dateFilter === "month") return now - b.timestamp < 2592000000;
    return true;
  });

  const totalStaked = filtered.reduce((s, b) => s + b.amount, 0);
  const totalWon = filtered.filter(b => b.result === "win").reduce((s, b) => s + b.payout, 0);
  const totalLost = filtered.filter(b => b.result === "loss").reduce((s, b) => s + b.amount, 0);
  const netPL = totalWon - totalStaked;

  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <h2 className="text-sm font-bold text-foreground">My Bets</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2 px-3 mt-3">
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-[10px] text-muted-foreground">Total Staked</p>
          <p className="text-lg font-bold text-foreground">{totalStaked}</p>
        </div>
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-[10px] text-muted-foreground">Total Won</p>
          <p className="text-lg font-bold text-success">{totalWon}</p>
        </div>
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-[10px] text-muted-foreground">Total Lost</p>
          <p className="text-lg font-bold text-destructive">{totalLost}</p>
        </div>
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-[10px] text-muted-foreground">Net P/L</p>
          <p className={`text-lg font-bold flex items-center gap-1 ${netPL >= 0 ? "text-success" : "text-destructive"}`}>
            {netPL >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {netPL >= 0 ? "+" : ""}{netPL}
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex gap-2 px-3 mt-3">
        {(["today", "week", "month", "all"] as const).map((f) => (
          <button key={f} onClick={() => setDateFilter(f)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
              dateFilter === f ? "bg-primary/20 text-primary border-primary/40" : "bg-surface text-muted-foreground border-border"
            }`}>
            {f === "today" ? "Today" : f === "week" ? "This Week" : f === "month" ? "This Month" : "All Time"}
          </button>
        ))}
      </div>

      {/* Bet List */}
      <div className="px-3 mt-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <Clock size={40} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No bets found</p>
            <p className="text-xs text-muted-foreground">Place your first bet to see it here</p>
          </div>
        ) : (
          <BetHistory bets={filtered} />
        )}
      </div>
    </div>
  );
};

export default MyBetsPage;
