import fs from 'fs';

interface Item {
  currentValue: number;
  remainder: { [key: string]: number };
}

interface Operation {
  operator: '+' | '*';
  operand: number | 'old';
}

interface Monkey {
  items: Item[];
  operation: Operation;
  test: {
    divisor: number;
    true: number;
    false: number;
  };
  nrInspections: number;
}

const getDivisors = (monkeys: Monkey[]): number[] => {
  const result = new Set<number>();
  monkeys.forEach((monkey) => {
    result.add(monkey.test.divisor);
  });

  return Array.from(result);
};

const getItems = (str: string) => {
  const items: Item[] = [];
  const itemsStr = str.split(' ').slice(4);
  itemsStr.forEach((is) => {
    is = is.replace(',', '');
    items.push({ currentValue: Number(is), remainder: {} });
  });

  return items;
};

const getOperation = (str: string): Operation => {
  const parts = str.split(' ');
  let operator = parts[6] as '*' | '+';
  let operand = 'old' as number | 'old';
  if (parts[7] !== 'old') {
    operand = Number(parts[7]);
  }

  return {
    operator,
    operand,
  };
};

const getTest = (str: string[]) => {
  const [firstLine, secondLine, thirdLine] = str;

  let divisor = Number(firstLine.split(' ')[5]);
  let trueOp = Number(secondLine.split(' ')[9]);
  let falseOp = Number(thirdLine.split(' ')[9]);

  return {
    divisor,
    true: trueOp,
    false: falseOp,
  };
};

const getNewLevelAndNextMonkeyIndex = (
  monkey: Monkey,
  item: Item,
  divisors: number[]
): { item: Item; nextMonkeyIndex: number } => {
  const operator = monkey.operation.operator;
  let operand = monkey.operation.operand;

  if (operand === 'old') {
    operand = item.currentValue;
  }

  switch (operator) {
    case '*':
      item.currentValue = item.currentValue * operand;
      break;
    case '+':
      item.currentValue = item.currentValue + operand;
      break;
  }

  // Part 1 only!
  // item.currentValue = Math.floor(item.currentValue / 3);

  // Part 2 only!
  const divisorProduct = divisors.reduce((prev, curr) => prev * curr);
  item.currentValue = item.currentValue % divisorProduct;
  let rest = item.currentValue % monkey.test.divisor;

  if (rest !== 0) return { item, nextMonkeyIndex: monkey.test.false };
  return { item, nextMonkeyIndex: monkey.test.true };
};

export const day11 = () => {
  const input = fs.readFileSync('src/day-11/data.txt', 'utf-8').split('\n');

  const monkeys: Monkey[] = [];

  // Let's first construct these monkey objects
  let line = 0;
  while (line < input.length) {
    const newMonkey: Monkey = {
      items: getItems(input[line + 1]),
      operation: getOperation(input[line + 2]),
      test: getTest(input.slice(line + 3, line + 6)),
      nrInspections: 0,
    };

    monkeys.push(newMonkey);
    line += 7;
  }

  const divisors = getDivisors(monkeys);

  // Now we do 20 rounds
  for (let round = 0; round < 10000; round++) {
    monkeys.forEach((monkey, index) => {
      let nextItem = monkey.items.shift();

      while (nextItem) {
        monkey.nrInspections += 1;

        let { item, nextMonkeyIndex } = getNewLevelAndNextMonkeyIndex(
          monkey,
          nextItem,
          divisors
        );
        monkeys[nextMonkeyIndex].items.push(item);

        nextItem = monkey.items.shift();
      }
    });
  }

  console.table(monkeys);
  monkeys.sort((a, b) => b.nrInspections - a.nrInspections);
  console.log(
    `Answer to part 2 is ${monkeys[0].nrInspections * monkeys[1].nrInspections}`
  );
};
