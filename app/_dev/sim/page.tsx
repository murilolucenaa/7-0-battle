// Dev-only page: run a simulation with two fixed teams and display the log.
// Access at /_dev/sim — will be wired to the real engine in step 2.
export default function SimDevPage() {
  return (
    <main
      className="min-h-screen p-8 font-mono text-sm"
      style={{ background: "#111", color: "#eee" }}
    >
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--gold)" }}>
        /_dev/sim — Motor de simulação
      </h1>
      <p style={{ color: "var(--muted)" }}>
        Motor será implementado no passo 2. Aqui aparecerão: placar, eventos e
        determinismo (mesmo seed → mesmo resultado).
      </p>
    </main>
  );
}
