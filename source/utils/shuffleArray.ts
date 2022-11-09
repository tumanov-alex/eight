import type { tile as tileType } from '../screens/App';
import { emptyTile } from '../screens/App';
import { getWithoutEmptyTile } from './getWithoutEmptyTile';
import { getInvariantCount } from './getInvariantCount';

function shuffleArray(arr: any[]): any[] {
  return Array(arr.length)
    .fill(null)
    .map((_, i) => [Math.random(), i])
    .sort(([a], [b]) => a - b)
    .map(([, i]) => arr[i]);
}

// todo: add support for matrices bigger than 3
const getSolvableShuffle = <T>(arr: T[]): T[] => {
  const shuffled = shuffleArray(arr);
  const invariantCount = getInvariantCount(shuffled);

  return invariantCount % 2 === 0 ? shuffled : getSolvableShuffle(arr);
};

// const shuffleArray = <T>(array: T[]): T[] => {
//   const arr = [...array];
//   let currentIndex = arr.length;
//   let randomIndex;
//
//   // While there remain elements to shuffle.
//   while (currentIndex !== 0) {
//     // Pick a remaining element.
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//
//     // And swap it with the current element.
//     [arr[currentIndex], arr[randomIndex]] = [
//       arr[randomIndex],
//       arr[currentIndex],
//     ];
//   }
//
//   console.log(getInvariantCount(array))
//   console.log('========= getInvariantCount(array)  ==========')
//
//   return arr;
// };

export const shuffleTiles = (array: tileType[]): tileType[] => [
  ...getSolvableShuffle(getWithoutEmptyTile(array)),
  emptyTile,
];
