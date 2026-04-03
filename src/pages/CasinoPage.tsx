import { useState } from "react";
import { Search, X, Disc3, Zap, Layers, Dice1 } from "lucide-react";
import casinoBanner from "@/assets/casino-banner.jpg";

const tabs = ["ALL", "RECENT", "POPULAR", "LIVE CASINO"];
const categories = [
  { id: "dragon", label: "Dragon Tiger", icon: Disc3 },
  { id: "lightning", label: "Lightning", icon: Zap },
  { id: "baccarat", label: "Baccarat", icon: Layers },
  { id: "sic-bo", label: "Live Sic Bo", icon: Dice1 },
];

const games = Array.from({ length: 12 }, (_, i) => ({
  id: `game-${i}`,
  name: `Casino Game ${i + 1}`,
  image: casinoBanner,
}));

const CasinoPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeCategory, setActiveCategory] = useState("dragon");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <Disc3 size={18} className="text-primary" />
          <span className="text-sm font-bold text-foreground uppercase">Casino</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search games"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground w-32 focus:outline-none focus:border-primary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-1 top-1/2 -translate-y-1/2">
              <X size={12} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg text-xs font-medium border transition-all min-w-[80px] ${
              activeCategory === cat.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground bg-surface hover:border-primary/40"
            }`}
          >
            <cat.icon size={22} />
            <span className="text-center leading-tight">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-4 gap-1.5 px-3">
        {games.map((game) => (
          <div key={game.id} className="relative rounded-lg overflow-hidden aspect-square group cursor-pointer">
            <img
              src={game.image}
              alt={game.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
              <span className="text-[8px] text-foreground font-medium truncate">{game.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasinoPage;
