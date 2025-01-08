import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS, FONT, s, vs} from '@utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {AppHeader} from '@components';
import SignUpForm from './components/SignUpForm';

const SignUp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <AppHeader title="Đăng ký" />
        <View style={styles.body}>
          <Text style={styles.subTitle}>Đăng ký với vai trò là giáo viên</Text>
          <SignUpForm />
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
  body: {
    paddingHorizontal: s(27),
  },
  subTitle: {
    ...FONT.content.M.medium,
    color: COLORS.darkGrey,
    marginVertical: vs(8),
  },
});
export default SignUp;
