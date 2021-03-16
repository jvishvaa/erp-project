import React from 'react';
import { Slide, Modal, Avatar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import {
  useQuizContext,
  constants,
  useQuizUitilityContext,
} from '../../mp-quiz-providers';
import CurrentScore, {
  ParticipantCount,
  //   QuizTimer,
  QuestionCount,
  CurrentRank,
} from './leaderboard/LeaderBoardUtility';

import StudentDetails from './leaderboard/StudentDetails';
import PostQuizLeaderboard from './leaderboard/PostQuiz/PostQuizLeaderboard';
import { FullScreenConstructor } from '../../mp-quiz-utils';

const {
  socketContants: {
    eventLabels: {
      fetchParticipants: fetchParticipantsLabel,
      fetchLeaderboard: fetchLeaderboardLabel,
    },
  },
} = constants;

export function ClearOrPauseBtn(props) {
  return (
    <IconButton
      className='topbar-btn btn__close--websocket'
      aria-label='upload picture'
      component='span'
      // onClick={() => { this.props.websocket.close() }}
      onClick={() => {
        // eslint-disable-next-line no-alert
        const confirmed = window.confirm('Are you sure you want to exit from this quiz?');
        if (confirmed) {
          props.quitQuiz();
          // this.props.history.p
        }
      }}
    >
      <ClearIcon className='topbar-btn-icon' />
    </IconButton>
  );
}

export function FullScreenBtn() {
  const [fSActivated, setFsActivated] = React.useState(false);
  /* Full screen handler */
  const fSHandler = new FullScreenConstructor((fSActivated, csrObj) => {
    /*
          updating variable in state on change of screen (full screen) to update btn icons accordingly
        */
    // this.setState({ fSActivated })
    setFsActivated(fSActivated);
  });
  return (
    <>
      {fSHandler.fullscreenEnabled ? (
        <IconButton
          className='topbar-btn btn__fullscreen--quiz'
          aria-label='upload picture'
          component='span'
          style={{ zIndex: 9999 }}
          onClick={() => {
            if (fSActivated) {
              fSHandler.exitFullscreen();
            } else {
              fSHandler.requestFullscreen();
            }
          }}
        >
          {fSActivated ? (
            <FullscreenExitIcon className='topbar-btn-icon' />
          ) : (
            <FullscreenIcon className='topbar-btn-icon' />
          )}
        </IconButton>
      ) : null}
    </>
  );
}

export function HostQuizTopBarContent() {
  // return <p>Host quiz topbar cnt</p>
  return (
    <>
      <button
        type='button'
        className='btn__end--quiz'
        onClick={() => {
          // eslint-disable-next-line no-alert
          const ifYes = window.confirm('Are you sure on your action?');
          if (ifYes) {
            // endQuizTrigger(this.props.websocket);
          }
        }}
      >
        End Quiz
      </button>
    </>
  );
}

// export function getDurationCounter() {
//   const counterDuration = 3;
//   const questionAnimDuration = 1;
//   const lbDuration = 5;
//   const questionOptionduration = 2.5;
//   const memeDuration = 5;
//   /*
//    * This duration module to be refactored.
//    */
//   // let { wb_quiz_details: quizDetails = {} } = this.props

//   const {
//     quiz_details: { data: { data: quizDetails = {} } = {} } = {},
//     isHost,
//     getCurrentPlayerInfo,
//   } = useQuizContext();

//   const {
//     duration: durationInMin = 0,
//     started_at: startedAt,
//     total_no_of_questions: totalNoOfQuestions = 0,
//   } = quizDetails || {};
//   const durationInSec = durationInMin * 60;
//   const [currentUserId, currentPlayerObj] = getCurrentPlayerInfo();
//   const { joined_at: joinedAt } = currentPlayerObj;
//   // let { isHost } = this.props
//   const { __questionData } = this.state;
//   let {
//     // activeStep: currentQuesionIndex = 0,
//     timeToRender,
//   } = __questionData || {};
//   let passedDuration = 0;
//   const sagDuration =
//     questionAnimDuration + questionOptionduration + lbDuration + memeDuration;
//   let quizDuration;
//   let quizStartedAt;
//   let startImmediately;
//   const onZerothChckP = () => {};

//   // remove below statement to handle indepdent times in next release.
//   isHost = true;
//   // logic to run counter equally
//   if (isHost === true) {
//     quizDuration = durationInSec + totalNoOfQuestions * sagDuration + counterDuration;
//     quizStartedAt = startedAt;
//     startImmediately = !!(startedAt && startedAt !== 'None');
//     timeToRender = startImmediately ? 'render_question' : undefined;
//   } else if (isHost === false) {
//     quizDuration = durationInSec;
//     quizStartedAt = joinedAt;
//     startImmediately = false;
//   }
//   console.log(quizDuration, startedAt, currentUserId);
//   if (quizStartedAt !== 'None') {
//     try {
//       quizStartedAt = new Date(quizStartedAt);
//       const epochStartedAt = quizStartedAt.getTime();
//       if (isNaN(epochStartedAt)) {
//         // eslint-disable-next-line no-throw-literal
//         throw 'Invalid time fomat';
//       }
//       const epochNow = new Date().getTime();
//       passedDuration = epochNow - epochStartedAt;
//       passedDuration /= 1000;
//     } catch (e) {
//       passedDuration = 0;
//     }
//   }
//   const timeLeft = quizDuration - passedDuration;
//   const { timerAction } = this.state;
//   return {
//     onZerothChckP,
//     startImmediately,
//     duration: timeLeft,
//     timerAction,
//     startedAt,
//     timeToRender,
//   };
// }

function GetAvatar({ url = '', firstName = '' }) {
  const { openSettingsModal } = useQuizUitilityContext || {};

  if (url) {
    return (
      <Avatar
        onClick={openSettingsModal}
        src={url}
        alt='Select Avatar'
        className='avatar__select'
      >
        H
      </Avatar>
    );
  }
  return (
    <Avatar onClick={openSettingsModal} alt='Select Avatar' className='avatar__select'>
      {firstName.charAt(0)}
    </Avatar>
  );
}

export function RenderProfileSettings() {
  const { showSettingsModal, closeSettingsModal } = useQuizUitilityContext || {};
  return (
    <Modal open={showSettingsModal} onClose={closeSettingsModal}>
      <div className='avatar__modal'>
        <CancelIcon className='close__icon' onClick={closeSettingsModal} />
        {/* <ChangeAvatar socket={this.props.websocket} alert={this.props.alert} modalStatus={closeSettingsModal} /> */}
        <p>Interface to update avatart</p>
      </div>
    </Modal>
  );
}

export function RenderUtilityContent({ showUtilities }) {
  // const { data: { data: participants = [], status: { success, message } = {} } = {} } =
  //   quizEventsData[fetchParticipantsLabel] || {};

  const {
    // isQuizStarted,
    // isQuizEnded,
    isHost,
    getCurrentPlayerInfo,
    [fetchParticipantsLabel]: { data: { data: participants = [] } = {} } = {},
    [fetchLeaderboardLabel]: { data: { data: leaderboardData = [] } = {} } = {},
  } = useQuizContext() || {};
  const [currentUserId, currentPlayerObj] = getCurrentPlayerInfo();
  const { total_score: totalScore, rank } = currentPlayerObj || {};
  const { __questionData } = {};
  const {
    activeStep: currentQuesionIndex = 0,
    questionData: { questionCount: totQestionCount = 0 } = {},
  } = __questionData || {};
  return (
    <div className='quiz__topbar--container'>
      <ClearOrPauseBtn />
      <FullScreenBtn />
      {showUtilities ? (
        <>
          <span className='quiz__topbar--questioncount'>
            {isHost ? (
              <HostQuizTopBarContent />
            ) : (
              <QuestionCount
                currentQuestion={currentQuesionIndex + 1}
                totalQuestions={totQestionCount}
              />
            )}
          </span>
          <span className='quiz__topbar--timer'>
            {/* <QuizTimer {...this.getDurationCounter()} /> */}
            QuizTimer
          </span>
          <span className='quiz__topbar--participantcount'>
            <ParticipantCount participantsCount={participants.length} />
          </span>
          <span className='quiz__topbar--currentrank'>
            {isHost ? (
              <div className='paricipant__attended--count'>
                {`${leaderboardData.filter((item) => item.has_finished).length} / ${
                  leaderboardData.length
                } done`}
              </div>
            ) : (
              <CurrentRank rank={rank} />
            )}
          </span>
          <span className='quiz__topbar--currentscore'>
            {!isHost ? <CurrentScore score={totalScore} /> : ''}
          </span>
        </>
      ) : null}
    </div>
  );
}

export function HostLobbyContainerContent() {
  // const { isHost } = props;
  return (
    <>
      <RenderUtilityContent showUtilities />
      {/* {this.renderUtlityContent(true)} */}
      {/* {this.getLobbyParticipantsContainer(isHost)} */}
      <LobbyParticipantsContainer />
    </>
  );
}
export function JoineeLobbyContainerContent() {
  // const { isHost } = props;
  return (
    <>
      {/* {this.renderUtlityContent(true)} */}
      <RenderUtilityContent showUtilities />
      {/* {this.getLobbyParticipantsContainer(isHost)} */}
      <LobbyParticipantsContainer />
    </>
  );
}

export function LobbyParticipantsContainer() {
  // const { data: { user_id: currentUserId } = {} } = this.retrieveWSDataFromProps(joinLobby)
  // console.log(currentUserId)
  // const { user_id: userId, first_name: firstName } = this.state.personalInfo
  // let { data: participants = [] } = this.retrieveWSDataFromProps(fetchParticipants)
  // participants = participants.map(item => ({ ...item, name: item.first_name }))
  // const { avatar = '' } = participants.find(participant => participant.user_id === userId) || {}

  const {
    // isQuizStarted,
    // isQuizEnded,
    isHost,
    getCurrentPlayerInfo,
    [fetchParticipantsLabel]: { data: { data: participants = [] } = {} } = {},
    // [fetchLeaderboardLabel]: { data: { data: leaderboardData = [] } = {} } = {},
  } = useQuizContext() || {};
  const [currentUserId, currentPlayerObj] = getCurrentPlayerInfo();
  const { firstName = 'mp-quiz-lobby-utilities.js line:217' } = currentPlayerObj || {};
  const participantsArray = participants.map((item) => ({
    ...item,
    name: item.first_name,
  }));
  const { avatar = '' } =
    participantsArray.find((participant) => participant.user_id === currentUserId) || {};
  const removeUser = isHost
    ? {
        removeUser: () => {
          // eslint-disable-next-line no-alert
          const confirmed = window.confirm('Remove user?');
          if (confirmed) {
            // removeUserTrigger(this.props.websocket, participant.user_id);
          }
        },
      }
    : { removeUser: false };
  return (
    <div className='lobby__participants--container'>
      <h2 className='lobby__header--title' style={{ textAlign: 'center' }}>
        {isHost ? 'Waiting for players to join' : 'Waiting for game to begin..'}
      </h2>
      {isHost ? (
        <button
          type='button'
          className='btn__start--quiz'
          variant='contained'
          size='large'
          style={{ backgroundColor: '#27a936' }}
          disabled={!isHost}
          // onClick={() => { startQuizTrigger(this.props.websocket) }}
        >
          Start Quiz
        </button>
      ) : (
        <GetAvatar avatar={avatar} firstName={firstName} />
      )}

      <div className='lobby__participants'>
        {participants.length
          ? participants.map((participant) => (
            <div>
                <StudentDetails
                isHost={isHost}
                removeUser={removeUser}
                {...participant}
              />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export function HostQuizContainerContent() {
  const {
    // isQuizStarted,
    isQuizEnded,
    isHost,
    getCurrentPlayerInfo,
    [fetchParticipantsLabel]: { data: { data: participants = [] } = {} } = {},
    [fetchLeaderboardLabel]: { data: { data: leaderboard = [] } = {} } = {},
    quiz_details: { data: { data: quizDetails = {} } = {} } = {},
  } = useQuizContext() || {};
  const [currentUserId, currentPlayerObj] = getCurrentPlayerInfo();

  // let { isQuizEnded, isHost } = this.props
  // const [currentUserId, currentPlayerObj] = this.getCurrentUserInfo()
  // console.log(currentUserId)
  // let { fetchLeaderboard, fetchParticipants } = eventLabels
  // let { data: leaderboardData = [], quiz_details: quizDetails = {} } = this.retrieveWSDataFromProps(fetchLeaderboard) || {}
  // let { data: participantsData = [] } = this.retrieveWSDataFromProps(fetchParticipants) || {}

  let leaderboardData = leaderboard.length ? leaderboard : participants;
  leaderboardData = leaderboardData.map((item) => ({ ...item, name: item.first_name }));
  return (
    <>
      {/* {this.renderUtlityContent(true)} */}
      <RenderUtilityContent showUtilities />
      <div key='getHostQuizContainerContent' className='host__quiz--container'>
        {/* <OrderedList leaders={leaderboardData} /> */}
        <PostQuizLeaderboard
          leaderboardData={leaderboardData}
          quizDetails={quizDetails}
          currentPlayerObj={currentPlayerObj}
          isQuizEnded={isQuizEnded}
          isHost={isHost}
          // onlineClassId={this.props.onlineClassId}
        />
      </div>
    </>
  );
}
