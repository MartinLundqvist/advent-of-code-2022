import fs from 'fs';

interface Pair {
  L: number[];
  R: number[];
  pair: number;
  isCorrectOrder: boolean | undefined;
}

const check = (
  L: undefined | number | number[],
  R: undefined | number | number[]
): 'Continue' | 'Correct' | 'Wrong' => {
  if (typeof L === 'object' && typeof R === 'object') {
    // If both values are arrays, then send them back into the check.

    let maxIndex = Math.min(L.length, R.length);
    let i = 1;

    let result = check(L[0], R[0]);
    while (result === 'Continue' && i < maxIndex) {
      result = check(L[i], R[i]);
      i++;
    }

    if (result === 'Continue') {
      if (L.length === R.length) {
        return 'Continue';
      }

      if (L.length < R.length) {
        return 'Correct';
      }

      return 'Wrong';
    }

    return result;
  }

  if (typeof L === 'number' && typeof R === 'number') {
    // If both values are integers, the lower integer should come first
    if (L < R) {
      return 'Correct';
    }
    if (L > R) {
      return 'Wrong';
    }

    return 'Continue';
  }

  // We have now the case where one is object, and the other is a number
  if (typeof R === 'number' && typeof L === 'object') {
    return check(L, [R]);
  }

  if (typeof L === 'number' && typeof R === 'object') {
    return check([L], R);
  }

  return 'Continue';
};

const checkPair = (pair: Pair) => {
  const { L, R } = pair;
  let correctOrder = undefined;

  let result = check(L, R);
  if (result === 'Wrong') {
    correctOrder = false;
  }
  if (result === 'Correct') {
    correctOrder = true;
  }

  pair.isCorrectOrder = correctOrder;
};

const checkAnyPair = (L: number[], R: number[]): number => {
  let correctOrder = undefined;

  let result = check(L, R);
  if (result === 'Wrong') {
    correctOrder = false;
  }
  if (result === 'Correct') {
    correctOrder = true;
  }

  return correctOrder ? 1 : -1;
};

const constructPairs = (input: string[]): Pair[] => {
  const pairs: Pair[] = [];
  let i = 0;
  let pair = 1;

  while (i < input.length) {
    let line = input[i];

    if (line === '') i++;
    let leftLine = input[i];
    i++;
    let rightLine = input[i];

    pairs.push({
      pair,
      isCorrectOrder: undefined,
      L: JSON.parse(leftLine),
      R: JSON.parse(rightLine),
    });

    i++;
    pair++;
  }

  return pairs;
};

const constructPackets = (pairs: Pair[]): number[][] => {
  const results: number[][] = [];

  pairs.forEach((pair) => {
    results.push(pair.L);
    results.push(pair.R);
  });

  return results;
};

export const day13 = () => {
  const input = fs.readFileSync('src/day-13/data.txt', 'utf-8').split('\n');

  const pairs: Pair[] = constructPairs(input);

  pairs.forEach((pair) => checkPair(pair));

  let results = pairs
    .filter((pair) => pair.isCorrectOrder === true)
    .reduce((prev, curr) => prev + curr.pair, 0);

  console.log(`The answer to part 1 is ${results}`);

  const packets = constructPackets(pairs);

  let nr1 = '[[2]]';
  let nr2 = '[[6]]';

  packets.push(JSON.parse(nr1));
  packets.push(JSON.parse(nr2));

  packets.sort((a, b) => checkAnyPair(b, a));

  let nr1Index =
    packets.findIndex((packet) => JSON.stringify(packet) === nr1) + 1;
  let nr2Index =
    packets.findIndex((packet) => JSON.stringify(packet) === nr2) + 1;

  console.log(`The answer to part 2 is ${nr1Index * nr2Index}`);
};
