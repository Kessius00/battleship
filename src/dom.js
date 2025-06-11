import { Player } from './player.js';
import { Ship } from './ship.js';

const playerOne = new Player('Kes');
const playerTwo = new Player('Wouter');

const gridOneContainer = document.getElementById('grid-player-one');
const gridTwoContainer = document.getElementById('grid-player-two');

export function fillGridContainer(board, gridContainer) {
  const fragment = document.createDocumentFragment();
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // Use empty strings for nullish values to ensure the cell displays nothing instead of "null" or "undefined".
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = board[row][col] ?? '';
      cell.dataset.row = row;
      cell.dataset.col = col;
      fragment.appendChild(cell);
    }
  }
  gridContainer.appendChild(fragment);
}
const ship1 = new Ship(4);
ship1.fillShipCoordinates([3, 2]);
playerOne.gameboard.placeInShips(ship1);

fillGridContainer(playerOne.gameboard.refreshBoard(), gridOneContainer);
fillGridContainer(playerTwo.gameboard.refreshBoard(), gridTwoContainer);

const container = document.querySelector('.container');

const titleFight = document.createElement('h1');
titleFight.textContent = `${playerOne.playerName} vs ${playerTwo.playerName}`;

container.appendChild(titleFight);
// for (let row = 0; row < board.length; row++) {
//   for (let col = 0; col < board[row].length; col++) {
//     const cell = document.createElement('div');
//     cell.className = 'cell';
//     cell.dataset.row = row;
//     cell.dataset.col = col;
//     cell.textContent = board[row][col] ?? ''; // if null, show empty
//     gridContainer.appendChild(cell);
//   }
// }
