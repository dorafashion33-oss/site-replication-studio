import { useState } from "react";
import { X, Coins, TrendingUp, TrendingDown } from "lucide-react";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";

interface ExchangeBetSlipProps {
  match: GeneratedMatch;
  team: string;
  type: "back" | "lay";
  odds: number;
  balance: number;
  onClose: () => void;
  onPlaceBet: (matchId: string, matchTitle: string, team: string, amount: number) => any;
}

const ExchangeBetSlip = ({ match, team, type, odds, balance, onClose, onPlaceBet }: ExchangeBetSlipProps) => {
  const [stake, setStake] = useState(100);
  const [result, setResult] = useState<{ won: boolean; profit: number } | null>(null);

  const isBack = type === "back";

  // Real exchange calculations
  const profit = isBack ? +(stake * (odds - 1)).toFixed(2) : +stake.toFixed(2);
  const liability = isBack ? stake : +(stake * (odds - 1)).toFixed(2);
  const impliedProb = +(1 / odds * 100).toFixed(1);

  const canPlace = isBack ? stake <= balance && stake > 0 : liability <= balance && liability > 0;

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handlePlaceBet = () => {
    if (!canPlace) return;
    const betResult = onPlaceBet(match.id, `${match.teamA} vs ${match.teamB}`, `${type.toUpperCase()}: ${team}`, isBack ? stake : liability);
    if (betResult) {
      // Simulate based on implied probability
      const winChance = isBack ? impliedProb / 100 : 1 - impliedProb / 100;
      const won = Math.random() < winChance;
      setResult({ won, profit: won ? profit : -liability });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 animate-in fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card border-t-2 rounded-t-2xl p-4 space-y-3 animate-in slide-in-from-bottom"
        style={{ borderTopColor: isBack ? "rgb(59 130 246)" : "rgb(236 72 153)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black px-2 py-0.5 rounded ${isBack ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"}`}>
              {isBack ? "BACK" : "LAY"}
            </span>
            <h3 className="text-sm font-bold text-foreground">{team}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground"><X size={18} /></button>
        </div>

        {/* Match info */}
        <div className="bg-surface rounded-lg p-2.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">{match.sport} • {match.league}</p>
            <p className="text-xs font-bold text-foreground">{match.teamA} vs {match.teamB}</p>
          </div>
          <span className={`text-lg font-black ${isBack ? "text-blue-400" : "text-pink-400"}`}>{odds}</span>
        </div>

        {!result ? (
          <>
            {/* Stake input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{isBack ? "Stake" : "Backer's Stake"}</p>
                <p className="text-xs text-gold flex items-center gap-1"><Coins size={12} /> {balance}</p>
              </div>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Math.max(0, +e.target.value))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <div className="flex gap-1.5 mt-2">
                {quickAmounts.map((a) => (
                  <button key={a} onClick={() => setStake(a)}
                    className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-colors ${
                      stake === a
                        ? isBack ? "bg-blue-500/20 text-blue-400 border-blue-500/40" : "bg-pink-500/20 text-pink-400 border-pink-500/40"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation breakdown */}
            <div className="bg-surface rounded-lg p-3 space-y-1.5 border border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Odds</span>
                <span className="font-bold text-foreground">{odds}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Implied Prob.</span>
                <span className="font-bold text-foreground">{impliedProb}%</span>
              </div>
              <div className="border-t border-border/50 my-1" />
              {isBack ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Stake (Risk)</span>
                    <span className="font-bold text-destructive">-{stake}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Potential Profit</span>
                    <span className="font-bold text-success flex items-center gap-1"><TrendingUp size={12} /> +{profit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className="font-bold text-gold">+{(stake + profit).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Liability (Risk)</span>
                    <span className="font-bold text-destructive flex items-center gap-1"><TrendingDown size={12} /> -{liability}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Potential Profit</span>
                    <span className="font-bold text-success">+{profit}</span>
                  </div>
                </>
              )}
            </div>

            {/* Place bet button */}
            <button
              onClick={handlePlaceBet}
              disabled={!canPlace}
              className={`w-full py-3 rounded-lg font-bold text-sm disabled:opacity-50 transition-all ${
                isBack ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              Place {isBack ? "Back" : "Lay"} Bet • {isBack ? stake : liability} coins
            </button>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className={`text-4xl ${result.won ? "animate-bounce" : ""}`}>
              {result.won ? "🎉" : "😔"}
            </div>
            <p className={`text-lg font-bold ${result.won ? "text-success" : "text-destructive"}`}>
              {result.won ? "BET WON!" : "BET LOST!"}
            </p>
            <p className={`font-bold text-xl ${result.profit > 0 ? "text-gold" : "text-destructive"}`}>
              {result.profit > 0 ? `+${result.profit}` : result.profit} coins
            </p>
            <p className="text-[10px] text-muted-foreground">
              {isBack ? `Back @ ${odds} • Stake: ${stake}` : `Lay @ ${odds} • Liability: ${liability}`}
            </p>
            <button onClick={onClose} className="mt-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeBetSlip;
