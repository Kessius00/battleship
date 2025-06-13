class Ship {
  constructor(length) {
    this.length = length;
    this.isHorizontal = false;
    this.shipCoords = [];

    this.hitCoords = [];
    this.hitsTaken = 0;

    this.sunk = false;
  }

  fillShipCoordinates(coords, isHorizontal = this.isHorizontal) {
    const [x, y] = coords;
    let coordinates = [];

    if (x < 0 || y < 0) {
      throw new Error('These coordinates are not possible (x < 0 or y < 0)');
    }

    if (isHorizontal) {
      for (let i = 0; i < this.length; i++) {
        coordinates.push([x + i, y]);
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        coordinates.push([x, y + i]);
      }
    }

    // do this at the start
    this.shipCoords = coordinates;
  }

  containsCoordinates(coords, coordList = this.shipCoords) {
    for (const shipCoord of coordList) {
      if (coords[0] === shipCoord[0] && coords[1] === shipCoord[1]) {
        return true;
      }
    }
    return false;
  }

  hit(coords) {
    if (!this.containsCoordinates(coords)) {
      throw new Error('The ship does not contain these coordinates');
    }

    if (this.containsCoordinates(coords, this.hitCoords)) {
      throw new Error('Location has already been hit!!!');
    }

    this.hitCoords.push(coords);
    this.hitsTaken += 1;

    if (this.isSunk()) {
      this.sunk = true;
    }
  }

  isSunk() {
    return this.hitsTaken === this.length;
  }

  constructShip([x, y], currentOrientation) {
    currentOrientation === 'horizontal'
      ? (this.isHorizontal = true)
      : (this.isHorizontal = false);

    this.fillShipCoordinates([x, y]);
  }
}

export { Ship };
