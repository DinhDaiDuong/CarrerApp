import {Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {COLORS, FONT, height, s, vs, width} from '@utils/config';
type TStyle = {
  scale: number[];
  rotateY: number[];
  perspective: number;
};
type TType = 'float' | 'sink';
type Props = {
  index: number;
  animatedScroll: SharedValue<number>;
  children?: React.ReactNode;
  onItemPress?: () => void;
  h?: number;
  length?: number;
  type?: TType;
};
const ITEM_SIZE = width * 0.7;
const SPACING = (width - ITEM_SIZE) / 2;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const OUTPUT_RANGE: Record<TType, TStyle> = {
  float: {
    scale: [0.82, 1, 0.82],
    rotateY: [30, 0, -30],
    perspective: 450,
  },
  sink: {
    scale: [1.12, 1, 1.12],
    rotateY: [-30, 0, 30],
    perspective: 500,
  },
};
const CardFlipltItem = ({
  index,
  animatedScroll,
  children,
  onItemPress,
  h = height * 0.5,
  length = 5,
  type = 'float',
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const INPUT_RANGE = [
      ITEM_SIZE * (index - 1),
      ITEM_SIZE * index,
      ITEM_SIZE * (index + 1),
    ];
    const {scale, rotateY, perspective} = OUTPUT_RANGE[type];
    return {
      transform: [
        {
          scale: interpolate(
            animatedScroll.value,
            INPUT_RANGE,
            scale,
            Extrapolation.CLAMP,
          ),
        },
        {perspective},
        {
          rotateY: `${interpolate(
            animatedScroll.value,
            INPUT_RANGE,
            rotateY,
          )}deg`,
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
        <AnimatedPressable
          style={[styles.card, {height: h}]}
          key={index}
          onPress={onItemPress && onItemPress}
          disabled={!onItemPress}>
          {children && <>{children}</>}
          <Text style={styles.bottomText}>{index}</Text>
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 'auto',
    width: ITEM_SIZE,
    alignItems: 'center',
    paddingVertical: vs(30),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    padding: s(10),
    gap: s(5),
    alignItems: 'center',
    width: '100%',
  },
  bottomText: {
    ...FONT.content.XXS.medium,
    position: 'absolute',
    bottom: 5,
  },
});
export default CardFlipltItem;
