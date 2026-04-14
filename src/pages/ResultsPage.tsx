import { ArrowLeft, Trophy, XCircle, Clock } from "lucide-react";
import type { BetRecord } from "@/hooks/useWallet";

interface ResultsPageProps {
  bets: BetRecord[];
  onBack: () => void;
}

const ResultsPage = ({ bets, onBack }: ResultsPageProps) => {
  const settled = bets.filter(b => b.result !== "pending");

  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <h2 className="text-sm font-bold text-foreground">Results</h2>
      </div>

      {settled.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={48} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No results yet</p>
        </div>
      ) : (
        <div className="px-3 mt-3 space-y-2">
          {settled.map((bet) => (
            <div key={bet.id} className="bg-surface border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">{bet.matchTitle}</span>
                {bet.result === "win" ? (
                  <span className="flex items-center gap-1 text-[10px] bg-success/20 text-success px-2 py-0.5 rounded font-bold">
                    <Trophy size={10} /> WON
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded font-bold">
                    <XCircle size={10} /> LOST
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Team: <span className="text-foreground">{bet.team}</span></span>
                <span className="text-muted-foreground">Odds: <span className="text-gold font-bold">{bet.odds}x</span></span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Stake: <span className="text-foreground">{bet.amount}</span></span>
                <span className={bet.result === "win" ? "text-success font-bold" : "text-destructive font-bold"}>
                  {bet.result === "win" ? `+${bet.payout}` : `-${bet.amount}`}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">{new Date(bet.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
