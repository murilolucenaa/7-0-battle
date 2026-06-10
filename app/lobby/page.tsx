"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Users, Check, Copy, ArrowRight } from "lucide-react";
import Link from "next/link";

const ROOM_CODE = "7A0X29"; // will come from Supabase in step 5
const MOCK_MEMBERS = ["Você (anfitrião)", "Amigo 2", "Amigo 3"];

export default function LobbyPage() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = `Entra na minha sala de 7–0 Battle! Código: ${ROOM_CODE}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "7–0 Battle", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled share or clipboard blocked
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 pb-nav max-w-lg mx-auto w-full px-4 py-8 flex flex-col items-center gap-6">
        {/* Room code */}
        <div className="text-center">
          <p className="text-muted text-[11px] font-bold uppercase tracking-widest mb-1">
            Código da sala
          </p>
          <button
            onClick={handleShare}
            className="font-display tracking-wider transition-opacity hover:opacity-75 active:scale-[0.97]"
            style={{ fontSize: "clamp(3rem, 15vw, 5rem)", color: "var(--text)", lineHeight: 1 }}
            aria-label="Compartilhar código da sala"
          >
            {ROOM_CODE}
          </button>
          <p className="text-[11px] text-muted mt-1">Toque no código para compartilhar</p>
        </div>

        <button
          onClick={handleShare}
          className="w-full max-w-xs rounded-full py-3 text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ background: copied ? "var(--green)" : "var(--orange)" }}
        >
          {copied ? (
            <><Check size={15} /> Copiado!</>
          ) : (
            <><Copy size={15} /> Compartilhar sala</>
          )}
        </button>

        {/* Members */}
        <div
          className="w-full rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-1.5">
            <Users size={12} /> Online agora ({MOCK_MEMBERS.length}/10)
          </p>
          {MOCK_MEMBERS.map((name) => (
            <div key={name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
              <span className="text-sm font-semibold text-text">{name}</span>
            </div>
          ))}
          <p className="text-xs text-muted mt-1">
            Vagas vazias viram seleções CPU no mata-mata 🎲
          </p>
        </div>

        <Link
          href="/draft"
          className="w-full max-w-xs rounded-full py-4 font-bold text-white text-center flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ background: "var(--green)" }}
        >
          Começar draft <ArrowRight size={16} />
        </Link>
      </main>
      <BottomNav />
    </>
  );
}
