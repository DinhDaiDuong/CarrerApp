import { EQuestionType } from '@utils/enum/exam.enum';
import { IResponse } from '..';

export type TExam = 'R' | 'I' | 'A' | 'S' | 'E' | 'C' | 'IQ' | 'EQ' | 'SchoolScore';
export interface IOption {
  _id: string;
  image?: string;
  content: string;
  isResult?: boolean;
  standardScore?: number;

  // new response
}
export interface IQuestion {
  _id: string;
  questionTitle: string;
  image?: string;
  options: IOption[];
  answer?: number | number[];

  // new response
  questionType: EQuestionType;
}
export interface IResult {
  score?: null | number[];
  content: string;
  image?: string;
  detail?: string;
}
export interface IExam {
  _id: string;
  type: TExam;
  questions: IQuestion[];
  results: IResult[];

  // new response
  name: string;
}
export interface IExamResponse extends IResponse {
  data: IExam[];
}

export interface IExamDetailResponse extends IResponse {
  data: IExam;
}
