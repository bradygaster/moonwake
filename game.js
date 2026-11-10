(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.Moonwake = api;
  }
})(typeof globalThis === "undefined" ? this : globalThis, function () {
  "use strict";

  const DIRECTIONS = {
    north: [-1, 0],
    east: [0, 1],
    south: [1, 0],
    west: [0, -1],
  };

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function assertLevel(level) {
    if (!level || !Array.isArray(level.map) || !Array.isArray(level.tides)) {
      throw new TypeError("A level must define a map and eight station tides.");
    }
    if (level.tides.length !== 8 || level.tides.some((tide) => !["low", "high"].includes(tide))) {
      throw new TypeError("Each level must define eight low/high station tides.");
    }
    if (!Number.isInteger(level.budget) || level.budget < 1) {
      throw new TypeError("A level must have a positive turn budget.");
    }
    if (!level.map.length || level.map.some((row) => row.length !== level.map[0].length)) {
      throw new TypeError("A level map must be a non-empty rectangle.");
    }
    if (!Number.isInteger(level.initialMoon) || level.initialMoon < 0 || level.initialMoon > 7) {
      throw new TypeError("A level must start at one of the eight moon stations.");
    }
    if (level.map.some((row) => [...row].some((cell) => ![".", "~", "H", "#"].includes(cell)))) {
      throw new TypeError("A level map contains an unknown cell type.");
    }
    const harbors = [];
    level.map.forEach((row, rowIndex) => {
      [...row].forEach((cell, colIndex) => {
        if (cell === "H") harbors.push({ row: rowIndex, col: colIndex });
      });
    });
    if (harbors.length !== 1) {
      throw new TypeError("A level must contain exactly one harbor.");
    }
    if (
      level.harbor &&
      (level.harbor.row !== harbors[0].row || level.harbor.col !== harbors[0].col)
    ) {
      throw new TypeError("The declared harbor must match the map.");
    }
    if (!level.start || !isOpen(level, level.start, getTide(level, level.initialMoon))) {
      throw new TypeError("The boat must start on an open cell.");
    }
    for (const currents of Object.values(level.currents || {})) {
      if (Object.values(currents).some((direction) => direction !== null && !DIRECTIONS[direction])) {
        throw new TypeError("Currents must use a supported direction or remain still.");
      }
    }
  }

  function inBounds(level, position) {
    return (
      Number.isInteger(position.row) &&
      Number.isInteger(position.col) &&
      position.row >= 0 &&
      position.row < level.map.length &&
      position.col >= 0 &&
      position.col < level.map[0].length
    );
  }

  function isOpen(level, position, tide) {
    if (!inBounds(level, position)) return false;
    const cell = level.map[position.row][position.col];
    return cell !== "#" && (cell !== "~" || tide === "high");
  }

  function getTide(level, moon) {
    return level.tides[moon];
  }

  function canMove(state, nextMoon) {
    if (state.status !== "playing" || !Number.isInteger(nextMoon) || nextMoon < 0 || nextMoon > 7) {
      return false;
    }
    const distance = Math.abs(state.moon - nextMoon);
    return distance === 0 || distance === 1 || distance === 7;
  }

  function initialState(level) {
    assertLevel(level);
    return {
      moon: level.initialMoon,
      boat: copy(level.start),
      turns: 0,
      status: "playing",
      result: "ready",
      lastMove: null,
    };
  }

  function transition(level, state, nextMoon) {
    assertLevel(level);
    if (!canMove(state, nextMoon)) {
      return { ok: false, reason: state.status === "playing" ? "illegal-move" : "terminal", state: copy(state) };
    }

    const next = copy(state);
    const from = copy(state.boat);
    next.moon = nextMoon;
    next.turns += 1;
    const tide = getTide(level, nextMoon);
    const key = `${state.boat.row},${state.boat.col}`;
    const current = level.currents?.[key]?.[tide] || null;
    let destination = from;
    if (current) {
      const [rowDelta, colDelta] = DIRECTIONS[current];
      const candidate = { row: from.row + rowDelta, col: from.col + colDelta };
      if (isOpen(level, candidate, tide)) destination = candidate;
    }
    next.boat = copy(destination);
    next.status = level.map[destination.row][destination.col] === "H" ? "won" : "playing";
    if (next.status === "won") {
      next.result = "harbor";
    } else if (next.turns >= level.budget) {
      next.status = "dawn";
      next.result = "dawn";
    } else {
      next.result = destination.row === from.row && destination.col === from.col ? "stayed" : current;
    }
    next.lastMove = {
      moon: nextMoon,
      tide,
      from,
      to: copy(destination),
      current,
      outcome: next.result,
    };
    return { ok: true, state: next };
  }

  function createGame(level) {
    const start = initialState(level);
    let state = copy(start);
    let history = [];

    return {
      get state() {
        return copy(state);
      },
      preview(nextMoon) {
        return transition(level, state, nextMoon);
      },
      commit(nextMoon) {
        const result = transition(level, state, nextMoon);
        if (result.ok) {
          history.push(copy(state));
          state = result.state;
        }
        return result;
      },
      undo() {
        if (!history.length) return false;
        state = history.pop();
        return true;
      },
      restart() {
        state = copy(start);
        history = [];
        return copy(state);
      },
      get canUndo() {
        return history.length > 0;
      },
    };
  }

  function cellLabel(level, position) {
    const letter = String.fromCharCode(65 + position.col);
    return `${letter}${position.row + 1}`;
  }

  return {
    DIRECTIONS,
    assertLevel,
    canMove,
    cellLabel,
    createGame,
    getTide,
    inBounds,
    initialState,
    isOpen,
    transition,
  };
});
