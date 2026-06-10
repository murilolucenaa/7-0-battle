import type { PosGroup, MatchEvent } from "@/lib/types";

// Cartola-style scout points per event type
const POINTS: Record<string, number> = {
  goal:           8,
  assist:         5,
  save_difficult: 1,   // GK: difficult save
  save_penalty:   7,   // GK: penalty save
  clean_sheet:    5,   // DEF/MEI: no goals conceded
  shot_post:      3,   // hit the post
  shot_saved:     1.2, // finalization saved
  tackle:         1.2,
  yellow:        -1,
  red:           -3,
  own_goal:      -3,
  goal_conceded: -2,   // GK: each goal conceded
};

export interface PlayerScout {
  playerId: string;
  playerName: string;
  pos_group: PosGroup;
  points: number;
  events: string[];
}

/**
 * Accumulate Cartola-style points from a finished match's events array.
 *
 * `teamPlayers` = list of the 11 starters for ONE team (home or away).
 * `side` = which side of events to look at ('h' or 'a').
 * Returns per-player scouts and the total team score for this match.
 */
export function scoreTeam(
  teamPlayers: Array<{ id: string; name: string; pos_group: PosGroup }>,
  events: MatchEvent[],
  side: "h" | "a",
  oppScore: number
): { scouts: PlayerScout[]; total: number } {
  const scouts: PlayerScout[] = teamPlayers.map((p) => ({
    playerId: p.id,
    playerName: p.name,
    pos_group: p.pos_group,
    points: 0,
    events: [],
  }));

  // Goal events on this side credit a random attacker (deterministic from event data)
  // In production, events will carry player IDs. For now derive from pos_group.
  function randomScout(posGroups: PosGroup[]): PlayerScout | undefined {
    const candidates = scouts.filter((s) => posGroups.includes(s.pos_group));
    if (candidates.length === 0) return undefined;
    // Pick by name hash (deterministic, no PRNG needed here — event already happened)
    const idx = candidates.length > 1
      ? Math.abs(candidates[0].playerName.charCodeAt(0)) % candidates.length
      : 0;
    return candidates[idx];
  }

  for (const ev of events) {
    if (ev.side !== side) {
      // Opponents scored on us — GK gets penalized
      if (ev.type === "goal") {
        const gk = scouts.find((s) => s.pos_group === "GOL");
        if (gk) { gk.points += POINTS.goal_conceded; gk.events.push("Gol sofrido"); }
      }
      continue;
    }

    switch (ev.type) {
      case "goal": {
        // Attacker scores
        const scorer = randomScout(["ATA"]);
        if (scorer) { scorer.points += POINTS.goal; scorer.events.push("Gol"); }
        // Assist goes to a midfielder
        const assist = randomScout(["MEI"]);
        if (assist) { assist.points += POINTS.assist; assist.events.push("Assistência"); }
        break;
      }
      case "shot": {
        // Difficult save: credit GK  (events with type 'shot' are saves in our engine)
        const gk = scouts.find((s) => s.pos_group === "GOL");
        if (gk) { gk.points += POINTS.save_difficult; gk.events.push("Defesa difícil"); }
        break;
      }
      case "card": {
        const victim = randomScout(["DEF", "MEI"]);
        if (victim) { victim.points += POINTS.yellow; victim.events.push("Cartão amarelo"); }
        break;
      }
    }
  }

  // Clean sheet bonus for defenders and midfielders (if opponent scored 0)
  if (oppScore === 0) {
    scouts
      .filter((s) => s.pos_group === "DEF" || s.pos_group === "MEI")
      .forEach((s) => { s.points += POINTS.clean_sheet; s.events.push("Clean sheet"); });
  }

  const total = scouts.reduce((sum, s) => sum + s.points, 0);
  return { scouts, total };
}

export { POINTS };
