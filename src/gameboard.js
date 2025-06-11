function includesCoord(array, coord) {
  return array.some(([x, y]) => x === coord[0] && y === coord[1]);
}

export class Gameboard {
  constructor() {
    this.board = Array(10)
      .fill()
      .map(() => Array(10).fill(null));
    this.ships = new Array();
    this.missed = new Array();
  }

  isPlaceValid(shipObject) {
    if (shipObject.shipCoords.length === 0) {
      throw new Error('Errrr: new ship has no coordinates');
    }
    const x = shipObject.shipCoords[0][0];
    const y = shipObject.shipCoords[0][1];
    // Check boundaries
    if (shipObject.isHorizontal) {
      if (x + shipObject.length - 1 > 9) return false;
    } else {
      if (y + shipObject.length - 1 > 9) return false;
    }

    // check if this ship overlaps another
    for (let i = 0; i < shipObject.length; i++) {
      const checkX = shipObject.isHorizontal ? x + i : x;
      const checkY = shipObject.isHorizontal ? y : y + i;
      // for each coordinate of the new ship
      for (const ship of this.ships) {
        // go through all the ships on the board
        for (const shipLocation of ship.shipCoords) {
          // check if any ship already occupies that location
          if (shipLocation[0] === checkX && shipLocation[1] === checkY) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placeInShips(shipObject) {
    if (shipObject.shipCoords.length === 0) {
      throw new Error('Ship has no coordinates assigned to it.');
    }
    if (!this.isPlaceValid(shipObject)) {
      throw new Error('Place is invalid!!');
    }

    this.ships.push(shipObject);
  }

  receiveAttack(coords) {
    const [x, y] = coords;
    // within boundaries
    if (x > 9 || x < 0 || y > 9 || y < 0) {
      throw new Error('Coordinates are out of bounds (0-9)!');
    }
    if (includesCoord(this.missed, coords)) {
      throw new Error('missed spot is already hit!');
    }

    // test this part \/\/
    // if ship is hit
    for (const ship of this.ships) {
      if (includesCoord(ship.shipCoords, coords)) {
        if (includesCoord(ship.hitCoords, coords)) {
          throw new Error('Ship already hit in this spot!');
        }
        // is this all there is?
        ship.hit(coords);
        return;
      }
    }

    // if not hit, mark spot by '@'
    this.missed.push(coords);
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
}
