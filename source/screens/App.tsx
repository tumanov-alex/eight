import React, { useEffect } from 'react';
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

export const App = () => {
  const colors = useColors();
  const { isGameFinished, setIsGameFinished } = useIsGameFinished();
  const { tiles, setTiles } = useTiles(isGameFinished); // todo: move to Tile.tsx?
  const { moveCount, bestMoveCount, incrementMoveCount, resetMoveCount } =
    useMoveCount(tiles);

  const onTileMove = (position1: number, position2: number) => {
    incrementMoveCount();
    setTiles(swap(position1, position2, tiles));
  };

  const onReset = () => {
    // setIsGameFinished((prev) => ({
    //   previous: prev.last,
    //   last: true,
    // }));
    // setIsGameFinished(true);
    setTiles(tilesInOrder);
    resetMoveCount();
    console.log('R E S E T');
  };
  const onShuffle = () => {
    // setIsGameFinished((prev) => ({
    //   previous: prev.last,
    //   last: false,
    // }));
    // setIsGameFinished(false);
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
    if (isGameFinished) {
      Alert.alert(
        `Your score is ${moveCount.toString()}`,
        bestMoveCount < Infinity
          ? `Your best score is ${bestMoveCount.toString()}`
          : undefined,
      );
    }
  }, [isGameFinished, moveCount, bestMoveCount]);

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
