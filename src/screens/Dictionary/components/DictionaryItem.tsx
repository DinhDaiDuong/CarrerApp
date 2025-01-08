import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  UIManager,
  ListRenderItemInfo,
} from 'react-native';
import React from 'react';
import {COLORS, FONT, TGroup, height, s, vs, width} from '@utils';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import AppCardCarousel from '@components/AppCardCarousel';
import CardFlipltItem from '@components/AppCardCarousel/components/CardFlipItem';
import AppImage from '@components/AppImage';
import {IMajor} from '@interfaces/DTO/Dictionary/dictionary';
import {navigationRef} from '@navigation';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const CARD_HEIGHT = height * 0.9;
type TDictionaryItem = {
  title?: string;
  scrollToItem?: () => void;
  children?: React.ReactNode;
  majors?: IMajor[];
  group?: TGroup;
};
const DictionaryItem = ({
  title,
  scrollToItem,
  children,
  majors,
  group = 'A0',
}: TDictionaryItem) => {
  const offset = useSharedValue(0);
  const startY = useSharedValue(0);
  const animValue = useDerivedValue(() =>
    interpolate(offset.value, [0, CARD_HEIGHT], [-1, 1]),
  );
  const animatedScroll = useSharedValue(0);
  const onPress = () => {
    offset.value = offset.value === 0 ? withTiming(CARD_HEIGHT) : withTiming(0);
    if (offset.value === 0) {
      scrollToItem!();
    }
  };

  const leftIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {rotate: `${interpolate(animValue.value, [-1, 1], [0, -180])}deg`},
    ],
  }));
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animValue.value,
      [-1, 1],
      [COLORS.white, 'rgba(255, 255, 255, 0.2)'],
    ),
    height: interpolate(animValue.value, [-1, 1], [45, CARD_HEIGHT]),
    width: interpolate(animValue.value, [-1, 1], [width * 0.8, width]),
  }));

  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = offset.value;
    })
    .onUpdate(e => {
      if (offset.value < CARD_HEIGHT) {
        offset.value = e.translationY + startY.value;
      }
    })
    .onEnd(() => {
      if (startY.value === 0) {
        offset.value = withSpring(CARD_HEIGHT);
        runOnJS(scrollToItem!)();
      } else {
        offset.value = withTiming(0);
      }
    });

  const renderItem = ({item, index}: ListRenderItemInfo<IMajor>) => {
    return (
      <CardFlipltItem
        index={index}
        key={index}
        animatedScroll={animatedScroll}
        h={height * 0.45}
        length={majors?.length}
        onItemPress={() =>
          navigationRef.navigate('DictionaryDetail', {
            group: group,
            name: item?.name,
            image: item?.image,
            content: {pros: item?.pros, cons: item.cons},
          })
        }
        children={
          children ? (
            children
          ) : (
            <View style={styles.contentCard}>
              <AppImage
                source={{uri: item?.image}}
                style={styles.image}
                resizeMode="stretch"
              />
              <Text style={styles.jobTitle}>{item?.name}</Text>
            </View>
          )
        }
      />
    );
  };
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={styles.overall}>
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <Pressable style={styles.title} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
            <Animated.View style={leftIconAnimatedStyle}>
              <Feather name="chevron-down" color={COLORS.grey} size={s(20)} />
            </Animated.View>
          </Pressable>
          <View>
            <View style={styles.divider} />
            <View style={styles.cardContainer}>
              <AppCardCarousel
                data={majors!}
                renderItem={renderItem}
                animatedScroll={animatedScroll}
                snapToInterval={width * 0.7}
              />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
  overall: {
    overflow: 'hidden',
  },
  title: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: s(20),
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  card: {
    borderRadius: s(10),
    paddingVertical: s(10),
    alignSelf: 'center',
  },
  text: {
    ...FONT.content.M.medium,
  },
  divider: {
    height: vs(1),
    backgroundColor: COLORS.grey,
    borderRadius: s(10),
    marginVertical: vs(10),
    marginHorizontal: s(20),
  },
  contentCard: {
    padding: s(10),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: s(200),
    height: s(200),
    borderRadius: s(20),
  },
  jobTitle: {
    ...FONT.content.M.medium,
    marginVertical: vs(10),
    textAlign: 'center',
  },
});
export default DictionaryItem;
