export type Language = "en" | "es";
export type Skill = "might" | "finesse" | "wits" | "magic";
export type Screen = "home" | "adventure" | "encounter" | "outcome" | "complete";

export interface CharacterDefinition {
  id: string;
  name: string;
  gender: "female" | "male";
  classKey: string;
  portrait: string;
  stats: Record<Skill, number>;
}

export interface CharacterState {
  id: string;
  strain: number;
}

export interface Effect {
  flag: string;
  value: boolean | string | number;
}

export interface ApproachOutcome {
  textKey: string;
  nextEncounter?: string;
  effects?: Effect[];
  complete?: boolean;
  extraStrain?: number;
}

export interface Approach {
  id: string;
  labelKey: string;
  skill: Skill;
  requirement: number;
  consequenceKey?: string;
  availableIf?: Effect;
  success: ApproachOutcome;
  failure: ApproachOutcome;
}

export interface Encounter {
  id: string;
  titleKey: string;
  descriptionKey: string;
  art: string;
  approaches: Approach[];
}

export interface Adventure {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  firstEncounter: string;
  encounterOrder: string[];
  encounters: Record<string, Encounter>;
}

export interface GameState {
  version: 1;
  language: Language;
  screen: Screen;
  currentAdventure: string | null;
  currentEncounter: string | null;
  selectedApproach: string | null;
  assignedCharacterIds: string[];
  characters: CharacterState[];
  flags: Record<string, boolean | string | number>;
  completedAdventures: string[];
  lastOutcomeKey: string | null;
  lastOutcomeSuccess: boolean | null;
  nextEncounter: string | null;
  adventureStep: number;
}
