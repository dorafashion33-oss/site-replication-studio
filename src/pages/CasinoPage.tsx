import { useState } from "react";
import { Search, X, Disc3 } from "lucide-react";
import casinoBanner from "@/assets/casino-banner.jpg";

const tabs = ["ALL", "FANTASY11", "MAC88 LIVE", "MAC88 LIVE PREDICTION", "RECENT", "POPULAR"];

const categories = [
  { id: "dragon", label: "Dragon Tiger", emoji: "🐉" },
  { id: "lightning", label: "Lightning", emoji: "⚡" },
  { id: "baccarat", label: "Baccarat", emoji: "🃏" },
  { id: "sic-bo", label: "Live Sic Bo", emoji: "🎲" },
  { id: "roulette", label: "Roulette", emoji: "🎡" },
  { id: "blackjack", label: "Blackjack", emoji: "♠️" },
  { id: "poker", label: "Poker", emoji: "🂡" },
  { id: "andar-bahar", label: "Andar Bahar", emoji: "🎴" },
];

const gamesByCategory: Record<string, { id: string; name: string }[]> = {
  dragon: [
    { id: "dt1", name: "Dragon Tiger" },
    { id: "dt2", name: "Dragon Tiger Lion" },
    { id: "dt3", name: "1 Day Dragon Tiger" },
    { id: "dt4", name: "Dragon Tiger 2" },
    { id: "dt5", name: "20-20 DTL" },
    { id: "dt6", name: "Virtual Dragon Tiger" },
    { id: "dt7", name: "Dragon Tiger One Day" },
    { id: "dt8", name: "Sassy Dragon Tiger" },
    { id: "dt9", name: "Dragon Tiger Classic" },
    { id: "dt10", name: "Dragon Tiger Night" },
    { id: "dt11", name: "Dragon Tiger 2 Pro" },
    { id: "dt12", name: "Dragon Tiger KingMidas" },
    { id: "dt13", name: "Dragon Tiger D60" },
    { id: "dt14", name: "Dragon Tiger Lion Pro" },
    { id: "dt15", name: "Lightning Dragon Tiger" },
  ],
  lightning: [
    { id: "lt1", name: "Lightning Roulette" },
    { id: "lt2", name: "Lightning Dice" },
    { id: "lt3", name: "Lightning Baccarat" },
    { id: "lt4", name: "Lightning Blackjack" },
    { id: "lt5", name: "Lightning Storm" },
    { id: "lt6", name: "Lightning Ball" },
    { id: "lt7", name: "XXXtreme Lightning" },
    { id: "lt8", name: "Lightning Dragon Tiger" },
  ],
  baccarat: [
    { id: "bc1", name: "Speed Baccarat" },
    { id: "bc2", name: "Baccarat Classic" },
    { id: "bc3", name: "No Commission Baccarat" },
    { id: "bc4", name: "Baccarat Squeeze" },
    { id: "bc5", name: "Golden Wealth Baccarat" },
    { id: "bc6", name: "Salon Privé Baccarat" },
    { id: "bc7", name: "VIP Baccarat" },
    { id: "bc8", name: "Baccarat Pro" },
    { id: "bc9", name: "Super 6 Baccarat" },
    { id: "bc10", name: "Prosperity Baccarat" },
  ],
  "sic-bo": [
    { id: "sb1", name: "Live Sic Bo" },
    { id: "sb2", name: "Super Sic Bo" },
    { id: "sb3", name: "Mega Sic Bo" },
    { id: "sb4", name: "Sic Bo Classic" },
    { id: "sb5", name: "Lightning Sic Bo" },
    { id: "sb6", name: "Golden Sic Bo" },
  ],
  roulette: [
    { id: "rl1", name: "Auto Roulette" },
    { id: "rl2", name: "Speed Roulette" },
    { id: "rl3", name: "Immersive Roulette" },
    { id: "rl4", name: "Hindi Roulette" },
    { id: "rl5", name: "Double Ball Roulette" },
    { id: "rl6", name: "VIP Roulette" },
    { id: "rl7", name: "French Roulette" },
    { id: "rl8", name: "European Roulette" },
    { id: "rl9", name: "American Roulette" },
    { id: "rl10", name: "Mega Fire Roulette" },
  ],
  blackjack: [
    { id: "bj1", name: "Classic Blackjack" },
    { id: "bj2", name: "Speed Blackjack" },
    { id: "bj3", name: "Infinite Blackjack" },
    { id: "bj4", name: "Power Blackjack" },
    { id: "bj5", name: "Free Bet Blackjack" },
    { id: "bj6", name: "VIP Blackjack" },
    { id: "bj7", name: "Lightning Blackjack" },
    { id: "bj8", name: "Salon Privé Blackjack" },
  ],
  poker: [
    { id: "pk1", name: "Casino Hold'em" },
    { id: "pk2", name: "Three Card Poker" },
    { id: "pk3", name: "Ultimate Texas Hold'em" },
    { id: "pk4", name: "Caribbean Stud Poker" },
    { id: "pk5", name: "Side Bet City" },
    { id: "pk6", name: "Teen Patti" },
  ],
  "andar-bahar": [
    { id: "ab1", name: "Andar Bahar" },
    { id: "ab2", name: "Andar Bahar Live" },
    { id: "ab3", name: "OTT Andar Bahar" },
    { id: "ab4", name: "Super Andar Bahar" },
    { id: "ab5", name: "Speed Andar Bahar" },
    { id: "ab6", name: "Bollywood Andar Bahar" },
  ],
};

