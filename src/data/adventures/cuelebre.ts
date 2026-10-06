import type { Adventure } from "../../game/types";

export const cuelebreAdventure: Adventure = {
  id: "cuelebre",
  titleKey: "adventure.cuelebre.title",
  subtitleKey: "adventure.cuelebre.meta",
  descriptionKey: "adventure.cuelebre.description",
  firstEncounter: "crossroads",
  encounterOrder: ["crossroads", "provisions", "barrel", "stones", "trail", "lair"],
  encounters: {
    crossroads: {
      id: "crossroads",
      titleKey: "encounter.crossroads.title",
      descriptionKey: "encounter.crossroads.description",
      art: "village",
      approaches: [
        {
          id: "listen",
          labelKey: "approach.listen.label",
          skill: "wits",
          requirement: 4,
          consequenceKey: "approach.listen.consequence",
          success: { textKey: "outcome.listen.success", nextEncounter: "provisions", effects: [{ flag: "knows_trick", value: true }] },
          failure: { textKey: "outcome.listen.failure", nextEncounter: "provisions", effects: [{ flag: "knows_trick", value: true }], extraStrain: 1 }
        },
        {
          id: "omens",
          labelKey: "approach.omens.label",
          skill: "magic",
          requirement: 4,
          consequenceKey: "approach.omens.consequence",
          success: { textKey: "outcome.omens.success", nextEncounter: "provisions", effects: [{ flag: "knows_trick", value: true }] },
          failure: { textKey: "outcome.omens.failure", nextEncounter: "provisions", effects: [{ flag: "knows_trick", value: true }], extraStrain: 1 }
        },
        {
          id: "march",
          labelKey: "approach.march.label",
          skill: "might",
          requirement: 5,
          consequenceKey: "approach.march.consequence",
          success: { textKey: "outcome.march.success", nextEncounter: "lair", effects: [{ flag: "cuelebre_angry", value: true }] },
          failure: { textKey: "outcome.march.failure", nextEncounter: "lair", effects: [{ flag: "cuelebre_angry", value: true }], extraStrain: 1 }
        }
      ]
    },
    provisions: {
      id: "provisions",
      titleKey: "encounter.provisions.title",
      descriptionKey: "encounter.provisions.description",
      art: "market",
      approaches: [
        {
          id: "bargain",
          labelKey: "approach.bargain.label",
          skill: "wits",
          requirement: 4,
          success: { textKey: "outcome.bargain.success", nextEncounter: "barrel", effects: [{ flag: "has_food", value: true }] },
          failure: { textKey: "outcome.bargain.failure", nextEncounter: "barrel", effects: [{ flag: "has_food", value: true }], extraStrain: 1 }
        },
        {
          id: "hunt",
          labelKey: "approach.hunt.label",
          skill: "finesse",
          requirement: 4,
          consequenceKey: "approach.hunt.consequence",
          success: { textKey: "outcome.hunt.success", nextEncounter: "barrel", effects: [{ flag: "has_food", value: true }] },
          failure: { textKey: "outcome.hunt.failure", nextEncounter: "barrel", effects: [{ flag: "has_food", value: true }], extraStrain: 1 }
        }
      ]
    },
    barrel: {
      id: "barrel",
      titleKey: "encounter.barrel.title",
      descriptionKey: "encounter.barrel.description",
      art: "workshop",
      approaches: [
        {
          id: "repair",
          labelKey: "approach.repair.label",
          skill: "finesse",
          requirement: 5,
          success: { textKey: "outcome.repair.success", nextEncounter: "stones", effects: [{ flag: "has_barrel", value: true }] },
          failure: { textKey: "outcome.repair.failure", nextEncounter: "stones", effects: [{ flag: "has_barrel", value: true }], extraStrain: 1 }
        },
        {
          id: "persuade",
          labelKey: "approach.persuade.label",
          skill: "magic",
          requirement: 5,
          consequenceKey: "approach.persuade.consequence",
          success: { textKey: "outcome.persuade.success", nextEncounter: "stones", effects: [{ flag: "has_barrel", value: true }] },
          failure: { textKey: "outcome.persuade.failure", nextEncounter: "stones", effects: [{ flag: "has_barrel", value: true }], extraStrain: 1 }
        }
      ]
    },
    stones: {
      id: "stones",
      titleKey: "encounter.stones.title",
      descriptionKey: "encounter.stones.description",
      art: "river",
      approaches: [
        {
          id: "haul",
          labelKey: "approach.haul.label",
          skill: "might",
          requirement: 5,
          success: { textKey: "outcome.haul.success", nextEncounter: "trail", effects: [{ flag: "barrel_ready", value: true }] },
          failure: { textKey: "outcome.haul.failure", nextEncounter: "trail", effects: [{ flag: "barrel_ready", value: true }], extraStrain: 1 }
        },
        {
          id: "balance",
          labelKey: "approach.balance.label",
          skill: "wits",
          requirement: 5,
          consequenceKey: "approach.balance.consequence",
          success: { textKey: "outcome.balance.success", nextEncounter: "trail", effects: [{ flag: "barrel_ready", value: true }] },
          failure: { textKey: "outcome.balance.failure", nextEncounter: "trail", effects: [{ flag: "barrel_ready", value: true }], extraStrain: 1 }
        }
      ]
    },
    trail: {
      id: "trail",
      titleKey: "encounter.trail.title",
      descriptionKey: "encounter.trail.description",
      art: "mountain",
      approaches: [
        {
          id: "quiet",
          labelKey: "approach.quiet.label",
          skill: "finesse",
          requirement: 5,
          consequenceKey: "approach.quiet.consequence",
          success: { textKey: "outcome.quiet.success", nextEncounter: "lair", effects: [{ flag: "cuelebre_angry", value: false }] },
          failure: { textKey: "outcome.quiet.failure", nextEncounter: "lair", effects: [{ flag: "cuelebre_angry", value: true }], extraStrain: 1 }
        },
        {
          id: "ward",
          labelKey: "approach.ward.label",
          skill: "magic",
          requirement: 5,
          success: { textKey: "outcome.ward.success", nextEncounter: "lair", effects: [{ flag: "cuelebre_angry", value: false }] },
          failure: { textKey: "outcome.ward.failure", nextEncounter: "lair", effects: [{ flag: "cuelebre_angry", value: true }], extraStrain: 1 }
        }
      ]
    },
    lair: {
      id: "lair",
      titleKey: "encounter.lair.title",
      descriptionKey: "encounter.lair.description",
      art: "dragon",
      approaches: [
        {
          id: "trick",
          labelKey: "approach.trick.label",
          skill: "wits",
          requirement: 6,
          consequenceKey: "approach.trick.consequence",
          availableIf: { flag: "barrel_ready", value: true },
          success: { textKey: "outcome.trick.success", complete: true, effects: [{ flag: "cuelebre_defeated", value: true }] },
          failure: { textKey: "outcome.trick.failure", complete: true, effects: [{ flag: "cuelebre_driven_off", value: true }], extraStrain: 1 }
        },
        {
          id: "fight",
          labelKey: "approach.fight.label",
          skill: "might",
          requirement: 7,
          consequenceKey: "approach.fight.consequence",
          success: { textKey: "outcome.fight.success", complete: true, effects: [{ flag: "cuelebre_defeated", value: true }] },
          failure: { textKey: "outcome.fight.failure", complete: true, effects: [{ flag: "cuelebre_driven_off", value: true }], extraStrain: 1 }
        },
        {
          id: "steal",
          labelKey: "approach.steal.label",
          skill: "finesse",
          requirement: 6,
          consequenceKey: "approach.steal.consequence",
          success: { textKey: "outcome.steal.success", complete: true, effects: [{ flag: "cuelebre_outwitted", value: true }] },
          failure: { textKey: "outcome.steal.failure", complete: true, effects: [{ flag: "cuelebre_driven_off", value: true }], extraStrain: 1 }
        }
      ]
    }
  }
};

export const adventures = { cuelebre: cuelebreAdventure };
