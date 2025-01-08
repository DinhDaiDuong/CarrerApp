import {ListRenderItemInfo} from 'react-native';
import React from 'react';
import {SharedValue} from 'react-native-reanimated';
import {width} from '@utils';
import {FlatList} from 'react-native-gesture-handler';
type TAppCardCarousel<TData> = {
  data: TData[];
  renderItem?: (
    info: ListRenderItemInfo<TData>,
  ) => React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > | null;
  animatedScroll: SharedValue<number>;
  snapToInterval?: number;
};
const AppCardCarousel = <TData,>({
  data,
  renderItem,
  animatedScroll,
  snapToInterval = width * 0.8,
}: TAppCardCarousel<TData>) => {
  return (
    <FlatList
      data={data}
      horizontal
      renderItem={renderItem}
      pagingEnabled
      snapToInterval={snapToInterval}
      showsHorizontalScrollIndicator={false}
      onScroll={e => {
        animatedScroll.value = e.nativeEvent.contentOffset.x;
      }}
    />
  );
};

export default AppCardCarousel;
