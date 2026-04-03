import { useState } from "react";
import SportCategoryChips from "@/components/SportCategoryChips";
import LiveEvents from "@/components/LiveEventCard";

const SportsPage = () => {
  const [activeSport, setActiveSport] = useState("cricket");

  return (
    <div className="pb-4">
      <SportCategoryChips active={activeSport} onChange={setActiveSport} />
      <LiveEvents />
    </div>
  );
};

export default SportsPage;
