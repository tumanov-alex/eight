import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Tile } from './Tile';
import { tileType, emptyTile } from '../hooks/useTiles';
import { tileSize } from './Tile';
import { useIsGameFinished } from '../hooks/useIsGameFinished';
import { OnTileMove } from '../screens/App';

interface Props {
  tiles: tileType[];
  onTileMove: OnTileMove;
}

export const Field = ({ tiles, onTileMove }: Props) => {
  const emptyTilePosition = tiles.indexOf(emptyTile);
  const { isGameFinished } = useIsGameFinished(tiles);

  return (
    <View style={styles.container}>
      {tiles.map((tile: tileType, i: number) => (
        <Tile
          emptyTilePosition={emptyTilePosition}
          isGameFinished={isGameFinished}
          onTileMove={onTileMove}
          position={i}
          tile={tile}
          key={`key-${tile}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: tileSize * 3, // todo: add support for matrices bigger than 3
    alignSelf: 'center',
  },
});
