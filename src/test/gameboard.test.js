import { Gameboard } from '../gameboard.js';
import { Ship } from '../ship.js';

describe('gameboard validation', () => {
  let gameboard;
  let ship;
  beforeEach(() => {
    gameboard = new Gameboard();
    ship = new Ship(3);
    ship.isHorizontal = true;
    ship.fillShipCoordinates([0, 0]);
  });

  test('gameboard class exists', () => {
    expect(typeof gameboard).toBe('object');
    expect(gameboard.board).toEqual([
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
      new Array(10).fill(null),
    ]);
  });

  test('valid placement works', () => {
    ship = new Ship(3);
    ship.isHorizontal = true;
    ship.fillShipCoordinates([0, 0]);
    const board = new Gameboard();

    expect(board.isPlaceValid(ship)).toBe(true);
  });

  test('invalid placement - off right edge', () => {
    ship = new Ship(3);
    ship.isHorizontal = true;

    ship.fillShipCoordinates([8, 0]);
    const board = new Gameboard();

    expect(board.isPlaceValid(ship)).toBe(false);
    // expect(() => board.place(ship)).toThrow('Place is invalid!');
  });

  test('invalid placement - off bottom edge', () => {
    ship = new Ship(4);

    ship.fillShipCoordinates([0, 8]);
    ship.isHorizontal = false;
    const board = new Gameboard();

    expect(board.isPlaceValid(ship)).toBe(false);
  });

  test('placing works (in the board.ships array)', () => {
    expect(gameboard.ships).toEqual([]);
    gameboard.placeInShips(ship);
    expect(gameboard.ships).toEqual([ship]);
    expect(() => {
      gameboard.placeInShips(ship);
    }).toThrow('Place is invalid!!');
  });

  test('invalid placement - overlapping another ship', () => {
    const board = new Gameboard();

    const ship1 = new Ship(3);
    ship1.isHorizontal = true;
    ship1.fillShipCoordinates([0, 0]);

    const ship2 = new Ship(2); // overlaps ship1
    ship2.isHorizontal = true;
    ship2.fillShipCoordinates([1, 0]);

    board.placeInShips(ship1);
    expect(board.isPlaceValid(ship2)).toBe(false);
    expect(() => {
      board.placeInShips(ship2);
    }).toThrow('Place is invalid!');
  });

  test('receiveAttack works', () => {
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.missed).toEqual([[0, 0]]);

    gameboard.receiveAttack([0, 2]);
    expect(gameboard.missed).toEqual([
      [0, 0],
      [0, 2],
    ]);
  });
  test('receiveAttack does not apply missed spot coordinates twice', () => {
    gameboard.receiveAttack([0, 0]);
    expect(() => {
      gameboard.receiveAttack([0, 0]);
    }).toThrow('missed spot is already hit!');
  });

  test('receiveAttack on a ship gives hitCoords of that ship that coord', () => {
    gameboard.placeInShips(ship);
    gameboard.receiveAttack([1, 0]);
    expect(ship.hitCoords).toEqual([[1, 0]]);

    gameboard.receiveAttack([0, 0]);
    expect(ship.sunk).toBe(false);
    gameboard.receiveAttack([2, 0]);
    expect(ship.sunk).toBe(true);

    expect(ship.hitCoords).toEqual([
      [1, 0],
      [0, 0],
      [2, 0],
    ]);
    expect(() => {
      gameboard.receiveAttack([1, 0]);
    }).toThrow('Ship already hit in this spot!');
  });

  test('allShipsSunk() method test', () => {
    gameboard.placeInShips(ship);
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([1, 0]);
    expect(gameboard.allShipsSunk()).toBe(false);
    gameboard.receiveAttack([2, 0]);
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
