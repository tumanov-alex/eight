import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tile } from './Tile';

interface Props {
  numbers: number[];
  setNumbers: Function;
}

export const Field = ({ numbers, setNumbers, swapTiles }: Props) => {
  return (
    <View style={styles.container}>
      {numbers.map((n: number, i: number) =>
        n > 0 ? <Tile swapTiles={swapTiles} position={i} number={n} key={n} /> : null,
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});
