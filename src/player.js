import { Gameboard } from './gameboard.js';
export class Player {
  constructor(playerName) {
    this.playerName = playerName;
    this.isComputer = false;
    this.gameboard = new Gameboard();
  }
}
