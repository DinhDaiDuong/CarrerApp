import AppImage from '@components/AppImage';
import { COLORS, FONT, s, vs } from '@utils/config';
import React from 'react';
import { ImageSourcePropType, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Source } from 'react-native-fast-image';
type TExamCard = {
  image: (ImageSourcePropType & (number | Source)) | undefined;
  name: string;
  namePosition?: 'left' | 'right';
  titleStyle?: StyleProp<TextStyle>;
};
const ExamCard = ({ image, name, namePosition = 'left', titleStyle }: TExamCard) => {
  const nameStyle = StyleSheet.flatten([
    styles.examTitle,
    namePosition === 'left' && { left: s(20) },
    namePosition === 'right' && { right: s(30) },
    titleStyle,
  ]) as TextStyle;
  return (
    <View style={{ justifyContent: 'center' }}>
      <AppImage source={image} style={styles.image} resizeMode='stretch' />
      <Text style={nameStyle}>{name}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: s(307),
    height: vs(136),
    borderRadius: s(10),
  },
  examTitle: {
    position: 'absolute',
    ...FONT.title.XXL.bold,
    fontSize: s(50),
    color: COLORS.white,
  },
});
export default ExamCard;
