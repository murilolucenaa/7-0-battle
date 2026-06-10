"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MatchEvent } from "@/lib/types";

export interface MatchResult {
  homeScore:    number;
  awayScore:    number;
  homeTeam:     string;  // "🇧🇷 Brasil 1970"
  awayTeam:     string;  // "🇫🇷 França 1998"
  homeFlag:     string;  // "🇧🇷"
  awayFlag:     string;  // "🇫🇷"
  events:       MatchEvent[];
  winner:       "home" | "away" | "draw";
  pointsEarned: number;
}

interface MatchStore {
  status:      "idle" | "done";
  result:      MatchResult | null;
  streak:      number;   // consecutive wins (the 7-0 run)
  totalPoints: number;   // season Cartola points

  setResult:     (r: MatchResult) => void;
  commitResult:  () => void; // call once when user navigates away from result
  resetForDraft: () => void; // loss/draw → redraft, reset streak
  reset:         () => void;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      status:      "idle",
      result:      null,
      streak:      0,
      totalPoints: 0,

      setResult: (r) => set({ status: "done", result: r }),

      commitResult: () => {
        const { result, streak, totalPoints } = get();
        if (!result) return;
        const won = result.winner === "home";
        const drew = result.winner === "draw";
        set({
          streak:      won ? streak + 1 : 0,
          totalPoints: totalPoints + result.pointsEarned,
        });
      },

      resetForDraft: () => set({ streak: 0, status: "idle", result: null }),

      reset: () => set({ status: "idle", result: null, streak: 0, totalPoints: 0 }),
    }),
    { name: "7-0-match" }
  )
);
