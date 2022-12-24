import React, { useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
  Text,
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

export type OnTileMove = (position1: number, position2: number) => void;
interface GameProps {
  onReset: () => void;
  onShuffle: () => void;
  moveCount: number;
  bestMoveCount: number;
  tiles: tileType[];
  onTileMove: OnTileMove;
}
const Game = ({
  onReset,
  onShuffle,
  moveCount,
  bestMoveCount,
  tiles,
  onTileMove,
}: GameProps) => (
  <View style={styles.fieldContainer}>
    <Buttons onReset={onReset} onShuffle={onShuffle} />

    <Text style={styles.scoreContainer}>
      Current: {moveCount}
      {'\n'}
      Best: {bestMoveCount}
    </Text>

    <Field tiles={tiles} onTileMove={onTileMove} />
  </View>
);

export const App = () => {
  const colors = useColors();
  const { tiles, setTiles } = useTiles(); // todo: move to Tile.tsx?
  const { isGameFinished, setIsGameFinished } = useIsGameFinished(tiles);
  const { moveCount, bestMoveCount, incrementMoveCount, resetMoveCount } =
    useMoveCount(tiles);
  const isResetting = useRef(false);
  const isResultShownRef = useRef(false);

  // todo: move to Tile.tsx?
  const onTileMove: OnTileMove = useCallback(
    (position1, position2) => {
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
    console.log('R E S E T');
  }, [resetMoveCount, setTiles]);

  const onShuffle = useCallback(() => {
    setIsGameFinished(false);
    setTiles(shuffleTiles(tilesInOrder));
    resetMoveCount();
    console.log('S H U F F L E');
  }, [resetMoveCount, setIsGameFinished, setTiles]);

  useEffect(() => {
    const isOkToShowResult =
      !isResetting.current &&
      !isResultShownRef.current &&
      moveCount > 0 &&
      moveCount !== bestMoveCount &&
      bestMoveCount < Infinity;

    if (isGameFinished && isOkToShowResult) {
      Alert.alert(
        `Your score is ${moveCount.toString()}`,
        `Your best score is ${bestMoveCount.toString()}`,
      );

      isResultShownRef.current = true;
      const timeout = setTimeout(() => {
        isResultShownRef.current = false;
        clearTimeout(timeout);
      }, 5000);
    }
  }, [isGameFinished, moveCount, bestMoveCount, setIsGameFinished]);

  return (
    <SafeAreaView style={styles.container('black')}>
      {tiles.length ? (
        <Game // todo: pass props as object?
          onReset={onReset}
          onShuffle={onShuffle}
          moveCount={moveCount}
          bestMoveCount={bestMoveCount}
          tiles={tiles}
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
