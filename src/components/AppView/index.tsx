import React, { forwardRef } from 'react';
import {
  FlatList,
  FlatListProps,
  ImageBackground,
  ListRenderItemInfo,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

type TAppView<TData> = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  data?: TData[];
  renderItem?: (info: ListRenderItemInfo<TData>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
} & Partial<FlatListProps<TData>>;
export type TAppViewRef = {
  scrollToItem: (index: number) => void;
};
const AppView = forwardRef<TAppViewRef, TAppView<any>>(
  <TData,>({ children, style, data, renderItem, ...FlatlistProps }: TAppView<TData>, ref: React.ForwardedRef<TAppViewRef>) => {
    console.log('data', data);
    return (
      <ImageBackground source={require('@assets/images/background2.jpg')} resizeMode='cover' style={styles.wrapper}>
        <SafeAreaView style={[styles.container, style]}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {data === undefined ? (
              <ScrollView removeClippedSubviews renderToHardwareTextureAndroid {...FlatlistProps} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>{children && children}</View>
              </ScrollView>
            ) : (
              <FlatList data={data} renderItem={renderItem} {...FlatlistProps} />
            )}
          </GestureHandlerRootView>
        </SafeAreaView>
      </ImageBackground>
    );
  },
);
const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
export default AppView;
