import {TGroup} from '@utils';
import {IResponse} from '..';
export interface IMajor {
  name: string;
  image: string;
  subjects: string;
  pros: string;
  cons: string;
}
export interface IDictionary {
  group: TGroup;
  majors: IMajor[];
}
export interface IDictionaryResponse extends IResponse {
  data: IDictionary[];
}
