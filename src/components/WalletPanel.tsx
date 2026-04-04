import { useState } from "react";
import { Coins, Plus, History, TrendingUp, TrendingDown, X } from "lucide-react";
import type { Transaction } from "@/hooks/useWallet";

interface WalletPanelProps {
  balance: number;
  transactions: Transaction[];
  totalBets: number;
  wins: number;
  losses: number;
  onAddCoins: (amount: number) => void;
}

const WalletPanel = ({ balance, transactions, totalBets, wins, losses, onAddCoins }: WalletPanelProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addAmount, setAddAmount] = useState(500);

  return (
    <div className="px-3 space-y-3">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary/20 to-gold/20 rounded-lg border border-primary/30 p-4">
        <p className="text-xs text-muted-foreground">Demo Wallet Balance</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-2xl font-black text-gold flex items-center gap-2"><Coins size={24} /> {balance}</span>
          <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus size={12} /> Add Coins
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-foreground">{totalBets}</p>
          <p className="text-[10px] text-muted-foreground">Total Bets</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-success flex items-center justify-center gap-1"><TrendingUp size={14} /> {wins}</p>
          <p className="text-[10px] text-muted-foreground">Wins</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-destructive flex items-center justify-center gap-1"><TrendingDown size={14} /> {losses}</p>
          <p className="text-[10px] text-muted-foreground">Losses</p>
        </div>
      </div>

      {/* Transaction History Toggle */}
      <button onClick={() => setShowHistory(!showHistory)}
        className="w-full py-2 rounded-lg bg-surface border border-border text-xs font-bold text-foreground flex items-center justify-center gap-2">
        <History size={14} /> {showHistory ? "Hide" : "Show"} Transaction History
      </button>

      {showHistory && (
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {transactions.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No transactions yet</p>}
          {transactions.slice(0, 50).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between bg-surface rounded px-3 py-2 border border-border/50">
              <div>
                <p className="text-[10px] text-foreground">{tx.description}</p>
                <p className="text-[8px] text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
              <span className={`text-xs font-bold ${tx.amount > 0 ? "text-success" : tx.amount < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Coins Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-xl p-5 w-72 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Add Demo Coins</h3>
              <button onClick={() => setShowAdd(false)}><X size={16} className="text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 2000, 5000, 10000, 50000].map((a) => (
                <button key={a} onClick={() => setAddAmount(a)}
                  className={`py-2 rounded text-xs font-bold ${addAmount === a ? "bg-primary text-primary-foreground" : "bg-surface text-foreground border border-border"}`}>
                  {a}
                </button>
              ))}
            </div>
            <button onClick={() => { onAddCoins(addAmount); setShowAdd(false); }}
              className="w-full py-2.5 rounded-lg bg-success text-success-foreground font-bold text-sm">
              Add {addAmount} Coins 💰
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPanel;
