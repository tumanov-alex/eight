// todo: add support for matrices bigger than 3
const gameFieldSize = 3;

export const isAxisY = (n1: number, n2: number) => {
  const upTwo = n1 - gameFieldSize * 2;
  const upOne = n1 - gameFieldSize;
  const downTwo = n1 + gameFieldSize * 2;
  const downOne = n1 + gameFieldSize;

  return n2 === upTwo || n2 === upOne || n2 === downTwo || n2 === downOne;
};

export const isAxisX = (n1: number, n2: number) => {
  switch (n1) {
    case 0:
    case 1:
    case 2: {
      return n2 === 0 || n2 === 1 || n2 === 2;
    }
    case 3:
    case 4:
    case 5: {
      return n2 === 3 || n2 === 4 || n2 === 5;
    }
    case 6:
    case 7:
    case 8: {
      return n2 === 6 || n2 === 7 || n2 === 8;
    }
  }
};

export const isXYAxis = (n1: number, n2: number) =>
  isAxisY(n1, n2) || isAxisX(n1, n2);
