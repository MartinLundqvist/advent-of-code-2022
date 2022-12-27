interface Element {
  id: number;
  isGrounded: boolean;
  position: {
    x: number;
    y: number;
  };
  shape: {
    x: number;
    y: number;
  }[];
  height: number;
}

class Rock0 implements Element {
  id: number;
  position: { x: number; y: number };
  isGrounded: boolean;
  shape: { x: number; y: number }[];
  height: number;
  constructor(id: number) {
    this.id = id;
    this.isGrounded = false;
    this.position = { x: 0, y: 0 };
    this.shape = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ];
    this.height = this.shape[0].y;
  }
}
class Rock1 implements Element {
  id: number;
  position: { x: number; y: number };
  isGrounded: boolean;
  height: number;
  shape: { x: number; y: number }[];
  constructor(id: number) {
    this.id = id;
    this.isGrounded = false;
    this.position = { x: 0, y: 0 };
    this.shape = [
      { x: 1, y: 2 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 2, y: 1 },
    ];
    this.height = this.shape[0].y;
  }
}
class Rock2 implements Element {
  id: number;
  position: { x: number; y: number };
  isGrounded: boolean;
  height: number;
  shape: { x: number; y: number }[];
  constructor(id: number) {
    this.id = id;
    this.isGrounded = false;
    this.position = { x: 0, y: 0 };
    this.shape = [
      { x: 2, y: 2 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
    ];
    this.height = this.shape[0].y;
  }
}
class Rock3 implements Element {
  id: number;
  position: { x: number; y: number };
  isGrounded: boolean;
  height: number;
  shape: { x: number; y: number }[];
  constructor(id: number) {
    this.id = id;
    this.isGrounded = false;
    this.position = { x: 0, y: 0 };
    this.shape = [
      { x: 0, y: 3 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ];
    this.height = this.shape[0].y;
  }
}
class Rock4 implements Element {
  id: number;
  position: { x: number; y: number };
  isGrounded: boolean;
  height: number;
  shape: { x: number; y: number }[];
  constructor(id: number) {
    this.id = id;
    this.isGrounded = false;
    this.position = { x: 0, y: 0 };
    this.shape = [
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    this.height = this.shape[0].y;
  }
}

const createRockFactory = () => {
  let currentRock = -1;
  let rockId = 0;

  const getNextRock = () => {
    currentRock = currentRock === 4 ? 0 : currentRock + 1;

    rockId++;

    // console.log('Creating rock', rockId);
    switch (currentRock) {
      case 0:
        return new Rock0(rockId);
      case 1:
        return new Rock1(rockId);
      case 2:
        return new Rock2(rockId);
      case 3:
        return new Rock3(rockId);
      case 4:
        return new Rock4(rockId);
    }
  };

  return {
    getNextRock,
  };
};

export { createRockFactory, Element, Rock0, Rock1, Rock2, Rock3, Rock4 };
