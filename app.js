(function () {
  "use strict";

  const { createGame, getTide, isOpen, cellLabel } = window.Moonwake;
  const levels = window.MOONWAKE_LEVELS;
  const elements = {
    board: document.getElementById("board"),
    commit: document.getElementById("commit-button"),
    lesson: document.getElementById("lesson"),
    levelSelect: document.getElementById("level-select"),
    next: document.getElementById("next-button"),
    previewSummary: document.getElementById("preview-summary"),
    restart: document.getElementById("restart-button"),
    stations: document.getElementById("stations"),
    tideBadge: document.getElementById("tide-badge"),
    turnAnnouncement: document.getElementById("turn-announcement"),
    turnCounter: document.getElementById("turn-counter"),
    undo: document.getElementById("undo-button"),
    voyageNumber: document.getElementById("voyage-number"),
    voyageTitle: document.getElementById("voyage-title"),
  };

  let levelIndex = 0;
  let level = levels[levelIndex];
  let game = createGame(level);
  let selectedMoon = null;
  let preview = null;

  levels.forEach((voyage, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${String(index + 1).padStart(2, "0")} · ${voyage.title}`;
    elements.levelSelect.append(option);
  });

  function stationDescription(station) {
    return `Station ${station + 1} of 8, ${getTide(level, station)} tide`;
  }

  function directionArrow(direction) {
    return { north: "↑", east: "→", south: "↓", west: "←" }[direction] || "";
  }

  function positionText(position) {
    return cellLabel(level, position);
  }

  function describeTransition(result) {
    if (!result?.ok) return "That station is not available from the current moon position.";
    const state = result.state;
    const move = state.lastMove;
    const left = Math.max(0, level.budget - state.turns);
    let boatDescription = "The boat stays at " + positionText(move.from) + ".";
    if (move.from.row !== move.to.row || move.from.col !== move.to.col) {
      const direction = move.current ? `${move.current} to ` : "on to ";
      boatDescription = `The current carries the boat ${direction}${positionText(move.to)}.`;
    }
    if (state.status === "won") return `${stationDescription(state.moon)}. ${boatDescription} Harbor reached.`;
    if (state.status === "dawn") return `${stationDescription(state.moon)}. ${boatDescription} Dawn arrives; the voyage ends.`;
    return `${stationDescription(state.moon)}. ${boatDescription} ${left} ${left === 1 ? "turn" : "turns"} left.`;
  }

  function renderBoard() {
    const state = game.state;
    const shown = preview?.ok ? preview.state : state;
    const rows = level.map.length;
    const columns = level.map[0].length;
    elements.board.style.setProperty("--rows", rows);
    elements.board.style.setProperty("--columns", columns);
    elements.board.replaceChildren();

    level.map.forEach((row, rowIndex) => {
      [...row].forEach((kind, colIndex) => {
        const position = { row: rowIndex, col: colIndex };
        const open = isOpen(level, position, getTide(level, shown.moon));
        const current = level.currents?.[`${rowIndex},${colIndex}`]?.[getTide(level, shown.moon)];
        const boatHere = state.boat.row === rowIndex && state.boat.col === colIndex;
        const previewHere = preview?.ok && shown.boat.row === rowIndex && shown.boat.col === colIndex;
        const cell = document.createElement("div");
        const classes = ["cell", kind === "#" ? "island" : kind === "~" ? "tidal" : "water"];
        if (kind === "H") classes.push("harbor");
        if (kind === "~" && !open) classes.push("closed");
        if (previewHere && (shown.boat.row !== state.boat.row || shown.boat.col !== state.boat.col)) classes.push("preview-destination");
        cell.className = classes.join(" ");
        cell.setAttribute("role", "gridcell");

        const terrain = kind === "#" ? "island" : kind === "~" ? `tidal gate, ${open ? "open" : "closed"}` : kind === "H" ? "harbor" : "open water";
        const currentText = current ? `current ${current}` : "no current";
        const occupants = [
          boatHere ? "paper boat" : "",
          previewHere ? "preview boat destination" : "",
        ].filter(Boolean).join(", ");
        cell.setAttribute(
          "aria-label",
          `${positionText(position)}: ${terrain}; ${currentText}${occupants ? `; ${occupants}` : ""}`,
        );

        if (kind === "H") {
          cell.insertAdjacentHTML("beforeend", '<span class="harbor-mark" aria-hidden="true">⚓</span><span class="cell-caption">HARBOR</span>');
        } else if (kind === "#") {
          cell.insertAdjacentHTML("beforeend", '<span class="island-mark" aria-hidden="true">▲</span>');
        } else if (kind === "~") {
          cell.insertAdjacentHTML("beforeend", '<span class="gate-mark" aria-hidden="true">≋</span><span class="cell-caption">GATE</span>');
        }

        if (current) {
          const arrow = document.createElement("span");
          arrow.className = "current-arrow";
          arrow.setAttribute("aria-hidden", "true");
          arrow.textContent = directionArrow(current);
          cell.append(arrow);
        }
        if (boatHere) {
          cell.insertAdjacentHTML(
            "beforeend",
            '<svg class="boat-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 20h24l-4 7H9z" fill="#fff4d5" stroke="#173c58" stroke-width="1.5"/><path d="M15 5v14l9-3z" fill="#e66e4f" stroke="#173c58" stroke-width="1.5"/><path d="M7 29h18" stroke="#173c58" stroke-width="1.5" stroke-linecap="round"/></svg>',
          );
        }
        if (previewHere) {
          const marker = document.createElement("span");
          marker.className = "preview-boat";
          marker.setAttribute("aria-hidden", "true");
          marker.textContent = "◇";
          cell.append(marker);
        }
        elements.board.append(cell);
      });
    });
  }

  function renderStations() {
    const state = game.state;
    const focusedStation = document.activeElement?.dataset?.station;
    elements.stations.replaceChildren();
    for (let station = 0; station < 8; station += 1) {
      const button = document.createElement("button");
      const isCurrent = station === state.moon;
      const isSelected = station === selectedMoon;
      button.type = "button";
      button.className = `station ${isCurrent ? "current-station" : ""} ${isSelected ? "selected-station" : ""}`;
      button.dataset.station = String(station);
      button.disabled = state.status !== "playing" || !window.Moonwake.canMove(state, station);
      button.setAttribute("aria-label", `${stationDescription(station)}${isCurrent ? ", current position" : ""}${station === state.moon ? ", wait" : ""}`);
      if (isCurrent) button.setAttribute("aria-current", "step");
      button.innerHTML = `<span class="station-number">${station + 1}</span><span class="station-tide">${getTide(level, station) === "high" ? "H" : "L"}</span>`;
      button.addEventListener("click", () => selectStation(station));
      elements.stations.append(button);
    }
    if (focusedStation !== undefined) {
      elements.stations.querySelector(`[data-station="${focusedStation}"]`)?.focus();
    }
  }

  function render() {
    const state = game.state;
    elements.voyageNumber.textContent = `Voyage ${String(levelIndex + 1).padStart(2, "0")} of ${levels.length}`;
    elements.voyageTitle.textContent = level.title;
    elements.lesson.textContent = level.lesson;
    const displayedTide = getTide(level, preview?.ok ? preview.state.moon : state.moon);
    elements.tideBadge.textContent = preview ? `Preview: ${displayedTide} tide` : `${displayedTide} tide`;
    elements.tideBadge.className = `tide-badge ${displayedTide}`;
    elements.turnCounter.textContent = `${Math.max(0, level.budget - state.turns)} turns left`;
    elements.turnCounter.setAttribute("aria-label", `${Math.max(0, level.budget - state.turns)} turns remaining`);
    elements.undo.disabled = !game.canUndo;
    elements.commit.disabled = !preview?.ok || state.status !== "playing";
    elements.commit.textContent = selectedMoon === state.moon ? "Commit wait" : "Commit lunar move";
    elements.next.hidden = state.status !== "won" || levelIndex === levels.length - 1;
    elements.levelSelect.value = String(levelIndex);
    elements.previewSummary.textContent = preview ? describeTransition(preview) : "Choose a station to read the water before you move.";
    renderStations();
    renderBoard();
  }

  function selectStation(station) {
    selectedMoon = station;
    preview = game.preview(station);
    render();
  }

  function focusAfterTurn(state) {
    if (state.status === "playing") {
      elements.stations.querySelector(`[data-station="${state.moon}"]`)?.focus();
    } else if (state.status === "won" && !elements.next.hidden) {
      elements.next.focus();
    } else if (game.canUndo) {
      elements.undo.focus();
    } else {
      elements.restart.focus();
    }
  }

  function loadLevel(index, announcement) {
    levelIndex = index;
    level = levels[levelIndex];
    game = createGame(level);
    selectedMoon = null;
    preview = null;
    render();
    if (announcement) elements.turnAnnouncement.textContent = announcement;
  }

  elements.commit.addEventListener("click", () => {
    if (selectedMoon === null) return;
    const result = game.commit(selectedMoon);
    if (!result.ok) return;
    const summary = describeTransition(result);
    selectedMoon = null;
    preview = null;
    render();
    focusAfterTurn(result.state);
    elements.turnAnnouncement.textContent = summary;
  });

  elements.undo.addEventListener("click", () => {
    if (!game.undo()) return;
    selectedMoon = null;
    preview = null;
    render();
    const state = game.state;
    if (state.status === "playing") {
      elements.stations.querySelector(`[data-station="${state.moon}"]`)?.focus();
    } else if (game.canUndo) {
      elements.undo.focus();
    } else {
      elements.restart.focus();
    }
    elements.turnAnnouncement.textContent = `Turn undone. ${game.state.turns} of ${level.budget} turns used.`;
  });

  elements.restart.addEventListener("click", () => {
    game.restart();
    selectedMoon = null;
    preview = null;
    render();
    elements.turnAnnouncement.textContent = `${level.title} restarted. ${level.budget} turns available.`;
  });

  elements.next.addEventListener("click", () => {
    if (levelIndex < levels.length - 1) {
      loadLevel(levelIndex + 1, `Voyage ${levelIndex + 2}: ${levels[levelIndex + 1].title}.`);
      elements.levelSelect.focus();
    }
  });

  elements.levelSelect.addEventListener("change", (event) => {
    const index = Number(event.target.value);
    loadLevel(index, `Voyage ${index + 1}: ${levels[index].title}.`);
  });

  render();
})();
