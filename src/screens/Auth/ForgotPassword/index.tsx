import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS, vs, WIDTH} from '@utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppHeader} from '@components';
import AppImage from '@components/AppImage';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <SafeAreaView style={styles.overall}>
      <AppHeader title="Quên mật khẩu" />
      <AppImage source={require('@assets/images/logo-small.png')} style={styles.logo} resizeMode="contain" />
      <ForgotPasswordForm />
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  overall: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: WIDTH * 0.8,
    height: vs(100),
    alignSelf: 'center',
    marginTop: vs(10),
  },
});
