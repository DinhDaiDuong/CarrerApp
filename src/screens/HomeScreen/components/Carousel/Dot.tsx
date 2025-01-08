import {StyleSheet} from 'react-native';
import React, {useMemo, useImperativeHandle} from 'react';
import {COLORS, s, width} from '@utils/config';
import {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
const WIDTH_OUTPUT = [s(5), s(30), s(5)];
const COLOR_OUTPUT = [COLORS.grey, COLORS.green, COLORS.grey];
type TDot = {
  animatedValue: SharedValue<number>;
  index: number;
  length: number;
};
const Dot = ({animatedValue, index, length}: TDot) => {
  const inputRange = useMemo(
    () => [(index - 1) * width, index * width, (index + 1) * width],
    [],
  );

  const animatedWidth = useDerivedValue(() => {
    return length <= 1
      ? WIDTH_OUTPUT[1]
      : interpolate(animatedValue.value, inputRange, WIDTH_OUTPUT, {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        });
  }, [length]);
  const animatedColor = useDerivedValue(() => {
    return length <= 1
      ? COLOR_OUTPUT[1]
      : interpolateColor(animatedValue.value, inputRange, COLOR_OUTPUT);
  }, [length]);
  const animatedStyle = useAnimatedStyle(
    () => ({width: animatedWidth.value, backgroundColor: animatedColor.value}),
    [],
  );
  return <Animated.View style={[styles.dot, animatedStyle]} />;
};
const styles = StyleSheet.create({
  dot: {
    width: s(5),
    height: s(5),
    borderRadius: s(5),
    marginHorizontal: s(4),
  },
});
export default Dot;
