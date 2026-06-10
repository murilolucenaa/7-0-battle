"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Swords, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useDraftStore, NATIONS } from "@/lib/store/draftStore";
import { useMatchStore } from "@/lib/store/matchStore";
import { simulate } from "@/lib/engine/simulate";
import { calculateChemistry, FORMATIONS } from "@/lib/engine/chemistry";
import { drawPlayer as drawFromPool } from "@/supabase/seed/players";
import { scoreTeam } from "@/lib/engine/scoring";
import type { SimTeamInput } from "@/lib/engine/simulate";
import type { MatchEvent } from "@/lib/types";

// ── CPU team builder ──────────────────────────────────────────
function buildCPUTeam(): SimTeamInput {
  const nation = NATIONS[Math.floor(Math.random() * NATIONS.length)];
  const year   = nation.years[Math.floor(Math.random() * nation.years.length)];
  const name   = `${nation.flag} ${nation.name} ${year}`;

  const slots  = JSON.parse(JSON.stringify(FORMATIONS["4-3-3"]));
  const drawn: string[] = [];
  for (const slot of slots) {
    const p = drawFromPool(slot.pos_group, () => Math.random(), drawn);
    slot.player = p;
    drawn.push(p.id);
  }
  const { chemistry, modifier } = calculateChemistry(slots);
  return { name, formation: "4-3-3", slots, bench: [], chemistry, chemModifier: modifier };
}

const MS_PER_EVENT = 280; // replay speed

function eventColor(type: MatchEvent["type"]): string {
  switch (type) {
    case "goal":     return "var(--gold)";
    case "sub":      return "var(--roxo)";
    case "card":     return "var(--orange)";
    case "fulltime": return "var(--green)";
    default:         return "var(--text)";
  }
}

