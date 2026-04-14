import { useState } from "react";
import { ArrowLeft, Search, Clock, TrendingUp } from "lucide-react";

interface SearchPageProps {
  onBack: () => void;
  onMatchClick?: (matchId: string) => void;
}

const trendingSearches = ["IPL 2026", "Barcelona", "Djokovic", "India vs Australia", "Premier League", "PSL", "Teen Patti", "Dragon Tiger"];

const allSearchItems = [
  { id: "s1", type: "match", sport: "🏏", title: "India vs Australia", league: "ICC Test", time: "Tomorrow" },
  { id: "s2", type: "match", sport: "🏏", title: "CSK vs MI", league: "IPL 2026", time: "Tomorrow 7:30 PM" },
  { id: "s3", type: "match", sport: "🏏", title: "RCB vs KKR", league: "IPL 2026", time: "Fri 7:30 PM" },
  { id: "s4", type: "match", sport: "⚽", title: "Barcelona vs Inter Milan", league: "UCL", time: "Today 12:30 AM" },
  { id: "s5", type: "match", sport: "⚽", title: "Arsenal vs Real Madrid", league: "UCL", time: "Today 12:30 AM" },
  { id: "s6", type: "match", sport: "🎾", title: "Djokovic vs Alcaraz", league: "ATP Masters", time: "Today 10 PM" },
  { id: "s7", type: "casino", sport: "🎰", title: "Dragon Tiger", league: "Casino", time: "Available" },
  { id: "s8", type: "casino", sport: "🃏", title: "Teen Patti", league: "Casino", time: "Available" },
  { id: "s9", type: "match", sport: "🏏", title: "Pakistan Super League", league: "PSL 2026", time: "Live" },
  { id: "s10", type: "match", sport: "⚽", title: "Premier League", league: "EPL", time: "Multiple matches" },
];

const SearchPage = ({ onBack, onMatchClick }: SearchPageProps) => {
  const [query, setQuery] = useState("");

  const filtered = query.length > 0
    ? allSearchItems.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.league.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search matches, sports, casino games..."
            className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      {query.length === 0 ? (
        <div className="px-3 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-primary" />
            <span className="text-xs font-bold text-foreground">Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((s) => (
              <button key={s} onClick={() => setQuery(s)}
                className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-3 mt-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <Search size={40} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
            </div>
          ) : (
            filtered.map((item) => (
              <button key={item.id} onClick={() => onMatchClick?.(item.id)}
                className="w-full flex items-center gap-3 p-3 bg-surface border border-border rounded-lg hover:border-primary/40 transition-all text-left">
                <span className="text-xl">{item.sport}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">{item.title}</p>
                  <p className="text-[10px] text-primary">{item.league}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
