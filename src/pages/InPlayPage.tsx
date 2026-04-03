import { useState } from "react";
import { X, Bell, Lock } from "lucide-react";

const sportFilters = [
  { id: "all", label: "All", icon: "" },
  { id: "cricket", label: "Cricket", icon: "🏏" },
  { id: "football", label: "Football", icon: "⚽" },
  { id: "tennis", label: "Tennis", icon: "🎾" },
  { id: "kabaddi", label: "Kabaddi", icon: "🤼" },
  { id: "basketball", label: "Basketball", icon: "🏀" },
];

interface InPlayMatch {
  id: string;
  title: string;
  date: string;
  badges: string[];
  odds: (string | null)[];
  hasTv?: boolean;
  sport: string;
}

const allMatches: InPlayMatch[] = [
  { id: "1", sport: "cricket", title: "Pakistan Super League", date: "26/03/26, 05:30 PM", badges: ["MO", "BM"], odds: [null, null, null, null, null, null], hasTv: false },
  { id: "2", sport: "cricket", title: "Hampshire Vs. Essex", date: "03/04/26, 03:30 PM", badges: ["P"], odds: [null, null, null, null, null, null], hasTv: true },
  { id: "3", sport: "cricket", title: "Somerset Vs. Nottinghamshire", date: "03/04/26, 03:30 PM", badges: ["P"], odds: [null, null, null, null, null, null], hasTv: true },
  { id: "4", sport: "cricket", title: "Lahore Qalandars V Multan Sultans", date: "03/04/26, 07:30 PM", badges: ["MO", "BM", "F"], odds: [null, "1.01", null, null, "1000.00", null], hasTv: true },
  { id: "5", sport: "cricket", title: "SOUTH AFRICA T10 V WEST INDIES T10", date: "03/04/26, 11:20 PM", badges: ["BM"], odds: [null, null, null, null, null, null] },
  { id: "6", sport: "cricket", title: "New Zealand W V South Africa W", date: "04/04/26, 03:30 AM", badges: ["MO", "BM", "F"], odds: ["1.73", "1.78", null, null, "2.28", "2.38"], hasTv: true },
  { id: "7", sport: "football", title: "Barcelona Vs Inter Milan", date: "04/04/26, 12:30 AM", badges: ["MO", "BM"], odds: ["1.85", "1.90", "3.50", "3.60", "4.20", "4.40"] },
  { id: "8", sport: "football", title: "Arsenal Vs Real Madrid", date: "04/04/26, 12:30 AM", badges: ["MO", "BM", "F"], odds: ["2.10", "2.15", "3.30", "3.40", "3.50", "3.60"] },
  { id: "9", sport: "tennis", title: "Le Tien V Burruchaga", date: "03/04/26, 10:30 PM", badges: ["MO"], odds: ["1.45", "2.80", null, null, "1.90", "1.95"] },
  { id: "10", sport: "tennis", title: "Djokovic V Alcaraz", date: "04/04/26, 02:00 AM", badges: ["MO", "BM"], odds: ["1.60", "1.65", null, null, "2.40", "2.50"] },
  { id: "11", sport: "kabaddi", title: "Patna Pirates V Jaipur Pink Panthers", date: "03/04/26, 08:00 PM", badges: ["MO", "BM"], odds: ["1.80", "1.85", null, null, "2.10", "2.15"] },
  { id: "12", sport: "basketball", title: "Lakers V Warriors", date: "04/04/26, 06:30 AM", badges: ["MO"], odds: ["1.90", "1.95", null, null, "1.95", "2.00"] },
];

const liveChips = [
  "New Zealand W v South Africa W",
  "Le Tien v Burruchaga",
  "Lahore Qalandars v Multan Sultans",
  "Barcelona v Inter Milan",
];

interface InPlayPageProps {
  onMatchClick?: (matchId: string) => void;
}

const InPlayPage = ({ onMatchClick }: InPlayPageProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allMatches.filter((m) => {
    if (activeFilter !== "all" && m.sport !== activeFilter) return false;
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sportGroups = filtered.reduce<Record<string, InPlayMatch[]>>((acc, m) => {
    acc[m.sport] = acc[m.sport] || [];
    acc[m.sport].push(m);
    return acc;
  }, {});

  const sportIcons: Record<string, string> = { cricket: "🏏", football: "⚽", tennis: "🎾", kabaddi: "🤼", basketball: "🏀" };

  return (
    <div className="pb-4">
      {/* Ticker */}
      <div className="flex items-center gap-2 px-3 py-2 bg-surface border-b border-border overflow-hidden">
        <Bell size={14} className="text-gold shrink-0" />
        <div className="overflow-hidden flex-1">
          <div className="animate-slide-marquee whitespace-nowrap text-xs text-gold font-medium">
            ASSEMBLY ELECTIONS 2026 BETTING NOW OPEN • IPL 2026 LIVE MATCHES • NEW MARKETS AVAILABLE • PLAY CASINO & WIN BIG
          </div>
        </div>
        <div className="relative shrink-0">
          <input
            type="text"
            placeholder="search events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground w-28 focus:outline-none focus:border-primary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-1 top-1/2 -translate-y-1/2">
              <X size={12} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Live match chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2">
        {liveChips.map((chip) => (
          <button key={chip} className="shrink-0 px-3 py-1.5 bg-primary/20 border border-primary/40 rounded text-[10px] text-primary font-medium whitespace-nowrap">
            {chip}
          </button>
        ))}
      </div>

      {/* Sport filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2">
        {sportFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              activeFilter === filter.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {filter.icon && <span>{filter.icon}</span>}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Match Groups */}
      {Object.entries(sportGroups).map(([sport, sportMatches]) => (
        <div key={sport}>
          <div className="mx-3 bg-surface rounded-t-lg px-3 py-2 flex items-center gap-2 border border-border mt-2">
            <span>{sportIcons[sport] || "🏆"}</span>
            <span className="text-xs font-bold text-foreground uppercase">{sport}</span>
          </div>
          <div className="mx-3 space-y-0">
            {sportMatches.map((match) => (
              <div
                key={match.id}
                className="bg-card border border-border border-t-0 px-3 py-3 cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => onMatchClick?.(match.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{match.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">({match.date})</span>
                      <span className="text-[8px] bg-live text-live-foreground px-1 py-0.5 rounded font-bold animate-pulse-live">
                        LIVE
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    {match.hasTv && (
                      <span className="text-[9px] bg-surface text-foreground w-5 h-5 rounded-full flex items-center justify-center border border-border">📺</span>
                    )}
                    {match.badges.map((b) => (
                      <span key={b} className="text-[9px] bg-primary/80 text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {match.odds.map((odd, i) => (
                    <div
                      key={i}
                      className={`flex-1 flex flex-col items-center py-1.5 rounded text-[10px] ${
                        odd ? (i % 2 === 0 ? "bg-blue-400/20 text-blue-300" : "bg-pink-400/20 text-pink-300") : "bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      {odd ? <span className="font-bold">{odd}</span> : <Lock size={10} />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InPlayPage;
