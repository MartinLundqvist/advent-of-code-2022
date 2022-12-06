import fs from 'fs';

export const day4 = () => {
  const input = fs.readFileSync('./src/day-4/data.txt', 'utf-8');
  const pairs = input.split('\n');

  const part1Score = () => {
    const assignmentsFullyOverlap = (
      assignment1: string,
      assignment2: string
    ): boolean => {
      const [ass1start, ass1end] = assignment1.split('-').map(Number);
      const [ass2start, ass2end] = assignment2.split('-').map(Number);

      if (ass1start <= ass2start && ass1end >= ass2end) {
        return true;
      }

      if (ass2start <= ass1start && ass2end >= ass1end) {
        return true;
      }
      return false;
    };

    let score = 0;
    pairs.forEach((pair) => {
      console.log(pair);
      const [assignment1, assignment2] = pair.split(',');
      score += assignmentsFullyOverlap(assignment1, assignment2) ? 1 : 0;
    });
    return score;
  };

  const part2Score = () => {
    let score = 0;
    const assignmentsOverlap = (assignment1: string, assignment2: string) => {
      const [ass1start, ass1end] = assignment1.split('-').map(Number);
      const [ass2start, ass2end] = assignment2.split('-').map(Number);

      if (ass1end < ass2start || ass2end < ass1start) {
        return false;
      }
      return true;
    };

    pairs.forEach((pair) => {
      console.log(pair);
      const [assignment1, assignment2] = pair.split(',');
      score += assignmentsOverlap(assignment1, assignment2) ? 1 : 0;
    });

    return score;
  };

  //   console.log(`Result from part 1 is ${part1Score()}`);
  console.log(`Result from part 2 is ${part2Score()}`);
};
