import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import 'react-native-gesture-handler'; // import before using, to avoid app crash

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

const size = 100;
const tileMoveThreshold = size / 2;

export const Tile = ({ number, position, swapTiles }: Props) => {
  const colors = useColors();

  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: isPressed.value ? 'hotpink' : 'darkblue',
      zIndex: isPressed.value ? 1 : 0,
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      const x = e.translationX + start.value.x;
      const y = e.translationY + start.value.y;

      offset.value = {
        x:
          Math.abs(e.translationX) > size
            ? Math.sign(e.translationX) * size
            : x,
        y:
          Math.abs(e.translationY) > size
            ? Math.sign(e.translationY) * size
            : y,
      };
    })
    .onEnd((e) => {
      const absoluteTX = Math.abs(e.translationX);
      const absoluteTY = Math.abs(e.translationY);
      const isTileBeenMoved =
        absoluteTX > tileMoveThreshold || absoluteTY > tileMoveThreshold;

      if (isTileBeenMoved) {
        if (absoluteTX > absoluteTY) {
          const absoluteY = Math.abs(offset.value.y);

          offset.value = {
            x: start.value.x + Math.sign(e.translationX) * size,
            y:
              absoluteY > tileMoveThreshold
                ? Math.sign(offset.value.y) *
                  size *
                  Math.floor(absoluteY / size)
                : 0,
          };
        } else {
          const absoluteX = Math.abs(offset.value.x);

          offset.value = {
            x:
              absoluteX > tileMoveThreshold
                ? Math.sign(offset.value.x) *
                  size *
                  Math.floor(absoluteX / size)
                : 0,
            y: start.value.y + Math.sign(e.translationY) * size,
          };
        }

        start.value = {
          x: offset.value.x,
          y: offset.value.y,
        };
        console.log(start.value)
        // console.log(start.value)
      } else {
        start.value = { x: 0, y: 0 };
        offset.value = { x: 0, y: 0 };
      }
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const getBorderStyle = (position: number, borderColor: string) => {
    const styles: ContainerStyle = {
      borderColor,
      borderRightWidth: 1,
      borderBottomWidth: 1,

      borderLeftWidth: 1,
      borderTopWidth: 1,
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
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          getBorderStyle(position, colors.main),
          animatedStyles,
        ]}>
        <Text style={styles.text(colors.main)}>{number}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create<any>({
  container: {
    height: size,
    width: size,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    width: size,
    height: size,
    zIndex: -1,
  },
  text: (color: string): any => ({
    color,
    fontWeight: 'bold',
  }),
});
