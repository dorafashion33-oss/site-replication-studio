import WalletPanel from "@/components/WalletPanel";
import Leaderboard from "@/components/Leaderboard";
import GeneratedMatches from "@/components/GeneratedMatches";
import BetHistory from "@/components/BetHistory";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";
import type { BetRecord } from "@/hooks/useWallet";

interface DashboardPageProps {
  wallet: {
    balance: number;
    transactions: any[];
    bets: BetRecord[];
    totalBets: number;
    wins: number;
    losses: number;
    addCoins: (n: number) => void;
    placeBet: (matchId: string, matchTitle: string, team: string, amount: number) => any;
  };
  matches: GeneratedMatch[];
}

const DashboardPage = ({ wallet, matches }: DashboardPageProps) => {
  return (
    <div className="space-y-4 pb-4">
      <WalletPanel
        balance={wallet.balance}
        transactions={wallet.transactions}
        totalBets={wallet.totalBets}
        wins={wallet.wins}
        losses={wallet.losses}
        onAddCoins={wallet.addCoins}
      />
      <BetHistory bets={wallet.bets} />
      <GeneratedMatches matches={matches} balance={wallet.balance} onPlaceBet={wallet.placeBet} />
      <Leaderboard userBalance={wallet.balance} userWins={wallet.wins} />
    </div>
  );
};

export default DashboardPage;
