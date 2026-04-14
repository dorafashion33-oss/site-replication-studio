import { useState } from "react";
import { Zap } from "lucide-react";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";
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

          {/* Header */}
          <div className="flex items-center justify-end gap-1 mb-1 pr-1">
            <span className="text-[8px] text-blue-400 font-bold w-12 text-center">BACK</span>
            <span className="text-[8px] text-pink-400 font-bold w-12 text-center">LAY</span>
          </div>

          <div className="space-y-2">
            {liveMatches.map((m) => (
              <ExchangeMatchCard key={m.id} match={m} onOddsClick={handleOddsClick} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
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
              <ExchangeMatchCard key={m.id} match={m} onOddsClick={handleOddsClick} />
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

function ExchangeMatchCard({
  match,
  onOddsClick,
}: {
  match: GeneratedMatch;
  onOddsClick: (match: GeneratedMatch, team: string, type: "back" | "lay", odds: number) => void;
}) {
  const backOddsA = match.odds.back;
  const layOddsA = match.odds.lay;
  const backOddsB = +(layOddsA * 0.95).toFixed(2);
  const layOddsB = +(backOddsA * 1.08).toFixed(2);

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm">{match.sportIcon}</span>
          <span className="text-[10px] font-bold text-primary">{match.sport}</span>
          <span className="text-[10px] text-muted-foreground">• {match.league}</span>
        </div>
        {match.isLive ? (
          <span className="text-[9px] bg-live text-live-foreground px-1.5 py-0.5 rounded font-bold animate-pulse-live">LIVE 🔴</span>
        ) : (
          <span className="text-[9px] text-muted-foreground">{match.time}</span>
        )}
      </div>

      {/* Team A Row */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{match.teamA}</p>
          {match.isLive && match.scoreA && (
            <p className="text-[10px] text-gold font-bold">{match.scoreA}</p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onOddsClick(match, match.teamA, "back", backOddsA)}
            className="w-14 py-1.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-colors"
          >
            {backOddsA}
          </button>
          <button
            onClick={() => onOddsClick(match, match.teamA, "lay", layOddsA)}
            className="w-14 py-1.5 rounded bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold hover:bg-pink-500/30 transition-colors"
          >
            {layOddsA}
          </button>
        </div>
      </div>

      {/* Team B Row */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{match.teamB}</p>
          {match.isLive && match.scoreB && (
            <p className="text-[10px] text-gold font-bold">{match.scoreB}</p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onOddsClick(match, match.teamB, "back", backOddsB)}
            className="w-14 py-1.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-colors"
          >
            {backOddsB}
          </button>
          <button
            onClick={() => onOddsClick(match, match.teamB, "lay", layOddsB)}
            className="w-14 py-1.5 rounded bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold hover:bg-pink-500/30 transition-colors"
          >
            {layOddsB}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneratedMatches;
