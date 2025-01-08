import {
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  ImageProps,
} from 'react-native';
import React from 'react';
type Props = {
  style?: StyleProp<ViewStyle>;
} & Partial<ImageProps>;
const AppNoData = (props: Props) => {
  const {style, ...rest} = props;
  return (
    <Image
      style={[styles.image, style]}
      source={require('@assets/images/notFound.png')}
      {...rest}
    />
  );
};
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});
export default AppNoData;
