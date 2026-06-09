import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Users } from "lucide-react";

export default function LobbyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-muted text-sm font-semibold uppercase tracking-widest mb-2">Código da sala</p>
          <span
            className="font-display text-text tracking-wider"
            style={{ fontSize: "clamp(3rem, 15vw, 5rem)" }}
          >
            7A0X29
          </span>
        </div>

        <button
          className="w-full max-w-xs rounded-full py-3 text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:opacity-80"
          style={{ background: "var(--orange)" }}
        >
          Compartilhar sala
        </button>

        <div className="w-full rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-1">
            <Users size={12} /> Online agora
          </p>
          {["Você (anfitrião)", "Amigo 2", "Amigo 3"].map((name) => (
            <div key={name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green inline-block" />
              <span className="text-sm font-semibold text-text">{name}</span>
            </div>
          ))}
          <p className="text-xs text-muted mt-1">
            Vagas vazias viram seleções CPU no mata-mata 🎲
          </p>
        </div>

        <button
          className="w-full max-w-xs rounded-full py-4 font-bold text-white text-base transition-opacity hover:opacity-90 active:opacity-80"
          style={{ background: "var(--green)" }}
        >
          Começar draft →
        </button>
      </main>
      <BottomNav />
    </>
  );
}
