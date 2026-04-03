import { Lock } from "lucide-react";

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

interface TopMatchesProps {
  onMatchClick?: (matchId: string) => void;
}

const TopMatches = ({ onMatchClick }: TopMatchesProps) => {
  return (
    <div className="px-3">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-1">Top Matches</h2>
      <div className="w-8 h-0.5 bg-primary rounded mb-3" />

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-surface rounded-lg border border-border w-[300px] shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
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
              <div className="flex gap-1 px-3 pb-3 pt-1">
                {match.odds.map((odd, i) => (
                  <div
                    key={i}
                    className={`flex-1 flex flex-col items-center py-1.5 rounded text-[10px] ${
                      odd.value ? (i % 2 === 0 ? "bg-blue-400/20 text-blue-300" : "bg-pink-400/20 text-pink-300") : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {odd.value ? (
                      <>
                        <span className="font-bold">{odd.value}</span>
                        {odd.volume && <span className="text-[8px] opacity-70">{odd.volume}</span>}
                      </>
                    ) : (
                      <Lock size={10} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMatches;
