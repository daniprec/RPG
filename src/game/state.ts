import { characters } from "../data/characters";
import type { GameState, Language } from "./types";

export const SAVE_KEY = "cuelebre-save-v1";

export function createInitialState(language: Language = "en"): GameState {
  return {
    version: 1,
    language,
    screen: "home",
    currentAdventure: null,
    currentEncounter: null,
    selectedApproach: null,
    assignedCharacterIds: [],
    characters: characters.map(({ id }) => ({ id, strain: 0 })),
    flags: {},
    completedAdventures: [],
    lastOutcomeKey: null,
    lastOutcomeSuccess: null,
    nextEncounter: null,
    adventureStep: 0
  };
}

export function saveState(state: GameState, storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadState(storage: Pick<Storage, "getItem"> = localStorage): GameState {
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (parsed.version !== 1 || !Array.isArray(parsed.characters)) return createInitialState();
    return { ...createInitialState(parsed.language === "es" ? "es" : "en"), ...parsed } as GameState;
  } catch {
    return createInitialState();
  }
}
