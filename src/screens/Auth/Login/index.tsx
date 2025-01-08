import {View, StyleSheet} from 'react-native';
import React from 'react';
import {AppHeader} from '@components';
import {COLORS, s, vs, WIDTH} from '@utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppImage from '@components/AppImage';
import {ScrollView} from 'react-native-gesture-handler';
import EmailAndPassword from './components/EmailAndPassword';
import LoginWithGoogle from './components/LoginWithGoogle';
import SignUpButton from './components/SignUpButton';

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <AppHeader title="Đăng nhập" />
        <AppImage source={require('@assets/images/logo-small.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.body}>
          <EmailAndPassword />
          <LoginWithGoogle />
          <SignUpButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: WIDTH * 0.8,
    height: vs(100),
    alignSelf: 'center',
    marginTop: vs(10),
  },
  body: {
    paddingHorizontal: s(27),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Login;
