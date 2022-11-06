import { emptyTile } from '../screens/App';
import { getWithoutEmptyTile } from './getWithoutEmptyTile';
import type { tile as tileType } from '../screens/App';

const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  let currentIndex = arr.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
};

export const shuffleTiles = (array: tileType[]): tileType[] => [
  ...shuffleArray(getWithoutEmptyTile(array)),
  emptyTile,
];
