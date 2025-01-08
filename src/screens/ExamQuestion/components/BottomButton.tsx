import { AppProgressBar } from '@components';
import AppRoundedButton from '@components/AppRoundedButton';
import { COLORS, s, vs } from '@utils/config';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
type TBottomButton = {
  onNext?: () => void;
  onPrev?: () => void;
  maxValue?: number;
  currentValue?: number;
};
const BottomButton = ({ onNext, onPrev, maxValue = 1, currentValue = 0 }: TBottomButton) => {
  return (
    <View style={styles.container}>
      <AppRoundedButton type='fill' onPress={onPrev}>
        <Entypo name='chevron-left' size={s(20)} color={COLORS.white} />
      </AppRoundedButton>
      <AppProgressBar maxValue={maxValue} progress={currentValue} />
      <AppRoundedButton type='fill' onPress={onNext}>
        <Entypo name='chevron-right' size={s(20)} color={COLORS.white} />
      </AppRoundedButton>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingVertical: vs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    zIndex: 9999,
  },
});
export default BottomButton;
