import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {COLORS, FONT, height, s, vs, width} from '@utils/config';
type Props = {
  index: number;
  animatedScroll: SharedValue<number>;
  children?: React.ReactNode;
  onItemPress?: () => void;
  h?: number;
  length?: number;
};
const ITEM_SIZE = width * 0.8;
const SPACING = (width - ITEM_SIZE) / 2;
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const CardCarouseltItem = ({
  index,
  animatedScroll,
  children,
  onItemPress,
  h = height * 0.5,
  length = 5,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animatedScroll.value,
            [
              ITEM_SIZE * (index - 1),
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 1),
            ],
            [1, 1.1, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, []);
  return (
    <Animated.View
      style={[
        {
          marginLeft: index === 0 ? SPACING : 0,
          marginRight: index === length - 1 ? SPACING : 0,
        },
        styles.container,
      ]}>
      <Animated.View style={animatedStyle}>
        <AnimatedTouchableOpacity
          style={[styles.card, {height: h}]}
          key={index}
          onPress={onItemPress && onItemPress}
          disabled={!onItemPress}>
          {children && <>{children}</>}
          <Text style={styles.bottomText}>{index}</Text>
        </AnimatedTouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 'auto',
    width: width * 0.8,
    alignItems: 'center',
    paddingVertical: vs(30),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    padding: s(10),
    gap: s(5),
    alignItems: 'center',
    width: width * 0.72,
  },
  bottomText: {
    ...FONT.content.XXS.medium,
    position: 'absolute',
    bottom: 5,
  },
});
export default CardCarouseltItem;
