import { useState, useMemo } from "react";
import { Lock, X, Coins, TrendingUp, TrendingDown } from "lucide-react";
import { useFluctuatingOdds } from "@/hooks/useFluctuatingOdds";

interface Match {
  id: string;
  sport: string;
  sportIcon: string;
  league: string;
  teamA: string;
  teamB: string;
  date: string;
  isLive: boolean;
  badges: string[];
  odds: { value: string | null; volume?: string }[];
}

const matches: Match[] = [
  {
    id: "1", sport: "CRICKET", sportIcon: "🏏",
    league: "Womens One Day Internationals",
    teamA: "New Zealand W", teamB: "South Africa W",
    date: "04 Apr 03:30 AM", isLive: true, badges: ["MO", "BM", "F"],
    odds: [
      { value: "1.73", volume: "18K" }, { value: "1.78", volume: "24K" },
      { value: null }, { value: null },
      { value: "2.28", volume: "19K" }, { value: "2.38", volume: "26K" },
    ],
  },
  {
    id: "2", sport: "TENNIS", sportIcon: "🎾",
    league: "ATP Houston Open",
    teamA: "Le Tien V", teamB: "Burruchaga",
    date: "Today 10:30 PM", isLive: false, badges: ["MO", "BM"],
    odds: [
      { value: "1.45", volume: "12K" }, { value: "2.80", volume: "8K" },
      { value: null }, { value: null },
      { value: "1.90", volume: "15K" }, { value: "1.95", volume: "11K" },
    ],
  },
  {
    id: "3", sport: "CRICKET", sportIcon: "🏏",
    league: "Pakistan Super League",
    teamA: "Lahore Qalandars", teamB: "Multan Sultans",
    date: "03 Apr 07:30 PM", isLive: true, badges: ["MO", "BM", "F"],
    odds: [
      { value: "1.01", volume: "94K" }, { value: null },
      { value: null }, { value: null },
      { value: "1000", volume: "683K" }, { value: null },
    ],
  },
  {
    id: "4", sport: "FOOTBALL", sportIcon: "⚽",
    league: "UEFA Champions League",
    teamA: "Barcelona", teamB: "Inter Milan",
    date: "04 Apr 12:30 AM", isLive: false, badges: ["MO", "BM"],
    odds: [
      { value: "1.85", volume: "45K" }, { value: "1.90", volume: "30K" },
      { value: "3.50", volume: "10K" }, { value: "3.60", volume: "8K" },
      { value: "4.20", volume: "22K" }, { value: "4.40", volume: "18K" },
    ],
  },
];

function getSelectionLabel(match: Match, oddIndex: number): string {
  if (oddIndex <= 1) return match.teamA;
  if (oddIndex <= 3) return "Draw";
  return match.teamB;
}

interface SelectedOdd {
  match: Match;
  oddIndex: number;
  oddValue: number;
  type: "back" | "lay";
  selection: string;
}

interface TopMatchesProps {
  onMatchClick?: (matchId: string) => void;
  balance?: number;
  onPlaceBet?: (matchId: string, matchTitle: string, team: string, amount: number) => any;
}

