import { useEffect, useState, useRef } from 'react';

import { compareArrays } from '../utils/compareArrays';
import { tilesInOrder, tileType } from './useTiles';

interface IsGameFinished {
  last: boolean;
  previous: boolean;
}

export const useIsGameFinished = () => {
  // const [isGameFinished, setIsGameFinished] = useState<IsGameFinished>({
  //   last: false,
  //   previous: false,
  // });
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    // console.log(isGameFinished)
    // console.log('========= isGameFinished  ==========')
    // todo: move into useTiles.ts
    // const isTilesInOrder = compareArrays(tiles, tilesInOrder);
    // console.log(tiles)
    // console.log('========= tiles  ==========')

    // if (isGameFinished === false && isTilesInOrder) {
    //   setIsGameFinished(true);
    //   // setIsGameFinished((prev) => ({
    //   //   previous: prev.last,
    //   //   last: true,
    //   // }));
    // } else if (isGameFinished && isTilesInOrder === false) {
    //   setIsGameFinished(false);
    //   // setIsGameFinished((prev) => ({
    //   //   previous: prev.last,
    //   //   last: false,
    //   // }));
    // }
  }, [isGameFinished]);

  return { isGameFinished, setIsGameFinished };
};
