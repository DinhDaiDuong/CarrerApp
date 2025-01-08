import { AppHeader, AppView } from '@components';
import AppImage from '@components/AppImage';
import { ISchoolByArea, ISchoolResponse } from '@interfaces/School/school';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Title } from '@screens/Result/components';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { DefaultError } from '@tanstack/query-core';
import { useQuery } from '@tanstack/react-query';
import { FONT, QUERY_KEY, s, vs, width } from '@utils';
import { TRootStackNav } from '@utils/types/RootStackNav';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
type Props = NativeStackScreenProps<TRootStackNav, 'DictionaryDetail'>;
const DictonaryDetail = ({ route }: Props) => {
  const { isLoading, data } = useQuery<unknown, DefaultError, ISchoolResponse>({
    queryKey: [QUERY_KEY.SCHOOL, route?.params?.group],
    queryFn: () =>
      api(ENDPOINTS_URL.DICTIONARY.GET_SCHOOL, 'GET', {
        params: { group: route?.params?.group },
      }),
    enabled: !!route?.params?.group,
  });
  const schoolList: ISchoolByArea[] | undefined = useMemo(() => data?.data.schoolList, [data?.data?.schoolList]);
  return (
    <AppView showsVerticalScrollIndicator={false}>
      <AppHeader title={route?.params?.name} />
      <View style={styles.container}>
        <AppImage source={{ uri: route?.params?.image }} style={styles.image} resizeMode='cover' />
        <Title title='Thuận lợi' textStyle={styles.title} />
        <Text style={styles.content}>{route?.params?.content?.pros}</Text>
        <Title title='Khó khăn' textStyle={styles.title} />
        <Text style={styles.content}>{route?.params?.content?.cons}</Text>
        <Title title='Trường đào tạo' textStyle={styles.title} />
        {schoolList?.map((item, index) => {
          return (
            <View key={index}>
              <Text style={[styles.title, { paddingHorizontal: s(30) }]}>{item?.area}</Text>
              <Text style={styles.content}>{item?.schools}</Text>
            </View>
          );
        })}
      </View>
    </AppView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: vs(10),
    gap: vs(10),
  },
  image: {
    width: width * 0.8,
    height: width * 0.5,
    alignSelf: 'center',
    borderRadius: s(10),
  },
  title: {
    ...FONT.content.M.bold,
  },
  content: {
    ...FONT.content.M.medium,
    paddingHorizontal: vs(27),
  },
});
export default DictonaryDetail;
