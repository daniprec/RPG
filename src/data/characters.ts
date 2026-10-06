import type { CharacterDefinition } from "../game/types";

export const characters: CharacterDefinition[] = [
  {
    id: "dolores",
    name: "Dolores",
    gender: "female",
    classKey: "character.class.warrior",
    portrait: "🛡️",
    stats: { might: 4, finesse: 2, wits: 1, magic: 0 }
  },
  {
    id: "milagros",
    name: "Milagros",
    gender: "female",
    classKey: "character.class.cleric",
    portrait: "✦",
    stats: { might: 1, finesse: 0, wits: 2, magic: 4 }
  },
  {
    id: "cayetano",
    name: "Cayetano",
    gender: "male",
    classKey: "character.class.bard",
    portrait: "♫",
    stats: { might: 0, finesse: 2, wits: 4, magic: 1 }
  },
  {
    id: "emilio",
    name: "Emilio",
    gender: "male",
    classKey: "character.class.thief",
    portrait: "◆",
    stats: { might: 2, finesse: 4, wits: 1, magic: 0 }
  }
];
