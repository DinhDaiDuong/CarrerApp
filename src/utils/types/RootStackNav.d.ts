import { TGroup, TSchoolScoreResult } from './metaTypes';

export type TRootStackNav = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  ListResult: undefined;
  ListExam: undefined;
  ExamQuestion: undefined;
  UploadResult: undefined;
  Result: {
    userAnswers: Record<string, string>;
    schoolScoreResults: TSchoolScoreResult[];
  };
  News: undefined;
  NewsDetail1: {
    content: string;
  };

  ChatBot: undefined;
  ResultDetail: {
    url: string;
  };
  Dictionary: undefined;
  DictionaryDetail: {
    group: TGroup;
    name: string;
    image: string;
    content: {
      pros: string;
      cons: string;
    };
  };
  SignUp: undefined;
  ForgotPassword: undefined;
  Login: undefined;
  GroupList: undefined;
  GroupDetail: {
    id: string;
  };
  DoExam: {
    examId: string;
    groupId: string;
  };
  ChatbotInGroup: {
    groupId: string;
  };
};
