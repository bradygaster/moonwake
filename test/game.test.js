"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const Moonwake = require("../game.js");
const levels = require("../levels.js");

function solve(level, allowWait = true) {
  const start = Moonwake.initialState(level);
  const queue = [{ state: start, moves: [] }];
  const seen = new Set([`${start.moon}:${start.boat.row},${start.boat.col}:0`]);

  while (queue.length) {
    const current = queue.shift();
    for (let moon = 0; moon < 8; moon += 1) {
      if (!allowWait && moon === current.state.moon) continue;
      const result = Moonwake.transition(level, current.state, moon);
      if (!result.ok) continue;
      const moves = [...current.moves, moon];
      if (result.state.status === "won") return moves;
      if (result.state.status !== "playing") continue;
      const key = `${result.state.moon}:${result.state.boat.row},${result.state.boat.col}:${result.state.turns}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push({ state: result.state, moves });
      }
    }
  }
  return null;
}

test("moon stations wrap at either end and allow waiting", () => {
  assert.equal(Moonwake.canMove({ moon: 0, status: "playing" }, 7), true);
  assert.equal(Moonwake.canMove({ moon: 7, status: "playing" }, 0), true);
  assert.equal(Moonwake.canMove({ moon: 3, status: "playing" }, 3), true);
  assert.equal(Moonwake.canMove({ moon: 3, status: "playing" }, 5), false);
});

test("a tidal cell blocks entry at low tide but not departure when it closes", () => {
  const level = {
    map: [".~H"],
    start: { row: 0, col: 0 },
    initialMoon: 0,
    tides: ["low", "low", "low", "high", "low", "low", "low", "high"],
    budget: 4,
    currents: { "0,0": { low: "east", high: "east" }, "0,1": { low: "east", high: "east" } },
  };
  const initial = Moonwake.initialState(level);
  const blocked = Moonwake.transition(level, initial, 1);
  assert.deepEqual(blocked.state.boat, { row: 0, col: 0 });
  const entered = Moonwake.transition(level, initial, 7);
  assert.deepEqual(entered.state.boat, { row: 0, col: 1 });
  const departed = Moonwake.transition(level, entered.state, 0);
  assert.deepEqual(departed.state.boat, { row: 0, col: 2 });
  assert.equal(departed.state.status, "won");
});

test("preview is pure and committing its result produces the same state", () => {
  const game = Moonwake.createGame(levels[2]);
  const before = game.state;
  const preview = game.preview(1);
  assert.deepEqual(Moonwake.transition(levels[2], before, 1), preview);
  assert.deepEqual(game.state, before);
  assert.equal(game.canUndo, false);
  assert.equal(preview.ok, true);
  assert.deepEqual(game.commit(1).state, preview.state);
});

test("harbor arrival on the final turn wins before dawn; missing it fails at dawn", () => {
  const level = {
    map: [".H"],
    start: { row: 0, col: 0 },
    initialMoon: 0,
    tides: Array(8).fill("high"),
    budget: 1,
    currents: { "0,0": { high: "east" } },
  };
  const win = Moonwake.transition(level, Moonwake.initialState(level), 1);
  assert.equal(win.state.status, "won");
  assert.equal(win.state.result, "harbor");

  const miss = { ...level, currents: {} };
  const dawn = Moonwake.transition(miss, Moonwake.initialState(miss), 1);
  assert.equal(dawn.state.status, "dawn");
  assert.equal(dawn.state.result, "dawn");
  assert.equal(Moonwake.transition(miss, dawn.state, 1).reason, "terminal");
  const game = Moonwake.createGame(miss);
  game.commit(1);
  assert.equal(game.state.status, "dawn");
  assert.equal(game.undo(), true);
  assert.equal(game.state.status, "playing");
});

test("undo and restart restore complete state, including terminal outcomes", () => {
  const game = Moonwake.createGame(levels[0]);
  const start = game.state;
  game.commit(1);
  assert.equal(game.undo(), true);
  assert.deepEqual(game.state, start);
  assert.equal(game.canUndo, false);

  for (const moon of levels[0].solution) game.commit(moon);
  assert.equal(game.state.status, "won");
  assert.equal(game.restart().status, "playing");
  for (const moon of levels[0].solution) game.commit(moon);
  assert.equal(game.state.status, "won");
  assert.equal(game.undo(), true);
  assert.equal(game.state.status, "playing");
  assert.equal(game.restart().turns, 0);
  assert.equal(game.state.status, "playing");
  assert.equal(game.canUndo, false);
});

test("the fifth voyage requires waiting to preserve its high-tide route", () => {
  const optimal = solve(levels[4]);
  assert.ok(optimal);
  assert.equal(optimal.length, 3);
  assert.equal(solve(levels[4], false), null);
});

test("the same branching-current cell sends the boat in opposite directions by tide", () => {
  const start = Moonwake.initialState(levels[5]);
  const high = Moonwake.transition(levels[5], start, 1);
  const low = Moonwake.transition(levels[5], start, 0);
  assert.deepEqual(high.state.boat, { row: 2, col: 3 });
  assert.deepEqual(low.state.boat, { row: 2, col: 1 });
});

test("the seventh voyage crosses its gate at high tide and leaves as it closes", () => {
  const game = Moonwake.createGame(levels[6]);
  game.commit(1);
  game.commit(1);
  assert.deepEqual(game.state.boat, { row: 3, col: 2 });
  const departure = game.commit(2);
  assert.equal(departure.state.lastMove.tide, "low");
  assert.equal(departure.state.lastMove.current, "north");
  assert.deepEqual(departure.state.boat, { row: 2, col: 2 });
});

test("all eight handcrafted solutions are deterministic, optimal, and within budget", () => {
  assert.equal(levels.length, 8);
  for (const level of levels) {
    const optimal = solve(level);
    assert.ok(optimal, `level ${level.id} has a solution`);
    assert.equal(optimal.length, level.solution.length, `level ${level.id} solution is optimal`);
    assert.ok(level.budget <= 12, `level ${level.id} budget is at most 12`);
    assert.ok(level.budget >= optimal.length, `level ${level.id} fits its budget`);
    const slack = level.id <= 2 ? 2 : level.id <= 6 ? 1 : 0;
    assert.equal(level.budget, optimal.length + slack, `level ${level.id} follows the approved budget slack`);
    if (level.id <= 3) assert.ok(optimal.length >= 2 && optimal.length <= 4, `level ${level.id} has the approved short solution length`);
    assert.ok(level.solution.some((moon, index) => {
      const previous = index === 0 ? level.initialMoon : level.solution[index - 1];
      return moon !== previous;
    }), `level ${level.id} cannot be solved by waiting only`);

    const game = Moonwake.createGame(level);
    for (const moon of level.solution) {
      const preview = game.preview(moon);
      assert.equal(preview.ok, true, `level ${level.id} has a legal solution move`);
      assert.deepEqual(game.commit(moon).state, preview.state);
    }
    assert.equal(game.state.status, "won", `level ${level.id} solution reaches harbor`);
  }
});

test("progression includes the approved gate, wait, branch, and timed-crossing lessons", () => {
  assert.ok(levels[2].map.some((row) => row.includes("~")), "level 3 teaches a low-tide bar");
  assert.ok(levels[3].map.some((row) => row.includes("~")), "level 4 teaches a high-tide passage");
  assert.ok(levels[4].solution.some((moon, index, solution) => moon === solution[index - 1]), "level 5 requires waiting");
  assert.notEqual(levels[5].currents["2,2"].low, levels[5].currents["2,2"].high, "level 6 branches by tide");
  assert.ok(levels[6].map.some((row) => row.includes("~")), "level 7 includes a timed tidal crossing");
  assert.ok(levels[7].map.some((row) => row.includes("~")), "level 8 combines tidal crossings");
  assert.notEqual(levels[7].currents["3,4"].low, levels[7].currents["3,4"].high, "level 8 combines tide-branching currents");
  assert.equal(solve(levels[7]).length, 10, "level 8 fits the approved maximum optimal length");
});

test("each voyage from the third onward exposes a different preview from the optimal first move", () => {
  for (const level of levels.slice(2)) {
    const start = Moonwake.initialState(level);
    const optimal = Moonwake.transition(level, start, level.solution[0]).state;
    const alternatives = Array.from({ length: 8 }, (_, moon) => moon)
      .filter((moon) => moon !== level.solution[0])
      .map((moon) => Moonwake.transition(level, start, moon))
      .filter((result) => result.ok);
    assert.ok(
      alternatives.some((result) =>
        result.state.lastMove.tide !== optimal.lastMove.tide ||
        result.state.boat.row !== optimal.boat.row ||
        result.state.boat.col !== optimal.boat.col
      ),
      `level ${level.id} previews a distinct tempting alternative`,
    );
  }
});
