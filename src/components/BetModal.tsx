import { useState } from "react";
import { X, Coins } from "lucide-react";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";

interface BetModalProps {
  match: GeneratedMatch;
  balance: number;
  onClose: () => void;
  onPlaceBet: (matchId: string, matchTitle: string, team: string, amount: number) => any;
}

const BetModal = ({ match, balance, onClose, onPlaceBet }: BetModalProps) => {
  const [selectedTeam, setSelectedTeam] = useState(match.teamA);
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState<{ won: boolean; payout: number; odds: number } | null>(null);

  const quickAmounts = [50, 100, 250, 500];

  const handleBet = () => {
    if (amount <= 0 || amount > balance) return;
    const bet = onPlaceBet(match.id, `${match.teamA} vs ${match.teamB}`, selectedTeam, amount);
    if (bet) {
      setResult({ won: bet.result === "win", payout: bet.payout, odds: bet.odds });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-md bg-card border-t border-border rounded-t-2xl p-4 space-y-4 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Place Bet</h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={18} /></button>
        </div>

        <div className="bg-surface rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">{match.sport} • {match.league}</p>
          <p className="text-sm font-bold text-foreground mt-1">{match.teamA} vs {match.teamB}</p>
          {match.isLive && <span className="text-[10px] bg-live text-live-foreground px-2 py-0.5 rounded font-bold mt-1 inline-block">LIVE 🔴</span>}
        </div>

        {!result ? (
          <>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Select Team</p>
              <div className="grid grid-cols-2 gap-2">
                {[match.teamA, match.teamB].map((team) => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedTeam === team ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Bet Amount</p>
                <p className="text-xs text-gold flex items-center gap-1"><Coins size={12} /> {balance} coins</p>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, +e.target.value))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                min={1} max={balance}
              />
              <div className="flex gap-2 mt-2">
                {quickAmounts.map((a) => (
                  <button key={a} onClick={() => setAmount(a)}
                    className="flex-1 py-1.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBet}
              disabled={amount <= 0 || amount > balance}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 transition-all hover:opacity-90"
            >
              Place Bet ({amount} coins)
            </button>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className={`text-4xl ${result.won ? "animate-bounce" : ""}`}>
              {result.won ? "🎉" : "😔"}
            </div>
            <p className={`text-lg font-bold ${result.won ? "text-success" : "text-destructive"}`}>
              {result.won ? "YOU WON!" : "YOU LOST!"}
            </p>
            {result.won && (
              <p className="text-gold font-bold text-xl">+{result.payout} coins ({result.odds}x)</p>
            )}
            {!result.won && (
              <p className="text-muted-foreground text-sm">-{amount} coins</p>
            )}
            <button onClick={onClose} className="mt-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetModal;
