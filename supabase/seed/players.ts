/**
 * Fictional player pool — ~65 players across 4 position groups.
 * Replace names/stats freely; the game engine only needs the fields in the Player type.
 *
 * Rarity distribution: ~10% lend (90–97 OVR), ~40% ouro (84–89), ~50% comum (75–83).
 * Nations/clubs intentionally grouped so that chemistry links are possible but not trivial.
 */

import type { Player } from "@/lib/types";

export const PLAYERS: Player[] = [
  // ── GOLEIROS (GOL) ───────────────────────────────────────
  { id: "gol-1",  name: "R. Salim",     pos_group: "GOL", nation: "Brasil",   flag: "🇧🇷", club: "Santos FC",    league: "Brasileirão", year: 1970, ovr: 95, rarity: "lend"  },
  { id: "gol-2",  name: "Cortéz",       pos_group: "GOL", nation: "Espanha",  flag: "🇪🇸", club: "Barça FC",     league: "La Liga",     year: 1992, ovr: 87, rarity: "ouro"  },
  { id: "gol-3",  name: "Bauer",        pos_group: "GOL", nation: "Alemanha", flag: "🇩🇪", club: "Bayern FC",    league: "Bundesliga",  year: 1974, ovr: 86, rarity: "ouro"  },
  { id: "gol-4",  name: "Mensah",       pos_group: "GOL", nation: "Gana",     flag: "🇬🇭", club: "Dortmund FC",  league: "Bundesliga",  year: 2006, ovr: 79, rarity: "comum" },
  { id: "gol-5",  name: "Leconte",      pos_group: "GOL", nation: "França",   flag: "🇫🇷", club: "Paris FC",     league: "Ligue 1",     year: 1998, ovr: 78, rarity: "comum" },
  { id: "gol-6",  name: "P. Vargas",    pos_group: "GOL", nation: "Argentina",flag: "🇦🇷", club: "Boca Jrs",     league: "Superliga",   year: 1986, ovr: 77, rarity: "comum" },

  // ── DEFENSORES (DEF) ─────────────────────────────────────
  { id: "def-1",  name: "Okafor",       pos_group: "DEF", nation: "Nigéria",  flag: "🇳🇬", club: "Milan FC",     league: "Serie A",     year: 1994, ovr: 92, rarity: "lend"  },
  { id: "def-2",  name: "Bianchi",      pos_group: "DEF", nation: "Itália",   flag: "🇮🇹", club: "Juve FC",      league: "Serie A",     year: 1982, ovr: 91, rarity: "lend"  },
  { id: "def-3",  name: "van Berg",     pos_group: "DEF", nation: "Holanda",  flag: "🇳🇱", club: "Ajax FC",      league: "Eredivisie",  year: 1988, ovr: 88, rarity: "ouro"  },
  { id: "def-4",  name: "Ferreira",     pos_group: "DEF", nation: "Brasil",   flag: "🇧🇷", club: "Santos FC",    league: "Brasileirão", year: 1970, ovr: 87, rarity: "ouro"  },
  { id: "def-5",  name: "Méndez",       pos_group: "DEF", nation: "Argentina",flag: "🇦🇷", club: "River",        league: "Superliga",   year: 1978, ovr: 86, rarity: "ouro"  },
  { id: "def-6",  name: "Almeida",      pos_group: "DEF", nation: "Portugal", flag: "🇵🇹", club: "Benfica FC",   league: "Liga NOS",    year: 2002, ovr: 86, rarity: "ouro"  },
  { id: "def-7",  name: "Schäfer",      pos_group: "DEF", nation: "Alemanha", flag: "🇩🇪", club: "Bayern FC",    league: "Bundesliga",  year: 1990, ovr: 85, rarity: "ouro"  },
  { id: "def-8",  name: "Rojas",        pos_group: "DEF", nation: "Argentina",flag: "🇦🇷", club: "Boca Jrs",     league: "Superliga",   year: 1986, ovr: 85, rarity: "ouro"  },
  { id: "def-9",  name: "Conti",        pos_group: "DEF", nation: "Itália",   flag: "🇮🇹", club: "Milan FC",     league: "Serie A",     year: 1982, ovr: 84, rarity: "ouro"  },
  { id: "def-10", name: "Diallo",       pos_group: "DEF", nation: "Senegal",  flag: "🇸🇳", club: "Paris FC",     league: "Ligue 1",     year: 2002, ovr: 81, rarity: "comum" },
  { id: "def-11", name: "Oliveira",     pos_group: "DEF", nation: "Brasil",   flag: "🇧🇷", club: "Grêmio FC",    league: "Brasileirão", year: 1994, ovr: 80, rarity: "comum" },
  { id: "def-12", name: "Torres",       pos_group: "DEF", nation: "Espanha",  flag: "🇪🇸", club: "Atlético",     league: "La Liga",     year: 2006, ovr: 80, rarity: "comum" },
  { id: "def-13", name: "Bakker",       pos_group: "DEF", nation: "Holanda",  flag: "🇳🇱", club: "PSV FC",       league: "Eredivisie",  year: 1988, ovr: 79, rarity: "comum" },
  { id: "def-14", name: "Nwosu",        pos_group: "DEF", nation: "Nigéria",  flag: "🇳🇬", club: "Juve FC",      league: "Serie A",     year: 2010, ovr: 79, rarity: "comum" },
  { id: "def-15", name: "Lima",         pos_group: "DEF", nation: "Brasil",   flag: "🇧🇷", club: "Santos FC",    league: "Brasileirão", year: 1958, ovr: 78, rarity: "comum" },
  { id: "def-16", name: "Rossi",        pos_group: "DEF", nation: "Itália",   flag: "🇮🇹", club: "Milan FC",     league: "Serie A",     year: 1982, ovr: 78, rarity: "comum" },
  { id: "def-17", name: "Lopes",        pos_group: "DEF", nation: "Portugal", flag: "🇵🇹", club: "Sporting FC",  league: "Liga NOS",    year: 2004, ovr: 77, rarity: "comum" },
  { id: "def-18", name: "Petit",        pos_group: "DEF", nation: "França",   flag: "🇫🇷", club: "Lyon FC",      league: "Ligue 1",     year: 2000, ovr: 76, rarity: "comum" },
  { id: "def-19", name: "Sarr",         pos_group: "DEF", nation: "Senegal",  flag: "🇸🇳", club: "Paris FC",     league: "Ligue 1",     year: 2002, ovr: 75, rarity: "comum" },
  { id: "def-20", name: "Koch",         pos_group: "DEF", nation: "Alemanha", flag: "🇩🇪", club: "Dortmund FC",  league: "Bundesliga",  year: 1990, ovr: 75, rarity: "comum" },

  // ── MEIO-CAMPISTAS (MEI) ──────────────────────────────────
  { id: "mei-1",  name: "Carvalho",     pos_group: "MEI", nation: "Brasil",   flag: "🇧🇷", club: "Santos FC",    league: "Brasileirão", year: 1970, ovr: 97, rarity: "lend"  },
  { id: "mei-2",  name: "Fernández",    pos_group: "MEI", nation: "Argentina",flag: "🇦🇷", club: "Boca Jrs",     league: "Superliga",   year: 1986, ovr: 93, rarity: "lend"  },
  { id: "mei-3",  name: "Durand",       pos_group: "MEI", nation: "França",   flag: "🇫🇷", club: "Paris FC",     league: "Ligue 1",     year: 1998, ovr: 89, rarity: "ouro"  },
  { id: "mei-4",  name: "Ricci",        pos_group: "MEI", nation: "Itália",   flag: "🇮🇹", club: "Juve FC",      league: "Serie A",     year: 2006, ovr: 88, rarity: "ouro"  },
  { id: "mei-5",  name: "de Wit",       pos_group: "MEI", nation: "Holanda",  flag: "🇳🇱", club: "Ajax FC",      league: "Eredivisie",  year: 1988, ovr: 88, rarity: "ouro"  },
  { id: "mei-6",  name: "Pereira",      pos_group: "MEI", nation: "Portugal", flag: "🇵🇹", club: "Benfica FC",   league: "Liga NOS",    year: 2004, ovr: 87, rarity: "ouro"  },
  { id: "mei-7",  name: "Alonso",       pos_group: "MEI", nation: "Espanha",  flag: "🇪🇸", club: "Barça FC",     league: "La Liga",     year: 2010, ovr: 87, rarity: "ouro"  },
  { id: "mei-8",  name: "Ribeiro",      pos_group: "MEI", nation: "Brasil",   flag: "🇧🇷", club: "Grêmio FC",    league: "Brasileirão", year: 1994, ovr: 86, rarity: "ouro"  },
  { id: "mei-9",  name: "Schulz",       pos_group: "MEI", nation: "Alemanha", flag: "🇩🇪", club: "Bayern FC",    league: "Bundesliga",  year: 1974, ovr: 85, rarity: "ouro"  },
  { id: "mei-10", name: "Moreau",       pos_group: "MEI", nation: "França",   flag: "🇫🇷", club: "Lyon FC",      league: "Ligue 1",     year: 1998, ovr: 85, rarity: "ouro"  },
  { id: "mei-11", name: "García",       pos_group: "MEI", nation: "Espanha",  flag: "🇪🇸", club: "Atlético",     league: "La Liga",     year: 2008, ovr: 84, rarity: "ouro"  },
  { id: "mei-12", name: "Mbaye",        pos_group: "MEI", nation: "Senegal",  flag: "🇸🇳", club: "Paris FC",     league: "Ligue 1",     year: 2002, ovr: 81, rarity: "comum" },
  { id: "mei-13", name: "Souza",        pos_group: "MEI", nation: "Brasil",   flag: "🇧🇷", club: "Santos FC",    league: "Brasileirão", year: 1970, ovr: 80, rarity: "comum" },
  { id: "mei-14", name: "Dijkstra",     pos_group: "MEI", nation: "Holanda",  flag: "🇳🇱", club: "PSV FC",       league: "Eredivisie",  year: 2004, ovr: 79, rarity: "comum" },
  { id: "mei-15", name: "Martínez",     pos_group: "MEI", nation: "Espanha",  flag: "🇪🇸", club: "Barça FC",     league: "La Liga",     year: 2012, ovr: 79, rarity: "comum" },
  { id: "mei-16", name: "Esposito",     pos_group: "MEI", nation: "Itália",   flag: "🇮🇹", club: "Milan FC",     league: "Serie A",     year: 1990, ovr: 78, rarity: "comum" },
  { id: "mei-17", name: "Ibrahim",      pos_group: "MEI", nation: "Nigéria",  flag: "🇳🇬", club: "Dortmund FC",  league: "Bundesliga",  year: 2006, ovr: 78, rarity: "comum" },
  { id: "mei-18", name: "Costa",        pos_group: "MEI", nation: "Portugal", flag: "🇵🇹", club: "Sporting FC",  league: "Liga NOS",    year: 2000, ovr: 77, rarity: "comum" },
  { id: "mei-19", name: "Blanc",        pos_group: "MEI", nation: "França",   flag: "🇫🇷", club: "Lyon FC",      league: "Ligue 1",     year: 2000, ovr: 76, rarity: "comum" },
  { id: "mei-20", name: "Gomez",        pos_group: "MEI", nation: "Argentina",flag: "🇦🇷", club: "River",        league: "Superliga",   year: 2014, ovr: 75, rarity: "comum" },

  // ── ATACANTES (ATA) ───────────────────────────────────────
  { id: "ata-1",  name: "Santos Jr.",   pos_group: "ATA", nation: "Brasil",   flag: "🇧🇷", club: "Santos FC",    league: "Brasileirão", year: 1970, ovr: 96, rarity: "lend"  },
  { id: "ata-2",  name: "López",        pos_group: "ATA", nation: "Argentina",flag: "🇦🇷", club: "Boca Jrs",     league: "Superliga",   year: 1986, ovr: 89, rarity: "ouro"  },
  { id: "ata-3",  name: "Simon",        pos_group: "ATA", nation: "França",   flag: "🇫🇷", club: "Paris FC",     league: "Ligue 1",     year: 1998, ovr: 89, rarity: "ouro"  },
  { id: "ata-4",  name: "van Dijk Jr.", pos_group: "ATA", nation: "Holanda",  flag: "🇳🇱", club: "Ajax FC",      league: "Eredivisie",  year: 1988, ovr: 88, rarity: "ouro"  },
  { id: "ata-5",  name: "Adeyemi",      pos_group: "ATA", nation: "Nigéria",  flag: "🇳🇬", club: "Dortmund FC",  league: "Bundesliga",  year: 2010, ovr: 87, rarity: "ouro"  },
  { id: "ata-6",  name: "Müller Jr.",   pos_group: "ATA", nation: "Alemanha", flag: "🇩🇪", club: "Bayern FC",    league: "Bundesliga",  year: 1974, ovr: 86, rarity: "ouro"  },
  { id: "ata-7",  name: "Ndiaye",       pos_group: "ATA", nation: "Senegal",  flag: "🇸🇳", club: "Paris FC",     league: "Ligue 1",     year: 2002, ovr: 86, rarity: "ouro"  },
  { id: "ata-8",  name: "Ricci Jr.",    pos_group: "ATA", nation: "Itália",   flag: "🇮🇹", club: "Milan FC",     league: "Serie A",     year: 1982, ovr: 85, rarity: "ouro"  },
  { id: "ata-9",  name: "Silva",        pos_group: "ATA", nation: "Portugal", flag: "🇵🇹", club: "Benfica FC",   league: "Liga NOS",    year: 2006, ovr: 85, rarity: "ouro"  },
  { id: "ata-10", name: "Martins",      pos_group: "ATA", nation: "Brasil",   flag: "🇧🇷", club: "Grêmio FC",    league: "Brasileirão", year: 1994, ovr: 84, rarity: "ouro"  },
  { id: "ata-11", name: "Fuentes",      pos_group: "ATA", nation: "Espanha",  flag: "🇪🇸", club: "Barça FC",     league: "La Liga",     year: 2008, ovr: 84, rarity: "ouro"  },
  { id: "ata-12", name: "Pinto",        pos_group: "ATA", nation: "Portugal", flag: "🇵🇹", club: "Sporting FC",  league: "Liga NOS",    year: 2002, ovr: 80, rarity: "comum" },
  { id: "ata-13", name: "Mbeki",        pos_group: "ATA", nation: "Senegal",  flag: "🇸🇳", club: "Lyon FC",      league: "Ligue 1",     year: 2004, ovr: 80, rarity: "comum" },
  { id: "ata-14", name: "Fontaine",     pos_group: "ATA", nation: "França",   flag: "🇫🇷", club: "Lyon FC",      league: "Ligue 1",     year: 1998, ovr: 79, rarity: "comum" },
  { id: "ata-15", name: "Ferreira Jr.", pos_group: "ATA", nation: "Brasil",   flag: "🇧🇷", club: "Santos FC",    league: "Brasileirão", year: 2002, ovr: 79, rarity: "comum" },
  { id: "ata-16", name: "Schulz Jr.",   pos_group: "ATA", nation: "Alemanha", flag: "🇩🇪", club: "Dortmund FC",  league: "Bundesliga",  year: 1990, ovr: 78, rarity: "comum" },
  { id: "ata-17", name: "Esposito Jr.", pos_group: "ATA", nation: "Itália",   flag: "🇮🇹", club: "Juve FC",      league: "Serie A",     year: 2014, ovr: 77, rarity: "comum" },
  { id: "ata-18", name: "López Jr.",    pos_group: "ATA", nation: "Argentina",flag: "🇦🇷", club: "River",        league: "Superliga",   year: 2018, ovr: 76, rarity: "comum" },
  { id: "ata-19", name: "van Mol",      pos_group: "ATA", nation: "Holanda",  flag: "🇳🇱", club: "PSV FC",       league: "Eredivisie",  year: 2006, ovr: 75, rarity: "comum" },
];

// Player lookup helpers
export const PLAYERS_BY_ID = Object.fromEntries(PLAYERS.map((p) => [p.id, p]));

export function getPlayersByGroup(group: import("@/lib/types").PosGroup): Player[] {
  return PLAYERS.filter((p) => p.pos_group === group);
}

/**
 * Weighted random pick by rarity: lend 5, ouro 25, comum 70.
 * Pass a rand() function (from mulberry32) for determinism.
 */
export function drawPlayer(
  group: import("@/lib/types").PosGroup,
  rand: () => number,
  exclude: string[] = []
): Player {
  const pool = PLAYERS.filter((p) => p.pos_group === group && !exclude.includes(p.id));
  const WEIGHTS = { lend: 5, ouro: 25, comum: 70 };
  const total = pool.reduce((sum, p) => sum + WEIGHTS[p.rarity], 0);
  let roll = rand() * total;
  for (const p of pool) {
    roll -= WEIGHTS[p.rarity];
    if (roll <= 0) return p;
  }
  return pool[pool.length - 1]; // fallback
}
