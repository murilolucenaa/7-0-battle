import type { Player, PosGroup, Formation, MatchEvent, SimResult } from "@/lib/types";
import { mulberry32 } from "./mulberry32";
import { pickCommentary } from "./commentary";
import type { SlotInput } from "./chemistry";

export interface SimTeamInput {
  name: string;
  formation: Formation;
  slots: SlotInput[];      // 11 starters, all slots filled
  bench: Player[];         // bench players (0–5)
  chemistry: number;       // 0–100 calculated by chemistry.ts
  chemModifier: number;    // precomputed multiplier from calculateChemistry()
}

interface SectorStrengths {
  gk:  number;
  def: number;
  mei: number;
  ata: number;
}

function computeStrengths(team: SimTeamInput): SectorStrengths {
  const filled = team.slots.filter((s) => s.player !== null);
  const avg = (group: PosGroup) => {
    const players = filled.filter((s) => s.pos_group === group).map((s) => s.player!.ovr);
    return players.length > 0 ? players.reduce((a, b) => a + b, 0) / players.length : 75;
  };
  const m = team.chemModifier;
  return {
    gk:  avg("GOL") * m,
    def: avg("DEF") * m,
    mei: avg("MEI") * m,
    ata: avg("ATA") * m,
  };
}

function playerNames(team: SimTeamInput, group: PosGroup): string[] {
  return team.slots
    .filter((s) => s.pos_group === group && s.player)
    .map((s) => s.player!.name);
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickGk(team: SimTeamInput): string {
  return playerNames(team, "GOL")[0] ?? "Goleiro";
}

/**
 * Run a full 90-minute simulation deterministically.
 *
 * Tuning constants:
 *   SHOT_BASE     = base probability per possession minute of a shot attempt
 *   ON_TARGET     = base chance a shot attempt reaches the goalkeeper
 *   GOAL_BASE     = base chance a shot on target beats the keeper
 *
 * With balanced teams (avg OVR ~83): expect ~2.5–3.5 goals/game on average.
 * Better teams produce more chances; better GKs save more shots.
 */
export function simulate(
  home: SimTeamInput,
  away: SimTeamInput,
  seed: number
): SimResult {
  const rand = mulberry32(seed);
  const events: MatchEvent[] = [];
  let scoreH = 0, scoreA = 0;

  const hStr = computeStrengths(home);
  const aStr = computeStrengths(away);

  // Stamina: 100 → decays to ~70 by minute 90
  let hStam = 100, aStam = 100;
  // Auto-sub budget (simulates up to 2 auto-subs per team)
  let hSubsLeft = home.bench.length > 0 ? 2 : 0;
  let aSubsLeft = away.bench.length > 0 ? 2 : 0;

  // Track bench index per team for sub commentary
  let hBenchIdx = 0, aBenchIdx = 0;

  events.push({
    min: 1, type: "info", side: "h",
    text: "⚡ Apita o árbitro! Começa a batalha!",
    scoreH: 0, scoreA: 0,
  });

  for (let min = 1; min <= 90; min++) {
    // Stamina decay — starts accelerating after 60'
    if (min % 10 === 0) {
      const decay = min > 60 ? 3 : 1;
      hStam = Math.max(55, hStam - decay);
      aStam = Math.max(55, aStam - decay);
    }

    // Auto-sub at 60' (home) and 65' (away) if bench available
    if (min === 60 && hSubsLeft > 0) {
      hSubsLeft--;
      hStam = Math.min(100, hStam + 12);
      const tiringOut = pick(playerNames(home, "MEI").concat(playerNames(home, "ATA")), rand);
      const incoming  = home.bench[hBenchIdx++]?.name ?? "Reserva";
      events.push({
        min, type: "sub", side: "h",
        text: pickCommentary("sub", rand, { defender: tiringOut, reserve: incoming }),
        scoreH, scoreA,
      });
    }
    if (min === 65 && aSubsLeft > 0) {
      aSubsLeft--;
      aStam = Math.min(100, aStam + 12);
      const tiringOut = pick(playerNames(away, "MEI").concat(playerNames(away, "ATA")), rand);
      const incoming  = away.bench[aBenchIdx++]?.name ?? "Reserva";
      events.push({
        min, type: "sub", side: "a",
        text: pickCommentary("sub", rand, { defender: tiringOut, reserve: incoming }),
        scoreH, scoreA,
      });
    }
    // Second wave of subs (75')
    if (min === 75 && hSubsLeft > 0) {
      hSubsLeft--;
      const tiringOut = pick(playerNames(home, "DEF"), rand);
      const incoming  = home.bench[hBenchIdx++]?.name ?? "Reserva";
      events.push({
        min, type: "sub", side: "h",
        text: pickCommentary("sub", rand, { defender: tiringOut, reserve: incoming }),
        scoreH, scoreA,
      });
    }
    if (min === 75 && aSubsLeft > 0) {
      aSubsLeft--;
      const tiringOut = pick(playerNames(away, "DEF"), rand);
      const incoming  = away.bench[aBenchIdx++]?.name ?? "Reserva";
      events.push({
        min, type: "sub", side: "a",
        text: pickCommentary("sub", rand, { defender: tiringOut, reserve: incoming }),
        scoreH, scoreA,
      });
    }

    // --- Possession & attack resolution ---
    const hMeiEff = hStr.mei * (hStam / 100);
    const aMeiEff = aStr.mei * (aStam / 100);
    const possH   = hMeiEff / (hMeiEff + aMeiEff);
    const homeHasBall = rand() < possH;

    const side: "h" | "a" = homeHasBall ? "h" : "a";
    const attTeam  = homeHasBall ? home : away;
    const defTeam  = homeHasBall ? away : home;
    const ataEff   = (homeHasBall ? hStr.ata : aStr.ata) * ((homeHasBall ? hStam : aStam) / 100);
    const defEff   = (homeHasBall ? aStr.def : hStr.def) * ((homeHasBall ? aStam : hStam) / 100);
    const gkEff    = (homeHasBall ? aStr.gk  : hStr.gk)  * ((homeHasBall ? aStam : hStam) / 100);

    // Shot chance: base 14%, scales with ata/def ratio
    const SHOT_BASE = 0.14;
    const chanceP   = SHOT_BASE * Math.sqrt(ataEff / Math.max(defEff, 1));

    if (rand() < chanceP) {
      // Shot attempt — determine quality
      const shotQuality = rand(); // 0–1, higher = better shot

      if (shotQuality < 0.22) {
        // Shot wide / blocked — no event (too noisy)
      } else if (shotQuality < 0.40) {
        // On target: goalkeeper saves
        const atkName = pick(playerNames(attTeam, "ATA").concat(playerNames(attTeam, "MEI")), rand);
        const gkName  = pickGk(defTeam);
        const saveDifficult = rand() < 0.45;

        if (saveDifficult) {
          events.push({
            min, type: "shot", side,
            text: pickCommentary("save", rand, { attacker: atkName, goalkeeper: gkName }),
            scoreH, scoreA,
          });
        }
      } else {
        // On target: calculate if goal
        // gk_factor: legendary GK (92 ovr) saves more than a weak one (75 ovr)
        const gkFactor = Math.pow(gkEff / 85, 1.5);
        const GOAL_BASE = 0.40;
        const goalP    = GOAL_BASE / gkFactor;

        if (rand() < goalP) {
          // GOAL!
          const scorer  = pick(playerNames(attTeam, "ATA").concat(playerNames(attTeam, "MEI")), rand);
          const gkName  = pickGk(defTeam);

          if (homeHasBall) scoreH++;
          else scoreA++;

          events.push({
            min, type: "goal", side,
            text: pickCommentary("goal", rand, { attacker: scorer, goalkeeper: gkName }),
            scoreH, scoreA,
          });
        } else {
          // Shot saved — credit GK (shot type event = difficult save)
          if (rand() < 0.5) {
            const atkName = pick(playerNames(attTeam, "ATA"), rand);
            const gkName  = pickGk(defTeam);
            events.push({
              min, type: "shot", side: side === "h" ? "a" : "h",
              text: pickCommentary("save", rand, { attacker: atkName, goalkeeper: gkName }),
              scoreH, scoreA,
            });
          }
        }
      }
    }

    // Yellow card — very rare (avg ~1 per game total)
    if (rand() < 0.009) {
      const cardSide: "h" | "a" = rand() < 0.5 ? "h" : "a";
      const cardTeam  = cardSide === "h" ? home : away;
      const cardPlayer = pick(
        playerNames(cardTeam, "DEF").concat(playerNames(cardTeam, "MEI")),
        rand
      );
      events.push({
        min, type: "card", side: cardSide,
        text: pickCommentary("card", rand, { defender: cardPlayer }),
        scoreH, scoreA,
      });
    }

    // Halftime summary
    if (min === 45) {
      events.push({
        min: 45, type: "info", side: "h",
        text: `🔔 Fim do primeiro tempo. ${home.name} ${scoreH}–${scoreA} ${away.name}`,
        scoreH, scoreA,
      });
    }
  }

  const winner: "home" | "away" | "draw" =
    scoreH > scoreA ? "home" : scoreA > scoreH ? "away" : "draw";

  events.push({
    min: 90, type: "fulltime", side: "h",
    text: `🏁 Fim de jogo! ${home.name} ${scoreH}–${scoreA} ${away.name}`,
    scoreH, scoreA,
  });

  return { homeScore: scoreH, awayScore: scoreA, winner, events };
}
