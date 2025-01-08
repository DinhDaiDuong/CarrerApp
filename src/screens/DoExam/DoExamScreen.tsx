import { AppButton, AppHeader, AppModal, AppView } from '@components';
import { IExamDetailResponse, IResult } from '@interfaces/DTO';
import { IDoExam, IDoExamPagingResponse, IDoExamResponse, IMyAnswers } from '@interfaces/DTO/DoExam/do-exam';
import { navigationRef } from '@navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomButton } from '@screens/ExamQuestion/components';
import { ENDPOINTS_URL } from '@service';
import api from '@service/api';
import { useAuthStore } from '@store/auth.store';
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { COLORS, FONT, QUERY_KEY, queryClient, s, vs, WIDTH } from '@utils';
import { EQuestionType } from '@utils/enum/exam.enum';
import { TRootStackNav } from '@utils/types/RootStackNav';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import DoExamQuestion from './components/DoExamQuestion';
import DoExamResult from './components/DoExamResult';
type Props = NativeStackScreenProps<TRootStackNav, 'DoExam'>;
const DoExamScreen = ({ route }: Props) => {
  // STATES
  const [openContinueModal, setOpenContinueModal] = useState(false);
  const [openSubmitExamModal, setOpenSubmitExamModal] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [myAnswers, setMyAnswers] = useState<IMyAnswers[]>([]);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<IDoExam | null>(null);
  const [isView, setIsView] = useState(false);

  const { userInfo } = useAuthStore();

  // APIS
  const { data: exam, isFetching: isFetchingExam } = useQuery<unknown, DefaultError, IExamDetailResponse>({
    queryKey: [QUERY_KEY.DESIGN_EXAM],
    queryFn: () =>
      api(ENDPOINTS_URL.EXAM.DETAIL, 'GET', {
        params: { id: route?.params?.examId },
      }),
    enabled: !!route?.params?.examId,
  });

  const { data: doExam, isFetching: isFetchingDoExam } = useQuery<unknown, DefaultError, IDoExamPagingResponse>({
    queryKey: [QUERY_KEY.DO_EXAM],
    queryFn: () =>
      api(ENDPOINTS_URL.DO_EXAM, 'GET', {
        params: { examId: route?.params?.examId, groupId: route?.params?.groupId, creatorId: userInfo?.id },
      }),
  });

  const { data: doExamDetail, isFetching: isFetchingDoExamDetail } = useQuery<unknown, DefaultError, IDoExamResponse>({
    queryKey: [QUERY_KEY.DO_EXAM_DETAIL],
    queryFn: () =>
      api(`${ENDPOINTS_URL.DO_EXAM}/detail`, 'GET', {
        params: { id: doExam?.data[0]?._id },
      }),
    enabled: !!doExam?.data[0]?._id,
  });

  const { mutate: addDoExamApi, isPending: isAddingDoExam } = useMutation({
    mutationFn: () =>
      api<any, IDoExam>(ENDPOINTS_URL.DO_EXAM, 'POST', {
        data: {
          examId: route?.params?.examId as string,
          groupId: route?.params?.groupId as string,
          myAnswers: myAnswers,
        },
      }),
    onSuccess: async (data: IDoExamResponse | any) => {
      if (data?.code === 200 && data?.data?.result) {
        setOpenSubmitExamModal(false);
        setResult(data?.data as IDoExam);
        Toast.show({
          type: 'success',
          text1: 'Thông báo',
          text2: 'Nộp bài kiểm tra thành công!',
        });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.DO_EXAM, QUERY_KEY.DO_EXAM_DETAIL] });
        setMyAnswers([]);
        // navigationRef.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Cảnh báo',
          text2: 'Có lỗi xảy ra, vui lòng thử lại!',
        });
      }
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Cảnh báo',
        text2: 'Có lỗi xảy ra, vui lòng thử lại!',
      });
    },
  });

  // METHODS
  const onNext = () => {
    const question = exam?.data?.questions[currentQuestion];
    const answer = myAnswers?.find((item) => item?.questionId === question?._id);
    if (question?.questionType === EQuestionType.SHORT_ANSWER) {
      if (!answer?.shortAnswer) {
        setError(true);
        return;
      }
    }

    if (question?.questionType === EQuestionType.MULTIPLE_CHOICE || question?.questionType === EQuestionType.TICK_BOX) {
      if (answer?.answers?.length === 0) {
        setError(true);
        return;
      }
    }

    setError(false);

    const max = (exam?.data?.questions?.length || 1) - 1;

    if (currentQuestion < max) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (isView) return;
      setOpenSubmitExamModal(true);
      console.log('my Answer', myAnswers);
    }
  };

  const onPrev = () => {
    if (currentQuestion >= 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isLoading = useMemo(
    () => isFetchingExam || isFetchingDoExam || isFetchingDoExamDetail,
    [isFetchingDoExam, isFetchingDoExamDetail, isFetchingExam],
  );

  // EFFECTS
  useEffect(() => {
    if (exam?.data?.questions?.length !== 0) {
      const answers: IMyAnswers[] =
        exam?.data?.questions?.map((item) => ({
          questionId: item._id,
          answers: [],
        })) || [];
      setMyAnswers(answers);
    }
  }, [exam?.data?.questions]);

  useEffect(() => {
    if (doExam?.data?.length !== 0) {
      setResult(doExam?.data[0] as IDoExam);
      setIsView(true);
    }
  }, [doExam?.data]);

  return (
    <React.Fragment>
      <AppView style={{ marginBottom: !result ? vs(44) : 0 }} showsVerticalScrollIndicator={false}>
        <AppHeader
          title={!result ? (isView ? 'Xem lại bài làm' : 'Làm bài kiểm tra') : 'Kết quả'}
          onPress={() => {
            if (!result && !isView) {
              setOpenContinueModal(true);
            } else {
              navigationRef.goBack();
            }
          }}
        />
        {isLoading ? (
          <ActivityIndicator size={'large'} color={COLORS.green} />
        ) : (
          <View style={styles.container}>
            {!result ? (
              <DoExamQuestion
                question={exam?.data?.questions[currentQuestion]}
                myAnswers={myAnswers}
                setMyAnswers={setMyAnswers}
                error={error}
              />
            ) : (
              <DoExamResult result={result?.result as IResult} totalScore={result?.totalScore || 0} />
            )}
          </View>
        )}
      </AppView>

      {!result && exam?.data?.questions?.length && (
        <BottomButton
          onNext={onNext}
          onPrev={onPrev}
          maxValue={exam?.data?.questions?.length || 1}
          currentValue={currentQuestion + 1}
        />
      )}

      {result && (
        <View style={styles.buttonContainer}>
          <AppButton
            buttonStyle={{ width: WIDTH * 0.4, borderWidth: 1 }}
            type='outline'
            label='Xem bài làm'
            labelStyle={[FONT.content.M.medium, { marginHorizontal: 0 }]}
            size='S'
            onPress={() => {
              setMyAnswers(doExamDetail?.data?.myAnswers || []);
              setResult(null);
              setIsView(true);
              setCurrentQuestion(0);
            }}
          />
          <AppButton
            buttonStyle={{ width: WIDTH * 0.4, borderWidth: 1 }}
            type='outline'
            label='Làm lại'
            labelStyle={[FONT.content.M.medium, { marginHorizontal: 0 }]}
            size='S'
            onPress={() => {
              setResult(null);
              if (exam?.data?.questions?.length !== 0) {
                const answers: IMyAnswers[] =
                  exam?.data?.questions?.map((item) => ({
                    questionId: item._id,
                    answers: [],
                  })) || [];
                setMyAnswers(answers);
              }
              setIsView(false);
              setCurrentQuestion(0);
            }}
          />
        </View>
      )}

      <AppModal
        visible={openContinueModal}
        cancelText='Thoát'
        confirmText='Tiếp tục'
        title='Nếu thoát bài kiểm tra, kết quả sẽ không được lưu! Bạn có muốn tiếp tục?'
        onAccept={() => setOpenContinueModal(false)}
        onCancel={() => navigationRef?.goBack()}
        setVisible={setOpenContinueModal}
      />

      <AppModal
        visible={openSubmitExamModal}
        setVisible={setOpenSubmitExamModal}
        confirmText='Nộp'
        cancelText='Đóng'
        onCancel={() => setOpenSubmitExamModal(false)}
        onAccept={() => {
          addDoExamApi();
        }}
        title='Bạn có chắc chắn muốn nộp bài?'
        loading={isAddingDoExam}
      />
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(27),
  },

  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingVertical: vs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(27),
    backgroundColor: 'transparent',
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    zIndex: 9999,
  },
});
export default DoExamScreen;
