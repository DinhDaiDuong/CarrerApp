import {ViewStyle, StyleProp, StyleSheet} from 'react-native';
import React from 'react';
import AppButton, {TType} from '@components/AppButton';
import {s} from '@utils/config';
type TRoundedButton = {
  children: React.ReactNode;
  type?: TType;
  style?: StyleProp<ViewStyle>;
  shadow?: boolean;
  onPress?: () => void;
};
const AppRoundedButton = ({
  children,
  type = 'outline',
  style,
  shadow = false,
  onPress = () => {},
}: TRoundedButton) => {
  return (
    <AppButton
      buttonStyle={[
        styles.container,
        type === 'outline' && {borderWidth: 0},
        shadow && styles.shadow,
        style,
      ]}
      children={children}
      type={type}
      onPress={onPress}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    width: s(45),
    height: s(45),
    borderRadius: s(100),
    padding: 0,
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
});
export default AppRoundedButton;
