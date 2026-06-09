import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {/* Sector ratings */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "ATA", value: 84, color: "var(--orange)" },
            { label: "MEI", value: 80, color: "var(--gold)" },
            { label: "DEF", value: 88, color: "var(--green)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col items-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-muted">{label}</span>
              <span className="font-display text-4xl mt-1" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Chemistry bar */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-text">Química do time</span>
            <span className="font-display text-xl" style={{ color: "var(--green)" }}>72</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
            <div
              className="h-2 rounded-full"
              style={{ width: "72%", background: "var(--green)" }}
            />
          </div>
          <p className="text-xs text-muted mt-2">
            +4% força · 2 ligações nação · 1 ligação clube
          </p>
        </div>

        {/* Pitch placeholder */}
        <div
          className="rounded-2xl flex items-center justify-center"
          style={{ background: "var(--green)", height: "280px", opacity: 0.15 }}
        >
          <span className="font-display text-white text-2xl">Campo (passo 3)</span>
        </div>

        <button
          className="w-full rounded-full py-4 font-bold text-base text-white"
          style={{ background: "var(--orange)" }}
        >
          Batalhar →
        </button>
      </main>
      <BottomNav />
    </>
  );
}
