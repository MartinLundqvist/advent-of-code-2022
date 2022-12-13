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

const getDivisors = (monkeys: Monkey[]): { [key: string]: number } => {
  const result: { [key: string]: number } = {};
  monkeys.forEach((monkey) => {
    result[monkey.test.divisor] = 0;
  });

  return result;
};

const initiateRemainders = (monkey: Monkey) => {
  monkey.items.forEach((item) => {
    for (let [key, value] of Object.entries(item.remainder)) {
      item.remainder[key] = item.currentValue % Number(key);
    }
  });

  console.log('Initial remainders');
  console.log(monkey.items);
};

const updateRemaindersAdd = (item: Item, operand: number) => {
  for (let key of Object.keys(item.remainder)) {
    let adjustment = (item.remainder[key] -= operand);
  }
};
const updateRemaindersMult = (item: Item, operand: number) => {
  for (let key of Object.keys(item.remainder)) {
    item.remainder[key] = operand % Number(key);
  }
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

const computeNewLevel = (monkey: Monkey, item: number): number => {
  const operator = monkey.operation.operator;
  let operand = monkey.operation.operand;
  let result = 0;

  if (item > 1e40) {
    console.log('Very large number encountered');
  }

  if (operand === 'old') {
    operand = item;
  }

  //   else {
  //     operand = BigInt(operand);
  //   }

  switch (operator) {
    case '*':
      result = item * operand;
      break;
    case '+':
      result = item + operand;
      break;
  }

  return result;
};

const getNextMonkeyIndex = (monkey: Monkey, item: number) => {
  let rest = item % monkey.test.divisor;

  //   console.log(
  //     `Item ${item} is ${rest === BigInt(0) ? '' : ' not '} divisble by ${
  //       monkey.test.divisor
  //     }.`
  //   );

  if (rest !== 0) return monkey.test.false;
  return monkey.test.true;
};
const getNewLevelAndNextMonkeyIndex = (
  monkey: Monkey,
  item: Item
): { item: Item; nextMonkeyIndex: number } => {
  const operator = monkey.operation.operator;
  let operand = monkey.operation.operand;

  console.log('Old item');
  console.log(item);

  if (item.currentValue > 1e40) {
    console.log('Very large number encountered');
  }

  if (operand === 'old') {
    operand = item.currentValue;
  }

  //   else {
  //     operand = BigInt(operand);
  //   }

  // If we multiply with ourselves (we never add ourselves) the remainders will be unchanged (???????)

  switch (operator) {
    case '*':
      if (operand !== item.currentValue) {
        // item.remainder[operand] = 0; // We assume all are prime integers
        updateRemaindersMult(item, operand);
      }

      item.currentValue = item.currentValue * operand;
      break;
    case '+':
      updateRemaindersAdd(item, operand);
      item.currentValue = item.currentValue + operand;
      break;
  }

  // Part 1 only!
  //   item.currentValue = Math.floor(item.currentValue / 3);

  let oldRest = item.currentValue % monkey.test.divisor;

  console.log(monkey.operation);
  console.log('New item');
  console.log(item);
  let rest = item.remainder[monkey.test.divisor];

  //   console.log(
  //     `Item.currentValue ${item.currentValue} % ${monkey.test.divisor} gives ${rest}`
  //   );

  if (rest !== 0) return { item, nextMonkeyIndex: monkey.test.false };
  return { item, nextMonkeyIndex: monkey.test.true };
};

export const day11 = () => {
  const input = fs.readFileSync('src/day-11/test.txt', 'utf-8').split('\n');

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
    // allItems.push(...newMonkey.items);
    line += 7;
  }

  // To solve for part 2 we need a helper object to store remainders for each divisor
  monkeys.forEach((monkey) => {
    monkey.items.forEach((item) => {
      item.remainder = getDivisors(monkeys); // We do this to make sure we create unique objects
      initiateRemainders(monkey);
    });
  });

  console.log(JSON.stringify(monkeys, null, 2));

  // Now we do 20 rounds
  for (let round = 0; round < 2; round++) {
    console.log(`Round ${round}:`);
    monkeys.forEach((monkey, index) => {
      //   console.log(`- Monkey ${index}:`);

      let nextItem = monkey.items.shift();

      while (nextItem) {
        monkey.nrInspections += 1;
        // console.log(`- - Inspecting item ${nextItem}`);
        // let newLevel = computeNewLevel(monkey, nextItem);
        // console.log(`- - New level: ${newLevel}`);
        // newLevel = Math.floor(newLevel / 3);
        // console.log(`- - New level / 3: ${newLevel}`);
        // let nextMonkey = getNextMonkeyIndex(monkey, newLevel);
        let { item, nextMonkeyIndex } = getNewLevelAndNextMonkeyIndex(
          monkey,
          nextItem
        );
        // console.log(`- - Throwing the item to monkey ${nextMonkey}`);
        monkeys[nextMonkeyIndex].items.push(item);
        // Need to conduct the test and receive a true / false. Or actually receive an index of which monkey to throw the item to.

        nextItem = monkey.items.shift();
        // console.log(JSON.stringify(monkeys, null, 2));
      }
    });
  }

  console.table(monkeys);
  monkeys.sort((a, b) => b.nrInspections - a.nrInspections);
  console.log(
    `Answer to part 1 is ${monkeys[0].nrInspections * monkeys[1].nrInspections}`
  );

  [13, 17, 19, 23].forEach((n) => {
    // let nr = ((76 * 76 + 9) * (76 * 76 + 9) * 19 + 6) * 23;
    let nr = 79;
    let a = nr % n;
    // if (a) {
    console.log(`${nr} is ${a} from being divisible by ${n}`);
    // } else {
    //   console.log(`${nr} is divisible by ${n}`);
    // }
  });
  [13, 17, 19, 23].forEach((n) => {
    // let nr = ((76 * 76 + 9) * (76 * 76 + 9) * 19 + 6) * 23;
    let nr = 79 * 19;
    let a = nr % n;
    // if (a) {
    console.log(`${nr} is ${a} from being divisible by ${n}`);
    // } else {
    //   console.log(`${nr} is divisible by ${n}`);
    // }
  });
};
