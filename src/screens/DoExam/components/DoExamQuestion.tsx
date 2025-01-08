import { AppTextInput } from '@components';
import AppImage from '@components/AppImage';
import { IQuestion } from '@interfaces/DTO';
import { IMyAnswers } from '@interfaces/DTO/DoExam/do-exam';
import Checkbox from '@screens/ExamQuestion/components/Question/Checkbox';
import RadioButton from '@screens/ExamQuestion/components/Question/RadioButton';
import { COLORS, FONT, s, vs, width } from '@utils';
import { EQuestionType } from '@utils/enum/exam.enum';
import { isContainsHTMLTags } from '@utils/helpers/string.helper';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
type DoExamQuestionProps = {
  question?: IQuestion;
  myAnswers: IMyAnswers[];
  setMyAnswers: (myAnswers: IMyAnswers[]) => void;
  error?: boolean;
};
const DoExamQuestion = ({ question, myAnswers, setMyAnswers, error = true }: DoExamQuestionProps) => {
  const myAnswer = useMemo(
    () => myAnswers?.find((item) => item?.questionId === question?._id)?.answers,
    [myAnswers, question?._id],
  );

  const shortAnswer = useMemo(
    () => myAnswers?.find((item) => item?.questionId === question?._id)?.shortAnswer,
    [myAnswers, question?._id],
  );

  // METHODS
  const onSelect = useCallback(
    (id: string, value?: string) => {
      if (!question) return;

      const oldAnswers = myAnswers.filter((item) => item.questionId !== question._id);
      const currentAnswers = myAnswers.find((item) => item.questionId === question._id)?.answers || [];

      if (question.questionType === EQuestionType.MULTIPLE_CHOICE) {
        setMyAnswers([...oldAnswers, { questionId: question._id, answers: [id] }]);
      } else if (question.questionType === EQuestionType.TICK_BOX) {
        const updatedAnswers = currentAnswers.includes(id)
          ? currentAnswers.filter((answer) => answer !== id)
          : [...currentAnswers, id];

        setMyAnswers([...oldAnswers, { questionId: question._id, answers: updatedAnswers }]);
      } else if (question?.questionType === EQuestionType.SHORT_ANSWER) {
        setMyAnswers([...oldAnswers, { questionId: question._id, shortAnswer: value }]);
      }
    },
    [myAnswers, question, setMyAnswers],
  );

  return (
    <View style={styles.container}>
      {isContainsHTMLTags(question?.questionTitle) ? (
        <RenderHTML
          source={{
            html: question?.questionTitle as unknown as string,
          }}
          contentWidth={200}
          enableExperimentalMarginCollapsing={true}
          // tagsStyles={{
          //   article: { color: COLORS.black },
          //   //h3: { alignSelf: 'center' },
          //   p: { ...FONT.content.M.semiBold },
          // }}
        />
      ) : (
        <Text style={styles.question}>{question?.questionTitle}</Text>
      )}

      {question?.image && <AppImage source={{ uri: question?.image }} style={styles.questionImage} resizeMode='contain' />}

      {error && (
        <Text style={{ color: COLORS.red, marginTop: vs(8) }}>
          *<Text style={styles.error}> Vui lòng điền đáp án!</Text>
        </Text>
      )}

      {question?.questionType !== EQuestionType.SHORT_ANSWER ? (
        <View style={styles.optionContainer}>
          {question?.options?.map((option, index) => {
            const { image, content } = option;
            return (
              <TouchableOpacity
                style={[styles.optionCard, { width: image ? width * 0.4 : width - s(27) * 2 }]}
                key={index}
                onPress={() => onSelect(option?._id)}>
                {option?.image && <AppImage source={{ uri: image }} style={styles.optionImage} resizeMode='contain' />}
                <View style={styles.optionTitle}>
                  {question?.questionType === EQuestionType.MULTIPLE_CHOICE ? (
                    <RadioButton selected={myAnswer?.includes(option?._id)} />
                  ) : (
                    <Checkbox isCheck={myAnswer?.includes(option?._id)} onPress={() => onSelect(option?._id)} />
                  )}
                  <Text style={styles.option}>{content}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <AppTextInput
          containerStyle={styles.inputContainerStyle}
          placeholder='Nhập câu trả lời'
          value={shortAnswer}
          onChangeText={(val) => onSelect('', val)}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  question: {
    ...FONT.content.M.semiBold,
  },
  questionImage: {
    width: s(200),
    height: s(200),
    alignSelf: 'center',
    borderRadius: s(24),
    backgroundColor: COLORS.white,
    padding: vs(10),
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: vs(10),
    gap: s(10),
    justifyContent: 'center',
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
    width: '70%',
  },
  optionImage: {
    width: s(100),
    height: s(100),
    alignSelf: 'center',
  },
  inputContainerStyle: {
    marginVertical: vs(16),
    backgroundColor: COLORS.white,
  },
  error: {
    ...FONT.content.M.semiBold,
    color: COLORS.red,
  },
});
export default React.memo(DoExamQuestion);
