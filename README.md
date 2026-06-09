# 7–0 Battle

Web app multiplayer de futebol para até 10 amigos. Draft aleatório, química, simulação ao vivo, liga Cartola-style.

## Stack
- Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
- Supabase (Postgres + Auth anônima + Realtime)
- Zustand (estado de cliente)

## Como rodar

### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) → New Project (plano grátis basta).
2. Após criar, vá em **SQL Editor** e rode o conteúdo de `supabase/migrations/0001_init.sql`.
3. Depois rode o seed: cole o conteúdo de `supabase/seed/players.sql` no SQL Editor também.

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```
Edite `.env.local` com os valores do seu projeto Supabase:
- `NEXT_PUBLIC_SUPABASE_URL` → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Settings → API → anon / public key

### 3. Instalar e rodar
```bash
npm install
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000).

### 4. Testar multiplayer
1. Crie uma sala na aba **Sala**.
2. Abra uma segunda aba com o mesmo código de sala.
3. As duas abas devem ver a mesma simulação ao vivo em sincronia.

## Estrutura
```
app/                    # rotas (App Router)
  lobby/                # Sala — código, presença, começar
  draft/                # Draft — sortear jogadores, 3 trocas
  team/                 # Meu Time — campo, química, setores
  battle/               # Batalha — ao vivo, placar, ticker
  league/               # Liga — tabela Cartola + mata-mata
  result/               # Resultado — placar, 7–0 bar, próxima
  _dev/sim/             # Dev: teste do motor offline
  api/simulate/         # Route Handler: roda a simulação no servidor
components/             # Header, BottomNav, PlayerCard, Scoreboard...
lib/
  engine/               # Motor: mulberry32, simulate, chemistry, scoring, commentary
  store/                # Zustand stores
  supabase/             # Supabase client
  types.ts              # Tipos TypeScript do domínio
supabase/
  migrations/0001_init.sql
  seed/players.sql
```

## Critérios de pronto (por passo)
- [ ] `npm run dev` sobe sem erro no console
- [ ] Mesmo `seed` → mesmo placar e eventos (teste unitário)
- [ ] Draft: sortear preenche, trocar consome das 3, em 0 trava, lendário faz reveal
- [ ] Química muda a força do time de forma visível
- [ ] Duas abas: mesma narração em sincronia, mesmo placar
- [ ] Derrota zera streak e força re-draft; 7 vitórias → tela 7–0
- [ ] Mata-mata fecha a chave com CPU quando faltam jogadores
- [ ] Funciona em ~390px; foco de teclado visível; `prefers-reduced-motion` respeitado
