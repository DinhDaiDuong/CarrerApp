import AppImage from '@components/AppImage';
import { IResult } from '@interfaces/DTO';
import { Title } from '@screens/Result/components';
import { COLORS, FONT, s, vs, width } from '@utils';
import { isContainsHTMLTags } from '@utils/helpers/string.helper';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

type DoExamResultProps = {
  result: IResult;
  totalScore: number;
};

const DoExamResult = ({ result, totalScore }: DoExamResultProps) => {
  if (!result) return <></>;
  return (
    <View style={styles.container}>
      {totalScore !== undefined && (
        <View style={styles.scoreContainer}>
          <Text style={FONT.content.M.medium}>Tổng điểm</Text>
          <View style={styles.circle}>
            <Text style={styles.score}>{totalScore}</Text>
          </View>
        </View>
      )}

      <View>
        {result?.content && (
          <React.Fragment>
            <Title title={'Kết luận'} wrapperStyle={styles.title} textStyle={FONT.content.L} />
            {isContainsHTMLTags(result?.content) ? (
              <RenderHTML
                source={{
                  html: result?.content as unknown as string,
                }}
                contentWidth={width}
                enableExperimentalMarginCollapsing={true}
                tagsStyles={{
                  article: { color: COLORS.black },
                  p: { ...FONT.content.M.semiBold },
                }}
              />
            ) : (
              <Text style={FONT.content.M.medium}>{result?.content}</Text>
            )}
            {result?.image && <AppImage source={{ uri: result?.image }} style={styles.image} resizeMode='contain' />}
          </React.Fragment>
        )}

        {result?.detail && (
          <React.Fragment>
            <Title title={'Kết luận chi tiết'} wrapperStyle={[styles.title, { marginTop: vs(16) }]} textStyle={FONT.content.L} />
            {isContainsHTMLTags(result?.content) ? (
              <RenderHTML
                source={{
                  html: result?.content as unknown as string,
                }}
                contentWidth={width}
                enableExperimentalMarginCollapsing={true}
                tagsStyles={{
                  article: { color: COLORS.black },
                  p: { ...FONT.content.M.semiBold },
                }}
              />
            ) : (
              <Text style={FONT.content.M.medium}>{result?.detail}</Text>
            )}
          </React.Fragment>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: vs(8),
    flex: 1,
    gap: vs(16),
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    ...FONT.title.XXL.bold,
    color: COLORS.green,
  },
  circle: {
    width: s(84),
    height: s(84),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: s(100),
    backgroundColor: COLORS.white,
    marginVertical: vs(8),
    borderWidth: s(2),
    borderColor: COLORS.green,
  },
  title: {
    marginHorizontal: -s(27),
  },
  image: {
    width: s(200),
    height: s(200),
    alignSelf: 'center',
    borderRadius: s(24),
  },
});
export default React.memo(DoExamResult);
