import {COLORS, FONT, s, vs, width} from '@utils/config';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(27),
    gap: vs(10),
  },
  question: {
    ...FONT.content.M.semiBold,
  },
  questionImage: {
    width: s(200),
    height: s(200),
    alignSelf: 'center',
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    padding: s(10),
    gap: s(5),
    width: width - s(27) * 2,
  },
  optionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  option: {
    ...FONT.content.M.regular,
    width: '90%',
  },
  optionImage: {
    width: s(100),
    height: s(100),
    alignSelf: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: vs(10),
    gap: s(10),
    justifyContent: 'center',
  },
  error: {
    ...FONT.content.M.semiBold,
    color: COLORS.red,
  },
});
