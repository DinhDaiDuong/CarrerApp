import React, {useEffect, useState} from 'react';
import AppNavigation from '@navigation';
import {onlineManager, QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '@utils/constants';
import {Host} from 'react-native-portalize';
import {initializeMMKVFlipper} from 'react-native-mmkv-flipper-plugin';
import {storage} from '@store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NetInfo, {addEventListener} from '@react-native-community/netinfo';
import {AppNoInternet} from '@components';
import Toast from 'react-native-toast-message';
//const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

const App = () => {
  if (__DEV__) {
    initializeMMKVFlipper({default: storage});
  }
  const [isInternet, setIsInternet] = useState<boolean | null>(true);

  useEffect(() => {
    // Subscribe
    const unsubscribe = addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsInternet(state.isConnected);
    });
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Host>
        <GestureHandlerRootView style={{flex: 1}}>
          <AppNavigation />
          {isInternet === false && <AppNoInternet />}
        </GestureHandlerRootView>
      </Host>
      <Toast />
    </QueryClientProvider>
  );
};

export default App;
