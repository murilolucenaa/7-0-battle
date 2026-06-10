"use client";

import { useState, useRef, useCallback } from "react";
import { simulate } from "@/lib/engine/simulate";
import { calculateChemistry, FORMATIONS } from "@/lib/engine/chemistry";
import { PLAYERS } from "@/supabase/seed/players";
import type { SimTeamInput } from "@/lib/engine/simulate";
import type { MatchEvent, PosGroup } from "@/lib/types";

// ── Build two fixed teams from seed data ──────────────────────

function buildTeam(name: string, playerIds: string[]): SimTeamInput {
  const slots = JSON.parse(JSON.stringify(FORMATIONS["4-3-3"]));
  const byId = Object.fromEntries(PLAYERS.map((p) => [p.id, p]));

  playerIds.slice(0, 11).forEach((id, i) => {
    slots[i].player = byId[id] ?? PLAYERS.find((p) => p.pos_group === slots[i].pos_group) ?? null;
  });

  const { chemistry, modifier } = calculateChemistry(slots);
  const bench = playerIds.slice(11).map((id) => byId[id]).filter(Boolean) as typeof PLAYERS;

  return { name, formation: "4-3-3", slots, bench, chemistry, chemModifier: modifier };
}

// Brasil 1970 — strong attack + high chemistry (Santos FC cluster)
const TEAM_A = buildTeam("🇧🇷 Brasil 1970", [
  "gol-1",                              // R. Salim (lend, GOL)
  "def-4", "def-1", "def-2", "def-15", // Ferreira, Okafor, Bianchi, Lima (DEF)
  "mei-1", "mei-13", "mei-8",           // Carvalho (lend), Souza, Ribeiro (MEI)
  "ata-1", "ata-15", "ata-10",          // Santos Jr. (lend), Ferreira Jr., Martins (ATA)
  "ata-12", "mei-12",                   // bench
]);

// Argentina 1986 — balanced, different clubs (less chemistry)
const TEAM_B = buildTeam("🇦🇷 Argentina 1986", [
  "gol-6",                              // P. Vargas (comum, GOL)
  "def-5", "def-8", "def-3", "def-20", // Méndez, Rojas, van Berg, Koch (DEF)
  "mei-2", "mei-3", "mei-9",            // Fernández (lend), Durand, Schulz (MEI)
  "ata-2", "ata-3", "ata-6",            // López, Simon, Müller Jr. (ATA)
  "ata-18", "mei-20",                   // bench
]);

// ── Event color helpers ───────────────────────────────────────
function eventColor(type: MatchEvent["type"]): string {
  switch (type) {
    case "goal":     return "#FFB400";
    case "sub":      return "#7C4DFF";
    case "card":     return "#FF5A1F";
    case "fulltime": return "#009A4E";
    default:         return "#6B7A70";
  }
}

function sectorOvr(team: SimTeamInput, group: PosGroup): number {
  const players = team.slots.filter((s) => s.pos_group === group && s.player);
  if (players.length === 0) return 0;
  return Math.round(players.reduce((sum, s) => sum + s.player!.ovr, 0) / players.length);
}

// ── Component ─────────────────────────────────────────────────

