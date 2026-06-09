import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { RefreshCw, Lock } from "lucide-react";

const SLOTS = [
  { pos: "GOL", label: "Goleiro",      filled: true,  name: "R. Salim",    ovr: 92, rarity: "lend",  nation: "🇧🇷", year: 1970 },
  { pos: "LD",  label: "Lat. Direito", filled: true,  name: "Okafor",      ovr: 85, rarity: "ouro",  nation: "🇳🇬", year: 2002 },
  { pos: "ZAG", label: "Zagueiro",     filled: false, name: null,          ovr: 0,  rarity: null,    nation: null,  year: null },
  { pos: "ZAG", label: "Zagueiro",     filled: false, name: null,          ovr: 0,  rarity: null,    nation: null,  year: null },
  { pos: "LE",  label: "Lat. Esquerdo",filled: false, name: null,          ovr: 0,  rarity: null,    nation: null,  year: null },
];

const rarityColor: Record<string, string> = {
  lend: "var(--gold)",
  ouro: "#C6A84B",
  comum: "var(--muted)",
};

export default function DraftPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {/* Mission banner */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: "var(--green)", color: "#fff" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Sua missão</p>
          <p className="font-display text-2xl tracking-wide mt-0.5">MONTE OS 11 · VENÇA 7</p>
        </div>

        {/* Reroll counter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted">Posições preenchidas: 2/11</span>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "var(--surf-2)", color: "var(--orange)" }}
          >
            <RefreshCw size={12} />
            3 trocas restantes
          </div>
        </div>

        {/* Slots grid */}
        <div className="grid grid-cols-2 gap-3">
          {SLOTS.map((slot, i) =>
            slot.filled ? (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden p-3 flex flex-col gap-1"
                style={{ background: "var(--surface)", border: `2px solid ${rarityColor[slot.rarity!]}` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: rarityColor[slot.rarity!] }}
                />
                <div className="flex items-start justify-between mt-1">
                  <span className="font-display text-4xl leading-none" style={{ color: rarityColor[slot.rarity!] }}>
                    {i + 1}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase rounded-full px-1.5 py-0.5"
                    style={{ background: rarityColor[slot.rarity!] + "22", color: rarityColor[slot.rarity!] }}
                  >
                    {slot.rarity}
                  </span>
                </div>
                <p className="font-bold text-sm text-text leading-tight">{slot.name}</p>
                <p className="text-[11px] text-muted">
                  {slot.nation} · {slot.year}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-display text-lg" style={{ color: "var(--green)" }}>{slot.ovr}</span>
                  <button
                    className="text-[10px] font-bold uppercase flex items-center gap-1"
                    style={{ color: "var(--orange)" }}
                  >
                    <RefreshCw size={10} /> Trocar
                  </button>
                </div>
              </div>
            ) : (
              <button
                key={i}
                className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-surf2 active:scale-95"
                style={{ border: "2px dashed var(--border)", background: "var(--surf-2)", minHeight: "110px" }}
              >
                <span
                  className="font-display text-3xl"
                  style={{ color: "var(--muted)" }}
                >
                  {slot.pos}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--green)" }}>
                  Sortear
                </span>
              </button>
            )
          )}
        </div>

        {/* CTA */}
        <button
          disabled
          className="w-full rounded-full py-4 font-bold text-base text-white mt-2 opacity-40 cursor-not-allowed"
          style={{ background: "var(--green)" }}
        >
          Ver meu time (2/11)
        </button>
      </main>
      <BottomNav />
    </>
  );
}
