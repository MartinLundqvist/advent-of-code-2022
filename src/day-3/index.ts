import fs from 'fs';

export const day3 = () => {
  const priorities: { [key: string]: number } = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    o: 15,
    p: 16,
    q: 17,
    r: 18,
    s: 19,
    t: 20,
    u: 21,
    v: 22,
    w: 23,
    x: 24,
    y: 25,
    z: 26,
    A: 27,
    B: 28,
    C: 29,
    D: 30,
    E: 31,
    F: 32,
    G: 33,
    H: 34,
    I: 35,
    J: 36,
    K: 37,
    L: 38,
    M: 39,
    N: 40,
    O: 41,
    P: 42,
    Q: 43,
    R: 44,
    S: 45,
    T: 46,
    U: 47,
    V: 48,
    W: 49,
    X: 50,
    Y: 51,
    Z: 52,
  };

  const input = fs.readFileSync('./src/day-3/data.txt', 'utf-8');
  const rucksacks = input.split('\n');

  const findCommonItem = (rucksack: string) => {
    const compartment1 = rucksack.slice(0, rucksack.length / 2);
    const compartment2 = rucksack.slice(rucksack.length / 2);

    for (let i = 0; i < compartment1.length; i++) {
      const item = compartment1[i];

      if (compartment2.includes(item)) {
        return item;
      }
    }
  };

  const findCommonItemFromThree = (threeRucksacks: string[]) => {
    const commonItemsSack1And2 = [];

    for (let i = 0; i < threeRucksacks[0].length; i++) {
      const item = threeRucksacks[0][i];

      if (threeRucksacks[1].includes(item)) {
        commonItemsSack1And2.push(item);
      }
    }

    for (let i = 0; i < commonItemsSack1And2.length; i++) {
      const item = commonItemsSack1And2[i];

      if (threeRucksacks[2].includes(item)) {
        return item;
      }
    }
  };

  const part1Score = () => {
    let score = 0;
    rucksacks.forEach((rucksack) => {
      let commonItem = findCommonItem(rucksack)!;
      score += priorities[commonItem];
    });
    return score;
  };

  const part2Score = () => {
    let score = 0;
    for (let i = 0; i < rucksacks.length; i += 3) {
      const threeRucksacks = rucksacks.slice(i, i + 3);
      let commonItem = findCommonItemFromThree(threeRucksacks)!;
      score += priorities[commonItem];
    }
    return score;
  };

  console.log(`Result from part 1 is ${part1Score()}`);
  console.log(`Result from part 1 is ${part2Score()}`);
};
