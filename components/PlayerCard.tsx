"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw, Lock } from "lucide-react";
import type { Player } from "@/lib/types";

export const RARITY_COLOR: Record<Player["rarity"], string> = {
  lend:  "#FFB400",
  ouro:  "#C6A84B",
  comum: "#6B7A70",
};

interface Props {
  player:      Player;
  shirtNumber: number;
  isReveal?:   boolean; // true = animate in (just drawn)
  onTrocar?:   () => void;
  locked?:     boolean;
  compact?:    boolean; // used on the pitch view
}

export default function PlayerCard({
  player, shirtNumber, isReveal, onTrocar, locked, compact,
}: Props) {
  const reduced  = useReducedMotion();
  const color    = RARITY_COLOR[player.rarity];
  const isLegend = player.rarity === "lend";

  const inner = (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col p-3 select-none h-full"
      style={{
        background: "var(--surface)",
        border:     `2px solid ${color}`,
        gap:        compact ? "0.15rem" : "0.3rem",
      }}
    >
      {/* Rarity top stripe */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />

      {/* Legendary shimmer overlay */}
      {isLegend && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 55%, rgba(255,180,0,0.12) 75%, transparent 90%)",
          }}
        />
      )}

      {/* Header row: shirt# + rarity badge */}
      <div className="flex items-start justify-between mt-1">
        <span
          className="font-display leading-none"
          style={{ fontSize: compact ? "1.6rem" : "2.25rem", color }}
        >
          {shirtNumber}
        </span>
        <span
          className="text-[9px] font-bold uppercase rounded-full px-1.5 py-0.5 leading-none"
          style={{ background: color + "22", color }}
        >
          {player.rarity === "lend" ? "★ lend" : player.rarity}
        </span>
      </div>

      <p className={`font-bold text-text leading-tight ${compact ? "text-[11px]" : "text-sm"}`}>
        {player.name}
      </p>

      {!compact && (
        <p className="text-[11px] text-muted">
          {player.flag} {player.nation} · {player.year}
        </p>
      )}

      {/* OVR + action */}
      <div className="flex items-center justify-between mt-auto">
        <span
          className="font-display leading-none"
          style={{ fontSize: compact ? "1.1rem" : "1.4rem", color: "var(--green)" }}
        >
          {player.ovr}
        </span>
        {onTrocar && !locked && (
          <button
            className="text-[10px] font-bold uppercase flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            style={{ color: "var(--orange)" }}
            onClick={(e) => { e.stopPropagation(); onTrocar(); }}
            aria-label={`Trocar ${player.name}`}
          >
            <RefreshCw size={10} /> Trocar
          </button>
        )}
        {locked && <Lock size={12} style={{ color: "var(--muted)" }} />}
      </div>
    </div>
  );

  // Legendary reveal: springy scale + brightness flash
  if (isReveal && isLegend && !reduced) {
    return (
      <motion.div
        className="h-full"
        initial={{ scale: 0.5, filter: "brightness(5) saturate(0)" }}
        animate={{ scale: 1, filter: "brightness(1) saturate(1)" }}
        transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {inner}
      </motion.div>
    );
  }

  // Normal card entrance
  if (isReveal && !reduced) {
    return (
      <motion.div
        className="h-full"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
      >
        {inner}
      </motion.div>
    );
  }

  return <div className="h-full">{inner}</div>;
}
