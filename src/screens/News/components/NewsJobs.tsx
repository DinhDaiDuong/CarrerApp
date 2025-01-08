import { StyleSheet } from 'react-native';
import React, { lazy, memo, Suspense } from 'react';
import { s, vs, width } from '@utils/config';
import dayjs from 'dayjs';
import { navigationRef } from '@navigation';
import AppSkeleton from '@components/AppSkeleton';
import { INew } from '@interfaces/DTO';
const AppCard = lazy(() => import('@components/AppCard'));
type TNewsJobsProps = {
  deferSearchInfo: string;
  id?: string;
  //news: INew[];
  item: INew;
  index: number;
};
const NewsJobs = ({ deferSearchInfo, item, index }: TNewsJobsProps) => {
  const searchPattern = new RegExp(deferSearchInfo.toLowerCase(), 'i');
  if (searchPattern.test(item?.title?.toLowerCase())) {
    return (
      <Suspense fallback={<AppSkeleton width={'100%'} height={200} />}>
        <AppCard
          index={index}
          key={index}
          imageUrl={item?.image?.shortImage}
          subTitle={dayjs(item?.createdAt).format('DD/MM/YYYY')}
          title={item?.title}
          type='large'
          onPress={() => navigationRef.navigate('NewsDetail1', { content: item?.content })}
          containerStyle={styles.container}
        />
      </Suspense>
    );
  }
  return <></>;
};
const styles = StyleSheet.create({
  container: {
    marginVertical: vs(5),
    alignSelf: 'center',
    width: width - s(40),
  },
});
export default memo(NewsJobs);
