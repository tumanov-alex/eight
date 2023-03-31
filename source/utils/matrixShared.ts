import Animated, { runOnJS } from 'react-native-reanimated';

// todo: add support for matrices bigger than 3

const gameFieldSize = 3;
const totalFieldSize = gameFieldSize ** 2;

export const isAxisY = (
  n1: Animated.SharedValue<unknown>,
  n2: Animated.SharedValue<unknown>,
) => {
  'worklet';
  const upTwo = n1 - gameFieldSize * 2;
  const upOne = n1 - gameFieldSize;
  const downTwo = n1 + gameFieldSize * 2;
  const downOne = n1 + gameFieldSize;

  return n2 === upTwo || n2 === upOne || n2 === downTwo || n2 === downOne;
};

export const isAxisX = (
  n1: Animated.SharedValue<unknown>,
  n2: Animated.SharedValue<unknown>,
) => {
  'worklet';
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
    default:
      return false;
  }
};

export const isXYAxisShared = (
  n1: Animated.SharedValue<unknown>,
  n2: Animated.SharedValue<unknown>,
) => isAxisY(n1, n2) || isAxisX(n1, n2);

const getRightRowPositions = () => {
  const positions = [];

  for (let i = gameFieldSize - 1; i < totalFieldSize; i += gameFieldSize) {
    positions.push(i);
  }

  return positions;
};

const rightRowPositions = getRightRowPositions();

export const isMovableUp = (
  position: Animated.SharedValue<unknown>,
  emptyTilePosition: Animated.SharedValue<unknown>,
): boolean => {
  'worklet';
  const isOnTopRow = position < gameFieldSize;
  const isTopTileEmpty = emptyTilePosition === position - gameFieldSize;

  return !isOnTopRow && isTopTileEmpty;
};

export const isMovableDown = (
  position: Animated.SharedValue<unknown>,
  emptyTilePosition: Animated.SharedValue<unknown>,
): boolean => {
  'worklet';
  const bottomRightTilePosition = totalFieldSize - 1;
  const bottomLeftTilePosition = totalFieldSize - gameFieldSize;
  const isOnBottomRow =
    position >= bottomLeftTilePosition && position <= bottomRightTilePosition;
  const isBottomTileEmpty = emptyTilePosition === position + gameFieldSize;

  return !isOnBottomRow && isBottomTileEmpty;
};

export const isMovableLeft = (
  position: Animated.SharedValue<unknown>,
  emptyTilePosition: Animated.SharedValue<unknown>,
): boolean => {
  'worklet';
  const isOnLeftRow = position % gameFieldSize === 0;
  const isLeftTileEmpty = emptyTilePosition === position - 1;

  return !isOnLeftRow && isLeftTileEmpty;
};

export const isMovableRight = (
  position: Animated.SharedValue<unknown>,
  emptyTilePosition: Animated.SharedValue<unknown>,
): boolean => {
  'worklet';
  const isOnRightRow = rightRowPositions.includes(position);
  const isRightTileEmpty = emptyTilePosition === position + 1;

  return !isOnRightRow && isRightTileEmpty;
};
