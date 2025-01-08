import AppCardCarousel from '@components/AppCardCarousel';
import CardCarouseltItem from '@components/AppCardCarousel/components/CardCarouselItem';
import AppImage from '@components/AppImage';
import { TExam } from '@interfaces/DTO';
import { navigationRef } from '@navigation';
import { TResults } from '@utils';
import { COLORS, s, vs, width } from '@utils/config';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import RenderHTML from 'react-native-render-html';
import Chart from './Chart';
import Title from './Title';
type THollandResult = {
  answers: Record<TExam, string>;
  results: TResults[];
};
const HollandResult = ({ answers, results }: THollandResult) => {
  const animatedScroll = useSharedValue(0);
  const renderItem = ({ item: result, index }: { item: TResults; index: number }) => {
    if (result?.type !== 'IQ' && result?.type !== 'EQ') {
      return (
        <CardCarouseltItem
          index={index}
          key={index}
          animatedScroll={animatedScroll}
          onItemPress={() => {
            navigationRef.navigate('ResultDetail', {
              url: result.resultContents[0].detail!,
            });
          }}
          length={6}
          children={
            <>
              <View style={styles.imageContainer}>
                <AppImage source={{ uri: result.resultContents[0].image }} style={styles.image} />
              </View>
              {result?.resultContents[0] && (
                <View>
                  <RenderHTML
                    source={{
                      html: result?.resultContents[0].content as unknown as string,
                    }}
                    contentWidth={200}
                    enableExperimentalMarginCollapsing={true}
                    tagsStyles={{
                      article: { color: COLORS.black },
                      h3: { alignSelf: 'center' },
                    }}
                  />
                </View>
              )}
            </>
          }
        />
      );
    }

    return null;
  };
  console.log('lenghth', results?.length);
  return (
    <View style={styles.container}>
      <Title title='Holland' />
      <View style={{ overflow: 'hidden' }}>
        <Chart answes={answers} />
      </View>
      <AppCardCarousel data={results} renderItem={renderItem} animatedScroll={animatedScroll} snapToInterval={width * 0.8} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: vs(10),
  },
  imageContainer: {
    gap: vs(5),
    alignItems: 'center',
  },
  image: {
    width: s(80),
    height: s(80),
  },
});
export default HollandResult;
