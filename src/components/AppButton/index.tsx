import { COLORS } from '@utils/config/color';
import { FONT } from '@utils/config/font';
import { s } from '@utils/config/responsive';
import React from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
export type TType = 'fill' | 'outline' | 'transparent' | 'disable';

const BUTTON_BASE_STYLE = {
  fill: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
  },
  outline: {
    backgroundColor: COLORS.white,
    color: COLORS.black,
    borderWidth: s(2),
    borderColor: COLORS.green,
  },
  transparent: {
    backgroundColor: 'transparent',
    color: COLORS.black,
  },
  disable: {
    backgroundColor: COLORS.lightGrey,
    color: COLORS.grey,
  },
};
type TSize = {
  S: number;
  M: number;
  L: number;
};
const BUTTON_BASE_SIZE: TSize = {
  S: s(10),
  M: s(17),
  L: s(20),
};
type TAppButton = {
  type?: TType;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  borderRadius?: number;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  loading?: boolean;
  size?: 'S' | 'M' | 'L';
  onPress?: () => void;
  disable?: boolean;
};

/**
 * Props
 * @param {TType} type - 'fill' | 'outline' | 'transparent'
 * @param {StyleProp<TextStyle>} buttonContainerStyle - container style of button
 * @param {StyleProp<ViewStyle>} buttonStyle - The style of the button.
 * @param {React.ReactNode} children - The content inside the button.
 * @param {number | string} width - The width of the button.
 * @param {number | string} height - The height of the button.
 * @param {string} label - The label text for the button.
 * @param {StyleProp<ViewStyle>} labelStyle - The style for the label text.
 * @param {number} borderRadius - The border radius of the button.
 * @param {React.ReactNode} leading - The content to be placed before the label.
 * @param {React.ReactNode} trailing - The content to be placed after the label.
 * @param {boolean} loading - Indicates whether the button is in a loading state.
 * @param {'S' | 'M' | 'L'} size - The size of the button ('S' for small, 'M' for medium, 'L' for large).
 * @param {() => void} onPress - The function to be called when the button is pressed.
 * @param {boolean} disable - Indicates whether the button is disabled.
 */

const AppButton = ({
  type = 'fill',
  buttonContainerStyle,
  buttonStyle,
  width,
  height,
  loading = false,
  borderRadius = s(10),
  leading,
  trailing,
  children,
  labelStyle,
  label = '',
  size = 'M',
  onPress,
  disable = false,
}: TAppButton) => {
  const styleBaseOnType = BUTTON_BASE_STYLE[type];
  const buttonInitStyle = StyleSheet.flatten([
    styles.container,
    styleBaseOnType,
    { padding: BUTTON_BASE_SIZE[size] },
    width && { width },
    height && { height },
    { borderRadius },
    buttonStyle,
  ]) as ViewStyle;

  const renderMiddle = () => {
    const labelInitStyle = StyleSheet.flatten([
      styles.middleContainer,
      FONT.button.XL,
      { color: styleBaseOnType?.color },
      labelStyle,
    ]) as TextStyle;
    return (
      <View>
        {!!label && <Text style={[labelInitStyle]}>{label}</Text>}
        {!!children && children}
      </View>
    );
  };

  return (
    <View style={[buttonContainerStyle]}>
      <TouchableOpacity
        style={[buttonInitStyle]}
        onPress={() => {
          InteractionManager.runAfterInteractions(() => {
            onPress && onPress();
          });
        }}
        disabled={disable}>
        {loading ? (
          <ActivityIndicator size={'small'} color={styleBaseOnType?.color} />
        ) : (
          <>
            {leading && leading}
            {renderMiddle()}
            {trailing && trailing}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: s(400),
    overflow: 'hidden',
  },
  middleContainer: {
    marginHorizontal: s(20),
  },
});
export default AppButton;
