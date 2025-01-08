import { ListRenderItemInfo, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import React, { useMemo, useRef } from 'react';
import { AppHeader, AppView } from '@components';
import DictionaryItem from './components/DictionaryItem';
import { COLORS, FONT, QUERY_KEY, height, s, vs } from '@utils';
import { FlatList } from 'react-native-gesture-handler';
import { DefaultError, useQuery } from '@tanstack/react-query';
import api from '@service/api';
import { ENDPOINTS_URL } from '@service';
import { IDictionary, IDictionaryResponse } from '@interfaces/DTO/Dictionary/dictionary';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AppNoData from '@components/AppNoData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Dictionary = () => {
  const ref = useRef<FlatList>(null);

  const { isLoading, data, error } = useQuery<unknown, DefaultError, IDictionaryResponse>({
    queryKey: [QUERY_KEY.DICTIONARY],
    queryFn: () => api(ENDPOINTS_URL.DICTIONARY.GET_DICTIONARY, 'GET', {}),
  });

  const dictionary = useMemo(() => data?.data, [data?.data]);

  const scrollToIndex = (index: number) => {
    setTimeout(() => {
      if (ref.current && dictionary && dictionary?.length > 0)
        ref?.current?.scrollToIndex({ animated: true, index, viewPosition: 0.3 });
    }, 300);
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<IDictionary>) => {
    return (
      <Animated.View entering={FadeInDown.delay(index * 100)}>
        <DictionaryItem
          key={index}
          scrollToItem={() => scrollToIndex(index)}
          title={`Ngành nghề khối ${item.group}`}
          majors={item?.majors}
          group={item?.group}
        />
      </Animated.View>
    );
  };

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.searchHint}>
        <Ionicons name="search-outline" size={s(20)} color={COLORS.darkGrey} />
        <Text style={styles.searchHintText}>Khám phá ngành nghề theo khối</Text>
      </View>
      <Text style={styles.totalCount}>
        {dictionary?.length || 0} khối ngành
      </Text>
    </View>
  );

  return (
    <AppView style={styles.mainContainer} scrollEnabled={false}>
      <View style={styles.header}>
        <AppHeader title="Từ điển ngành nghề" />
        <Text style={styles.subtitle}>Khám phá và tìm hiểu về các ngành nghề phù hợp với bạn</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={dictionary}
          renderItem={renderItem}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.content}
          ref={ref}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              ref?.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
          ListEmptyComponent={() =>
            error && (
              <Animated.View style={styles.errorContainer} entering={FadeIn}>
                <AppNoData />
                <Text style={styles.errorText}>
                  Oops! Chưa có từ điển nào được cập nhật!{'\n'}Vui lòng thử lại sau.
                </Text>
              </Animated.View>
            )
          }
        />
      )}
    </AppView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingBottom: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  subtitle: {
    ...FONT.content.S,
    color: COLORS.darkGrey,
    textAlign: 'center',
    marginTop: vs(8),
    paddingHorizontal: s(20),
  },
  container: {
    flex: 1,
  },
  content: {
    padding: s(16),
    gap: vs(12),
    paddingBottom: vs(100),
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  searchHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  searchHintText: {
    ...FONT.content.M,
    color: COLORS.darkGrey,
  },
  totalCount: {
    ...FONT.content.S,
    color: COLORS.green,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: vs(12),
  },
  loadingText: {
    ...FONT.content.M,
    color: COLORS.darkGrey,
  },
  errorContainer: {
    alignItems: 'center',
    paddingTop: vs(40),
  },
  errorText: {
    ...FONT.content.L,
    color: COLORS.grey,
    textAlign: 'center',
    lineHeight: vs(24),
    marginTop: vs(16),
  },
});

export default Dictionary;