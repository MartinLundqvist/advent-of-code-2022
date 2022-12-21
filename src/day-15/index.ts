import fs from 'fs';

interface SensorReading {
  sx: number;
  sy: number;
  bx: number;
  by: number;
}

const getCoords = (line: string) => {
  const parts = line.split(' ');

  const regEx = /-?\d+/g;

  const sx = Number(parts[2].match(regEx)![0]);
  const sy = Number(parts[3].match(regEx)![0]);
  const bx = Number(parts[8].match(regEx)![0]);
  const by = Number(parts[9].match(regEx)![0]);

  return { sx, sy, bx, by };
};

const findEdges = (input: string[]) => {
  const edges = {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  };

  input.forEach((line) => {
    const { sx, sy, bx, by } = getCoords(line);

    if (sx < edges.xMin) edges.xMin = sx;
    if (sx > edges.xMax) edges.xMax = sx;
    if (sy < edges.yMin) edges.yMin = sy;
    if (sy > edges.yMax) edges.yMax = sy;

    if (bx < edges.xMin) edges.xMin = bx;
    if (bx > edges.xMax) edges.xMax = bx;
    if (by < edges.yMin) edges.yMin = by;
    if (by > edges.yMax) edges.yMax = by;
  });

  return edges;
};

const isWithinSensorReading = (
  x: number,
  y: number,
  sensorReadings: SensorReading[],
  detectBeacon = true
): boolean => {
  // For a given X, Y coordinate, we want to understand whether it likes withing the
  // Manhattan distance of any of the sensor readings.

  // If it does, we will return true, else false

  // Iterate over all sensor readings:
  for (const reading of sensorReadings) {
    // Check if we are actually on a beakon
    if (detectBeacon && reading.bx === x && reading.by === y) {
      return false;
    }

    // Calculate the Manhattah distance between the sensor and the beacon

    const distance =
      Math.abs(reading.sx - reading.bx) + Math.abs(reading.sy - reading.by);

    // Calculate the Manhattan distance between the sensor and the coordinate we are testing
    const distanceToSensor =
      Math.abs(reading.sx - x) + Math.abs(reading.sy - y);

    // If the distance to the sensor is less than the distance between the sensor and the beacon,
    // then we return true

    if (distanceToSensor <= distance) {
      return true;
    }
  }

  //   console.log(`Returning false`);
  return false;
};

const createSensorReadings = (input: string[]): SensorReading[] => {
  const sensorReadings: SensorReading[] = [];

  input.forEach((line) => {
    const { sx, sy, bx, by } = getCoords(line);
    sensorReadings.push({ sx, sy, bx, by });
  });

  return sensorReadings;
};

const getDistance = (reading: SensorReading) => {
  const distance =
    Math.abs(reading.sx - reading.bx) + Math.abs(reading.sy - reading.by);

  return distance;
};

const createSensorEdges = (reading: SensorReading) => {
  const distance = getDistance(reading);

  return {
    xMin: reading.sx - distance,
    xMax: reading.sx + distance,
    yMin: reading.sy - distance,
    yMax: reading.sy + distance,
  };
};

export const day15 = () => {
  const input = fs.readFileSync('src/day-15/data.txt', 'utf-8').split('\n');

  const edges = findEdges(input);

  // console.log(edges);

  const sensorReadings = createSensorReadings(input);

  const y = 20000;

  const withinDistanceArray: boolean[] = [];

  for (let x = edges.xMin; x <= edges.xMax; x++) {
    let isWithin = isWithinSensorReading(x, y, sensorReadings);

    withinDistanceArray.push(isWithin);
  }

  const answer = withinDistanceArray.filter((x) => x).length;

  console.log(`Answer to part 1 is ${answer}`);

  // Part 2: Iterate from 0 to 4000000. Find the only position where we do not have a beacon currently

  const xUpper = 4000000;
  const yUpper = 4000000;

  let foundIt = false;
  let xDistress = 0;
  let yDistress = 0;

  for (const reading of sensorReadings) {
    let foundIt = false;
    const { xMin, xMax, yMin, yMax } = createSensorEdges(reading);
    const distance = getDistance(reading);

    // Find the cornders of the covered area

    let xSearchMin = xMin < 0 ? 0 : xMin;
    let ySearchMin = yMin < 0 ? 0 : yMin;
    let xSearchMax = xMax > xUpper ? xUpper : xMax;
    let ySearchMax = yMax > yUpper ? yUpper : yMax;

    // Only trace the edges of the area - one position outside the area. We can assume that the area is a rectangle.

    // From the bottom corner to the left corner

    let y = ySearchMin - 1;
    let x = reading.sx;

    while (y <= reading.sy && x >= xSearchMin - 1 && !foundIt) {
      foundIt = !isWithinSensorReading(x, y, sensorReadings, false);
      // console.log(`Tracing from bottom to left corner - ${x}, ${y}`);

      if (foundIt) {
        console.log(`Found it at ${x}, ${y}`);
        xDistress = x;
        yDistress = y;
      }

      x--;
      y++;
    }

    // From the bottom corner to the right corner
    y = ySearchMin - 1;
    x = reading.sx;

    while (y <= reading.sy && x <= xSearchMax + 1 && !foundIt) {
      foundIt = !isWithinSensorReading(x, y, sensorReadings, false);
      // console.log(`Tracing from bottom to right corner - ${x}, ${y}`);

      if (foundIt) {
        console.log(`Found it at ${x}, ${y}`);
        xDistress = x;
        yDistress = y;
      }

      x++;
      y++;
    }

    // From the right corner to the top
    y = reading.sy;
    x = xSearchMax + 1;

    while (y <= ySearchMax + 1 && x >= reading.sx && !foundIt) {
      foundIt = !isWithinSensorReading(x, y, sensorReadings, false);
      // console.log(`Tracing from right to top corner - ${x}, ${y}`);

      if (foundIt) {
        console.log(`Found it at ${x}, ${y}`);
        xDistress = x;
        yDistress = y;
      }

      x--;
      y++;
    }

    // From the left corner to the top
    y = reading.sy;
    x = xSearchMin - 1;

    while (y <= ySearchMax + 1 && x <= reading.sx && !foundIt) {
      foundIt = !isWithinSensorReading(x, y, sensorReadings, false);
      // console.log(`Tracing from left to top corner - ${x}, ${y}`);

      if (foundIt) {
        console.log(`Found it at ${x}, ${y}`);
        xDistress = x;
        yDistress = y;
      }

      x++;
      y++;
    }
  }

  let answer2 = 4000000 * xDistress + yDistress;

  console.log(`Answer to part 2 is ${answer2}`);
};
