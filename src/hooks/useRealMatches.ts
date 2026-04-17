import { useState, useEffect } from "react";
import type { GeneratedMatch } from "./useMatchGenerator";

// === Real-world matches sourced from ESPN's public scoreboard API (no auth, CORS-enabled) ===
// We map them to the same `GeneratedMatch` shape used elsewhere so the rest of the UI
// keeps working unchanged.

interface EspnEvent {
  id: string;
  name: string;
  shortName: string;
  date: string;
  status?: { type?: { state?: string; completed?: boolean; description?: string }; displayClock?: string; period?: number };
  competitions?: Array<{
    competitors?: Array<{
      homeAway?: string;
      team?: { displayName?: string; abbreviation?: string; shortDisplayName?: string };
      score?: string;
      linescores?: Array<{ value?: number }>;
    }>;
  }>;
  league?: { name?: string };
}

interface EspnResponse {
  leagues?: Array<{ name?: string; abbreviation?: string }>;
  events?: EspnEvent[];
}

// Endpoints we poll. Each returns ~10 fixtures including LIVE + UPCOMING.
const ENDPOINTS: { url: string; sport: string; sportIcon: string; defaultLeague: string }[] = [
  { url: "https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard", sport: "FOOTBALL", sportIcon: "⚽", defaultLeague: "International Soccer" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard", sport: "CRICKET", sportIcon: "🏏", defaultLeague: "Indian Premier League" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/cricket/8077/scoreboard", sport: "CRICKET", sportIcon: "🏏", defaultLeague: "International Cricket" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard", sport: "TENNIS", sportIcon: "🎾", defaultLeague: "ATP Tour" },
  { url: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard", sport: "BASKETBALL", sportIcon: "🏀", defaultLeague: "NBA" },
];

// Map a probability to fair odds, then add small bookmaker margin.
function impliedToOdds(prob: number): number {
  const safe = Math.min(0.95, Math.max(0.05, prob));
  return +(1 / safe).toFixed(2);
}

function mapEvent(ev: EspnEvent, sport: string, sportIcon: string, leagueName: string): GeneratedMatch | null {
  const comp = ev.competitions?.[0];
  if (!comp || !comp.competitors || comp.competitors.length < 2) return null;

  // For team sports homeAway exists; for tennis competitors are players.
  const home = comp.competitors.find((c) => c.homeAway === "home") ?? comp.competitors[0];
  const away = comp.competitors.find((c) => c.homeAway === "away") ?? comp.competitors[1];

  const teamA = home.team?.shortDisplayName || home.team?.displayName || home.team?.abbreviation || "Home";
  const teamB = away.team?.shortDisplayName || away.team?.displayName || away.team?.abbreviation || "Away";

  const state = ev.status?.type?.state ?? "pre"; // 'pre' | 'in' | 'post'
  const completed = ev.status?.type?.completed ?? false;
  if (completed) return null; // skip finished matches — we only want live + upcoming

  const isLive = state === "in";

  // Score formatting
  let scoreA: string | undefined;
  let scoreB: string | undefined;
  if (isLive) {
    scoreA = home.score ?? "0";
    scoreB = away.score ?? "0";
    if (sport === "CRICKET") {
      scoreA = `${home.score ?? 0}`;
      scoreB = `${away.score ?? 0}`;
    }
  }

  // Time/date
  const d = new Date(ev.date);
  const time = isLive
    ? ev.status?.type?.description || "In Progress"
    : `${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;

  // Generate plausible odds (deterministic-ish seed from id so they don't jump on every refresh)
  const seed = (parseInt(ev.id) || 1) % 1000;
  const baseProb = 0.35 + ((seed * 13) % 30) / 100; // 0.35 → 0.65
  const back = impliedToOdds(baseProb);
  const lay = +(back + 0.04).toFixed(2);

  return {
    id: `real-${ev.id}`,
    sport,
    sportIcon,
    league: leagueName,
    teamA,
    teamB,
    isLive,
    scoreA,
    scoreB,
    status: isLive ? "LIVE 🔴" : "UPCOMING",
    time,
    odds: { back, lay },
  };
}

async function fetchEndpoint(ep: typeof ENDPOINTS[number]): Promise<GeneratedMatch[]> {
  try {
    const res = await fetch(ep.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data: EspnResponse = await res.json();
    const leagueName = data.leagues?.[0]?.name || ep.defaultLeague;
    const events = data.events ?? [];
    return events
      .map((e) => mapEvent(e, ep.sport, ep.sportIcon, leagueName))
      .filter((m): m is GeneratedMatch => m !== null);
  } catch {
    return [];
  }
}

export function useRealMatches(refreshIntervalMs = 60_000) {
  const [matches, setMatches] = useState<GeneratedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const results = await Promise.all(ENDPOINTS.map(fetchEndpoint));
        if (cancelled) return;
        const all = results.flat();
        // Sort: LIVE first, then by time ascending
        all.sort((a, b) => {
          if (a.isLive && !b.isLive) return -1;
          if (!a.isLive && b.isLive) return 1;
          return 0;
        });
        setMatches(all);
        setError(all.length === 0 ? "No matches available right now" : null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load matches");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const id = setInterval(load, refreshIntervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [refreshIntervalMs]);

  return { matches, loading, error };
}
