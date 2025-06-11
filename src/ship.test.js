import { Ship } from './ship.js';

describe('Ship class exists', () => {
  let ship;
  beforeEach(() => {
    ship = new Ship(3);
    ship.isHorizontal = true;
    ship.fillShipCoordinates([0, 0]); //[0,0] - [1,0] - [2,0];
  });

  test('Ship object exists', () => {
    expect(typeof ship).toBe('object');
    expect(ship.length).toBe(3);
    expect(ship.hitsTaken).toBe(0);
    expect(ship.sunk).toBe(false);
  });

  test('hit([1,0]) increments hitsTaken', () => {
    ship.hit([1, 0]);
    expect(ship.hitsTaken).toBe(1);
  });

  test('hit([1,0]) increments hitsTaken', () => {
    ship.hit([1, 0]);
    expect(ship.hitCoords).toEqual([[1, 0]]);
  });

  test('hit() x3 makes ship.sunk = true', () => {
    ship.hit([0, 0]);
    ship.hit([1, 0]);

    expect(ship.sunk).toBe(false);
    ship.hit([2, 0]);
    expect(ship.hitCoords).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);

    expect(ship.sunk).toBe(true);
  });

  test('containsCoordinates works', () => {
    expect(ship.containsCoordinates([0, 5])).toBe(false);
    expect(ship.containsCoordinates([2, 0])).toBe(true);
  });

  test('hit()', () => {
    ship.hit([0, 0]);

    expect(ship.hitCoords).toEqual([[0, 0]]);

    expect(ship.containsCoordinates([0, 0], ship.hitCoords)).toBe(true);

    expect(() => {
      ship.hit([0, 0]);
    }).toThrow('Location has already been hit!!!');
  });
});
