const fetchParticipants = 'fetch_participants'
const fetchLeaderboard = 'fetch_leaderboard'
const removeUser = 'remove_user'
const respondToQuestion = 'respond_to_question'
const startQuiz = 'start_quiz'
const endQuiz = 'end_quiz'
const joinLobby = 'join_lobby'
// event labesl
const eventLabels = {
  fetchParticipants,
  fetchLeaderboard,
  removeUser,
  respondToQuestion,
  startQuiz,
  endQuiz,
  joinLobby
}
// Quiz websocket events
const WebSockectEvents = {
  [fetchParticipants]: { eventLabel: fetchParticipants, storageKey: `wb_${fetchParticipants}`, prevDataStrgKey: `wb_prev_${fetchParticipants}` },
  [fetchLeaderboard]: { eventLabel: fetchLeaderboard, storageKey: `wb_${fetchLeaderboard}`, prevDataStrgKey: `wb_prev_${fetchLeaderboard}` },
  [removeUser]: { eventLabel: removeUser, storageKey: `wb_${removeUser}`, prevDataStrgKey: `wb_prev_${removeUser}` },
  [respondToQuestion]: { eventLabel: respondToQuestion, storageKey: `wb_${respondToQuestion}`, prevDataStrgKey: `wb_prev_${respondToQuestion}` },
  [startQuiz]: { eventLabel: startQuiz, storageKey: `wb_${startQuiz}`, prevDataStrgKey: `wb_prev_${startQuiz}` },
  [endQuiz]: { eventLabel: endQuiz, storageKey: `wb_${endQuiz}`, prevDataStrgKey: `wb_prev_${endQuiz}` },
  [joinLobby]: { eventLabel: joinLobby, storageKey: `wb_${joinLobby}`, prevDataStrgKey: `wb_prev_${joinLobby}` },
  [null]: { eventLabel: 'null', storageKey: `wb_${null}`, prevDataStrgKey: `wb_prev_${null}` },
  [undefined]: { eventLabel: 'undefined', storageKey: `wb_${undefined}`, prevDataStrgKey: `wb_prev_${undefined}` }
}
/* this is how above WebSockectEvents obj looks like
  WebSockectEvents = {
    'fetch_participants': { 'eventLabel': 'fetch_participants', 'storageKey': 'wb_fetch_participants' },
    'fetch_leaderboard': { 'eventLabel': 'fetch_leaderboard', 'storageKey': 'wb_fetch_leaderboard' },
    'remove_user': { 'eventLabel': 'remove_user', 'storageKey': 'wb_remove_user' },
    'respond_to_question': { 'eventLabel': 'respond_to_question', 'storageKey': 'wb_respond_to_question' },
    'start_quiz': { 'eventLabel': 'start_quiz', 'storageKey': 'wb_start_quiz' },
    'end_quiz': { 'eventLabel': 'end_quiz', 'storageKey': 'wb_end_quiz' },
    'join_lobby': { 'eventLabel': 'join_lobby', 'storageKey': 'wb_join_lobby' },
    'null': { 'eventLabel': 'null', 'storageKey': 'wb_null' },
    'undefined': { 'eventLabel': 'undefined', 'storageKey': 'wb_undefined' }
  }
*/
export { WebSockectEvents, eventLabels, fetchParticipants, fetchLeaderboard, removeUser, respondToQuestion, startQuiz, endQuiz, joinLobby }

// x = {
//   correct_ans: 'bla bla',
//   id: 415,
//   option: 'blabla',
//   question: 'bla bla',
//   question_type: 'MCQ',
//   question_type_id: 1,
//   score_schema: {
//     // data what evr srehari's func returs
//   },
//   response: {
//     attempted_ans: 1,
//     chapter_id: 197,
//     duration: 12.514999866485596,
//     end_time: 1589046661.271,
//     id: 415,
//     start_time: 1589046648.756
//   }
// }
