import { Menu, Info } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <button onClick={() => setMenuOpen(true)} className="p-1 text-foreground">
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-foreground">WIN</span>
            <span className="text-gold">ADDA</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-success/20 text-success rounded-full px-2 py-1">
            <span className="font-medium">D</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Info size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground">Bal:</span>
              <span className="text-gold font-semibold">0.00</span>
              <span className="text-primary font-semibold ml-1">Demo User</span>
            </div>
            <div className="text-muted-foreground">
              <span className="text-gold underline">Exp:0.00</span>
              <span className="ml-1">Bonus: 0.00</span>
            </div>
          </div>
        </div>
      </header>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
