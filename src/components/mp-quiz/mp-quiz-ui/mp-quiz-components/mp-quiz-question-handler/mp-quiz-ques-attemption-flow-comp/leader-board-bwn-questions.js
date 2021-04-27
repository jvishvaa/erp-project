import React from 'react';
import {
  useQuizContext,
  constants,
  useQuizUitilityContext,
} from '../../../../mp-quiz-providers';

import OrderedList from '../../leaderboard/OrderedList';

const {
  socketContants: {
    eventLabels: { fetchLeaderboard: fetchLeaderboardLabel },
  },
} = constants;

export default function Leaderboard() {
  const { [fetchLeaderboardLabel]: { data: { data: leaderboardData = [] } = {} } = {} } =
    useQuizContext() || {};
  const { getBgmAudioTag } = useQuizUitilityContext();
  return (
    <>
      {getBgmAudioTag('leaderboard')}
      <div className='host__quiz--container host__quiz--container--withscroll'>
        <OrderedList leaders={leaderboardData} />
      </div>
    </>
  );
}
