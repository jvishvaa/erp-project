import React from 'react';
import { useSocket } from '../mp-quiz-providers';
import MpQuizPlay from './mp-quiz-play';
import MpQuizSocketStatus from './mp-quiz-socket-status';
// import QuestionHandlerHome from './mp-quiz-components/mp-quiz-question-handler';

function MpQuiz() {
  const socket = useSocket();
  const { readyState } = socket || {};
  return (
    <>
      {/* <p>MpQuiz</p>
      <button
        type='button'
        onClick={() => {
          socket.trigger('respond_to_question', {
            event: 'respond_to_question',
            response: {
              id: 485,
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
      </button> */}
      <MpQuizSocketStatus key={readyState} />
      {readyState === window.WebSocket.OPEN ? <MpQuizPlay key={readyState} /> : null}
      {/* <QuestionHandlerHome /> */}
    </>
  );
}
export default MpQuiz;
/*
    Socket context undali.
    quiz events context - trigger and receive - save message data.
    questions context - fetch quesions - controls - attempt - track
*/

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
