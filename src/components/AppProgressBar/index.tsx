import {View, Text, StyleSheet, ViewStyle, StyleProp} from 'react-native';
import React from 'react';
import {COLORS, FONT, s, vs} from '@utils/config';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
const MAX_WIDTH = s(221);
type TAppProgressBar = {
  trackStyle?: StyleProp<ViewStyle>;
  progress?: number;
  maxValue?: number;
};
const AppProgressBar = ({
  trackStyle,
  progress = 30,
  maxValue = 100,
}: TAppProgressBar) => {
  const animatedValue = useDerivedValue(
    () => (progress * MAX_WIDTH) / maxValue,
    [progress, maxValue],
  );
  const trackInitStyle = StyleSheet.flatten([
    styles.track,
    trackStyle,
  ]) as ViewStyle;
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(animatedValue.value),
  }));
  return (
    <View style={styles.container}>
      <Text style={FONT.content.S}>
        {progress}/{maxValue}
      </Text>
      <View style={trackInitStyle}>
        <Animated.View style={[styles.bar, animatedStyle]} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: vs(5),
  },
  track: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: s(10),
    height: vs(10),
    width: s(221),
  },
  bar: {
    height: '100%',
    width: s(100),
    backgroundColor: COLORS.green,
    borderRadius: s(10),
  },
});
export default AppProgressBar;
