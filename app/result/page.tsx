import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default function ResultPage() {
  const streakCount = 6; // rumo ao 7–0

  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-6 items-center">
        {/* Outcome badge */}
        <div
          className="rounded-full px-6 py-2 font-bold text-sm uppercase tracking-widest text-white"
          style={{ background: "var(--green)" }}
        >
          Vitória
        </div>

        {/* Giant scoreboard */}
        <div className="flex items-center gap-6">
          <span className="font-display" style={{ fontSize: "6rem", color: "var(--green)", lineHeight: 1 }}>3</span>
          <span className="font-display text-5xl text-muted">–</span>
          <span className="font-display" style={{ fontSize: "6rem", color: "var(--muted)", lineHeight: 1 }}>1</span>
        </div>
        <p className="text-sm text-muted -mt-4">vs. Amigo 2 · +12.4 pts</p>

        {/* Rumo ao 7–0 bar */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Rumo ao 7–0</span>
            <span className="font-display text-xl" style={{ color: "var(--gold)" }}>{streakCount}/7</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-3 rounded-full"
                style={{
                  background: i < streakCount ? "var(--gold)" : "var(--border)",
                }}
              />
            ))}
          </div>
          <p className="text-xs text-muted mt-1.5 text-center">Mais 1 vitória pra completar o 7–0!</p>
        </div>

        {/* Best moments */}
        <div
          className="w-full rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Melhores momentos</p>
          {[
            { min: 12, text: "⚽ Bianchi abre o placar de cabeça" },
            { min: 45, text: "⚽ R. Salim cobra falta no ângulo!" },
            { min: 78, text: "⚽ Okafor sela o triunfo 3x1" },
          ].map((e) => (
            <div key={e.min} className="flex gap-2 text-sm">
              <span className="font-display" style={{ color: "var(--gold)", minWidth: "2rem" }}>{e.min}'</span>
              <span className="font-semibold">{e.text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/league"
            className="w-full rounded-full py-4 font-bold text-sm text-center"
            style={{ border: "2px solid var(--green)", color: "var(--green)" }}
          >
            Ver a liga
          </Link>
          <button
            className="w-full rounded-full py-4 font-bold text-sm text-white"
            style={{ background: "var(--orange)" }}
          >
            Próxima batalha →
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
