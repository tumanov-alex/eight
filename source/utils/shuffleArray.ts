import type { tile as tileType } from '../screens/App';
import { emptyTile } from '../screens/App';
import { getWithoutEmptyTile } from './getWithoutEmptyTile';
import { getInversionCount } from './getInversionCount';

const shuffleArray = (arr: number[]): number[] =>
  Array(arr.length)
    .fill(null)
    .map((_, i) => [Math.random(), i])
    .sort(([a], [b]) => a - b)
    .map(([, i]) => arr[i]);

// todo: add support for matrices bigger than 3
const getSolvableShuffle = (arr: number[]): number[] => {
  const shuffled = shuffleArray(arr);
  const inversionCount = getInversionCount(shuffled);

  return inversionCount % 2 === 0 ? shuffled : getSolvableShuffle(arr);
};

export const shuffleTiles = (array: tileType[]): tileType[] => [
  ...getSolvableShuffle(getWithoutEmptyTile(array)),
  emptyTile,
];
