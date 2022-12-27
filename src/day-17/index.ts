import fs from 'fs';
import { Element, createRockFactory } from './rocks';

/*
Rock starts dropping two units from the right wall and three units from the bottom.
The bottom starts out as the floor. 
Every time a rock comes to rest on the floor, it's highest point becomes the new floor.

The question to answer is how tall the structure of rocks will be after X number of rocks have fallen.

If we track the position of the floor changes, that will give us the answer. 

The floor starts at position 0
The floor will move with the height of the newly fallen rock - minus any units that it managed to squeeze by. 

The rocks are shaped such that the narrowest ones can fall past several previous rocks. So we need to keep track of the entire geometry of the structure.

Falling:
  Step 1: Appear
  Step 2: Pushed by Gas
  Step 3: Move down
  Step 4: Pushed by Gas
  Step 5: Move down
  Step 6: Pushed by Gas
  Step 7: Move down
  Step 8: Pushed by Gas
  And so forth...

The rocks can be characterised by their shape relative to a coordinate system where the 0,0 is the bottom left corner.

Then the cave can be characterised as a collection of rocks, each with a unique position in that cage, corresponding to the bottom left corner of the rock.

Part 2: Optimizing


0----------------------
####

0,0 1,0 2,0 3,0


1----------------------
 # 
###
 #

1,0 1,1 1,2 0,1 2,1



2----------------------
  #
  #
###

0,0 1,0 2,0 2,1 2,2 2,3




3----------------------
#
#
#
#

0,0 0,1 0,2 0,3 0,4




4----------------------
##
##

0,0 1,0 0,1 1,1

*/

class Cave {
  height: number;
  rows: number;
  dropPosition: { x: number; y: number };
  cave: string[][];
  rocks: Element[];
  currentRock: Element | null;
  currentBottomRow: number;
  constructor(rows = 30) {
    this.currentBottomRow = 0;
    this.rows = rows;
    this.height = 0;
    this.dropPosition = { x: 3, y: 4 };
    this.rocks = [];
    this.cave = new Array(rows)
      .fill(null)
      .map(() => ['|', '.', '.', '.', '.', '.', '.', '.', '|']);
    this.cave[0] = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];
    this.currentRock = null;
  }

  printLast15Lines() {
    console.log('-----------------');
    let bottom = this.height < 10 ? 0 : this.height - 10;
    for (let i = this.height + 10; i > bottom; i--) {
      let row = this.cave[i];
      console.log(row.join(''));
    }
    console.log('-----------------');
  }

  printAround(row: number) {
    console.log('-----------------');
    let bottom = row - 10 < 0 ? 0 : row - 10;
    let top = row + 10 > this.height ? this.height : row + 10;
    for (let i = top; i > bottom; i--) {
      let row = this.cave[i];
      console.log(row.join(''));
    }
    console.log('-----------------');
  }

  print() {
    // this.paintElements();
    for (let row of [...this.cave].reverse()) {
      // for (let row of this.cave) {
      console.log(row.join(''));
    }
  }

  addElement(element: Element) {
    // if (this.cave.length < this.dropPosition.y) {
    //   throw new Error('Cave is too small');
    // }
    element.position = { ...this.dropPosition };
    this.rocks.push(element);
    this.currentRock = element;
    this.paintElements();
  }

  paintElements() {
    // console.log(`Painting ${this.rocks.length} elements`);

    // Only paint the surroundings of the currently falling rock
    // That means the bottom position of the rock, minus one (The rock is falling)
    // until the bottom position of the rock, plus its height.
    if (!this.currentRock) {
      console.log('Problem Occurred');
      return;
    }

    // this.currentBottomRow = this.currentRock.position.y - 1;
    this.currentBottomRow = this.currentRock.position.y - 20;
    if (this.currentBottomRow < 0) this.currentBottomRow = 0;
    let topRow = this.currentRock.position.y + this.currentRock.height;

    // Now we filter out the rocks that are within range of the current rock.
    const rocksToPaint = this.rocks.filter((rock) => {
      return (
        rock.position.y + rock.height >= this.currentBottomRow &&
        rock.position.y <= topRow
      );
    });

    // Erase old painting
    this.cave.forEach((row) => {
      row[0] = '|';
      row[row.length - 1] = '|';
      for (let i = 1; i < row.length - 1; i++) row[i] = '.';
    });

    // If the bottomRow is the floor, fill the floor.
    if (this.currentBottomRow === 0) {
      this.cave[0] = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];
    }

    // console.log(`The range to paint is ${this.currentBottomRow} to ${topRow}`);

    // console.log(`Painting ${rocksToPaint.length} elements`);

    for (let element of rocksToPaint) {
      let ch = element.isGrounded ? '#' : '@';
      for (let position of element.shape) {
        let paintIndexY =
          element.position.y + position.y - this.currentBottomRow;
        if (paintIndexY >= 0) {
          this.cave[paintIndexY][element.position.x + position.x] = ch;
        }
      }
    }
  }

  checkCollission(element: Element, x: number, y: number): boolean {
    for (let position of element.shape) {
      let nextPosition =
        this.cave[element.position.y + position.y + y - this.currentBottomRow][
          element.position.x + position.x + x
        ];
      if (
        nextPosition === '#' ||
        nextPosition === '|' ||
        nextPosition === '-'
      ) {
        return true;
      }
    }
    return false;
  }

  moveElement(id: number, x: number, y: number): boolean {
    // console.log('Moving element', id, x, y);
    const element = this.rocks.find((r) => r.id === id);
    if (!element) {
      throw new Error('Element not found');
    }

    let grounded = false;

    let collission = this.checkCollission(element, x, y);

    // console.log('Collission?', collission);

    if (collission) {
      if (x === 0) {
        // console.log('Grounded');
        this.height =
          element.position.y + element.height > this.height
            ? element.position.y + element.height
            : this.height;
        this.dropPosition = { x: 3, y: this.height + 4 };
        element.isGrounded = true;
        grounded = true;
      }

      // It's colliding on the sides?
      if (y === 0) {
        // console.log('Colliding with side');
        grounded = false;
      }
    } else {
      element.position.x += x;
      element.position.y += y;

      grounded = false;
    }

    this.paintElements();
    return grounded;
  }

  allGrounded() {
    return this.rocks.every((r) => r.isGrounded);
  }
}

