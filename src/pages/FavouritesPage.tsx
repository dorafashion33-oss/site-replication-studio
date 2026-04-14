import { ArrowLeft, Star, Heart } from "lucide-react";

interface FavouritesPageProps {
  onBack: () => void;
}

const favouriteMatches = [
  { id: "1", sport: "🏏", title: "India vs Australia", league: "ICC Test Championship", time: "Tomorrow 09:30 AM" },
  { id: "2", sport: "⚽", title: "Barcelona vs Real Madrid", league: "La Liga", time: "Sat 12:30 AM" },
  { id: "3", sport: "🎾", title: "Djokovic vs Alcaraz", league: "ATP Masters", time: "Today 10:00 PM" },
  { id: "4", sport: "🏏", title: "CSK vs MI", league: "IPL 2026", time: "Tomorrow 07:30 PM" },
  { id: "5", sport: "⚽", title: "Arsenal vs Liverpool", league: "Premier League", time: "Sun 08:00 PM" },
];

const FavouritesPage = ({ onBack }: FavouritesPageProps) => {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <h2 className="text-sm font-bold text-foreground">Favourites</h2>
      </div>

      <div className="px-3 mt-3 space-y-2">
        {favouriteMatches.map((m) => (
          <div key={m.id} className="bg-surface border border-border rounded-lg p-3 flex items-center gap-3">
            <span className="text-2xl">{m.sport}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">{m.title}</p>
              <p className="text-[10px] text-primary">{m.league}</p>
              <p className="text-[10px] text-muted-foreground">{m.time}</p>
            </div>
            <Heart size={16} className="text-destructive fill-destructive" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouritesPage;
