import { AppBackDrop, AppImagePicker, AppTextInput } from '@components';
import AppImage from '@components/AppImage';
import { IResponse } from '@interfaces/DTO';
import { ISchoolSubjectsResponse } from '@interfaces/DTO/SchoolSubject/schoolSubject';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { COLORS, FONT, QUERY_KEY, s, TSubject, vs } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
interface TSchoolScore {
  subjects: Record<string, TSubject>;
  setSubjects: (subjects: Record<string, TSubject>) => void;
}
const SchoolScore = ({ subjects, setSubjects }: TSchoolScore) => {
  const textInputRefs = useRef<React.RefObject<TextInput>[]>([]);
  const animatedValue = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animatedValue.value, [0, 1], [0, 360])}deg` }],
  }));
  const { isLoading, data } = useQuery<unknown, DefaultError, ISchoolSubjectsResponse>({
    queryKey: [QUERY_KEY.SCHOOL_SUBJECTS],
    queryFn: () => api(ENDPOINTS_URL.SCHOOL_SUBJECTS.GET_SUBJECTS, 'GET', {}),
  });
  const convertImageToText = useMutation({
    mutationKey: [QUERY_KEY.OCR],
    mutationFn: async (image: any) => {
      console.log('image', image.data);
      if (!image) return;
      return await api(ENDPOINTS_URL.UPLOAD.UPLOAD_OCR, 'POST', {
        data: { base64Image: JSON.stringify(image.data), mimeType: image?.mime },
      });
      // return await uploadImage({
      //   uri: image?.path,
      //   type: image?.mime,
      //   name: image?.path,
      // });
    },
    onSuccess: async (data: IResponse | any) => {
      const subjectsList = Object.values(subjects);
      console.log('data', data);
      InteractionManager.runAfterInteractions(() => {
        if (data?.code == 200 && data?.data) {
          setSubjects(data?.data);
        }
      });
    },
  });
  useEffect(() => {
    if (data) {
      const newData = new Map();
      data?.data?.forEach((d) => {
        newData.set(d.name, { ...d, value: '' });
      });
      setSubjects(Object.fromEntries(newData));
    }
  }, [data]);
  useEffect(() => {
    if (convertImageToText.isPending) {
      animatedValue.value = withRepeat(withTiming(1, { duration: 1000 }), -1);
    } else {
      animatedValue.value = withTiming(0);
    }
  }, [convertImageToText.isPending]);
  const [openImagePicker, setOpenImagePicker] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const onLaunchCamera = async () => {
    await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(async (image) => {
        setOpenImagePicker(false);
        setImageUrl(image.path);
        convertImageToText.mutate(image);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  const onLibrary = async () => {
    await ImagePicker.openPicker({
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
      showCropGuidelines: false,
    })
      .then(async (image) => {
        setOpenImagePicker(false);
        setImageUrl(image.path);
        convertImageToText.mutate(image);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  const onValueChange = (key: string, value: string, vnName: string) => {
    console.log('eee', key, +value, vnName);
    if (value.length === 2 && value[1] !== '.' && +value[1] > 0) {
      setSubjects({
        ...subjects,
        [key]: {
          vnName,
          value: value[1],
        },
      });
      return;
    }
    if (+value >= 0 && +value <= 10)
      setSubjects({
        ...subjects,
        [key]: {
          vnName,
          value: value,
        },
      });
  };
  const onNextFocus = (index: number) => {
    if (index >= 0 && index < Object.keys(subjects)?.length - 1 && textInputRefs.current[index + 1]) {
      textInputRefs.current[index + 1]?.current?.focus();
    }
    if (index === Object.keys(subjects)?.length - 1) {
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
      }
    }
  };
  if (isLoading) return <ActivityIndicator size='small' color={COLORS.green} />;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.title}>Vui lòng nhập điểm trung bình của từng môn nhé!</Text>
        <View style={styles.scanContainer}>
          <TouchableOpacity onPress={() => setOpenImagePicker(true)}>
            <AntDesign name='scan1' size={s(33)} color={COLORS.green} />
          </TouchableOpacity>
          <View style={{ marginLeft: s(10) }}>
            <Text style={FONT.content.M.semiBold}>Tính năng thử nghiệm</Text>
            <Text style={FONT.content.S}>Thử chụp ảnh học bạ của bạn nhé!</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {Object.entries(subjects)?.map(([key, subject], index) => {
            textInputRefs.current[index] = textInputRefs.current[index] || React.createRef<TextInput>();
            return (
              <AppTextInput
                key={index}
                label={subject.vnName}
                value={subject.value.toString()}
                containerStyle={{ backgroundColor: COLORS.white }}
                onChangeText={(text) => onValueChange(key, text, subject.vnName)}
                keyboardType='numeric'
                placeholder='0'
                onSubmitEditing={() => {
                  onNextFocus(index);
                }}
                returnKeyType='done'
                ref={textInputRefs.current[index]}
                blurOnSubmit={false}
                autoFocus={index === 0}
              />
            );
          })}
        </View>
        <AppBackDrop
          open={openImagePicker || convertImageToText.isPending}
          setOpen={setOpenImagePicker}
          disabled={convertImageToText.isPending}>
          {convertImageToText.isPending ? (
            <Animated.View style={animatedStyle}>
              <AppImage source={require('@assets/images/bookmark.png')} style={styles.loadingImage} resizeMode='contain' />
            </Animated.View>
          ) : (
            <AppImagePicker
              openImagePicker={openImagePicker}
              setOpenImagePicker={setOpenImagePicker}
              onLaunchCamera={onLaunchCamera}
              onLibrary={onLibrary}
            />
          )}
        </AppBackDrop>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(27),
    gap: vs(10),
    flex: 1,
  },
  title: {
    ...FONT.content.M.semiBold,
  },
  scanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingImage: {
    width: s(50),
    height: s(50),
    alignSelf: 'center',
  },
});
export default SchoolScore;
