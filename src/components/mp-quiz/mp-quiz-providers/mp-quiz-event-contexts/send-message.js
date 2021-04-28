import constants from '../mp-quiz-constants';

const {
  socketContants: { eventLabels },
} = constants;

function sendMessage(websocket, message = {}) {
  if (!websocket) {
    window.alert(`Websocket instance sent as ${typeof websocket}`);
    return;
  }
  try {
    websocket.trigger(message.event, message); // send data to the server
    // websocket.send(JSON.stringify(message)); // send data to the server
  } catch (error) {
    console.log(error); // catch error
  }
}

function startQuizTrigger(websocket) {
  /*
  {
    "event": "start_quiz"
    "started_at": <django format timestamp>
  }
  */
  const { startQuiz } = eventLabels;
  const message = { event: startQuiz, started_at: new Date() };
  sendMessage(websocket, message);
}
function endQuizTrigger(websocket) {
  /*
    {
      "event": "end_quiz"
      "ended_at": <django format timestamp>
    }
  */
  const { endQuiz } = eventLabels;
  const message = { event: endQuiz, ended_at: new Date() };
  sendMessage(websocket, message);
}
function removeUserTrigger(websocket, userId) {
  if (!userId) return;
  /*
    {
      "event": "remove_user"
      "user_id": <121>
    }
  */
  const { removeUser } = eventLabels;
  const message = { event: removeUser, user_id: userId };
  sendMessage(websocket, message);
}

function postQuesReponseTrigger(websocket, dataObj) {
  /*
  {
    event: 'respond_to_question',
    response:{
      attempted_ans: 0,
      duration: 2.5199999809265137,
      end_time: 1589295572.455,
      id: 37134,
      start_time: 1589295569.935,
      score: 800,
      is_quiz_over: true // true on last question else false.
    }
  }
  */
  const { respondToQuestion } = eventLabels;
  const message = { event: respondToQuestion, response: dataObj };
  sendMessage(websocket, message);
}

function triggerFetchParticipants(websocket) {
  const { fetchParticipants } = eventLabels;
  const message = { event: fetchParticipants };
  sendMessage(websocket, message);
}

export {
  startQuizTrigger,
  endQuizTrigger,
  removeUserTrigger,
  postQuesReponseTrigger,
  triggerFetchParticipants,
};
