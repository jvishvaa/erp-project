import React from 'react';
import PropTypes from 'prop-types';

import constants from '../mp-quiz-constants';
import { useFetcher } from '../../mp-quiz-utils';

const {
  urls: {
    fetchQuizBgms: {
      headers: fetchQuizBgmHeaders,
      endpoint: fetchQuizBgmsAPIEndpoint,
    } = {},
  },
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
    url: fetchQuizBgmsAPIEndpoint,
    dataType: 'object',
    defaultQueryParamObj: {},
    fetchOnLoad: true,
    includeAuthtoken: true,
    isCentral: false,
    APIDataKeyName: 'result',
    headers: fetchQuizBgmHeaders,
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
    const { data: bgmsDataObj } = bgms || {};
    const { [variant]: bgmsArray = [] } = bgmsDataObj || {};
    if (bgmsArray.length) {
      const item = bgmsArray[Math.floor(Math.random() * bgmsArray.length)];
      const { url: bgmSrc } = item;
      return bgmSrc;
    }
    return false;
  }

  function getBgmAudioTag(variant) {
    // let { bgms: { [bgmVariant]: bgmsArray = [] } = {}, isMuted } = this.props
    // let bgmUrl
    // if (bgmsArray.length) {
    //   let item = bgmVariant === 'leaderboard' ? bgmsArray[0] : bgmsArray[Math.floor(Math.random() * bgmsArray.length)]
    //   let { url: bgmSrc } = item
    //   bgmUrl = bgmSrc
    // }
    const bgmUrl = pickRandomBgm(variant);
    return bgmUrl && !isMuted ? (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio
        key={bgmUrl}
        src={bgmUrl}
        id={bgmUrl}
        autoPlay
        style={{ visibility: 'hidden' }}
      />
    ) : null;
  }

  return (
    <QuizUtilityContext.Provider
      value={{
        isPageReloaded,

        isMuted,
        toggleMute,
        bgms,
        defaultBgmUrl:
          // 'https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/media/multiplayer_quiz/music/entire_game_tune_2_speed_up_a_little_game.mp3',
          'https://d3ka3pry54wyko.cloudfront.net/dev/media/multiplayer_quiz/music/entire_game_tune_2_speed_up_a_little_game.mp3',
        fetchBgms,
        pickRandomBgm,
        getBgmAudioTag,

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