// ── Page ─────────────────────────────────────────────────────
export default function BattlePage() {
  const draft      = useDraftStore();
  const matchStore = useMatchStore();

  // CPU team is stable across re-renders via useState(init)
  const [cpuTeam]        = useState<SimTeamInput>(buildCPUTeam);
  const [phase, setPhase] = useState<"idle" | "simulating" | "done">("idle");
  const [events, setEvents] = useState<MatchEvent[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickerRef   = useRef<HTMLDivElement>(null);

  const live = events.at(-1);
  const scoreH = live?.scoreH ?? 0;
  const scoreA = live?.scoreA ?? 0;
  const liveMin = live?.min ?? 0;

  const userTeam: SimTeamInput = {
    name:        draft.teamName || "Meu Time",
    formation:   draft.formation,
    slots:       draft.slots,
    bench:       draft.bench,
    chemistry:   draft.chemistry,
    chemModifier: draft.chemModifier,
  };

  const allFilled = draft.slots.every((s) => s.player !== null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const runBattle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEvents([]);
    setPhase("simulating");

    const seed   = Math.floor(Math.random() * 2 ** 31);
    const result = simulate(userTeam, cpuTeam, seed);
    let idx = 0;

    intervalRef.current = setInterval(() => {
      if (idx >= result.events.length) {
        clearInterval(intervalRef.current!);
        setPhase("done");

        // Compute Cartola points for user's team
        const teamPlayers = userTeam.slots
          .filter((s) => s.player)
          .map((s) => ({
            id:        s.player!.id,
            name:      s.player!.name,
            pos_group: s.player!.pos_group,
          }));
        const { total } = scoreTeam(teamPlayers, result.events, "h", result.awayScore);

        matchStore.setResult({
          homeScore:    result.homeScore,
          awayScore:    result.awayScore,
          homeTeam:     userTeam.name,
          awayTeam:     cpuTeam.name,
          homeFlag:     draft.teamFlag || "⚽",
          awayFlag:     cpuTeam.name.split(" ")[0] ?? "🤖",
          events:       result.events,
          winner:       result.winner,
          pointsEarned: Math.round(total),
        });
        return;
      }

      setEvents((prev) => {
        const next = [...prev, result.events[idx]];
        setTimeout(() => {
          tickerRef.current?.scrollTo({ top: tickerRef.current.scrollHeight, behavior: "smooth" });
        }, 10);
        return next;
      });
      idx++;
    }, MS_PER_EVENT);
  }, [userTeam, cpuTeam, draft.teamFlag, matchStore]);

  // ── Guard: no team ─────────────────────────────────────────
  if (!allFilled) {
    return (
      <>
        <Header />
        <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-12 flex flex-col items-center justify-center gap-5 text-center">
          <Swords size={48} style={{ color: "var(--border)" }} />
          <div>
            <p className="font-bold text-lg text-text">Sem time, sem batalha.</p>
            <p className="text-sm text-muted mt-1">Monte os 11 no draft antes de entrar em campo.</p>
          </div>
          <Link
            href="/draft"
            className="rounded-full px-8 py-3 font-bold text-white"
            style={{ background: "var(--green)" }}
          >
            Ir para o draft
          </Link>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-4 flex flex-col gap-4">
        {/* Live badge */}
        <div className="flex items-center gap-2 h-5">
          {phase === "simulating" && (
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--red)" }} />
          )}
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{
              color: phase === "simulating" ? "var(--red)"
                   : phase === "done"       ? "var(--green)"
                   : "var(--muted)",
            }}
          >
            {phase === "idle"       ? "Pronto para batalhar"
           : phase === "simulating" ? "AO VIVO"
           : "Fim de jogo"}
          </span>
        </div>

        {/* Scoreboard */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            {/* Home */}
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--green)" }}
              >
                Você
              </span>
              <span className="text-xs font-semibold text-text truncate">{userTeam.name}</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="font-display"
                style={{ fontSize: "3.5rem", color: "var(--green)", lineHeight: 1 }}
              >
                {scoreH}
              </span>
              <span className="font-display text-2xl" style={{ color: "var(--border)" }}>–</span>
              <span
                className="font-display"
                style={{ fontSize: "3.5rem", color: scoreA > scoreH ? "var(--red)" : "var(--muted)", lineHeight: 1 }}
              >
                {scoreA}
              </span>
            </div>

            {/* Away */}
            <div className="flex-1 flex flex-col gap-0.5 items-end min-w-0">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                CPU
              </span>
              <span className="text-xs font-semibold text-text truncate text-right">{cpuTeam.name}</span>
            </div>
          </div>

          {phase !== "idle" && (
            <div className="flex items-center justify-between">
              {/* Possession bar (event count ratio) */}
              {(() => {
                const homeEvents = events.filter((e) => e.side === "h" && e.type === "goal").length;
                const awayEvents = events.filter((e) => e.side === "a" && e.type === "goal").length;
                const pct = events.length > 0
                  ? Math.round(events.filter((e) => e.side === "h").length / events.length * 100)
                  : 50;
                return (
                  <div className="flex-1 mr-3">
                    <div className="flex justify-between text-[10px] text-muted mb-0.5">
                      <span>{pct}%</span>
                      <span className="font-bold text-muted">Posse</span>
                      <span>{100 - pct}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5 flex overflow-hidden"
                      style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: "var(--green)" }} />
                    </div>
                  </div>
                );
              })()}
              <span
                className="font-display text-xl shrink-0"
                style={{ color: "var(--muted)" }}
              >
                {phase === "done" ? "90'" : `${liveMin}'`}
              </span>
            </div>
          )}
        </div>

        {/* Commentary ticker */}
        {phase !== "idle" && (
          <div
            ref={tickerRef}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background:    "var(--surf-2)",
              border:        "1px solid var(--border)",
              maxHeight:     "260px",
              overflowY:     "auto",
            }}
          >
            {events.map((ev, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span
                  className="font-display shrink-0 tabular-nums"
                  style={{ color: "var(--muted)", minWidth: "2.2rem" }}
                >
                  {ev.min}'
                </span>
                <span
                  style={{
                    color:      eventColor(ev.type),
                    fontWeight: ev.type === "goal" || ev.type === "fulltime" ? 700 : 400,
                    flex:       1,
                  }}
                >
                  {ev.text}
                </span>
                {ev.type === "goal" && (
                  <span
                    className="font-display shrink-0"
                    style={{ color: "var(--gold)", fontSize: "0.95rem" }}
                  >
                    {ev.scoreH}–{ev.scoreA}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {phase === "idle" && (
          <button
            onClick={runBattle}
            className="w-full rounded-full py-4 font-bold text-base text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: "var(--orange)" }}
          >
            <Swords size={18} /> Batalhar
          </button>
        )}

        {phase === "simulating" && (
          <div
            className="w-full rounded-full py-4 font-bold text-base text-center"
            style={{ background: "var(--surf-2)", color: "var(--muted)" }}
          >
            Simulando…
          </div>
        )}

        {phase === "done" && (
          <Link
            href="/result"
            className="w-full rounded-full py-4 font-bold text-base text-white text-center flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: "var(--green)" }}
          >
            Ver resultado <ChevronRight size={18} />
          </Link>
        )}
      </main>
      <BottomNav />
    </>
  );
}
