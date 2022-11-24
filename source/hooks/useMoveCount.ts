import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { useIsGameFinished } from './useIsGameFinished';
import { tileType } from './useTiles';

interface MoveCount {
  last: number;
  previous: number;
}

export const useMoveCount = (tiles: tileType[]) => {
  // const [moveCount, setMoveCount] = useState(0);
  const moveCount = useRef(0);
  // const [moveCount, setMoveCount] = useState<MoveCount>({
  //   last: 0,
  //   previous: 0,
  // });
  // const [moveCountDisplay, setMoveCountDisplay] = useState(moveCount);
  const { setItem: setMoveCountStore, getItem: getMoveCountStore } =
    useAsyncStorage('@moveCount');
  // const [bestMoveCount, setBestMoveCount] = useState(Infinity);
  const bestMoveCount = useRef(Infinity);
  // const [bestMoveCountDisplay, setBestMoveCountDisplay] =
  //   useState(bestMoveCount);
  const { setItem: setBestMoveCountStore, getItem: getBestMoveCountStore } =
    useAsyncStorage('@bestMoveCount');
  const { isGameFinished } = useIsGameFinished();
  // const [isGameFinishedCache, setIsGameFinishedCache] = useState({
  //   last: isGameFinished,
  //   prev: null,
  // });

  // useEffect(() => {
  //   setIsGameFinishedCache((previous) => ({
  //     prev: previous.last,
  //     last: isGameFinished,
  //   }));
  // }, [isGameFinished]);

  const previousIsGameFinished = useRef(null);
  const isSkipNextBestCount = useRef(false);
  // removeItem();
  // console.log(moveCount)
  // console.log('========= moveCount  ==========')
  // console.log(bestMoveCount)
  // console.log('========= bestMoveCount  ==========')

  // todo: save to async store only when app is closing
  const setMoveCountAndStore = useCallback(
    (count: number) => {
      setMoveCountStore(count.toString());
      moveCount.current = count;
      // setMoveCount(count);
      // setMoveCount((prev) => ({
      //   previous: prev.last,
      //   last: count,
      // }));
    },
    [setMoveCountStore],
  );

  const increment = () => setMoveCountAndStore(moveCount.current + 1);
  const reset = () => setMoveCountAndStore(0);

  const getMoveCountFromStore = useCallback(async () => {
    try {
      const item = await getMoveCountStore();

      if (item !== null) {
        // console.log('========= set  ==========');
        // setMoveCount(JSON.parse(item));
        // setMoveCount((prev) => ({
        //   previous: prev.last,
        //   last: JSON.parse(item),
        // }));
        moveCount.current = JSON.parse(item);
      }
    } catch (e) {
      console.error(e);
    }
  }, [getMoveCountStore]);

  // const getBestMoveCountFromStore = useCallback(async () => {
  //   try {
  //     const item = await getBestMoveCountStore();
  //
  //     // console.log(item);
  //     // console.log('========= item  ==========');
  //     if (item !== null) {
  //       setBestMoveCount(JSON.parse(item));
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [getBestMoveCountStore]);

  useEffect(() => {
    getMoveCountFromStore();
  }, [getMoveCountFromStore]);

  // useEffect(() => {
  //   getBestMoveCountFromStore();
  // }, [getBestMoveCountFromStore]);

  // useEffect(() => {
  //   return () => {
  //     console.log('========= only once  ==========')
  //     setBestMoveCountStore(bestMoveCount.toString());
  //   };
  // }, [bestMoveCount]);

  // useEffect(() => {
  //   previousIsGameFinished
  // }, [isGameFinished]);

  /*
   * have prevIsGameFinished & prevMoveCount
   * if isGameFinished === prevIsGameFinished && prevMoveCount !== moveCount —> skip
   * */

  useEffect(() => {
    // console.log(isGameFinished, moveCount, bestMoveCount);
    // console.log(
    //   '========= isGameFinished, moveCount, bestMoveCount  ==========',
    // );

    // if (
    //   isGameFinished.last === isGameFinished.previous &&
    //   moveCount.last !== moveCount.previous
    // ) {
    //   return;
    // }

    // console.log(isGameFinished)
    // console.log('========= isGameFinished  ==========')

    if (isGameFinished && moveCount.current < bestMoveCount.current) {
      // console.log('========= reset best move count  ==========');
      // isSkipNextBestCount.current = true;
      // setBestMoveCount(moveCount.current);
      bestMoveCount.current = moveCount.current;
      setBestMoveCountStore(moveCount.current.toString());
    }
  }, [bestMoveCount, isGameFinished, moveCount, setBestMoveCountStore]);

  // useEffect(() => {
  //   console.log(isGameFinishedCache.last, moveCount.last, bestMoveCount.current)
  //   console.log('========= isGameFinished, moveCount.last, bestMoveCount.current  ==========')
  //   if (
  //     isGameFinishedCache.last !== isGameFinishedCache.prev &&
  //     moveCount.last === moveCount.previous
  //   ) {
  //     if (isGameFinishedCache.last && moveCount.last < bestMoveCount.current) {
  //       bestMoveCount.current = moveCount.last;
  //       setBestMoveCountStore(moveCount.last.toString());
  //     }
  //   }
  // }, [isGameFinishedCache, moveCount, setBestMoveCountStore]);

  return {
    moveCount: moveCount.current,
    bestMoveCount: bestMoveCount.current,
    incrementMoveCount: increment,
    resetMoveCount: reset,
  };
};
