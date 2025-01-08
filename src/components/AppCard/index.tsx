import AppImage from '@components/AppImage';
import { COLORS, FONT, s, width } from '@utils/config';
import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
type TAppCard = {
  index?: number;
  imageUrl?: string;
  title?: string | React.ReactNode;
  subTitle?: string;
  type?: 'small' | 'large';
  containerStyle?: StyleProp<ViewStyle>;
  shadow?: boolean;
  imageStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subTitleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
  rightSection?: React.ReactNode;
};
const CARD_BASE_TYPE = {
  small: {
    flexDirection: 'column',
    padding: s(6),
    width: s(100),
  },
  large: {
    flexDirection: 'row',
    padding: s(15),
    width: '100%',
  },
};
const CARD_FONT = {
  small: {
    title: FONT.content.XXS.semiBold,
    subTitle: FONT.content.XXXS.regular,
  },
  large: {
    title: FONT.content.M.semiBold,
    subTitle: FONT.content.XS.medium,
  },
};
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AppCard = ({
  imageUrl,
  title,
  subTitle,
  type = 'small',
  containerStyle,
  shadow = false,
  titleStyle,
  subTitleStyle,
  index,
  onPress,
  imageStyle,
  children,
  rightSection,
}: TAppCard) => {
  const initStyle = StyleSheet.flatten([
    styles.container,
    CARD_BASE_TYPE[type],
    containerStyle,
    shadow && styles.shadow,
  ]) as ViewStyle;
  return (
    <AnimatedTouchable
      entering={FadeIn.delay((index ?? 0) * 150)}
      exiting={FadeOut}
      style={initStyle}
      disabled={!onPress}
      onPress={onPress}>
      {!!children ? (
        children
      ) : (
        <>
          <AppImage source={{ uri: imageUrl }} style={[styles.image, imageStyle]} />
          <View style={[type === 'large' && styles.largeTitle]}>
            {!!subTitle && <Text style={[CARD_FONT[type].subTitle, { color: COLORS.grey }, subTitleStyle]}>{subTitle}</Text>}
            {typeof title === 'string' ? (
              <Text style={[CARD_FONT[type].title, titleStyle]} numberOfLines={4}>
                {title}
              </Text>
            ) : (
              title
            )}
          </View>
          {!!rightSection && rightSection}
        </>
      )}
    </AnimatedTouchable>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: width,
  },
  image: {
    width: s(80),
    height: s(80),
    borderRadius: s(10),
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  largeTitle: {
    //width: '70%',
    marginLeft: s(10),
    flex: 1,
    justifyContent: 'space-between',
    gap: s(4),
  },
});
export default memo(AppCard);
