import { useState, useMemo } from "react";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";
import { useFluctuatingOdds, type OddCell } from "@/hooks/useFluctuatingOdds";
import ExchangeBetSlip from "./ExchangeBetSlip";

interface GeneratedMatchesProps {
  matches: GeneratedMatch[];
  balance: number;
  onPlaceBet: (matchId: string, matchTitle: string, team: string, amount: number) => any;
}

const GeneratedMatches = ({ matches, balance, onPlaceBet }: GeneratedMatchesProps) => {
  const [betSlip, setBetSlip] = useState<{
    match: GeneratedMatch;
    team: string;
    type: "back" | "lay";
    odds: number;
  } | null>(null);

  const liveMatches = matches.filter((m) => m.isLive);
  const upcomingMatches = matches.filter((m) => !m.isLive);

  // === Live fluctuation: build base map for both teams (A and B) per match ===
  const baseOdds = useMemo(() => {
    const out: Record<string, { back: number; lay: number }> = {};
    for (const m of matches) {
      const backA = m.odds.back;
      const layA = m.odds.lay;
      const backB = +(layA * 0.95).toFixed(2);
      const layB = +(backA * 1.08).toFixed(2);
      out[`${m.id}-A`] = { back: backA, lay: layA };
      out[`${m.id}-B`] = { back: backB, lay: layB };
    }
    return out;
  }, [matches.map((m) => m.id).join("|")]);
  const fluctuated = useFluctuatingOdds(baseOdds, 3000);

  const handleOddsClick = (match: GeneratedMatch, team: string, type: "back" | "lay", odds: number) => {
    setBetSlip({ match, team, type, odds });
  };

  return (
    <div className="px-3 space-y-4">
      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-live" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Live Matches</h2>
            <span className="text-[10px] bg-live/20 text-live px-2 py-0.5 rounded-full font-bold animate-pulse">{liveMatches.length} LIVE</span>
          </div>
          <div className="w-8 h-0.5 bg-live rounded mb-3" />

          <div className="flex items-center justify-end gap-1 mb-1 pr-1">
            <span className="text-[8px] text-blue-400 font-bold w-12 text-center">BACK</span>
            <span className="text-[8px] text-pink-400 font-bold w-12 text-center">LAY</span>
          </div>

          <div className="space-y-2">
            {liveMatches.map((m) => (
              <ExchangeMatchCard
                key={m.id}
                match={m}
                cellA={fluctuated[`${m.id}-A`]}
                cellB={fluctuated[`${m.id}-B`]}
                onOddsClick={handleOddsClick}
              />
            ))}
          </div>
        </div>
      )}

      {upcomingMatches.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-1">Upcoming Matches</h2>
          <div className="w-8 h-0.5 bg-primary rounded mb-3" />

          <div className="flex items-center justify-end gap-1 mb-1 pr-1">
            <span className="text-[8px] text-blue-400 font-bold w-12 text-center">BACK</span>
            <span className="text-[8px] text-pink-400 font-bold w-12 text-center">LAY</span>
          </div>

          <div className="space-y-2">
            {upcomingMatches.map((m) => (
              <ExchangeMatchCard
                key={m.id}
                match={m}
                cellA={fluctuated[`${m.id}-A`]}
                cellB={fluctuated[`${m.id}-B`]}
                onOddsClick={handleOddsClick}
              />
            ))}
          </div>
        </div>
      )}

      {betSlip && (
        <ExchangeBetSlip
          match={betSlip.match}
          team={betSlip.team}
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

function OddsButton({
  value,
  flash,
  variant,
  onClick,
}: {
  value: number;
  flash: "up" | "down" | "none";
  variant: "back" | "lay";
  onClick: () => void;
}) {
  const flashClass =
    flash === "up"
      ? "bg-success/40 text-success ring-1 ring-success/60"
      : flash === "down"
      ? "bg-destructive/40 text-destructive ring-1 ring-destructive/60"
      : variant === "back"
      ? "bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
      : "bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30";
  return (
    <button
      onClick={onClick}
      className={`w-14 py-1.5 rounded text-xs font-bold transition-all active:scale-95 ${flashClass}`}
    >
      <span className="flex items-center justify-center gap-0.5">
        {value.toFixed(2)}
        {flash === "up" && <TrendingUp size={8} />}
        {flash === "down" && <TrendingDown size={8} />}
      </span>
    </button>
  );
}

function ExchangeMatchCard({
  match,
  cellA,
  cellB,
  onOddsClick,
}: {
  match: GeneratedMatch;
  cellA?: OddCell;
  cellB?: OddCell;
  onOddsClick: (match: GeneratedMatch, team: string, type: "back" | "lay", odds: number) => void;
}) {
  const backA = cellA?.back.value ?? match.odds.back;
  const layA = cellA?.lay.value ?? match.odds.lay;
  const backB = cellB?.back.value ?? +(match.odds.lay * 0.95).toFixed(2);
  const layB = cellB?.lay.value ?? +(match.odds.back * 1.08).toFixed(2);

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm">{match.sportIcon}</span>
          <span className="text-[10px] font-bold text-primary">{match.sport}</span>
          <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">• {match.league}</span>
        </div>
        {match.isLive ? (
          <span className="text-[9px] bg-live text-live-foreground px-1.5 py-0.5 rounded font-bold animate-pulse-live">LIVE 🔴</span>
        ) : (
          <span className="text-[9px] text-muted-foreground">{match.time}</span>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{match.teamA}</p>
          {match.isLive && match.scoreA && (
            <p className="text-[10px] text-gold font-bold">{match.scoreA}</p>
          )}
        </div>
        <div className="flex gap-1">
          <OddsButton value={backA} flash={cellA?.back.flash ?? "none"} variant="back" onClick={() => onOddsClick(match, match.teamA, "back", backA)} />
          <OddsButton value={layA} flash={cellA?.lay.flash ?? "none"} variant="lay" onClick={() => onOddsClick(match, match.teamA, "lay", layA)} />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{match.teamB}</p>
          {match.isLive && match.scoreB && (
            <p className="text-[10px] text-gold font-bold">{match.scoreB}</p>
          )}
        </div>
        <div className="flex gap-1">
          <OddsButton value={backB} flash={cellB?.back.flash ?? "none"} variant="back" onClick={() => onOddsClick(match, match.teamB, "back", backB)} />
          <OddsButton value={layB} flash={cellB?.lay.flash ?? "none"} variant="lay" onClick={() => onOddsClick(match, match.teamB, "lay", layB)} />
        </div>
      </div>
    </div>
  );
}

export default GeneratedMatches;
