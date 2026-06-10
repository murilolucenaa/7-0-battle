"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Formation, Player } from "@/lib/types";
import { FORMATIONS, calculateChemistry } from "@/lib/engine/chemistry";
import type { SlotInput } from "@/lib/engine/chemistry";
import { drawPlayer as drawFromPool } from "@/supabase/seed/players";

// ── Available team identities (thematic — not a filter on the player pool) ──
export const NATIONS = [
  { name: "Brasil",    flag: "🇧🇷", years: [1958, 1970, 1994, 2002] },
  { name: "Argentina", flag: "🇦🇷", years: [1978, 1986, 2014]       },
  { name: "França",    flag: "🇫🇷", years: [1998, 2006]             },
  { name: "Itália",    flag: "🇮🇹", years: [1982, 2006]             },
  { name: "Alemanha",  flag: "🇩🇪", years: [1974, 1990]             },
  { name: "Espanha",   flag: "🇪🇸", years: [2010, 2012]             },
  { name: "Holanda",   flag: "🇳🇱", years: [1974, 1988]             },
  { name: "Portugal",  flag: "🇵🇹", years: [2004, 2016]             },
  { name: "Nigéria",   flag: "🇳🇬", years: [1994, 2014]             },
  { name: "Senegal",   flag: "🇸🇳", years: [2002, 2022]             },
] as const;

const REROLLS_DEFAULT = 3;

interface DraftState {
  // Team identity
  formation: Formation;
  teamName:  string;   // "Brasil 1970"
  teamFlag:  string;   // "🇧🇷"
  cupYear:   number;

  // Draft progress
  slots:            SlotInput[];
  bench:            Player[];
  rerolls:          number;       // 3 → 0
  drawnIds:         string[];     // prevent duplicate players
  lastDrawnIdx:     number | null; // for reveal animation; reset after consumed

  // Chemistry (recalculated on every draw)
  chemistry:        number;
  chemModifier:     number;
  perPlayerChem:    number[];

  // Phase
  phase: "identity" | "draft" | "done";

  // ── Actions ────────────────────────────────────────────────
  randomizeIdentity: () => void;
  setFormation:      (f: Formation) => void;
  startDraft:        () => void;
  drawSlot:          (index: number) => void;
  consumeReveal:     () => void; // call after animation completes
  resetDraft:        () => void;
}

function freshSlots(formation: Formation): SlotInput[] {
  return FORMATIONS[formation].map((s) => ({ ...s, player: null, locked: false }));
}

function recalcChem(slots: SlotInput[]): Pick<DraftState, "chemistry" | "chemModifier" | "perPlayerChem"> {
  const { chemistry, modifier, perPlayer } = calculateChemistry(slots);
  return { chemistry, chemModifier: modifier, perPlayerChem: perPlayer };
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      formation:     "4-3-3",
      teamName:      "",
      teamFlag:      "",
      cupYear:       0,
      slots:         freshSlots("4-3-3"),
      bench:         [],
      rerolls:       REROLLS_DEFAULT,
      drawnIds:      [],
      lastDrawnIdx:  null,
      chemistry:     0,
      chemModifier:  1,
      perPlayerChem: [],
      phase:         "identity",

      randomizeIdentity: () => {
        const nation = NATIONS[Math.floor(Math.random() * NATIONS.length)];
        const year   = nation.years[Math.floor(Math.random() * nation.years.length)];
        set({
          teamName: `${nation.name} ${year}`,
          teamFlag: nation.flag,
          cupYear:  year,
        });
      },

      setFormation: (f) => {
        const { phase } = get();
        // Only change formation before drawing starts (or after reset)
        if (phase !== "identity") return;
        set({ formation: f, slots: freshSlots(f) });
      },

      startDraft: () => {
        const { teamName } = get();
        if (!teamName) return; // must have identity
        set({ phase: "draft", rerolls: REROLLS_DEFAULT, drawnIds: [], lastDrawnIdx: null });
      },

      drawSlot: (index) => {
        const { slots, rerolls, drawnIds, formation } = get();
        const slot = slots[index];
        const isRefill = slot.player !== null;

        // Reroll costs 1; if locked (rerolls=0 and filled), do nothing
        if (isRefill && rerolls <= 0) return;

        const newRerolls = isRefill ? rerolls - 1 : rerolls;

        // Draw weighted player of correct pos_group, excluding already-drawn
        const rand = () => Math.random();
        const player = drawFromPool(slot.pos_group, rand, drawnIds);

        const newSlots = slots.map((s, i) =>
          i === index ? { ...s, player, locked: false } : s
        );

        // Lock all filled slots when rerolls hit 0
        const effectiveRerolls = newRerolls;
        const finalSlots = effectiveRerolls <= 0
          ? newSlots.map((s) => ({ ...s, locked: s.player !== null }))
          : newSlots;

        const newDrawnIds = isRefill
          ? [...drawnIds.filter((id) => id !== slot.player!.id), player.id]
          : [...drawnIds, player.id];

        const allFilled = finalSlots.every((s) => s.player !== null);

        set({
          slots:        finalSlots,
          rerolls:      effectiveRerolls,
          drawnIds:     newDrawnIds,
          lastDrawnIdx: index,
          phase:        allFilled ? "draft" : "draft",
          ...recalcChem(finalSlots),
        });
      },

      consumeReveal: () => set({ lastDrawnIdx: null }),

      resetDraft: () => {
        const { formation } = get();
        set({
          slots:         freshSlots(formation),
          bench:         [],
          rerolls:       REROLLS_DEFAULT,
          drawnIds:      [],
          lastDrawnIdx:  null,
          teamName:      "",
          teamFlag:      "",
          cupYear:       0,
          chemistry:     0,
          chemModifier:  1,
          perPlayerChem: [],
          phase:         "identity",
        });
      },
    }),
    {
      name: "7-0-draft",
      // Only persist phase + draft progress (not actions)
      partialize: (s) => ({
        formation:     s.formation,
        teamName:      s.teamName,
        teamFlag:      s.teamFlag,
        cupYear:       s.cupYear,
        slots:         s.slots,
        bench:         s.bench,
        rerolls:       s.rerolls,
        drawnIds:      s.drawnIds,
        chemistry:     s.chemistry,
        chemModifier:  s.chemModifier,
        perPlayerChem: s.perPlayerChem,
        phase:         s.phase,
      }),
    }
  )
);
