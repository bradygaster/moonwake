# Moonwake's Squad

[Squad](https://github.com/github/squad) **2.0.0-preview.4** was the latest 2.0
preview when initialized on 2026-11-10. It is contributor tooling, not a game
dependency; Moonwake remains concept-only.

## Team

The **Avatar: The Last Airbender** cast fits the water-and-moon puzzle theme.
These are collaborator identities, not franchise content for the game.

| Member | Responsibility |
|--------|----------------|
| Iroh | Lead: scope, architecture, contracts, review |
| Katara | Deterministic simulation, preview, undo/restart |
| Sokka | Puzzle rules, solvability, teaching progression |
| Aang | HTML/CSS/SVG board and accessible interaction |
| Toph | Regressions, replay, offline/accessibility verification |
| Scribe | Merge accepted durable decisions silently |
| Ralph | Monitor/route work only when requested |
| Rai | Bounded responsible-AI advisory review or selected gate |
| Fact Checker | Bounded claim verification or selected gate |

Roster, routing, populated charters, and project histories live in `.squad/`.
Support identities keep their official Squad names.

## After merging

1. Install **2.0.0-preview.4** on each contributor machine following the official
   [installation](https://github.com/github/squad/blob/v2.0.0-preview.4/docs/src/content/docs/get-started/installation.md)
   or [standalone](https://github.com/github/squad/blob/v2.0.0-preview.4/docs/src/content/docs/features/standalone-install.md)
   guide. The npm-free macOS/Linux route:

   ```sh
   curl -fsSL https://raw.githubusercontent.com/github/squad/v2.0.0-preview.4/scripts/install.sh -o /tmp/squad-install.sh
   VERSION=v2.0.0-preview.4 PREFIX="$HOME/.local" sh /tmp/squad-install.sh
   export PATH="$HOME/.local/bin:$PATH"
   ```

   The installer verifies the archive SHA-256. Windows users can download the
   matching archive and verify it against the release's `SHA256SUMS.txt`.
   No npm install or project package manifest is necessary.

2. Install/authenticate Copilot CLI separately, or use Copilot Chat in VS Code
   with Copilot access. `gh auth login` is needed only for GitHub operations.
   Run the pinned initializer once per machine from the repository root:

   ```sh
   squad init --no-workflows --state-backend local --no-vscode-default
   ```

   It is idempotent and preserves the populated team. It generates `.mcp.json`
   for that host with the installed executable. MCP files are gitignored because
   standalone initialization can write absolute machine paths. Inspect the
   generated local configuration before enabling it in your host: init also
   supplies an optional example GitHub MCP entry, unrelated to Squad state.
   Restart Copilot after initialization to load the local state bridge.

3. Verify and start:

   ```sh
   squad --version
   squad doctor
   squad health --json
   copilot --agent squad
   ```

   In VS Code select **Squad** in Copilot Chat; the generated workspace setting
   makes it the default chat mode. A bounded first task: "Iroh and Sokka, propose
   current-resolution rules and acceptance criteria; do not implement gameplay."

## Boundaries and maintenance

Initialization used `squad init --no-workflows --state-backend local`. Team state
is versioned; runtime logs, inboxes, and sessions are ignored. Casting
registry/history and their transaction marker must stay together.

The coordinator, skills, ceremonies, and templates are shipped by the pinned
release. `.squad/templates/workflows/` contains inert upstream templates, not
installed Actions. There is no `.github/workflows/`, Agentic Workflows installation,
schedule running in GitHub, auto-assignment, label creation, or autonomous watch
process. No secrets, workflow approvals, or repository settings changes are required.
Shipped ceremony policies remain unchanged; future Squad sessions can consult them.

For future upgrades, install the chosen CLI, inspect `squad upgrade --dry-run`,
and review proposed changes before applying. Upgrades may propose workflows;
preserve the no-workflows boundary unless the human explicitly requests automation.

README remains the product brief. Exact moon positions, turn budgets, current
rules, and level progression remain open. Team initialization is not authorization
to implement the game.
