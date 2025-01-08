import {PixelRatio} from 'react-native';
import {COLORS} from './color';
import {mvs} from './responsive';

const fontScaleRatio = (value: number) => value / PixelRatio.getFontScale();
export const FONT_FAMILY = {
  bold: 'Raleway-Bold',
  semibold: 'Raleway-SemiBold',
  medium: 'Raleway-Medium',
  regular: 'Raleway-Regular',
  extraBold: 'Raleway-ExtraBold',
};

type TFontStyle = {
  XXL: number;
  XL: number;
  L: number;
  M: number;
  S: number;
  XS: number;
  XXS: number;
  XXXS: number;
  s1: number;
  h1: number;
};

const SIZE: TFontStyle = {
  XXL: fontScaleRatio(mvs(24)),
  XL: fontScaleRatio(mvs(20)),
  L: fontScaleRatio(mvs(16)),
  M: fontScaleRatio(mvs(14)),
  S: fontScaleRatio(mvs(13)),
  XS: fontScaleRatio(mvs(12)),
  XXS: fontScaleRatio(mvs(10)),
  XXXS: fontScaleRatio(mvs(8)),
  s1: fontScaleRatio(mvs(6)),
  h1: fontScaleRatio(mvs(64)),
};

const fontPropertiesGenerator = (fontFamily: string, fontSize: number) => {
  return {
    fontFamily: fontFamily,
    fontSize: fontSize,
    color: COLORS.black,
  };
};

export const FONT = {
  content: {
    L: fontPropertiesGenerator(FONT_FAMILY.semibold, SIZE.L),
    M: {
      regular: fontPropertiesGenerator(FONT_FAMILY.regular, SIZE.M),
      medium: fontPropertiesGenerator(FONT_FAMILY.medium, SIZE.M),
      bold: fontPropertiesGenerator(FONT_FAMILY.bold, SIZE.M),
      semiBold: fontPropertiesGenerator(FONT_FAMILY.semibold, SIZE.M),
    },
    S: fontPropertiesGenerator(FONT_FAMILY.regular, SIZE.S),
    XS: {
      regular: fontPropertiesGenerator(FONT_FAMILY.regular, SIZE.XS),
      medium: fontPropertiesGenerator(FONT_FAMILY.medium, SIZE.XS),
    },
    XXS: {
      semiBold: fontPropertiesGenerator(FONT_FAMILY.semibold, SIZE.XXS),
      medium: fontPropertiesGenerator(FONT_FAMILY.medium, SIZE.XXS),
    },
    XXXS: {
      regular: fontPropertiesGenerator(FONT_FAMILY.regular, SIZE.XXXS),
      bold: fontPropertiesGenerator(FONT_FAMILY.regular, SIZE.XXXS),
      extraBold: fontPropertiesGenerator(FONT_FAMILY.extraBold, SIZE.XXXS),
    },
    s1: fontPropertiesGenerator(FONT_FAMILY.regular, SIZE.s1),
  },
  button: {
    M: {
      regular: fontPropertiesGenerator(FONT_FAMILY.bold, SIZE.M),
      semiBold: fontPropertiesGenerator(FONT_FAMILY.semibold, SIZE.M),
    },
    XL: fontPropertiesGenerator(FONT_FAMILY.semibold, SIZE.XL),
  },
  title: {
    M: fontPropertiesGenerator(FONT_FAMILY.bold, SIZE.M),
    XXL: {
      bold: fontPropertiesGenerator(FONT_FAMILY.bold, SIZE.XXL),
      semiBold: fontPropertiesGenerator(FONT_FAMILY.semibold, SIZE.XXL),
    },
    XL: fontPropertiesGenerator(FONT_FAMILY.semibold, SIZE.XL),
    h1: fontPropertiesGenerator(FONT_FAMILY.bold, SIZE.h1),
  },
  link: {
    ...fontPropertiesGenerator(FONT_FAMILY.medium, SIZE.XS),
    textDecorationLine: 'underline' as 'none' | 'underline' | 'line-through' | 'underline line-through' | undefined,
    color: COLORS.darkBlue,
  },
};
