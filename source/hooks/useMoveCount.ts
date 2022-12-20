import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { useIsGameFinished } from './useIsGameFinished';
import { tileType } from './useTiles';

interface MoveCount {
  last: number;
  previous: number;
}

export const useMoveCount = (tiles: tileType[]) => {
  const [moveCount, setMoveCount] = useState(0);
  const { setItem: setMoveCountStore, getItem: getMoveCountStore } =
    useAsyncStorage('@moveCount');
  const [bestMoveCount, setBestMoveCount] = useState(Infinity);
  const { setItem: setBestMoveCountStore, getItem: getBestMoveCountStore } =
    useAsyncStorage('@bestMoveCount');
  const { isGameFinished } = useIsGameFinished(tiles);

  // todo: save to async store only when app is closing
  const setMoveCountAndStore = useCallback(
    (count: number) => {
      setMoveCountStore(count.toString());
      setMoveCount(count);
    },
    [setMoveCountStore],
  );

  const increment = () => setMoveCountAndStore(moveCount + 1);
  const reset = () => setMoveCountAndStore(0);

  const getMoveCountFromStore = useCallback(async () => {
    try {
      const item = await getMoveCountStore();

      if (item !== null) {
        setMoveCount(JSON.parse(item));
      }
    } catch (e) {
      console.error(e);
    }
  }, [getMoveCountStore]);

  const getBestMoveCountFromStore = useCallback(async () => {
    try {
      const item = await getBestMoveCountStore();

      if (item !== null) {
        setBestMoveCount(JSON.parse(item));
      }
    } catch (e) {
      console.error(e);
    }
  }, [getBestMoveCountStore]);

  useEffect(() => {
    getMoveCountFromStore();
  }, [getMoveCountFromStore]);

  useEffect(() => {
    getBestMoveCountFromStore();
  }, [getBestMoveCountFromStore]);

  useEffect(() => {
    if (
      isGameFinished &&
      moveCount > 0 && // don't overwrite bestMoveCount on extra re-renders
      moveCount < bestMoveCount
    ) {
      setBestMoveCount(moveCount);
      setBestMoveCountStore(moveCount.toString());
    }
  }, [bestMoveCount, isGameFinished, moveCount, setBestMoveCountStore]);

  return {
    moveCount,
    bestMoveCount,
    incrementMoveCount: increment,
    resetMoveCount: reset,
  };
};
