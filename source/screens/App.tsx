import React, { useEffect, useState } from 'react';
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
  const [isResetting, setIsResetting] = useState(false);

  const onTileMove: OnTileMove = (position1, position2) => {
    incrementMoveCount();
    setTiles(swap(position1, position2, tiles));
  };

  const onReset = () => {
    setIsResetting(true);
    setTimeout(() => setIsResetting(false), 10000); // todo: make it work without setTimeout
    setTiles(tilesInOrder);
    resetMoveCount();
    console.log('R E S E T');
  };
  const onShuffle = () => {
    setIsGameFinished(false);
    setTiles(shuffleTiles(tilesInOrder));
    resetMoveCount();
    console.log('S H U F F L E');
  };

  const Game = () => (
    <View style={styles.fieldContainer}>
      <Buttons onReset={onReset} onShuffle={onShuffle} />

      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 40 }}>
        {moveCount}
        {'\n'}
        {bestMoveCount}
      </Text>

      <Field tiles={tiles} onTileMove={onTileMove} />
    </View>
  );

  useEffect(() => {
    console.log(moveCount, bestMoveCount, isGameFinished)
    console.log('========= moveCount, bestMoveCount, isGameFinished  ==========')
    if (isGameFinished && isResetting === false) {
      Alert.alert(
        `Your score is ${moveCount.toString()}`,
        bestMoveCount < Infinity
          ? `Your best score is ${bestMoveCount.toString()}`
          : undefined,
      );
    }
  }, [
    isGameFinished,
    moveCount,
    bestMoveCount,
    setIsGameFinished,
    isResetting,
  ]);

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
  },
});
