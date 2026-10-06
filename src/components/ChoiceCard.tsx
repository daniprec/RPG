import type { Approach } from "../game/types";

interface Props {
  approach: Approach;
  selected: boolean;
  total: number;
  label: string;
  skillLabel: string;
  requirementLabel: string;
  consequence?: string;
  onSelect: () => void;
  onCharacterDrop: (characterId: string) => void;
}

export function ChoiceCard({ approach, selected, total, label, skillLabel, requirementLabel, consequence, onSelect, onCharacterDrop }: Props) {
  const met = total >= approach.requirement;
  return (
    <article
      className={`choice-card skill-${approach.skill} ${selected ? "selected" : ""} ${selected && met ? "met" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onCharacterDrop(event.dataTransfer.getData("text/character-id"));
      }}
    >
      <button type="button" className="choice-select" onClick={onSelect} aria-pressed={selected}>
        <span className="choice-heading">{label}</span>
        <span className="requirement-label">{requirementLabel}</span>
        <span className="pips" aria-hidden="true">
          {Array.from({ length: approach.requirement }, (_, index) => (
            <i key={index} className={selected && index < total ? "filled" : ""} />
          ))}
        </span>
        <span className="requirement-total">
          {skillLabel.toUpperCase()} {approach.requirement}
          {selected && <b>{total} / {approach.requirement}</b>}
        </span>
        {consequence && <em>{consequence}</em>}
      </button>
    </article>
  );
}
