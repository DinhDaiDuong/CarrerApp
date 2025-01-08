import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {lazy, Suspense, useState} from 'react';
import {navigationRef} from '@navigation';
import AppSkeleton from '@components/AppSkeleton';
import {KEY_STORE, storage} from '@store';
import {useFocusEffect} from '@react-navigation/native';
import {TResultInStore, FONT, s, vs} from '@utils';
const AppHistoryCard = lazy(
  () => import('@components/AppHistoryCard/AppHistoryCard'),
);
const HistoryCard = () => {
  const [results, setResults] = useState<TResultInStore[] | []>([]);
  useFocusEffect(
    React.useCallback(() => {
      const storageResult = storage.getString(KEY_STORE.LIST_RESULT);
      const resultsFromStore = JSON.parse(storageResult ?? 'null');
      if (resultsFromStore) {
        setResults(resultsFromStore as unknown as TResultInStore[]); // Adjust the cast as necessary
      }

      return () => {};
    }, []),
  );
  if (results?.length === 0) return null;
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={FONT.content.M.bold}>Kết quả kiểm tra</Text>
        <TouchableOpacity onPress={() => navigationRef.navigate('ListResult')}>
          <Text style={FONT.content.M.medium}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
      {results?.map((result, index) => (
        <Suspense
          fallback={<AppSkeleton width={'100%'} height={200} radius={10} />}
          key={index}>
          <AppHistoryCard result={result} />
        </Suspense>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(27),
    gap: vs(10),
    marginBottom: vs(10),
  },
  title: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
export default HistoryCard;
