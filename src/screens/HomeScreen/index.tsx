import AppRoundedButton from '@components/AppRoundedButton';
import AppSkeleton from '@components/AppSkeleton';
import AppView from '@components/AppView';
import { navigationRef } from '@navigation';
import { KEY_STORE, storage } from '@store';
import { COLORS, FONT, s, vs } from '@utils/config';
import React, { lazy, Suspense, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ButtonFunction, HistoryCard, NewsCard } from './components';

const Carousel = lazy(() => import('./components/Carousel/Carousel'));
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-7671392847069245/2923533772';

const HomeScreen = () => {
  const bannerRef = useRef<BannerAd>(null);

  return (
    <SafeAreaView style={styles.container}>
      <AppView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Career App</Text>
          <Text style={styles.headerSubtitle}>
            Tư vấn hướng nghiệp và chọn ngành Đại Học cho học sinh THPT
          </Text>
        </View>

        <Suspense 
          fallback={
            <AppSkeleton 
              width={'100%'} 
              height={200} 
            />
          }
        >
          <Carousel />
        </Suspense>

        <ButtonFunction />
        <NewsCard />
        <HistoryCard />

        <View style={styles.bottomSpacing} />
      </AppView>

      <View style={styles.footer}>
        <BannerAd 
          ref={bannerRef} 
          unitId={adUnitId} 
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} 
        />
        
        <AppRoundedButton
          type='fill'
          style={styles.chatButton}
          shadow={true}
          onPress={() => navigationRef.navigate('ChatBot')}
        >
          <View style={styles.chatButtonContent}>
            <Ionicons 
              name='chatbubble-ellipses-outline' 
              color={COLORS.white} 
              size={s(24)} 
            />
            <Text style={styles.chatButtonText}>Tư vấn ngay</Text>
          </View>
        </AppRoundedButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0, // Removed horizontal padding here
  },
  header: {
    paddingVertical: vs(16),
    paddingHorizontal: s(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    marginBottom: vs(16),
  },
  headerTitle: {
    ...FONT.content.L,
    fontWeight: 'bold',
    color: COLORS.green,
    textAlign: 'center',
    marginBottom: vs(4),
  },
  headerSubtitle: {
    ...FONT.content.S,
    color: COLORS.darkGrey,
    textAlign: 'center',
    lineHeight: vs(20),
  },
  bottomSpacing: {
    height: vs(80),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    paddingTop: vs(8),
  },
  chatButton: {
    position: 'absolute',
    right: s(16),
    bottom: vs(60),
    width: s(140),
    height: vs(48),
    borderRadius: s(24),
  },
  chatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
  },
  chatButtonText: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default HomeScreen;