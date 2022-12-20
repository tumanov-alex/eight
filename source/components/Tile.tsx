import React, { useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import {
  isAxisX,
  isAxisY,
  isMovableDown,
  isMovableLeft,
  isMovableRight,
  isMovableUp,
} from '../utils/matrix';
import { useColors } from '../hooks/useColors';
import { tileType } from '../hooks/useTiles';
import { emptyTile } from '../hooks/useTiles';
import { OnTileMove } from '../screens/App';

interface Props {
  tile: tileType;
  position: number;
  emptyTilePosition: number;
  onTileMove: OnTileMove;
  isGameFinished: boolean;
}

interface ContainerStyle {
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderColor: string;
}

export const tileSize = 100;
const tileMoveThreshold = tileSize / 2;

export const Tile = ({
  tile,
  position,
  emptyTilePosition,
  onTileMove,
  isGameFinished,
}: Props) => {
  const colors = useColors();
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const isX = isAxisX(position, emptyTilePosition); // todo: rename to smth like "isOnXAxisWithEmptyTile"
  const isY = isAxisY(position, emptyTilePosition); // todo: rename to smth like "isOnXAxisWithEmptyTile"
  const isOkToMove = !isGameFinished && (isX || isY); // todo: rename to account for flags below
  const isOkToMoveRight = isMovableRight(position, emptyTilePosition);
  const isOkToMoveLeft = isMovableLeft(position, emptyTilePosition);
  const isOkToMoveUp = isMovableUp(position, emptyTilePosition);
  const isOkToMoveDown = isMovableDown(position, emptyTilePosition);

  const animatedStyles = useAnimatedStyle(() => {
    const style = {
      transform: [{ translateX: 0 }, { translateY: 0 }],
      backgroundColor: isPressed.value ? 'hotpink' : 'darkblue',
      zIndex: isPressed.value ? 1 : 0,
    };

    if (isOkToMove) {
      style.transform.push(
        { translateX: offset.value.x },
        { translateY: offset.value.y },
      );
    }

    return style;
  });

  // const gesture = Gesture.Pan()
  //   .onBegin(() => {
  //     isPressed.value = true;
  //   })
  //   .onUpdate((e) => {
  //     const x = e.translationX + start.value.x;
  //     const y = e.translationY + start.value.y;
  //
  //     const isMovedLeft = x < 0;
  //     const isMovedRight = x > 0;
  //     const isMovedUp = y < 0;
  //     const isMovedDown = y > 0;
  //
  //     const isDoingForbiddenMoveHorizontally =
  //       (!isOkToMoveLeft && isMovedLeft) || (!isOkToMoveRight && isMovedRight);
  //     const isDoingForbiddenMoveVertically =
  //       (!isOkToMoveUp && isMovedUp) || (!isOkToMoveDown && isMovedDown);
  //
  //     if (isX && !isDoingForbiddenMoveHorizontally) {
  //       offset.value = {
  //         x:
  //           Math.abs(e.translationX) > tileSize // if moving further than one tile
  //             ? Math.sign(e.translationX) * tileSize // then limit to one tile
  //             : x, // else move to an actual value
  //         y: start.value.y,
  //       };
  //     } else if (isY && !isDoingForbiddenMoveVertically) {
  //       offset.value = {
  //         x: start.value.x,
  //         y:
  //           Math.abs(e.translationY) > tileSize // if moving further than one tile
  //             ? Math.sign(e.translationY) * tileSize // then limit to one tile
  //             : y, // else move to an actual value
  //       };
  //     }
  //   })
  //   .onEnd((e) => {
  //     const absoluteTX = Math.abs(e.translationX);
  //     const absoluteTY = Math.abs(e.translationY);
  //     const isMovedHorizontally = absoluteTX > absoluteTY;
  //     const isTileBeenMoved =
  //       absoluteTX > tileMoveThreshold || absoluteTY > tileMoveThreshold;
  //
  //     const isMovedLeft = e.translationX < 0;
  //     const isMovedRight = e.translationX > 0;
  //     const isMovedUp = e.translationY < 0;
  //     const isMovedDown = e.translationY > 0;
  //
  //     const isDoingForbiddenMoveHorizontally =
  //       (!isOkToMoveLeft && isMovedLeft) || (!isOkToMoveRight && isMovedRight);
  //     const isDoingForbiddenMoveVertically =
  //       (!isOkToMoveUp && isMovedUp) || (!isOkToMoveDown && isMovedDown);
  //
  //     if (isOkToMove && isTileBeenMoved) {
  //       if (isMovedHorizontally) {
  //         if (isDoingForbiddenMoveHorizontally) {
  //           offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point
  //         } else {
  //           // todo: make position1 an array? In that way onTimeMove can handle the "move two as one" case
  //           runOnJS(onTileMove)(position, emptyTilePosition);
  //
  //           offset.value = {
  //             x: Math.sign(e.translationX) * tileSize,
  //             y: 0,
  //           };
  //         }
  //       } else {
  //         if (isDoingForbiddenMoveVertically) {
  //           offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point
  //         } else {
  //           // todo: make position1 an array? In that way onTimeMove can handle the "move two as one" case
  //           runOnJS(onTileMove)(position, emptyTilePosition);
  //
  //           offset.value = {
  //             x: 0,
  //             y: Math.sign(e.translationY) * tileSize,
  //           };
  //         }
  //       }
  //
  //       start.value = {
  //         x: offset.value.x,
  //         y: offset.value.y,
  //       };
  //     } else {
  //       start.value = { x: 0, y: 0 };
  //       offset.value = { x: 0, y: 0 };
  //     }
  //   })
  //   .onFinalize(() => {
  //     isPressed.value = false;
  //   });

  let absoluteTX;
  let absoluteTY;
  let x;
  let y;
  let isDoingForbiddenMoveHorizontally;
  let isDoingForbiddenMoveVertically;

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      x = e.translationX + start.value.x;
      y = e.translationY + start.value.y;

      isDoingForbiddenMoveHorizontally =
        (!isOkToMoveLeft && x < 0) || (!isOkToMoveRight && x > 0);
      isDoingForbiddenMoveVertically =
        (!isOkToMoveUp && y < 0) || (!isOkToMoveDown && y > 0);

      if (isX && !isDoingForbiddenMoveHorizontally) {
        offset.value = {
          x:
            Math.abs(e.translationX) > tileSize // if moving further than one tile
              ? Math.sign(e.translationX) * tileSize // then limit to one tile
              : x, // else move to an actual value
          y: start.value.y,
        };
      } else if (isY && !isDoingForbiddenMoveVertically) {
        offset.value = {
          x: start.value.x,
          y:
            Math.abs(e.translationY) > tileSize // if moving further than one tile
              ? Math.sign(e.translationY) * tileSize // then limit to one tile
              : y, // else move to an actual value
        };
      }
    })
    .runOnJS(true)
    .onEnd((e) => {
      absoluteTX = Math.abs(e.translationX);
      absoluteTY = Math.abs(e.translationY);

      if (
        (isOkToMove && absoluteTX > tileMoveThreshold) ||
        absoluteTY > tileMoveThreshold
      ) {
        if (absoluteTX > absoluteTY) {
          if (
            (!isOkToMoveLeft && e.translationX < 0) ||
            (!isOkToMoveRight && e.translationX > 0)
          ) {
            offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point
          } else {
            // todo: make position1 an array? In that way onTimeMove can handle the "move two as one" case
            onTileMove(position, emptyTilePosition);

            offset.value = {
              x: Math.sign(e.translationX) * tileSize,
              y: 0,
            };
          }
        } else {
          if (
            (!isOkToMoveUp && e.translationY < 0) ||
            (!isOkToMoveDown && e.translationY > 0)
          ) {
            offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point
          } else {
            // todo: make position1 an array? In that way onTimeMove can handle the "move two as one" case
            onTileMove(position, emptyTilePosition);

            offset.value = {
              x: 0,
              y: Math.sign(e.translationY) * tileSize,
            };
          }
        }

        start.value = {
          x: offset.value.x,
          y: offset.value.y,
        };
      } else {
        start.value = { x: 0, y: 0 };
        offset.value = { x: 0, y: 0 };
      }
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  // todo: make border the same width everywhere
  const getBorderStyle = useCallback(
    (position: number, borderColor: string) => {
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
    },
    [],
  );

  if (tile === emptyTile) {
    return <View style={styles.empty} />;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          getBorderStyle(position, colors.secondary),
          animatedStyles,
        ]}>
        <Text style={styles.text(colors.secondary)}>{tile}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create<any>({
  container: {
    height: tileSize,
    width: tileSize,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    width: tileSize,
    height: tileSize,
    zIndex: -1,
  },
  text: (color: string): any => ({
    color,
    fontWeight: 'bold',
    fontSize: 24,
  }),
});
