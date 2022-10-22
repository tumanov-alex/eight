import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { useColors } from '../hooks/useColors';

export default function Buttons({
  onReset,
  onShuffle,
}: {
  onReset: (event: GestureResponderEvent) => void;
  onShuffle: (event: GestureResponderEvent) => void;
}) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Button onPress={onReset} title="Reset" color={colors.main} />
      <Button onPress={onShuffle} title="Shuffle" color={colors.main} />
    </View>
  );
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
