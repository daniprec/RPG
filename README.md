# Risco

Risco is a small, mobile-first fantasy adventure game for the browser. Its first adventure, **The Cuélebre**, asks the player to choose deterministic approaches to short encounters, commit members of a four-person company, and manage their limited Strain across the journey.

There are no dice, hit points, inventory, or separate combat mode. Fighting is simply another approach: assign enough skill to meet its visible requirement, accept the consequence, and move on.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Vite prints a local URL. Open it in a browser; device emulation at a portrait phone size is useful when developing.

## Test and build

```bash
npm test
npm run build
npm run preview
```

The production site is emitted to `dist/`. Vite uses a relative asset base, so the output works both at a GitHub Pages project path and at the domain root.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` tests and builds every push to `main`, then deploys `dist/` through GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. No backend or runtime secret is required.

## Project map

```text
src/
  components/                 Reusable game UI
  data/
    characters.ts             Fixed party definitions and stats
    adventures/cuelebre.ts    Adventure, encounters, choices, outcomes and flags
  game/
    rules.ts                  Pure skill, Strain, flag and advancement rules
    state.ts                  Initial state plus versioned localStorage persistence
    types.ts                  Content and state contracts
  i18n/translations.ts        English and Spanish strings
  styles/main.css             Mobile-first visual system
```

Content refers to stable translation keys rather than embedding prose. UI components render encounters generically and contain no Cuélebre-specific branching.

## Add an encounter

1. Add an `Encounter` object under `encounters` in the adventure data.
2. Give it two or more approaches. Each approach declares a skill, requirement, success outcome, failure fallback, and next encounter (or `complete: true`).
3. Add its id to `encounterOrder` for progress display.
4. Add every title, description, label, consequence, and outcome key to both language dictionaries.
5. Point an earlier approach outcome's `nextEncounter` to the new id.

Optional `effects` set small narrative flags. `availableIf` can reveal an approach when one exact flag value is present. This intentionally remains a small mechanism, not a general scripting engine.

## Add an adventure

1. Create another `Adventure` data file with metadata, a first encounter, ordered encounter ids, and an encounter record.
2. Export it from the adventure registry in `src/data/adventures/cuelebre.ts` (the registry can move to its own file when a second adventure actually exists).
3. Add bilingual translation keys.
4. Add a home-screen tile that starts the selected adventure. The engine and rule functions do not need adventure-specific changes.

## Current rules

- Assigned characters contribute the sum of one visible skill.
- A total equal to or above the requirement succeeds; no randomness is involved.
- Every participant gains 1 Strain after resolution. A failed approach may add 1 more.
- At 3 Strain a character is Exhausted and cannot be assigned again.
- Failure always has a defined onward outcome, so insufficient skill never causes a hard game-over.
- The maximum Strain is the exported `MAX_STRAIN` constant in `src/game/rules.ts`.

Game state, language, narrative flags, party Strain, and completed adventures are saved under a versioned localStorage key after every state change. A development-only reset button appears when running the Vite development server.
