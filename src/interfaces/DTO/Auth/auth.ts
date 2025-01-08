import { IResponse } from '..';
interface PermissionDetails {
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  code: string;
  name: string;
  permission: PermissionDetails;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: string;
  name: string;
  role: string;
  email: string;
  groups: string[];
  permissions: Permission[];
  accessToken: string;
}
export interface SignUpFormData {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  deviceId: string;
}
export interface MemberSelectData {
  _id: string;
  email: string;
  name: string;
}
export interface IAnnonymousToken {
  token: string;
}

export interface IAnnonymousTokenResponse extends IResponse {
  data: IAnnonymousToken;
}

export interface ILoginResponse extends IResponse {
  data: UserData;
}

export interface ISignUpResponse extends IResponse {
  data: any;
}

export interface IMemberSelectResponse extends IResponse {
  data: MemberSelectData[];
}
