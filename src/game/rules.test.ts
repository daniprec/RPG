import { describe, expect, it } from "vitest";
import { characters } from "../data/characters";
import { cuelebreAdventure } from "../data/adventures/cuelebre";
import { applyEffects, applyStrain, assignedSkillTotal, availableApproaches, canAssign, isExhausted, nextEncounterState, requirementSatisfied } from "./rules";
import { createInitialState } from "./state";

describe("core rules", () => {
  it("adds the relevant skill for assigned characters", () => {
    expect(assignedSkillTotal(["dolores", "emilio"], "might", characters)).toBe(6);
    expect(assignedSkillTotal(["cayetano", "milagros"], "wits", characters)).toBe(6);
  });

  it("satisfies a requirement without randomness", () => {
    expect(requirementSatisfied(6, 6)).toBe(true);
    expect(requirementSatisfied(5, 6)).toBe(false);
  });

  it("applies strain only to participants and caps it", () => {
    const initial = createInitialState().characters;
    const once = applyStrain(initial, ["dolores", "emilio"]);
    expect(once.find((character) => character.id === "dolores")?.strain).toBe(1);
    expect(once.find((character) => character.id === "milagros")?.strain).toBe(0);
    expect(applyStrain(once, ["dolores"], 5).find((character) => character.id === "dolores")?.strain).toBe(3);
  });

  it("detects exhaustion and prevents assignment", () => {
    expect(isExhausted({ id: "dolores", strain: 3 })).toBe(true);
    expect(canAssign({ id: "dolores", strain: 3 })).toBe(false);
    expect(canAssign({ id: "dolores", strain: 2 })).toBe(true);
  });

  it("uses flags to reveal encounter approaches", () => {
    const lair = cuelebreAdventure.encounters.lair;
    expect(availableApproaches(lair.approaches, {}).map(({ id }) => id)).not.toContain("trick");
    expect(availableApproaches(lair.approaches, { barrel_ready: true }).map(({ id }) => id)).toContain("trick");
  });

  it("evaluates outcome effects and advances encounters", () => {
    const listen = cuelebreAdventure.encounters.crossroads.approaches[0];
    const flags = applyEffects({}, listen.success.effects);
    expect(flags.knows_trick).toBe(true);

    const state = {
      ...createInitialState(),
      screen: "outcome" as const,
      currentAdventure: "cuelebre",
      currentEncounter: "crossroads",
      nextEncounter: "provisions",
      adventureStep: 1
    };
    const advanced = nextEncounterState(state);
    expect(advanced.screen).toBe("encounter");
    expect(advanced.currentEncounter).toBe("provisions");
    expect(advanced.adventureStep).toBe(2);
  });

  it("marks the adventure complete when no encounter remains", () => {
    const completed = nextEncounterState({
      ...createInitialState(),
      screen: "outcome",
      currentAdventure: "cuelebre",
      nextEncounter: null
    });
    expect(completed.screen).toBe("complete");
    expect(completed.completedAdventures).toContain("cuelebre");
  });
});
