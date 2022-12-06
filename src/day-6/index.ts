import fs from 'fs';

export const day6 = () => {
  const characterString = fs
    .readFileSync('./src/day-6/data.txt', 'utf-8')
    .split('\n')[0];

  const areXCharactersUnique = (string: string, x: number) => {
    const characterArray = string.split('');
    const characterSet = new Set(characterArray);
    return characterSet.size === x;
  };

  const findUniqueX = (x: number) => {
    for (let i = 0; i < characterString.length; i++) {
      const substring = characterString.substring(i, i + x);
      if (areXCharactersUnique(substring, x)) {
        return i + x;
      }
    }
  };

  console.log(`Part 1 answer is: ${findUniqueX(4)}`);
  console.log(`Part 2 answer is: ${findUniqueX(14)}`);
};
