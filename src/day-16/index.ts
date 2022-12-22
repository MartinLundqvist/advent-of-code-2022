import fs from 'fs';

interface GraphNode {
  id: string;
  open: boolean;
  openDuration: number;
  neighbours: GraphNode[];
  neighbourIds: string[];
  flowRate: number;
}

const createGraph = (input: string[]): GraphNode[] => {
  const nodes: GraphNode[] = [];

  const regEx = /\d+/g;

  // Create all valve nodes
  for (const line of input) {
    const inputParts = line.split(' ');

    const id = inputParts[1];
    const flowRate = Number(inputParts[4]!.match(regEx)![0]);
    const nrNeighbours = inputParts.length - 9;
    const neighbourIds: string[] = [];
    const open = false;
    const openDuration = 0;

    for (let i = 0; i < nrNeighbours; i++) {
      const neighbourId = inputParts[9 + i].replace(',', '');
      neighbourIds.push(neighbourId);
    }

    const node: GraphNode = {
      id,
      open,
      neighbourIds,
      neighbours: [],
      flowRate,
      openDuration,
    };

    nodes.push(node);
  }

  // Connect the neighbhours
  for (const node of nodes) {
    for (const neighbourId of node.neighbourIds) {
      const neighbour = nodes.find((n) => n.id === neighbourId);
      if (neighbour) {
        node.neighbours.push(neighbour);
      }
    }
  }

  return nodes;
};

const findClosestDistanceNode = (
  distances: { [key: string]: number },
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
  distances: { [key: string]: number },
  graph: GraphNode[],
  visitedNodes: string[]
) => {
  let nodeObj = graph.find((n) => n.id === node)!;

  //   console.log(`I am in visitNode with ${node}`);
  for (let neighbour of nodeObj.neighbourIds) {
    // Is there already a distance to the child node?
    if (distances[neighbour] !== undefined) {
      // Is the distance to the child node through the current node shorter than the distance already recorded?
      if (distances[node] + 1 < distances[neighbour]) {
        // Update the distance
        distances[neighbour] = distances[node] + 1;
      }

      // If there is no distance recorded for this node yet, we record this one
    } else {
      distances[neighbour] = distances[node] + 1;
    }
  }

  // Mark this node as visited
  visitedNodes.push(node);
};

const getShortestDistance = (startNode: string, graph: GraphNode[]) => {
  let visitedNodes: string[] = [];
  let distances = { [startNode]: 0 };

  let node = findClosestDistanceNode(distances, visitedNodes);

  while (node) {
    visitNode(node, distances, graph, visitedNodes);
    node = findClosestDistanceNode(distances, visitedNodes);
  }

  return distances;
};

const createDistances = (graph: GraphNode[]) => {
  const result: Map<string, number> = new Map();

  for (let i = 0; i < graph.length; i++) {
    const distances = getShortestDistance(graph[i].id, graph);
    for (let j = i + 1; j < graph.length; j++) {
      result.set(`${graph[i].id}-${graph[j].id}`, distances[graph[j].id]);
      result.set(`${graph[j].id}-${graph[i].id}`, distances[graph[j].id]);
    }
  }

  return result;
};

const printGraph = (graph: GraphNode[]) => {
  for (const node of graph) {
    console.log(node);
  }
};

const getPressureStatus = (graph: GraphNode[]) => {
  const valvesOpen = graph.filter((node) => node.open).map((node) => node.id);

  if (valvesOpen.length === 0) {
    return 'No valves are open';
  }

  const pressureReleased = graph
    .filter((node) => node.open)
    .reduce((prev, curr) => prev + curr.flowRate, 0);
  const result = `Valves ${valvesOpen.join(
    ', '
  )} are open releasing ${pressureReleased} units of pressure.`;

  return result;
};

const getTotalPressureReleased = (graph: GraphNode[]) => {
  return graph.reduce(
    (prev, curr) => prev + curr.flowRate * curr.openDuration,
    0
  );
};

