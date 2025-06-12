import { Gameboard } from './gameboard.js';
import { Ship } from './ship.js';

export class Player {
  constructor(playerName) {
    this.playerName = playerName;
    this.isComputer = false;
    this.gameboard = new Gameboard();
  }
}

// const allComputerCells = document.querySelectorAll('#grid-player-two>.cell');
// allComputerCells.forEach((cell) => {
//   cell.addEventListener('click', (e) => {
//     const coord = [cell.dataset.row, cell.dataset.col];
//     console.log(coord);
//     playerTwo.gameboard.receiveAttack(coord);
//     playerTwo.gameboard.board = playerTwo.gameboard.refreshBoard();
//   });
// });
