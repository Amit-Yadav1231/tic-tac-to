# 🎮 Tic Tac Toe — Flask + Vanilla JS

A clean, beginner-friendly Tic Tac Toe game built with:
- **Backend** → Python + Flask (REST API)
- **Frontend** → HTML, CSS, JavaScript (no frameworks)

---

## 📁 Project Structure

```
tic-tac-toe/
├── app.py                  ← Flask server + game logic
├── requirements.txt        ← Python dependencies
├── templates/
│   └── index.html          ← Game UI (structure)
└── static/
    ├── style.css           ← All styling & animations
    └── script.js           ← Frontend logic + API calls
```

---

## 🚀 How to Run Locally

### Step 1 — Make sure Python is installed
```bash
python --version   # Should be 3.7+
```

### Step 2 — Create a virtual environment (recommended)
```bash
# Create the environment
python -m venv venv

# Activate it
# On macOS / Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3 — Install Flask
```bash
pip install -r requirements.txt
```

### Step 4 — Run the Flask server
```bash
python app.py
```
You'll see output like:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Step 5 — Open the game
Visit **http://127.0.0.1:5000** in your browser. 🎉

---

## 🔌 API Endpoints

| Method | Endpoint       | Description                        |
|--------|----------------|------------------------------------|
| POST   | `/start-game`  | Resets the board, returns fresh state |
| POST   | `/make-move`   | Body: `{ row, col }` — places mark, returns updated state |

### Sample `/make-move` Request
```json
POST /make-move
Content-Type: application/json

{ "row": 1, "col": 2 }
```

### Sample Response
```json
{
  "message": "Move accepted.",
  "game": {
    "board": [["", "", ""], ["", "", "X"], ["", "", ""]],
    "current_player": "O",
    "status": "ongoing",
    "winner": null
  }
}
```

---

## 🎯 Game Rules
- X always goes first
- Players alternate turns
- First to fill a row, column, or diagonal wins
- If all 9 cells fill with no winner → Draw

---

## 🛑 To Stop the Server
Press `Ctrl + C` in the terminal.