const createDirectionFactory = (input: string[]) => {
  let currentIndex = -1;

  const getNrDirections = () => input.length;

  const getCurrentIndex = () => currentIndex;

  const getNextDirection = () => {
    // if (currentIndex >= input.length - 1) {
    //   console.log('Starting over');
    // }

    currentIndex = currentIndex >= input.length - 1 ? 0 : currentIndex + 1;

    // console.log(`Parsing direction ${input[currentIndex]}`);
    return input[currentIndex] === '<' ? -1 : 1;
  };

  return {
    getNextDirection,
    getNrDirections,
    getCurrentIndex,
  };
};

const groundIt = (cave: Cave, rock: Element) => {
  while (!rock.isGrounded) {
    rock.isGrounded = cave.moveElement(rock.id, 0, -1);
  }
};

const tests = () => {
  const input = fs.readFileSync('src/day-17/test.txt', 'utf-8').split('');
  console.log(input.length);
};

const part2TestFunction = (rocks: number) => {
  // For part 2 test round, the pattern repeats every 35 rocks adding 53 to the height
  // To get to 1_000_000_000_000 we need add 15 rocks and then repeat the pattern 28_571_428_571 times.
  // At 15 rocks, the height is XX.

  const deltaHeight = 53;
  const deltaRocks = 35;
  const constant = 25;

  const results =
    Math.floor((rocks - 15) / deltaRocks) * deltaHeight + constant;

  return results;
};
const part2Function = (rocks: number) => {
  // For part 2 actual round, the pattern repeats every 1735 rocks adding 2695 to the height
  // To get to 1_000_000_000_000 we need add 1875 rocks and then repeat the pattern 576_368_875 times.
  // At 1875 rocks, the height is 2894.

  const deltaHeight = 2695;
  const deltaRocks = 1735;
  const constant = 2894;

  const results =
    Math.floor((rocks - 1875) / deltaRocks) * deltaHeight + constant;

  return results;
};

export const day17 = () => {
  // directionTests();
  // tests();
  const input = fs.readFileSync('src/day-17/data.txt', 'utf-8').split('');

  const cave = new Cave();
  const { getNextRock } = createRockFactory();
  const { getNextDirection, getNrDirections, getCurrentIndex } =
    createDirectionFactory(input);

  let breakCondition = false;
  let nextRock = getNextRock();

  cave.addElement(nextRock!);

  let currentHeight = 0;
  let nrRocks = 0;
  // while (!breakCondition) {
  //   let direction = getNextDirection();
  //   let grounded = cave.moveElement(nextRock!.id, direction, 0);
  //   // console.log('Moving', direction);
  //   // cave.print();
  //   grounded = cave.moveElement(nextRock!.id, 0, -1);

  //   // console.log('Moving down');
  //   // cave.print();
  //   if (grounded) {
  //     // console.log('Grounded');
  //     // console.log(currentDirectionId);

  //     // if (getCurrentIndex() < 5) {
  //     if (nextRock!.id % 1735 === 140) {
  //       let addedHeight = cave.height - currentHeight;
  //       let addedRocks = nextRock!.id - nrRocks;
  //       console.log(
  //         `Done with ${nextRock!.id} rocks. Cave height is ${
  //           cave.height
  //         }. At direction index ${getCurrentIndex()}, added ${addedRocks} and cave height increased by ${addedHeight}`
  //       );
  //       console.log(
  //         `Our test function reports: ${part2Function(nextRock!.id)}`
  //       );
  //       currentHeight = cave.height;
  //       nrRocks = nextRock!.id;
  //       // cave.print();
  //     }
  //     if (nextRock!.id === 10_000) {
  //       // console.log('Done');
  //       breakCondition = true;
  //       continue;
  //     }
  //     nextRock = getNextRock();
  //     cave.addElement(nextRock!);
  //   }
  // }
  // console.log(cave.height);

  console.log(
    `The answer to part 2 (test round) is ${part2TestFunction(
      1_000_000_000_000
    )}`
  );
  console.log(`The answer to part 2 is ${part2Function(1_000_000_000_000)}`);

  let factor = Math.floor(1_000_000_000_000 / 1735);
  let remainder = 1_000_000_000_000 % 1735;

  console.log(factor, remainder);
};
