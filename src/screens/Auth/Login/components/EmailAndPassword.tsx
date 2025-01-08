import { AppButton, AppTextInput } from '@components';
import { ILoginResponse } from '@interfaces/DTO/Auth/auth';
import { navigationRef } from '@navigation';
import { LoginInput, loginSchema } from '@schemas/login.schema';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { KEY_STORE, storage } from '@store';
import { useAuthStore } from '@store/auth.store';
import { setLocalAccessToken } from '@store/local-storage.store';
import { useMutation } from '@tanstack/react-query';
import { COLORS, FONT, vs, WIDTH } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
const initialValues: LoginInput = {
  username: '',
  password: '',
};

const EmailAndPassword = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const authStore = useAuthStore();

  const {
    isPending,
    mutate: postLogin,
    error,
  } = useMutation<ILoginResponse, Error, LoginInput>({
    mutationFn: (variables: LoginInput) => {
      return api(ENDPOINTS_URL.AUTH.LOGIN, 'POST', {
        data: variables,
      }) as Promise<ILoginResponse>; // Type assertion
    },
    onSuccess: (data: ILoginResponse) => {
      storage.set(KEY_STORE.ANNONYMOUS_TOKEN, data.data.accessToken);

      const { accessToken, ...userInfo } = data?.data;
      authStore?.setAuthStore({ ...userInfo });
      setLocalAccessToken(accessToken);
      resetForm();
      Toast.show({
        type: 'success',
        text1: 'Thông báo',
        text2: 'Đăng nhập thành công!',
      });
      navigationRef.navigate('GroupList');
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Cảnh báo',
        text2: 'Đăng nhập thất bại!',
      });
    },
  });

  const onForgotPassword = () => {
    navigationRef.navigate('ForgotPassword');
  };
  const { resetForm, values, handleChange, handleSubmit, errors } = useFormik<LoginInput>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values: LoginInput) => postLogin(values), // Use mutateAsync to await the mutation
  });

  return (
    <>
      <AppTextInput
        withAsterisk
        label='Tài khoản'
        outStyle={styles.textInputOutStyle}
        containerStyle={styles.w}
        value={values.username}
        onChangeText={handleChange('username')}
        error={error?.message ?? errors.username}
      />
      <AppTextInput
        withAsterisk
        label='Mật khẩu'
        secureTextEntry={hidePassword}
        trailing={<Feather name={hidePassword ? 'eye' : 'eye-off'} size={20} color={COLORS.grey} />}
        outStyle={styles.textInputOutStyle}
        onTrailingPress={() => setHidePassword(!hidePassword)}
        containerStyle={styles.w}
        value={values.password}
        onChangeText={handleChange('password')}
        error={error?.message ?? errors.password}
      />
      <TouchableOpacity style={styles.forgotCont} onPress={onForgotPassword}>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <AppButton
        label='Đăng nhập'
        size='S'
        buttonStyle={{ width: WIDTH * 0.85, marginVertical: vs(20) }}
        labelStyle={[FONT.content.L, { color: COLORS.white }]}
        onPress={handleSubmit}
        loading={isPending}
      />
      <View style={styles.dividerCont}>
        <View style={styles.divider} />
        <Text style={[FONT.content.XS.medium, { color: COLORS.grey }]}>HOẶC</Text>
        <View style={styles.divider} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textInputOutStyle: {
    marginTop: vs(20),
  },
  forgotCont: {
    alignSelf: 'flex-end',
    marginTop: vs(8),
  },
  forgotPassword: {
    textDecorationLine: 'underline',
    color: COLORS.green,
  },
  w: {
    width: WIDTH * 0.85,
  },
  dividerCont: {
    marginVertical: vs(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    width: WIDTH * 0.35,
    height: vs(0.75),
    backgroundColor: COLORS.grey,
  },
});

export default EmailAndPassword;
