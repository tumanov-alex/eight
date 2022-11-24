import { useCallback, useEffect, useState, useRef } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { shuffleTiles } from '../utils/shuffleArray';
import { compareArrays } from '../utils/compareArrays';
import { useIsGameFinished } from './useIsGameFinished';

export const emptyTile = null;
export type tileType = number | typeof emptyTile;
export const tilesInOrder: tileType[] = [1, 2, 3, 4, 5, 6, 7, 8, emptyTile];

export const useTiles = (isGameFinished: boolean) => {
  const [tiles, setTilesState] = useState<tileType[]>([]);
  const { getItem: getTilesStore, setItem: setTilesStore } =
    useAsyncStorage('@tiles');
  const isTilesInOrder = compareArrays(tiles, tilesInOrder);
  const isTilesInOrderCache = useRef({
    prev: isTilesInOrder,
    last: isTilesInOrder,
  });
  const { setIsGameFinished } = useIsGameFinished();

  if (isTilesInOrderCache.current.last !== isTilesInOrder) {
    isTilesInOrderCache.current = {
      prev: isTilesInOrderCache.current.last,
      last: isTilesInOrder,
    };
  }

  const setTiles = useCallback(
    (nums: tileType[]) => {
      setTilesStore(JSON.stringify(nums));
      setTilesState(nums);
    },
    [setTilesStore],
  );

  const readFromAsyncStore = useCallback(async () => {
    try {
      const resJson = await getTilesStore();

      if (resJson !== null) {
        setTilesState(JSON.parse(resJson));
      } else {
        setTiles(shuffleTiles(tilesInOrder));
      }
    } catch (e) {
      console.error(e);
    }
  }, [getTilesStore, setTiles]);

  useEffect(() => {
    !tiles.length && readFromAsyncStore();
  }, [readFromAsyncStore, tiles.length]);

  useEffect(() => {
    if (isTilesInOrderCache.current.prev === false && isTilesInOrderCache.current.last) {
      // setIsGameFinished(true);
    } else if (isTilesInOrderCache.current.prev && isTilesInOrderCache.current.last === false) {
      // setIsGameFinished(false);
    }
  }, [isTilesInOrderCache, setIsGameFinished]);

  return { tiles, setTiles };
};