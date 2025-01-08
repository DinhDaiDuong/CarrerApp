import { AppButton, AppTextInput } from '@components';
import { IResponse } from '@interfaces/DTO';
import { navigationRef } from '@navigation';
import { ForgotPasswordInput, forgotPasswordSchema } from '@schemas/forgot-password.schema';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { useMutation } from '@tanstack/react-query';
import { COLORS, FONT, vs, WIDTH } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';

const initialValues: ForgotPasswordInput = {
  username: '',
  newPassword: '',
};

const ForgotPasswordForm = () => {
  const [hidePassword2, setHidePassword2] = useState(true);

  const {
    isPending,
    mutate: postForgotPassword,
    error,
  } = useMutation<IResponse, Error, ForgotPasswordInput>({
    mutationFn: (variables: ForgotPasswordInput) => {
      return api(ENDPOINTS_URL.AUTH.FORGOT_PASSWORD, 'POST', {
        data: variables,
      }) as Promise<IResponse>; // Type assertion
    },
    onSuccess: (data: IResponse) => {
      resetForm();
      Toast.show({
        type: 'success',
        text1: 'Thông báo',
        text2: data.message,
      });
      navigationRef.navigate('Login');
    },
    onError: (e) => {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'Cảnh báo',
        text2: e.message,
      });
    },
  });
  const { resetForm, values, handleChange, handleSubmit, errors } = useFormik<ForgotPasswordInput>({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => postForgotPassword(values), // Use mutateAsync to await the mutation
  });
  return (
    <View style={styles.overall}>
      <AppTextInput
        withAsterisk
        label='Tài khoản'
        outStyle={styles.textInputOutStyle}
        containerStyle={styles.w}
        value={values.username}
        onChangeText={handleChange('username')}
        error={errors.username}
      />
      {/* <AppTextInput
        withAsterisk
        label='Mật khẩu hiện tại'
        secureTextEntry={hidePassword1}
        trailing={<Feather name={hidePassword1 ? 'eye' : 'eye-off'} size={20} color={COLORS.grey} />}
        outStyle={styles.textInputOutStyle}
        onTrailingPress={() => setHidePassword1(!hidePassword1)}
        containerStyle={styles.w}
        value={values.oldPassword}
        onChangeText={handleChange('oldPassword')}
        error={errors.oldPassword}
      /> */}
      <AppTextInput
        withAsterisk
        label='Mật khẩu khẩu mới'
        secureTextEntry={hidePassword2}
        trailing={<Feather name={hidePassword2 ? 'eye' : 'eye-off'} size={20} color={COLORS.grey} />}
        outStyle={styles.textInputOutStyle}
        onTrailingPress={() => setHidePassword2(!hidePassword2)}
        containerStyle={styles.w}
        value={values.newPassword}
        onChangeText={handleChange('newPassword')}
        error={errors.newPassword}
      />
      <AppButton
        label='Xác thực'
        size='S'
        buttonStyle={{ width: WIDTH * 0.85, marginVertical: vs(20) }}
        labelStyle={[FONT.content.L, { color: COLORS.white }]}
        onPress={handleSubmit}
        loading={isPending}
      />
    </View>
  );
};

export default ForgotPasswordForm;

const styles = StyleSheet.create({
  overall: {
    alignItems: 'center',
  },
  textInputOutStyle: {
    marginTop: vs(20),
  },
  w: {
    width: WIDTH * 0.85,
  },
});
