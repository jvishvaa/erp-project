import React from 'react';
import { constants, QuizContextHome } from '../mp-quiz-providers';
import MpQuiz from './mp-quiz';

const {
  urls: { quizSocketURL: { endpoint: quizSocketURLEndpoint } = {} } = {},
} = constants;

const { token: userAuthToken } =
  JSON.parse(localStorage.getItem('userDetails') || JSON.stringify({})) || {};
function MpQuizHome(props) {
  const { lobbyIdentifier: lobbyIdentifierFProps = 907 } = props || {};
  const [lobbyIdentifier] = React.useState(lobbyIdentifierFProps);

  const socketUrl = quizSocketURLEndpoint
    .replace('<online_class_id>', lobbyIdentifier)
    .replace('<user_auth_token>', userAuthToken);

  return (
    <QuizContextHome socketUrl={socketUrl}>
      <MpQuiz />
    </QuizContextHome>
  );
}
export default MpQuizHome;
