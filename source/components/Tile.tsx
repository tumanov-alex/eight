import React, { useCallback } from 'react';
import { Text, StyleSheet, View, InteractionManager } from 'react-native';
import Animated, {
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
import { tileType, emptyTile } from '../hooks/useTiles';
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

// todo: make border the same width everywhere
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

// todo: is this improves performance?
let gesture;
let absoluteTX;
let absoluteTY;
let x;
let y;
let isDoingForbiddenMoveHorizontally: boolean;
let isDoingForbiddenMoveVertically: boolean;
let isMovedLeft;
let isMovedRight;
let isMovedUp;
let isMovedDown;
let isMovedHorizontally;
let isTileBeenMoved;

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
      style.transform[0].translateX = offset.value.x;
      style.transform[1].translateY = offset.value.y;
    }

    return style;
  });

  const onTileMoveCb = useCallback(() => {
    // todo: make position1 an array? In that way onTimeMove can handle the "move two as one" case
    InteractionManager.runAfterInteractions(() => {
      onTileMove(position, emptyTilePosition);
    });
  }, [emptyTilePosition, onTileMove, position]);

  // located here to avoid wasting time on the gesture computations
  if (tile === emptyTile) {
    return <View style={styles.empty} />;
  }

  gesture = Gesture.Pan()
    .runOnJS(true) // need it for onTileMove, InteractionManager and requestAnimationFrame
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      InteractionManager.runAfterInteractions(() => {
        x = e.translationX + start.value.x;
        y = e.translationY + start.value.y;

        isMovedLeft = x < 0;
        isMovedRight = x > 0;
        isMovedUp = y < 0;
        isMovedDown = y > 0;

        isDoingForbiddenMoveHorizontally =
          (!isOkToMoveLeft && isMovedLeft) ||
          (!isOkToMoveRight && isMovedRight);
        isDoingForbiddenMoveVertically =
          (!isOkToMoveUp && isMovedUp) || (!isOkToMoveDown && isMovedDown);

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
      });
    })
    .onEnd((e) => {
      requestAnimationFrame(() => {
        absoluteTX = Math.abs(e.translationX);
        absoluteTY = Math.abs(e.translationY);
        isTileBeenMoved =
          absoluteTX > tileMoveThreshold || absoluteTY > tileMoveThreshold;

        if (isOkToMove && isTileBeenMoved) {
          isMovedHorizontally = absoluteTX > absoluteTY;

          if (isMovedHorizontally) {
            isMovedLeft = e.translationX < 0;
            isMovedRight = e.translationX > 0;

            isDoingForbiddenMoveHorizontally =
              (!isOkToMoveLeft && isMovedLeft) ||
              (!isOkToMoveRight && isMovedRight);

            if (isDoingForbiddenMoveHorizontally) {
              offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point
            } else {
              onTileMoveCb();

              offset.value = {
                x: Math.sign(e.translationX) * tileSize,
                y: 0,
              };
            }
          } else {
            isMovedUp = e.translationY < 0;
            isMovedDown = e.translationY > 0;

            isDoingForbiddenMoveVertically =
              (!isOkToMoveUp && isMovedUp) || (!isOkToMoveDown && isMovedDown);

            if (isDoingForbiddenMoveVertically) {
              offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point
            } else {
              onTileMoveCb();

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
      });
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

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
