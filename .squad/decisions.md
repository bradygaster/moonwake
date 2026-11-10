# Squad Decisions

## Active Decisions

### 2026-11-10: Squad-only onboarding

- **Source:** Repository setup request.
- **Decision:** Squad 2.0.0-preview.4, official checksum-verified standalone archive,
  initialized with `squad init --no-workflows --state-backend local`.
- **Scope:** Team, coordinator, shipped skills/templates, and contributor docs.
  No Agentic Workflows, product implementation, dependencies, or behavior changes.
- **Operations:** No watch loop, auto-assignment, or merges. Future product work
  needs an explicit task. MCP launch configuration remains machine-local.

### 2026-11-10: Preserve the brief and its open questions

- **Source:** `README.md` and `art/moonwake-concept.svg`.
- **Decision:** Concept-only, targeting offline, directly opened HTML/CSS/vanilla
  JavaScript/inline SVG without a build step, backend, or runtime dependencies.
- **Intended acceptance:** Deterministic turns, preview parity, undo/restart,
  keyboard access, non-color cues, textual state, reduced-motion equivalence.
  These are goals, not existing capabilities.
- **Open:** Moon positions, tide/current rules, budgets, and level progression
  need design/playtesting. Sokka proposes; Iroh coordinates human approval.

### 2026-11-10: Avatar cast and fixed Squad support identities

- **Decision:** Iroh leads; Katara owns simulation; Sokka owns puzzles; Aang owns
  browser UI; Toph owns verification. Their charters are project-specific.
- **Reason:** Water-and-moon resonance. Names only, not borrowed franchise content.
- **Support:** Preserve Scribe, Ralph, Rai, and Fact Checker's official identities
  and bounded responsibilities.

## Governance

- Humans retain final scope, design, publication, and merge decisions.
- Record accepted architecture here; proposals are not settled facts.
- Histories contain verified learning; decisions describe direction.
