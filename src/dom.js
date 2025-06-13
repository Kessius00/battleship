import { Player } from './player.js';
import { Ship } from './ship.js';
import { AssemblyPhase, placeShipsOnGrid } from './assemblyPhase.js';

const computer = new Player('Computer');
const player = new Player('Kes');

computer.gameboard.computerPlaceRandomShips();
// console.log(computer.gameboard.ships);

const assemble = new AssemblyPhase(player);
assemble.addOrientationButtonListener();
assemble.enableShipHover();

const gridTwoContainer = document.getElementById('grid-player-two');
placeShipsOnGrid(computer, gridTwoContainer);

function playerChoice() {
  const gridTwoContainer = document.getElementById('grid-player-two');

  const cells = gridTwoContainer.querySelectorAll('.cell');
  cells.forEach((cell) => {
    const y = Number(cell.dataset.row);
    const x = Number(cell.dataset.col);

    cell.addEventListener('click', () => {
      // this.assemblyPlaceShip(cell);
      if (cell.hasAttribute('clicked')) {
        console.log('not possible!');
        return;
      }

      const didHit = computer.gameboard.receiveAttack([x, y]);
      if (didHit) {
        cell.classList.add('preview-red');
      } else {
        cell.classList.add('preview-green');
      }

      if (computer.gameboard.allShipsSunk()) {
        console.log('player wins!!!!');
      }

      cell.setAttribute('clicked', 'true');

      return;
    });
  });
}

function computerChoice(unavailableCells) {
  const gridOneContainer = document.getElementById('grid-player-one');

  let randX = Math.floor(Math.random() * 10);
  let randY = Math.floor(Math.random() * 10);
  let cell = gridOneContainer.querySelector(
    `div.cell[data-row="${randY}"][data-col="${randX}"]`
  );

  while (cell.hasAttribute('clicked')) {
    randX = Math.floor(Math.random() * 10);
    randY = Math.floor(Math.random() * 10);
    cell = gridOneContainer.querySelector(
      `div.cell[data-row="${randY}"][data-col="${randX}"]`
    );
  }

  if (cell) {
    let hit = player.gameboard.receiveAttack([randX, randY]);
    cell.setAttribute('clicked', 'true');

    if (hit) {
      cell.classList.add(`preview-red`);
    } else {
      cell.classList.add(`preview-green`);
    }

    unavailableCells.push(cell);
    if (player.gameboard.allShipsSunk()) {
      console.log('computer wins!!!!');
    }
    return;
  }
}

function setupPlayerTurn() {
  const turnSign = document.querySelector('p.turn');
  turnSign.textContent = 'player turn';
  const cells = document.querySelectorAll('#grid-player-two .cell');
  cells.forEach((cell) => {
    cell.addEventListener('click', function handleClick() {
      if (cell.hasAttribute('clicked')) return;

      const y = Number(cell.dataset.row);
      const x = Number(cell.dataset.col);
      const hit = computer.gameboard.receiveAttack([x, y]);

      cell.classList.add(hit ? 'preview-red' : 'preview-green');
      cell.setAttribute('clicked', 'true');

      if (computer.gameboard.allShipsSunk()) {
        console.log('player wins!');
        return;
      }

      // Remove event listeners to avoid double clicks
      cells.forEach((c) => c.removeEventListener('click', handleClick));

      setTimeout(() => {
        computerTurn();
      }, 1000); // delay to simulate computer "thinking"
    });
  });
}

function computerTurn() {
  const cells = document.querySelectorAll('#grid-player-one .cell');
  let randCell;
  let randX, randY;

  do {
    randX = Math.floor(Math.random() * 10);
    randY = Math.floor(Math.random() * 10);
    randCell = document.querySelector(
      `#grid-player-one .cell[data-row="${randY}"][data-col="${randX}"]`
    );
  } while (randCell.hasAttribute('clicked'));

  const hit = player.gameboard.receiveAttack([randX, randY]);
  randCell.classList.add(hit ? 'preview-red' : 'preview-green');
  randCell.setAttribute('clicked', 'true');

  if (player.gameboard.allShipsSunk()) {
    console.log('computer wins!');
    return;
  }

  // Back to player
  setupPlayerTurn();
}

setupPlayerTurn();