const TopMatches = ({ onMatchClick, balance = 0, onPlaceBet }: TopMatchesProps) => {
  const [betSlip, setBetSlip] = useState<SelectedOdd | null>(null);
  const [stake, setStake] = useState(100);
  const [betResult, setBetResult] = useState<{ won: boolean; profit: number; liability: number } | null>(null);

  // === Live odds fluctuation: build base map per match+oddIndex ===
  const baseOdds = useMemo(() => {
    const out: Record<string, { back: number; lay: number }> = {};
    for (const m of matches) {
      // we use odd cells in pairs (back, lay) — index 0/1, 2/3, 4/5
      for (let i = 0; i < m.odds.length; i += 2) {
        const back = m.odds[i]?.value;
        const lay = m.odds[i + 1]?.value;
        if (back && lay) {
          out[`${m.id}-${i}`] = { back: parseFloat(back), lay: parseFloat(lay) };
        }
      }
    }
    return out;
  }, []);
  const fluctuated = useFluctuatingOdds(baseOdds, 3000);

  const getOdd = (matchId: string, oddIndex: number, raw: string | null): { value: string; flash: "up" | "down" | "none" } | null => {
    if (!raw) return null;
    const pairKey = `${matchId}-${oddIndex - (oddIndex % 2)}`;
    const cell = fluctuated[pairKey];
    if (!cell) return { value: raw, flash: "none" };
    const sub = oddIndex % 2 === 0 ? cell.back : cell.lay;
    // For massive cricket dummy odds (1000), keep as integer
    const num = parseFloat(raw);
    const formatted = num >= 100 ? Math.round(sub.value).toString() : sub.value.toFixed(2);
    return { value: formatted, flash: sub.flash };
  };

  const handleOddClick = (e: React.MouseEvent, match: Match, oddIndex: number) => {
    e.stopPropagation();
    const live = getOdd(match.id, oddIndex, match.odds[oddIndex].value);
    if (!live) return;
    const type = oddIndex % 2 === 0 ? "back" : "lay";
    setBetSlip({
      match,
      oddIndex,
      oddValue: parseFloat(live.value),
      type,
      selection: getSelectionLabel(match, oddIndex),
    });
    setBetResult(null);
    setStake(100);
  };

  const calcProfit = () => {
    if (!betSlip) return { profit: 0, liability: 0 };
    const { oddValue, type } = betSlip;
    if (type === "back") {
      const profit = +(stake * (oddValue - 1)).toFixed(2);
      return { profit, liability: stake };
    } else {
      const liability = +(stake * (oddValue - 1)).toFixed(2);
      return { profit: stake, liability };
    }
  };

  const handlePlaceBet = () => {
    if (!betSlip) return;
    const { profit, liability } = calcProfit();
    const requiredBalance = betSlip.type === "back" ? stake : liability;
    if (requiredBalance > balance) return;

    const impliedProbBack = 1 / betSlip.oddValue;
    const random = Math.random();
    let won: boolean;
    if (betSlip.type === "back") {
      won = random < impliedProbBack;
    } else {
      won = random >= impliedProbBack;
    }

    if (onPlaceBet) {
      const matchTitle = `${betSlip.match.teamA} vs ${betSlip.match.teamB}`;
      onPlaceBet(betSlip.match.id, matchTitle, `${betSlip.type.toUpperCase()} ${betSlip.selection} @${betSlip.oddValue}`, requiredBalance);
    }

    setBetResult({ won, profit: won ? profit : 0, liability: won ? 0 : (betSlip.type === "back" ? stake : liability) });
  };

  const { profit, liability } = betSlip ? calcProfit() : { profit: 0, liability: 0 };

  return (
    <div className="px-3">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-1">Top Matches</h2>
      <div className="w-8 h-0.5 bg-primary rounded mb-2" />

      {/* Column Headers */}
      <div className="flex items-center justify-end gap-1 mb-1 pr-1">
        <span className="text-[8px] text-blue-300 font-bold w-[44px] text-center">BACK</span>
        <span className="text-[8px] text-pink-300 font-bold w-[44px] text-center">LAY</span>
        <span className="text-[8px] text-blue-300 font-bold w-[44px] text-center">BACK</span>
        <span className="text-[8px] text-pink-300 font-bold w-[44px] text-center">LAY</span>
        <span className="text-[8px] text-blue-300 font-bold w-[44px] text-center">BACK</span>
        <span className="text-[8px] text-pink-300 font-bold w-[44px] text-center">LAY</span>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-surface rounded-lg border border-border w-[320px] shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onMatchClick?.(match.id)}
            >
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{match.sportIcon}</span>
                  <span className="text-xs font-bold text-primary">{match.sport}</span>
                </div>
                <div className="flex gap-1">
                  {match.badges.map((t) => (
                    <span key={t} className="text-[9px] bg-primary/80 text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-3 pb-1">
                <p className="text-[10px] text-primary/80">{match.league}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-foreground font-medium">{match.teamA} V {match.teamB}</span>
                  {match.isLive && (
                    <span className="text-[9px] bg-live text-live-foreground px-1.5 py-0.5 rounded font-bold animate-pulse-live">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{match.date}</p>
              </div>

              {/* Odds Row - Clickable Back/Lay with fluctuation */}
              <div className="flex gap-1 px-3 pb-3 pt-1">
                {match.odds.map((odd, i) => {
                  const live = getOdd(match.id, i, odd.value);
                  return (
                    <button
                      key={i}
                      onClick={(e) => handleOddClick(e, match, i)}
                      disabled={!odd.value}
                      className={`flex-1 flex flex-col items-center py-1.5 rounded text-[10px] transition-all ${
                        odd.value
                          ? live?.flash === "up"
                            ? "bg-success/40 text-success ring-1 ring-success/60"
                            : live?.flash === "down"
                            ? "bg-destructive/40 text-destructive ring-1 ring-destructive/60"
                            : i % 2 === 0
                            ? "bg-blue-400/20 text-blue-300 hover:bg-blue-400/40 active:scale-95"
                            : "bg-pink-400/20 text-pink-300 hover:bg-pink-400/40 active:scale-95"
                          : "bg-muted/40 text-muted-foreground cursor-not-allowed"
                      } ${betSlip?.match.id === match.id && betSlip?.oddIndex === i ? "ring-2 ring-gold" : ""}`}
                    >
                      {live ? (
                        <>
                          <span className="font-bold flex items-center gap-0.5">
                            {live.value}
                            {live.flash === "up" && <TrendingUp size={8} />}
                            {live.flash === "down" && <TrendingDown size={8} />}
                          </span>
                          {odd.volume && <span className="text-[8px] opacity-70">{odd.volume}</span>}
                        </>
                      ) : (
                        <Lock size={10} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Slip Panel */}
      {betSlip && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 animate-in fade-in" onClick={() => setBetSlip(null)}>
          <div className="w-full max-w-md bg-card border-t border-border rounded-t-2xl p-4 space-y-3 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Bet Slip</h3>
              <button onClick={() => setBetSlip(null)}><X size={18} className="text-muted-foreground" /></button>
            </div>

            <div className="bg-surface rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground">{betSlip.match.sport} • {betSlip.match.league}</p>
              <p className="text-xs font-bold text-foreground mt-0.5">{betSlip.match.teamA} vs {betSlip.match.teamB}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${betSlip.type === "back" ? "bg-blue-400/20 text-blue-300" : "bg-pink-400/20 text-pink-300"}`}>
                  {betSlip.type.toUpperCase()}
                </span>
                <span className="text-xs text-foreground font-medium">{betSlip.selection}</span>
                <span className="text-xs text-gold font-bold">@{betSlip.oddValue}</span>
              </div>
            </div>

            {!betResult ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Stake</span>
                    <span className="text-xs text-gold flex items-center gap-1"><Coins size={12} /> {balance}</span>
                  </div>
                  <input type="number" value={stake} onChange={(e) => setStake(Math.max(1, +e.target.value))}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-bold focus:border-primary focus:outline-none"
                    min={1} max={balance} />
                  <div className="flex gap-2 mt-2">
                    {[50, 100, 200, 500, 1000].map((a) => (
                      <button key={a} onClick={() => setStake(a)}
                        className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-all ${stake === a ? "bg-primary/20 text-primary border-primary/40" : "bg-surface text-muted-foreground border-border"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-surface rounded-lg border border-border p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Odds</span>
                    <span className="text-foreground font-bold">{betSlip.oddValue}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Stake</span>
                    <span className="text-foreground font-bold">{stake}</span>
                  </div>
                  {betSlip.type === "back" ? (
                    <>
                      <div className="flex justify-between text-xs border-t border-border/50 pt-2">
                        <span className="text-muted-foreground">Profit if wins</span>
                        <span className="text-success font-bold flex items-center gap-1"><TrendingUp size={12} /> +{profit}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Loss if loses</span>
                        <span className="text-destructive font-bold flex items-center gap-1"><TrendingDown size={12} /> -{stake}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs border-t border-border/50 pt-2">
                        <span className="text-muted-foreground">Profit if selection loses</span>
                        <span className="text-success font-bold flex items-center gap-1"><TrendingUp size={12} /> +{profit}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Liability if selection wins</span>
                        <span className="text-destructive font-bold flex items-center gap-1"><TrendingDown size={12} /> -{liability}</span>
                      </div>
                    </>
                  )}
                </div>

                <button onClick={handlePlaceBet}
                  disabled={(betSlip.type === "back" ? stake : liability) > balance}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 transition-all hover:opacity-90">
                  {(betSlip.type === "back" ? stake : liability) > balance
                    ? "Insufficient Balance"
                    : `Place ${betSlip.type === "back" ? "Back" : "Lay"} Bet (${betSlip.type === "back" ? stake : liability} coins)`}
                </button>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className={`text-4xl ${betResult.won ? "animate-bounce" : ""}`}>
                  {betResult.won ? "🎉" : "😔"}
                </div>
                <p className={`text-lg font-bold ${betResult.won ? "text-success" : "text-destructive"}`}>
                  {betResult.won ? "BET WON!" : "BET LOST!"}
                </p>
                {betResult.won ? (
                  <p className="text-gold font-bold text-xl">+{betResult.profit} coins</p>
                ) : (
                  <p className="text-muted-foreground text-sm">-{betResult.liability} coins</p>
                )}
                <button onClick={() => setBetSlip(null)} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopMatches;
