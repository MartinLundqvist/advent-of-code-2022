import fs from 'fs';

export const day8 = () => {
  const input = fs.readFileSync('src/day-8/data.txt', 'utf-8').split('\n');
  const treeMatrix = input.map((row) => row.split(''));
  const isVisibleMatrix = treeMatrix.map((row) => row.map(() => false));
  const scenicScoreMatrix = treeMatrix.map((row) => row.map(() => 0));

  const checkIfVisible = (row: number, col: number) => {
    if (
      row === 0 ||
      row === treeMatrix.length - 1 ||
      col === 0 ||
      col === treeMatrix[0].length - 1
    ) {
      isVisibleMatrix[row][col] = true;

      return;
    }

    const isTreeXYVisibleFromDirectionXY = (
      row: number,
      col: number,
      rowDirection: number,
      colDirection: number
    ): boolean => {
      let currentRow = row + rowDirection;
      let currentCol = col + colDirection;

      while (
        currentRow < treeMatrix.length &&
        currentRow >= 0 &&
        currentCol < treeMatrix[0].length &&
        currentCol >= 0
      ) {
        if (treeMatrix[currentRow][currentCol] >= treeMatrix[row][col]) {
          return false;
        }

        currentRow += rowDirection;
        currentCol += colDirection;
      }

      return true;
    };

    if (isTreeXYVisibleFromDirectionXY(row, col, -1, 0)) {
      isVisibleMatrix[row][col] = true;
      return;
    }

    if (isTreeXYVisibleFromDirectionXY(row, col, 1, 0)) {
      isVisibleMatrix[row][col] = true;
      return;
    }
    if (isTreeXYVisibleFromDirectionXY(row, col, 0, -1)) {
      isVisibleMatrix[row][col] = true;
      return;
    }
    if (isTreeXYVisibleFromDirectionXY(row, col, 0, 1)) {
      isVisibleMatrix[row][col] = true;
      return;
    }
  };

  const calcScenicScore = (row: number, col: number) => {
    const distanceToBlockFromXYDirectionXY = (
      row: number,
      col: number,
      rowDirection: number,
      colDirection: number
    ): number => {
      let currentRow = row + rowDirection;
      let currentCol = col + colDirection;

      if (currentRow < 0 || currentRow >= treeMatrix.length) return 0;
      if (currentCol < 0 || currentCol >= treeMatrix[0].length) return 0;

      let distance = 0;

      while (
        currentRow < treeMatrix.length &&
        currentRow >= 0 &&
        currentCol < treeMatrix[0].length &&
        currentCol >= 0
      ) {
        distance++;
        if (treeMatrix[currentRow][currentCol] >= treeMatrix[row][col]) {
          return distance;
        }

        currentRow += rowDirection;
        currentCol += colDirection;
      }

      return distance;
    };

    let score = 1;

    score *= distanceToBlockFromXYDirectionXY(row, col, -1, 0);
    score *= distanceToBlockFromXYDirectionXY(row, col, 1, 0);
    score *= distanceToBlockFromXYDirectionXY(row, col, 0, -1);
    score *= distanceToBlockFromXYDirectionXY(row, col, 0, 1);

    scenicScoreMatrix[row][col] = score;
  };

  for (let row = 0; row < treeMatrix.length; row++) {
    for (let col = 0; col < treeMatrix[0].length; col++) {
      checkIfVisible(row, col);
      calcScenicScore(row, col);
    }
  }

  const getMaxValue = (matrix: number[][]): number => {
    let max = 0;

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[0].length; col++) {
        if (matrix[row][col] > max) max = matrix[row][col];
      }
    }

    return max;
  };

  console.log(
    `Answer to part 1 is ${isVisibleMatrix.flat().filter((x) => x).length}`
  );
  console.log(`Answer to part 2 is ${getMaxValue(scenicScoreMatrix)}`);
};
