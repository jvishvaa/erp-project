import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSocket } from '../socket-providers';
import constants from '../mp-quiz-constants';

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

export const QuizContext = React.createContext();

/*
  dataVariable format
  {
      event:"join_lobby",
    data:{data message},
    status: {success: false or true,message: "" }
    prev: {
              event:"join_lobby",
              data:{data message},
              status: {success: false or true,message: "" }
      },
  }
  
*/
// let { data: { meme_details: memeUrl = null } = {}, updatedAt } = this.retrieveWSDataFromProps(respondToQuestion)
export function QuizContextProvider({ children }) {
  const socket = useSocket();

  const [quizDetails, setQuizDetails] = React.useState();
  const [joinLobby, setJoinLobby] = React.useState();
  const [participants, setParticipants] = React.useState();
  const [leaderboard, setLeaderboard] = React.useState();
  const [respondToQuestion, setRespondToQuestion] = React.useState();
  const [startQuiz, setStartQuiz] = React.useState();
  const [endQuiz, setEndQuiz] = React.useState();
  const [removeUser, setRemoveUser] = React.useState();

  const eventDataSetConfig = {
    quiz_details: { data: { data: quizDetails }, setData: setQuizDetails },
    [joinLobbyLabel]: { data: joinLobby, setData: setJoinLobby },
    [fetchParticipantsLabel]: { data: participants, setData: setParticipants },
    [fetchLeaderboardLabel]: { data: leaderboard, setData: setLeaderboard },
    [respondToQuestionLabel]: { data: respondToQuestion, setData: setRespondToQuestion },
    [startQuizLabel]: { data: startQuiz, setData: setStartQuiz },
    [endQuizLabel]: { data: endQuiz, setData: setEndQuiz },
    [removeUserLabel]: { data: removeUser, setData: setRemoveUser },
  };

  useEffect(() => {
    if (socket.connection) {
      socket.connection.onmessage = (evt) => {
        const json = JSON.parse(evt.data);
        // eslint-disable-next-line no-use-before-define
        eventDataHandler(json.event, json);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  function handleUserRemoval() {
    const {
      data: { user_id: removedUserId },
    } = removeUser || {};
    const { data: { user_id: currentUserId, is_participant: isParticipant } = {} } =
      joinLobby || {};
    if (removedUserId === currentUserId && isParticipant) {
      socket.close();
    }
  }
  function eventDataHandler(eventName, eventMessageData) {
    const { event: eventLabel } = eventMessageData || {};
    const { data, setData = () => {} } = eventDataSetConfig[eventLabel] || {};
    const variableData = {
      ...eventMessageData,
      updatedAt: new Date().getTime(),
      prev: { ...(data || {}) },
    };
    setData(variableData);
    console.log({variableData})
    const { quiz_details: quizDetailsData = {} } = eventMessageData || {};
    // const { is_started: isQuizStarted, is_ended: isQuizEnded } = quizDetailsData;
    // quizDetailsData.started_at = new Date(new Date().getTime() - 1000);
    // quizDetailsData.is_started = true;
    // quizDetailsData.duration = 20; // please handle
    setQuizDetails(quizDetailsData);
  }

  function getCurrentPlayerInfo() {
    const { currentUserId } = getUserAndQuizInfoStatus();
    const { data: leaderBoardArray = [] } = leaderboard || {};
    console.log({leaderBoardArray})
    const tempArray = (leaderBoardArray || []).filter(
      (playerObj) => String(playerObj.user_id) === String(currentUserId)
    );
    let playerObj = {};
    if (tempArray.length === 1) {
      playerObj = tempArray[0];
    } else {
      playerObj = { first_name: 'Un identified user' };
    }
    return [currentUserId, playerObj];
  }
  useEffect(() => {
    if (removeUser) {
      handleUserRemoval();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeUser]);
  useEffect(() => {
    if (joinLobby) {
      const { status: { success, message } = {} } = joinLobby || {};
      if (!success) {
        // eslint-disable-next-line no-alert
        // window.alert(`${message}`);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinLobby]);

  function getUserAndQuizInfoStatus() {
    const { is_started: isQuizStarted, is_ended: isQuizEnded } = quizDetails || {};
    const {
      data: {
        is_host: isHost,
        is_participant: isParticipant,
        // user_id: currentUserId,
        user_id: currentUserDetails = {},
      } = {},
    } = joinLobby || {};
    const { user_id:currentUserId } = currentUserDetails || {};
    const userType = isHost ? 'HOST' : 'JOINEE';
    const quizStatus = isQuizStarted ? 'QUIZ' : 'LOBBY';
    return {
      isQuizStarted,
      isQuizEnded,
      currentUserId,
      isHost,
      isParticipant,
      userType,
      quizStatus,
      userQuizStatus: `${userType}_${quizStatus}`,
    };
  }
  return (
    <QuizContext.Provider
      value={{
        ...eventDataSetConfig,
        // isQuizStarted,
        // isQuizEnded,
        // currentUserId,
        // isHost,
        // isParticipant,
        // userType,
        // quizStatus,
        // userQuizStatus: `${userType}_${quizStatus}`,
        ...getUserAndQuizInfoStatus(),
        getCurrentPlayerInfo,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

QuizContextProvider.propTypes = {
  children: PropTypes.node,
};

QuizContextProvider.defaultProps = {
  children: 'No child element passed to QuizContextProvider',
};

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useContext must be used within a QuizContextProvider');
  }
  return context;
}
