/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Slide } from '@material-ui/core';

import { useQuizContext, constants, useQuizUitilityContext } from '../mp-quiz-providers';

import {
  GetErrorMsgC,
  HostAndQuizEnded,
  JoineeAndQuizHasFinishedOrEnded,
  HostLobbyContainerContent,
  JoineeLobbyContainerContent,
  HostQuizContainerContent,
  JoineeQuizContainerContent,
} from './mp-quiz-components/mp-quiz-lobby-utilities';

import Background from './mp-quiz-components/leaderboard/assets/quiz_background.svg';
import './styles/home.css';

const {
  socketContants: {
    eventLabels: {
      joinLobby: joinLobbyLabel,
      // fetchParticipants: fetchParticipantsLabel,
      // fetchLeaderboard: fetchLeaderboardLabel,
      // respondToQuestion: respondToQuestionLabel,
      // startQuiz: startQuizLabel,
      // endQuiz: endQuizLabel,
      // removeUser: removeUserLabel,
    },
  },
} = constants;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
  // return <Fade direction='in' ref={ref} {...props} />
});

function MpQuizPlay({ params }) {
  const { isMuted, toggleMute, defaultBgmUrl, pickRandomBgm } =
    useQuizUitilityContext() || {};
  const {
    isHost,
    isQuizStarted,
    isQuizEnded,
    getCurrentPlayerInfo,
    userQuizStatus,

    [joinLobbyLabel]: {
      data: {
        status: {
          // success: joinLobbyStatus,
          message: joinLobbyStatusMessage,
        } = {},
      } = {},
    },
  } = useQuizContext() || {};
  const bgmUrl = pickRandomBgm('game');
  const getTopBarContent = () => null;
  const getContainerContent = () => {
    const [, currentPlayerObj] = getCurrentPlayerInfo();
    const { has_finished: hasFinished } = currentPlayerObj || {};
    if (isHost === undefined) {
      return <GetErrorMsgC label='ref error code (e.u-stat:undefined)' />;
    }
    if (isQuizStarted === undefined) {
      return <GetErrorMsgC showOnlyLabel label={`${joinLobbyStatusMessage}`} />;
    }
    if (isQuizEnded && isHost) {
      return <HostAndQuizEnded params={params} />;
    }
    if ((hasFinished || isQuizEnded) && !isHost) {
      return <JoineeAndQuizHasFinishedOrEnded params={params} />;
    }
    // const userType = isHost ? 'HOST' : 'JOINEE'
    // const quizStatus = isQuizStarted ? 'QUIZ' : 'LOBBY'
    const DECIDE = {
      HOST_LOBBY: HostLobbyContainerContent,
      JOINEE_LOBBY: JoineeLobbyContainerContent,
      HOST_QUIZ: HostQuizContainerContent,
      JOINEE_QUIZ: JoineeQuizContainerContent,
    };
    // return DECIDE[userQuizStatus]();
    const JsxElement = DECIDE[userQuizStatus]
    return <JsxElement params={params} />;
  };
  return (
    <>
      {isMuted ? null : (
        <audio
          // ref={this.myRef}
          // style={{ visibility: 'hidden' }}
          id={bgmUrl}
          autoPlay
          loop
          src={bgmUrl || defaultBgmUrl}
          controls
        />
      )}
      <Dialog fullScreen open TransitionComponent={Transition}>
        <img
          className={[
            isQuizEnded ? 'volume__controller--ended' : 'volume__controller',
            !isMuted ? 'quiz__volume--mute' : 'quiz__volume--unmute',
          ].join(' ')}
          onClick={toggleMute}
          alt='img'
        />
        <div
          className='Quiz-home'
          style={{
            backgroundColor: 'black',
            backgroundImage: isQuizEnded
              ? `url(${Background})`
              : `linear-gradient(to right, rgba(8,30,47, 0.8), rgba(8,30,47,0.8)),url(${Background})`,
          }}
        >
          <img
            className={[
              'quiz__background',
              isQuizEnded ? 'quiz__background--ended' : 'quiz__background--started',
            ].join(' ')}
            alt='img'
          />
          <div className='Quiz-lobby-topbar actions-wrapper in-quiz'>
            {getTopBarContent()}
          </div>
          <div
            className={isQuizStarted ? 'Quiz-play-contentdiv' : 'Quiz-lobby-contentdiv'}
          >
            {getContainerContent()}
          </div>
        </div>
        {/* {this.state.showSettingsModal ? this.renderProfileSettings() : ''} */}
      </Dialog>
    </>
  );
}
export default MpQuizPlay;
