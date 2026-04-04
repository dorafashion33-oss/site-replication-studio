import { Trophy, Medal } from "lucide-react";

const dummyLeaders = [
  { rank: 1, name: "KingBettor99", coins: 125000, wins: 342, emoji: "👑" },
  { rank: 2, name: "LuckyDraw_Pro", coins: 98500, wins: 289, emoji: "🥈" },
  { rank: 3, name: "CricketMaster", coins: 87200, wins: 267, emoji: "🥉" },
  { rank: 4, name: "SportsFanatic", coins: 72000, wins: 231, emoji: "🏅" },
  { rank: 5, name: "MegaWinner007", coins: 65400, wins: 198, emoji: "⭐" },
  { rank: 6, name: "BetGuru_X", coins: 54300, wins: 176, emoji: "🎯" },
  { rank: 7, name: "ProGambler", coins: 43200, wins: 155, emoji: "💎" },
  { rank: 8, name: "WinStreak_22", coins: 38900, wins: 142, emoji: "🔥" },
  { rank: 9, name: "ChampionBet", coins: 31500, wins: 128, emoji: "🏆" },
  { rank: 10, name: "AllInPlayer", coins: 25000, wins: 110, emoji: "💪" },
];

interface LeaderboardProps {
  userBalance: number;
  userWins: number;
}

const Leaderboard = ({ userBalance, userWins }: LeaderboardProps) => {
  return (
    <div className="px-3 space-y-3">
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-gold" />
        <h2 className="text-sm font-bold text-foreground uppercase">Leaderboard</h2>
      </div>
      <div className="w-8 h-0.5 bg-gold rounded" />

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 py-3">
        {[dummyLeaders[1], dummyLeaders[0], dummyLeaders[2]].map((l, i) => (
          <div key={l.rank} className={`flex flex-col items-center ${i === 1 ? "order-2" : i === 0 ? "order-1" : "order-3"}`}>
            <span className="text-2xl mb-1">{l.emoji}</span>
            <div className={`rounded-lg border p-3 text-center ${
              i === 1 ? "bg-gold/20 border-gold h-28 w-24" : "bg-surface border-border h-20 w-20"
            }`}>
              <p className="text-[10px] font-bold text-foreground truncate">{l.name}</p>
              <p className="text-xs font-black text-gold mt-1">{(l.coins / 1000).toFixed(1)}K</p>
              <p className="text-[8px] text-muted-foreground">{l.wins} wins</p>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining */}
      <div className="space-y-1">
        {dummyLeaders.slice(3).map((l) => (
          <div key={l.rank} className="flex items-center justify-between bg-surface rounded-lg border border-border px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-5">#{l.rank}</span>
              <span className="text-sm">{l.emoji}</span>
              <span className="text-xs font-medium text-foreground">{l.name}</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gold">{l.coins.toLocaleString()}</p>
              <p className="text-[8px] text-muted-foreground">{l.wins} wins</p>
            </div>
          </div>
        ))}
      </div>

      {/* Your Position */}
      <div className="bg-primary/10 rounded-lg border border-primary/30 px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Medal size={16} className="text-primary" />
          <span className="text-xs font-bold text-primary">YOU</span>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gold">{userBalance.toLocaleString()}</p>
          <p className="text-[8px] text-muted-foreground">{userWins} wins</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
