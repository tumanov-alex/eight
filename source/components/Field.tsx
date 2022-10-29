import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tile } from './Tile';
import { emptyTile } from '../screens/App';
import { tile } from '../screens/App';

interface Props {
  numbers: tile[];
  onTileMove: Function;
}

/*
 * position < 3 => no UP y
 *
 * 0: no LEFT x, no UP y
 * 1: no UP y
 * 2: no RIGHT x, no UP y
 * */

export const Field = ({ numbers, onTileMove }: Props) => {
  const emptyTilePosition = numbers.indexOf(emptyTile);

  return (
    <View style={styles.container}>
      {numbers.map((n: tile, i: number) =>
        n === emptyTile ? null : (
          <Tile
            onTileMove={onTileMove}
            position={i}
            number={n}
            emptyTilePosition={emptyTilePosition}
            key={n}
          />
        ),
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
