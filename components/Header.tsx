"use client";

// The 7-0 scoreboard header — this is the brand mark of the app.
// Green gradient = gramado; "0" in gold = the legendary clean sheet.
export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "linear-gradient(135deg, var(--green-d) 0%, var(--green) 100%)" }}
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className="font-display text-white tracking-tight leading-none"
            style={{ fontSize: "clamp(1.75rem, 6vw, 2.25rem)" }}
          >
            7–
          </span>
          <span
            className="font-display leading-none"
            style={{
              fontSize: "clamp(1.75rem, 6vw, 2.25rem)",
              color: "var(--gold)",
            }}
          >
            0
          </span>
          <span
            className="ml-2 text-white/80 text-xs font-sans font-semibold uppercase tracking-widest"
            style={{ fontSize: "0.6rem" }}
          >
            Battle
          </span>
        </div>
        {/* streak pill — populated by parent when in a lobby */}
        <div
          id="streak-pill"
          className="hidden items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
      </div>
    </header>
  );
}
