import { Gameboard } from './gameboard.js';
import { Ship } from './ship.js';
import { Player } from './player.js';

export function placeShipsOnGrid(player, container) {
  player.gameboard.ships.forEach((ship) => {
    ship.shipCoords.forEach(([x, y]) => {
      const cell = container.querySelector(
        `div.cell[data-row="${y}"][data-col="${x}"]`
      );

      if (cell) {
        cell.classList.add(`ship-color`);
      }
    });
  });
}

export class AssemblyPhase {
  constructor(player) {
    this.player = player;
    this.currentShipIndex = 0;
    this.currentOrientation = 'horizontal';
    this.gridAssembly = document.querySelector('#grid-assembly');
    this.assemblyBoard = new Gameboard();
  }

  switchOrientation() {
    this.currentOrientation =
      this.currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
  }

  toggleVertical() {
    const btnOrientation = document.querySelector('button.orientation');
    console.log('toggle vertical!');
    btnOrientation.textContent =
      btnOrientation.textContent === 'horizontal' ? 'vertical' : 'horizontal';
    this.switchOrientation();
  }

  addOrientationButtonListener() {
    const btnOrientation = document.querySelector('button.orientation');
    btnOrientation.addEventListener('click', () => this.toggleVertical());
  }

  assemblyPlaceShip(cell) {
    const y = Number(cell.dataset.row);
    const x = Number(cell.dataset.col);
    const ship = this.assemblyBoard.allShips()[this.currentShipIndex];
    ship.constructShip([x, y], this.currentOrientation);
    const valid = this.assemblyBoard.isShipLocationValid(ship);

    if (valid) {
      ship.shipCoords.forEach(([x, y]) => {
        const cell = this.gridAssembly.querySelector(
          `div.cell[data-row="${y}"][data-col="${x}"]`
        );
        if (cell) {
          cell.classList.add(`ship-color`);
        }
      });
      this.assemblyBoard.placeInShips(ship);
      this.currentShipIndex++;
      if (this.currentShipIndex === this.assemblyBoard.allShips().length) {
        this.finalizeAssembly();
      }
    }
  }
  //player is called here
  finalizeAssembly() {
    const gridOneContainer = document.getElementById('grid-player-one');

    this.player.gameboard = this.assemblyBoard;

    placeShipsOnGrid(this.player, gridOneContainer);
    console.log('hello');

    // randomize computer locations!

    const assemblyDiv = document.querySelector('div.assembly-phase-div');
    assemblyDiv.classList.add('hidden');
  }

  highlightPreviewCells(coords, color) {
    coords.forEach(([x, y]) => {
      const cell = this.gridAssembly.querySelector(
        `div.cell[data-row="${y}"][data-col="${x}"]`
      );
      if (cell) {
        cell.classList.add(`preview-${color}`);
      }
    });
  }

  clearPreviewCells() {
    this.gridAssembly
      .querySelectorAll('.preview-red, .preview-green')
      .forEach((cell) => {
        cell.classList.remove('preview-red', 'preview-green');
      });
  }

  enableShipHover() {
    const cells = this.gridAssembly.querySelectorAll('.cell');
    cells.forEach((cell) => {
      const y = Number(cell.dataset.row);
      const x = Number(cell.dataset.col);

      cell.addEventListener('mouseenter', (e) => {
        const ship = this.assemblyBoard.allShips()[this.currentShipIndex];
        ship.constructShip([x, y], this.currentOrientation);
        const valid = this.assemblyBoard.isShipLocationValid(ship);

        this.highlightPreviewCells(ship.shipCoords, valid ? 'green' : 'red');
      });
      cell.addEventListener('mouseleave', () => {
        this.clearPreviewCells();
      });

      cell.addEventListener('click', () => {
        this.assemblyPlaceShip(cell);
      });
    });
  }
}
