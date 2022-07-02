import React from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useColors } from '../../hooks/useColors';

interface Props {
  number: number;
  position: number;
}

interface ContainerStyle {
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderColor: string;
}

export default function NumberSquare({ number, position }: Props) {
  const colors = useColors();

  const getBorderStyle = (position: number, borderColor: string) => {
    const styles: ContainerStyle = {
      borderColor,
      borderRightWidth: 1,
      borderBottomWidth: 1,
    };

    if (position === 0 || position === 3 || position === 6) {
      styles.borderLeftWidth = 1;
    }

    if (position < 3) {
      styles.borderTopWidth = 1;
    }

    return styles;
  };

  return (
    <Animated.View
      style={[styles.container, getBorderStyle(position, colors.main)]}>
      <Text style={styles.text(colors.main)}>{number}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create<any>({
  container: {
    width: '33.333%',
    height: 100,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: (color: string): any => ({
    color,
  }),
});
