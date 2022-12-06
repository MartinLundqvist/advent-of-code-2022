import fs from 'fs';

export const day1 = () => {
  const input = fs.readFileSync('./src/day-1/data.txt', 'utf-8');
  const numbers = input.split('\n');

  // We convert it to an array of arrays of numbers. Each inner array represents one Elf's foods.
  const elfArray: number[][] = [];
  let elfIndex = 0;
  numbers.forEach((n) => {
    if (n === '') {
      elfIndex++;
    } else {
      if (!elfArray[elfIndex]) {
        elfArray[elfIndex] = [];
      }
      elfArray[elfIndex].push(Number(n));
    }
  });

  // We now reduce that array to an array of numbers, where each number is the sum of calories for that Elf's foods.
  const caloriesArray = elfArray.map((elf) => {
    return elf.reduce((a, b) => a + b, 0);
  });

  // We now sort the array of calories
  caloriesArray.sort((a, b) => b - a);

  console.log('Answer to part 1: ' + caloriesArray[0]);
  const sumTopThree: number =
    caloriesArray[0] + caloriesArray[1] + caloriesArray[2];
  console.log('Answer to part 2: ' + sumTopThree);
};
