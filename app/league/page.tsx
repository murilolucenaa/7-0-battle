import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const STANDINGS = [
  { pos: 1, name: "Você",       w: 6, d: 1, l: 0, pts: 68.4, isMe: true  },
  { pos: 2, name: "Amigo 2",    w: 4, d: 2, l: 1, pts: 52.1, isMe: false },
  { pos: 3, name: "Amigo 3",    w: 3, d: 1, l: 3, pts: 39.0, isMe: false },
  { pos: 4, name: "CPU 🎲",     w: 2, d: 2, l: 3, pts: 28.5, isMe: false },
];

export default function LeaguePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Tabs */}
        <div
          className="flex rounded-full overflow-hidden"
          style={{ background: "var(--surf-2)", padding: "2px" }}
        >
          {["Tabela", "Mata-mata"].map((tab, i) => (
            <button
              key={tab}
              className={[
                "flex-1 py-2 text-sm font-bold rounded-full transition-colors",
                i === 0
                  ? "text-white"
                  : "text-muted",
              ].join(" ")}
              style={i === 0 ? { background: "var(--green)" } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Standings */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="grid grid-cols-[2rem_1fr_repeat(3,2.5rem)_3rem] gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted"
            style={{ background: "var(--surf-2)" }}
          >
            <span>#</span>
            <span>Jogador</span>
            <span>V</span>
            <span>E</span>
            <span>D</span>
            <span className="text-right">Pts</span>
          </div>
          {STANDINGS.map((row) => (
            <div
              key={row.pos}
              className="grid grid-cols-[2rem_1fr_repeat(3,2.5rem)_3rem] gap-2 px-4 py-3 items-center text-sm border-t"
              style={{
                borderColor: "var(--border)",
                background: row.isMe ? "rgba(0,154,78,0.06)" : "var(--surface)",
              }}
            >
              <span className="font-display text-base" style={{ color: row.isMe ? "var(--green)" : "var(--muted)" }}>
                {row.pos}
              </span>
              <span className={`font-semibold ${row.isMe ? "text-green" : "text-text"}`}>{row.name}</span>
              <span className="text-center text-muted">{row.w}</span>
              <span className="text-center text-muted">{row.d}</span>
              <span className="text-center text-muted">{row.l}</span>
              <span className="text-right font-bold font-display text-base" style={{ color: row.isMe ? "var(--green)" : "var(--text)" }}>
                {row.pts}
              </span>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
