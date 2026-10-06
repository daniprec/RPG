import type { CharacterDefinition, CharacterState, Skill } from "../game/types";
import { isExhausted, MAX_STRAIN } from "../game/rules";

interface Props {
  definition: CharacterDefinition;
  state: CharacterState;
  selected: boolean;
  focusedSkill?: Skill;
  className: string;
  exhaustedLabel: string;
  strainLabel: string;
  onToggle: () => void;
}

export function CharacterCard({ definition, state, selected, focusedSkill, className, exhaustedLabel, strainLabel, onToggle }: Props) {
  const exhausted = isExhausted(state);
  return (
    <button
      type="button"
      className={`character-card ${selected ? "selected" : ""} ${exhausted ? "exhausted" : ""}`}
      onClick={onToggle}
      disabled={exhausted}
      draggable={!exhausted}
      onDragStart={(event) => event.dataTransfer.setData("text/character-id", definition.id)}
      aria-pressed={selected}
    >
      <span className="portrait" aria-hidden="true">{definition.portrait}</span>
      <span className="character-copy">
        <strong>{definition.name}</strong>
        <small>{className}{focusedSkill ? ` · ${definition.stats[focusedSkill]}` : ""}</small>
      </span>
      <span className="strain" title={`${strainLabel}: ${state.strain}/${MAX_STRAIN}`} aria-label={`${strainLabel}: ${state.strain}/${MAX_STRAIN}`}>
        {Array.from({ length: MAX_STRAIN }, (_, index) => (
          <i key={index} className={index < state.strain ? "filled" : ""} />
        ))}
      </span>
      {exhausted && <span className="exhausted-label">{exhaustedLabel}</span>}
    </button>
  );
}
