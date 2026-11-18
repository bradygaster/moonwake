// Run with: node checks/history.check.js (no dependencies or test runner).
"use strict";
var assert = require("assert");
var createHistory = require("../src/history.js").createHistory;

var start = {
  moon: 1, tide: "low", open: [false, true], boat: { x: 0, y: 0 },
  turn: 0, budget: 4, outcome: "playing"
};
var s1 = { moon: 2, tide: "high", open: [true, true], boat: { x: 1, y: 0 }, turn: 1, budget: 4, outcome: "playing" };
var s2 = { moon: 2, tide: "high", open: [true, true], boat: { x: 2, y: 0 }, turn: 2, budget: 4, outcome: "won" };

var h = createHistory(start);
assert.deepStrictEqual(h.current(), start);
assert.strictEqual(h.canUndo(), false);
assert.deepStrictEqual(h.undo(), start, "undo at turn 0 is a no-op");

h.commit(s1);
h.commit(s2);
assert.strictEqual(h.depth(), 2);

// Undo restores the exact prior state, also from a terminal outcome.
assert.deepStrictEqual(h.undo(), s1);
assert.deepStrictEqual(h.undo(), start);
assert.strictEqual(h.canUndo(), false);

// Restart returns to the initial state and clears history, after terminal too.
h.commit(s1);
h.commit(s2);
assert.deepStrictEqual(h.restart(), start);
assert.strictEqual(h.depth(), 0);
assert.strictEqual(h.canUndo(), false);

// Repeated sequences stay consistent.
for (var i = 0; i < 3; i++) {
  h.commit(s1);
  h.undo();
  h.commit(s1);
  h.commit(s2);
  assert.deepStrictEqual(h.restart(), start);
}

// Reading state without commit (preview) adds no history; snapshots are isolated.
var view = h.current();
view.boat.x = 99;
assert.deepStrictEqual(h.current(), start);
assert.strictEqual(h.depth(), 0);

console.log("history checks passed");
