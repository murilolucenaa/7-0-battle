"use client";

import Link from "next/link";
import { useDraftStore } from "@/lib/store/draftStore";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { RARITY_COLOR } from "@/components/PlayerCard";
import type { Formation } from "@/lib/types";
import type { SlotInput } from "@/lib/engine/chemistry";

// ── Pitch positions (x%, y%) per formation ────────────────────
// x: 0=left, 100=right  |  y: 0=opponent goal, 100=own goal

const FIELD_POSITIONS: Record<Formation, Array<{ x: number; y: number }>> = {
  "4-3-3": [
    { x: 48, y: 87 }, // GOL
    { x: 80, y: 68 }, // LD
    { x: 62, y: 72 }, // ZAG
    { x: 36, y: 72 }, // ZAG
    { x: 18, y: 68 }, // LE
    { x: 48, y: 52 }, // VOL
    { x: 68, y: 46 }, // MC
    { x: 28, y: 46 }, // MC
    { x: 78, y: 22 }, // PD
    { x: 48, y: 14 }, // CA
    { x: 18, y: 22 }, // PE
  ],
  "4-4-2": [
    { x: 48, y: 87 }, // GOL
    { x: 80, y: 68 }, // LD
    { x: 62, y: 72 }, // ZAG
    { x: 36, y: 72 }, // ZAG
    { x: 18, y: 68 }, // LE
    { x: 78, y: 46 }, // AD
    { x: 62, y: 52 }, // MC
    { x: 36, y: 52 }, // MC
    { x: 18, y: 46 }, // AE
    { x: 62, y: 17 }, // CA
    { x: 36, y: 17 }, // CA
  ],
  "3-5-2": [
    { x: 48, y: 87 }, // GOL
    { x: 67, y: 72 }, // ZAG
    { x: 48, y: 75 }, // ZAG
    { x: 30, y: 72 }, // ZAG
    { x: 82, y: 48 }, // AD
    { x: 65, y: 52 }, // MC
    { x: 48, y: 56 }, // VOL
    { x: 32, y: 52 }, // MC
    { x: 16, y: 48 }, // AE
    { x: 62, y: 17 }, // CA
    { x: 36, y: 17 }, // CA
  ],
};

// ── Sector ranges per formation (slot indices) ────────────────
const SECTORS: Record<Formation, { def: number[]; mei: number[]; ata: number[] }> = {
  "4-3-3": { def: [1,2,3,4],  mei: [5,6,7],   ata: [8,9,10]  },
  "4-4-2": { def: [1,2,3,4],  mei: [5,6,7,8], ata: [9,10]    },
  "3-5-2": { def: [1,2,3],    mei: [4,5,6,7,8], ata: [9,10]  },
};

function sectorAvg(slots: SlotInput[], indices: number[]): number {
  const ovrs = indices
    .map((i) => slots[i]?.player?.ovr ?? 0)
    .filter((o) => o > 0);
  return ovrs.length > 0 ? Math.round(ovrs.reduce((a, b) => a + b, 0) / ovrs.length) : 0;
}

