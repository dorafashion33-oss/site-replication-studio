import { Star, Radio } from "lucide-react";

interface Sport {
  id: string;
  label: string;
  count?: number;
  icon?: string;
}

const sports: Sport[] = [
  { id: "fav", label: "★", icon: "star" },
  { id: "live", label: "Live", icon: "live" },
  { id: "ipl", label: "IPL", count: 3 },
  { id: "cricket", label: "Cricket", count: 26 },
  { id: "soccer", label: "Soccer", count: 817 },
  { id: "tennis", label: "Tennis", count: 45 },
  { id: "kabaddi", label: "Kabaddi", count: 2 },
  { id: "basketball", label: "Basketball", count: 12 },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

const SportCategoryChips = ({ active, onChange }: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-3">
      {sports.map((sport) => {
        const isActive = active === sport.id;
        return (
          <button
            key={sport.id}
            onClick={() => onChange(sport.id)}
            className={`relative flex flex-col items-center gap-1 min-w-[64px] px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isActive
                ? "bg-primary text-primary-foreground border border-primary"
                : "bg-surface text-muted-foreground border border-border hover:border-primary/50"
            }`}
          >
            {sport.icon === "star" ? (
              <Star size={18} />
            ) : sport.icon === "live" ? (
              <Radio size={18} />
            ) : (
              <span className="text-base">🏏</span>
            )}
            <span>{sport.label}</span>
            {sport.count && (
              <span className={`absolute -top-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? "bg-gold text-warning-foreground" : "bg-primary/80 text-primary-foreground"
              }`}>
                {sport.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SportCategoryChips;
