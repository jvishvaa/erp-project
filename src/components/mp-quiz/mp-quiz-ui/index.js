import React from 'react';
import { constants, QuizContextHome } from '../mp-quiz-providers';
import axiosInstance from '../../../config/axios';
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
  const { params: { question_paper: questionPaperId } = {} } = props || {}
  const { params: { role: roleId } = {} } = props || {}


  const [lobbyIdentifier] = React.useState(lobbyIdentifierFProps);

  const { host } = new URL(axiosInstance.defaults.baseURL); // "dev.olvorchidnaigaon.letseduvate.com"
  const hostSplitArray = host.split('.');
  const subDomainLevels = hostSplitArray.length - 2;
  let domain = '';
  let subDomain = '';
  let subSubDomain = '';
  if (hostSplitArray.length > 2) {
    domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
  }
  if (subDomainLevels === 2) {
    subSubDomain = hostSplitArray[0];
    subDomain = hostSplitArray[1];
  } else if (subDomainLevels === 1) {
    subDomain = hostSplitArray[0];
  }

  const domainTobeSent = subDomain;
// need to change questionPaperId dynamically
  const socketUrl = quizSocketURLEndpoint
    .replace('<domain_name>', domainTobeSent)
    .replace('<role>',roleId)
    .replace('<online_class_id>', lobbyIdentifier)
    .replace('<question_paper>',questionPaperId)
    .replace('<user_auth_token>', userAuthToken)
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
