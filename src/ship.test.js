import { Ship } from './ship.js';

test('Ship object exists', () => {
  const length = 2;
  const ship = new Ship(length);
  expect(typeof ship).toBe('object');
  expect(ship.length).toBe(length);
  expect(ship.hitsTaken).toBe(null);
  expect(ship.sunk).toBe(false);
});

test('hit() increments hitsTaken', () => {
  const length = 2;
  const ship = new Ship(length);
  ship.hit();

  expect(ship.hitsTaken).toBe(1);
});

test('hit() will eventually turn ship.sunk = true', () => {
  const length = 1;
  const ship = new Ship(length);
  const ship2 = new Ship(2);
  ship.hit();
  expect(ship.sunk).toBe(true);

  ship2.hit();
  expect(ship2.sunk).toBe(false);
  ship2.hit();
  expect(ship2.sunk).toBe(true);
});
