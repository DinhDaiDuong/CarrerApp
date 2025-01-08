import { FONT, vs, width } from '@utils';
import React from 'react';
import { Image, ImageProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
type Props = {
  style?: StyleProp<ViewStyle>;
} & Partial<ImageProps>;
const AppEmpty = (props: Props) => {
  const { style, ...rest } = props;
  return (
    <View style={styles.container}>
      <Image style={[styles.image, style]} source={require('@assets/images/empty.png')} resizeMode='contain' {...rest} />
      <Text style={FONT.content.S}>Không có dữ liệu ...</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width,
    marginVertical: vs(16),
    gap: vs(16),
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
});
export default AppEmpty;
