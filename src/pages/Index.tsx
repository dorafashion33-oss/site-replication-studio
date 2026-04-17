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
import MyBetsPage from "./MyBetsPage";
import ResultsPage from "./ResultsPage";
import FavouritesPage from "./FavouritesPage";
import SearchPage from "./SearchPage";
import LanguagePage from "./LanguagePage";
import TermsPage from "./TermsPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { useWallet } from "@/hooks/useWallet";
import { useMatchGenerator } from "@/hooks/useMatchGenerator";
import type { MenuPage } from "@/components/SideMenu";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [menuPage, setMenuPage] = useState<MenuPage>(null);
  const wallet = useWallet();
  const matches = useMatchGenerator(12);

  const handleMatchClick = (matchId: string) => {
    setSelectedMatch(matchId);
  };

  const handleBackFromMatch = () => {
    setSelectedMatch(null);
  };

  const handleMenuBack = () => {
    setMenuPage(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabId);
    setMenuPage(null);
    setSelectedMatch(null);
  };

  // Render menu pages (overlay pages from side menu)
  if (menuPage) {
    const menuContent = (() => {
      switch (menuPage) {
        case "mybets": return <MyBetsPage bets={wallet.bets} onBack={handleMenuBack} />;
        case "results": return <ResultsPage bets={wallet.bets} onBack={handleMenuBack} />;
        case "favourites": return <FavouritesPage onBack={handleMenuBack} />;
        case "search": return <SearchPage onBack={handleMenuBack} onMatchClick={handleMatchClick} />;
        case "language": return <LanguagePage onBack={handleMenuBack} />;
        case "terms": return <TermsPage onBack={handleMenuBack} />;
        case "login": return <LoginPage onBack={handleMenuBack} onSignupClick={() => setMenuPage("signup")} />;
        case "signup": return <SignupPage onBack={handleMenuBack} onLoginClick={() => setMenuPage("login")} />;
        default: return null;
      }
    })();

    return (
      <div className="min-h-screen bg-background">
        <Header balance={wallet.balance} onMenuNavigate={setMenuPage} onTabChange={handleTabChange} />
        <main className="pt-14 pb-16">
          {menuContent}
        </main>
        <BottomNav active={activeTab} onChange={(tab) => { setActiveTab(tab); setSelectedMatch(null); setMenuPage(null); }} />
      </div>
    );
  }

  const renderPage = () => {
    if (selectedMatch) {
      return (
        <MatchDetailPage
          matchTitle="New Zealand W V South Africa W"
          matchTime="03:30 AM 04 Apr 2026"
          onBack={handleBackFromMatch}
          balance={wallet.balance}
          onPlaceBet={wallet.placeBet}
          bets={wallet.bets}
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
      case "dashboard":
        return <DashboardPage wallet={wallet} matches={matches} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header balance={wallet.balance} onMenuNavigate={setMenuPage} onTabChange={handleTabChange} />
      <main className="pt-14 pb-16">
        {renderPage()}
      </main>
      <BottomNav active={activeTab} onChange={(tab) => { setActiveTab(tab); setSelectedMatch(null); setMenuPage(null); }} />
    </div>
  );
};

export default Index;