export default function SimDevPage() {
  const [seed, setSeed]           = useState(42);
  const [running, setRunning]     = useState(false);
  const [visibleEvents, setVisible] = useState<MatchEvent[]>([]);
  const [finalScore, setFinal]    = useState<{ h: number; a: number } | null>(null);
  const [determinism, setDeterminism] = useState<null | "pass" | "fail">(null);
  const [speed, setSpeed]         = useState(200); // ms per event
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickerRef                 = useRef<HTMLDivElement>(null);

  const runSim = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVisible([]);
    setFinal(null);
    setDeterminism(null);
    setRunning(true);

    const result = simulate(TEAM_A, TEAM_B, seed);
    let idx = 0;

    intervalRef.current = setInterval(() => {
      if (idx >= result.events.length) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        setFinal({ h: result.homeScore, a: result.awayScore });
        return;
      }
      setVisible((prev) => {
        const next = [...prev, result.events[idx]];
        // auto-scroll ticker
        setTimeout(() => {
          tickerRef.current?.scrollTo({ top: tickerRef.current.scrollHeight, behavior: "smooth" });
        }, 10);
        return next;
      });
      idx++;
    }, speed);
  }, [seed, speed]);

  const testDeterminism = useCallback(() => {
    const r1 = simulate(TEAM_A, TEAM_B, seed);
    const r2 = simulate(TEAM_A, TEAM_B, seed);
    const r3 = simulate(TEAM_A, TEAM_B, seed);
    const ok =
      r1.homeScore === r2.homeScore && r2.homeScore === r3.homeScore &&
      r1.awayScore === r2.awayScore && r2.awayScore === r3.awayScore &&
      JSON.stringify(r1.events) === JSON.stringify(r2.events);
    setDeterminism(ok ? "pass" : "fail");
  }, [seed]);

  // Current live score from last visible event
  const liveH = visibleEvents.at(-1)?.scoreH ?? 0;
  const liveA = visibleEvents.at(-1)?.scoreA ?? 0;
  const liveMin = visibleEvents.at(-1)?.min ?? 0;

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "#eee", fontFamily: "monospace", padding: "2rem" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#FFB400", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
            /_dev/sim — motor de simulação (offline)
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: 0 }}>7–0 Battle Engine Test</h1>
        </div>

        {/* Teams side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", marginBottom: "1.5rem", alignItems: "start" }}>
          {[TEAM_A, TEAM_B].map((team, ti) => (
            <div key={ti} style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1rem", border: "1px solid #2a2a2a" }}>
              <p style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.75rem" }}>{team.name}</p>
              {(["GOL","DEF","MEI","ATA"] as PosGroup[]).map((g) => (
                <div key={g} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "#6B7A70" }}>{g}</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{sectorOvr(team, g)}</span>
                </div>
              ))}
              <div style={{ marginTop: "0.75rem", borderTop: "1px solid #2a2a2a", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span style={{ color: "#6B7A70" }}>Química</span>
                <span style={{ color: team.chemistry >= 60 ? "#009A4E" : "#E23636", fontWeight: 700 }}>{team.chemistry}/100</span>
              </div>
            </div>
          ))}
          {/* Live scoreboard in the middle */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", color: "#6B7A70", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              {running ? `${liveMin}'` : "–"}
            </div>
            <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1, color: "#fff" }}>
              {liveH}<span style={{ color: "#333", margin: "0 0.25rem" }}>–</span>{liveA}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#6B7A70" }}>Seed</label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              style={{
                background: "#1a1a1a", border: "1px solid #333", color: "#fff",
                padding: "0.3rem 0.6rem", borderRadius: "6px", width: "80px", fontSize: "0.85rem",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#6B7A70" }}>Velocidade</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.85rem" }}
            >
              <option value={50}>⚡ Rápida (50ms)</option>
              <option value={200}>Normal (200ms)</option>
              <option value={600}>Lenta (600ms)</option>
            </select>
          </div>
          <button
            onClick={runSim}
            disabled={running}
            style={{
              background: running ? "#333" : "#009A4E",
              color: "#fff", border: "none", borderRadius: "8px",
              padding: "0.5rem 1.25rem", fontWeight: 700, cursor: running ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
            }}
          >
            {running ? "Simulando…" : "▶ Simular"}
          </button>
          <button
            onClick={testDeterminism}
            style={{
              background: "#1a1a1a", color: "#FFB400", border: "1px solid #FFB400",
              borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
            }}
          >
            Testar determinismo
          </button>
          {determinism && (
            <span style={{ color: determinism === "pass" ? "#009A4E" : "#E23636", fontWeight: 700, fontSize: "0.85rem" }}>
              {determinism === "pass" ? "✓ Mesmo seed → mesmo resultado" : "✗ FALHOU — bug no PRNG"}
            </span>
          )}
        </div>

        {/* Commentary ticker */}
        <div
          ref={tickerRef}
          style={{
            background: "#1a1a1a", borderRadius: "12px", border: "1px solid #2a2a2a",
            padding: "1rem", height: "360px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem",
          }}
        >
          {visibleEvents.length === 0 && (
            <p style={{ color: "#333", margin: "auto", textAlign: "center" }}>Clique em ▶ Simular para assistir ao jogo</p>
          )}
          {visibleEvents.map((ev, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", animation: "fadeIn 0.2s ease" }}>
              <span style={{ color: "#444", minWidth: "2.5rem", fontVariantNumeric: "tabular-nums" }}>
                {ev.min}&apos;
              </span>
              <span style={{ color: eventColor(ev.type), fontWeight: ev.type === "goal" ? 700 : 400, flex: 1 }}>
                {ev.text}
              </span>
              {ev.type === "goal" && (
                <span style={{ color: "#FFB400", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {ev.scoreH}–{ev.scoreA}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Final result */}
        {finalScore && (
          <div style={{ marginTop: "1.5rem", background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem", textAlign: "center", border: "1px solid #2a2a2a" }}>
            <p style={{ color: "#6B7A70", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Resultado final
            </p>
            <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              {finalScore.h}<span style={{ color: "#333", margin: "0 0.5rem" }}>–</span>{finalScore.a}
            </div>
            <p style={{ color: "#FFB400", fontWeight: 700, marginTop: "0.5rem" }}>
              {finalScore.h > finalScore.a
                ? `${TEAM_A.name} venceu!`
                : finalScore.a > finalScore.h
                ? `${TEAM_B.name} venceu!`
                : "Empate!"}
            </p>
            <p style={{ color: "#444", fontSize: "0.75rem", marginTop: "0.75rem" }}>
              Troque o seed para ver um jogo diferente. Mesmo seed → sempre mesmo resultado.
            </p>
          </div>
        )}

        {/* Quick stats — 10 game sample */}
        <div style={{ marginTop: "1.5rem", background: "#1a1a1a", borderRadius: "12px", padding: "1rem", border: "1px solid #2a2a2a" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7A70", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            Amostra: 20 jogos com seeds 0–19
          </p>
          {(() => {
            let wins = 0, draws = 0, losses = 0, totalGoals = 0;
            for (let s = 0; s < 20; s++) {
              const r = simulate(TEAM_A, TEAM_B, s);
              if (r.winner === "home") wins++;
              else if (r.winner === "draw") draws++;
              else losses++;
              totalGoals += r.homeScore + r.awayScore;
            }
            return (
              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem" }}>
                <div><span style={{ color: "#009A4E", fontWeight: 700 }}>{wins}V</span></div>
                <div><span style={{ color: "#6B7A70", fontWeight: 700 }}>{draws}E</span></div>
                <div><span style={{ color: "#E23636", fontWeight: 700 }}>{losses}D</span></div>
                <div><span style={{ color: "#fff" }}>Média gols: </span><span style={{ color: "#FFB400", fontWeight: 700 }}>{(totalGoals / 20).toFixed(1)}</span></div>
              </div>
            );
          })()}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; } }
      `}</style>
    </main>
  );
}
