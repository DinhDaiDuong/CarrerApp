const BASE_URL = 'https://career-app-ndt9.onrender.com';
// const BASE_URL = 'http://192.168.0.101:3000';
const ENDPOINTS_URL = {
  EXAM: {
    GET_EXAM: '/exams',
    ADD_EXAM: '/exams/addExam',
    DELETE_EXAM: '/exams/deleteExam',
    UPDATE_EXAM: '/exams/updateExam',
    DETAIL: '/exams/detail',
  },
  AUTH: {
    GET_ANNONYMOUS_TOKEN: '/accounts/accessToken',
    LOGIN: '/accounts/login',
    LOGOUT: '/accounts/logout',
    LOGIN_WITH_SOCIAL: '/accounts/loginWithSocial',
    SIGN_UP: '/accounts',
    FORGOT_PASSWORD: '/accounts/forgotPassword',
    LIST_MEMBER: '/accounts/account-name',
  },
  NEWS: {
    GET_NEWS: '/news',
    GET_NEWEST_NEWS: '/news/newest',
    GET_ALL_NEWS_DETAIL: '/news/all',
    GET_ALL_CATEGORIES: '/news/categories',
  },
  SCHOOL_SUBJECTS: {
    GET_SUBJECTS: '/schoolSubjects/getSubjects',
    CACULATE_SCHOOL_SCORE: '/schoolSubjects/caculateScore',
  },
  CHAT_BOT: {
    GET_CHAT: '/geminiAI/generateChat',
    GET_CHAT_IN_GROUP: '/chat-bot/execute-in-group',
  },
  CONCLUSION: {
    GET_CONCLUSION: '/exams/getConclusion',
  },
  DICTIONARY: {
    GET_DICTIONARY: '/dictionary',
    GET_ALL_SCHOOL: '/dictionary/getAllSchool',
    GET_SCHOOL: '/dictionary/getSchool',
  },
  UPLOAD: {
    UPLOAD_OCR: '/ocr/ocrGemini',
  },
  GROUP: {
    GET_LIST_GROUP_BY_USER_ID: '/accounts/list-group',
    GET_DETAIL: '/groups',
    GET_ALL_SELECT: '/groups/select',
    UPDATE_GROUP: '/groups',
  },
  DO_EXAM: '/do-exam',
};
export { BASE_URL, ENDPOINTS_URL };
