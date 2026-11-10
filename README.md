# Moonwake

**Move the moon. Change the sea. Bring a little boat home.**

Moonwake is a turn-based tidal puzzle game made entirely with HTML, CSS, and vanilla JavaScript. No dependencies, no build step, no backend.

![Moonwake concept illustration: a paper boat follows engraved currents through a layered blue archipelago toward a lantern-lit harbor beneath a movable moon.](art/moonwake-concept.svg)

*Original concept illustration, not a screenshot of a playable game.*

## The game

A paper boat is lost in an archipelago that changes with the tide. You cannot steer it directly. Instead, you move the moon around the islands, changing the water beneath it.

At low tide, sandbars emerge and narrow channels close. At high tide, hidden passages open, but currents can carry the boat past the harbor. Each lunar move advances the night. Find the sequence that brings your boat home before dawn.

The puzzle is not how quickly you react. It is knowing when to open a passage, when to let the current carry you, and when to wait.

## Play a voyage

1. **Read the water.** Study the boat, harbor, sandbars, and current markings on a small, single-screen island map.
2. **Preview a lunar move.** Choose the moon's next position and see the resulting tide, open channels, and boat route before committing.
3. **Let the sea move you.** Advance one turn: the tide changes and the boat follows the indicated current.
4. **Reach the lantern.** Enter the harbor before the turn budget runs out.

The moon circles eight labeled stations. On a turn, move one station clockwise or counterclockwise, or wait. Each station sets a fixed high or low tide. The boat reads the current on its own cell for the new tide and moves exactly one cell if the destination is open. Closed tidal cells block entry but do not trap a boat already there. Preview uses the same deterministic transition as commit. Unlimited undo and restart support experimentation.

Win by entering the harbor, including on the final turn. Otherwise, when the turn budget expires, dawn ends the voyage. Eight handcrafted voyages introduce still currents, turn budgets, low- and high-tide gates, waiting, tide-dependent currents, timed crossings, and combinations of those rules.

Open `index.html` directly in a modern browser. Use the labeled station buttons to preview, then commit a lunar move. The voyage selector lets you replay any level; after a win, continue to the next voyage.

## A world made of paper and water

Imagine a miniature nautical theater viewed from above:

- Broad layers of cobalt and sea-green paper form the water, with exposed edges giving the tide a visible depth.
- Ochre islands sit above shallow turquoise shelves; low tide reveals pale sandbar bridges.
- Fine, engraved-looking lines show current direction. Arrowheads and patterns communicate the rules alongside color.
- A small folded boat with a vermilion pennant travels toward an amber harbor lantern.
- An ivory moon travels along a dotted orbital track framing the map. Its position is both the main control and the explanation for the changing sea.

The board is the first thing you see, not an illustration behind a menu. The memorable moment: moving the moon changes the water beneath the boat, exposing a sandbar or passage that redirects its route.

This imagery can be drawn with inline SVG and CSS. No downloaded textures, external fonts, image services, or graphics libraries are needed. Motion would clarify each turn, with a reduced-motion alternative that updates the same state immediately.

## Built for the browser

The implementation is deliberately small:

- **HTML** for the game shell, instructions, and accessible controls.
- **CSS** for the layered-paper world, responsive layout, and transitions.
- **Vanilla JavaScript** for the turn-based simulation, puzzle definitions, previews, and undo history.
- **Inline SVG** for the islands, moon, boat, current markings, and lanterns.

Open `index.html` directly and play without an installation or network connection. Keyboard-operable, labeled lunar positions, current arrows and patterns, and a live text description of each turn explain the puzzle without relying on animation or color alone. Reduced-motion preferences remove transitions without changing game state.

Run the focused simulation and puzzle checks with Node.js's built-in test runner:

```sh
node --test test/game.test.js
```

## Current status

**Playable first version.** Eight handcrafted voyages, the simulation, preview/commit, undo/restart, and the offline browser interface are included. The concept illustration remains original visual direction, not a screenshot of the game.

## Development team

The repository includes a project-specific [Squad team](docs/squad.md), using
Squad **2.0.0-preview.4** and an *Avatar: The Last Airbender* cast. Squad is
contributor tooling only; it adds no game dependencies or playable features.
