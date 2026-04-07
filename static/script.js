/**
 * script.js  –  Tic Tac Toe Frontend
 *
 * Responsibilities:
 *  1. Start a new game when the page loads (or Reset is clicked)
 *  2. Send cell clicks to the Flask backend via fetch()
 *  3. Re-render the board and status based on the API response
 */

// ─────────────────────────────────────────────
// DOM References
// ─────────────────────────────────────────────
const cells      = document.querySelectorAll(".cell");   // All 9 board cells
const statusText = document.getElementById("status-text");
const statusBar  = document.querySelector(".status-bar");
const resetBtn   = document.getElementById("reset-btn");
const indX       = document.getElementById("indicator-X");
const indO       = document.getElementById("indicator-O");


// ─────────────────────────────────────────────
// Start / Reset Game  →  POST /start-game
// ─────────────────────────────────────────────
async function startGame() {
  try {
    const response = await fetch("/start-game", { method: "POST" });
    const data     = await response.json();

    // Clear the board visually
    cells.forEach(cell => {
      cell.textContent = "";
      cell.className   = "cell";          // Remove x / o / taken / winner-cell classes
    });

    // Update UI from the fresh game state
    updateUI(data.game);

  } catch (err) {
    console.error("Could not start game:", err);
    statusText.textContent = "⚠ Server error. Is Flask running?";
  }
}


// ─────────────────────────────────────────────
// Make a Move  →  POST /make-move
// ─────────────────────────────────────────────
async function makeMove(row, col) {
  try {
    const response = await fetch("/make-move", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ row, col })    // Send { row, col } as JSON
    });

    const data = await response.json();

    if (!response.ok) {
      // e.g. cell already taken → server returns 400
      console.warn("Move rejected:", data.error);
      return;
    }

    // Update the whole board with the new state
    renderBoard(data.game.board);
    updateUI(data.game);

  } catch (err) {
    console.error("Move failed:", err);
  }
}


// ─────────────────────────────────────────────
// Render Board
// Re-paints every cell to match the server's board array
// ─────────────────────────────────────────────
function renderBoard(board) {
  cells.forEach(cell => {
    const r   = parseInt(cell.dataset.row);
    const c   = parseInt(cell.dataset.col);
    const val = board[r][c];              // "" | "X" | "O"

    if (val !== "") {
      const wasEmpty = cell.textContent === "";

      cell.textContent = val;
      cell.classList.add("taken", val.toLowerCase());

      // Trigger the pop animation only for newly placed marks
      if (wasEmpty) {
        cell.classList.remove("pop");
        void cell.offsetWidth;            // Force reflow to restart animation
        cell.classList.add("pop");
      }
    }
  });
}


// ─────────────────────────────────────────────
// Update UI  (status bar + player indicators)
// ─────────────────────────────────────────────
function updateUI(game) {
  const { status, current_player, winner } = game;

  // ── Status bar text & colour ──────────────
  statusBar.classList.remove("win", "draw");

  if (status === "win") {
    statusBar.classList.add("win");
    statusText.textContent = `🎉 Player ${winner} wins!`;
    highlightWinners(game.board, winner);

  } else if (status === "draw") {
    statusBar.classList.add("draw");
    statusText.textContent = "🤝 It's a draw!";

  } else {
    // Ongoing – show whose turn it is
    statusText.textContent = `Player ${current_player}'s turn`;
  }

  // ── Active player indicator ───────────────
  indX.classList.toggle("active", status === "ongoing" && current_player === "X");
  indO.classList.toggle("active", status === "ongoing" && current_player === "O");

  // ── Disable / enable cells ────────────────
  // If game is over, mark all unfilled cells as taken so they can't be clicked
  if (status !== "ongoing") {
    cells.forEach(cell => cell.classList.add("taken"));
  }
}


// ─────────────────────────────────────────────
// Highlight Winning Cells
// Checks all win patterns and lights up the matching cells
// ─────────────────────────────────────────────
function highlightWinners(board, winner) {
  // All possible winning combinations [row, col]
  const patterns = [
    [[0,0],[0,1],[0,2]],   // top row
    [[1,0],[1,1],[1,2]],   // mid row
    [[2,0],[2,1],[2,2]],   // bot row
    [[0,0],[1,0],[2,0]],   // left col
    [[0,1],[1,1],[2,1]],   // mid col
    [[0,2],[1,2],[2,2]],   // right col
    [[0,0],[1,1],[2,2]],   // diagonal ↘
    [[0,2],[1,1],[2,0]]    // diagonal ↙
  ];

  for (const pattern of patterns) {
    const isWinner = pattern.every(([r, c]) => board[r][c] === winner);

    if (isWinner) {
      // Find and highlight those 3 cells
      pattern.forEach(([r, c]) => {
        const cell = document.querySelector(
          `.cell[data-row="${r}"][data-col="${c}"]`
        );
        if (cell) cell.classList.add("winner-cell");
      });
      break;   // Only one winning line possible
    }
  }
}


// ─────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────

// Cell click → make move
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    // Ignore click if cell is already taken
    if (cell.classList.contains("taken")) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    makeMove(row, col);
  });
});

// Reset button click
resetBtn.addEventListener("click", startGame);


// ─────────────────────────────────────────────
// Initialise: start a fresh game when page loads
// ─────────────────────────────────────────────
startGame();
