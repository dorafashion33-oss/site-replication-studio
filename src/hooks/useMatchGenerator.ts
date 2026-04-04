import { useState, useEffect, useRef } from "react";

export interface GeneratedMatch {
  id: string;
  sport: string;
  sportIcon: string;
  league: string;
  teamA: string;
  teamB: string;
  isLive: boolean;
  scoreA?: string;
  scoreB?: string;
  status: string;
  time: string;
  odds: { back: number; lay: number };
}

const cricketTeams = ["India", "Australia", "England", "Pakistan", "South Africa", "New Zealand", "Sri Lanka", "Bangladesh", "West Indies", "Afghanistan"];
const footballTeams = ["Barcelona", "Real Madrid", "Man City", "Liverpool", "Bayern Munich", "PSG", "Juventus", "Inter Milan", "Arsenal", "Chelsea"];
const tennisPlayers = ["Djokovic", "Alcaraz", "Sinner", "Medvedev", "Zverev", "Rune", "Fritz", "Ruud"];
const cricketLeagues = ["ICC World Cup", "IPL 2026", "Ashes Series", "Asia Cup", "T20 World Cup", "PSL", "BBL", "CPL"];
const footballLeagues = ["Champions League", "Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pickTwo<T>(arr: T[]): [T, T] {
  const a = pick(arr);
  let b = pick(arr);
  while (b === a) b = pick(arr);
  return [a, b];
}

function generateCricketScore() {
  const runs = Math.floor(Math.random() * 300) + 50;
  const wickets = Math.floor(Math.random() * 10);
  const overs = (Math.random() * 50).toFixed(1);
  return `${runs}/${wickets} (${overs})`;
}

function generateMatch(id: number, isLive: boolean): GeneratedMatch {
  const sportRoll = Math.random();
  let sport: string, sportIcon: string, league: string, teamA: string, teamB: string;
  let scoreA: string | undefined, scoreB: string | undefined;

  if (sportRoll < 0.5) {
    sport = "CRICKET"; sportIcon = "🏏"; league = pick(cricketLeagues);
    [teamA, teamB] = pickTwo(cricketTeams);
    if (isLive) { scoreA = generateCricketScore(); scoreB = Math.random() > 0.4 ? generateCricketScore() : "Yet to bat"; }
  } else if (sportRoll < 0.8) {
    sport = "FOOTBALL"; sportIcon = "⚽"; league = pick(footballLeagues);
    [teamA, teamB] = pickTwo(footballTeams);
    if (isLive) { scoreA = String(Math.floor(Math.random() * 5)); scoreB = String(Math.floor(Math.random() * 5)); }
  } else {
    sport = "TENNIS"; sportIcon = "🎾"; league = "ATP Tour 2026";
    [teamA, teamB] = pickTwo(tennisPlayers);
    if (isLive) { scoreA = `${Math.floor(Math.random() * 3)} sets`; scoreB = `${Math.floor(Math.random() * 3)} sets`; }
  }

  const now = new Date();
  let time: string, status: string;
  if (isLive) {
    status = "LIVE 🔴";
    time = "In Progress";
  } else {
    const future = new Date(now.getTime() + (Math.random() * 72 + 1) * 3600000);
    const dd = future.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const tt = future.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    time = `${dd} ${tt}`;
    status = "UPCOMING";
  }

  return {
    id: `gen-${id}-${Date.now()}`, sport, sportIcon, league, teamA, teamB,
    isLive, scoreA, scoreB, status, time,
    odds: { back: +(1 + Math.random() * 3).toFixed(2), lay: +(1.5 + Math.random() * 3.5).toFixed(2) },
  };
}

export function useMatchGenerator(count = 12) {
  const counter = useRef(0);
  const [matches, setMatches] = useState<GeneratedMatch[]>(() => {
    const m: GeneratedMatch[] = [];
    for (let i = 0; i < count; i++) {
      m.push(generateMatch(counter.current++, i < Math.ceil(count * 0.5)));
    }
    return m;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) =>
        prev.map((m) => {
          if (!m.isLive) return m;
          // Randomly update live scores
          if (m.sport === "CRICKET") {
            return { ...m, scoreA: generateCricketScore(), odds: { back: +(1 + Math.random() * 3).toFixed(2), lay: +(1.5 + Math.random() * 3.5).toFixed(2) } };
          } else if (m.sport === "FOOTBALL") {
            const shouldGoal = Math.random() > 0.85;
            return { ...m, scoreA: shouldGoal ? String(+(m.scoreA || "0") + 1) : m.scoreA, odds: { back: +(1 + Math.random() * 3).toFixed(2), lay: +(1.5 + Math.random() * 3.5).toFixed(2) } };
          }
          return { ...m, odds: { back: +(1 + Math.random() * 3).toFixed(2), lay: +(1.5 + Math.random() * 3.5).toFixed(2) } };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Occasionally swap an upcoming match to live or add new
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) => {
        const copy = [...prev];
        const upcomingIdx = copy.findIndex((m) => !m.isLive);
        if (upcomingIdx >= 0 && Math.random() > 0.6) {
          const m = copy[upcomingIdx];
          copy[upcomingIdx] = { ...m, isLive: true, status: "LIVE 🔴", time: "In Progress", scoreA: "0", scoreB: "0" };
        }
        return copy;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return matches;
}
