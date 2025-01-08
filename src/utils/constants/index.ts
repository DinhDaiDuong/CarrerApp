import { QueryClient } from '@tanstack/query-core';

const QUERY_KEY = {
  EXAMS: 'EXAMS',
  NEWS: 'NEWS',
  NEWS_NEWEST: 'NEWS_NEWEST',
  NEWS_CATEGORIES: 'NEWS_CATEGORIES',
  SCHOOL_SUBJECTS: 'SCHOOL_SUBJECTS',
  CACULATE_SCHOOL_SCORE: 'CACULATE_SCHOOL_SCORE',
  CONCLUSION: 'CONCLUSION',
  DICTIONARY: 'DICTIONARY',
  SCHOOL: 'SCHOOL',
  OCR: 'OCR',
  ANNONYMOUS_TOKEN: 'ANNONYMOUS_TOKEN',
  AUTH: 'AUTH',
  SIGN_UP: 'SIGN_UP',
  DESIGN_EXAM: 'DESIGN_EXAM',
  GROUP: 'GROUP',
  GROUP_SELECT: 'GROUP_SELECT',
  MEMBER_SELECT: 'MEMBER_SELECT',
  DO_EXAM: 'DO_EXAM',
  DO_EXAM_DETAIL: 'DO_EXAM_DETAIL',
};
export const queryClient = new QueryClient();
export { QUERY_KEY };
export const Schema = {
  noEmpty: 'Vui lòng nhập thông tin!',
  minPassword: 'Password phải bao gồm ít nhất 6 ký tự',
};
