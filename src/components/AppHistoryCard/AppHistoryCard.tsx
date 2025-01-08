import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {COLORS, FONT, s, vs} from '@utils';
import Animated, {FadeIn} from 'react-native-reanimated';
import dayjs from 'dayjs';

const HOLLAND_COLOR: Record<string, string> = {
  R: COLORS.red,
  I: COLORS.orange,
  A: COLORS.yellow,
  S: COLORS.green,
  E: COLORS.blue,
  C: COLORS.purple,
};
type TGeneral = {
  url: string;
  score: string;
  name: string;
};
const GeneralItem = ({url, score, name}: TGeneral) => {
  return (
    <View style={styles.generalContainer}>
      <Image
        source={url as ImageSourcePropType}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.generalTitle}>
        <Text style={FONT.content.XS.medium}>{name}</Text>
        <Text style={FONT.content.XXS.medium}>{score}</Text>
      </View>
    </View>
  );
};
type TCard = {
  isExpand?: boolean;
  index?: number;
  result: any;
};
const AppHistoryCard = ({isExpand, index = 0, result}: TCard) => {
  const averageScore = useMemo(() => {
    const scores = result?.schoolScore?.scores;
    if (scores)
      return (
        (+scores['Biology']?.value +
          +scores['Chemistry']?.value +
          +scores['CivicEducation']?.value +
          +scores['English']?.value +
          +scores['Geography']?.value +
          +scores['History']?.value +
          +scores['Informatics']?.value +
          +scores['Literature']?.value +
          +scores['Math']?.value +
          +scores['Physics']?.value) /
        10
      ).toFixed(1);
  }, [result]);
  return (
    <Animated.View
      entering={FadeIn.delay(index * 150)}
      style={[styles.wrapper]}>
      <Text style={styles.date}>
        {dayjs(result?.date).format('DD/MM/YYYY')}
      </Text>
      <View style={styles.row}>
        {!!result?.userAnswers['IQ'] && (
          <GeneralItem
            url={require('@assets/images/IQ.png')}
            name="IQ"
            score={result.userAnswers['IQ']}
          />
        )}

        {!!result?.userAnswers['EQ'] && (
          <GeneralItem
            url={require('@assets/images/EQ.png')}
            name="EQ"
            score={result.userAnswers['EQ']}
          />
        )}
        {!!averageScore && (
          <GeneralItem
            url={require('@assets/images/score.png')}
            name="Điểm TB"
            score={averageScore.toString() ?? ''}
          />
        )}
      </View>
      <View style={styles.row}>
        {Object.entries(result?.userAnswers ?? {}).map(([key, value]) => {
          if (key !== 'IQ' && key !== 'EQ')
            return (
              <View key={key}>
                <View
                  style={[
                    styles.hollandContainer,
                    {
                      backgroundColor: HOLLAND_COLOR[key] as string,
                    },
                  ]}>
                  <Text
                    style={[FONT.content.XXS.semiBold, {color: COLORS.white}]}>
                    {key}
                  </Text>
                </View>
                <Text style={FONT.content.XXS.medium}>
                  {(value as string) ?? ''}
                </Text>
              </View>
            );
        })}
      </View>
      {isExpand && (
        <View style={{width: '100%'}}>
          <Text style={FONT.content.M.regular}>
            {result?.schoolScore?.result?.[0]?.description}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderRadius: s(10),
    paddingHorizontal: s(10),
    width: '100%',
    paddingVertical: vs(5),
    gap: vs(10),
  },
  date: {
    ...FONT.content.XS.medium,
    color: COLORS.grey,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: s(30),
    height: s(30),
  },
  generalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  generalTitle: {
    marginLeft: s(3),
    alignItems: 'center',
  },
  hollandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(24),
    height: s(24),
    borderRadius: s(5),
  },
});
export default AppHistoryCard;
