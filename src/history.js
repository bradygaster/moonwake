// Undo/restart history for a voyage. Rule-agnostic: it stores whole committed
// states (moon, tide/channels, boat, turn/budget, outcome) produced by the
// simulation and never computes them. Previews must not call commit().
(function (root) {
  "use strict";

  function clone(value) {
    if (value === null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(clone);
    var copy = {};
    Object.keys(value).forEach(function (key) {
      copy[key] = clone(value[key]);
    });
    return copy;
  }

  function createHistory(initialState) {
    var initial = clone(initialState);
    var states = [clone(initial)];

    return {
      current: function () {
        return clone(states[states.length - 1]);
      },
      // Records the state resulting from a committed turn.
      commit: function (nextState) {
        states.push(clone(nextState));
        return this.current();
      },
      canUndo: function () {
        return states.length > 1;
      },
      // Reverts one committed turn; works from terminal states too.
      undo: function () {
        if (states.length > 1) states.pop();
        return this.current();
      },
      // Returns to the voyage's initial state and clears history.
      restart: function () {
        states = [clone(initial)];
        return this.current();
      },
      depth: function () {
        return states.length - 1;
      }
    };
  }

  var api = { createHistory: createHistory };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MoonwakeHistory = api;
})(typeof self !== "undefined" ? self : this);
