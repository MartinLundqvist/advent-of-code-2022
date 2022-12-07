import fs from 'fs';

type FileSystemNode = {
  name: string;
  type: 'file' | 'directory';
  children: FileSystemNode[];
  parent: FileSystemNode | null;
  size: number;
};

class FileSystem {
  private cwd: FileSystemNode;
  private root: FileSystemNode;

  constructor() {
    this.root = {
      name: '/',
      type: 'directory',
      children: [],
      parent: null,
      size: 0,
    };
    this.cwd = this.root;
  }

  public getCWD() {
    return this.cwd;
  }

  public getRoot() {
    return this.root;
  }

  public addFileToCWD(name: string, size: number) {
    const file: FileSystemNode = {
      name,
      type: 'file',
      children: [],
      parent: this.cwd,
      size,
    };
    this.cwd.children.push(file);
  }

  public addDirectoryToCWD(name: string) {
    const directory: FileSystemNode = {
      name,
      type: 'directory',
      children: [],
      parent: this.cwd,
      size: 0,
    };
    this.cwd.children.push(directory);
  }
  public changeCWD(name: string) {
    if (name === '..') {
      if (this.cwd.parent) {
        this.cwd = this.cwd.parent;
      }
      return;
    }

    if (name === '/') {
      this.cwd = this.root;
    }

    const directory = this.cwd.children.find((child) => child.name === name);
    if (directory) {
      this.cwd = directory;
    }
  }

  private static printNode(node: FileSystemNode) {
    console.log(`- ${node.name} (${node.type}, ${node.size})`);
    node.children.forEach(FileSystem.printNode);
  }
  public printFileSystem() {
    FileSystem.printNode(this.root);
  }

  public getSizeOfNode(node: FileSystemNode) {
    let size = node.size;
    node.children.forEach((child) => {
      size += this.getSizeOfNode(child);
    });
    return size;
  }

  public getSizesOfAllDirectories() {
    const sizes: { name: string; size: number }[] = [];
    const queue: FileSystemNode[] = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        if (node.type === 'directory') {
          sizes.push({ name: node.name, size: this.getSizeOfNode(node) });
        }
        node.children.forEach((child) => queue.push(child));
      }
    }
    return sizes;
  }
}

export const day7 = () => {
  const terminalLines = fs
    .readFileSync('./src/day-7/data.txt', 'utf-8')
    .split('\n');

  const fileSystem = new FileSystem();

  const executeCommand = (args: string[], lineNr: number) => {
    if (args[0] === 'cd') {
      //   console.log(`Changing working directory to ${args[1]}`);
      fileSystem.changeCWD(args[1]);
      return;
    }

    if (args[0] === 'ls') {
      //   console.log(`Adding directory contents`);

      lineNr++;
      while (terminalLines[lineNr] && terminalLines[lineNr][0] !== '$') {
        const [size, name] = terminalLines[lineNr].split(' ');
        if (size === 'dir') {
          //   console.log(`Adding directory ${name}`);
          fileSystem.addDirectoryToCWD(name);
        } else {
          //   console.log(`Adding file ${name} with size ${size}`);
          fileSystem.addFileToCWD(name, Number(size));
        }
        lineNr++;
      }
    }
  };

  let lineNr = 0;
  while (lineNr < terminalLines.length) {
    const line = terminalLines[lineNr];
    const args = line.split(' ');
    if (args[0] === '$') {
      executeCommand(args.slice(1), lineNr);
    }
    lineNr++;
  }

  const sizes = fileSystem.getSizesOfAllDirectories();
  let totalSizeLTX = (x: number) =>
    sizes.reduce((prev, curr) => prev + (curr.size < x ? curr.size : 0), 0);

  const totalSpace = 70_000_000;
  const usedSpace = fileSystem.getSizeOfNode(fileSystem.getRoot());
  const neededSpace = 30_000_000;
  const freeSpace = totalSpace - usedSpace;
  const spaceToFreeUp = neededSpace - freeSpace;

  const filteredSizes = sizes.filter((size) => size.size > spaceToFreeUp);
  filteredSizes.sort((a, b) => a.size - b.size);

  console.log(`Answer to part 1 is: ${totalSizeLTX(100000)}`);
  console.log(`Answer to part 2 is: ${filteredSizes[0].size}`);
};
