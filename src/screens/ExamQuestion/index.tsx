import { AppHeader, AppModal } from '@components';
import { IExamResponse, TExam } from '@interfaces/DTO';
import { navigationRef } from '@navigation';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { KEY_STORE, storage } from '@store';
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { COLORS, TAnswer, TSubject, vs } from '@utils';
import { QUERY_KEY } from '@utils/constants';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import { BottomButton, Question, SchoolScore } from './components';

type TExamInfo = {
  headerTitle: string;
  examType: TExam;
};

const ExamQuestion = () => {
  const [answers, setAnswers] = useState<TAnswer>(
    new Map([
      ['R', []],
      ['I', []],
      ['A', []],
      ['S', []],
      ['E', []],
      ['C', []],
      ['IQ', []],
      ['EQ', []],
    ]),
  );
  const { data, isLoading } = useQuery<unknown, DefaultError, IExamResponse>({
    queryKey: [QUERY_KEY.EXAMS],
    queryFn: () => api(ENDPOINTS_URL.EXAM.GET_EXAM, 'GET', {}),
  });

  const postSchoolScore = useMutation({
    mutationKey: [QUERY_KEY.CACULATE_SCHOOL_SCORE],
    mutationFn: (variables: Record<string, TSubject>) => {
      return api(ENDPOINTS_URL.SCHOOL_SUBJECTS.CACULATE_SCHOOL_SCORE, 'POST', {
        data: {
          scores: variables,
        },
      });
    },
    onSuccess: (data: any, variables) => {
      const userAnswers = calculateUserAnswer();
      const storedUserAnswers = {
        date: new Date().getTime(),
        userAnswers,
        schoolScore: {
          scores: variables,
          result: data.data,
        },
      };
      const currentListResult = storage.getString(KEY_STORE.LIST_RESULT);
      if (currentListResult)
        storage.set(KEY_STORE.LIST_RESULT, JSON.stringify([storedUserAnswers, ...JSON.parse(currentListResult)]));
      else {
        storage.set(KEY_STORE.LIST_RESULT, JSON.stringify([storedUserAnswers]));
      }
      setQuestionNumber(totalExams + 1);
      navigationRef.navigate('Result', {
        userAnswers,
        schoolScoreResults: data.data,
      });
      setAnswers(
        new Map([
          ['R', []],
          ['I', []],
          ['A', []],
          ['S', []],
          ['E', []],
          ['C', []],
          ['IQ', []],
          ['EQ', []],
        ]),
      );
    },
  });

  const [questionNumber, setQuestionNumber] = useState(0);
  const [openModalNext, setOpenModalNext] = useState(false);

  const [selections, setSelections] = useState<number[]>([]);
  const [errorNotAnswer, setErrorNotAnswer] = useState(false);
  const [subjects, setSubjects] = useState<Record<string, TSubject>>({});
  const isContinue = useRef(false);
  const IQ = useMemo(() => data?.data?.find((exam) => exam.type === 'IQ')?.questions || [], [data?.data]);
  const EQ = useMemo(() => data?.data?.find((exam) => exam.type === 'EQ')?.questions || [], [data?.data]);
  const IQ_EQ_List = useMemo(() => [...IQ, ...EQ], [data?.data]);
  const HOLLAND = useMemo(() => data?.data?.filter((exam) => exam.type !== 'IQ' && exam.type !== 'EQ') || [], [data?.data]);
  const totalExams = useMemo(() => HOLLAND?.length + IQ_EQ_List?.length || 1, [data?.data]);
  const questionIndex = useMemo(() => questionNumber - HOLLAND?.length, [questionNumber, HOLLAND?.length]);

  const onUpdateAnswer = () => {
    const currentAnswer = answers;
    if (examInfo.examType === 'EQ' || examInfo.examType === 'IQ') {
      const tmp = currentAnswer.get(examInfo.examType)!;
      const index = examInfo.examType === 'IQ' ? questionIndex : questionIndex - IQ?.length;
      tmp[index] = selections[0];
      currentAnswer.set(examInfo.examType, tmp);
      setAnswers(currentAnswer);
      return;
    }
    currentAnswer.set(examInfo.examType, selections);
    setAnswers(currentAnswer);
  };
  const caculateSchoolScore = async () => {
    const newSubjects: Record<string, TSubject> = {};
    for (let index = 0; index < Object.keys(subjects).length; index++) {
      const element = Object.keys(subjects)[index];
      newSubjects[element] = {
        ...subjects[element],
        value: subjects[element].value === '' ? 0 : +subjects[element].value,
      };
    }
    postSchoolScore.mutate(newSubjects);
  };
  const onNext = useCallback(() => {
    if (questionNumber === totalExams) {
      caculateSchoolScore();
    }

    if (selections?.length === 0 || selections[0] === -1) {
      setErrorNotAnswer(true);
      return;
    }
    if (errorNotAnswer) {
      setErrorNotAnswer(false);
    }
    if (questionNumber < totalExams) {
      setQuestionNumber(questionNumber + 1);
      onUpdateAnswer();
    }
  }, [data?.data, questionNumber, totalExams, selections, questionIndex, subjects]);

  const onPrev = useCallback(() => {
    if (questionNumber > 0) {
      setQuestionNumber(questionNumber - 1);
      onUpdateAnswer();
    }
    setErrorNotAnswer(false);
  }, [data?.data, questionNumber, selections, questionIndex]);
  const examInfo: TExamInfo = useMemo(() => {
    if (questionNumber < HOLLAND?.length || questionNumber === 0) {
      return {
        headerTitle: 'Holland',
        examType: HOLLAND[questionNumber]?.type || 'R',
      };
    }
    if (questionNumber < HOLLAND?.length + IQ?.length) {
      return { headerTitle: 'Kiểm tra trí tuệ', examType: 'IQ' };
    }
    if (questionNumber < totalExams) {
      return { headerTitle: 'Kiểm tra cảm xúc', examType: 'EQ' };
    }
    return { headerTitle: 'Điểm trung bình', examType: 'SchoolScore' };
  }, [questionNumber]);

  useLayoutEffect(() => {
    if (questionNumber === HOLLAND?.length && !isContinue?.current && data?.data) {
      setOpenModalNext(true);
      isContinue.current = true;
    }
  }, [questionNumber, isContinue?.current, data]);

  const calculateUserAnswer = () => {
    const userAnswers = {};
    let IQ_Score = 0;
    answers.get('IQ')?.forEach((answer, index) => {
      if (IQ[index]?.options[answer]?.isResult) {
        IQ_Score += IQ[index]?.options[answer]?.standardScore || 0;
      }
    });
    let EQ_Score = 0;
    answers.get('EQ')?.forEach((answer, index) => {
      EQ_Score += EQ[index]?.options[answer]?.standardScore || 0;
    });
    answers?.forEach((value, key) => {
      if (key !== 'EQ' && key !== 'IQ') {
        Object.assign(userAnswers, {
          [key]: `${value.length}/10`,
        });
      }
    });
    Object.assign(userAnswers, {
      IQ: IQ_Score === 0 ? '-' : `${IQ_Score}/120`,
      EQ: EQ_Score === 0 ? '-' : `${EQ_Score}/200`,
    });
    return userAnswers;
  };
  return (
    <ImageBackground
      source={require('@assets/images/background2.jpg')}
      style={{ flex: 1, paddingTop: StatusBar.currentHeight ?? 44 }}>
      <AppHeader
        title={examInfo.headerTitle}
        onPress={() => {
          navigationRef.goBack();
        }}
      />
      {isLoading || !data?.data ? (
        <ActivityIndicator size={'large'} color={COLORS.green} />
      ) : (
        <View style={styles.container}>
          {questionNumber < totalExams ? (
            <Question
              question={questionNumber < HOLLAND?.length ? HOLLAND[questionNumber].questions[0] : IQ_EQ_List[questionIndex]}
              questionNumber={questionNumber}
              type={examInfo.examType}
              questionIndex={examInfo.examType === 'IQ' ? questionIndex : questionIndex - IQ?.length}
              selections={selections}
              setSelections={setSelections}
              answers={answers}
              error={errorNotAnswer}
            />
          ) : (
            <SchoolScore subjects={subjects} setSubjects={setSubjects} />
          )}
        </View>
      )}

      <BottomButton onNext={onNext} onPrev={onPrev} maxValue={totalExams + 1} currentValue={questionNumber} />
      <AppModal
        disableBackDrop={true}
        visible={openModalNext}
        setVisible={setOpenModalNext}
        title={`Bạn có muốn tiếp tục làm bài kiểm tra trí tuệ và cảm xúc ?\n\nBài kiểm tra có thể mất 30 phút nhưng sẽ giúp định hướng nghề nghiệp chính xác hơn.`}
        onAccept={() => setOpenModalNext(false)}
        onCancel={() => {
          setQuestionNumber(totalExams);
          setOpenModalNext(false);
        }}
      />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: vs(10),
    marginTop: vs(10),
    marginBottom: vs(80),
    flex: 1,
  },
});
export default ExamQuestion;
