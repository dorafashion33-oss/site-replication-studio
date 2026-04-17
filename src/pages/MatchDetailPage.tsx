import { useState, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Lock, ChevronDown, ChevronUp, X, TrendingUp, TrendingDown, Radio, Wallet } from "lucide-react";
import ExchangeBetSlip from "@/components/ExchangeBetSlip";
import LiveStreamModal from "@/components/LiveStreamModal";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";
import type { BetRecord } from "@/hooks/useWallet";

interface MarketRow {
  team: string;
  back: { value: string | null; volume?: string };
  lay: { value: string | null; volume?: string };
}

interface Market {
  title: string;
  icon: string;
  min: string;
  max: string;
  rows: MarketRow[];
  ticker?: string;
}

interface MatchDetailProps {
  matchTitle: string;
  matchTime: string;
  onBack: () => void;
  balance?: number;
  onPlaceBet?: (matchId: string, matchTitle: string, team: string, amount: number, options?: { pending?: boolean }) => any;
  bets?: BetRecord[];
  onCashout?: (predicate: (b: BetRecord) => boolean) => { count: number; credited: number };
}

// === Initial market data ===
const INITIAL_MARKETS: Market[] = [
  {
    title: "MATCH ODDS",
    icon: "📌",
    min: "100",
    max: "5K",
    rows: [
      { team: "New Zealand W", back: { value: "1.77", volume: "60K" }, lay: { value: "1.78", volume: "969K" } },
      { team: "South Africa W", back: { value: "2.28", volume: "757K" }, lay: { value: "2.30", volume: "60K" } },
    ],
    ticker: "Delhi Capitals v Mumbai Indians — Live Now!",
  },
  {
    title: "BOOKMAKER",
    icon: "📌",
    min: "100",
    max: "25K",
    rows: [
      { team: "New Zealand W", back: { value: "74", volume: "25K" }, lay: { value: "79", volume: "25K" } },
      { team: "South Africa W", back: { value: null }, lay: { value: null } },
    ],
    ticker: "The Ultimate Adventure 🚀 — Play Now!",
  },
  {
    title: "TOSS",
    icon: "🪙",
    min: "100",
    max: "100K",
    rows: [
      { team: "New Zealand W", back: { value: "95", volume: "100K" }, lay: { value: "105", volume: "100K" } },
      { team: "South Africa W", back: { value: "95", volume: "100K" }, lay: { value: "105", volume: "100K" } },
    ],
  },
  {
    title: "TIED MATCH",
    icon: "🤝",
    min: "100",
    max: "50K",
    rows: [
      { team: "Yes", back: { value: "50", volume: "50K" }, lay: { value: "55", volume: "50K" } },
      { team: "No", back: { value: "1.02", volume: "50K" }, lay: { value: "1.05", volume: "50K" } },
    ],
  },
];

// Fluctuate odds slightly — keeps a delta map per cell to flash colour
function fluctuate(value: string): { value: string; dir: "up" | "down" | "none" } {
  const num = parseFloat(value);
  if (isNaN(num)) return { value, dir: "none" };
  const delta = (Math.random() - 0.5) * (num < 5 ? 0.04 : num < 50 ? 0.6 : 2);
  const next = Math.max(1.01, num + delta);
  const formatted = num < 10 ? next.toFixed(2) : Math.round(next).toString();
  const dir = next > num ? "up" : next < num ? "down" : "none";
  return { value: formatted, dir };
}

