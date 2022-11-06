import type { tile } from '../screens/App';
import { emptyTile } from '../screens/App';

export const getWithoutEmptyTile = (nums: tile[]) =>
  nums.filter((tile) => tile !== emptyTile);
