import { IResponse } from '..';
import { IResult } from '../Exam/exam';

export interface IMyAnswers {
  questionId: string;
  answers?: string[];
  shortAnswer?: string;
}
export interface IDoExam {
  _id?: string;
  examId: string;
  groupId: string;
  myAnswers: IMyAnswers[];
  result?: IResult;
  totalScore?: number;
}

export interface IDoExamResponse extends IResponse {
  data: IDoExam;
}

export interface IDoExamPagingResponse extends IResponse {
  data: IDoExam[];
}
