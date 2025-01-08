import {View, useWindowDimensions} from 'react-native';
import React, {Suspense} from 'react';
import {height, s, vs} from '@utils/config';
import AppHeader from '@components/AppHeader';
import AppSkeleton from '@components/AppSkeleton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TRootStackNav} from '@utils/types/RootStackNav';
import WebView from 'react-native-webview';

type Props = NativeStackScreenProps<TRootStackNav, 'NewsDetail1'>;
const NewsDetail1 = ({route}: Props) => {
  const {width} = useWindowDimensions();

  const content = route?.params?.content;
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{flex: 1}}>
        <Suspense
          fallback={
            <View style={{gap: vs(5), marginTop: 10}}>
              <AppSkeleton width={'100%'} height={20} radius={10} />
              <AppSkeleton width={'92%'} height={20} radius={10} />
              <AppSkeleton width={'67%'} height={20} radius={10} />
              <AppSkeleton width={'80%'} height={20} radius={10} />
              <AppSkeleton width={'10%'} height={20} radius={10} />
            </View>
          }>
          <WebView source={{uri: content}} style={{width: width, height: height}} />
        </Suspense>
        <AppHeader style={{position: 'absolute', marginTop: s(40)}} />
      </View>
    </View>
  );
};

export default NewsDetail1;
