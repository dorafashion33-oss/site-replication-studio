import { Trophy, Radio, Home, Disc3, User } from "lucide-react";

export type TabId = "sportsbook" | "inplay" | "home" | "casino" | "preferences";

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; icon: typeof Home; label: string }[] = [
  { id: "sportsbook", icon: Trophy, label: "Sportsbook" },
  { id: "inplay", icon: Radio, label: "In-play" },
  { id: "home", icon: Home, label: "Home" },
  { id: "casino", icon: Disc3, label: "Casino" },
  { id: "preferences", icon: User, label: "Preferences" },
];

const BottomNav = ({ active, onChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around py-1">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all text-xs ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={isActive ? "font-semibold" : "font-normal"}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
