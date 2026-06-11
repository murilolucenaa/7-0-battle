"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SQUADS, eligiblePlayers, squadLabel } from "@/lib/data/squads";
import type { Card, PlayerDef, Position, SquadDef } from "@/lib/game/types";
import { POSITION_LABEL } from "@/lib/game/types";

interface Props {
  open: boolean;
  pos: Position | null;
  usedNames: Set<string>;
  onPick: (card: Card) => void;
  onClose: () => void;
}

function pickTarget(pos: Position, usedNames: Set<string>): SquadDef | null {
  const pool = SQUADS.filter((s) =>
    eligiblePlayers(s, pos).some((p) => !usedNames.has(p.name))
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function RouletteModal({ open, pos, usedNames, onPick, onClose }: Props) {
  const [phase, setPhase] = useState<"rolling" | "landed">("rolling");
  const [display, setDisplay] = useState<SquadDef>(SQUADS[0]);
  const [landed, setLanded] = useState<SquadDef | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roll = useCallback(() => {
    if (!pos) return;
    const target = pickTarget(pos, usedNames);
    if (!target) return;
    setPhase("rolling");
    setLanded(null);

    let elapsed = 0;
    let delay = 55;
    const spin = () => {
      setDisplay(SQUADS[Math.floor(Math.random() * SQUADS.length)]);
      elapsed += delay;
      delay = Math.min(280, delay * 1.13);
      if (elapsed < 2100) {
        timer.current = setTimeout(spin, delay);
      } else {
        setDisplay(target);
        setLanded(target);
        timer.current = setTimeout(() => setPhase("landed"), 350);
      }
    };
    spin();
  }, [pos, usedNames]);

  useEffect(() => {
    if (open) roll();
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pos]);

  if (!open || !pos) return null;

  const eligible: PlayerDef[] = landed
    ? eligiblePlayers(landed, pos).filter((p) => !usedNames.has(p.name))
    : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="glass-strong w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">
              Convocando: <span className="text-[var(--accent)]">{POSITION_LABEL[pos]}</span>
            </h2>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-white text-xl px-2">✕</button>
          </div>

          {/* Roulette window */}
          <div className={`relative rounded-2xl border-2 overflow-hidden mb-5 transition-colors ${
            phase === "landed" ? "border-[var(--accent)]" : "border-[var(--border)]"
          }`}>
            <div className="bg-[var(--bg-2)] py-8 flex flex-col items-center justify-center">
              <motion.div
                key={display.id + (phase === "landed" ? "-l" : "-r")}
                initial={{ y: phase === "rolling" ? -22 : 0, opacity: phase === "rolling" ? 0.4 : 0, scale: phase === "landed" ? 0.85 : 1 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: phase === "landed" ? 0.4 : 0.05 }}
                className="text-center"
              >
                <div className="text-6xl mb-2">{display.flag}</div>
                <div className="font-display text-2xl">{squadLabel(display)}</div>
              </motion.div>
              {phase === "landed" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-bold tracking-widest text-[var(--accent)] mt-2 uppercase"
                >
                  ★ Seleção sorteada ★
                </motion.div>
              )}
            </div>
            {phase === "rolling" && <div className="absolute inset-0 shimmer pointer-events-none" />}
          </div>

          {/* Eligible players */}
          {phase === "landed" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {eligible.length === 0 ? (
                <p className="text-center text-[var(--muted)] py-4 text-sm">
                  Nenhum jogador disponível nessa posição. Gire de novo!
                </p>
              ) : (
                <div className="space-y-2 mb-4">
                  {eligible.map((p, i) => (
                    <motion.button
                      key={p.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() =>
                        landed && onPick({
                          player: p, squadId: landed.id,
                          nation: landed.nation, year: landed.year, flag: landed.flag,
                        })
                      }
                      className="w-full glass hover:bg-[var(--surface-2)] transition-colors p-3 flex items-center gap-3 text-left group"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display text-lg shrink-0 ${
                        p.ovr >= 95 ? "bg-gradient-to-br from-[#FFC53D] to-[#FF8A00] text-black"
                        : p.ovr >= 90 ? "bg-gradient-to-br from-[#00FF87] to-[#00C868] text-black"
                        : "bg-[var(--surface-2)] text-white"
                      }`}>
                        {p.ovr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{p.name}</div>
                        <div className="text-xs text-[var(--muted)]">
                          {p.positions.map((x) => POSITION_LABEL[x]).join(" · ")}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        Convocar →
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
              <button onClick={roll} className="btn-ghost w-full py-3 font-bold">
                🎲 Sortear outra seleção
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
