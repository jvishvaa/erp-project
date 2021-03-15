import React from 'react';
import { SocketProvider, useSocket, GlobalSocket } from '../mp-quiz-providers';
import MpQuizPlay from './mp-quiz-play';
import MpQuizSocketStatus from './mp-quiz-socket-status';

function MpQuiz() {
  const ws = useSocket();
  const { readyState } = ws || {};
  const [temp, setTemp] = React.useState();
  // console.log(ws, 'ws');
  // const { connection } = ws || {};
  // if (connection) {
  // debugger;
  // }
  // const { OPEN = null, readyState } = { ...(connection || {}) };

  return (
    <>
      <p>MpQuiz</p>
      <button
        type='button'
        onClick={() => {
          // setTemp(new Date().getTime());
          // debugger;
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
      </button>
      {/* {console.log('ws.connection', ws?.connection)} */}
      {readyState === 1 ? (
        <>
          {/* {console.log('ws.connection - MpQuizPlay', ws?.connection)} */}
          <MpQuizPlay key={readyState} />
        </>
      ) : (
        <>
          {/* {console.log('ws.connection - MpQuizSocketStatus', ws?.connection)} */}
          <MpQuizSocketStatus key={readyState} />
        </>
      )}
    </>
  );
}
export default MpQuiz;
/*
    Socket context undali.
    quiz events context - trigger and receive - save message data.
    questions context - fetch quesions - controls - attempt - track
*/
