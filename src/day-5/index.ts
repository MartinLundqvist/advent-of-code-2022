import fs from 'fs';

export const day5 = () => {
  const input = fs.readFileSync('./src/day-5/data.txt', 'utf-8').split('\n');

  const splitPoint = input.findIndex((line) => line === '');
  const startConfiguration = input.slice(0, splitPoint - 1);
  const instructions = input.slice(splitPoint + 1);

  const generateStartStacks = (numberOfStacks: number) => {
    const stacks = new Map<number, string[]>();

    startConfiguration.forEach((line) => {
      let good = '';
      for (let i = 0; i < numberOfStacks; i++) {
        good = line[1 + 4 * i];

        if (good !== ' ') {
          const oldValue = stacks.get(i) || [];
          stacks.set(i, [...oldValue, good]);
        }
      }
    });
    return stacks;
  };

  const executeInstructions = (stacks: Map<number, string[]>) => {
    instructions.forEach((instruction) => {
      const action = instruction.split(' ');
      let from = Number(action[3]);
      let to = Number(action[5]);
      let amount = Number(action[1]);

      for (let i = 0; i < amount; i++) {
        const goodToMove = stacks.get(from - 1)![0];
        stacks.set(from - 1, stacks.get(from - 1)!.slice(1));
        stacks.set(to - 1, [...goodToMove, ...stacks.get(to - 1)!]);
      }
    });
  };
  const executeInstructions9001 = (stacks: Map<number, string[]>) => {
    instructions.forEach((instruction) => {
      const action = instruction.split(' ');
      let from = Number(action[3]);
      let to = Number(action[5]);
      let amount = Number(action[1]);

      const goodsToMove = stacks.get(from - 1)!.slice(0, amount);
      stacks.set(from - 1, stacks.get(from - 1)!.slice(amount));
      stacks.set(to - 1, [...goodsToMove, ...stacks.get(to - 1)!]);
    });
  };

  const printStacks = (stacks: Map<number, string[]>) => {
    for (let i = 0; i < stacks.size; i++) {
      console.log(`Stack ${i + 1}: ${stacks.get(i)?.join(' ')} `);
    }
  };

  const printTopGoods = (stacks: Map<number, string[]>) => {
    let topGoods = '';
    for (let i = 0; i < stacks.size; i++) {
      topGoods += stacks.get(i)?.[0];
    }
    return topGoods;
  };

  const numberOfStacks = (startConfiguration[0].length + 1) / 4;
  const stacksPart1 = generateStartStacks(numberOfStacks);
  const stacksPart2 = generateStartStacks(numberOfStacks);

  executeInstructions(stacksPart1);
  console.log(`Part 1 answer is: ${printTopGoods(stacksPart1)}`);
  executeInstructions9001(stacksPart2);
  console.log(`Part 2 answer is: ${printTopGoods(stacksPart2)}`);
};
