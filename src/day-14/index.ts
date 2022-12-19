import fs from 'fs';

const WIDTH = 550;
const HEIGHT = 200;
const SAND = 500;
const X_OFFSET = 250;

const drawFromTo = (from: string, to: string, cave: string[][]) => {
  let [x1, y1] = from.split(',').map((str) => Number(str));
  let [x2, y2] = to.split(',').map((str) => Number(str));

  x1 -= X_OFFSET;
  x2 -= X_OFFSET;

  if (x1 === x2) {
    let startPoint = y1 < y2 ? y1 : y2;
    let distance = Math.abs(y1 - y2);

    for (let i = startPoint; i <= startPoint + distance; i++) {
      cave[i][x1] = '#';
    }

    return;
  }

  if (y1 === y2) {
    let startPoint = x1 < x2 ? x1 : x2;
    let distance = Math.abs(x1 - x2);
    for (let i = startPoint; i <= startPoint + distance; i++) {
      cave[y1][i] = '#';
    }

    return;
  }
};

const findFloorYCoordinate = (input: string[]): number => {
  let maxY = 0;

  input.forEach((line) => {
    const coords = line.split(' -> ');
    coords.forEach((coord) => {
      const [x, y] = coord.split(',').map((str) => Number(str));
      if (y > maxY) maxY = y;
    });
  });

  return maxY + 2;
};

const createCave = (input: string[]): string[][] => {
  let cave = new Array(HEIGHT);

  for (let i = 0; i < HEIGHT; i++) {
    cave[i] = new Array(WIDTH).fill('.');
  }

  input.forEach((line) => {
    const coords = line.split(' -> ');
    for (let i = 0; i < coords.length - 1; i++) {
      drawFromTo(coords[i], coords[i + 1], cave);
    }
  });

  return cave;
};

const printCave = (cave: string[][]) => {
  cave.forEach((row) => {
    console.log(row.join(''));
  });
};

const simulateOneUOSand = (cave: string[][]): boolean => {
  let y = 0;
  let x = SAND - X_OFFSET;

  while (y < HEIGHT - 1 && x < WIDTH - 1 && x > 0) {
    // Can drop one down?
    if (cave[y + 1][x] === '.') {
      y++;
      continue;
    }

    // Can move down and left?
    if (cave[y + 1][x - 1] === '.') {
      y++;
      x--;
      continue;
    }

    // Can move down and right?
    if (cave[y + 1][x + 1] === '.') {
      y++;
      x++;
      continue;
    }

    // No more options, we come to rest
    cave[y][x] = 'o';

    return false;
  }

  return true;
};
const simulateOneUOSandPt2 = (cave: string[][]): boolean => {
  let y = 0;
  let x = SAND - X_OFFSET;

  while (y < HEIGHT - 1 && x < WIDTH - 1 && x > 0) {
    // Is full?
    if (cave[y][x] === 'o') return true;

    // Can drop one down?
    if (cave[y + 1][x] === '.') {
      y++;
      continue;
    }

    // Can move down and left?
    if (cave[y + 1][x - 1] === '.') {
      y++;
      x--;
      continue;
    }

    // Can move down and right?
    if (cave[y + 1][x + 1] === '.') {
      y++;
      x++;
      continue;
    }

    // No more options, we come to rest
    cave[y][x] = 'o';

    return false;
  }

  return true;
};

const addFloor = (y: number, cave: string[][]) => {
  for (let i = 0; i < WIDTH; i++) {
    cave[y][i] = '#';
  }
};

const countSand = (cave: string[][]): number => {
  let count = 0;

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (cave[y][x] === 'o') count++;
    }
  }

  return count;
};

export const day14 = () => {
  const input = fs.readFileSync('src/day-14/data.txt', 'utf-8').split('\n');

  const cave = createCave(input);

  let isInVoid = simulateOneUOSand(cave);

  while (!isInVoid) isInVoid = simulateOneUOSand(cave);

  let result = countSand(cave);

  printCave(cave);

  console.log(`Answer to part 1 is: ${result}`);

  // Part 2
  const cave2 = createCave(input);
  const floorCoordinate = findFloorYCoordinate(input);
  addFloor(floorCoordinate, cave2);

  let isFull = simulateOneUOSandPt2(cave2);

  while (!isFull) isFull = simulateOneUOSandPt2(cave2);

  let result2 = countSand(cave2);

  printCave(cave2);

  console.log(`Answer to part 1 is: ${result}`);
  console.log(`Answer to part 2 is: ${result2}`);
};
