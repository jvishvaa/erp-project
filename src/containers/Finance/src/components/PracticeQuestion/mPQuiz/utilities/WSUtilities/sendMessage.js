import { eventLabels, fetchParticipants } from './eventUtilities'

function sendMessage (websocket, message = {}) {
  if (!websocket) {
    window.alert(`Websocket instance sent as ${typeof websocket}`)
    return
  }
  try {
    websocket.send(JSON.stringify(message)) // send data to the server
  } catch (error) {
    console.log(error) // catch error
  }
}

function startQuizTrigger (websocket) {
  /*
  {
    "event": "start_quiz"
    "started_at": <django format timestamp>
  }
  */
  let { startQuiz } = eventLabels
  let message = { event: startQuiz, started_at: new Date() }
  sendMessage(websocket, message)
}
function endQuizTrigger (websocket) {
  /*
    {
      "event": "end_quiz"
      "ended_at": <django format timestamp>
    }
  */
  let { endQuiz } = eventLabels
  let message = { event: endQuiz, ended_at: new Date() }
  sendMessage(websocket, message)
}
function removeUserTrigger (websocket, userId) {
  if (!userId) return
  /*
    {
      "event": "remove_user"
      "user_id": <121>
    }
  */
  let { removeUser } = eventLabels
  let message = { event: removeUser, user_id: userId }
  sendMessage(websocket, message)
}

function postQuesReponseTrigger (websocket, dataObj) {
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
  let { respondToQuestion } = eventLabels
  let message = { event: respondToQuestion, response: dataObj }
  sendMessage(websocket, message)
}

function triggerFetchParticipants (websocket) {
  let message = { event: fetchParticipants }
  sendMessage(websocket, message)
}

export { startQuizTrigger, endQuizTrigger, removeUserTrigger, postQuesReponseTrigger, triggerFetchParticipants }
