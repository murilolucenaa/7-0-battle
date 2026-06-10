"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useMatchStore } from "@/lib/store/matchStore";
import { Trophy, RotateCcw } from "lucide-react";

export default function ResultPage() {
  const router     = useRouter();
  const matchStore = useMatchStore();
  const { result, streak, commitResult } = matchStore;

  // Commit streak/points once when this page first mounts
  useEffect(() => {
    if (result && matchStore.status === "done") {
      commitResult();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No result yet → back to battle
  if (!result) {
    return (
      <>
        <Header />
        <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-12 flex flex-col items-center justify-center gap-5 text-center">
          <Trophy size={48} style={{ color: "var(--border)" }} />
          <p className="font-bold text-lg text-text">Nenhuma partida disputada ainda.</p>
          <Link href="/battle" className="rounded-full px-8 py-3 font-bold text-white"
            style={{ background: "var(--orange)" }}>
            Batalhar agora
          </Link>
        </main>
        <BottomNav />
      </>
    );
  }

  const won  = result.winner === "home";
  const drew = result.winner === "draw";
  const newStreak = streak; // already committed in useEffect

  // 7-0 celebration!
  if (newStreak >= 7) {
    return (
      <>
        <Header />
        <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-8 flex flex-col items-center gap-6 text-center">
          <div className="font-display text-8xl" style={{ color: "var(--gold)", lineHeight: 1 }}>
            7–0
          </div>
          <p className="font-display text-3xl" style={{ color: "var(--green)" }}>
            CAMPANHA COMPLETA!
          </p>
          <p className="text-base text-muted">
            7 vitórias seguidas. Você é o melhor do grupo.
          </p>
          <div className="flex gap-1 w-full max-w-xs">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 h-3 rounded-full" style={{ background: "var(--gold)" }} />
            ))}
          </div>
          <button
            onClick={() => { matchStore.reset(); router.push("/draft"); }}
            className="w-full max-w-xs rounded-full py-4 font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: "var(--green)" }}
          >
            Nova temporada →
          </button>
        </main>
        <BottomNav />
      </>
    );
  }

  const goalEvents = result.events.filter((e) => e.type === "goal");

  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-5 items-center">
        {/* Outcome badge */}
        <div
          className="rounded-full px-6 py-2 font-bold text-sm uppercase tracking-widest text-white"
          style={{
            background: won ? "var(--green)" : drew ? "var(--gold)" : "var(--red)",
          }}
        >
          {won ? "Vitória" : drew ? "Empate" : "Derrota"}
        </div>

        {/* Scoreboard */}
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--green)" }}>
                {result.homeFlag} Você
              </p>
              <span
                className="font-display"
                style={{ fontSize: "5rem", color: "var(--green)", lineHeight: 1 }}
              >
                {result.homeScore}
              </span>
            </div>
            <span className="font-display text-4xl" style={{ color: "var(--border)" }}>–</span>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                {result.awayFlag} CPU
              </p>
              <span
                className="font-display"
                style={{ fontSize: "5rem", color: "var(--muted)", lineHeight: 1 }}
              >
                {result.awayScore}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted">
            {result.homeTeam} vs {result.awayTeam} · +{result.pointsEarned} pts
          </p>
        </div>

        {/* Rumo ao 7–0 bar */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Rumo ao 7–0</span>
            <span className="font-display text-xl" style={{ color: "var(--gold)" }}>
              {newStreak}/7
            </span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-3 rounded-full transition-colors"
                style={{ background: i < newStreak ? "var(--gold)" : "var(--border)" }}
              />
            ))}
          </div>
          {won && newStreak < 7 && (
            <p className="text-xs text-muted mt-1.5 text-center">
              Mais {7 - newStreak} vitória{7 - newStreak > 1 ? "s" : ""} para o 7–0!
            </p>
          )}
          {!won && (
            <p className="text-xs text-muted mt-1.5 text-center">
              Sequência zerada. Redrafta e volte mais forte.
            </p>
          )}
        </div>

        {/* Best moments */}
        {goalEvents.length > 0 && (
          <div
            className="w-full rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Melhores momentos</p>
            {goalEvents.slice(0, 5).map((ev, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-display" style={{ color: "var(--gold)", minWidth: "2.2rem" }}>
                  {ev.min}'
                </span>
                <span className="font-semibold">{ev.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/league"
            className="w-full rounded-full py-3 font-bold text-sm text-center hover:opacity-90 transition-opacity"
            style={{ border: "2px solid var(--green)", color: "var(--green)" }}
          >
            Ver a liga
          </Link>

          {won ? (
            <Link
              href="/battle"
              className="w-full rounded-full py-4 font-bold text-base text-white text-center hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: "var(--orange)" }}
            >
              Próxima batalha →
            </Link>
          ) : (
            <button
              onClick={() => { matchStore.resetForDraft(); router.push("/draft"); }}
              className="w-full rounded-full py-4 font-bold text-base text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: "var(--green)" }}
            >
              <RotateCcw size={16} /> Redraftar time
            </button>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
