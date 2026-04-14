import { X, Home, PlayCircle, FileText, Star, Search, Globe, ShieldCheck, LogOut, LogIn, UserPlus, BarChart3 } from "lucide-react";

export type MenuPage = "mybets" | "results" | "favourites" | "search" | "language" | "terms" | "login" | "signup" | null;

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: MenuPage) => void;
  onTabChange?: (tab: string) => void;
}

const menuItems: { icon: typeof Home; label: string; page?: MenuPage; tab?: string; badge?: string }[] = [
  { icon: Home, label: "Home", tab: "home" },
  { icon: PlayCircle, label: "Inplay", tab: "inplay", badge: "LIVE" },
  { icon: FileText, label: "My Bets", page: "mybets" },
  { icon: BarChart3, label: "Results", page: "results" },
  { icon: Star, label: "Favourites", page: "favourites" },
  { icon: Search, label: "Search", page: "search" },
  { icon: Globe, label: "Language : EN", page: "language" },
  { icon: ShieldCheck, label: "Terms & Policy", page: "terms" },
];

const SideMenu = ({ open, onClose, onNavigate, onTabChange }: SideMenuProps) => {
  if (!open) return null;

  const handleClick = (item: typeof menuItems[0]) => {
    if (item.tab && onTabChange) {
      onTabChange(item.tab);
      onClose();
    } else if (item.page) {
      onNavigate(item.page);
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-card border-l border-primary shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold text-foreground">Menu</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Login/Signup buttons */}
        <div className="flex gap-2 p-3 border-b border-border">
          <button onClick={() => { onNavigate("login"); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold">
            <LogIn size={14} /> Login
          </button>
          <button onClick={() => { onNavigate("signup"); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface text-foreground border border-border rounded-lg text-xs font-bold">
            <UserPlus size={14} /> Sign Up
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-surface-hover transition-colors"
              onClick={() => handleClick(item)}
            >
              <item.icon size={18} className="text-primary" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] bg-live text-live-foreground px-1.5 py-0.5 rounded font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 w-full text-sm text-destructive hover:text-destructive/80">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