export default function TeamPage() {
  const { slots, formation, teamName, teamFlag, cupYear, chemistry, chemModifier, rerolls } = useDraftStore();
  const positions = FIELD_POSITIONS[formation];
  const sectors   = SECTORS[formation];

  const defAvg = sectorAvg(slots, sectors.def);
  const meiAvg = sectorAvg(slots, sectors.mei);
  const ataAvg = sectorAvg(slots, sectors.ata);
  const gkOvr  = slots[0]?.player?.ovr ?? 0;

  const allFilled = slots.every((s) => s.player !== null);
  const chemBonus = ((chemModifier - 1) * 100).toFixed(0);

  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-4 flex flex-col gap-4">
        {/* Team identity */}
        {teamName && (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-xl" style={{ color: "var(--green)", lineHeight: 1 }}>
                {teamFlag} {teamName}
              </p>
              <p className="text-xs text-muted">Copa {cupYear} · {formation}</p>
            </div>
            {rerolls > 0 && (
              <Link href="/draft" className="text-xs font-bold underline" style={{ color: "var(--orange)" }}>
                Voltar ao draft ({rerolls} trocas)
              </Link>
            )}
          </div>
        )}

        {/* Sector ratings */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "GOL", value: gkOvr,  color: "var(--muted)"  },
            { label: "DEF", value: defAvg, color: "var(--green)"  },
            { label: "MEI", value: meiAvg, color: "var(--gold)"   },
            { label: "ATA", value: ataAvg, color: "var(--orange)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl p-2.5 flex flex-col items-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</span>
              <span className="font-display text-3xl mt-0.5" style={{ color }}>
                {value || "–"}
              </span>
            </div>
          ))}
        </div>

        {/* Chemistry bar */}
        <div
          className="rounded-xl p-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-text">Química</span>
            <span className="font-display text-lg" style={{ color: chemistry >= 60 ? "var(--green)" : "var(--orange)" }}>
              {chemistry}/100
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width:      `${chemistry}%`,
                background: chemistry >= 70 ? "var(--green)" : chemistry >= 50 ? "var(--gold)" : "var(--orange)",
              }}
            />
          </div>
          <p className="text-[11px] text-muted mt-1.5">
            {chemModifier >= 1
              ? `+${chemBonus}% de força — time encaixado`
              : `${chemBonus}% de força — time desconexo`}
          </p>
        </div>

        {/* Pitch */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ aspectRatio: "3 / 4", background: "#1a5c2e" }}
        >
          {/* Pitch lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }}>
            {/* Halfway line */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" />
            {/* Center circle */}
            <circle cx="50%" cy="50%" r="10%" stroke="white" strokeWidth="1" fill="none" />
            {/* Penalty areas */}
            <rect x="20%" y="75%" width="60%" height="22%" stroke="white" strokeWidth="1" fill="none" />
            <rect x="20%" y="3%"  width="60%" height="22%" stroke="white" strokeWidth="1" fill="none" />
            {/* Goals */}
            <rect x="35%" y="96%" width="30%" height="4%" stroke="white" strokeWidth="1" fill="none" />
            <rect x="35%" y="0%"  width="30%" height="4%" stroke="white" strokeWidth="1" fill="none" />
          </svg>

          {/* Players */}
          {slots.map((slot, i) => {
            const pos    = positions[i];
            const p      = slot.player;
            const color  = p ? RARITY_COLOR[p.rarity] : "#555";
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center gap-0.5"
                style={{
                  left:      `${pos.x}%`,
                  top:       `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  width:     "13%",
                }}
              >
                {/* Jersey circle */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width:      "clamp(28px, 6vw, 36px)",
                    height:     "clamp(28px, 6vw, 36px)",
                    background: p ? color : "#333",
                    border:     "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <span
                    className="font-display text-white leading-none"
                    style={{ fontSize: "clamp(0.7rem, 2vw, 0.9rem)" }}
                  >
                    {i + 1}
                  </span>
                </div>
                {/* Name tag */}
                <div
                  className="text-center leading-none px-1 py-0.5 rounded"
                  style={{
                    background: "rgba(0,0,0,0.65)",
                    maxWidth:   "100%",
                    overflow:   "hidden",
                  }}
                >
                  <p
                    className="text-white font-semibold truncate"
                    style={{ fontSize: "clamp(0.45rem, 1.5vw, 0.55rem)" }}
                  >
                    {p ? p.name.split(" ").pop() : slot.position}
                  </p>
                  {p && (
                    <p className="font-display text-white" style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.6rem)" }}>
                      {p.ovr}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          {!allFilled && (
            <Link
              href="/draft"
              className="w-full rounded-full py-3 font-bold text-sm text-center"
              style={{ border: "2px solid var(--green)", color: "var(--green)" }}
            >
              Completar draft
            </Link>
          )}
          <button
            disabled={!allFilled}
            className="w-full rounded-full py-4 font-bold text-base text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--orange)" }}
          >
            {allFilled ? "Batalhar →" : `Monte todos os 11 (${slots.filter(s => s.player).length}/11)`}
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
