# ⚽ FUTBATTLE

Convoque lendas de seleções históricas (1950–2022), comande sua seleção como técnico e conquiste uma Copa do Mundo completa.

## Como funciona

1. **Convoque** — Para cada posição, a roleta sorteia uma seleção histórica real (Brasil 1970, Hungria 1954, Argentina 1986…). Escolha a lenda daquela posição ou gire de novo. 11 titulares + 4 reservas (máx. 1 reserva por posição).
2. **Comande** — Formação (4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-4-1), mentalidade (defensiva/equilibrada/ofensiva) e estilo de jogo (posse, contra-ataque, laterais, pressão alta, falso 9). Mude tudo a cada partida — e durante a partida.
3. **Conquiste** — Copa com 32 seleções: fase de grupos (8 grupos, saldo de gols, classificação ao vivo) e mata-mata até a final, com pênaltis.

## A partida

Campo 2D animado com os 22 jogadores, narração em tempo real, estatísticas, velocidades 1x/1.5x/2x ou pular para o fim, pausa para mexer na tática, 3 substituições, notas dos jogadores, craque da partida e os resultados dos outros jogos da rodada.

Os ratings dos jogadores são baseados no **auge** da carreira (Pelé 99, Ronaldo 99, Maradona 99…).

## Rodando

```bash
npm install
npm run dev    # http://localhost:3000
npm test       # testes do motor de simulação
npm run build
```

Stack: Next.js (App Router) · TypeScript · Tailwind · Framer Motion · Zustand (persistência local — seu torneio continua de onde parou).
