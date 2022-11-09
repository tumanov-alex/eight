import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler'; // import before using, to avoid app crash

import { Field } from '../components/Field';
import Buttons from '../components/Buttons';

import { shuffleTiles } from '../utils/shuffleArray';
import { useColors } from '../hooks/useColors';
import { swap } from '../utils/swap';
import { compareArrays } from '../utils/compareArrays';
import { useMoveCount } from '../hooks/useMoveCount';

export const emptyTile = null;
export type tile = number | typeof emptyTile;
const numbersInOrder: tile[] = [1, 2, 3, 4, 5, 6, 7, 8, emptyTile];

export const App = () => {
  const colors = useColors();
  const { moveCount, incrementMoveCount, resetMoveCount } = useMoveCount();
  const { getItem: getNumbersStore, setItem: setNumbersStore } =
    useAsyncStorage('@numbers');

  const [numbers, setNumbersState] = useState<tile[]>([]);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const setNumbers = useCallback(
    (nums: tile[]) => {
      setNumbersStore(JSON.stringify(nums));
      setNumbersState(nums);
    },
    [setNumbersStore],
  );
  const onTileMove = (position1: number, position2: number) => {
    incrementMoveCount();
    setNumbers(swap(position1, position2, numbers));
  };

  const getAsyncStorage = useCallback(async () => {
    try {
      const resJson = await getNumbersStore();

      if (resJson !== null) {
        setNumbersState(JSON.parse(resJson));
      } else {
        setNumbers(shuffleTiles(numbersInOrder));
      }
    } catch (e) {
      console.error(e);
    }
  }, [getNumbersStore, setNumbers]);

  useEffect(() => {
    !numbers.length && getAsyncStorage();
  }, [getAsyncStorage, numbers.length]);

  useEffect(() => {
    const isNumbersInOrder = compareArrays(numbers, numbersInOrder);

    if (isGameFinished === false && isNumbersInOrder) {
      setIsGameFinished(true);
      Alert.alert('Your score is', moveCount.toString());
    } else if (isGameFinished && isNumbersInOrder === false) {
      setIsGameFinished(false);
    }
  }, [isGameFinished, moveCount, numbers]);

  const onReset = () => {
    setNumbers(numbersInOrder);
    resetMoveCount();
  };

  const onShuffle = () => {
    setNumbers(shuffleTiles(numbersInOrder));
    resetMoveCount();
  };

  const Game = () => (
    <View style={styles.fieldContainer}>
      <Buttons onReset={onReset} onShuffle={onShuffle} />

      <Field numbers={numbers} onTileMove={onTileMove} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container('black')}>
      {numbers.length ? <Game /> : <ActivityIndicator color={colors.main} />}
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
