import { emptyTile, tileType } from '../hooks/useTiles';

// todo: remove any
export const getWithoutEmptyTile = (tiles: tileType[]): any[] =>
  tiles.filter((tile) => tile !== emptyTile);
