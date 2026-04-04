import { useState, useEffect, useCallback } from "react";

export interface Transaction {
  id: string;
  type: "bet" | "win" | "loss" | "add" | "casino-win" | "casino-loss";
  amount: number;
  description: string;
  timestamp: number;
}

export interface BetRecord {
  id: string;
  matchId: string;
  matchTitle: string;
  team: string;
  amount: number;
  odds: number;
  result: "win" | "loss" | "pending";
  payout: number;
  timestamp: number;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
  bets: BetRecord[];
  totalBets: number;
  wins: number;
  losses: number;
}

const DEFAULT_WALLET: WalletData = {
  balance: 1000,
  transactions: [],
  bets: [],
  totalBets: 0,
  wins: 0,
  losses: 0,
};

const STORAGE_KEY = "demo_wallet";

function loadWallet(): WalletData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...DEFAULT_WALLET };
}

function saveWallet(data: WalletData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletData>(loadWallet);

  useEffect(() => {
    saveWallet(wallet);
  }, [wallet]);

  const addCoins = useCallback((amount: number) => {
    setWallet((w) => ({
      ...w,
      balance: w.balance + amount,
      transactions: [
        { id: crypto.randomUUID(), type: "add", amount, description: `Added ${amount} demo coins`, timestamp: Date.now() },
        ...w.transactions,
      ],
    }));
  }, []);

  const placeBet = useCallback((matchId: string, matchTitle: string, team: string, amount: number): BetRecord | null => {
    let result: BetRecord | null = null;
    setWallet((w) => {
      if (w.balance < amount) return w;
      const odds = +(1.5 + Math.random() * 1.5).toFixed(2);
      const isWin = Math.random() > 0.45;
      const payout = isWin ? Math.round(amount * odds) : 0;
      const bet: BetRecord = {
        id: crypto.randomUUID(),
        matchId, matchTitle, team, amount, odds,
        result: isWin ? "win" : "loss",
        payout,
        timestamp: Date.now(),
      };
      result = bet;
      const txns: Transaction[] = [
        { id: crypto.randomUUID(), type: "bet", amount: -amount, description: `Bet on ${team}`, timestamp: Date.now() },
      ];
      if (isWin) {
        txns.push({ id: crypto.randomUUID(), type: "win", amount: payout, description: `Won bet: ${team} (${odds}x)`, timestamp: Date.now() });
      } else {
        txns.push({ id: crypto.randomUUID(), type: "loss", amount: 0, description: `Lost bet: ${team}`, timestamp: Date.now() });
      }
      return {
        ...w,
        balance: w.balance - amount + payout,
        transactions: [...txns, ...w.transactions],
        bets: [bet, ...w.bets],
        totalBets: w.totalBets + 1,
        wins: w.wins + (isWin ? 1 : 0),
        losses: w.losses + (isWin ? 0 : 1),
      };
    });
    return result;
  }, []);

  const casinoTransaction = useCallback((amount: number, type: "casino-win" | "casino-loss", description: string) => {
    setWallet((w) => ({
      ...w,
      balance: w.balance + amount,
      transactions: [
        { id: crypto.randomUUID(), type, amount, description, timestamp: Date.now() },
        ...w.transactions,
      ],
      totalBets: w.totalBets + 1,
      wins: w.wins + (type === "casino-win" ? 1 : 0),
      losses: w.losses + (type === "casino-loss" ? 1 : 0),
    }));
  }, []);

  return { ...wallet, addCoins, placeBet, casinoTransaction };
}
