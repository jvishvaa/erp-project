import React from 'react';
import {
  //   useQuizQuesContext,
  useQuizContext,
  constants,
} from '../../../mp-quiz-providers';

import OrderedList from '../leaderboard/OrderedList';

const {
  socketContants: {
    eventLabels: {
      // joinLobby: joinLobbyLabel,
      // fetchParticipants: fetchParticipantsLabel,
      fetchLeaderboard: fetchLeaderboardLabel,
      //   respondToQuestion: respondToQuestionLabel,
      // startQuiz: startQuizLabel,
      // endQuiz: endQuizLabel,
      // removeUser: removeUserLabel,
    },
  },
} = constants;

export default function Leaderboard() {
  const {
    // isQuizStarted,
    // isQuizEnded,
    // isHost,
    // getCurrentPlayerInfo,
    // [fetchParticipantsLabel]: { data: { data: participants = [] } = {} } = {},
    [fetchLeaderboardLabel]: { data: { data: leaderboardData = [] } = {} } = {},
    // quiz_details: { data: { data: quizDetails = {} } = {} } = {},
  } = useQuizContext() || {};
  //   const { fetchLeaderboard } = eventLabels;
  //   const { data: leaderboardData = [] } =
  // this.retrieveWSDataFromProps(fetchLeaderboard) || {};

  //   const { activeStep, lbDuration } = this.state;
  // {/* <h1>student q to q leaderBoard comes here</h1> */}
  // const seconds = Math.round(Math.ceil(timerObj.getTime() / 1000))
  // const percentile = (timerObj.getTime() / lbDuration) * 100
  const getBgm = () => {};
  return (
    <>
      {getBgm('leaderboard')}
      <div className='host__quiz--container host__quiz--container--withscroll'>
        <OrderedList leaders={leaderboardData} />
      </div>
    </>
  );
}
