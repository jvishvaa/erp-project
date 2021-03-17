import React from 'react';
import {
  useQuizQuesContext,
  useQuizContext,
  constants,
} from '../../../mp-quiz-providers';

const {
  socketContants: {
    eventLabels: {
      // joinLobby: joinLobbyLabel,
      // fetchParticipants: fetchParticipantsLabel,
      // fetchLeaderboard: fetchLeaderboardLabel,
      respondToQuestion: respondToQuestionLabel,
      // startQuiz: startQuizLabel,
      // endQuiz: endQuizLabel,
      // removeUser: removeUserLabel,
    },
  },
} = constants;

export default function Meme() {
  const {
    currentQuesionId,
    responsesDataObj,
    // controls: { currentQuesionIndex },
  } = useQuizQuesContext() || {};
  const { [currentQuesionId]: responseObj = {} } = responsesDataObj || {};
  const {
    // answer: attemptedAnswerArray,
    // attemption_status: isAttempted,
    correct: isCorrect,
  } = responseObj || {};

  let {
    [respondToQuestionLabel]: {
      data: { data: { meme_details: memeUrl = null } = {} } = {},
      updatedAt,
    } = {},
  } = useQuizContext() || {};
  const timeNow = new Date().getTime();
  const isLatestMeme = updatedAt - timeNow <= 5000;
  const loaderUrl =
    'https://www.demilked.com/magazine/wp-content/uploads/2016/06/gif-animations-replace-loading-screen-14.gif';
  memeUrl = isLatestMeme ? memeUrl : loaderUrl;
  const getBgm = () => {};
  return (
    <>
      {getBgm('meme')}
      <div className='whole-container grow'>
        <div style={{ margin: 'auto' }}>
          {isCorrect ? (
            <img
              className='meme__image'
              src={
                memeUrl ||
                'https://assets.memedrop.io/memes/qL5XLO0MTOCe54QNSzQhDIdggKqdEd9VIE39E2Aq.gif'
              }
              alt='meme'
            />
          ) : (
            <img
              className='meme__image'
              src={
                memeUrl ||
                'http://julianfrost.co.nz/work/skypeemoticons/images/thumbsdown.gif'
              }
              alt='meme'
            />
          )}
        </div>
      </div>
    </>
  );
}
