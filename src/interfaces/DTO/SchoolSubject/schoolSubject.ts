import {IResponse} from '..';

export interface ISchoolSubject {
  name: string;
  vnName: string;
  value?: string;
}
export interface ISchoolSubjectsResponse extends IResponse {
  data: ISchoolSubject[];
}
