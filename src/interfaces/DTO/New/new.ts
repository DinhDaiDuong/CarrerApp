import {IResponse} from '..';

export interface INew {
  _id: string;
  createdAt: Date;
  title: string;
  content: string;
  type: string;
  image: {
    longImage?: string;
    shortImage: string;
  };
}

export interface INewCategory {
  categoryName: string;
  listNews: INew[];
}
export interface INewsResponse extends IResponse {
  data: INew[];
  totalCount?: number;
}
