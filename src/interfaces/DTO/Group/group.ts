import { IResponse } from '..';

export interface IGroup {
  groupName: string;
  ownerName: string;
  _id: string;
}
export interface IListGroup {
  _id: string;
  groupName: string;
  owner: {
    _id: string;
    name: string;
  };
}
export interface IAccountItem {
  _id: string;
  email: string;
  name: string;
  status: number;
}
export interface IExamItem {
  _id: string;
  type: string;
  name: string;
  category: string;
  status: string;
}
export interface IAccountDetail {
  _id: string;
  groupName: string;
  members: IAccountItem[];
  owner: IAccountItem;
  status: number;
  createdAt: string;
  updatedAt: string;
  exams: IExamItem[]; // Adjust based on the structure of exams if needed
  prompts: string[];
}
export interface IGroupDetailREQ {
  groupName: string;
  members: string[];
  owner: string;
  status: number; //0: deactive ; 1: active
  exams: string[];
  prompts: string[];
}
export interface IGroupSelect {
  _id: string;
  groupName: string;
}
export interface IListGroupResponse extends IResponse {
  data: IListGroup[];
}

export interface IGroupResponse extends IResponse {
  data: IAccountDetail;
}

export interface IGroupSelectResponse extends IResponse {
  data: IGroupSelect[];
}
