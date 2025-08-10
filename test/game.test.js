// __tests__/game.test.js
const Game = require('../src/game');

test('initialization with explicit mineCoords creates correct mine count', () => {
  const coords = [{ r: 0, c: 0 }, { r: 2, c: 2 }];
  const g = new Game(3, 2, coords);
  let count = 0;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (g.board[r][c].mine) count++;
  expect(count).toBe(2);
});

test('reveal out of bounds throws', () => {
  const g = new Game(3, 0, []);
  expect(() => g.reveal(-1, 0)).toThrow('coordinates out of bounds');
});

test('reveal a mine sets lost', () => {
  const g = new Game(2, 1, [{ r: 1, c: 1 }]);
  g.reveal(1, 1);
  expect(g.lost).toBe(true);
});

test('winning by revealing all non-mines', () => {
  const g = new Game(2, 1, [{ r: 0, c: 0 }]);
  // reveal the 3 non-mine cells
  g.reveal(0, 1);
  g.reveal(1, 0);
  g.reveal(1, 1);
  expect(g.isWon()).toBe(true);
});

test('prevent repeated selection', () => {
  const g = new Game(2, 0, []);
  g.reveal(0, 0);
  expect(() => g.reveal(0, 0)).toThrow('Cell already revealed');
});
