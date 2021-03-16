import React from 'react';
import PropTypes from 'prop-types';

import constants from '../mp-quiz-constants';
import { useFetcher } from '../../mp-quiz-utils';

const {
  urls: { fetchQuizBgms: fetchQuizBgmsAPIEndpoint, ajaxHeaders, ajaxBase },
} = constants || {};

const QuizUtilityContext = React.createContext();

export function QuizUtilityContextProvider({ children }) {
  const [isMuted, setMutedTo] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  function openSettingsModal() {
    setShowSettingsModal(true);
  }
  function closeSettingsModal() {
    setShowSettingsModal(false);
  }

  function toggleMute() {
    setMutedTo(!isMuted);
  }
  const bgmsHookProps = {
    url: ajaxBase + fetchQuizBgmsAPIEndpoint,
    dataType: 'object',
    defaultQueryParamObj: {},
    fetchOnLoad: true,
    includeAuthtoken: true,
    isCentral: true,
    APIDataKeyName: 'result',
    headers: ajaxHeaders,
  };
  const [bgms, fetchBgmsHook] = useFetcher(bgmsHookProps);

  function fetchBgms() {
    fetchBgmsHook();
  }

  function isPageReloaded() {
    if (window.performance) {
      if (window.performance.navigation.type === 1) {
        return true;
      }
      return false;
    }
    return false;
  }

  React.useEffect(() => {
    if (isPageReloaded()) {
      setMutedTo(true);
    }
  }, []);
  function pickRandomBgm(variant) {
    const { [variant]: bgmsArray = [] } = bgms || {};
    if (bgmsArray.length) {
      const item = bgmsArray[Math.floor(Math.random() * bgmsArray.length)];
      const { url: bgmSrc } = item;
      return bgmSrc;
    }
    return false;
  }

  return (
    <QuizUtilityContext.Provider
      value={{
        isPageReloaded,
        isMuted,
        toggleMute,
        bgms,
        defaultBgmUrl:
          'https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/media/multiplayer_quiz/music/entire_game_tune_2_speed_up_a_little_game.mp3',
        fetchBgms,
        pickRandomBgm,

        openSettingsModal,
        closeSettingsModal,
        showSettingsModal,
      }}
    >
      {children}
    </QuizUtilityContext.Provider>
  );
}

QuizUtilityContextProvider.propTypes = {
  children: PropTypes.node,
};

QuizUtilityContextProvider.defaultProps = {
  children: 'No child element passed to QuizUtilityContextProvider',
};

export function useQuizUitilityContext() {
  const context = React.useContext(QuizUtilityContext);
  if (context === undefined) {
    throw new Error(
      'useQuizUitilityContext must be used within a QuizUtilityContextProvider'
    );
  }
  return context;
}
