const express = require('express');
const Game = require('./game');

const app = express();
app.use(express.json());
app.use(express.text({ type: 'text/*' }));

const games = new Map();

// Counter untuk game ID sederhana
let gameCounter = 1;
function generateGameId() {
  return `G${gameCounter++}`;
}

/**
 * Create new game
 */
app.post('/games', (req, res) => {
  try {
    const { n, mines, mineCoords } = req.body;
    if (!Number.isInteger(n) || !Number.isInteger(mines)) {
      return res.status(400).json({ error: 'n and mines must be integers' });
    }
    if (mines >= n * n) {
      return res.status(400).json({ error: 'mines must be less than n*n' });
    }

    const game = new Game(n, mines, mineCoords);
    const id = generateGameId();
    games.set(id, game);

    res.json({ gameId: id, grid: game.getMaskedGrid() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Get game state
 */
app.get('/games/:id', (req, res) => {
  const game = games.get(req.params.id);
  if (!game) return res.status(404).json({ error: 'game not found' });
  res.json({
    status: game.lost ? 'lost' : game.isWon() ? 'won' : 'playing',
    grid: game.getMaskedGrid(game.lost),
  });
});

/**
 * Reveal a cell
 */
app.post('/games/:id/reveal', (req, res) => {
  const game = games.get(req.params.id);
  if (!game) return res.status(404).json({ error: 'game not found' });

  let row, col;
  if (
    typeof req.body === 'string' &&
    req.headers['content-type'] &&
    req.headers['content-type'].includes('text')
  ) {
    const parts = req.body.split(',').map((s) => s.trim());
    row = Number(parts[0]);
    col = Number(parts[1]);
  } else {
    row = req.body.row;
    col = req.body.col;
  }

  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    return res.status(400).json({ error: 'row and col must be integers' });
  }

  try {
    game.reveal(row, col);
    res.json({
      status: game.lost ? 'lost' : game.isWon() ? 'won' : 'playing',
      grid: game.getMaskedGrid(game.lost),
    });
  } catch (err) {
    if (err.message === 'Cell already revealed') {
      res.status(409).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Minesweeper API listening on port ${PORT}`));

module.exports = app;
