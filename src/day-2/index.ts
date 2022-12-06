import fs from 'fs';

// Rock beats scissors, scissors beats paper, and paper beats rock.
// A and X is Rock, B and Y is Paper, and C and Z is Scissors.

export const day2 = () => {
  const shapeScores: { [key: string]: number } = {
    Rock: 1,
    Paper: 2,
    Scissors: 3,
  };
  const shapes: { [key: string]: string } = {
    A: 'Rock',
    B: 'Paper',
    C: 'Scissors',
    X: 'Rock',
    Y: 'Paper',
    Z: 'Scissors',
  };

  const instructions: { [key: string]: string } = {
    X: 'Lose',
    Y: 'Draw',
    Z: 'Win',
  };

  const roundScores: { [key: string]: number } = { Lose: 0, Draw: 3, Win: 6 };
  const roundRules: { [key: string]: string } = {
    'Rock Rock': 'Draw',
    'Rock Paper': 'Win',
    'Rock Scissors': 'Lose',
    'Paper Rock': 'Lose',
    'Paper Paper': 'Draw',
    'Paper Scissors': 'Win',
    'Scissors Rock': 'Win',
    'Scissors Paper': 'Lose',
    'Scissors Scissors': 'Draw',
  };

  const input = fs.readFileSync('./src/day-2/data.txt', 'utf-8');
  const arrayOfRounds = input.split('\n');

  const calculateScore = (opponent: string, player: string) => {
    let score = shapeScores[player];
    const round = roundRules[`${opponent} ${player}`];
    score += roundScores[round];

    return score;
  };

  const getMove = (opponent: string, result: string) => {
    const opponentShape = shapes[opponent];
    const instruction = instructions[result];

    for (const [key, value] of Object.entries(roundRules)) {
      const [opponent, player] = key.split(' ');

      if (opponent === opponentShape && value === instruction) {
        return player;
      }
    }
  };

  const part1Score = () => {
    let totalScore = 0;

    arrayOfRounds.forEach((round) => {
      const [opponent, player] = round.split(' ');
      const opponentShape = shapes[opponent];
      const playerShape = shapes[player];
      const score = calculateScore(opponentShape, playerShape);

      totalScore += score;
    });

    return totalScore;
  };

  const part2Score = () => {
    let totalScore = 0;

    arrayOfRounds.forEach((round) => {
      const [opponent, result] = round.split(' ');
      const move = getMove(opponent, result)!;

      const score = calculateScore(shapes[opponent], move);

      totalScore += score;
    });
    return totalScore;
  };

  console.log(`Answer to part 1: ${part1Score()}`);
  console.log(`Answer to part 2: ${part2Score()}`);
};
