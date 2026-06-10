import { mulberry32 } from "../mulberry32";
import { simulate } from "../simulate";
import { calculateChemistry, FORMATIONS } from "../chemistry";
import { scoreTeam } from "../scoring";
import { PLAYERS } from "@/supabase/seed/players";
import type { MatchEvent } from "@/lib/types";
import type { SimTeamInput } from "../simulate";

// ── Helpers ───────────────────────────────────────────────────

function makeTeam(name: string): SimTeamInput {
  const formation433 = JSON.parse(JSON.stringify(FORMATIONS["4-3-3"]));
  const gol = PLAYERS.filter((p) => p.pos_group === "GOL");
  const def = PLAYERS.filter((p) => p.pos_group === "DEF");
  const mei = PLAYERS.filter((p) => p.pos_group === "MEI");
  const ata = PLAYERS.filter((p) => p.pos_group === "ATA");

  formation433[0].player = gol[0];
  formation433[1].player = def[0];
  formation433[2].player = def[1];
  formation433[3].player = def[2];
  formation433[4].player = def[3];
  formation433[5].player = mei[0];
  formation433[6].player = mei[1];
  formation433[7].player = mei[2];
  formation433[8].player = ata[0];
  formation433[9].player = ata[1];
  formation433[10].player = ata[2];

  const bench = [ata[3], mei[3], def[4]];
  const { chemistry, modifier } = calculateChemistry(formation433);

  return {
    name,
    formation: "4-3-3",
    slots: formation433,
    bench,
    chemistry,
    chemModifier: modifier,
  };
}

// ── Tests ─────────────────────────────────────────────────────

