import React, { useEffect, memo, useCallback, useRef } from 'react';
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
import { tilesInOrder, useTiles } from '../hooks/useTiles';
import { useIsGameFinished } from '../hooks/useIsGameFinished';

export type OnTileMove = (position1: number, position2: number) => void;

export const App = () => {
  const colors = useColors();
  const { tiles, setTiles } = useTiles(); // todo: move to Tile.tsx?
  const { isGameFinished, setIsGameFinished } = useIsGameFinished(tiles);
  const { moveCount, bestMoveCount, incrementMoveCount, resetMoveCount } =
    useMoveCount(tiles);
  const isResetting = useRef(false);
  const isResultShownRef = useRef(false);

  // todo: move to Tile.tsx?
  const onTileMove: OnTileMove = (position1, position2) => {
    incrementMoveCount();
    setTiles(swap(tiles, position1, position2));
  };

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

  const ButtonsBar = memo(() => (
    <Buttons onReset={onReset} onShuffle={onShuffle} />
  ));
  const Game = () => (
    <View style={styles.fieldContainer}>
      <ButtonsBar />

      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 40 }}>
        Current: {moveCount}
        {'\n'}
        Best: {bestMoveCount}
      </Text>

      <Field tiles={tiles} onTileMove={onTileMove} />
    </View>
  );

  useEffect(() => {
    if (
      !isResultShownRef.current &&
      isGameFinished &&
      !isResetting.current &&
      moveCount > 0
    ) {
      Alert.alert(
        `Your score is ${moveCount.toString()}`,
        bestMoveCount < Infinity
          ? `Your best score is ${bestMoveCount.toString()}`
          : undefined,
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
      {tiles.length ? <Game /> : <ActivityIndicator color={colors.main} />}
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
});
