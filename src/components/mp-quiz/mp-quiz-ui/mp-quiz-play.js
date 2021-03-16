import React from 'react';
import { useQuizContext, constants } from '../mp-quiz-providers';

const {
  socketContants: {
    eventLabels: {
      joinLobby: joinLobbyLabel,
      fetchParticipants: fetchParticipantsLabel,
      fetchLeaderboard: fetchLeaderboardLabel,
      respondToQuestion: respondToQuestionLabel,
      startQuiz: startQuizLabel,
      endQuiz: endQuizLabel,
      removeUser: removeUserLabel,
    },
  },
} = constants;
function MpQuizPlay() {
  const quizEventsData = useQuizContext() || {};
  const { data: { data: participants = [], status: { success, message } = {} } = {} } =
    quizEventsData[fetchParticipantsLabel] || {};
  return (
    <>
      <p>Quiz Lobby</p>
      {message}
      {participants.map((participant) => (
        <p>{participant.lobby_user__first_name}</p>
      ))}
    </>
  );
}
export default MpQuizPlay;
