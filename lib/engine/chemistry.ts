import type { Player, PosGroup, Formation } from "@/lib/types";

export interface SlotInput {
  position: string;
  pos_group: PosGroup;
  player: Player | null;
  locked?: boolean;
}

// Formation definitions — each slot has a display position + sector group
export const FORMATIONS: Record<Formation, SlotInput[]> = {
  "4-3-3": [
    { position: "GOL", pos_group: "GOL" as PosGroup, player: null },
    { position: "LD",  pos_group: "DEF" as PosGroup, player: null },
    { position: "ZAG", pos_group: "DEF" as PosGroup, player: null },
    { position: "ZAG", pos_group: "DEF" as PosGroup, player: null },
    { position: "LE",  pos_group: "DEF" as PosGroup, player: null },
    { position: "VOL", pos_group: "MEI" as PosGroup, player: null },
    { position: "MC",  pos_group: "MEI" as PosGroup, player: null },
    { position: "MC",  pos_group: "MEI" as PosGroup, player: null },
    { position: "PD",  pos_group: "ATA" as PosGroup, player: null },
    { position: "CA",  pos_group: "ATA" as PosGroup, player: null },
    { position: "PE",  pos_group: "ATA" as PosGroup, player: null },
  ],

  "4-4-2": [
    { position: "GOL", pos_group: "GOL" as PosGroup, player: null },
    { position: "LD",  pos_group: "DEF" as PosGroup, player: null },
    { position: "ZAG", pos_group: "DEF" as PosGroup, player: null },
    { position: "ZAG", pos_group: "DEF" as PosGroup, player: null },
    { position: "LE",  pos_group: "DEF" as PosGroup, player: null },
    { position: "AD",  pos_group: "MEI" as PosGroup, player: null },
    { position: "MC",  pos_group: "MEI" as PosGroup, player: null },
    { position: "MC",  pos_group: "MEI" as PosGroup, player: null },
    { position: "AE",  pos_group: "MEI" as PosGroup, player: null },
    { position: "CA",  pos_group: "ATA" as PosGroup, player: null },
    { position: "CA",  pos_group: "ATA" as PosGroup, player: null },
  ],

  "3-5-2": [
    { position: "GOL", pos_group: "GOL" as PosGroup, player: null },
    { position: "ZAG", pos_group: "DEF" as PosGroup, player: null },
    { position: "ZAG", pos_group: "DEF" as PosGroup, player: null },
    { position: "ZAG", pos_group: "DEF" as PosGroup, player: null },
    { position: "AD",  pos_group: "MEI" as PosGroup, player: null },
    { position: "VOL", pos_group: "MEI" as PosGroup, player: null },
    { position: "MC",  pos_group: "MEI" as PosGroup, player: null },
    { position: "VOL", pos_group: "MEI" as PosGroup, player: null },
    { position: "AE",  pos_group: "MEI" as PosGroup, player: null },
    { position: "CA",  pos_group: "ATA" as PosGroup, player: null },
    { position: "CA",  pos_group: "ATA" as PosGroup, player: null },
  ],
};

// Sector adjacency: who a player shares chemistry links with
const SECTOR_NEIGHBORS: Record<PosGroup, PosGroup[]> = {
  GOL: ["DEF"],
  DEF: ["GOL", "DEF", "MEI"],
  MEI: ["DEF", "MEI", "ATA"],
  ATA: ["MEI", "ATA"],
};

/**
 * Calculates individual chemistry (0–10) per player and team chemistry (0–100).
 *
 * Links per player pair (only counted if neighbor sector-adjacent):
 *   same nation  → +1 (max 3 nation links)
 *   same league  → +1 (max 3 league links)
 *   same club    → +2 (max 2 club links — "green link")
 * Out of position → individual chem capped at 3 regardless.
 * Max possible individual chem = 10.
 *
 * Team chemistry modifier: maps 0–100 chem → -10% to +8% strength multiplier.
 */
export function calculateChemistry(slots: SlotInput[]): {
  chemistry: number;             // 0–100 team chemistry
  perPlayer: number[];           // individual chem per slot (0–10)
  modifier: number;              // multiplier to apply to sector strengths
} {
  const perPlayer: number[] = slots.map((slot, i) => {
    const p = slot.player;
    if (!p) return 0;

    const adjacentSectors = SECTOR_NEIGHBORS[slot.pos_group];

    // Nation/league/club links are capped individually to prevent absurd bonuses
    let nationLinks = 0, leagueLinks = 0, clubLinks = 0;

    for (let j = 0; j < slots.length; j++) {
      if (i === j) continue;
      const neighbor = slots[j];
      if (!neighbor.player) continue;
      if (!adjacentSectors.includes(neighbor.pos_group)) continue;

      if (nationLinks < 3 && p.nation === neighbor.player.nation) nationLinks++;
      if (leagueLinks < 3 && p.league === neighbor.player.league) leagueLinks++;
      if (clubLinks   < 2 && p.club   === neighbor.player.club)   clubLinks++;
    }

    const raw = nationLinks + leagueLinks + clubLinks * 2; // 0..10 max
    const outOfPos = slot.pos_group !== p.pos_group;        // always false when drafted correctly
    return outOfPos ? Math.min(3, raw) : Math.min(10, raw);
  });

  const avg = perPlayer.reduce((a, b) => a + b, 0) / Math.max(perPlayer.length, 1);
  const chemistry = Math.round(avg * 10); // 0–100

  // Linear modifier: chem 100 → +8%, chem 60 → 0%, chem 0 → -10%
  const modifier = chemistry >= 60
    ? 1 + ((chemistry - 60) / 40) * 0.08
    : 1 - ((60 - chemistry) / 60) * 0.10;

  return { chemistry, perPlayer, modifier };
}
