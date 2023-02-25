import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';

import { Field } from '../components/Field';
import Buttons from '../components/Buttons';

import { shuffleArray } from '../utils/shuffleArray';
import { swap } from '../utils/swap';
import { useColors } from '../hooks/useColors';
import 'react-native-gesture-handler'; // import before using, to avoid app crash

const emptyTile = 0;
const numbersInOrder = [1, 2, 3, 4, 5, 6, 7, 8, emptyTile];

const Game = ({ setNumbers, numbers, swapTiles, tiles }) => (
  <View style={styles.fieldContainer}>
    <Buttons
      onReset={() => {
        tiles.value = numbersInOrder;
        setNumbers(numbersInOrder);
      }}
      onShuffle={() => {
        const shuffled = shuffleArray(numbersInOrder);
        setNumbers(shuffled);
        tiles.value = shuffled;
      }}
    />

    <Field swapTiles={swapTiles} numbers={numbers} setNumbers={setNumbers} />
  </View>
);

export const App = () => {
  const colors = useColors();
  const { getItem: getNumbersStore, setItem: setNumbersStore } =
    useAsyncStorage('@numbers');

  const [numbers, setNumbersState] = useState<number[]>([]);
  const tiles = useSharedValue(numbers);
  const emptyTilePosition = useDerivedValue(() =>
    tiles.value.findIndex((n) => n === emptyTile),
  );
  const setNumbers = useCallback(
    (nums: number[]) => {
      setNumbersStore(JSON.stringify(nums));
      setNumbersState(nums);
    },
    [setNumbersStore],
  );

  const swapTiles = (a: number) => {
    tiles.value = swap(tiles.value, a, emptyTilePosition);
  };

  const getAsyncStorage = useCallback(async () => {
    try {
      const resJson = await getNumbersStore();

      if (resJson !== null) {
        tiles.value = JSON.parse(resJson);
        setNumbersState(JSON.parse(resJson));
      } else {
        const shuffled = shuffleArray(numbersInOrder);
        tiles.value = shuffled;
        setNumbers(shuffled);
      }
    } catch (e) {
      console.error(e);
    }
  }, [getNumbersStore, setNumbers, tiles]);

  useEffect(() => {
    !numbers.length && getAsyncStorage();
  }, [getAsyncStorage, numbers.length]);

  return (
    <SafeAreaView style={styles.container('black')}>
      {numbers.length ? (
        <Game {...{ setNumbers, numbers, swapTiles, tiles }} />
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
  },
});
