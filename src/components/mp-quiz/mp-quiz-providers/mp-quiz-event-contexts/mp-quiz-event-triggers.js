import React from 'react';
import PropTypes from 'prop-types';
import { useSocket } from '../socket-providers';
import constants from '../mp-quiz-constants';

const {
  socketContants: { eventLabels },
} = constants;

export const QuizEventTriggers = React.createContext();

export function QuizEventTriggersProvider({ children }) {
  const socket = useSocket();
  function sendMessage(message = {}) {
    if (!socket) {
      // eslint-disable-next-line no-alert
      window.alert(`socket instance sent as ${typeof socket}`);
      return;
    }
    try {
      socket.trigger(message.event, message); // send data to the server
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error); // catch error
    }
  }
  function startQuizTrigger() {
    /*
    {
      "event": "start_quiz"
      "started_at": <django format timestamp>
    }
    */
    const { startQuiz } = eventLabels;
    const message = { event: startQuiz, started_at: new Date() };
    sendMessage(message);
  }

  function endQuizTrigger() {
    /*
      {
        "event": "end_quiz"
        "ended_at": <django format timestamp>
      }
    */
    const { endQuiz } = eventLabels;
    const message = { event: endQuiz, ended_at: new Date() };
    sendMessage(message);
  }
  function removeUserTrigger(userId) {
    if (!userId) return;
    /*
      {
        "event": "remove_user"
        "user_id": <121>
      }
    */
    const { removeUser } = eventLabels;
    const message = { event: removeUser, user_id: userId };
    sendMessage(message);
  }
  function postQuesReponseTrigger(dataObj) {
    /*
    {
      event: 'respond_to_question',
      response:{
        attempted_ans: 0,
        duration: 2.5199999809265137,
        end_time: 1589295572.455,
        id: 37134,
        start_time: 1589295569.935,
        score: 800,
        is_quiz_over: true // true on last question else false.
      }
    }
    */
    const { respondToQuestion } = eventLabels;
    const message = { event: respondToQuestion, response: dataObj };
    sendMessage(message);
  }

  function triggerFetchParticipants() {
    const { fetchParticipants } = eventLabels;
    const message = { event: fetchParticipants };
    sendMessage(message);
  }
  return (
    <QuizEventTriggers.Provider
      value={{
        startQuizTrigger,
        endQuizTrigger,
        removeUserTrigger,
        postQuesReponseTrigger,
        triggerFetchParticipants,
      }}
    >
      {children}
    </QuizEventTriggers.Provider>
  );
}

QuizEventTriggersProvider.propTypes = {
  children: PropTypes.node,
};

QuizEventTriggersProvider.defaultProps = {
  children: 'No child element passed to QuizEventTriggersProvider',
};

export function useQuizEventTriggers() {
  const context = React.useContext(QuizEventTriggers);
  if (context === undefined) {
    throw new Error('useContext must be used within a QuizEventTriggersProvider');
  }
  return context;
}
