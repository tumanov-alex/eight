import { useSharedValue, useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { shuffleTiles } from '../utils/shuffleArray';

export const emptyTile = null;
export type tileType = number | typeof emptyTile;
export const tilesInOrder: tileType[] = [1, 2, 3, 4, 5, 6, 7, 8, emptyTile];

export const useTilesSharedValue = () => {
  const tiles = useSharedValue<tileType[]>([]);

  if (!tiles.value.length) {
    tiles.value = shuffleTiles(tilesInOrder);
  }

  const isGameFinished = useDerivedValue(() => {
    return tiles.value.every((tile, index) => tile === tilesInOrder[index]);
  }, [tiles.value]);

  const emptyTileIndex = useDerivedValue(() => {
    return tiles.value.findIndex((tile) => tile === emptyTile);
  }, [tiles.value]);

  const reset = () => {
    tiles.value = tilesInOrder;
  };

  const shuffle = () => {
    tiles.value = shuffleTiles(tilesInOrder);
  };

  const swap = (indexA: number, indexB: number): SharedValue<tileType[]> => {
    'worklet';
    const tmp = tiles.value[indexA];
    tiles.value[indexA] = tiles.value[indexB];
    tiles.value[indexB] = tmp;
    // [tiles.value[indexA], tiles.value[indexB]] = [
    //   tiles.value[indexB],
    //   tiles.value[indexA],
    // ];

    return tiles;
  };

  return {
    tilesSharedValue: tiles,
    reset,
    shuffle,
    emptyTileIndex,
    isGameFinishedShared: isGameFinished,
    swapTiles: swap,
  };
};
