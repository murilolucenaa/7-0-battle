// ============================================================
// Core domain types for 7–0 Battle
// ============================================================

export type PosGroup = "GOL" | "DEF" | "MEI" | "ATA";
export type Rarity = "lend" | "ouro" | "comum";
export type LobbyStatus = "waiting" | "drafting" | "playing" | "finished";
export type MatchStatus = "pending" | "live" | "done";
export type Formation = "4-3-3" | "4-4-2" | "3-5-2";

// ── Player (global pool, read-only) ──────────────────────────
export interface Player {
  id: string;
  name: string;
  pos_group: PosGroup;
  nation: string;   // display name e.g. "Brasil"
  flag: string;     // emoji e.g. "🇧🇷"
  club: string;
  league: string;
  year: number;
  ovr: number;      // 75–97
  rarity: Rarity;
}

// ── Draft ────────────────────────────────────────────────────
export interface Slot {
  position: string;  // "GOL" | "LE" | "ZAG" | etc.
  pos_group: PosGroup;
  player: Player | null;
  locked: boolean;   // locked when rerolls run out
}

export interface TeamPayload {
  nation: string;
  cupYear: number;
  formation: Formation;
  slots: Slot[];          // 11 starters
  bench: Player[];        // up to 5
  chemistry: number;      // 0–100
  sectorRatings: { def: number; mei: number; ata: number };
}

// ── Match simulation ─────────────────────────────────────────
export type EventType = "goal" | "shot" | "sub" | "card" | "info" | "fulltime";

export interface MatchEvent {
  min: number;
  type: EventType;
  side: "h" | "a";
  text: string;
  scoreH: number;
  scoreA: number;
}

export interface SimResult {
  homeScore: number;
  awayScore: number;
  winner: "home" | "away" | "draw";
  events: MatchEvent[];
}

// ── Supabase row shapes ───────────────────────────────────────
export interface Account {
  user_id: string;
  display_name: string;
  created_at: string;
}

export interface Lobby {
  id: string;
  code: string;
  host_id: string;
  status: LobbyStatus;
  season: number;
  created_at: string;
}

export interface LobbyMember {
  id: string;
  lobby_id: string;
  user_id: string;
  team_payload: TeamPayload | null;
  streak: number;
  points: number;
  alive: boolean;
}

export interface Match {
  id: string;
  lobby_id: string;
  home_user: string;
  away_user: string | null;
  away_cpu: string | null;
  seed: number;
  home_score: number | null;
  away_score: number | null;
  winner_user: string | null;
  events: MatchEvent[] | null;
  kickoff_at: string | null;
  status: MatchStatus;
  created_at: string;
}
