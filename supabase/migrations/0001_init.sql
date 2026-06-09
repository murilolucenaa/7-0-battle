-- 7-0 Battle — initial schema
-- Run this once in Supabase SQL editor (or via supabase db push)

-- ── Enable extensions ────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tables ───────────────────────────────────────────────────

create table if not exists accounts (
  user_id      uuid primary key default auth.uid(),
  display_name text not null,
  created_at   timestamptz default now()
);

create table if not exists lobbies (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  host_id    uuid references accounts(user_id),
  status     text not null default 'waiting',
  season     int  not null default 1,
  created_at timestamptz default now()
);

create table if not exists lobby_members (
  id           uuid primary key default gen_random_uuid(),
  lobby_id     uuid references lobbies(id) on delete cascade,
  user_id      uuid references accounts(user_id),
  team_payload jsonb,
  streak       int     default 0,
  points       float   default 0,
  alive        boolean default true,
  unique(lobby_id, user_id)
);

create table if not exists matches (
  id           uuid primary key default gen_random_uuid(),
  lobby_id     uuid references lobbies(id) on delete cascade,
  home_user    uuid,
  away_user    uuid,
  away_cpu     text,
  seed         bigint not null,
  home_score   int,
  away_score   int,
  winner_user  uuid,
  events       jsonb,
  kickoff_at   timestamptz,
  status       text default 'pending',
  created_at   timestamptz default now()
);

-- Read-only global player pool
create table if not exists players (
  id        text primary key,
  name      text not null,
  pos_group text not null,
  nation    text not null,
  flag      text not null,
  club      text not null,
  league    text not null,
  year      int  not null,
  ovr       int  not null,
  rarity    text not null
);

-- ── Row Level Security ────────────────────────────────────────

alter table accounts       enable row level security;
alter table lobbies        enable row level security;
alter table lobby_members  enable row level security;
alter table matches        enable row level security;
alter table players        enable row level security;

-- accounts: own row only
create policy "accounts_select_own"
  on accounts for select using (auth.uid() = user_id);
create policy "accounts_insert_own"
  on accounts for insert with check (auth.uid() = user_id);
create policy "accounts_update_own"
  on accounts for update using (auth.uid() = user_id);

-- lobbies: any authenticated user can read; only host can update
create policy "lobbies_select_all"
  on lobbies for select using (auth.role() = 'authenticated');
create policy "lobbies_insert_auth"
  on lobbies for insert with check (auth.role() = 'authenticated');
create policy "lobbies_update_host"
  on lobbies for update using (auth.uid() = host_id);

-- lobby_members: members of same lobby can read; own row to write
create policy "lobby_members_select_lobby"
  on lobby_members for select
  using (
    lobby_id in (
      select lobby_id from lobby_members lm2 where lm2.user_id = auth.uid()
    )
  );
create policy "lobby_members_insert_own"
  on lobby_members for insert with check (auth.uid() = user_id);
create policy "lobby_members_update_own"
  on lobby_members for update using (auth.uid() = user_id);

-- matches: members of the lobby can read; server-side upsert via service role
create policy "matches_select_lobby"
  on matches for select
  using (
    lobby_id in (
      select lobby_id from lobby_members lm where lm.user_id = auth.uid()
    )
  );
-- matches are written by the simulate Route Handler (service role), not client

-- players: public read-only
create policy "players_select_all"
  on players for select using (true);
