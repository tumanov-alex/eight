import type { tile } from '../screens/App';
import { emptyTile } from '../screens/App';

// todo: remove any
export const getWithoutEmptyTile = (tiles: tile[]): any[] =>
  tiles.filter((tile) => tile !== emptyTile);
