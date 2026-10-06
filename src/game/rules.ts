import type { Approach, CharacterDefinition, CharacterState, Effect, GameState, Skill } from "./types";

export const MAX_STRAIN = 3;

export function isExhausted(character: CharacterState): boolean {
  return character.strain >= MAX_STRAIN;
}

export function canAssign(character: CharacterState): boolean {
  return !isExhausted(character);
}

export function assignedSkillTotal(
  ids: string[],
  skill: Skill,
  definitions: CharacterDefinition[]
): number {
  return ids.reduce((total, id) => total + (definitions.find((item) => item.id === id)?.stats[skill] ?? 0), 0);
}

export function requirementSatisfied(total: number, requirement: number): boolean {
  return total >= requirement;
}

export function applyStrain(
  states: CharacterState[],
  participantIds: string[],
  amount = 1
): CharacterState[] {
  return states.map((character) =>
    participantIds.includes(character.id)
      ? { ...character, strain: Math.min(MAX_STRAIN, character.strain + amount) }
      : character
  );
}

export function effectMatches(flags: GameState["flags"], condition?: Effect): boolean {
  return !condition || flags[condition.flag] === condition.value;
}

export function availableApproaches(approaches: Approach[], flags: GameState["flags"]): Approach[] {
  return approaches.filter((approach) => effectMatches(flags, approach.availableIf));
}

export function applyEffects(flags: GameState["flags"], effects = [] as Effect[]): GameState["flags"] {
  return effects.reduce((next, effect) => ({ ...next, [effect.flag]: effect.value }), { ...flags });
}

export function nextEncounterState(state: GameState): GameState {
  if (!state.nextEncounter) {
    return {
      ...state,
      screen: "complete",
      completedAdventures: state.currentAdventure && !state.completedAdventures.includes(state.currentAdventure)
        ? [...state.completedAdventures, state.currentAdventure]
        : state.completedAdventures
    };
  }
  return {
    ...state,
    screen: "encounter",
    currentEncounter: state.nextEncounter,
    selectedApproach: null,
    assignedCharacterIds: [],
    lastOutcomeKey: null,
    lastOutcomeSuccess: null,
    nextEncounter: null,
    adventureStep: state.adventureStep + 1
  };
}
