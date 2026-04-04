import { useState } from "react";
import { Zap } from "lucide-react";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";
import BetModal from "./BetModal";

interface GeneratedMatchesProps {
  matches: GeneratedMatch[];
  balance: number;
  onPlaceBet: (matchId: string, matchTitle: string, team: string, amount: number) => any;
}

const GeneratedMatches = ({ matches, balance, onPlaceBet }: GeneratedMatchesProps) => {
  const [betMatch, setBetMatch] = useState<GeneratedMatch | null>(null);
  const liveMatches = matches.filter((m) => m.isLive);
  const upcomingMatches = matches.filter((m) => !m.isLive);

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
          <div className="space-y-2">
            {liveMatches.map((m) => (
              <MatchCard key={m.id} match={m} onBet={() => setBetMatch(m)} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcomingMatches.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-1">Upcoming Matches</h2>
          <div className="w-8 h-0.5 bg-primary rounded mb-3" />
          <div className="space-y-2">
            {upcomingMatches.map((m) => (
              <MatchCard key={m.id} match={m} onBet={() => setBetMatch(m)} />
            ))}
          </div>
        </div>
      )}

      {betMatch && (
        <BetModal match={betMatch} balance={balance} onClose={() => setBetMatch(null)} onPlaceBet={onPlaceBet} />
      )}
    </div>
  );
};

function MatchCard({ match, onBet }: { match: GeneratedMatch; onBet: () => void }) {
  return (
    <div className="bg-surface rounded-lg border border-border p-3 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{match.sportIcon}</span>
          <span className="text-[10px] font-bold text-primary">{match.sport}</span>
          <span className="text-[10px] text-muted-foreground">• {match.league}</span>
        </div>
        {match.isLive ? (
          <span className="text-[9px] bg-live text-live-foreground px-1.5 py-0.5 rounded font-bold animate-pulse-live">LIVE 🔴</span>
        ) : (
          <span className="text-[9px] text-muted-foreground">{match.time}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{match.teamA}</p>
          {match.isLive && match.scoreA && <p className="text-[10px] text-gold font-bold">{match.scoreA}</p>}
        </div>
        <span className="text-[10px] text-muted-foreground font-bold mx-2">VS</span>
        <div className="flex-1 text-right">
          <p className="text-xs font-semibold text-foreground">{match.teamB}</p>
          {match.isLive && match.scoreB && <p className="text-[10px] text-gold font-bold">{match.scoreB}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <div className="flex gap-2">
          <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-1 rounded font-bold">Back {match.odds.back}</span>
          <span className="text-[10px] bg-pink-400/20 text-pink-300 px-2 py-1 rounded font-bold">Lay {match.odds.lay}</span>
        </div>
        <button onClick={onBet} className="text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded font-bold hover:opacity-90 transition-opacity">
          Place Bet
        </button>
      </div>
    </div>
  );
}

export default GeneratedMatches;
