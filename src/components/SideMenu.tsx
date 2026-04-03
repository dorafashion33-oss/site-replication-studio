import { X, Home, PlayCircle, FileText, Star, Search, Globe, ShieldCheck, LogOut } from "lucide-react";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Home" },
  { icon: PlayCircle, label: "Inplay", badge: "LIVE" },
  { icon: FileText, label: "My Bets" },
  { icon: FileText, label: "Results" },
  { icon: Star, label: "Favourites" },
  { icon: Search, label: "Search" },
  { icon: Globe, label: "Language : EN" },
  { icon: ShieldCheck, label: "Terms & Policy" },
];

const SideMenu = ({ open, onClose }: SideMenuProps) => {
  if (!open) return null;

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
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-surface-hover transition-colors"
              onClick={onClose}
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
