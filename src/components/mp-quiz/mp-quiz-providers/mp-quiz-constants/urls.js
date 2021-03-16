const userAuthToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNjcxLCJ1c2VybmFtZSI6IjIwMDEyMzAwMDUiLCJleHAiOjY2MTU1Mjg1MzIsImVtYWlsIjoia3V2aWthc2gxMjNAZ21haWwuY29tIn0.yw3hZZ5GwrnDRrjGdLhmFm5v2QlA8HQ0yAHc7NQw8Jo';

const ajaxBase = 'http://127.0.0.1:8000/qbox/';
const ajaxHeaders = {
  headers: {
    Authorization: `Bearer ${userAuthToken}`,
    // 'x-api-key': 'vikash@12345#1231',
  },
};
const urls = {
  socketBase: 'ws://localhost:8000/ws/',
  fetchQuestions: 'fetchQuestions',
  socketEndPoint: 'multiplayer-quiz/<online_class_id>/<user_auth_token>/',
  fetchQuizBgms: 'mp_quiz/mp_music/',
  ajaxHeaders,
  ajaxBase,
  userAuthToken,
};

export default urls;

// ws://localhost:8000/ws/multiplayer-quiz/80/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNjcxLCJ1c2VybmFtZSI6IjIwMDEyMzAwMDUiLCJleHAiOjY2MTU1Mjg1MzIsImVtYWlsIjoia3V2aWthc2gxMjNAZ21haWwuY29tIn0.yw3hZZ5GwrnDRrjGdLhmFm5v2QlA8HQ0yAHc7NQw8Jo/
