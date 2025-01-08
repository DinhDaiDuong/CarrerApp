import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS, FONT, s, vs} from '@utils/config';
import AppImage from '@components/AppImage';

export type TNewsCategory = {
  id: string;
  title: string;
  image: any;
};
type TCategoryItem = {
  item: TNewsCategory;
};
const CategoryItem = ({item}: TCategoryItem) => {
  return (
    <TouchableOpacity style={styles.categoryItem}>
      <AppImage source={item.image} style={styles.image} />
      <Text style={FONT.title.M}>{item.title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;
const styles = StyleSheet.create({
  categoryItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    paddingVertical: vs(20),
  },
  image: {width: s(45), height: s(45)},
});
