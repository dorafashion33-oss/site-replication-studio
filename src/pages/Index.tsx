import { useState } from "react";
import Header from "@/components/Header";
import BottomNav, { type TabId } from "@/components/BottomNav";
import HomePage from "./HomePage";
import SportsPage from "./SportsPage";
import InPlayPage from "./InPlayPage";
import CasinoPage from "./CasinoPage";
import PreferencesPage from "./PreferencesPage";
import MatchDetailPage from "./MatchDetailPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

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
        return <HomePage onMatchClick={handleMatchClick} />;
      case "sportsbook":
        return <SportsPage onMatchClick={handleMatchClick} />;
      case "inplay":
        return <InPlayPage onMatchClick={handleMatchClick} />;
      case "casino":
        return <CasinoPage />;
      case "preferences":
        return <PreferencesPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14 pb-16">
        {renderPage()}
      </main>
      <BottomNav active={activeTab} onChange={(tab) => { setActiveTab(tab); setSelectedMatch(null); }} />
    </div>
  );
};

export default Index;
