class Game {
  constructor(n = 8, mines = 10, mineCoords = null) {
    if (!Number.isInteger(n) || n <= 0) throw new Error('n must be a positive integer');
    if (!Number.isInteger(mines) || mines < 0 || mines >= n * n) throw new Error('mines must be 0 <= mines < n*n');
    this.n = n;
    this.mines = mines;
    this.board = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => ({ mine: false, adj: 0, revealed: false }))
    );

    if (Array.isArray(mineCoords)) {
      if (mineCoords.length !== mines) throw new Error('mineCoords length must equal mines');
      for (const { r, c } of mineCoords) this._placeMine(r, c);
    } else {
      this._placeMinesRandomly();
    }

    this._computeAdj();
    this.revealedCount = 0;
    this.total = n * n;
    this.lost = false;
  }

  _placeMine(r, c) {
    if (r < 0 || r >= this.n || c < 0 || c >= this.n) throw new Error('invalid mine coords');
    if (this.board[r][c].mine) return false;
    this.board[r][c].mine = true;
    return true;
  }

  _placeMinesRandomly() {
    let placed = 0;
    while (placed < this.mines) {
      const r = Math.floor(Math.random() * this.n);
      const c = Math.floor(Math.random() * this.n);
      if (!this.board[r][c].mine) {
        this.board[r][c].mine = true;
        placed++;
      }
    }
  }

  _computeAdj() {
    for (let r = 0; r < this.n; r++) {
      for (let c = 0; c < this.n; c++) {
        if (this.board[r][c].mine) {
          this.board[r][c].adj = -1;
          continue;
        }
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const rr = r + dr,
              cc = c + dc;
            if (rr >= 0 && rr < this.n && cc >= 0 && cc < this.n && this.board[rr][cc].mine) cnt++;
          }
        }
        this.board[r][c].adj = cnt;
      }
    }
  }

  reveal(r, c) {
    if (!Number.isInteger(r) || !Number.isInteger(c)) throw new Error('row and col must be integers');
    if (r < 0 || r >= this.n || c < 0 || c >= this.n) throw new Error('coordinates out of bounds');
    const cell = this.board[r][c];
    if (cell.revealed) throw new Error('Cell already revealed');
    if (cell.mine) {
      cell.revealed = true;
      this.lost = true;
      // reveal all mines for user visibility on loss
      for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
          if (this.board[i][j].mine) this.board[i][j].revealed = true;
        }
      }
      return;
    }
    this._revealFlood(r, c);
  }

  _revealFlood(r, c) {
    const stack = [[r, c]];
    while (stack.length) {
      const [x, y] = stack.pop();
      const cell = this.board[x][y];
      if (cell.revealed) continue;
      cell.revealed = true;
      this.revealedCount++;
      if (cell.adj === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const rr = x + dr,
              cc = y + dc;
            if (rr >= 0 && rr < this.n && cc >= 0 && cc < this.n && !this.board[rr][cc].revealed) {
              if (!this.board[rr][cc].mine) stack.push([rr, cc]);
            }
          }
        }
      }
    }
  }

  isWon() {
    return this.revealedCount === this.total - this.mines && !this.lost;
  }

  getMaskedGrid(showMines = false) {
    const out = [];
    for (let r = 0; r < this.n; r++) {
      const row = [];
      for (let c = 0; c < this.n; c++) {
        const cell = this.board[r][c];
        if (cell.revealed) {
          if (cell.mine) row.push('*');
          else row.push(String(cell.adj));
        } else {
          if (showMines && cell.mine) row.push('*');
          else row.push('#');
        }
      }
      out.push(row);
    }
    return out;
  }
}

module.exports = Game;
