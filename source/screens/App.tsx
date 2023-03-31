import React, { useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import 'react-native-gesture-handler'; // import before using, to avoid app crash

import { Field } from '../components/Field';
import Buttons from '../components/Buttons';
import { shuffleTiles } from '../utils/shuffleArray';
import { useColors } from '../hooks/useColors';
import { swap } from '../utils/swap';
import { useMoveCount } from '../hooks/useMoveCount';
import { tilesInOrder, tileType, useTiles } from '../hooks/useTiles';
import { useIsGameFinished } from '../hooks/useIsGameFinished';
import { useTilesSharedValue } from '../hooks/useTilesSharedValue';

export type OnTileMove = (
  position1: number,
  position2: number,
  postCallback: Function,
) => void;
interface GameProps {
  onReset: () => void;
  onShuffle: () => void;
  tiles: tileType[];
  onTileMove: OnTileMove;
}

const Game = ({
  onReset,
  onShuffle,
  tiles,
  tilesSharedValue,
  emptyTileIndex,
  isGameFinishedShared,
  onTileMove,
  swapTiles,
}: GameProps) => (
  <View style={styles.fieldContainer}>
    <Buttons onReset={onReset} onShuffle={onShuffle} />

    <Field
      tiles={tiles}
      tilesSharedValue={tilesSharedValue}
      emptyTileIndex={emptyTileIndex}
      isGameFinishedShared={isGameFinishedShared}
      onTileMove={onTileMove}
      swapTiles={swapTiles}
    />
  </View>
);

export const App = () => {
  const colors = useColors();
  const {
    tilesSharedValue,
    reset,
    shuffle,
    emptyTileIndex,
    isGameFinishedShared,
    swapTiles,
  } = useTilesSharedValue();
  const { tiles, setTiles } = useTiles(); // todo: move to Tile.tsx?
  const { isGameFinished, setIsGameFinished } = useIsGameFinished(tiles);
  const { moveCount, bestMoveCount, incrementMoveCount, resetMoveCount } =
    useMoveCount(tiles);
  const isResetting = useRef(false);
  const isEndGameMessageShownRef = useRef(false);
  const onTileMovePostCallbackRef = useRef<Function>(() => {});

  // todo: move to Tile.tsx?
  const onTileMove: OnTileMove = useCallback(
    (position1, position2, postCallback) => {
      onTileMovePostCallbackRef.current = postCallback;
      incrementMoveCount();
      setTiles(swap(tiles, position1, position2));
    },
    [incrementMoveCount, setTiles, tiles],
  );

  const onReset = useCallback(() => {
    isResetting.current = true;
    const timeout = setTimeout(() => {
      isResetting.current = false;
      clearTimeout(timeout); // todo: is this needed?
    }, 10000); // todo: make it work without setTimeout
    setTiles(tilesInOrder);
    resetMoveCount();
    reset();
  }, [reset, resetMoveCount, setTiles]);

  const onShuffle = useCallback(() => {
    setIsGameFinished(false);
    setTiles(shuffleTiles(tilesInOrder));
    resetMoveCount();
    shuffle();
  }, [resetMoveCount, setIsGameFinished, setTiles, shuffle]);

  useEffect(() => {
    const isNotResettingOrShowingResult =
      !isResetting.current && !isEndGameMessageShownRef.current;
    const isEndGameState =
      isGameFinished &&
      moveCount > 0 &&
      moveCount !== bestMoveCount &&
      bestMoveCount < Infinity;
    const isOkToShowEndGameMessage =
      isNotResettingOrShowingResult && isEndGameState;

    if (isOkToShowEndGameMessage) {
      Alert.alert(
        `Your score is ${moveCount.toString()}`,
        `Your best score is ${bestMoveCount.toString()}`,
      );

      isEndGameMessageShownRef.current = true;
      const timeout = setTimeout(() => {
        isEndGameMessageShownRef.current = false;
        clearTimeout(timeout);
      }, 5000);
    }
  }, [isGameFinished, moveCount, bestMoveCount, setIsGameFinished]);

  useEffect(() => {
    onTileMovePostCallbackRef.current();
  }, [tiles]);

  return (
    <SafeAreaView style={styles.container('black')}>
      {tiles.length ? (
        <Game // todo: pass props as object?
          onReset={onReset}
          onShuffle={onShuffle}
          tiles={tiles}
          tilesSharedValue={tilesSharedValue}
          isGameFinishedShared={isGameFinishedShared}
          emptyTileIndex={emptyTileIndex}
          swapTiles={swapTiles}
          onTileMove={onTileMove}
        />
      ) : (
        <ActivityIndicator color={colors.main} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create<any>({
  container: (backgroundColor: 'string') => ({
    flex: 1,
    backgroundColor,
  }),
  fieldContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  scoreContainer: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 40,
  },
});
