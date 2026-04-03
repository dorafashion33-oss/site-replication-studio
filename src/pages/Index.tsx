import { useState } from "react";
import Header from "@/components/Header";
import BottomNav, { type TabId } from "@/components/BottomNav";
import HomePage from "./HomePage";
import SportsPage from "./SportsPage";
import InPlayPage from "./InPlayPage";
import CasinoPage from "./CasinoPage";
import PreferencesPage from "./PreferencesPage";

const pages: Record<TabId, React.FC> = {
  home: HomePage,
  sportsbook: SportsPage,
  inplay: InPlayPage,
  casino: CasinoPage,
  preferences: PreferencesPage,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const ActivePage = pages[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14 pb-16">
        <ActivePage />
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default Index;
