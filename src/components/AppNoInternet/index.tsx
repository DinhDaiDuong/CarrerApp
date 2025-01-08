import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {Portal} from 'react-native-portalize';
import {COLORS, FONT, s, vs, width} from '@utils';
import AppImage from '@components/AppImage';

const AppNoInternet = () => {
  return (
    <Portal>
      <View style={styles.container}>
        <View style={styles.box}>
          <AppImage
            source={require('@assets/images/no-internet.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={FONT.content.L}>Không có kết nối internet!</Text>
        </View>
      </View>
    </Portal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: COLORS.white,
    width: width * 0.8,
    padding: s(20),
    borderRadius: s(20),
    alignItems: 'center',
  },
  image: {
    width: s(150),
    height: s(150),
    marginVertical: vs(10),
  },
});
export default AppNoInternet;
