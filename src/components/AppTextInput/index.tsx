import {View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInput, TextInputProps} from 'react-native';
import React, {forwardRef, useState} from 'react';
import {COLORS, FONT, s, vs} from '@utils/config';
import {width} from '@utils/config';
import AppButton from '@components/AppButton';
type TAppTextInput = {
  width?: number | string;
  height?: number | string;
  outStyle?: StyleProp<ViewStyle>; // include text input + label
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>; // style container of text input
  leading?: React.ReactNode;
  onLeadingPress?: () => void;
  trailing?: React.ReactNode;
  onTrailingPress?: () => void;
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  withAsterisk?: boolean;
  error?: string;
} & Partial<TextInputProps>;

/**
 * @typedef {Object} TAppTextInput
 * @property {number | string} width - The width of the text input.
 * @property {number | string} height - The height of the text input.
 * @property {import('react-native').StyleProp<import('react-native').ViewStyle>} outStyle - Style for the outer container, including the text input and label.
 * @property {string} label - Label for the text input.
 * @property {import('react-native').StyleProp<import('react-native').TextStyle>} labelStyle - Style for the label text.
 * @property {import('react-native').StyleProp<import('react-native').ViewStyle>} containerStyle - Style for the container of the text input.
 * @property {React.ReactNode} leading - Content to be placed before the text input.
 * @property {() => void} onLeadingPress - Function to be called when the leading content is pressed.
 * @property {React.ReactNode} trailing - Content to be placed after the text input.
 * @property {() => void} onTrailingPress - Function to be called when the trailing content is pressed.
 * @property {string} value - Value of the text input.
 * @property {(value: string) => void} onChangeText - Function to be called when the text input value changes.
 * @property {string} placeholder - Placeholder text for the text input.
 * @augments Partial<import('react-native').TextInputProps>
 */

const AppTextInput = forwardRef<TextInput, TAppTextInput>((props: TAppTextInput, ref) => {
  const {
    width,
    height,
    outStyle,
    label = '',
    labelStyle,
    containerStyle,
    leading,
    onLeadingPress,
    trailing,
    onTrailingPress,
    value,
    onChangeText,
    placeholder = 'Nhập thông tin',
    withAsterisk = false,
    error,
    ...rest
  } = props;
  const [isFocus, setIsFocus] = useState(false);
  const containerInitStyle = StyleSheet.flatten([
    styles.container,
    width && {width},
    height && {height},
    {borderColor: isFocus ? COLORS.green : COLORS.grey},
    containerStyle,
  ]) as ViewStyle;
  const renderLabel = () => {
    const labelInitStyle = StyleSheet.flatten([FONT.content.M.regular, labelStyle, {marginBottom: vs(5)}]) as TextStyle;
    return (
      <View style={styles.labelCont}>
        <Text style={labelInitStyle}>{label}</Text>
        {withAsterisk && <Text style={styles.asterisk}>*</Text>}
      </View>
    );
  };
  return (
    <View style={outStyle}>
      {!!label && renderLabel()}
      <View style={[containerInitStyle]}>
        {!!leading && (
          <AppButton onPress={onLeadingPress} type="transparent" size="S">
            {leading}
          </AppButton>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.textInput}
          placeholderTextColor={COLORS.grey}
          placeholder={placeholder}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          autoCapitalize="none"
          {...rest}
          ref={ref}
        />
        {trailing && (
          <AppButton type="transparent" onPress={onTrailingPress} size="S">
            {trailing}
          </AppButton>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: s(5),
    borderColor: COLORS.grey,
    width: width * 0.8,
    maxWidth: s(400),
    alignItems: 'center',
    minWidth: s(30),
  },
  textInput: {
    flex: 1,
    marginHorizontal: s(8),
    ...FONT.content.M.regular,
    paddingVertical: s(10),
  },
  labelCont: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  asterisk: {
    color: COLORS.red,
  },
  error: {
    ...FONT.content.XS.regular,
    color: COLORS.red,
    marginTop: vs(2),
  },
});
export default AppTextInput;
