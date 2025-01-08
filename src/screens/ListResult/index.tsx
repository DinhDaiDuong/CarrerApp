import AppHeader from '@components/AppHeader';
import AppNoData from '@components/AppNoData';
import AppSkeleton from '@components/AppSkeleton';
import AppView from '@components/AppView';
import { storage } from '@store';
import { COLORS, FONT, s, vs, width } from '@utils/config';
import React, { lazy, Suspense, useRef } from 'react';
import { ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AppHistoryCard = lazy(() => import('@components/AppHistoryCard/AppHistoryCard'));
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-7671392847069245/2923533772';

const ListResult = () => {
  const results = JSON.parse(storage.getString('LIST_RESULT') ?? '{}') as any[];
  const bannerRef = useRef<BannerAd>(null);

  const renderCard = ({ item, index }: ListRenderItemInfo<any>) => {
    return (
      <Suspense fallback={<AppSkeleton width={width * 0.9} height={300} radius={10} />}>
        <AppHistoryCard result={item} key={index} isExpand={true} index={index} />
      </Suspense>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <AppView
        data={results ?? []}
        renderItem={renderCard}
        contentContainerStyle={styles.containerStyle}
        ListHeaderComponent={() => <AppHeader title='Kết quả kiểm tra' style={{ paddingHorizontal: s(10) }} />}
        ListFooterComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.placeHolderContainer}>
            <AppNoData />
            <Text style={styles.placeHolderText}>Oops! Bạn chưa làm bài kiểm tra nào! Hãy đến mục làm bài kiểm tra nhé!</Text>
          </View>
        }
        renderToHardwareTextureAndroid
        removeClippedSubviews
      />
      <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
};

export default ListResult;
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  containerStyle: {
    gap: vs(10),
    alignSelf: 'center',
    width: '90%',
  },
  placeHolderContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  placeHolderText: {
    ...FONT.content.L,
    color: COLORS.grey,
    textAlign: 'center',
  },
});