const MatchDetailPage = ({ matchTitle, matchTime, onBack, balance = 0, onPlaceBet, bets = [] }: MatchDetailProps) => {
  const [liveScoreOpen, setLiveScoreOpen] = useState(true);
  const [openBetsVisible, setOpenBetsVisible] = useState(false);
  const [betSlip, setBetSlip] = useState<{
    market: string;
    team: string;
    type: "back" | "lay";
    odds: number;
  } | null>(null);

  // === Live odds (mutable) ===
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [flashes, setFlashes] = useState<Record<string, "up" | "down">>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newFlashes: Record<string, "up" | "down"> = {};
      setMarkets((prev) =>
        prev.map((m, mi) => ({
          ...m,
          rows: m.rows.map((r, ri) => {
            const next: MarketRow = { ...r, back: { ...r.back }, lay: { ...r.lay } };
            if (r.back.value) {
              const f = fluctuate(r.back.value);
              next.back.value = f.value;
              if (f.dir !== "none") newFlashes[`${mi}-${ri}-back`] = f.dir;
            }
            if (r.lay.value) {
              const f = fluctuate(r.lay.value);
              next.lay.value = f.value;
              if (f.dir !== "none") newFlashes[`${mi}-${ri}-lay`] = f.dir;
            }
            return next;
          }),
        }))
      );
      setFlashes(newFlashes);
      // clear flashes after 600ms
      setTimeout(() => setFlashes({}), 600);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // === Live scorecard simulation ===
  const [score, setScore] = useState({
    battingTeam: "New Zealand W",
    runs: 142,
    wickets: 4,
    overs: 16.3,
    runRate: 8.6,
    target: 178,
    lastBalls: ["1", "4", ".", "W", "6", "2"] as string[],
    striker: { name: "S. Devine", runs: 42, balls: 28 },
    nonStriker: { name: "A. Plimmer", runs: 18, balls: 14 },
    bowler: { name: "M. Kapp", overs: 3.3, runs: 28, wickets: 2 },
  });
  const scoreRef = useRef(score);
  scoreRef.current = score;

  useEffect(() => {
    const events = [".", ".", "1", "1", "1", "2", "4", "0", "1", "6", "W"];
    const interval = setInterval(() => {
      const ball = events[Math.floor(Math.random() * events.length)];
      setScore((s) => {
        const runsAdded = ball === "W" || ball === "." ? 0 : ball === "0" ? 0 : parseInt(ball);
        const wicketsAdded = ball === "W" ? 1 : 0;
        const newOversInt = Math.floor(s.overs);
        const newOversBall = Math.round((s.overs - newOversInt) * 10) + 1;
        const finalOvers = newOversBall >= 6 ? newOversInt + 1 : newOversInt + newOversBall / 10;
        const newRuns = s.runs + runsAdded;
        const newWickets = Math.min(10, s.wickets + wicketsAdded);
        const overFloat = Math.floor(finalOvers) + (finalOvers - Math.floor(finalOvers)) * 10 / 6;
        const rr = overFloat > 0 ? +(newRuns / overFloat).toFixed(2) : 0;
        return {
          ...s,
          runs: newRuns,
          wickets: newWickets,
          overs: +finalOvers.toFixed(1),
          runRate: rr,
          lastBalls: [ball, ...s.lastBalls].slice(0, 6),
          striker: ball === "W"
            ? { name: ["A. Halliday", "I. Gaze", "L. Down"][Math.floor(Math.random() * 3)], runs: 0, balls: 0 }
            : { ...s.striker, runs: s.striker.runs + runsAdded, balls: s.striker.balls + 1 },
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // === Open bets for THIS match ===
  const matchBets = useMemo(
    () => bets.filter((b) => b.matchTitle.toLowerCase().includes("zealand") || b.matchTitle.toLowerCase().includes("africa") || b.matchTitle === matchTitle),
    [bets, matchTitle]
  );

  const handleOddsClick = (market: string, team: string, type: "back" | "lay", value: string) => {
    if (!onPlaceBet) return;
    const odds = parseFloat(value);
    if (!odds || isNaN(odds)) return;
    setBetSlip({ market, team, type, odds });
  };

  const slipMatch: GeneratedMatch | null = betSlip
    ? ({
        id: `detail-${matchTitle}-${betSlip.market}`,
        sport: "Cricket",
        sportIcon: "🏏",
        league: matchTitle,
        teamA: "New Zealand W",
        teamB: "South Africa W",
        time: matchTime,
        isLive: true,
        scoreA: "",
        scoreB: "",
        odds: { back: betSlip.odds, lay: betSlip.odds },
      } as unknown as GeneratedMatch)
    : null;

  const overPct = Math.min(100, (score.overs / 20) * 100);

  return (
    <div className="pb-4">
      {/* Match Header */}
      <div className="bg-primary/20 border-b border-primary/30">
        <div className="flex items-center gap-2 px-3 py-2">
          <button onClick={onBack} className="text-foreground">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded">
                {matchTitle}
              </span>
              <span className="text-xs font-bold text-foreground">{matchTime}</span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 px-3 pb-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg">SCORECARD</button>
          <button className="px-4 py-2 bg-surface text-foreground text-xs font-bold rounded-lg border border-border">LIVE STREAM</button>
          <button
            onClick={() => setOpenBetsVisible(true)}
            className="px-4 py-2 bg-surface text-foreground text-xs font-bold rounded-lg border border-border hover:border-primary transition-colors"
          >
            OPEN BETS ({matchBets.length})
          </button>
        </div>
      </div>

      {/* Live Score Accordion */}
      <button
        onClick={() => setLiveScoreOpen(!liveScoreOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/30"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
          <span className="text-sm text-foreground font-medium">Live Score</span>
          <span className="text-[10px] bg-live/20 text-live px-2 py-0.5 rounded font-bold">LIVE</span>
        </div>
        {liveScoreOpen ? <ChevronUp size={18} className="text-foreground" /> : <ChevronDown size={18} className="text-foreground" />}
      </button>
      {liveScoreOpen && (
        <div className="bg-surface border border-border border-t-0 px-4 py-3 space-y-3 animate-fade-in">
          {/* Score line */}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">{score.battingTeam}</p>
              <p className="text-2xl font-black text-foreground transition-all">
                {score.runs}<span className="text-lg text-muted-foreground">/{score.wickets}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Overs</p>
              <p className="text-lg font-bold text-gold">{score.overs.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">RR: <span className="text-foreground font-bold">{score.runRate}</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Target</p>
              <p className="text-lg font-bold text-primary">{score.target}</p>
              <p className="text-[10px] text-live">Need {Math.max(0, score.target - score.runs)}</p>
            </div>
          </div>

          {/* Over progress */}
          <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-gold transition-all duration-500" style={{ width: `${overPct}%` }} />
          </div>

          {/* Last 6 balls */}
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Last 6 balls</p>
            <div className="flex gap-1.5">
              {score.lastBalls.map((b, i) => (
                <span
                  key={`${i}-${b}`}
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black border ${
                    b === "W"
                      ? "bg-destructive/20 text-destructive border-destructive/40"
                      : b === "4"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                      : b === "6"
                      ? "bg-success/20 text-success border-success/40"
                      : b === "."
                      ? "bg-muted/40 text-muted-foreground border-border"
                      : "bg-primary/20 text-primary border-primary/40"
                  } ${i === 0 ? "animate-scale-in" : ""}`}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Players */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-card rounded-lg p-2 border border-border/50">
              <p className="text-muted-foreground text-[9px] uppercase">Batting</p>
              <p className="font-bold text-foreground">⚡ {score.striker.name}</p>
              <p className="text-gold">{score.striker.runs} <span className="text-muted-foreground">({score.striker.balls})</span></p>
              <p className="text-muted-foreground text-[10px] mt-1">{score.nonStriker.name} — {score.nonStriker.runs} ({score.nonStriker.balls})</p>
            </div>
            <div className="bg-card rounded-lg p-2 border border-border/50">
              <p className="text-muted-foreground text-[9px] uppercase">Bowling</p>
              <p className="font-bold text-foreground">🎯 {score.bowler.name}</p>
              <p className="text-foreground">{score.bowler.wickets}/{score.bowler.runs} <span className="text-muted-foreground">({score.bowler.overs})</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Markets */}
      <div className="space-y-3 mt-3">
        {markets.map((market, mi) => (
          <div key={market.title} className="mx-3">
            {/* Market Header */}
            <div className="bg-surface rounded-t-lg px-3 py-2 flex items-center justify-between border border-border">
              <div className="flex items-center gap-2">
                <span>{market.icon}</span>
                <span className="text-xs font-bold text-foreground uppercase">{market.title}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground">MIN: {market.min}</span>
                <br />
                <span className="text-[10px] text-muted-foreground">MAX: {market.max}</span>
              </div>
            </div>

            {/* Cashout / Loss Cut */}
            <div className="flex items-center justify-center gap-3 py-2 bg-card border-x border-border">
              <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded">Cashout : ₹0.00</span>
              <span className="text-[10px] bg-live/20 text-live px-3 py-1 rounded cursor-pointer">Loss Cut</span>
            </div>

            {/* Column Headers */}
            <div className="flex items-center bg-card border-x border-border px-3 py-1">
              <span className="flex-1 text-[10px] text-muted-foreground">Market</span>
              <span className="w-16 text-center text-[10px] text-blue-400 font-semibold">Back</span>
              <span className="w-16 text-center text-[10px] text-pink-400 font-semibold">Lay</span>
            </div>

            {/* Rows */}
            {market.rows.map((row, ri) => {
              const backFlash = flashes[`${mi}-${ri}-back`];
              const layFlash = flashes[`${mi}-${ri}-lay`];
              return (
                <div key={ri} className="flex items-center bg-card border-x border-border px-3 py-2">
                  <span className="flex-1 text-xs text-foreground">{row.team}</span>
                  {row.back.value ? (
                    <button
                      onClick={() => handleOddsClick(market.title, row.team, "back", row.back.value!)}
                      className={`w-16 mx-0.5 rounded py-1 text-center hover:bg-blue-400/50 active:scale-95 transition-all ${
                        backFlash === "up"
                          ? "bg-success/40 text-success ring-1 ring-success/60"
                          : backFlash === "down"
                          ? "bg-destructive/40 text-destructive ring-1 ring-destructive/60"
                          : "bg-blue-400/30 text-blue-300"
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center justify-center gap-0.5">
                        {row.back.value}
                        {backFlash === "up" && <TrendingUp size={9} />}
                        {backFlash === "down" && <TrendingDown size={9} />}
                      </span>
                      {row.back.volume && <p className="text-[8px] text-blue-400/70">{row.back.volume}</p>}
                    </button>
                  ) : (
                    <div className="w-16 mx-0.5 bg-muted/30 rounded py-2 flex items-center justify-center">
                      <Lock size={12} className="text-muted-foreground" />
                    </div>
                  )}
                  {row.lay.value ? (
                    <button
                      onClick={() => handleOddsClick(market.title, row.team, "lay", row.lay.value!)}
                      className={`w-16 mx-0.5 rounded py-1 text-center hover:bg-pink-400/50 active:scale-95 transition-all ${
                        layFlash === "up"
                          ? "bg-success/40 text-success ring-1 ring-success/60"
                          : layFlash === "down"
                          ? "bg-destructive/40 text-destructive ring-1 ring-destructive/60"
                          : "bg-pink-400/30 text-pink-300"
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center justify-center gap-0.5">
                        {row.lay.value}
                        {layFlash === "up" && <TrendingUp size={9} />}
                        {layFlash === "down" && <TrendingDown size={9} />}
                      </span>
                      {row.lay.volume && <p className="text-[8px] text-pink-400/70">{row.lay.volume}</p>}
                    </button>
                  ) : (
                    <div className="w-16 mx-0.5 bg-muted/30 rounded py-2 flex items-center justify-center">
                      <Lock size={12} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ticker */}
            {market.ticker && (
              <div className="bg-primary/10 border border-primary/20 border-t-0 rounded-b-lg px-3 py-1.5 overflow-hidden">
                <div className="animate-slide-marquee whitespace-nowrap text-[10px] text-primary font-medium">
                  {market.ticker}
                </div>
              </div>
            )}
            {!market.ticker && <div className="border-b border-border mx-0" />}
          </div>
        ))}
      </div>

      {/* Open Bets Drawer */}
      {openBetsVisible && (
        <div className="fixed inset-0 z-[90] bg-black/60 flex items-end animate-fade-in" onClick={() => setOpenBetsVisible(false)}>
          <div
            className="w-full max-w-md mx-auto bg-card rounded-t-2xl border-t border-border max-h-[70vh] flex flex-col animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-foreground">Open Bets</h3>
                <p className="text-[10px] text-muted-foreground">{matchBets.length} bet{matchBets.length !== 1 ? "s" : ""} on this match</p>
              </div>
              <button onClick={() => setOpenBetsVisible(false)} className="text-muted-foreground">
                <X size={20} />
              </button>
            </div>

            {matchBets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
                <span className="text-4xl mb-2">🎯</span>
                <p className="text-sm font-bold text-foreground">No bets yet</p>
                <p className="text-[11px] text-muted-foreground mt-1">Tap any Back or Lay odd above to place your first bet</p>
              </div>
            ) : (
              <div className="overflow-y-auto px-3 py-2 space-y-2">
                {matchBets.map((bet) => {
                  const isBack = bet.team.startsWith("BACK");
                  const won = bet.result === "win";
                  return (
                    <div key={bet.id} className="bg-surface rounded-lg p-3 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isBack ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"}`}>
                          {isBack ? "BACK" : "LAY"}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          won ? "bg-success/20 text-success" : bet.result === "loss" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                        }`}>
                          {bet.result.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-foreground">{bet.team.replace(/^(BACK|LAY):\s*/, "")}</p>
                      <p className="text-[10px] text-muted-foreground">{bet.matchTitle}</p>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                        <div>
                          <p className="text-[9px] text-muted-foreground">Odds</p>
                          <p className="text-xs font-bold text-foreground">{bet.odds}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground">Stake</p>
                          <p className="text-xs font-bold text-foreground">{bet.amount}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground">P/L</p>
                          <p className={`text-xs font-bold ${won ? "text-success" : "text-destructive"}`}>
                            {won ? `+${bet.payout - bet.amount}` : `-${bet.amount}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-1">{new Date(bet.timestamp).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bet Slip */}
      {betSlip && slipMatch && onPlaceBet && (
        <ExchangeBetSlip
          match={slipMatch}
          team={`${betSlip.team} (${betSlip.market})`}
          type={betSlip.type}
          odds={betSlip.odds}
          balance={balance}
          onClose={() => setBetSlip(null)}
          onPlaceBet={onPlaceBet}
        />
      )}
    </div>
  );
};

export default MatchDetailPage;
