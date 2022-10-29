/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { Field } from '../components/Field';
import Buttons from '../components/Buttons';

import { shuffleArray } from '../utils/shuffleArray';
import { useColors } from '../hooks/useColors';
import 'react-native-gesture-handler'; // import before using, to avoid app crash
import { swap } from '../utils/swap';

export const emptyTile = null;
export type tile = number | null;
// eslint-disable-next-line prettier/prettier
const numbersInOrder: tile[] = [
  1, 2, 3,
  4, 5, 6,
  7, 8, emptyTile,
];

export const App = () => {
  const colors = useColors();
  const { getItem: getNumbersStore, setItem: setNumbersStore } =
    useAsyncStorage('@numbers');

  const [numbers, setNumbersState] = useState<tile[]>([]);
  const setNumbers = useCallback(
    (nums: tile[]) => {
      setNumbersStore(JSON.stringify(nums));
      setNumbersState(nums);
    },
    [setNumbersStore],
  );
  const onTileMove = (position1: number, position2: number) => {
    const tmp = swap(position1, position2, numbers);
    setNumbers(tmp);
    console.log(tmp);
    console.log('========= swap(position1, position2, numbers)  ==========')
  };

  const getAsyncStorage = useCallback(async () => {
    try {
      const resJson = await getNumbersStore();

      if (resJson !== null) {
        setNumbersState(JSON.parse(resJson));
      } else {
        setNumbers(shuffleArray(numbersInOrder));
      }
    } catch (e) {
      console.error(e);
    }
  }, [getNumbersStore, setNumbers]);

  useEffect(() => {
    !numbers.length && getAsyncStorage();
  }, [getAsyncStorage, numbers.length]);

  const Game = () => (
    <View style={styles.fieldContainer}>
      <Buttons
        onReset={() => setNumbers(numbersInOrder)}
        onShuffle={() => setNumbers(shuffleArray(numbersInOrder))}
      />

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
