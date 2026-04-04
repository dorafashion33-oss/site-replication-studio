import { Menu, Info, Coins } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";

interface HeaderProps {
  balance?: number;
}

const Header = ({ balance = 0 }: HeaderProps) => {
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
          <div className="flex items-center gap-1 bg-gold/20 text-gold rounded-full px-2 py-1">
            <Coins size={12} />
            <span className="font-bold">{balance}</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Info size={12} className="text-muted-foreground" />
              <span className="text-primary font-semibold">Demo User</span>
            </div>
            <div className="text-muted-foreground text-[10px]">
              Virtual Coins Only
            </div>
          </div>
        </div>
      </header>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
