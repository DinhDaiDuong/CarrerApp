import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import AppNoData from '@components/AppNoData';
import {COLORS} from '@utils/config';
import AppSkeleton from '@components/AppSkeleton';
type TAppImage = {
  style?: StyleProp<ViewStyle>;
  source?: ImageSourcePropType;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
} & Partial<FastImageProps>;
const AppImage = ({
  style,
  source,
  resizeMode = 'cover',
  ...rest
}: TAppImage) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const onLoadStart = () => {
    setIsError(false);
    setIsLoading(true);
  };
  const onLoadEnd = () => {
    setIsLoading(false);
  };
  const onError = () => {
    setIsError(true);
  };
  return (
    <View style={[styles.container, style]}>
      <FastImage
        style={styles.image}
        source={source}
        {...rest}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        onError={onError}
        resizeMode={resizeMode}
      />
      {isLoading && (
        <View style={styles.fallBack}>
          <AppSkeleton width={'100%'} height={'100%'} />
        </View>
      )}
      {isError && (
        <View style={styles.fallBack}>
          <AppNoData style={styles.image} />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallBack: {
    zIndex: 999,
    backgroundColor: COLORS.white,
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AppImage;
