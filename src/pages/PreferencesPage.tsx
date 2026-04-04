import { FileText, BarChart3, Settings, LogOut, TrendingUp, Coins } from "lucide-react";
import WalletPanel from "@/components/WalletPanel";

interface PreferencesPageProps {
  wallet?: {
    balance: number;
    transactions: any[];
    totalBets: number;
    wins: number;
    losses: number;
    addCoins: (n: number) => void;
  };
}

const PreferencesPage = ({ wallet }: PreferencesPageProps) => {
  return (
    <div className="px-3 pb-4 space-y-4">
      {/* Wallet */}
      {wallet && (
        <WalletPanel
          balance={wallet.balance}
          transactions={wallet.transactions}
          totalBets={wallet.totalBets}
          wins={wallet.wins}
          losses={wallet.losses}
          onAddCoins={wallet.addCoins}
        />
      )}

      {/* Reports Menu */}
      <div>
        <h3 className="text-xs uppercase text-muted-foreground tracking-widest mb-3 text-center">Reports Menu</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: FileText, label: "My Bets" },
            { icon: BarChart3, label: "Account Statement" },
            { icon: TrendingUp, label: "P/L Statement" },
            { icon: Settings, label: "Stake Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 bg-foreground text-background rounded-lg p-4 hover:opacity-90 transition-opacity"
            >
              <item.icon size={18} className="text-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button className="w-full bg-primary rounded-lg p-4 flex items-center justify-center gap-2 text-primary-foreground font-bold hover:opacity-90 transition-opacity">
        <LogOut size={18} />
        <span>Logout</span>
      </button>

      {/* Footer */}
      <div className="bg-primary/80 rounded-lg p-3 text-center">
        <span className="text-xs text-primary-foreground">RULES & REGULATIONS © 2024</span>
      </div>
    </div>
  );
};

export default PreferencesPage;
