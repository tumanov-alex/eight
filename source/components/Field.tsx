import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Tile, tileSize } from './Tile';
import { tileType, emptyTile } from '../hooks/useTiles';
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
          key={`key-${tile}`}
          position={i}
          tile={tile}
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
    paddingBottom: 150,
  },
});
