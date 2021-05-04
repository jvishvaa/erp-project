import React from 'react';
import { constants, QuizContextHome } from '../mp-quiz-providers';
import MpQuiz from './mp-quiz';

const {
  // setParamConstants,
  urls: { quizSocketURL: { endpoint: quizSocketURLEndpoint } = {} } = {},
} = constants;

const { token: userAuthToken } =
  JSON.parse(localStorage.getItem('userDetails') || JSON.stringify({})) || {};

function MpQuizHome(props) {
  // const { lobbyIdentifier: lobbyIdentifierFProps = 907 } = props || {};
  // const { params: { lobby_identifier: lobbyIdentifierFProps } = {} } = constants;
  const { params: { lobby_identifier: lobbyIdentifierFProps } = {} } = props || {}
  const [lobbyIdentifier] = React.useState(lobbyIdentifierFProps);

  const socketUrl = quizSocketURLEndpoint
    .replace('<online_class_id>', lobbyIdentifier)
    .replace('<user_auth_token>', userAuthToken);

  // setParamConstants({
  //   online_class_id: 70,
  //   question_paper: 80,
  //   lobby_identifier: 907,
  //   user_auth_token: userAuthToken,
  // });
  return (
    <QuizContextHome socketUrl={socketUrl}>
      <MpQuiz params={props.params} />
    </QuizContextHome>
  );
}
export default MpQuizHome;
