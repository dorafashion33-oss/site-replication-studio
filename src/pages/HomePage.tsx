import heroBanner from "@/assets/hero-banner.jpg";
import casinoBanner from "@/assets/casino-banner.jpg";
import TopMatches from "@/components/TopMatches";
import GeneratedMatches from "@/components/GeneratedMatches";
import type { GeneratedMatch } from "@/hooks/useMatchGenerator";

interface HomePageProps {
  onMatchClick?: (matchId: string) => void;
  matches?: GeneratedMatch[];
  balance?: number;
  onPlaceBet?: (matchId: string, matchTitle: string, team: string, amount: number) => any;
}

const HomePage = ({ onMatchClick, matches = [], balance = 0, onPlaceBet }: HomePageProps) => {
  return (
    <div className="space-y-4 pb-4">
      {/* Banners */}
      <div className="grid grid-cols-2 gap-2 px-3 mt-2">
        <div className="relative rounded-lg overflow-hidden">
          <img src={heroBanner} alt="Sports Bonus" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-2">
            <p className="text-[10px] text-foreground">Get <span className="text-gold font-bold">500%</span></p>
            <p className="text-xs text-foreground font-bold">Joining Bonus</p>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <img src={casinoBanner} alt="Affiliate Program" loading="lazy" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-2">
            <p className="text-xs text-foreground font-bold">Join Our Affiliate</p>
            <p className="text-[10px] text-primary">& Earn daily commission</p>
          </div>
        </div>
      </div>

      {/* Top Matches (existing) */}
      <TopMatches onMatchClick={onMatchClick} balance={balance} onPlaceBet={onPlaceBet} />

      {/* Auto-Generated Live & Upcoming Matches */}
      {onPlaceBet && (
        <GeneratedMatches matches={matches} balance={balance} onPlaceBet={onPlaceBet} />
      )}

      {/* Cricket Battle Banner */}
      <div className="px-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-1">Cricket Battle</h2>
        <div className="w-8 h-0.5 bg-primary rounded mb-3" />
        <div className="relative rounded-lg overflow-hidden">
          <img src={heroBanner} alt="Cricket Battle" loading="lazy" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent flex items-center justify-center">
            <span className="text-2xl font-black text-foreground drop-shadow-lg tracking-wider">CRICKET BATTLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
