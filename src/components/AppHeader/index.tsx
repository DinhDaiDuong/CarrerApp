import {View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import {COLORS, FONT, s, vs} from '@utils/config';
import {navigationRef} from '@navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
type TAppHeader = {
  title?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};
const AppHeader = ({title, style, onPress}: TAppHeader) => {
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            onPress();
          } else {
            navigationRef.goBack();
          }
        }}>
        <AntDesign name="arrowleft" size={s(25)} color={COLORS.black} />
      </TouchableOpacity>
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(5),
    paddingHorizontal: s(27),
  },
  title: {
    ...FONT.title.XL,
    marginLeft: s(7),
  },
});
export default AppHeader;
