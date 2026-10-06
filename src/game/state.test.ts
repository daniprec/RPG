import { describe, expect, it } from "vitest";
import { createInitialState, loadState, saveState, SAVE_KEY } from "./state";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem(key: string) { return data[key] ?? null; },
    setItem(key: string, value: string) { data[key] = value; },
    data
  };
}

describe("save state", () => {
  it("saves and loads a versioned game", () => {
    const storage = memoryStorage();
    const state = { ...createInitialState("es"), screen: "encounter" as const, currentAdventure: "cuelebre", currentEncounter: "stones" };
    saveState(state, storage);
    expect(loadState(storage)).toEqual(state);
    expect(JSON.parse(storage.data[SAVE_KEY]).version).toBe(1);
  });

  it("falls back safely for corrupt or unknown saves", () => {
    expect(loadState(memoryStorage({ [SAVE_KEY]: "not json" })).screen).toBe("home");
    expect(loadState(memoryStorage({ [SAVE_KEY]: JSON.stringify({ version: 99 }) })).version).toBe(1);
  });
});
