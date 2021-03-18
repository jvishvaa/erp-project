import React from 'react';
import { useSocket } from '../mp-quiz-providers';
import MpQuizPlay from './mp-quiz-play';
import MpQuizSocketStatus from './mp-quiz-components/mp-quiz-socket-status';

function MpQuiz() {
  const socket = useSocket();
  const { readyState } = socket || {};
  return (
    <>
      <MpQuizSocketStatus key={readyState} />
      {readyState === window.WebSocket.OPEN ? <MpQuizPlay key={readyState} /> : null}
    </>
  );
}
export default MpQuiz;
// src/components/mp-quiz/mp-quiz-ui/mp-quiz-components/leaderboard/HostPostQuizReport/HostPostQuizReport.jsx
// src/components/mp-quiz/mp-quiz-ui/mp-quiz-components/leaderboard/PostQuiz/ReviewAnswers.jsx
/* <button
        type='button'
        onClick={() => {
          ws.trigger('respond_to_question', {
            event: 'respond_to_question',
            response: {
              id: 84753,
              attempted_ans: 0,
              start_time: 1615371929.024,
              sequence: 0,
              end_time: 1615371955.127,
              correct: false,
              is_quiz_over: false,
              duration: 26.103000164031982,
              score: 0,
              bonus_achieved: false,
            },
          });
        }}
      >
        Click
      </button> */
