/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Slide, Modal, Avatar } from '@material-ui/core';
import { useQuizContext, constants, useQuizUitilityContext } from '../mp-quiz-providers';
import Background from './mp-quiz-components/leaderboard/assets/quiz_background.svg';
import './styles/home.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
  // return <Fade direction='in' ref={ref} {...props} />
});
// const {
//   socketContants: {
//     eventLabels: {
//       joinLobby: joinLobbyLabel,
//       fetchParticipants: fetchParticipantsLabel,
//       fetchLeaderboard: fetchLeaderboardLabel,
//       respondToQuestion: respondToQuestionLabel,
//       startQuiz: startQuizLabel,
//       endQuiz: endQuizLabel,
//       removeUser: removeUserLabel,
//     },
//   },
// } = constants;
// {message}
//       {participants.map((participant) => (
//         <p>{participant.lobby_user__first_name}</p>
//       ))}
// const quizEventsData = useQuizContext() || {};
// const { data: { data: participants = [], status: { success, message } = {} } = {} } =
//   quizEventsData[fetchParticipantsLabel] || {};

function MpQuizPlay() {
  const { isMuted, toggleMute, defaultBgmUrl, pickRandomBgm } =
    useQuizUitilityContext() || {};
  const { isQuizStarted, isQuizEnded, getCurrentPlayerInfo } = useQuizContext() || {};
  const bgmUrl = pickRandomBgm('game');
  console.log(getCurrentPlayerInfo(), 'getCurrentPlayerInfo');
  return (
    <>
      <p>MpQuizPlay</p>
      <div>
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
              'volume__controller',
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
              this.getTopBarContent()
            </div>
            <div
              className={isQuizStarted ? 'Quiz-play-contentdiv' : 'Quiz-lobby-contentdiv'}
            >
              this.getContainerContent()
            </div>
          </div>
          {/* {this.state.showSettingsModal ? this.renderProfileSettings() : ''} */}
        </Dialog>
      </div>
    </>
  );
}
export default MpQuizPlay;
