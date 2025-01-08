import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONT, QUERY_KEY, s, vs, WIDTH} from '@utils';
import {AppButton, AppTextInput} from '@components';
import Feather from 'react-native-vector-icons/Feather';
import Checkbox from '@screens/ExamQuestion/components/Question/Checkbox';
import {Title} from '@screens/Result/components';
import {SignUpInput, signUpSchema} from '@schemas/sign-up.schema';
import {useFormik} from 'formik';
import {useMutation} from '@tanstack/react-query';
import {ISignUpResponse, SignUpFormData} from '@interfaces/DTO/Auth/auth';
import api from '@service/api';
import {ENDPOINTS_URL} from '@service';
import {navigationRef} from '@navigation';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';

const SAMPLE_TERMS = [
  {
    id: 1,
    content: 'Khi đăng ký là giáo viên, bạn sẽ được cung cấp link web, nơi bạn có thể tự thiết kế bài kiểm tra, tạo nhóm cho học sinh của mình.',
  },
  {
    id: 2,
    content: 'Khi đăng ký là giáo viên, bạn phải tuân thủ các quy tắc của Career App.',
  },
];
const initialValues: SignUpInput = {
  name: '',
  email: '',
  password: '',
  username: '',
};
const SignUpForm = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [agreeTerm, setAgreeTerm] = useState(false);
  const {
    isPending,
    mutate: postSignUp,
    error,
  } = useMutation<ISignUpResponse, Error, SignUpFormData>({
    mutationKey: [QUERY_KEY.AUTH],
    mutationFn: (variables: SignUpFormData) => {
      return api(ENDPOINTS_URL.AUTH.SIGN_UP, 'POST', {
        data: {
          ...variables,
        },
      }) as Promise<ISignUpResponse>; // Type assertion
    },
    onSuccess: (data: ISignUpResponse) => {
      resetForm();
      Toast.show({
        type: 'success',
        text1: 'Thông báo',
        text2: 'Đăng ký thành công!',
      });
      navigationRef.navigate('Login');
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Cảnh báo',
        text2: 'Đăng ký thất bại',
      });
    },
  });
  const {resetForm, values, handleChange, handleSubmit, errors} = useFormik<SignUpInput>({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: (value: SignUpInput) => {
      const deviceId = DeviceInfo.getUniqueIdSync();
      postSignUp({
        ...value,
        role: 'TEACHER',
        deviceId: deviceId,
      });
    },
  });
  return (
    <View style={styles.container}>
      <AppTextInput
        withAsterisk
        label="Họ và tên"
        containerStyle={styles.w}
        value={values.name}
        onChangeText={handleChange('name')}
        error={errors.name}
      />
      <AppTextInput
        withAsterisk
        label="Tên đăng nhập"
        containerStyle={styles.w}
        value={values.username}
        onChangeText={handleChange('username')}
        error={errors.username}
      />
      <AppTextInput
        withAsterisk
        label="Email"
        containerStyle={styles.w}
        value={values.email}
        onChangeText={handleChange('email')}
        error={errors.email}
      />
      <AppTextInput
        withAsterisk
        label="Mật khẩu"
        secureTextEntry={hidePassword}
        trailing={<Feather name={hidePassword ? 'eye' : 'eye-off'} size={20} color={COLORS.grey} />}
        onTrailingPress={() => setHidePassword(!hidePassword)}
        containerStyle={styles.w}
        value={values.password}
        onChangeText={handleChange('password')}
        error={errors.password}
      />
      {/* Term of use */}

      <View style={styles.termCont}>
        <Title title="Điều khoản sử dụng" textStyle={styles.term} wrapperStyle={{marginHorizontal: -s(27)}} />
        {SAMPLE_TERMS?.map((term, index) => {
          return (
            <View key={index}>
              <Text style={[styles.term, {textAlign: 'justify'}]}>● {term?.content}</Text>
            </View>
          );
        })}
        <Checkbox
          isCheck={agreeTerm}
          onPress={() => setAgreeTerm(!agreeTerm)}
          label={<Text style={styles.term}>Tôi đã hiểu và đồng ý với điều khoản sử dụng trên.</Text>}
          checkedColor={COLORS.green}
        />
      </View>
      {error?.message && <Text style={styles.error}>* {error?.message}</Text>}
      <AppButton
        label="Đăng ký"
        size="S"
        buttonStyle={{width: WIDTH * 0.85, marginVertical: vs(20)}}
        labelStyle={[FONT.content.L, {color: COLORS.white}]}
        disable={!agreeTerm}
        type={agreeTerm ? 'fill' : 'disable'}
        loading={isPending}
        onPress={handleSubmit}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: vs(10),
    gap: vs(20),
  },
  error: {fontSize: 14, color: 'red'},

  w: {
    width: WIDTH * 0.85,
  },
  termCont: {
    gap: vs(5),
  },
  term: {
    ...FONT.content.M.regular,
    color: COLORS.darkGrey,
  },
  agreeTerm: {
    flexDirection: 'row',
    gap: s(2),
    width: WIDTH * 0.85,
    alignItems: 'center',
  },
});
export default SignUpForm;
