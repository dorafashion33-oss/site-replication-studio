import { useState } from "react";
import { ArrowLeft, Lock, ChevronDown, ChevronUp } from "lucide-react";

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
}

const MatchDetailPage = ({ matchTitle, matchTime, onBack }: MatchDetailProps) => {
  const [liveScoreOpen, setLiveScoreOpen] = useState(false);

  const markets: Market[] = [
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
          <button className="px-4 py-2 bg-surface text-foreground text-xs font-bold rounded-lg border border-border">OPEN BETS (0)</button>
        </div>
      </div>

      {/* Live Score Accordion */}
      <button
        onClick={() => setLiveScoreOpen(!liveScoreOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/30 mx-0"
      >
        <span className="text-sm text-foreground font-medium">Live Score</span>
        {liveScoreOpen ? <ChevronUp size={18} className="text-foreground" /> : <ChevronDown size={18} className="text-foreground" />}
      </button>
      {liveScoreOpen && (
        <div className="bg-surface border border-border border-t-0 px-4 py-4 text-center">
          <span className="text-xs text-muted-foreground">Score will appear when match starts</span>
        </div>
      )}

      {/* Markets */}
      <div className="space-y-3 mt-3">
        {markets.map((market) => (
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
            {market.rows.map((row, idx) => (
              <div key={idx} className="flex items-center bg-card border-x border-border px-3 py-2">
                <span className="flex-1 text-xs text-foreground">{row.team}</span>
                {row.back.value ? (
                  <div className="w-16 mx-0.5 bg-blue-400/30 text-blue-300 rounded py-1 text-center">
                    <span className="text-xs font-bold">{row.back.value}</span>
                    {row.back.volume && <p className="text-[8px] text-blue-400/70">{row.back.volume}</p>}
                  </div>
                ) : (
                  <div className="w-16 mx-0.5 bg-muted/30 rounded py-2 flex items-center justify-center">
                    <Lock size={12} className="text-muted-foreground" />
                  </div>
                )}
                {row.lay.value ? (
                  <div className="w-16 mx-0.5 bg-pink-400/30 text-pink-300 rounded py-1 text-center">
                    <span className="text-xs font-bold">{row.lay.value}</span>
                    {row.lay.volume && <p className="text-[8px] text-pink-400/70">{row.lay.volume}</p>}
                  </div>
                ) : (
                  <div className="w-16 mx-0.5 bg-muted/30 rounded py-2 flex items-center justify-center">
                    <Lock size={12} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

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
    </div>
  );
};

export default MatchDetailPage;
