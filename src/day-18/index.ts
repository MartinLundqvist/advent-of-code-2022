import fs from 'fs';

interface Cube {
  x: number;
  y: number;
  z: number;
  top: Cube | undefined;
  bottom: Cube | undefined;
  left: Cube | undefined;
  right: Cube | undefined;
  front: Cube | undefined;
  back: Cube | undefined;
}

type Grid = Cube[];

const addCube = (grid: Grid, cube: Cube) => {
  // Check for all neighbhours
  const top = grid.find(
    (c) => c.x === cube.x && c.y === cube.y && c.z === cube.z + 1
  );
  const bottom = grid.find(
    (c) => c.x === cube.x && c.y === cube.y && c.z === cube.z - 1
  );
  const left = grid.find(
    (c) => c.x === cube.x - 1 && c.y === cube.y && c.z === cube.z
  );
  const right = grid.find(
    (c) => c.x === cube.x + 1 && c.y === cube.y && c.z === cube.z
  );
  const front = grid.find(
    (c) => c.x === cube.x && c.y === cube.y + 1 && c.z === cube.z
  );
  const back = grid.find(
    (c) => c.x === cube.x && c.y === cube.y - 1 && c.z === cube.z
  );

  // Set the neighbours
  if (top) {
    top.bottom = cube;
    cube.top = top;
  }
  if (bottom) {
    bottom.top = cube;
    cube.bottom = bottom;
  }
  if (left) {
    left.right = cube;
    cube.left = left;
  }
  if (right) {
    right.left = cube;
    cube.right = right;
  }
  if (front) {
    front.back = cube;
    cube.front = front;
  }
  if (back) {
    back.front = cube;
    cube.back = back;
  }

  // Push the cube to the grid
  grid.push(cube);
};

const createGrid = (input: string[]): Grid => {
  const grid: Grid = [];

  for (let coordinates of input) {
    const [x, y, z] = coordinates.split(',').map((c) => Number(c));
    const cube = createCube(x, y, z);
    addCube(grid, cube);
  }

  return grid;
};

const createCube = (x: number, y: number, z: number): Cube => ({
  x,
  y,
  z,
  top: undefined,
  bottom: undefined,
  left: undefined,
  right: undefined,
  front: undefined,
  back: undefined,
});

const countUnconnectedSides = (grid: Grid) => {
  let count = 0;
  for (let cube of grid) {
    let cubeSides = 6;
    if (cube.top) cubeSides--;
    if (cube.bottom) cubeSides--;
    if (cube.left) cubeSides--;
    if (cube.right) cubeSides--;
    if (cube.front) cubeSides--;
    if (cube.back) cubeSides--;
    count += cubeSides;
  }
  return count;
};

export const day18 = () => {
  const input = fs.readFileSync('src/day-18/data.txt', 'utf-8').split('\n');

  const grid: Grid = createGrid(input);

  const results = countUnconnectedSides(grid);

  console.log(results);
};
