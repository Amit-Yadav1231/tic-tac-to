
"""
app.py - Flask Backend for Tic Tac Toe
Run this file to start the web server.
"""

from flask import Flask, jsonify, render_template, request

# Initialize the Flask application
app = Flask(__name__)

# ─────────────────────────────────────────────
# Game State (stored in memory on the server)
# ─────────────────────────────────────────────
game_state = {
    "board": [["", "", ""], ["", "", ""], ["", "", ""]],  # 3x3 empty board
    "current_player": "X",   # X always goes first
    "status": "ongoing",     # "ongoing" | "win" | "draw"
    "winner": None           # None | "X" | "O"
}


# ─────────────────────────────────────────────
# Helper: Check for a winner
# ─────────────────────────────────────────────
def check_winner(board):
    """
    Checks all rows, columns, and diagonals for a winner.
    Returns "X", "O", or None.
    """
    # Check rows
    for row in board:
        if row[0] == row[1] == row[2] != "":
            return row[0]

    # Check columns
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != "":
            return board[0][col]

    # Check diagonals
    if board[0][0] == board[1][1] == board[2][2] != "":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != "":
        return board[0][2]

    return None  # No winner yet


# ─────────────────────────────────────────────
# Helper: Check for a draw
# ─────────────────────────────────────────────
def check_draw(board):
    """
    Returns True if all cells are filled and there's no winner.
    """
    for row in board:
        for cell in row:
            if cell == "":
                return False  # Found an empty cell → not a draw
    return True  # All cells filled → draw


# ─────────────────────────────────────────────
# Route: Serve the HTML page
# ─────────────────────────────────────────────
@app.route("/")
def index():
    """Serves the main game page."""
    return render_template("index.html")


# ─────────────────────────────────────────────
# API Route: Start / Reset the Game
# ─────────────────────────────────────────────
@app.route("/start-game", methods=["POST"])
def start_game():
    """
    Resets the game to its initial state.
    Returns the fresh game state as JSON.
    """
    global game_state

    game_state = {
        "board": [["", "", ""], ["", "", ""], ["", "", ""]],
        "current_player": "X",
        "status": "ongoing",
        "winner": None
    }

    return jsonify({
        "message": "Game started!",
        "game": game_state
    })


# ─────────────────────────────────────────────
# API Route: Make a Move
# ─────────────────────────────────────────────
@app.route("/make-move", methods=["POST"])
def make_move():
    """
    Accepts { row, col } in the request body.
    Places the current player's mark and checks game status.
    Returns the updated game state as JSON.
    """
    global game_state

    data = request.get_json()
    row = data.get("row")
    col = data.get("col")

    # ── Validation ──────────────────────────
    if row is None or col is None:
        return jsonify({"error": "Row and column are required."}), 400

    if not (0 <= row <= 2 and 0 <= col <= 2):
        return jsonify({"error": "Row and column must be between 0 and 2."}), 400

    if game_state["status"] != "ongoing":
        return jsonify({"error": "Game is already over. Please start a new game."}), 400

    if game_state["board"][row][col] != "":
        return jsonify({"error": "Cell is already taken."}), 400

    # ── Place the mark ──────────────────────
    game_state["board"][row][col] = game_state["current_player"]

    # ── Check game result ───────────────────
    winner = check_winner(game_state["board"])

    if winner:
        game_state["status"] = "win"
        game_state["winner"] = winner
    elif check_draw(game_state["board"]):
        game_state["status"] = "draw"
    else:
        # Switch player: X → O, O → X
        game_state["current_player"] = "O" if game_state["current_player"] == "X" else "X"

    return jsonify({
        "message": "Move accepted.",
        "game": game_state
    })


# ─────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────
if __name__ == "__main__":
    # debug=True enables auto-reload when you edit the code
    app.run(debug=True)
