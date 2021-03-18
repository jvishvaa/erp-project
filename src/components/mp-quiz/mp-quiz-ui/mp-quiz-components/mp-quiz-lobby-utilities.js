import React from 'react';
import { Modal, Avatar } from '@material-ui/core';
import LinkTag from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {
  useQuizContext,
  useQuizEventTriggers,
  constants,
  useQuizUitilityContext,
  useSocket,
  useQuizQuesContext,
} from '../../mp-quiz-providers';

import CurrentScore, {
  ParticipantCount,
  QuizTimer,
  QuestionCount,
  CurrentRank,
} from './leaderboard/LeaderBoardUtility';

import StudentDetails from './leaderboard/StudentDetails';
import PostQuizLeaderboard from './leaderboard/PostQuiz/PostQuizLeaderboard';
import HostPostQuizReport from './leaderboard/HostPostQuizReport/HostPostQuizReport';
import QuestionHandlerHome from './mp-quiz-question-handler';

import { FullScreenConstructor } from '../../mp-quiz-utils';

const {
  socketContants: {
    eventLabels: {
      fetchParticipants: fetchParticipantsLabel,
      fetchLeaderboard: fetchLeaderboardLabel,
    },
  },
} = constants;

export function GetErrorMsgC({ label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h5>Please wait...The connection was interrupted</h5>

      <h6>
        If you see this error for long, please&nbsp;
        <LinkTag
          component='button'
          // Include a function to auto report
          // with compoent ws_ state vars route and user.
          onClick={() => {
            window.location.reload();
          }}
        >
          <b>Click here to reload_</b>
        </LinkTag>
      </h6>
      <p>
        <small>{label}</small>
      </p>
    </div>
  );
}

export function ClearOrPauseBtn(props) {
  const socket = useSocket();
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
          socket.close();
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
  const { endQuizTrigger } = useQuizEventTriggers();
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
            endQuizTrigger();
          }
        }}
      >
        End Quiz
      </button>
    </>
  );
}

export function getDurationCounter(props) {
  const counterDuration = 3;
  const questionAnimDuration = 1;
  const lbDuration = 5;
  const questionOptionduration = 2.5;
  const memeDuration = 5;
  /*
   * This duration module to be refactored.
   */

  const {
    quizDetails,
    getCurrentPlayerInfo,
    timeToRender: timeToRenderFromQuesContext,
  } = props;

  const {
    duration: durationInMin = 0,
    started_at: startedAt,
    total_no_of_questions: totalNoOfQuestions = 0,
  } = quizDetails || {};
  const durationInSec = durationInMin * 60;
  const [currentUserId, currentPlayerObj] = getCurrentPlayerInfo();
  const { joined_at: joinedAt } = currentPlayerObj;

  let passedDuration = 0;
  const sagDuration =
    questionAnimDuration + questionOptionduration + lbDuration + memeDuration;
  let quizDuration;
  let quizStartedAt;
  let startImmediately;
  const onZerothChckP = () => {
    if (props.isHost) {
      props.endQuizTrigger();
    }
  };
  let timeToRender;
  // remove below statement to handle indepdent times in next release.
  const isHost = true;
  // logic to run counter equally
  if (isHost === true) {
    quizDuration = durationInSec + totalNoOfQuestions * sagDuration + counterDuration;
    quizStartedAt = startedAt;
    startImmediately = !!(startedAt && startedAt !== 'None');
    timeToRender = startImmediately ? 'render_question' : undefined;
  } else if (isHost === false) {
    quizDuration = durationInSec;
    quizStartedAt = joinedAt;
    startImmediately = false;
  }
  if (quizStartedAt !== 'None') {
    try {
      quizStartedAt = new Date(quizStartedAt);
      const epochStartedAt = quizStartedAt.getTime();
      if (Number.isNaN(epochStartedAt)) {
        // eslint-disable-next-line no-throw-literal
        throw 'Invalid time fomat';
      }
      const epochNow = new Date().getTime();
      passedDuration = epochNow - epochStartedAt;
      passedDuration /= 1000;
    } catch (e) {
      passedDuration = 0;
    }
  }
  const timeLeft = quizDuration - passedDuration;
  // const { timerAction } = this.state; Please handle this
  return {
    onZerothChckP,
    startImmediately,
    duration: timeLeft,
    timerAction: undefined,
    startedAt,
    timeToRender,
  };
}

