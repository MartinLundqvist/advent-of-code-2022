import fs from 'fs';

export const day9 = () => {
  const input = fs.readFileSync('src/day-9/data.txt', 'utf-8').split('\n');

  const visitedTailLocations = new Set<string>();
  const numberOfKnots: number = 10;
  const rope: { row: number; col: number }[] = new Array(numberOfKnots)
    .fill(null)
    .map((el) => ({
      row: 0,
      col: 0,
    }));

  visitedTailLocations.add(JSON.stringify(rope[numberOfKnots - 1]));

  const moveBy = (row: number, col: number) => {
    rope[0].row += row;
    rope[0].col += col;
    let tailMove = getTailMove(0, row, col);

    if (numberOfKnots === 2) {
      rope[1].row += tailMove.row;
      rope[1].col += tailMove.col;
    } else {
      for (let knotIndex = 1; knotIndex < numberOfKnots - 1; knotIndex++) {
        rope[knotIndex].row += tailMove.row;
        rope[knotIndex].col += tailMove.col;
        tailMove = getTailMove(knotIndex, tailMove.row, tailMove.col);
      }
      rope[numberOfKnots - 1].row += tailMove.row;
      rope[numberOfKnots - 1].col += tailMove.col;
    }
  };

  const getTailMove = (
    knot: number,
    row: number,
    col: number
  ): { row: number; col: number } => {
    let tailMove = { row: 0, col: 0 };
    if (row === 0 && col === 0) {
      return tailMove;
    }

    /*
     * Cases:
     * - Head didn't move: Do nothing
     * - Adjacent: Do nothing
     * - Same row or same column: just move in same direction
     * - Different row and column: move diagonally.
     */

    const isAdjacent = () =>
      Math.abs(rope[knot].col - rope[knot + 1].col) < 2 &&
      Math.abs(rope[knot].row - rope[knot + 1].row) < 2;

    if (isAdjacent()) {
      return tailMove;
    }

    if (rope[knot].row === rope[knot + 1].row) {
      tailMove = { row: 0, col };
      return tailMove;
    }
    if (rope[knot].col === rope[knot + 1].col) {
      tailMove = { row, col: 0 };
      return tailMove;
    }
    let rowStep = rope[knot].row - rope[knot + 1].row < 0 ? -1 : 1;
    let colStep = rope[knot].col - rope[knot + 1].col < 0 ? -1 : 1;
    return { row: rowStep, col: colStep };
  };

  const printRope = () => {
    const rows = 15;
    const cols = 15;
    const layout = new Array(2 * rows)
      .fill(undefined)
      .map((el) => new Array(2 * cols).fill(undefined).map((el2) => '.'));
    for (let i = -rows; i < rows; i++) {
      for (let j = -cols; j < cols; j++) {
        let knot = rope.findIndex((r) => r.col === j && r.row === i);
        knot > -1
          ? (layout[i + rows][j + cols] = String(knot))
          : (layout[i + rows][j + cols] = '.');
      }
    }

    console.table(layout);
  };

  input.forEach((commmand) => {
    const [direction, steps] = commmand.split(' ');

    // printRope();
    let remainingSteps = Number(steps);

    while (remainingSteps > 0) {
      switch (direction) {
        case 'U':
          moveBy(1, 0);
          break;
        case 'D':
          moveBy(-1, 0);
          break;
        case 'R':
          moveBy(0, 1);
          break;
        case 'L':
          moveBy(0, -1);
          break;
      }

      remainingSteps--;

      visitedTailLocations.add(JSON.stringify(rope[numberOfKnots - 1]));
    }
  });
  // console.log(`Answer to part 1 is: ${visitedTailLocations.size}`);
  console.log(`Answer to part 2 is: ${visitedTailLocations.size}`);
};
