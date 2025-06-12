import { Ship } from './ship.js';

export class Gameboard {
  constructor() {
    this.board = Array(10)
      .fill()
      .map(() => Array(10).fill(null));
    this.ships = this.allShips();
    this.missed = new Array();
  }

  allShips() {
    let ships = [];
    const shipLength5 = new Ship(5);
    ships.push(shipLength5);

    const shipLength4 = new Ship(4);
    ships.push(shipLength4);

    for (let i = 0; i < 2; i++) {
      const shipLength3 = new Ship(3);
      ships.push(shipLength3);
    }
    for (let i = 0; i < 3; i++) {
      const shipLength2 = new Ship(2);
      ships.push(shipLength2);
    }
    // for (let i = 0; i < 4; i++) {
    //   const shipLength1 = new Ship(1);
    //   ships.push(shipLength1);
    // }
    return ships;
  }

  isLocationEmpty([x, y]) {
    // for each coordinate of the new ship
    for (const ship of this.ships) {
      // go through all the ships on the board
      ship.shipCoords.forEach((loc) => {
        // check if any ship already occupies that location
        if (loc[0] === x && loc[1] === y) {
          return false;
        }
      });
    }
    return true;
  }

  isShipLocationValid(shipObject) {
    if (shipObject.shipCoords.length === 0) {
      throw new Error('Errrr: new ship has no coordinates');
    }
    let locationValid = true;

    // overlapping other ships existing
    shipObject.shipCoords.forEach((coords) => {
      this.ships.forEach((ship) => {
        if (this.arrayIncludesCoordinate(ship.shipCoords, coords)) {
          locationValid = false;
        }
      });
    });

    let x = shipObject.shipCoords[0][0];
    let y = shipObject.shipCoords[0][1];

    // Check boundaries
    if (shipObject.isHorizontal) {
      if (x + shipObject.length - 1 > 9) return false;
    } else {
      if (y + shipObject.length - 1 > 9) return false;
    }

    return locationValid;
  }

  placeInShips(shipObject) {
    if (shipObject.shipCoords.length === 0) {
      throw new Error('Ship has no coordinates assigned to it.');
    }
    if (!this.isShipLocationValid(shipObject)) {
      throw new Error('Place is invalid!!');
    }

    this.ships.push(shipObject);
  }

  computerPlaceRandomShips() {
    this.allShips().forEach((ship) => {
      let placed = false;

      while (!placed) {
        const randX = Math.floor(Math.random() * 10);
        const randY = Math.floor(Math.random() * 10);
        const horizontal = Math.random() < 0.5 ? 'horizontal' : 'vertical'; // random orientation

        ship.constructShip([randX, randY], horizontal);

        const allValid = this.isShipLocationValid(ship);

        if (allValid) {
          this.placeInShips(ship);
          placed = true;
        }
      }
    });
  }

  receiveAttack([x, y]) {
    // within boundaries
    if (x > 9 || x < 0 || y > 9 || y < 0) {
      throw new Error('Coordinates are out of bounds (0-9)!');
    }
    if (this.arrayIncludesCoordinate(this.missed, [x, y])) {
      throw new Error('missed spot is already hit!');
    }

    // test this part \/\/
    // if ship is hit
    for (const ship of this.ships) {
      if (this.arrayIncludesCoordinate(ship.shipCoords, [x, y])) {
        if (this.arrayIncludesCoordinate(ship.hitCoords, [x, y])) {
          throw new Error('Ship already hit in this spot!');
        }
        // is this all there is?
        ship.hit([x, y]);
        // add hit class to cell!!!!!! HEREEEEEEE
        return;
      }
    }

    // if not hit, mark spot by '@'
    // MISSED CLASS TO CELL
    this.missed.push([x, y]);
  }

  allShipsSunk() {
    for (const ship of this.ships) {
      if (ship.sunk === false) {
        return false;
      }
    }
    return true;
  }

  refreshBoard() {
    // place ships
    let boardCopy = [...this.board];
    for (const ship of this.ships) {
      ship.shipCoords.forEach((shipSpot) => {
        boardCopy[shipSpot[0]][shipSpot[1]] = 'o';
      });
      ship.hitCoords.forEach((hittedSpot) => {
        //overwriting 'o'
        boardCopy[hittedSpot[0]][hittedSpot[1]] = 'x';
      });
    }

    // place dropped bombs
    this.missed.forEach((missedBombSpot) => {
      boardCopy[missedBombSpot[0]][missedBombSpot[1]] = '@';
    });
    return boardCopy;
  }

  arrayIncludesCoordinate(array, coord) {
    return array.some(([x, y]) => x === coord[0] && y === coord[1]);
  }
}
