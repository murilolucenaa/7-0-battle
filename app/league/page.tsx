"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useMatchStore } from "@/lib/store/matchStore";

const CPU_TEAMS = [
  { name: "🇫🇷 França 1998",    flag: "🇫🇷" },
  { name: "🇩🇪 Alemanha 1974",  flag: "🇩🇪" },
  { name: "🇮🇹 Itália 1982",    flag: "🇮🇹" },
];

export default function LeaguePage() {
  const [tab, setTab] = useState<"tabela" | "bracket">("tabela");
  const { result, streak, totalPoints } = useMatchStore();

  // Derive user stats from match store
  const userWins    = result?.winner === "home" ? 1 : 0;
  const userDraws   = result?.winner === "draw" ? 1 : 0;
  const userLosses  = result?.winner === "away" ? 1 : 0;
  const userPts     = totalPoints;

  const STANDINGS = [
    { pos: 1, name: "Você",           w: userWins,  d: userDraws, l: userLosses, pts: userPts,        isMe: true  },
    { pos: 2, name: CPU_TEAMS[0].name, w: 4, d: 2, l: 1, pts: 52, isMe: false },
    { pos: 3, name: CPU_TEAMS[1].name, w: 3, d: 1, l: 3, pts: 39, isMe: false },
    { pos: 4, name: CPU_TEAMS[2].name, w: 2, d: 2, l: 3, pts: 28, isMe: false },
  ].sort((a, b) => b.pts - a.pts)
   .map((r, i) => ({ ...r, pos: i + 1 }));

  // ── Bracket (simplified 4-player) ────────────────────────────
  const BracketSlot = ({
    name, isCpu, winner,
  }: { name: string; isCpu: boolean; winner?: boolean }) => (
    <div
      className="rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-1.5"
      style={{
        background: winner ? "var(--green)" : "var(--surface)",
        color:      winner ? "#fff" : "var(--text)",
        border:     `1px solid ${winner ? "var(--green)" : "var(--border)"}`,
      }}
    >
      {isCpu && <span className="text-xs">🎲</span>}
      <span className="truncate">{name}</span>
    </div>
  );

  const Connector = () => (
    <div
      className="flex items-center self-stretch"
      style={{ color: "var(--border)" }}
    >
      <svg width="16" height="40" viewBox="0 0 16 40" fill="none">
        <path d="M0 10 H8 V30 H0" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 20 H16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );

  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-5">
        {/* Tab switcher */}
        <div
          className="flex rounded-full overflow-hidden p-0.5"
          style={{ background: "var(--surf-2)" }}
        >
          {(["tabela", "bracket"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 text-sm font-bold rounded-full transition-colors"
              style={
                tab === t
                  ? { background: "var(--green)", color: "#fff" }
                  : { color: "var(--muted)" }
              }
            >
              {t === "tabela" ? "Tabela" : "Mata-mata"}
            </button>
          ))}
        </div>

        {/* ── Tabela ─────────────────────────────────────────── */}
        {tab === "tabela" && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {/* Header */}
            <div
              className="grid grid-cols-[1.5rem_1fr_repeat(3,2rem)_3rem] gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted"
              style={{ background: "var(--surf-2)" }}
            >
              <span>#</span><span>Jogador</span>
              <span className="text-center">V</span>
              <span className="text-center">E</span>
              <span className="text-center">D</span>
              <span className="text-right">Pts</span>
            </div>
            {STANDINGS.map((row) => (
              <div
                key={row.pos}
                className="grid grid-cols-[1.5rem_1fr_repeat(3,2rem)_3rem] gap-2 px-4 py-3 items-center text-sm border-t"
                style={{
                  borderColor: "var(--border)",
                  background:  row.isMe ? "rgba(0,154,78,0.06)" : "var(--surface)",
                }}
              >
                <span
                  className="font-display text-base"
                  style={{ color: row.isMe ? "var(--green)" : "var(--muted)" }}
                >
                  {row.pos}
                </span>
                <span className={`font-semibold truncate ${row.isMe ? "text-green" : "text-text"}`}>
                  {row.name}
                </span>
                <span className="text-center text-muted text-xs">{row.w}</span>
                <span className="text-center text-muted text-xs">{row.d}</span>
                <span className="text-center text-muted text-xs">{row.l}</span>
                <span
                  className="text-right font-display text-lg"
                  style={{ color: row.isMe ? "var(--green)" : "var(--text)" }}
                >
                  {row.pts}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Mata-mata ──────────────────────────────────────── */}
        {tab === "bracket" && (
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Semifinal</p>

            {/* Match 1 */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1.5 flex-1">
                <BracketSlot name="Você" isCpu={false} winner />
                <BracketSlot name={CPU_TEAMS[0].name} isCpu />
              </div>
              <Connector />
              <div className="flex flex-col gap-1.5 flex-1">
                <BracketSlot name="Você" isCpu={false} winner />
              </div>
            </div>

            {/* Match 2 */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1.5 flex-1">
                <BracketSlot name={CPU_TEAMS[1].name} isCpu />
                <BracketSlot name={CPU_TEAMS[2].name} isCpu />
              </div>
              <Connector />
              <div className="flex flex-col gap-1.5 flex-1">
                <BracketSlot name="?" isCpu />
              </div>
            </div>

            {/* Final */}
            <p className="text-xs font-bold uppercase tracking-widest text-muted mt-2">Final</p>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1.5 flex-1">
                <BracketSlot name="Você" isCpu={false} />
                <BracketSlot name="?" isCpu />
              </div>
              <div className="flex items-center justify-center w-16">
                <span className="text-2xl">🏆</span>
              </div>
            </div>

            <p className="text-xs text-muted mt-1">
              🎲 = seleção CPU (vagas sem jogador humano)
            </p>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