// Color themes for game cards
const cardColors = [
  "from-blue-900/80 to-purple-900/80",
  "from-emerald-900/80 to-teal-900/80",
  "from-red-900/80 to-orange-900/80",
  "from-violet-900/80 to-indigo-900/80",
  "from-amber-900/80 to-yellow-900/80",
  "from-cyan-900/80 to-blue-900/80",
  "from-pink-900/80 to-rose-900/80",
  "from-lime-900/80 to-green-900/80",
];

const CasinoPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeCategory, setActiveCategory] = useState("dragon");
  const [searchQuery, setSearchQuery] = useState("");

  const games = gamesByCategory[activeCategory] || gamesByCategory.dragon;
  const filteredGames = searchQuery
    ? games.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : games;

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
            className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground w-36 focus:outline-none focus:border-primary"
          />
          {searchQuery ? (
            <button onClick={() => setSearchQuery("")} className="absolute right-1 top-1/2 -translate-y-1/2">
              <X size={12} className="text-muted-foreground" />
            </button>
          ) : (
            <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
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
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-center leading-tight">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-4 gap-1.5 px-3">
        {filteredGames.map((game, idx) => (
          <div key={game.id} className="relative rounded-lg overflow-hidden aspect-square group cursor-pointer">
            <img
              src={casinoBanner}
              alt={game.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${cardColors[idx % cardColors.length]} flex flex-col items-center justify-end p-1.5`}>
              <span className="text-lg mb-1">{categories.find(c => c.id === activeCategory)?.emoji || "🎮"}</span>
              <span className="text-[7px] text-foreground font-bold text-center leading-tight drop-shadow-md">
                {game.name.toUpperCase()}
              </span>
            </div>
            {/* Provider badge */}
            <div className="absolute top-1 right-1 bg-background/60 rounded px-1 py-0.5">
              <span className="text-[6px] text-primary font-bold">MAC88</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Games Floating Button */}
      <div className="fixed bottom-20 left-3 z-40">
        <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
          <span className="text-2xl">🎲</span>
        </div>
        <span className="text-[8px] text-primary font-bold text-center block mt-0.5">MINI GAMES</span>
      </div>
    </div>
  );
};

export default CasinoPage;
