import { IAnnonymousToken, IAnnonymousTokenResponse } from '@interfaces/DTO/Auth/auth';
import { navigationRef } from '@navigation';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { KEY_STORE, storage } from '@store';
import { DefaultError, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@utils';
import { COLORS, width } from '@utils/config';
import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
const SplashScreen = () => {
  const { data } = useQuery<IAnnonymousToken, DefaultError, IAnnonymousTokenResponse>({
    queryKey: [QUERY_KEY.AUTH],
    queryFn: async () =>
      api(ENDPOINTS_URL.AUTH.GET_ANNONYMOUS_TOKEN, 'GET', {
        params: {
          key: '25012003',
          deviceId: await DeviceInfo.getUniqueId(),
        },
      }),
    enabled: storage.getString(KEY_STORE.ANNONYMOUS_TOKEN) ? false : true,
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigationRef.navigate('HomeScreen');
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (data?.data?.token) storage.set(KEY_STORE.ANNONYMOUS_TOKEN, data.data.token);
  }, [data?.data]);
  return (
    <View style={styles.container}>
      {/* <LottieView source={require('@assets/images/clover.json')} autoPlay loop style={styles.lottie} resizeMode='contain' /> */}
      <Image source={require('@assets/images/logo-small1.png')} style={styles.image} resizeMode='contain' />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: width,
    height: width,
  },
  image: {
    width: width * 0.7,
    height: 100,
  },
});
export default SplashScreen;
