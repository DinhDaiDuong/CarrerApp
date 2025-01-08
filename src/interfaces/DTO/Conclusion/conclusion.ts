import {IResponse} from '..';

export interface IConclusion {
  Type: string;
  Holland: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  SchoolScore: 'A' | 'B' | 'C' | 'D';
  IQ: string;
  EQ: string;
  Field: string;
  Jobs: string;
  Schools: string;
  Conclusion: string;
}
export interface IConclusionResponse extends IResponse {
  data: IConclusion;
}
