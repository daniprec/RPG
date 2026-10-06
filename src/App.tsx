import { useEffect, useMemo, useState } from "react";
import { CharacterCard } from "./components/CharacterCard";
import { ChoiceCard } from "./components/ChoiceCard";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { characters } from "./data/characters";
import { adventures, cuelebreAdventure } from "./data/adventures/cuelebre";
import { applyEffects, applyStrain, assignedSkillTotal, availableApproaches, canAssign, nextEncounterState, requirementSatisfied } from "./game/rules";
import { createInitialState, loadState, saveState } from "./game/state";
import type { Approach, Language } from "./game/types";
import { translate } from "./i18n/translations";

const artSymbols: Record<string, string> = {
  village: "⌂",
  market: "♨",
  workshop: "◉",
  river: "≈",
  mountain: "▲",
  dragon: "ϟ"
};

export default function App() {
  const [state, setState] = useState(loadState);
  const t = (key: string, values?: Record<string, string | number>) => translate(state.language, key, values);

  useEffect(() => saveState(state), [state]);

  const adventure = state.currentAdventure ? adventures[state.currentAdventure as keyof typeof adventures] : null;
  const encounter = adventure && state.currentEncounter ? adventure.encounters[state.currentEncounter] : null;
  const approaches = useMemo(
    () => encounter ? availableApproaches(encounter.approaches, state.flags) : [],
    [encounter, state.flags]
  );
  const selected = approaches.find((approach) => approach.id === state.selectedApproach) ?? null;
  const selectedTotal = selected ? assignedSkillTotal(state.assignedCharacterIds, selected.skill, characters) : 0;

  function setLanguage(language: Language) {
    setState((current) => ({ ...current, language }));
  }

  function openAdventure() {
    setState((current) => ({ ...current, screen: "adventure", currentAdventure: "cuelebre" }));
  }

  function startAdventure() {
    const clean = createInitialState(state.language);
    setState({
      ...clean,
      completedAdventures: state.completedAdventures,
      screen: "encounter",
      currentAdventure: cuelebreAdventure.id,
      currentEncounter: cuelebreAdventure.firstEncounter,
      adventureStep: 1
    });
  }

  function selectApproach(approach: Approach) {
    setState((current) => ({
      ...current,
      selectedApproach: approach.id,
      assignedCharacterIds: current.selectedApproach === approach.id ? current.assignedCharacterIds : []
    }));
  }

  function toggleCharacter(characterId: string) {
    if (!selected) return;
    const characterState = state.characters.find((character) => character.id === characterId);
    if (!characterState || !canAssign(characterState)) return;
    setState((current) => ({
      ...current,
      assignedCharacterIds: current.assignedCharacterIds.includes(characterId)
        ? current.assignedCharacterIds.filter((id) => id !== characterId)
        : [...current.assignedCharacterIds, characterId]
    }));
  }

  function dropCharacter(approach: Approach, characterId: string) {
    if (!characterId) return;
    const characterState = state.characters.find((character) => character.id === characterId);
    if (!characterState || !canAssign(characterState)) return;
    setState((current) => ({
      ...current,
      selectedApproach: approach.id,
      assignedCharacterIds: current.selectedApproach === approach.id
        ? Array.from(new Set([...current.assignedCharacterIds, characterId]))
        : [characterId]
    }));
  }

  function resolveApproach() {
    if (!selected) return;
    const succeeded = requirementSatisfied(selectedTotal, selected.requirement);
    const outcome = succeeded ? selected.success : selected.failure;
    const strainAmount = 1 + (succeeded ? 0 : outcome.extraStrain ?? 0);
    setState((current) => ({
      ...current,
      screen: "outcome",
      characters: applyStrain(current.characters, current.assignedCharacterIds, strainAmount),
      flags: applyEffects(current.flags, outcome.effects),
      lastOutcomeKey: outcome.textKey,
      lastOutcomeSuccess: succeeded,
      nextEncounter: outcome.complete ? null : outcome.nextEncounter ?? null
    }));
  }

  function goHome() {
    setState((current) => ({
      ...current,
      screen: "home",
      currentAdventure: null,
      currentEncounter: null,
      selectedApproach: null,
      assignedCharacterIds: []
    }));
  }

  function resetSave() {
    if (window.confirm(t("ui.resetConfirm"))) setState(createInitialState(state.language));
  }

  return (
    <main className="app-shell">
      <section className={`game-frame screen-${state.screen}`}>
        <header className="topbar">
          <div>
            <span className="eyebrow">{t("app.eyebrow")}</span>
            <strong>{adventure ? t(adventure.titleKey) : "Risco"}</strong>
          </div>
          <LanguageSwitch language={state.language} onChange={setLanguage} />
        </header>

        {state.screen === "home" && (
          <div className="home-screen">
            <div className="hero-mark" aria-hidden="true"><span>ϟ</span></div>
            <p className="kicker">{t("home.available")}</p>
            <h1>{t("home.title")}</h1>
            <p>{t("home.intro")}</p>
            <button className="adventure-tile" type="button" onClick={openAdventure}>
              <span className="tile-art" aria-hidden="true">C</span>
              <span><strong>{t(cuelebreAdventure.titleKey)}</strong><small>{t(cuelebreAdventure.subtitleKey)}</small></span>
              {state.completedAdventures.includes("cuelebre") && <b>{t("home.completed")}</b>}
              <i aria-hidden="true">›</i>
            </button>
            <p className="coming-soon">{t("home.comingSoon")}</p>
          </div>
        )}

        {state.screen === "adventure" && adventure && (
          <div className="adventure-screen">
            <div className="adventure-cover" aria-hidden="true"><span>ϟ</span><i /></div>
            <p className="kicker">{t(adventure.subtitleKey)}</p>
            <h1>{t(adventure.titleKey)}</h1>
            <p>{t(adventure.descriptionKey)}</p>
            <Party state={state} t={t} />
            <button className="primary-button" type="button" onClick={startAdventure}>{t("ui.start")}</button>
          </div>
        )}

        {state.screen === "encounter" && adventure && encounter && (
          <div className="encounter-screen">
            <div className={`encounter-art art-${encounter.art}`} role="img" aria-label={t(encounter.titleKey)}>
              <span>{artSymbols[encounter.art]}</span><i /><b />
            </div>
            <div className="encounter-heading">
              <span>{t("ui.progress", { current: state.adventureStep, total: adventure.encounterOrder.length })}</span>
              <h1>{t(encounter.titleKey)}</h1>
              <p>{t(encounter.descriptionKey)}</p>
            </div>
            <div className="choices" aria-label={t("ui.choose")}>
              {approaches.map((approach) => (
                <ChoiceCard
                  key={approach.id}
                  approach={approach}
                  selected={selected?.id === approach.id}
                  total={selected?.id === approach.id ? selectedTotal : 0}
                  label={t(approach.labelKey)}
                  skillLabel={t(`skill.${approach.skill}`)}
                  requirementLabel={t("ui.requirement")}
                  consequence={approach.consequenceKey ? t(approach.consequenceKey) : undefined}
                  onSelect={() => selectApproach(approach)}
                  onCharacterDrop={(id) => dropCharacter(approach, id)}
                />
              ))}
            </div>
            <p className="assign-hint">{selected ? t("ui.assignHint") : t("ui.choose")}</p>
            <Party state={state} selected={selected ?? undefined} onToggle={toggleCharacter} t={t} />
            <button className="primary-button" type="button" disabled={!selected} onClick={resolveApproach}>
              {t("ui.confirm")}
            </button>
          </div>
        )}

        {state.screen === "outcome" && state.lastOutcomeKey && (
          <div className="outcome-screen">
            <div className={`outcome-sigil ${state.lastOutcomeSuccess ? "success" : "failure"}`} aria-hidden="true">
              {state.lastOutcomeSuccess ? "✦" : "◇"}
            </div>
            <p className="kicker">{t(state.lastOutcomeSuccess ? "ui.outcome.success" : "ui.outcome.failure")}</p>
            <h1>{encounter ? t(encounter.titleKey) : t("adventure.cuelebre.title")}</h1>
            <p className="outcome-copy">{t(state.lastOutcomeKey)}</p>
            <Party state={state} t={t} />
            <button className="primary-button" type="button" onClick={() => setState((current) => nextEncounterState(current))}>{t("ui.continue")}</button>
          </div>
        )}

        {state.screen === "complete" && (
          <div className="complete-screen">
            <div className="complete-art" aria-hidden="true"><span>✦</span></div>
            <p className="kicker">{t("ui.complete")}</p>
            <h1>{t("adventure.cuelebre.title")}</h1>
            <p>{t("ui.completeBody")}</p>
            <Party state={state} t={t} />
            <button className="primary-button" type="button" onClick={goHome}>{t("ui.home")}</button>
          </div>
        )}

        {import.meta.env.DEV && (
          <button className="dev-reset" type="button" onClick={resetSave}>{t("ui.reset")}</button>
        )}
      </section>
    </main>
  );
}

function Party({ state, selected, onToggle = () => undefined, t }: {
  state: ReturnType<typeof loadState>;
  selected?: Approach;
  onToggle?: (id: string) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <section className="party-panel">
      <div className="party-title"><strong>{t("ui.party")}</strong>{selected && <span>{t(`skill.${selected.skill}`)}</span>}</div>
      <div className="party-grid">
        {characters.map((definition) => {
          const characterState = state.characters.find((character) => character.id === definition.id)!;
          return (
            <CharacterCard
              key={definition.id}
              definition={definition}
              state={characterState}
              selected={state.assignedCharacterIds.includes(definition.id)}
              focusedSkill={selected?.skill}
              className={t(definition.classKey)}
              exhaustedLabel={t("ui.exhausted")}
              strainLabel={t("ui.strain")}
              onToggle={() => onToggle(definition.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
