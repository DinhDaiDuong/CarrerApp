import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONT, s, vs} from '@utils';
import {navigationRef} from '@navigation';

const SignUpButton = () => {
  return (
    <View style={styles.container}>
      <Text style={FONT.content.M.medium}>Chưa có tài khoản?</Text>
      <TouchableOpacity onPress={() => navigationRef.navigate('SignUp')}>
        <Text style={styles.signUpBtn}>Đăng ký là giáo viên</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: vs(20),
    flexDirection: 'row',
    gap: s(5),
  },
  signUpBtn: {
    ...FONT.content.M.bold,
    color: COLORS.green,
  },
});
export default SignUpButton;
