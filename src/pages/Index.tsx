import { useState } from "react";
import Header from "@/components/Header";
import BottomNav, { type TabId } from "@/components/BottomNav";
import HomePage from "./HomePage";
import SportsPage from "./SportsPage";
import InPlayPage from "./InPlayPage";
import CasinoPage from "./CasinoPage";
import PreferencesPage from "./PreferencesPage";
import MatchDetailPage from "./MatchDetailPage";
import DashboardPage from "./DashboardPage";
import { useWallet } from "@/hooks/useWallet";
import { useMatchGenerator } from "@/hooks/useMatchGenerator";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const wallet = useWallet();
  const matches = useMatchGenerator(12);

  const handleMatchClick = (matchId: string) => {
    setSelectedMatch(matchId);
  };

  const handleBackFromMatch = () => {
    setSelectedMatch(null);
  };

  const renderPage = () => {
    if (selectedMatch) {
      return (
        <MatchDetailPage
          matchTitle="New Zealand W V South Africa W"
          matchTime="03:30 AM 04 Apr 2026"
          onBack={handleBackFromMatch}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return <HomePage onMatchClick={handleMatchClick} matches={matches} balance={wallet.balance} onPlaceBet={wallet.placeBet} />;
      case "sportsbook":
        return <SportsPage onMatchClick={handleMatchClick} />;
      case "inplay":
        return <InPlayPage onMatchClick={handleMatchClick} />;
      case "casino":
        return <CasinoPage balance={wallet.balance} onTransaction={wallet.casinoTransaction} />;
      case "preferences":
        return <PreferencesPage wallet={wallet} />;
      case "dashboard" as any:
        return <DashboardPage wallet={wallet} matches={matches} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header balance={wallet.balance} />
      <main className="pt-14 pb-16">
        {renderPage()}
      </main>
      <BottomNav active={activeTab} onChange={(tab) => { setActiveTab(tab); setSelectedMatch(null); }} />
    </div>
  );
};

export default Index;
