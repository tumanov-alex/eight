import { emptyTile } from '../hooks/useTiles';
import { getWithoutEmptyTile } from './getWithoutEmptyTile';
import { getInversionCount } from './getInversionCount';
import { tileType as tileType } from '../hooks/useTiles';

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
