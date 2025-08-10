const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BASE_URL = 'http://localhost:3000';

async function newGame(n, mines) {
  const res = await fetch(`${BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ n: parseInt(n), mines: parseInt(mines) })
  });
  const data = await res.json();
  console.log('=== New Game Created ===');
  console.log('Game ID:', data.gameId);
  printGrid(data.grid);
}

async function showGame(gameId) {
  const res = await fetch(`${BASE_URL}/games/${gameId}`);
  
  if (!res.ok) {
    console.error(`Game with ID "${gameId}" was not found.`);
    return;
  }

  const { status, grid } = await res.json();

  if (!grid) {
    console.error(`Game with ID "${gameId}" was not found or the data is empty.`);
    return;
  }

  console.log(`=== Game Status: ${status} ===`);
  printGrid(grid);
}

async function revealCell(gameId, row, col) {
  const res = await fetch(`${BASE_URL}/games/${gameId}/reveal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ row: parseInt(row), col: parseInt(col) })
  });
  const data = await res.json();
  if (data.error) {
    console.error('Error:', data.error);
    return;
  }
  console.log(`=== Game Status: ${data.status} ===`);
  printGrid(data.grid);
}

function printGrid(grid) {
  for (const row of grid) {
    console.log(row.join(' '));
  }
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === 'new') {
    if (args.length < 2) return console.log('Usage: node play.js new <n> <mines>');
    await newGame(args[0], args[1]);
  } else if (cmd === 'show') {
    if (args.length < 1) return console.log('Usage: node play.js show <gameId>');
    await showGame(args[0]);
  } else if (cmd === 'reveal') {
    if (args.length < 3) return console.log('Usage: node play.js reveal <gameId> <row> <col>');
    await revealCell(args[0], args[1], args[2]);
  } else {
    console.log('Commands:');
    console.log('  node play.js new <n> <mines>   # create new game');
    console.log('  node play.js show <gameId>     # show current game grid');
    console.log('  node play.js reveal <gameId> <row> <col>   # reveal a cell');
  }
}

main();