function GetAvatar({ url = '', firstName = '' }) {
  const { openSettingsModal } = useQuizUitilityContext || {};
  url =
    'https://omrsheet.s3.ap-south-1.amazonaws.com/media/user_profile/download_wchd7Wo.png'; // Please handle
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
  const { endQuizTrigger } = useQuizEventTriggers();
  const {
    isHost,
    getCurrentPlayerInfo,
    [fetchParticipantsLabel]: { data: { data: participants = [] } = {} } = {},
    [fetchLeaderboardLabel]: { data: { data: leaderboardData = [] } = {} } = {},
    quiz_details: { data: { data: quizDetails = {} } = {} } = {},
  } = useQuizContext() || {};
  const [currentUserId, currentPlayerObj] = getCurrentPlayerInfo();
  const { total_score: totalScore, rank } = currentPlayerObj || {};
  const {
    timeToRenderControls: { timeToRender } = {},
    controls: { currentQuesionIndex = 0 } = {},
  } = useQuizQuesContext();
  const { total_no_of_questions: totQestionCount = 0 } = quizDetails || {};
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
            <QuizTimer
              {...getDurationCounter({
                quizDetails,
                isHost,
                getCurrentPlayerInfo,
                endQuizTrigger,
                timeToRender,
              })}
            />
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

  const { removeUserTrigger, startQuizTrigger } = useQuizEventTriggers();
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
  const participantsArray = (participants || []).map((item) => ({
    ...item,
    name: item.first_name,
  }));
  const { avatar = '' } =
    participantsArray.find((participant) => participant.user_id === currentUserId) || {};

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
          onClick={() => {
            startQuizTrigger();
          }}
        >
          Start Quiz
        </button>
      ) : (
        <GetAvatar avatar={avatar} firstName={firstName} />
      )}

      <div className='lobby__participants'>
        {participants.length
          ? participantsArray.map((participant) => {
              const removeUserFunc = () => {
                // eslint-disable-next-line no-alert
                const confirmed = window.confirm('Remove user?');
                if (confirmed) {
                  removeUserTrigger(participant.user_id);
                }
              };
              return (
                <div>
                  <StudentDetails
                    isHost={isHost}
                    currentUserId={currentUserId}
                    {...participant}
                    name={participant.first_name}
                    removeUser={isHost ? removeUserFunc : false}
                  />
                </div>
              );
            })
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

export function JoineeQuizContainerContent() {
  // const { isMuted } = this.state
  // const wbData = {}
  // Object.keys(this.props).filter(key => key.includes('wb_')).forEach(keyName => {
  //   wbData[keyName] = this.props[keyName]
  // })
  return (
    <>
      <RenderUtilityContent showUtilities />
      {/* <QuestionHandler
        onlineClassId={this.props.onlineClassId}
        websocket={this.props.websocket}
        {...wbData}
        updateStateToParent={(data = {}) => {
          this.updateChildParamToState('__questionData', data)
        }}
        bgms={this.props.bgms}
        isMuted={isMuted}
      /> */}
      <QuestionHandlerHome />
      {/* <div>
        <p>Question handler comp comes here</p>
      </div> */}
    </>
  );
}
export function HostAndQuizEnded(props) {
  const {
    // isQuizStarted,
    // isQuizEnded,
    // isHost,
    // getCurrentPlayerInfo,
    // [fetchParticipantsLabel]: { data: { data: participants = [] } = {} } = {},
    [fetchLeaderboardLabel]: {
      data: { data: leaderboardData = [], quiz_summary: quizSummary = {} } = {},
    } = {},
  } = useQuizContext() || {};
  return (
    <>
      <RenderUtilityContent showUtilities={false} />
      <div className='studentpostquiz__leaderboard--container'>
        <h2 className='leaderboard__title--host'>Quiz Ended..</h2>
        <div className='quiz__results--container'>
          <HostPostQuizReport
            onlineClassId={props.onlineClassId}
            leaders={leaderboardData}
            quizSummary={quizSummary}
          />
        </div>
      </div>
    </>
  );
}
export function JoineeAndQuizHasFinishedOrEnded(props) {
  const {
    // isQuizStarted,
    isQuizEnded,
    // isHost,
    getCurrentPlayerInfo,
    // [fetchParticipantsLabel]: { data: { data: participants = [] } = {} } = {},
    [fetchLeaderboardLabel]: { data: { data: leaderboardData = [] } = {} } = {},
    quiz_details: { data: { data: quizDetails = {} } = {} } = {},
  } = useQuizContext() || {};
  const [currentUserId, currentPlayerObj] = getCurrentPlayerInfo();
  return (
    <>
      <RenderUtilityContent showUtilities={false} />
      <PostQuizLeaderboard
        leaderboardData={leaderboardData}
        quizDetails={quizDetails}
        currentPlayerObj={currentPlayerObj}
        isQuizEnded={isQuizEnded}
        onlineClassId={props.onlineClassId}
      />
    </>
  );
}
