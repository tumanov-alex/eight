import React, { useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// import {
//   isAxisX,
//   isAxisY,
//   isMovableDown,
//   isMovableLeft,
//   isMovableRight,
//   isMovableUp,
// } from '../utils/matrix';
import {
  isAxisX,
  isAxisY,
  isMovableDown,
  isMovableLeft,
  isMovableRight,
  isMovableUp,
} from '../utils/matrixShared';
import { useColors } from '../hooks/useColors';
import { tileType, emptyTile } from '../hooks/useTiles';
import { OnTileMove } from '../screens/App';
import { useTilesSharedValue } from '../hooks/useTilesSharedValue';

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
type AnimatedStyle = {
  transform?: [{ translateX: number }, { translateY: number }];
  backgroundColor: string;
  zIndex: number;
};

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

// todo: why double render?
export const Tile = ({
  tile,
  tilesSharedValue,
  emptyTileIndex,
  position,
  emptyTilePosition,
  isGameFinishedShared,
  onTileMove,
  isGameFinished,
  swapTiles,
}: Props) => {
  const { emptyTileIndex: empty } = useTilesSharedValue();
  const tilePosition = useDerivedValue(() => {
    return tilesSharedValue.value.findIndex((t) => t === tile);
  }, [tilesSharedValue.value]);
  const isHorizontalWithEmptyTileSharedValue = useDerivedValue(() => {
    return runOnJS(() => isAxisX(tilePosition.value, emptyTileIndex.value));
  }, [tilePosition.value, emptyTileIndex.value]);
  const isVerticalWithEmptyTileSharedValue = useDerivedValue(() => {
    return runOnJS(() => isAxisY(tilePosition.value, emptyTileIndex.value));
  }, [tilePosition.value, emptyTileIndex.value]);
  const isOkToMoveOnXYSharedValue = useDerivedValue(() => {
    return (
      !isGameFinishedShared.value &&
      (isHorizontalWithEmptyTileSharedValue.value ||
        isVerticalWithEmptyTileSharedValue.value)
    );
  }, [
    isGameFinishedShared.value,
    isHorizontalWithEmptyTileSharedValue.value,
    isVerticalWithEmptyTileSharedValue.value,
  ]);
  const isOkToMoveRightSharedValue = useDerivedValue(() => {
    return isMovableRight(tilePosition.value, emptyTileIndex.value);
  }, [tilePosition.value, emptyTileIndex.value]);
  const isOkToMoveLeftSharedValue = useDerivedValue(() => {
    return isMovableLeft(tilePosition.value, emptyTileIndex.value);
  }, [tilePosition.value, emptyTileIndex.value]);
  const isOkToMoveUpSharedValue = useDerivedValue(() => {
    return isMovableUp(tilePosition.value, emptyTileIndex.value);
  }, [tilePosition.value, emptyTileIndex.value]);
  const isOkToMoveDownSharedValue = useDerivedValue(() => {
    return isMovableDown(tilePosition.value, emptyTileIndex.value);
  }, [tilePosition.value, emptyTileIndex.value]);

  const colors = useColors();
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  // const isHorizontalWithEmptyTile = isAxisX(position, emptyTilePosition);
  // const isVerticalWithEmptyTile = isAxisY(position, emptyTilePosition);
  // const isOkToMoveOnXY =
  //   !isGameFinished && (isHorizontalWithEmptyTile || isVerticalWithEmptyTile);
  // const isOkToMoveRight = isMovableRight(position, emptyTilePosition);
  // const isOkToMoveLeft = isMovableLeft(position, emptyTilePosition);
  // const isOkToMoveUp = isMovableUp(position, emptyTilePosition);
  // const isOkToMoveDown = isMovableDown(position, emptyTilePosition);

  const animatedStyles = useAnimatedStyle(() => {
    const style: AnimatedStyle = {
      backgroundColor: isPressed.value ? 'hotpink' : 'darkblue',
      zIndex: isPressed.value ? 1 : 0,
    };

    if (isOkToMoveOnXYSharedValue.value) {
      style.transform = [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
      ];
    }

    return style;
  }, [isPressed.value, offset.value, isOkToMoveOnXYSharedValue.value]);

  const onTileMoveSuccess = useCallback(() => {
    // todo: make position1 an array? In that way onTimeMove can handle the "move two as one" case
    onTileMove(position, emptyTilePosition, () => {
      offset.value = { x: 0, y: 0 };
    });
  }, [emptyTilePosition, offset, onTileMove, position]);

  // located here to avoid wasting time on the gesture computations
  if (tile === emptyTile) {
    return <View style={styles.empty} />;
  }

  gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      x = e.translationX + start.value.x;
      y = e.translationY + start.value.y;

      isMovedLeft = e.translationX < 0;
      isMovedRight = e.translationX > 0;
      isMovedUp = e.translationY < 0;
      isMovedDown = e.translationY > 0;

      isDoingForbiddenMoveHorizontally =
        (!isOkToMoveLeftSharedValue.value && isMovedLeft) ||
        (!isOkToMoveRightSharedValue.value && isMovedRight);
      isDoingForbiddenMoveVertically =
        (!isOkToMoveUpSharedValue.value && isMovedUp) ||
        (!isOkToMoveDownSharedValue.value && isMovedDown);

      console.log(isHorizontalWithEmptyTileSharedValue.value)
      console.log(isVerticalWithEmptyTileSharedValue.value)
        console.log('=========   ==========')

      if (isHorizontalWithEmptyTileSharedValue.value) {
        offset.value = {
          x:
            Math.abs(x) > tileSize // if moving further than one tile
              ? Math.sign(x) * tileSize // then limit to one tile
              : x, // else move to an actual value
          y: 0,
        };
      } else if (isVerticalWithEmptyTileSharedValue.value) {
        offset.value = {
          x: 0,
          y:
            Math.abs(y) > tileSize // if moving further than one tile
              ? Math.sign(y) * tileSize // then limit to one tile
              : y, // else move to an actual value
        };
      }
    })
    .onEnd((e) => {
      absoluteTX = Math.abs(e.translationX);
      absoluteTY = Math.abs(e.translationY);
      isTileBeenMoved =
        absoluteTX > tileMoveThreshold || absoluteTY > tileMoveThreshold;

      if (isOkToMoveOnXYSharedValue.value && isTileBeenMoved) {
        isMovedHorizontally = absoluteTX > absoluteTY;

        if (isMovedHorizontally) {
          isMovedLeft = e.translationX < 0;
          isMovedRight = e.translationX > 0;

          isDoingForbiddenMoveHorizontally =
            (!isOkToMoveLeftSharedValue.value && isMovedLeft) ||
            (!isOkToMoveRightSharedValue.value && isMovedRight);

          if (isDoingForbiddenMoveHorizontally) {
            // offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point;
          } else {
            // onTileMoveSuccess();

            swapTiles(tilePosition.value, emptyTileIndex.value);
            // console.log(empty.value)
            offset.value = {
              x: start.value.x + Math.sign(e.translationX) * tileSize,
              y:
                absoluteTY > tileMoveThreshold
                  ? Math.sign(offset.value.y) *
                    tileSize *
                    Math.floor(absoluteTY / tileSize)
                  : 0,
            };
          }
        } else {
          isMovedUp = e.translationY < 0;
          isMovedDown = e.translationY > 0;

          isDoingForbiddenMoveVertically =
            (!isOkToMoveUpSharedValue.value && isMovedUp) ||
            (!isOkToMoveDownSharedValue.value && isMovedDown);

          if (isDoingForbiddenMoveVertically) {
            // offset.value = { x: 0, y: 0 }; // if tile is being put back to the starting position and touch is interrupted before finish, then put it back to the starting point;
          } else {
            // onTileMoveSuccess();

            swapTiles(tilePosition.value, emptyTileIndex.value);
            // console.log(empty.value)
            offset.value = {
              x:
                absoluteTX > tileMoveThreshold
                  ? Math.sign(offset.value.x) *
                    tileSize *
                    Math.floor(absoluteTX / tileSize)
                  : 0,
              y: start.value.y + Math.sign(e.translationY) * tileSize,
            };
          }
        }
      } else {
        offset.value = { x: 0, y: 0 };
        start.value = { x: 0, y: 0 };
      }
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
