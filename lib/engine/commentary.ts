import type { EventType } from "@/lib/types";

// Commentary tables by event type.
// [A] = attacker name, [G] = goalkeeper name, [D] = defender/midfielder name
// TODO Fase 2: narração via LLM nos eventos críticos

const TEMPLATES: Record<string, string[]> = {
  goal: [
    "⚽ GOL! [A] chuta cruzado e não dá chance para [G]!",
    "⚽ GOL! Cabeceio certeiro de [A]! Que bola!",
    "⚽ GOL! [A] recebe na área e finaliza na saída de [G]!",
    "⚽ GOLAÇO de [A]! De fora da área, sem chance!",
    "⚽ GOL! [A] aproveita o rebote e empurra para o fundo!",
    "⚽ GOL! Cobrança de falta magistral de [A]!",
    "⚽ GOL! [A] sobe sozinho na segunda trave e cabecea!",
    "⚽ GOL! [A] dribla [G] e toca para o gol vazio!",
    "⚽ GOL! [A] de calcanhar! Que gênio!",
    "⚽ GOL! Contra-ataque fatal — [A] sela o placar!",
  ],
  save: [
    "🧤 Grande defesa de [G]! Mandou para escanteio!",
    "🧤 [G] esticado salva a equipe!",
    "🧤 Incrível! [G] defendeu no reflexo — [A] não acredita!",
    "🧤 [A] finaliza forte, mas [G] estava no lugar certo!",
    "🧤 [G] com os pés! Que intervenção!",
    "🧤 Milagre de [G]! A torcida enlouqueceu!",
  ],
  shot_post: [
    "🎯 NA TRAVE! [A] chutou no ângulo mas o poste salvou!",
    "🎯 [A] acerta a trave! Que azar!",
    "🎯 Travessão! [A] arriscou de longe!",
  ],
  shot_wide: [
    "💨 [A] finalizou por cima da trave.",
    "💨 [A] chutou para fora. Desperdício.",
    "💨 [D] bloqueou o chute de [A].",
  ],
  card: [
    "🟨 Falta dura de [D]. Cartão amarelo!",
    "🟨 [D] para o contra-ataque e leva o cartão.",
    "🟨 Reclamação desnecessária — [D] vê o amarelo.",
    "🟨 [D] chega atrasado e o árbitro não perdoa.",
  ],
  sub: [
    "↕ [R] entra no lugar de [D]. Mudança tática.",
    "↕ Técnico aposta em [R] para essa reta final.",
    "↕ [D] sai exausto; [R] entra com energia nova.",
    "↕ Dupla substituição! Time muda de postura.",
  ],
  info: [],
  fulltime: [],
};

export function pickCommentary(
  type: EventType | "save" | "shot_post" | "shot_wide",
  rand: () => number,
  names: {
    attacker?: string;
    goalkeeper?: string;
    defender?: string;
    reserve?: string;
  } = {}
): string {
  const pool = TEMPLATES[type];
  if (!pool || pool.length === 0) return "";

  const template = pool[Math.floor(rand() * pool.length)];

  return template
    .replace(/\[A\]/g,  names.attacker  ?? "Jogador")
    .replace(/\[G\]/g,  names.goalkeeper ?? "Goleiro")
    .replace(/\[D\]/g,  names.defender  ?? "Jogador")
    .replace(/\[R\]/g,  names.reserve   ?? "Reserva");
}