const runTest = (graph: GraphNode[]) => {
  graph.find((node) => node.id === 'DD')!.open = true;
  graph.find((node) => node.id === 'DD')!.openDuration = 28;

  graph.find((node) => node.id === 'BB')!.open = true;
  graph.find((node) => node.id === 'BB')!.openDuration = 25;

  graph.find((node) => node.id === 'JJ')!.open = true;
  graph.find((node) => node.id === 'JJ')!.openDuration = 21;

  graph.find((node) => node.id === 'HH')!.open = true;
  graph.find((node) => node.id === 'HH')!.openDuration = 13;

  graph.find((node) => node.id === 'EE')!.open = true;
  graph.find((node) => node.id === 'EE')!.openDuration = 9;

  graph.find((node) => node.id === 'CC')!.open = true;
  graph.find((node) => node.id === 'CC')!.openDuration = 6;
};

const getNextUnopenedNode = (
  currentPath: string[],
  queue: string[],
  paths: { [key: string]: string[] }
) => {
  console.log(`Finding the next node to open`);

  const currentStep = currentPath.length;

  const stepsTaken: string[] = [];

  //   console.log(paths);
  //   console.log(currentStep);

  if (paths) {
    for (const prevPath of Object.values(paths)) {
      stepsTaken.push(prevPath[currentStep]);
    }

    // console.log(stepsTaken);
    // console.log(queue);

    console.log(
      `At step ${currentStep}, we have taken steps ${JSON.stringify(
        stepsTaken
      )}`
    );
    console.log(`The queue is ${JSON.stringify(queue)}`);

    const nextNode = queue.find((node) => !stepsTaken.includes(node));

    console.log(`The next node is ${nextNode}`);

    return nextNode;
  }

  return queue[0];
};

const createAllPaths = (graph: GraphNode[]) => {
  // A map of possible paths through the nodes.
  const paths: { [key: string]: string[] } = {};

  let pathsAreRepeating = false;

  let debug = 0;

  while (!pathsAreRepeating) {
    debug++;
    console.log('Creating a path ' + debug);
    const thisPath = [];

    let queue = graph.filter((node) => node.id !== 'AA').map((node) => node.id);

    // console.log(queue);

    while (queue.length > 0) {
      let nextNode = getNextUnopenedNode(thisPath, queue, paths);

      if (!nextNode) {
        queue = [];
        continue;
      }

      thisPath.push(nextNode!);

      queue = queue.filter((node) => node !== nextNode);
    }

    console.log(`I have created a path ${JSON.stringify(thisPath)}`);

    if (
      paths.hasOwnProperty(JSON.stringify(thisPath)) ||
      thisPath.length <= 1
    ) {
      pathsAreRepeating = true;
      console.log('Paths are repeating or misformed. We are done.');
    } else {
      paths[JSON.stringify(thisPath)] = thisPath;
    }

    // console.log(thisPath);
  }

  return paths;
};

const simulatePath = (
  path: string[],
  graph: GraphNode[],
  distances: Map<string, number>
) => {
  let time = 30;
  let thisNode = 'AA';

  console.log(`Simulating path ${JSON.stringify(path)}`);

  for (const node of path) {
    console.log(`Moving from ${thisNode} to ${node}`);
    console.log(`Time is ${time} before opening node ${node}`);
    const nodeObj = graph.find((n) => n.id === node)!;
    console.log('Found node ' + nodeObj.id);
    const distance = distances.get(`${thisNode}-${node}`)!;
    console.log('Found distance ' + distance);

    time = time - distance - 1;
    console.log(`Time is ${time} after opening node ${node}`);
    if (time < 0) {
      console.log(`Problems... time left is ${time}. I am breaking`);
      break;
    }
    nodeObj.open = true;
    nodeObj.openDuration = time;
    thisNode = node;
  }

  //   console.log(graph);

  let result = getTotalPressureReleased(graph);
  console.log(result);

  return getTotalPressureReleased(graph);
};

const resetGraph = (graph: GraphNode[]) => {
  for (const node of graph) {
    node.open = false;
    node.openDuration = 0;
  }
};

const findMostPressureReleasedNode = (
  pressureReleased: PressureReleased,
  visitedNodes: string[]
): string | null => {
  let mostPressureNode: string | null = null;

  for (let node in pressureReleased) {
    if (visitedNodes.includes(node)) continue;

    if (!mostPressureNode) {
      mostPressureNode = node;
    }

    // If this node provides a higher pressure to be released, this is now our path.
    if (
      pressureReleased[node].pressureReleased >
      pressureReleased[mostPressureNode].pressureReleased
    ) {
      mostPressureNode = node;
    }
  }

  return mostPressureNode;
};

