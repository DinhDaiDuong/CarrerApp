import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import Title from './Title';
import {COLORS, FONT, s, vs, width} from '@utils/config';
import {IResult, TExam} from '@interfaces/DTO';
import {
  Circle,
  Defs,
  Image,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Svg,
  Text as TextSvg,
} from 'react-native-svg';
import Animated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
type Props = {
  answers: Record<TExam, string>;
  results: {
    type: TExam;
    resultContents: IResult[];
  }[];
};
const RectAnimated = Animated.createAnimatedComponent(Rect);
const PathAnimated = Animated.createAnimatedComponent(Path);
const CircleAnimated = Animated.createAnimatedComponent(Circle);
const IQ_EQ_Result = ({answers, results}: Props) => {
  const iqTransitionX = useSharedValue(0);
  const eqTransitionX = useSharedValue(0);
  const resultIQ = useMemo(() => {
    let newBenmark: any[] = [];
    results
      .find(r => r.type === 'IQ')
      ?.resultContents.map(result => {
        if (!!result?.score) {
          newBenmark.push(result.score);
        }
      });
    return newBenmark.flat();
  }, [results]);
  const IQ_Result = useMemo(() => {
    const resultContents = results.find(r => r.type === 'IQ')?.resultContents;
    const score = answers?.IQ?.split('/')[0];
    const evaluation = resultContents?.find(
      item =>
        item?.score && +score >= item!.score[0]! && +score <= item?.score[1]!,
    );
    return {
      score: +score,
      content: evaluation?.content,
    };
  }, [results, answers]);

  const EQ_Result = useMemo(() => {
    const resultContents = results.find(r => r.type === 'EQ')?.resultContents;

    const score = answers?.EQ?.split('/')[0];
    const evaluation = resultContents?.find(
      item =>
        item?.score && +score >= item!.score[0]! && +score <= item?.score[1]!,
    );
    return {
      score: +score,
      content: evaluation?.content,
    };
  }, [results, answers]);
  useEffect(() => {
    if (resultIQ) {
      setTimeout(() => {
        iqTransitionX.value = withTiming(1);
        eqTransitionX.value = withSpring(EQ_Result.score);
      }, 2000);
    }
  }, [resultIQ]);
  const animatedRectProps = useAnimatedProps(() => {
    return {
      x:
        width *
          0.9 *
          interpolate(iqTransitionX.value, [0, 1], [0, IQ_Result.score / 120]) -
        1.25 +
        width * 0.05,
    };
  });
  const animatedPathProps = useAnimatedProps(() => {
    return {
      d: `m ${
        width *
          0.9 *
          interpolate(iqTransitionX.value, [0, 1], [0, IQ_Result.score / 120]) -
        2.5 +
        width * 0.05
      } 7 h 8 l -4 8 z`,
    };
  });
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset:
        Math.PI * 2 * interpolate(eqTransitionX.value, [0, 200], [135, 45]),
    };
  });
  return (
    <View style={styles.container}>
      <Title title="Kiểm tra trí tuệ" />

      <View
        style={{
          width: width,
        }}>
        <Svg width={'100%'} height={100}>
          <Defs>
            <LinearGradient id="grad" x1={0} x2={1} y1={0.5} y2={0.5}>
              <Stop offset="0" stopColor="#2d9fe0" stopOpacity="1" />
              <Stop offset="0.25" stopColor="#02dcb5" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#FFFB7D" stopOpacity="1" />
              <Stop offset="0.75" stopColor="#fd9300" stopOpacity="1" />
              <Stop offset="1" stopColor="red" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            width={'90%'}
            height={30}
            y={20}
            x={width * 0.05}
            fill={'url(#grad)'}
            rx={10}
          />

          <RectAnimated
            animatedProps={animatedRectProps}
            width={5}
            // x={width * 0.9 * (IQ_Result.score / 120) - 1.25 + width * 0.05}
            height={30}
            y={20}
            fill={'white'}
          />
          <PathAnimated
            animatedProps={animatedPathProps}
            fill={'white'}
            stroke={'white'}
            strokeWidth={2}
          />
          {Array.from(new Set(resultIQ)).map((result, index) => (
            <Path
              key={index}
              d={`m ${
                (result / 120) * width * 0.9 - 4.5 + width * 0.05
              } 63 h 8 l -4 -8 z`}
              fill={'white'}
              stroke={'white'}
              strokeWidth={2}
            />
          ))}
          {Array.from(new Set(resultIQ)).map((result, index) => (
            <TextSvg
              key={index}
              fontSize={14}
              fontWeight={500}
              x={(result / 120) * width * 0.9 - 1 + width * 0.05}
              y={80}
              textAnchor="middle">
              {result}
            </TextSvg>
          ))}
        </Svg>
      </View>
      <Text style={styles.score}>
        {IQ_Result.score}: {IQ_Result.content}
      </Text>
      <Title title="Kiểm tra cảm xúc" />
      <View>
        <Svg width={width} height={220}>
          <CircleAnimated
            animatedProps={animatedCircleProps}
            cx={width / 2}
            cy={140}
            r={130}
            strokeWidth={10}
            stroke={COLORS.green}
            fill={'transparent'}
            strokeDasharray={Math.PI * 2 * 135}
            strokeLinejoin="round"
            strokeLinecap="round"
            originX={width / 2}
            originY={140}
            rotation={145}
          />

          <Circle
            cx={width / 2}
            cy={140}
            r={90}
            strokeWidth={50}
            stroke={'#27c86b'}
            fill={'transparent'}
            strokeDasharray={Math.PI * 2 * 90}
            strokeDashoffset={Math.PI * -155}
            originX={width / 2}
            originY={140}
            rotation={35}
          />
          <Circle
            cx={width / 2}
            cy={140}
            r={90}
            strokeWidth={50}
            stroke={'green'}
            fill={'transparent'}
            strokeDasharray={Math.PI * 2 * 90}
            strokeDashoffset={Math.PI * -155}
            originX={width / 2}
            originY={140}
            rotation={-15}
          />
          <Circle
            cx={width / 2}
            cy={140}
            r={90}
            strokeWidth={50}
            stroke={'yellow'}
            fill={'transparent'}
            strokeDasharray={Math.PI * 2 * 90}
            strokeDashoffset={Math.PI * -155}
            originX={width / 2}
            originY={140}
            rotation={-65}
          />
          <Circle
            cx={width / 2}
            cy={140}
            r={90}
            strokeWidth={50}
            stroke={'orange'}
            fill={'transparent'}
            strokeDasharray={Math.PI * 2 * 90}
            strokeDashoffset={Math.PI * -155}
            originX={width / 2}
            originY={140}
            rotation={-115}
          />
          <Circle
            cx={width / 2}
            cy={140}
            r={90}
            strokeWidth={50}
            stroke={'red'}
            fill={'transparent'}
            strokeDasharray={Math.PI * 2 * 90}
            strokeDashoffset={Math.PI * -155}
            originX={width / 2}
            originY={140}
            rotation={-165}
          />
          <Image
            href={require('@assets/images/angry.png')}
            width={s(30)}
            height={s(30)}
            x={width / 4.2}
            y={140}
          />
          <Image
            href={require('@assets/images/sad.png')}
            width={s(30)}
            height={s(30)}
            x={width / 3.5}
            y={65}
          />
          <Image
            href={require('@assets/images/neutral.png')}
            width={s(30)}
            height={s(30)}
            x={width / 2.15}
            y={35}
          />
          <Image
            href={require('@assets/images/smile.png')}
            width={s(30)}
            height={s(30)}
            x={width / 1.55}
            y={65}
          />
          <Image
            href={require('@assets/images/smile.png')}
            width={s(30)}
            height={s(30)}
            x={width / 1.45}
            y={140}
          />
        </Svg>
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text style={FONT.content.M.medium}>Số điểm</Text>
          <Text style={[styles.score]}>{answers?.EQ}</Text>
        </View>
      </View>

      <Text style={styles.content}>{EQ_Result.content}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: vs(10),
  },
  image: {
    width: width * 0.8,
    height: 200,
  },
  score: {
    ...FONT.content.L,
  },
  content: {
    ...FONT.content.M.medium,
    padding: s(27),
  },
});
export default IQ_EQ_Result;
