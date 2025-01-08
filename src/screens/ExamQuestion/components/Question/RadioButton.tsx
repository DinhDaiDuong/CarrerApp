import { COLORS, s } from '@utils/config';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
type Props = {
  selected?: boolean;
  onPress?: () => void;
};
const RadioButton = ({ selected = true, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.outerCircle} onPress={onPress} disabled={!onPress}>
      {selected && <View style={styles.innerCircle}></View>}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  outerCircle: {
    width: s(25),
    height: s(25),
    borderRadius: s(25),
    backgroundColor: COLORS.white,
    borderWidth: s(1),
    borderColor: COLORS.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: s(16),
    height: s(16),
    borderRadius: s(25),
    backgroundColor: COLORS.blue,
  },
});
export default memo(RadioButton);
