const gameMatrixSize = 3;
const horizontalTileDiff = 1;

export const isAxisY = (n1: number, n2: number) => {
  const upTwo = n1 - gameMatrixSize * 2;
  const upOne = n1 - gameMatrixSize;
  const downTwo = n1 + gameMatrixSize * 2;
  const downOne = n1 + gameMatrixSize;

  return n2 === upTwo || n2 === upOne || n2 === downTwo || n2 === downOne;
};

export const isAxisX = (n1: number, n2: number) => {
  const leftTwo = n1 - horizontalTileDiff * 2;
  const leftOne = n1 - horizontalTileDiff;
  const rightTwo = n1 + horizontalTileDiff * 2;
  const rightOne = n1 + horizontalTileDiff;

  return n2 === leftTwo || n2 === leftOne || n2 === rightTwo || n2 === rightOne;
};

export const isXYAxis = (n1: number, n2: number) =>
  isAxisY(n1, n2) || isAxisX(n1, n2);
