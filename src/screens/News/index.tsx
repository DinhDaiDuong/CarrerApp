import { AppButton, AppTextInput } from '@components';
import AppHeader from '@components/AppHeader';
import AppNoData from '@components/AppNoData';
import { INew, INewsResponse } from '@interfaces/DTO';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { DefaultError, InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { COLORS, FONT, s, vs } from '@utils/config';
import { QUERY_KEY, queryClient } from '@utils/constants';
import React, { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NewsJobs from './components/NewsJobs';
const News = () => {
  const {
    data: Categories,
    isLoading,
    error,
  } = useQuery<unknown, DefaultError, { _id: string; categoryName: string }[]>({
    queryKey: [QUERY_KEY.NEWS, QUERY_KEY.NEWS_CATEGORIES],
    queryFn: () => api(ENDPOINTS_URL.NEWS.GET_ALL_CATEGORIES, 'GET', {}),
  });

  const [categoryId, setCategoryId] = useState(Categories?.[0]._id);
  const [searchInfo, setSearchInfo] = useState('');
  const deferSearchInfo = useDeferredValue(searchInfo);
  const onCategoryPress = (id: string) => {
    if (isLoading || isFetchingNextPage) return;
    if (categoryId !== id) {
      startTransition(() => {
        setCategoryId(id);
        setSearchInfo('');
      });
    }
  };
  useEffect(() => {
    setCategoryId(Categories?.[0]._id);
  }, [Categories]);
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<
    INewsResponse,
    DefaultError,
    InfiniteData<INewsResponse>
  >({
    queryKey: [QUERY_KEY.NEWS, categoryId],
    queryFn: async ({ pageParam }) =>
      api(ENDPOINTS_URL.NEWS.GET_NEWS, 'GET', {
        params: { id: categoryId, page: pageParam ?? 1 },
      } as const) as Promise<INewsResponse>,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    //staleTime: 5 * 60 * 1000,
  });
  const onRefresh = () => {
    if (isFetchingNextPage) return;
    queryClient.fetchInfiniteQuery({
      queryKey: [QUERY_KEY.NEWS, categoryId],
      initialPageParam: 1,
    });
  };
  const renderItem = ({ item, index }: ListRenderItemInfo<INew>) => (
    <NewsJobs index={index} item={item} deferSearchInfo={deferSearchInfo} />
  );
  console.log('isLoading', isLoading);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ImageBackground source={require('@assets/images/background2.jpg')} resizeMode='cover' style={styles.wrapper}>
        <SafeAreaView style={{ flex: 1 }}>
          <AppHeader
            title='Tin tức'
            style={{
              marginBottom: 10,
            }}
          />
          <FlatList
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
            scrollEventThrottle={16}
            data={(data?.pages.flatMap((page) => page?.data) as unknown as INew[]) || []}
            ListHeaderComponent={
              <View>
                {data && (
                  <AppTextInput
                    width={'100%'}
                    value={searchInfo}
                    onChangeText={setSearchInfo}
                    containerStyle={{
                      backgroundColor: COLORS.white,
                      borderWidth: 0,
                    }}
                    outStyle={{ marginHorizontal: s(20) }}
                    placeholder='Tìm kiếm tin tức'
                    placeholderTextColor={COLORS.grey}
                    trailing={<AntDesign name='search1' size={s(25)} color={COLORS.grey} />}
                  />
                )}
                <ScrollView
                  horizontal
                  contentContainerStyle={{
                    gap: s(10),
                    paddingHorizontal: s(20),
                  }}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    marginVertical: vs(10),
                  }}>
                  {Categories?.map((category, index) => (
                    <AppButton
                      key={index}
                      label={category.categoryName}
                      labelStyle={[
                        FONT.content.M.semiBold,
                        {
                          marginHorizontal: 0,
                        },
                        categoryId === category._id ? { color: COLORS.white } : { color: COLORS.black },
                      ]}
                      buttonStyle={[
                        styles.categoryBtn,
                        categoryId === category._id && {
                          backgroundColor: COLORS.green,
                        },
                      ]}
                      onPress={() => onCategoryPress(category._id)}
                    />
                  ))}
                </ScrollView>
              </View>
            }
            ListEmptyComponent={() =>
              error ? (
                <Animated.View style={styles.placeHolderContainer} entering={FadeIn}>
                  <AppNoData />
                  <Text style={styles.placeHolderText}>Oops! Chưa có tin tức nào được cập nhật! Thử lại sau nhé!</Text>
                </Animated.View>
              ) : isLoading ? (
                <ActivityIndicator size={'large'} color={COLORS.green} />
              ) : null
            }
            renderItem={renderItem}
            onEndReached={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              fetchNextPage();
            }}
            onEndReachedThreshold={0.2}
            keyboardDismissMode='on-drag'
            renderToHardwareTextureAndroid
            maxToRenderPerBatch={10}
          />
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default News;
const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    flex: 1,
  },
  header: {
    marginBottom: vs(10),
  },
  categoryBtn: {
    paddingVertical: s(15),
    borderWidth: s(2),
    borderColor: COLORS.green,
    backgroundColor: COLORS.white,
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
