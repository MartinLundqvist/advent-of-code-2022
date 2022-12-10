import fs from 'fs';

export const day10 = () => {
  const input = fs.readFileSync('src/day-10/data.txt', 'utf8').split('\n');
  let x = 1;
  const signals: number[] = [];
  const screen: string[] = [];

  input.forEach((line) => {
    let [instruction, length] = line.split(' ');
    // Push one cycle
    signals.push(x);

    if (instruction === 'addx') {
      // Push one more cycle, then update X
      signals.push(x);
      x += Number(length);
    }
  });

  const cycles = signals.length;

  for (let cycle = 0; cycle < cycles; cycle++) {
    let pointer = signals[cycle];
    const row = Math.floor(cycle / 40);
    const crtPosition = cycle - row * 40;
    let crtCoverage = [pointer - 1, pointer, pointer + 1];
    if (!screen[row]) screen[row] = '';
    if (crtCoverage.includes(crtPosition)) {
      screen[row] += '#';
    } else {
      screen[row] += '.';
    }
  }

  const getStrength = (cycle: number) => cycle * signals[cycle - 1];

  const result =
    getStrength(20) +
    getStrength(60) +
    getStrength(100) +
    getStrength(140) +
    getStrength(180) +
    getStrength(220);

  console.log(`The answer to part 1 is ${result}`);
  console.log(`The answer to part 2 is`);

  console.log(screen);
};
