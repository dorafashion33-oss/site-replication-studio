import { useEffect, useState } from "react";
import { X, Volume2, Maximize2, Wifi } from "lucide-react";

interface LiveStreamModalProps {
  matchTitle: string;
  sport?: string;
  onClose: () => void;
}

const COMMENTARY_LINES = [
  "🎙️ And he's coming in to bowl...",
  "💥 FOUR! Beautifully timed through the covers!",
  "👏 Great line and length, no run there.",
  "⚡ Quick single, the batsmen are running well.",
  "🔥 SIX! That's massive! Cleared the boundary with ease!",
  "🛑 Dot ball, excellent bowling under pressure.",
  "⚠️ Appeal for LBW... not given!",
  "🎯 Edge! But it falls safely in front of slip.",
  "🏏 Two runs taken, good running between the wickets.",
  "👀 Fielder dives... saves the boundary brilliantly!",
  "⚔️ Bouncer! Batsman ducks under it.",
  "📊 Run rate climbing nicely now.",
];

const LiveStreamModal = ({ matchTitle, sport = "Cricket", onClose }: LiveStreamModalProps) => {
  const [commentary, setCommentary] = useState<string[]>([COMMENTARY_LINES[0]]);
  const [streamTime, setStreamTime] = useState(0);

  useEffect(() => {
    const commInt = setInterval(() => {
      const line = COMMENTARY_LINES[Math.floor(Math.random() * COMMENTARY_LINES.length)];
      setCommentary((c) => [line, ...c].slice(0, 8));
    }, 2200);
    const timeInt = setInterval(() => setStreamTime((t) => t + 1), 1000);
    return () => {
      clearInterval(commInt);
      clearInterval(timeInt);
    };
  }, []);

  const mm = String(Math.floor(streamTime / 60)).padStart(2, "0");
  const ss = String(streamTime % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 animate-fade-in p-3" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card rounded-2xl border border-border overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-live animate-pulse" />
            <span className="text-[10px] font-bold text-live">LIVE</span>
            <span className="text-xs font-bold text-foreground truncate max-w-[160px]">{matchTitle}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Faux Video Player */}
        <div className="relative aspect-video bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 overflow-hidden">
          {/* Stadium grid lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60" />
          </div>

          {/* Animated players (dots) */}
          <div className="absolute top-[40%] left-[30%] w-2.5 h-2.5 rounded-full bg-blue-400 shadow-lg animate-pulse" />
          <div className="absolute top-[55%] left-[55%] w-2.5 h-2.5 rounded-full bg-red-400 shadow-lg animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="absolute top-[35%] left-[60%] w-2.5 h-2.5 rounded-full bg-blue-400 shadow-lg animate-pulse" style={{ animationDelay: "0.6s" }} />
          <div className="absolute top-[60%] left-[35%] w-2.5 h-2.5 rounded-full bg-blue-400 shadow-lg animate-pulse" style={{ animationDelay: "0.9s" }} />
          <div className="absolute top-[50%] left-[48%] w-2 h-2 rounded-full bg-yellow-300 animate-bounce" />

          {/* Top overlay */}
          <div className="absolute top-0 inset-x-0 p-2 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-live text-live-foreground px-1.5 py-0.5 rounded font-black animate-pulse-live">● LIVE</span>
              <span className="text-[10px] text-white font-mono">{mm}:{ss}</span>
            </div>
            <span className="text-[10px] text-white/80">{sport}</span>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 inset-x-0 p-2 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-white/80" />
              <div className="w-16 h-1 bg-white/30 rounded">
                <div className="w-3/4 h-full bg-white rounded" />
              </div>
            </div>
            <span className="text-[10px] text-white/70 font-mono">HD • 720p</span>
            <Maximize2 size={14} className="text-white/80" />
          </div>

          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-3xl font-black tracking-widest pointer-events-none select-none">
            DEMO
          </div>
        </div>

        {/* Commentary feed */}
        <div className="bg-surface px-3 py-2 max-h-44 overflow-y-auto">
          <p className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">🎙️ Live Commentary</p>
          <div className="space-y-1">
            {commentary.map((line, i) => (
              <p
                key={`${i}-${line}`}
                className={`text-xs ${i === 0 ? "text-foreground font-semibold animate-fade-in" : "text-muted-foreground"}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="px-3 py-2 bg-card border-t border-border">
          <p className="text-[9px] text-muted-foreground text-center">
            Demo stream • For entertainment only • No real broadcast
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamModal;
