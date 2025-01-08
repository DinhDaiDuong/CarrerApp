import {DimensionValue} from 'react-native';
import React, {useLayoutEffect} from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
type TAppSkeleton = {
  width: DimensionValue;
  height: DimensionValue;
  radius?: number;
};
const AppSkeleton = ({width, height, radius = 0}: TAppSkeleton) => {
  const loading = useSharedValue(0);
  useLayoutEffect(() => {
    loading.value = withRepeat(withTiming(1), -1, true);
  }, []);
  const colorAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        loading.value,
        [0, 1],
        ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.9)'],
      ),
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: width,
          height: height,
          borderRadius: radius,
        },
        colorAnimatedStyle,
      ]}></Animated.View>
  );
};

export default AppSkeleton;
