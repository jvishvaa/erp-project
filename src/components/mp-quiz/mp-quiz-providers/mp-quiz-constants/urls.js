import axiosInstance from '../../../../config/axios';

const userAuthToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNjcxLCJ1c2VybmFtZSI6IjIwMDEyMzAwMDUiLCJleHAiOjY2MTU1Mjg1MzIsImVtYWlsIjoia3V2aWthc2gxMjNAZ21haWwuY29tIn0.yw3hZZ5GwrnDRrjGdLhmFm5v2QlA8HQ0yAHc7NQw8Jo';

const ajaxBaseURL = axiosInstance.defaults.baseURL; // 'http://127.0.0.1:8000/qbox';

const ajaxHeaders = { headers: { Authorization: `Bearer ${userAuthToken}` } };
const ajaxHeadersForCentral = { headers: { 'x-api-key': 'vikash@12345#1231' } };

const genSocketBase = () => {
  const { port: isLocal, host } = new URL(ajaxBaseURL);
  const protocol = isLocal ? 'ws' : 'wss';
  // const port = isLocal?isLocal:'443'
  return `${protocol}://${host}`;
};
const socketBase = genSocketBase();
const socketBaseURL = `${socketBase}/ws`;
const urls = {
  // socketBase: 'ws://localhost:8000/ws',

  socketEndPoint: '/multiplayer-quiz/<online_class_id>/<user_auth_token>/',
  quizSocketURL: {
    baseURL: socketBaseURL,
    headers: {},
    endpoint: `${socketBaseURL}/multiplayer-quiz/<online_class_id>/<user_auth_token>/`,
  },
  fetchQuizBgms: {
    baseURL: ajaxBaseURL,
    headers: ajaxHeaders,
    endpoint: `${ajaxBaseURL}/mp_quiz/mp_music/`,
  },
  fetchQuizQpPaper: {
    baseURL: ajaxBaseURL,
    headers: ajaxHeaders,
    endpoint: `${ajaxBaseURL}/mp_quiz/mp_questions_list/`, // ?question_paper=80&lobby_identifier=907&online_class_id=907
  },

  ajaxHeaders,
  ajaxBaseURL,
  ajaxHeadersForCentral,
  userAuthToken,
  socketBase,
  socketBaseURL,
};

export default urls;

// ws://localhost:8000/ws/multiplayer-quiz/80/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNjcxLCJ1c2VybmFtZSI6IjIwMDEyMzAwMDUiLCJleHAiOjY2MTU1Mjg1MzIsImVtYWlsIjoia3V2aWthc2gxMjNAZ21haWwuY29tIn0.yw3hZZ5GwrnDRrjGdLhmFm5v2QlA8HQ0yAHc7NQw8Jo/

Number.ordinalSuffixOf = function ordinalSuffixOf(value) {
  if (value === undefined || value === false || value === null) {
    return value;
  }
  const j = value % 10;
  const k = value % 100;
  if (j === 1 && k !== 11) {
    return `${value}st`;
  }
  if (j === 2 && k !== 12) {
    return `${value}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${value}rd`;
  }
  return `${value}th`;
};
