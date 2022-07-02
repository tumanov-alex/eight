import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Button,
} from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { GestureDetector } from 'react-native-gesture-handler';

import NumberSquare from '../components/NumberSquare/NumberSquare';
import Field from '../components/Field/Field';

import { shuffleArray } from '../utils/shuffleArray';
import { useColors } from '../hooks/useColors';

export const App = () => {
  const colors = useColors();
  const { getItem: getNumbersStore, setItem: setNumbersStore } =
    useAsyncStorage('@numbers');

  const numbersInOrder = React.useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);
  const [numbers, setNumbersState] = useState<number[]>([]);

  const setNumbers = useCallback(
    async (numbers: number[]) => {
      await setNumbersStore(JSON.stringify(numbers));
      setNumbersState(numbers);
    },
    [setNumbersStore],
  );

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
  }, [getNumbersStore, numbersInOrder, setNumbers]);

  useEffect(() => {
    !numbers.length && getAsyncStorage();
  }, [getAsyncStorage, numbers.length]);

  const Buttons = () => (
    <View style={styles.buttonContainer}>
      <Button
        onPress={() => setNumbers(numbersInOrder)}
        title="Clear"
        color={colors.main}
      />
      <Button
        onPress={() => setNumbers(shuffleArray(numbersInOrder))}
        title="Shuffle"
        color={colors.main}
      />
    </View>
  );
  const Game = () => (
    <GestureDetector>
      <View style={styles.fieldContainer}>
        <Buttons />

        <Field>
          {numbers.map((n: number, i) => (
            <NumberSquare position={i} number={n} key={n} />
          ))}
        </Field>
      </View>
    </GestureDetector>
  );

  return (
    <SafeAreaView style={styles.container(colors.secondary)}>
      {numbers.length ? <Game /> : <ActivityIndicator color={colors.main} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create<any>({
  container: (backgroundColor: 'string') => ({
    flex: 1,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  fieldContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
