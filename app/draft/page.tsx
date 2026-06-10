"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw, Shuffle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PlayerCard from "@/components/PlayerCard";
import { useDraftStore, NATIONS } from "@/lib/store/draftStore";
import type { Formation } from "@/lib/types";

const FORMATIONS: Formation[] = ["4-3-3", "4-4-2", "3-5-2"];

export default function DraftPage() {
  const router  = useRouter();
  const store   = useDraftStore();
  const {
    phase, formation, teamName, teamFlag, cupYear,
    slots, rerolls, lastDrawnIdx, chemistry, chemModifier,
    randomizeIdentity, setFormation, startDraft, drawSlot, consumeReveal, resetDraft,
  } = store;

  const filledCount = slots.filter((s) => s.player !== null).length;
  const allFilled   = filledCount === 11;

  // Consume reveal flag after animation duration
  useEffect(() => {
    if (lastDrawnIdx === null) return;
    const t = setTimeout(consumeReveal, 700);
    return () => clearTimeout(t);
  }, [lastDrawnIdx, consumeReveal]);

  // ── PHASE: identity ────────────────────────────────────────
  if (phase === "identity") {
    return (
      <>
        <Header />
        <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-6">
          {/* Mission banner */}
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "var(--green)", color: "#fff" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-1">Sua missão</p>
            <p className="font-display text-3xl tracking-wide">MONTE OS 11 · VENÇA 7</p>
          </div>

          {/* Formation picker */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Formação</p>
            <div className="flex gap-2">
              {FORMATIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormation(f)}
                  className="flex-1 py-2.5 rounded-full text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-green"
                  style={
                    f === formation
                      ? { background: "var(--green)", color: "#fff" }
                      : { background: "var(--surf-2)", color: "var(--muted)" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Nation / identity */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Seleção</p>
            {teamName ? (
              <div
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{ background: "var(--surface)", border: "2px solid var(--green)" }}
              >
                <div>
                  <p className="font-display text-3xl" style={{ color: "var(--green)", lineHeight: 1 }}>
                    {teamFlag} {teamName}
                  </p>
                  <p className="text-xs text-muted mt-1">Copa {cupYear}</p>
                </div>
                <button
                  onClick={randomizeIdentity}
                  className="p-2 rounded-full"
                  style={{ background: "var(--surf-2)", color: "var(--muted)" }}
                  aria-label="Sortear outra seleção"
                >
                  <Shuffle size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={randomizeIdentity}
                className="w-full rounded-2xl py-6 flex flex-col items-center gap-2 transition-colors hover:bg-surf2 active:scale-95"
                style={{ border: "2px dashed var(--border)", background: "var(--surf-2)" }}
              >
                <Shuffle size={24} style={{ color: "var(--green)" }} />
                <span className="font-bold text-sm" style={{ color: "var(--green)" }}>
                  Sortear seleção
                </span>
                <span className="text-xs text-muted">ou escolha uma abaixo</span>
              </button>
            )}
          </div>

          {/* Quick pick nations */}
          <div className="flex flex-wrap gap-2">
            {NATIONS.map((n) => (
              <button
                key={n.name}
                onClick={() => {
                  const year = n.years[Math.floor(Math.random() * n.years.length)];
                  useDraftStore.setState({
                    teamName: `${n.name} ${year}`,
                    teamFlag: n.flag,
                    cupYear:  year,
                  });
                }}
                className={[
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                  teamFlag === n.flag ? "text-white" : "text-muted",
                ].join(" ")}
                style={
                  teamFlag === n.flag
                    ? { background: "var(--green)" }
                    : { background: "var(--surf-2)" }
                }
              >
                {n.flag} {n.name}
              </button>
            ))}
          </div>

          <button
            onClick={startDraft}
            disabled={!teamName}
            className="w-full rounded-full py-4 font-bold text-base text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--orange)" }}
          >
            Começar draft <ArrowRight size={18} />
          </button>
        </main>
        <BottomNav />
      </>
    );
  }

  // ── PHASE: draft ──────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-4 flex flex-col gap-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl leading-none" style={{ color: "var(--green)" }}>
              {teamFlag} {teamName}
            </p>
            <p className="text-xs text-muted mt-0.5">{filledCount}/11 posições</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Rerolls counter */}
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
              style={{
                background: rerolls === 0 ? "rgba(226,54,54,0.1)" : "var(--surf-2)",
                color:      rerolls === 0 ? "var(--red)" : rerolls === 1 ? "var(--orange)" : "var(--green)",
              }}
            >
              <RefreshCw size={13} />
              {rerolls === 0 ? "sem trocas" : `${rerolls} troca${rerolls !== 1 ? "s" : ""}`}
            </div>
            <button
              onClick={resetDraft}
              className="text-xs text-muted underline"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* 7-segment rumo bar */}
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full"
              style={{ background: "var(--border)" }}
            />
          ))}
        </div>

        {/* Slot grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {slots.map((slot, i) => {
            const isNewReveal = lastDrawnIdx === i;
            return slot.player ? (
              <div key={i} style={{ minHeight: "120px" }}>
                <PlayerCard
                  player={slot.player}
                  shirtNumber={i + 1}
                  isReveal={isNewReveal}
                  locked={slot.locked || rerolls <= 0}
                  onTrocar={
                    slot.locked || rerolls <= 0
                      ? undefined
                      : () => drawSlot(i)
                  }
                />
              </div>
            ) : (
              <button
                key={i}
                onClick={() => drawSlot(i)}
                className="rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all hover:border-green active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-green"
                style={{
                  border:     "2px dashed var(--border)",
                  background: "var(--surf-2)",
                  minHeight:  "120px",
                }}
                aria-label={`Sortear ${slot.position}`}
              >
                <span className="font-display text-3xl" style={{ color: "var(--border)" }}>
                  {slot.position}
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-wide flex items-center gap-1"
                  style={{ color: "var(--green)" }}
                >
                  <Shuffle size={12} /> Sortear
                </span>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/team"
          className={[
            "w-full rounded-full py-4 font-bold text-base text-white text-center flex items-center justify-center gap-2",
            allFilled ? "opacity-100" : "opacity-40 pointer-events-none",
          ].join(" ")}
          style={{ background: "var(--green)" }}
          aria-disabled={!allFilled}
        >
          Ver meu time ({filledCount}/11) <ArrowRight size={18} />
        </Link>

        {/* Chemistry hint */}
        {filledCount >= 3 && (
          <div
            className="rounded-xl px-3 py-2 text-xs text-muted flex items-center justify-between"
            style={{ background: "var(--surf-2)" }}
          >
            <span>Química parcial</span>
            <span
              className="font-bold"
              style={{ color: chemistry >= 60 ? "var(--green)" : "var(--orange)" }}
            >
              {chemistry}/100 · {chemModifier >= 1 ? "+" : ""}{((chemModifier - 1) * 100).toFixed(0)}% força
            </span>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
