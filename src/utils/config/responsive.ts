import {Dimensions} from 'react-native';
export const {width, height, fontScale} = Dimensions.get('screen');
const FIGMA_WIDTH = 360;
const FIGMA_HEIGHT = 640;

export const WIDTH = width > height ? height : width;
export const HEIGHT = width > height ? width : height;

const scale = (size: number) => {
  return (WIDTH / FIGMA_WIDTH) * size;
};
const vertialScale = (size: number) => {
  return (HEIGHT / FIGMA_HEIGHT) * size;
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const moderateVerticalScale = (size: number, factor = 0.5) => {
  return size + (vertialScale(size) - size) * factor;
};
export {
  scale as s,
  vertialScale as vs,
  moderateScale as ms,
  moderateVerticalScale as mvs,
};
/*
  s() will scale with screen width changes, use it for horizontal spacing and icons (for both height and width).

  vs() will scale with screen height changes, use it for vertical spacing.

  mvs() will scale with screen height changes as well, but less than vs(), use it for font sizes and things you don't want to be scaled too much on very big or very small devices.
*/
