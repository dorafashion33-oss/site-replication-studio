import heroBanner from "@/assets/hero-banner.jpg";
import casinoBanner from "@/assets/casino-banner.jpg";
import TopMatches from "@/components/TopMatches";

const HomePage = () => {
  return (
    <div className="space-y-4 pb-4">
      {/* Deposit / Withdraw */}
      <div className="flex gap-2 px-3">
        <button className="flex-1 py-2.5 rounded-lg bg-success text-success-foreground font-bold text-sm flex items-center justify-center gap-2">
          💰 DEPOSIT
        </button>
        <button className="flex-1 py-2.5 rounded-lg bg-warning text-warning-foreground font-bold text-sm flex items-center justify-center gap-2">
          💸 WITHDRAW
        </button>
      </div>

      {/* Banners */}
      <div className="grid grid-cols-2 gap-2 px-3">
        <div className="relative rounded-lg overflow-hidden">
          <img src={heroBanner} alt="Sports Bonus" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-2">
            <p className="text-[10px] text-foreground">Get <span className="text-gold font-bold">500%</span></p>
            <p className="text-xs text-foreground font-bold">Joining Bonus</p>
            <button className="mt-1 bg-foreground text-background text-[10px] px-3 py-1 rounded font-semibold self-start">
              Deposit Now
            </button>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <img src={casinoBanner} alt="Affiliate Program" loading="lazy" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-2">
            <p className="text-xs text-foreground font-bold">Join Our Affiliate</p>
            <p className="text-[10px] text-primary">& Earn daily commission</p>
            <button className="mt-1 bg-foreground text-background text-[10px] px-3 py-1 rounded font-semibold self-start">
              Join Now
            </button>
          </div>
        </div>
      </div>

      {/* Bonus Banner */}
      <div className="mx-3 bg-surface border border-border rounded-lg flex items-center justify-between px-4 py-3">
        <span className="text-sm text-foreground">Check your Bonuses 💰🤩</span>
        <button className="bg-gold text-warning-foreground text-xs font-bold px-4 py-1.5 rounded">
          Claim Now
        </button>
      </div>

      {/* Top Matches */}
      <TopMatches />

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