const visitPressureNode = (
  node: string,
  pressureReleased: PressureReleased,
  graph: GraphNode[],
  visitedNodes: string[],
  distancesBetweenNodes: Map<string, number>
) => {
  let nodeObj = graph.find((n) => n.id === node)!;

  //   console.log(`I am in visitNode with ${node}`);
  for (let nextNode of nodeObj.neighbours) {
    // If the next node is the current node, skip it.
    if (nextNode.id === node) continue;

    // calculate the pressure released by moving to the next node through the current node

    let timeOnceReached =
      pressureReleased[node].visitedAt -
      distancesBetweenNodes.get(`${node}-${nextNode.id}`)!;

    if (nextNode.flowRate > 0) timeOnceReached += 1;

    let pressureReleasedByMovingToNextNode =
      pressureReleased[node].pressureReleased +
      nextNode.flowRate * timeOnceReached;

    console.log(`I am in visitNode with ${node} and ${nextNode.id}`);
    console.log(
      `The time once reached and opened next node is ${timeOnceReached}`
    );
    console.log(
      `The pressure released by moving to next node is ${pressureReleasedByMovingToNextNode}`
    );

    // Is there already a distance to the next node?
    if (pressureReleased[nextNode.id] !== undefined) {
      // Is the pressure released by moving to the next node through the current node higher than already recorded?
      if (
        pressureReleasedByMovingToNextNode >
        pressureReleased[node].pressureReleased
      ) {
        console.log(
          `The pressure gain from moving to ${nextNode.id} is higher than already recorded`
        );
        // Update the distance
        pressureReleased[nextNode.id].pressureReleased =
          pressureReleasedByMovingToNextNode;
        pressureReleased[nextNode.id].visitedAt = timeOnceReached;
      }

      // If there is no distance recorded for this node yet, we record this one
    } else {
      console.log(
        `Not recorded the pressure gain from moving to ${nextNode.id} yet`
      );
      pressureReleased[nextNode.id] = {
        pressureReleased: pressureReleasedByMovingToNextNode,
        visitedAt: timeOnceReached,
      };
    }
  }

  // Mark this node as visited, but only if it has a flowRate
  nodeObj.flowRate > 0 && visitedNodes.push(node);
};

type PressureReleased = {
  [key: string]: { visitedAt: number; pressureReleased: number };
};

const findMostPressureReleasedPath = (
  graph: GraphNode[],
  distances: Map<string, number>
) => {
  let visitedNodes: string[] = [];
  let pressureReleased: PressureReleased = {
    ['AA']: { visitedAt: 30, pressureReleased: 0 },
  }; // This to be the total pressure released upon moving to, and opening that node. This is the value we are trying to maximize.

  // Filter out the graph so that only nodes that have flowRates are considered
  //   const useGraph = graph.filter((node) => node.flowRate > 0);

  // let node = findClosestDistanceNode(pressureReleased, visitedNodes);
  let node = findMostPressureReleasedNode(pressureReleased, visitedNodes);

  while (node) {
    visitPressureNode(node, pressureReleased, graph, visitedNodes, distances);
    node = findMostPressureReleasedNode(pressureReleased, visitedNodes);
  }

  return pressureReleased;
};

export const day16 = () => {
  const input = fs.readFileSync('src/day-16/test.txt', 'utf-8').split('\n');

  const graph = createGraph(input);

  const distances = createDistances(graph);

  const results = findMostPressureReleasedPath(graph, distances);

  //   console.log(distances);

  //   const paths = createAllPaths(graph);

  //   let results: number[] = [];

  //   for (let path of Object.values(paths)) {
  //     results.push(simulatePath(path, graph, distances));
  //     resetGraph(graph);
  //   }

  console.log(results);

  let sum = 0;
  for (let [key, value] of Object.entries(results)) {
    sum += value.pressureReleased;
  }
  console.log(sum);

  //   console.log(paths);

  //   printGraph(graph);
  //   console.log(getTotalPressureReleased(graph));
};
