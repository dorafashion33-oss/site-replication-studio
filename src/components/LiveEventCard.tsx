import { Radio, Star, Lock } from "lucide-react";

interface LiveEvent {
  id: string;
  date: string;
  league: string;
  teamA: string;
  teamB: string;
  score?: string;
  odds?: (string | null)[];
  isLive?: boolean;
}

const mockEvents: LiveEvent[] = [
  {
    id: "1",
    date: "Apr 03 07:30 PM",
    league: "Pakistan / Pakistan Super League",
    teamA: "Lahore Qalandars",
    teamB: "Multan Sultans",
    score: "185 : 118",
    odds: ["185 : 118", null, null, "16.5"],
    isLive: true,
  },
  {
    id: "2",
    date: "Apr 03 03:30 PM",
    league: "England / County Championship",
    teamA: "Hampshire",
    teamB: "Essex",
    score: "0 : 219",
    odds: ["0 : 219", null, null, null],
    isLive: true,
  },
  {
    id: "3",
    date: "Apr 04 03:30 AM",
    league: "Women's ODI",
    teamA: "New Zealand W",
    teamB: "South Africa W",
    score: null,
    odds: ["1.73", "1.78", null, "2.28"],
    isLive: true,
  },
];

const LiveEvents = () => {
  return (
    <div className="px-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio size={18} className="text-primary animate-pulse-live" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Live Events</h2>
        </div>
      </div>

      <div className="space-y-2">
        {mockEvents.map((event) => (
          <div key={event.id} className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-card">
              <div>
                <span className="text-xs text-muted-foreground">{event.date}</span>
                <Radio size={12} className="inline ml-2 text-primary animate-pulse-live" />
              </div>
              <Star size={14} className="text-muted-foreground" />
            </div>
            <div className="px-3 py-1">
              <p className="text-[10px] text-muted-foreground">{event.league}</p>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-foreground flex-1 truncate">{event.teamA}</span>
              <span className="text-[10px] bg-border px-2 py-0.5 rounded text-muted-foreground mx-2">Vs</span>
              <span className="text-xs font-semibold text-foreground flex-1 truncate text-right">{event.teamB}</span>
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                <span className="flex-1 text-center">Score</span>
                <span className="flex-[2] text-center">1x2</span>
              </div>
              <div className="flex items-center gap-1">
                {event.odds?.map((odd, i) => (
                  <div
                    key={i}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded text-xs font-medium ${
                      odd
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {odd || <Lock size={12} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEvents;
