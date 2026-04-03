import { useState } from "react";
import { Search, X, Bell, Lock } from "lucide-react";

const sportFilters = ["All", "Cricket", "Football", "Tennis", "Kabaddi"];

interface InPlayMatch {
  id: string;
  title: string;
  date: string;
  badges: string[];
  odds: (string | null)[];
}

const inPlayMatches: InPlayMatch[] = [
  { id: "1", title: "Pakistan Super League", date: "26/03/26, 05:30 PM", badges: ["MO", "BM"], odds: [null, null, null, null, null, null] },
  { id: "2", title: "Hampshire Vs. Essex", date: "03/04/26, 03:30 PM", badges: ["P"], odds: [null, null, null, null, null, null] },
  { id: "3", title: "Somerset Vs. Nottinghamshire", date: "03/04/26, 03:30 PM", badges: ["P"], odds: [null, null, null, null, null, null] },
  { id: "4", title: "Lahore Qalandars V Multan Sultans", date: "03/04/26, 07:30 PM", badges: ["MO", "BM", "F"], odds: [null, "1.01", null, null, "1000.00", null] },
  { id: "5", title: "SOUTH AFRICA T10 V WEST INDIES T10", date: "03/04/26, 11:20 PM", badges: ["BM"], odds: [null, null, null, null, null, null] },
];

const InPlayPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pb-4">
      {/* Ticker */}
      <div className="flex items-center gap-2 px-3 py-2 bg-surface border-b border-border overflow-hidden">
        <Bell size={14} className="text-gold shrink-0" />
        <div className="overflow-hidden flex-1">
          <div className="animate-slide-marquee whitespace-nowrap text-xs text-gold font-medium">
            ASSEMBLY ELECTIONS 2026 BETTING NOW OPEN • IPL 2026 LIVE MATCHES • NEW MARKETS AVAILABLE
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

      {/* Sport filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-3">
        {sportFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              activeFilter === filter
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {filter === "Cricket" && "🏏"}
            {filter === "Football" && "⚽"}
            {filter === "Tennis" && "🎾"}
            {filter}
          </button>
        ))}
      </div>

      {/* CRICKET header */}
      <div className="mx-3 bg-surface rounded-t-lg px-3 py-2 flex items-center gap-2 border border-border">
        <span>🏏</span>
        <span className="text-xs font-bold text-foreground uppercase">Cricket</span>
      </div>

      {/* Matches */}
      <div className="mx-3 space-y-0">
        {inPlayMatches.map((match) => (
          <div key={match.id} className="bg-card border border-border border-t-0 px-3 py-3">
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
              <div className="flex gap-1">
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
                    odd ? "bg-secondary text-secondary-foreground" : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {odd ? (
                    <span className="font-bold">{odd}</span>
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
  );
};

export default InPlayPage;
