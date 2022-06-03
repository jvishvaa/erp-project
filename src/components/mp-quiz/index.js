import React from 'react';
import { withRouter } from 'react-router-dom'
import MpQuizHome from './mp-quiz-ui';

function MultiplayerQuiz(props) {
  // let params = {
  //   online_class_id: 70,
  //   question_paper: 80,
  //   lobby_identifier: 907,
  // user_auth_token: userAuthToken,
  // };
  // path /erp-online-class/:onlineclassId/quiz/:questionpaperId/:lobbyuuid
  const {
    match: {
      params: {
        onlineclassId: onlineClassId,
        questionpaperId: questionPaperId,
        lobbyuuid: lobbyUuid,role:role,
        is_erp_qp : is_erp_qp,
        assessment_id : assessment_id
      }
      = {}
    }
    = {}
  } = props || {}
  const params = {
    online_class_id: onlineClassId,
    question_paper: questionPaperId,
    lobby_identifier: onlineClassId,
    lobbyuuif: lobbyUuid,
    role:role,
    is_erp_qp : is_erp_qp,
    assessment_id : assessment_id
  }
  return <MpQuizHome params={params} />;
}
export default withRouter(MultiplayerQuiz)
