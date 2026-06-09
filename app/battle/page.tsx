import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function BattlePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {/* Live badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-red">AO VIVO</span>
          <span className="ml-auto text-xs text-muted font-semibold">Vocês dois deram play</span>
        </div>

        {/* Scoreboard */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center gap-2"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-muted uppercase">Você</span>
              <span className="font-display" style={{ fontSize: "4rem", color: "var(--green)", lineHeight: 1 }}>2</span>
            </div>
            <span className="font-display text-4xl text-muted">–</span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-muted uppercase">Amigo</span>
              <span className="font-display" style={{ fontSize: "4rem", color: "var(--red)", lineHeight: 1 }}>1</span>
            </div>
          </div>
          <span className="text-sm font-bold text-muted">67'</span>
        </div>

        {/* Commentary ticker */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-2 max-h-56 overflow-y-auto"
          style={{ background: "var(--surf-2)", border: "1px solid var(--border)" }}
        >
          {[
            { min: 67, text: "Bianchi cruza na área...", type: "info" },
            { min: 63, text: "⚽ GOL! Salim cabeceia e abre 2x1!", type: "goal" },
            { min: 58, text: "↕ Substituição: Volante cansado, entra reserva", type: "sub" },
            { min: 45, text: "Fim do primeiro tempo.", type: "info" },
            { min: 31, text: "⚽ GOL do adversário! Empate 1x1", type: "goal" },
            { min: 12, text: "⚽ GOL! Você abre o placar! 1x0", type: "goal" },
            { min:  1, text: "Apito inicial! Começa a batalha.", type: "info" },
          ].map((e, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span
                className="font-display shrink-0"
                style={{ color: "var(--muted)", minWidth: "2rem" }}
              >
                {e.min}'
              </span>
              <span
                style={{
                  color: e.type === "goal" ? "var(--gold)"
                       : e.type === "sub"  ? "var(--roxo)"
                       : "var(--text)",
                  fontWeight: e.type === "goal" ? 700 : 400,
                }}
              >
                {e.text}
              </span>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
