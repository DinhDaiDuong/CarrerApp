import {StyleSheet, FlatList} from 'react-native';
import React, {useMemo, useImperativeHandle, forwardRef, useRef} from 'react';
import {s, width} from '@utils/config';
import Dot from './Dot';
import {SharedValue} from 'react-native-reanimated';
type TIndicator = {
  length?: number;
  animatedValue: SharedValue<number>;
};
export type TIndicatorRef = {
  scrollToIndicator: (index: number) => void;
};
const Indicator = forwardRef<TIndicatorRef, TIndicator>(
  ({length = 5, animatedValue}, ref) => {
    const data = useMemo(() => Array.from({length}), [length]);
    const dotRef = useRef<FlatList>(null);
    const renderDot = ({index}: {index: number}) => {
      return (
        <Dot
          index={index}
          animatedValue={animatedValue}
          length={length}
          key={index}
        />
      );
    };
    useImperativeHandle(ref, () => {
      return {
        scrollToIndicator(index) {
          dotRef?.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        },
      };
    });
    return (
      <FlatList
        data={data}
        renderItem={renderDot}
        horizontal
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        ref={dotRef}
        pagingEnabled
      />
    );
  },
);
const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: s(15),
  },
});
export default Indicator;
