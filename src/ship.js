class Ship {
  constructor(length) {
    this.length = length;
    this.hitsTaken = null;
    this.sunk = false;
  }

  hit() {
    this.hitsTaken += 1;
    if (this.isSunk()) {
      this.sunk = true;
    }
  }

  isSunk() {
    return this.hitsTaken === this.length;
  }
}

export { Ship };
