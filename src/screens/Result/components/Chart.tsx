import {View} from 'react-native';
import React, {useMemo} from 'react';
import {BarChart, barDataItem} from 'react-native-gifted-charts';
import {COLORS, FONT, width} from '@utils/config';
import {TExam} from '@interfaces/DTO';
const COLOR_CHART: Partial<Record<TExam, string>> = {
  R: COLORS.red,
  I: COLORS.orange,
  A: COLORS.yellow,
  S: COLORS.green,
  E: COLORS.blue,
  C: COLORS.purple,
};
type TChart = {
  answes: Record<TExam, string>;
};
const Chart = ({answes}: TChart) => {
  const scores = useMemo(() => {
    const tmp = Object.entries(answes)?.map(([key, item]) => {
      if (key !== 'EQ' && key !== 'IQ') {
        return {
          value: parseInt(item?.split('/')[0]),
          label: key,
          frontColor: COLOR_CHART[key as TExam],
        };
      }
      return null;
    });
    return tmp?.filter(item => item !== null) ?? [];
  }, [answes]);
  return (
    <View>
      <BarChart
        width={width - 54}
        data={scores as barDataItem[]}
        frontColor="#177AD5"
        horizontalRulesStyle={{
          strokeWidth: 2,
          strokeDasharray: [0, 0],
        }}
        yAxisTextStyle={FONT.content.S}
        xAxisLabelTextStyle={FONT.content.XS.medium}
      />
    </View>
  );
};

export default Chart;
