import { useState, useEffect, useCallback } from "react";

export interface Transaction {
  id: string;
  type: "bet" | "win" | "loss" | "add" | "casino-win" | "casino-loss" | "cashout";
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
  result: "win" | "loss" | "pending" | "cashout";
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

  const placeBet = useCallback((matchId: string, matchTitle: string, team: string, amount: number, options?: { pending?: boolean }): BetRecord | null => {
    let result: BetRecord | null = null;
    setWallet((w) => {
      if (w.balance < amount) return w;
      const odds = +(1.5 + Math.random() * 1.5).toFixed(2);

      // Pending mode: deduct stake but don't settle yet
      if (options?.pending) {
        const bet: BetRecord = {
          id: crypto.randomUUID(),
          matchId, matchTitle, team, amount, odds,
          result: "pending",
          payout: 0,
          timestamp: Date.now(),
        };
        result = bet;
        return {
          ...w,
          balance: w.balance - amount,
          transactions: [
            { id: crypto.randomUUID(), type: "bet", amount: -amount, description: `Pending bet on ${team}`, timestamp: Date.now() },
            ...w.transactions,
          ],
          bets: [bet, ...w.bets],
          totalBets: w.totalBets + 1,
        };
      }

      // Instant settlement
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

  /**
   * Cashout all pending bets matching a predicate (e.g. by matchId).
   * Returns total amount credited back to wallet.
   * Cashout pays approximately 85% of stake (industry-style early settlement).
   */
  const cashoutBets = useCallback((predicate: (b: BetRecord) => boolean, payoutPercent = 0.85): { count: number; credited: number } => {
    let credited = 0;
    let count = 0;
    setWallet((w) => {
      const txns: Transaction[] = [];
      const updatedBets = w.bets.map((b) => {
        if (b.result === "pending" && predicate(b)) {
          const refund = Math.round(b.amount * payoutPercent);
          credited += refund;
          count += 1;
          txns.push({
            id: crypto.randomUUID(),
            type: "cashout",
            amount: refund,
            description: `Cashout: ${b.team} (${Math.round(payoutPercent * 100)}%)`,
            timestamp: Date.now(),
          });
          return { ...b, result: "cashout" as const, payout: refund };
        }
        return b;
      });
      if (count === 0) return w;
      return {
        ...w,
        balance: w.balance + credited,
        transactions: [...txns, ...w.transactions],
        bets: updatedBets,
      };
    });
    return { count, credited };
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

  return { ...wallet, addCoins, placeBet, casinoTransaction, cashoutBets };
}
