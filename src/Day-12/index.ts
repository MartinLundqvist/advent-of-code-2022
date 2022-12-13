/*
 * Find minimal number of steps to get from S to E
 * You can only move to elevations which are 1 step higher or arbitrarily lower
 *
 * Attempt: Dijkstra's algorithm
 * Step 1: Create a weighted unidirectional graph
 * Step 2: Find the shortest path from S to E. Use Dijkstra's approach.
 *
 *
 */

// const exampleGraph: Graph = {
//     Start: { A: 1, B: 1, C: 1 },
//     A: { Start: 1, B: 1, D: 1 },
//     B: { Start: 1, A: 1, C: 1, D: 1 },
//     C: { Start: 1, B: 1, D: 1, End: 1 },
//     D: { A: 1, B: 1, C: 1, End: 1 },
//     End: { D: 1, C: 1 },
// }

import fs from 'fs';

interface GraphNode {
  [key: string]: number;
}

interface Graph {
  [key: string]: GraphNode;
}

const ELEVATIONS: { [key: string]: number } = {
  S: 0,
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  i: 8,
  j: 9,
  k: 10,
  l: 11,
  m: 12,
  n: 13,
  o: 14,
  p: 15,
  q: 16,
  r: 17,
  s: 18,
  t: 19,
  u: 20,
  v: 21,
  w: 22,
  x: 23,
  y: 24,
  z: 25,
  E: 25,
};

const checkElevationBetween = (a: string, b: string) => {
  return ELEVATIONS[b] - ELEVATIONS[a];
};

const createReverseObjects = (
  map: string[][]
): { graph: Graph; coordinatesToHeight: Map<string, string> } => {
  const graph: Graph = {};
  const coordinatesToHeight = new Map<string, string>();

  map.forEach((row, rowId) => {
    row.forEach((col, colId) => {
      let nodeStr = `${rowId},${colId}`;
      if (col === 'S') {
        nodeStr = 'S';
      }
      if (col === 'E') {
        nodeStr = 'E';
      }

      graph[nodeStr] = {};

      coordinatesToHeight.set(nodeStr, col);

      [-1, 1].forEach((rowOffset) => {
        if (rowId + rowOffset >= 0 && rowId + rowOffset < map.length) {
          let neighbourHeight = map[rowId + rowOffset][colId];
          let neighbourStr = `${rowId + rowOffset},${colId}`;
          let neighbourWeight = 1;
          if (neighbourHeight === 'S' || neighbourHeight === 'E') {
            neighbourStr = neighbourHeight;
          }

          if (checkElevationBetween(col, neighbourHeight) >= -1) {
            graph[nodeStr] = {
              ...graph[nodeStr],
              [neighbourStr]: neighbourWeight,
            };
          }
        }
      });

      [-1, 1].forEach((colOffset) => {
        if (colId + colOffset >= 0 && colId + colOffset < row.length) {
          let neighbourHeight = map[rowId][colId + colOffset];
          let neighbourWeight = 1;
          let neighbourStr = `${rowId},${colId + colOffset}`;
          if (neighbourHeight === 'S' || neighbourHeight === 'E') {
            neighbourStr = neighbourHeight;
          }

          if (checkElevationBetween(col, neighbourHeight) >= -1) {
            graph[nodeStr] = {
              ...graph[nodeStr],
              [neighbourStr]: neighbourWeight,
            };
          }
        }
      });
    });
  });

  return { graph, coordinatesToHeight };
};

const findClosestDistanceNode = (
  distances: GraphNode,
  visitedNodes: string[]
): string | null => {
  let closestNode: string | null = null;

  for (let node in distances) {
    if (visitedNodes.includes(node)) continue;

    if (!closestNode) {
      closestNode = node;
    }

    // Importantly, we check for less than or equal, because the edges are all the same lenght (i.e., Steps)
    if (distances[node] <= distances[closestNode]) {
      closestNode = node;
    }
  }

  return closestNode;
};

const visitNode = (
  node: string,
  distances: GraphNode,
  graph: Graph,
  visitedNodes: string[],
  startNode: string
) => {
  //   console.log(`I am in visitNode with ${node}`);
  for (let child in graph[node]) {
    // Is there already a distance to the child node?
    if (distances[child] !== undefined) {
      // Is the distance to the child node through the current node shorter than the distance already recorded?
      if (distances[node] + graph[node][child] < distances[child]) {
        // Update the distance
        distances[child] = distances[node] + graph[node][child];
      }

      // If there is no distance recorded for this node yet, we record this one
    } else {
      distances[child] = distances[node] + graph[node][child];
    }
  }

  // Mark this node as visited
  visitedNodes.push(node);
};

const findShortestPath = (graph: Graph, startNode: string) => {
  let visitedNodes: string[] = [];
  let distances: GraphNode = { [startNode]: 0 };

  let node = findClosestDistanceNode(distances, visitedNodes);

  while (node) {
    visitNode(node, distances, graph, visitedNodes, startNode);
    node = findClosestDistanceNode(distances, visitedNodes);
  }

  return distances;
};

export const day12 = () => {
  const map = fs
    .readFileSync('src/Day-12/data.txt', 'utf-8')
    .split('\n')
    .map((line) => line.split(''));

  const { graph, coordinatesToHeight } = createReverseObjects(map);

  let distances = findShortestPath(graph, 'E');

  console.log(`The answer to part 1 is ${distances['S']}`);

  const startNodeArray: number[] = [];

  coordinatesToHeight.forEach((height, coordinate) => {
    if (height === 'a' || height === 'S') {
      startNodeArray.push(distances[coordinate]);
    }
  });

  console.log(`The answer to part 2 is ${startNodeArray.sort()[0]}`);
};
