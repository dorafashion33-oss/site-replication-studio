import { ArrowLeft, ShieldCheck } from "lucide-react";

interface TermsPageProps {
  onBack: () => void;
}

const TermsPage = ({ onBack }: TermsPageProps) => {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-3 py-3 bg-surface border-b border-border">
        <button onClick={onBack}><ArrowLeft size={18} className="text-foreground" /></button>
        <ShieldCheck size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">Terms & Policy</h2>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">1. General Terms</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is a demo platform using virtual coins only. No real money is involved in any transactions, bets, or casino games. All coins are for entertainment purposes only.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">2. Virtual Currency</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The coins used on this platform have no real-world monetary value. They cannot be exchanged, withdrawn, or converted to real currency. Starting balance of 1000 coins is provided for demo purposes.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">3. Betting Rules</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All bets are simulated. Results are generated randomly and do not reflect real match outcomes. Back and Lay odds are for demonstration of exchange betting mechanics only.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">4. Casino Games</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All casino games including Dragon Tiger, Roulette, Blackjack, and others are simulated using random number generation. No real gambling is involved.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">5. Privacy</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All data is stored locally on your device using localStorage. No personal information is collected, transmitted, or stored on any server.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">6. Age Restriction</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This platform is intended for users aged 18 and above. By using this platform, you confirm that you meet the minimum age requirement.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-foreground mb-2">7. Responsible Gaming</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is a demo platform designed for educational and entertainment purposes. Please gamble responsibly. If you have a gambling problem, seek professional help.
          </p>
        </section>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center mt-6">
          <ShieldCheck size={24} className="mx-auto text-primary mb-2" />
          <p className="text-xs text-foreground font-bold">DEMO PLATFORM</p>
          <p className="text-[10px] text-muted-foreground mt-1">Virtual Coins Only • No Real Money • For Entertainment Purposes</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
