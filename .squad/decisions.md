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

### 2026-11-10: Approve Moonwake v1 rules and delivery targets

- **Source:** Explicit user approval in issue #4: “Approve all recommendations
  and proceed with implementation waves”.
- **Decision:** Approve all recommendations in Sokka's complete #4 proposal.
  Use a level-defined 5×5–7×7 board and an eight-station labeled moon ring;
  legal moves are one adjacent station in either direction or wait. Each
  station has a fixed global high/low tide. A committed turn moves the moon,
  increments the turn, reads tide at the new station, updates tidal cells, reads
  the boat cell's current for that tide, attempts exactly one cell of movement
  (blocked/out-of-bounds movement stays put), then checks outcomes. A cell
  closing around the boat does not harm it and only blocks entry.
- **Outcomes and history:** Every move or wait costs one turn; preview, undo, and
  restart cost none. Entering the harbor wins immediately, including on the
  budget boundary; otherwise exhausting the budget is dawn/failure. Win/dawn
  disables further moon moves. Undo is unlimited through terminal states;
  restart restores the initial level and clears history. No persistence.
- **Voyages:** Ship eight handcrafted, deterministic levels introducing moon
  movement/still currents, budget, low-tide gates, high-tide passages, waiting,
  tide-branching currents, timed crossings, then combined gates/branches/timing.
  Include reproducible optimal solution traces; use slack 2 for levels 1–2, 1
  for 3–6, and 0 for 7–8; target optimal lengths 2–4 for levels 1–3 and up to
  10 for level 8, with budgets at most 12. No level is wait-only; levels 3+
  include a preview-visible tempting wrong move.
- **Delivery/accessibility targets:** Latest stable Chrome, Edge, Firefox, and
  Safari (macOS and iOS), opening `index.html` via `file://` offline. Target
  360×640, 768×1024, 1280×720, and 1920×1080 viewports, no horizontal scroll,
  board visible without page scrolling, and usability at 200% zoom/320 px.
  Support keyboard-only play, visible focus, labeled moon stations, text and
  non-color state cues, WCAG 2.2 AA contrast targets, at least 44×44 px targets,
  live turn descriptions, reduced-motion state equivalence, and zero network
  requests. Browser targets not actually exercised must be reported as
  unverified.
- **Scope:** This explicit approval authorizes implementation waves for #3–#12.
  Preserve direct-file offline delivery and the no-build/no-dependency scope;
  do not infer mechanics from concept art.

## Governance

- Humans retain final scope, design, publication, and merge decisions.
- Record accepted architecture here; proposals are not settled facts.
- Histories contain verified learning; decisions describe direction.
