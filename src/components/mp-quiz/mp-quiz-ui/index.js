import React from 'react';
import { constants, QuizContextHome } from '../mp-quiz-providers';
import MpQuiz from './mp-quiz';

const { urls } = constants;
const userAuthToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNjcxLCJ1c2VybmFtZSI6IjIwMDEyMzAwMDUiLCJleHAiOjY2MTU1Mjg1MzIsImVtYWlsIjoia3V2aWthc2gxMjNAZ21haWwuY29tIn0.yw3hZZ5GwrnDRrjGdLhmFm5v2QlA8HQ0yAHc7NQw8Jo';

function MpQuizHome(props) {
  const { lobbyId: lobbyIdFProps = 907 } = props || {};
  const [lobbyId] = React.useState(lobbyIdFProps);

  const socketUrl = (urls.socketBase + urls.socketEndPoint)
    .replace('<online_class_id>', lobbyId)
    .replace('<user_auth_token>', userAuthToken);

  return (
    <QuizContextHome socketUrl={socketUrl}>
      <div>
        <p>MpQuizHome</p>
        <MpQuiz />
      </div>
    </QuizContextHome>
  );
}
export default MpQuizHome;
/*
    Socket context.
    quiz events context - trigger and receive - save message data.
    questions context - fetch quesions - controls - attempt - track
*/