describe("mulberry32 — PRNG determinism", () => {
  it("same seed produces identical sequence", () => {
    const r1 = mulberry32(12345);
    const r2 = mulberry32(12345);
    for (let i = 0; i < 1000; i++) {
      expect(r1()).toBe(r2());
    }
  });

  it("different seeds produce different sequences", () => {
    const r1 = mulberry32(1);
    const r2 = mulberry32(2);
    const vals1 = Array.from({ length: 20 }, () => r1());
    const vals2 = Array.from({ length: 20 }, () => r2());
    expect(vals1).not.toEqual(vals2);
  });

  it("output is in [0, 1)", () => {
    const r = mulberry32(999);
    for (let i = 0; i < 500; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("simulate — determinism", () => {
  const home = makeTeam("Brasil");
  const away = makeTeam("Argentina");
  const SEED = 42;

  it("same seed → same score", () => {
    const r1 = simulate(home, away, SEED);
    const r2 = simulate(home, away, SEED);
    expect(r1.homeScore).toBe(r2.homeScore);
    expect(r1.awayScore).toBe(r2.awayScore);
  });

  it("same seed → same events", () => {
    const r1 = simulate(home, away, SEED);
    const r2 = simulate(home, away, SEED);
    expect(r1.events).toEqual(r2.events);
  });

  it("different seeds → usually different results", () => {
    const results = new Set<string>();
    for (let s = 0; s < 20; s++) {
      const r = simulate(home, away, s * 7);
      results.add(`${r.homeScore}-${r.awayScore}`);
    }
    expect(results.size).toBeGreaterThan(3);
  });
});

describe("simulate — output structure", () => {
  const home = makeTeam("Home");
  const away = makeTeam("Away");

  it("returns valid winner field", () => {
    const r = simulate(home, away, 1);
    expect(["home", "away", "draw"]).toContain(r.winner);
    if (r.homeScore > r.awayScore) expect(r.winner).toBe("home");
    if (r.awayScore > r.homeScore) expect(r.winner).toBe("away");
    if (r.homeScore === r.awayScore) expect(r.winner).toBe("draw");
  });

  it("scores are non-negative integers", () => {
    for (let s = 0; s < 10; s++) {
      const r = simulate(home, away, s);
      expect(r.homeScore).toBeGreaterThanOrEqual(0);
      expect(r.awayScore).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(r.homeScore)).toBe(true);
      expect(Number.isInteger(r.awayScore)).toBe(true);
    }
  });

  it("events include info at min 1 and fulltime at min 90", () => {
    const r = simulate(home, away, 7);
    expect(r.events[0].type).toBe("info");
    expect(r.events[0].min).toBe(1);
    expect(r.events[r.events.length - 1].type).toBe("fulltime");
    expect(r.events[r.events.length - 1].min).toBe(90);
  });

  it("goal events increment score correctly", () => {
    const r = simulate(home, away, 3);
    let h = 0, a = 0;
    for (const ev of r.events) {
      if (ev.type === "goal") {
        if (ev.side === "h") h++;
        else a++;
        expect(ev.scoreH).toBe(h);
        expect(ev.scoreA).toBe(a);
      }
    }
    expect(h).toBe(r.homeScore);
    expect(a).toBe(r.awayScore);
  });

  it("average total goals across 50 games is between 1 and 6", () => {
    let totalGoals = 0;
    for (let s = 0; s < 50; s++) {
      const r = simulate(home, away, s * 13 + 17);
      totalGoals += r.homeScore + r.awayScore;
    }
    const avg = totalGoals / 50;
    expect(avg).toBeGreaterThan(1);
    expect(avg).toBeLessThan(6);
  });
});

describe("calculateChemistry", () => {
  it("returns chemistry in 0–100 range", () => {
    const slots = JSON.parse(JSON.stringify(FORMATIONS["4-3-3"]));
    PLAYERS.filter((p) => p.pos_group === "GOL").slice(0, 1).forEach((p, i) => { slots[0].player = p; });
    PLAYERS.filter((p) => p.pos_group === "DEF").slice(0, 4).forEach((p, i) => { slots[i + 1].player = p; });
    PLAYERS.filter((p) => p.pos_group === "MEI").slice(0, 3).forEach((p, i) => { slots[i + 5].player = p; });
    PLAYERS.filter((p) => p.pos_group === "ATA").slice(0, 3).forEach((p, i) => { slots[i + 8].player = p; });

    const { chemistry } = calculateChemistry(slots);
    expect(chemistry).toBeGreaterThanOrEqual(0);
    expect(chemistry).toBeLessThanOrEqual(100);
  });

  it("same club/nation players have higher chemistry than mixed", () => {
    // Team of all Brazilians from Santos
    const allBrazil = JSON.parse(JSON.stringify(FORMATIONS["4-3-3"]));
    const brazil = PLAYERS.filter((p) => p.nation === "Brasil");
    const getMixed = JSON.parse(JSON.stringify(FORMATIONS["4-3-3"]));

    // Fill with Brazilian players if available (might not fill all 11)
    let bi = 0;
    for (let i = 0; i < allBrazil.length; i++) {
      if (brazil[bi]) allBrazil[i].player = brazil[bi++];
    }

    // Fill mixed team with players from different nations
    const groups: [number, string][] = [[0, "GOL"], [1, "DEF"], [5, "MEI"], [8, "ATA"]];
    const nations = ["Brasil", "França", "Itália", "Alemanha", "Espanha"];
    let pi = 0;
    for (let i = 0; i < getMixed.length; i++) {
      const g = getMixed[i].pos_group as import("@/lib/types").PosGroup;
      const candidates = PLAYERS.filter((p) => p.pos_group === g);
      getMixed[i].player = candidates[pi % candidates.length];
      pi += 3; // skip around to get varied nations
    }

    const brazilChem = calculateChemistry(allBrazil).chemistry;
    const mixedChem  = calculateChemistry(getMixed).chemistry;
    // All-Brazil should be >= mixed (they share nation + club links)
    expect(brazilChem).toBeGreaterThanOrEqual(mixedChem);
  });

  it("modifier is in a reasonable range (0.90 – 1.08)", () => {
    const slots = JSON.parse(JSON.stringify(FORMATIONS["4-3-3"]));
    const gol = PLAYERS.filter((p) => p.pos_group === "GOL");
    const def = PLAYERS.filter((p) => p.pos_group === "DEF");
    const mei = PLAYERS.filter((p) => p.pos_group === "MEI");
    const ata = PLAYERS.filter((p) => p.pos_group === "ATA");
    slots[0].player = gol[0];
    for (let i = 0; i < 4; i++) slots[i + 1].player = def[i];
    for (let i = 0; i < 3; i++) slots[i + 5].player = mei[i];
    for (let i = 0; i < 3; i++) slots[i + 8].player = ata[i];

    const { modifier } = calculateChemistry(slots);
    expect(modifier).toBeGreaterThanOrEqual(0.90);
    expect(modifier).toBeLessThanOrEqual(1.08);
  });
});

describe("scoreTeam — Cartola scoring", () => {
  it("goal scores +8 for attacker", () => {
    const gol = PLAYERS.find((p) => p.pos_group === "GOL")!;
    const def = PLAYERS.find((p) => p.pos_group === "DEF")!;
    const mei = PLAYERS.find((p) => p.pos_group === "MEI")!;
    const ata = PLAYERS.find((p) => p.pos_group === "ATA")!;

    const team = [
      { id: gol.id, name: gol.name, pos_group: gol.pos_group },
      { id: def.id, name: def.name, pos_group: def.pos_group },
      { id: mei.id, name: mei.name, pos_group: mei.pos_group },
      { id: ata.id, name: ata.name, pos_group: ata.pos_group },
    ];

    const events: MatchEvent[] = [
      { min: 30, type: "goal", side: "h", text: "Gol!", scoreH: 1, scoreA: 0 },
    ];

    const { scouts, total } = scoreTeam(team, events, "h", 0);
    const scorer = scouts.find((s) => s.pos_group === "ATA");
    expect(scorer?.points).toBeGreaterThanOrEqual(8); // goal + possibly clean sheet
    expect(total).toBeGreaterThan(0);
  });

  it("goal conceded penalizes GK with -2", () => {
    const gol = PLAYERS.find((p) => p.pos_group === "GOL")!;
    const team = [{ id: gol.id, name: gol.name, pos_group: gol.pos_group }];

    const events: MatchEvent[] = [
      { min: 20, type: "goal", side: "a", text: "Gol adversário!", scoreH: 0, scoreA: 1 },
    ];

    const { scouts } = scoreTeam(team, events, "h", 1);
    const gkScout = scouts.find((s) => s.pos_group === "GOL");
    expect(gkScout?.points).toBeLessThan(0);
  });
});
