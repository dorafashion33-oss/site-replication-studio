import { useState } from "react";
import { Star, Radio, ChevronRight } from "lucide-react";

interface SportItem {
  id: string;
  label: string;
  icon: string;
  count: number;
  leagues?: { name: string; matches: number }[];
}

const sports: SportItem[] = [
  { id: "cricket", label: "Cricket", icon: "🏏", count: 26, leagues: [
    { name: "IPL 2026", matches: 3 },
    { name: "Pakistan Super League", matches: 2 },
    { name: "County Championship", matches: 4 },
    { name: "Women's ODI", matches: 1 },
    { name: "T20 World Cup Qualifiers", matches: 5 },
    { name: "Big Bash League", matches: 3 },
    { name: "Caribbean Premier League", matches: 2 },
    { name: "South Africa T10", matches: 1 },
    { name: "Bangladesh Premier League", matches: 2 },
    { name: "India vs England Test", matches: 3 },
  ]},
  { id: "soccer", label: "Soccer", icon: "⚽", count: 817, leagues: [
    { name: "UEFA Champions League", matches: 8 },
    { name: "English Premier League", matches: 10 },
    { name: "La Liga", matches: 10 },
    { name: "Serie A", matches: 10 },
    { name: "Bundesliga", matches: 9 },
    { name: "Ligue 1", matches: 10 },
    { name: "FIFA World Cup Qualifiers", matches: 25 },
    { name: "Indian Super League", matches: 4 },
  ]},
  { id: "tennis", label: "Tennis", icon: "🎾", count: 45, leagues: [
    { name: "ATP Houston Open", matches: 8 },
    { name: "WTA Charleston", matches: 6 },
    { name: "ATP Monte Carlo Masters", matches: 12 },
    { name: "ITF Pro Circuit", matches: 19 },
  ]},
  { id: "kabaddi", label: "Kabaddi", icon: "🤼", count: 4, leagues: [
    { name: "Pro Kabaddi League", matches: 4 },
  ]},
  { id: "basketball", label: "Basketball", icon: "🏀", count: 32, leagues: [
    { name: "NBA", matches: 15 },
    { name: "EuroLeague", matches: 8 },
    { name: "NBL Australia", matches: 4 },
    { name: "CBA China", matches: 5 },
  ]},
  { id: "table-tennis", label: "Table Tennis", icon: "🏓", count: 18, leagues: [
    { name: "WTT Champions", matches: 8 },
    { name: "Pro League", matches: 10 },
  ]},
  { id: "horse-racing", label: "Horse Racing", icon: "🏇", count: 12, leagues: [
    { name: "UK Racing", matches: 6 },
    { name: "Irish Racing", matches: 4 },
    { name: "Australian Racing", matches: 2 },
  ]},
  { id: "politics", label: "Politics", icon: "🏛️", count: 5, leagues: [
    { name: "Assembly Elections 2026", matches: 3 },
    { name: "US Elections", matches: 2 },
  ]},
  { id: "esports", label: "E-Sports", icon: "🎮", count: 15, leagues: [
    { name: "CS2 Major", matches: 8 },
    { name: "Dota 2 International", matches: 4 },
    { name: "League of Legends Worlds", matches: 3 },
  ]},
];

const topChips = [
  { id: "fav", label: "★", type: "icon" },
  { id: "live", label: "Live", type: "live" },
  { id: "ipl", label: "IPL", count: 3 },
];

interface SportsPageProps {
  onMatchClick?: (matchId: string) => void;
}

const SportsPage = ({ onMatchClick }: SportsPageProps) => {
  const [activeSport, setActiveSport] = useState<string | null>(null);

  return (
    <div className="pb-4">
      {/* Top Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-3">
        {topChips.map((chip) => (
          <button key={chip.id} className="shrink-0 flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium bg-surface text-muted-foreground border border-border hover:border-primary/50">
            {chip.type === "icon" && <Star size={14} className="text-gold" />}
            {chip.type === "live" && <Radio size={14} className="text-live animate-pulse-live" />}
            <span>{chip.label}</span>
            {chip.count && <span className="text-[9px] bg-primary/80 text-primary-foreground px-1.5 py-0.5 rounded-full font-bold ml-1">{chip.count}</span>}
          </button>
        ))}
      </div>

      {/* Sports List */}
      <div className="mx-3 space-y-1">
        {sports.map((sport) => (
          <div key={sport.id}>
            <button
              onClick={() => setActiveSport(activeSport === sport.id ? null : sport.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                activeSport === sport.id
                  ? "bg-primary/10 border border-primary/40"
                  : "bg-surface border border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{sport.icon}</span>
                <span className="text-sm font-semibold text-foreground">{sport.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                  {sport.count}
                </span>
                <ChevronRight size={14} className={`text-muted-foreground transition-transform ${activeSport === sport.id ? "rotate-90" : ""}`} />
              </div>
            </button>

            {/* Leagues */}
            {activeSport === sport.id && sport.leagues && (
              <div className="ml-4 mt-1 space-y-0.5">
                {sport.leagues.map((league) => (
                  <button
                    key={league.name}
                    onClick={() => onMatchClick?.("league")}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-card border border-border rounded hover:bg-surface/50 transition-colors"
                  >
                    <span className="text-xs text-foreground">{league.name}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">{league.matches}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsPage;
