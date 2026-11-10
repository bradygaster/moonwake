# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Scope, architecture, contracts, review | Iroh | Preserve offline/no-build goals; coordinate cross-domain decisions |
| Deterministic simulation and state | Katara | Tide gates, currents, preview/commit, turn accounting, undo/restart |
| Puzzle rules and level design | Sokka | Moon positions, budgets, solvability, teaching progression |
| Browser UI, SVG, CSS, accessibility | Aang | Paper-layer board, keyboard controls, text summaries, reduced motion |
| Tests and independent verification | Toph | Replay, preview parity, offline and accessibility checks |

Routes describe ownership, not authorization to implement the game. Read the
project context, accepted decisions, and the member's charter/history first.

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Propose triage when requested | Iroh |
| `squad:iroh` | Scope or architecture | Iroh |
| `squad:katara` | Simulation or state | Katara |
| `squad:sokka` | Puzzle design | Sokka |
| `squad:aang` | UI or accessibility implementation | Aang |
| `squad:toph` | Verification or regression cases | Toph |

### How Issue Assignment Works

Manual conventions only: this setup creates no labels, assignments, schedules,
or workflows. A label alone does not authorize implementation.

## Rules

1. Stay inside requested scope. Squad maintenance or concept discussion never
   implicitly authorizes product features, dependencies, or workflows.
2. Quick facts go to the coordinator. Otherwise select the primary domain owner;
   parallelize only independent, explicitly scoped work.
3. Iroh coordinates contracts. Sokka proposes rules; Katara implements approved
   rules; Aang renders state without duplicating simulation.
4. Toph derives acceptance cases alongside requested implementation. Do not invent
   a test runner or claim a playable build exists today.
5. Use one qualified independent reviewer for ordinary changes. Authors do not
   approve their own work; escalate unresolved product choices to the human.
6. Scribe merges accepted decisions only; specialists own their histories.
7. Rai and Fact Checker are on-demand support/gate identities, not ordinary
   specialist routing destinations.
8. Ralph is on request only. No watch loops, automatic assignments, publication,
   or merges without explicit human direction.
