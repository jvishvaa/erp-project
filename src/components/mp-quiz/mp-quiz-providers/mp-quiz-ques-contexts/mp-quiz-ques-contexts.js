import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import constants from '../mp-quiz-constants';
import { useFetcher } from '../../mp-quiz-utils';
import { useQuizEventTriggers } from '../mp-quiz-event-contexts';

const {
  urls: { fetchQuizQpPaper: fetchQuizQpPaperAPIEndpoint, ajaxHeaders, ajaxBase },
} = constants || {};

const getTimeToRenderConfig = () => {
  const renderPreQuesAnim = 'render_pre_question_anim';
  const renderQues = 'render_question';
  const renderLB = 'render_leader_board';
  const renderMeme = 'render_meme';
  const durationObj = {
    // qOptionDuration: 2500,
    // memeDuration: 5000,
    // lbDuration: 5000,
    // preQuesAnimDuration: 1000,
    // firstQuesAnimDuration: 4000,

    qOptionDuration: 0,
    memeDuration: 1000,
    lbDuration: 1000,
    preQuesAnimDuration: 1000,
    firstQuesAnimDuration: 1000,
  };
  const timeToRenderConfig = {
    [renderPreQuesAnim]: {
      label: renderPreQuesAnim,
      duration: durationObj.preQuesAnimDuration, // content will be rendered for this duration
      onEndDuration: 0, // on end of content's duration, onEndDuration is the it waits to next content
      nextEventLabel: renderQues,
    },
    [renderQues]: {
      label: renderQues,
      duration: null,
      onEndDuration: durationObj.qOptionDuration,
      nextEventLabel: renderMeme,
    },
    [renderMeme]: {
      label: renderMeme,
      duration: durationObj.memeDuration,
      onEndDuration: 0,
      nextEventLabel: renderLB,
    },
    [renderLB]: {
      label: renderLB,
      duration: durationObj.lbDuration,
      onEndDuration: 0,
      nextEventLabel: renderPreQuesAnim, // update current question id to next question id and set to renderPreQuesAnim
    },
  };
  const timeToRenderObj = {
    timeToRenderConfig,
    labels: { renderPreQuesAnim, renderQues, renderMeme, renderLB },
    durationObj,
  };
  return timeToRenderObj;
};

function parseSectionData(sections) {
  /*
        from:
          0: {A: Array(9), discription: "section-a"}
          1: {B: Array(8), discription: "section-b"}
          2: {C: Array(8), discription: "section-c"}
          length: 3
          __proto__: Array(0)
        to:
          { 
            A:{ name: '', description: "section-a" },
            B:{ name: '', description: "section-b" },
            C:{ name: '', description: "section-c" },
            "276": "A",
            "<question-id>": "<section-name>"
            ...
          }
      */
  const questionSectionsObj = {};
  sections.forEach((itemObj = {}) => {
    Object.entries(itemObj || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // questionSectionsObj[key] = { name: key, description: itemObj.description };
        questionSectionsObj[key] = { name: key, description: itemObj.discription }; // description ==> discription
        const questionIds = value;
        questionIds.forEach((questionId) => {
          questionSectionsObj[questionId] = key;
        });
      }
    });
  });
  return questionSectionsObj;
}
function getSortedAndMainQuestions(dataObj) {
  function compareObjects(object1, object2) {
    const { meta: { index: index1 } = {} } = object1 || {};
    const { meta: { index: index2 } = {} } = object2 || {};
    if (index1 < index2) {
      return -1;
    }
    if (index1 > index2) {
      return 1;
    }
    return 0;
  }
  const sortedArray = Object.values(dataObj)
    .filter((dataObj) => !dataObj.parent_id > 0)
    .sort((item1, item2) => {
      return compareObjects(item1, item2, 'name');
    });
  return sortedArray;
}

function formulateQuestionMetaInfo(questionsDataObj = {}, responsesObj = {}) {
  /*
      meta:{
              no_of_questions: int,
              no_of_attempted: int, // attempted indicates when only question is completely attempted.
              no_of_incomplete: int,
              no_of_unattempted: int,
              is_ready_to_submit: no_of_questions === no_of_attempted,
              last_updated_at: new Date().getTime()
          },
      */
  // const questionsArray = Object.values(questionsDataObj || {});
  const questionsArray = getSortedAndMainQuestions(questionsDataObj || {});
  const noOfQuestions = questionsArray.length;
  let noOfAttempted = 0; //  if attemption_status in user_response is true, count it as attempted.
  let noOfIncomplete = 0; //  if attemption_status in user_response is true, count it as attempted.
  let noOfUnattempted = 0; //  if attemption_status in user_response is true, count it as attempted.
  questionsArray.forEach((questionObj) => {
    // const { user_response: { attemption_status: attemptionStatus = null } = {} } =
    //   questionObj || {};
    const questionResponse = responsesObj[questionObj.id];
    const { attemption_status: attemptionStatus = null } = questionResponse || {};
    switch (attemptionStatus) {
      case true: {
        noOfAttempted += 1;
        break;
      }
      case false: {
        noOfIncomplete += 1;
        break;
      }
      default: {
        noOfUnattempted += 1;
        break;
      }
    }
  });
  const lastUpdatedAt = new Date().getTime();
  const isReadyToSubmit = noOfQuestions === noOfAttempted;
  return {
    no_of_questions: noOfQuestions,
    no_of_attempted: noOfAttempted,
    no_of_incomplete: noOfIncomplete,
    no_of_unattempted: noOfUnattempted,
    is_ready_to_submit: isReadyToSubmit,
    last_updated_at: lastUpdatedAt,
    // test_duration: testDuration,
  };
}

const QuizQuesContext = React.createContext();

export function QuizQuesContextProvider({ children }) {
  const timeToRenderObj = getTimeToRenderConfig();
  const [timeToRender, setTimeToRender] = useState();
  const [questionsDataObj, setQuestionsDataObj] = useState();
  const [responsesDataObj, setReponsesDataObj] = useState();
  const [questionsMetaInfo, setQuestionsMetaInfo] = useState();
  const [currentQuesionId, setCurrentQuesionId] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const [currentQuesScore, setCurrentQuesScore] = useState();

  const { postQuesReponseTrigger } = useQuizEventTriggers();

  const quizQpHookProps = {
    url: `${ajaxBase + fetchQuizQpPaperAPIEndpoint}`,
    dataType: 'object',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: false,
    APIDataKeyName: 'result',
    headers: ajaxHeaders,
  };
  const [quizQp, fetchQuizQpHook] = useFetcher(quizQpHookProps);

  function fetchQuizQp(dataProp) {
    const { callbacks, queryParamObj } = dataProp;
    const { onResolve: onResolveInstacnceOne = () => {} } = callbacks || {};
    const { question_paper: questionPaperId } = queryParamObj || {};
    // eslint-disable-next-line no-alert
    if (!questionPaperId) window.alert('param not fed');
    if (!questionPaperId) return null;

    const hookDataProp = { ...(dataProp || {}) };
    hookDataProp.callbacks = {
      ...callbacks,
      onResolve: (res) => {
        onResolveInstacnceOne(res);
        // eslint-disable-next-line no-use-before-define
        questionDataProcessor(res);
        // updateAssessmentDetails(res);
      },
    };

    fetchQuizQpHook(hookDataProp);
    return null;
  }

  function skipToFistNonAttemptedQues(questionsObj) {
    const questionsArray = getSortedAndMainQuestions(questionsObj || {});
    const indexOfQues = questionsArray
      .map((i) => (i.response ? i.response.answer : i.response))
      .map(Boolean)
      .indexOf(false);
    let unAttemptedQuesIndex;
    if (indexOfQues === -1) {
      unAttemptedQuesIndex = questionsArray.length > 0 ? questionsArray.length - 1 : 0;
    } else if (indexOfQues >= 0) {
      unAttemptedQuesIndex = indexOfQues;
    } else {
      unAttemptedQuesIndex = 0;
    }
    return questionsArray[unAttemptedQuesIndex].id;
  }
  function questionDataProcessor(apiResp) {
    const { data: { result: apiData = {} } = {} } = apiResp || {};

    const { questions = [], sections = [] } = apiData;
    const questionSectionsObj = parseSectionData(sections);
    const questionsObj = {};
    const responsesObj = {};
    const processFunc = (element, index, subIndex = null, isSubQuestion = false) => {
      const { id: questionId } = element || {};

      const { id: nextQuesId = null } = questions[index + 1] || {};
      const { id: prevQuesId = null } = questions[index - 1] || {};
      //   const { user_response: userResponse } = retrieveLocalQuestion(questionId) || {};
      const { [questionId]: questionSectionName } = questionSectionsObj || {};
      const { [questionSectionName]: questionSectionObj } = questionSectionsObj || {};
      questionsObj[questionId] = {
        ...element,
        section: questionSectionObj || {},
        meta: {
          index,
          subIndex,
          isSubQuestion,
          next_question: nextQuesId,
          prev_question: prevQuesId,

          is_first_ques: !prevQuesId,
          is_last_ques: !nextQuesId,
        },
        // user_response: userResponse,
      };
      responsesObj[questionId] = element.response;
    };
    questions.forEach((element, index) => {
      processFunc(element, index, null);
      const { sub_questions: subQuestions = [] } = element || {};
      subQuestions.forEach((subeElement, subIndex) => {
        const isSubQuestion = true;
        processFunc(subeElement, index, subIndex, isSubQuestion);
      });
    });
    // console.log({ apiData, questionsObj }, 'apiData');
    // eslint-disable-next-line no-use-before-define
    updateQuestionsDataObjAndResponsesObjAndCurrentQuesId(questionsObj, responsesObj);
  }

  function updateResponsesObjAndMetaInfo(questionsData, responsesObj) {
    const metaInfo = formulateQuestionMetaInfo(questionsData, responsesObj) || {};
    setReponsesDataObj(responsesObj);
    setQuestionsMetaInfo(metaInfo);
  }
  function updateQuestionsDataObj(questionsData) {
    setQuestionsDataObj(questionsData);
  }
  function updateQuestionsDataObjAndResponsesObjAndCurrentQuesId(
    questionsData,
    responsesObj
  ) {
    updateQuestionsDataObj(questionsData);
    updateResponsesObjAndMetaInfo(questionsData, responsesObj);

    const unattemptedQuesId = skipToFistNonAttemptedQues(questionsData);
    setCurrentQuesionId(unattemptedQuesId);
    // setCurrentQuesionId(485); // please handle

    setTimeToRender('render_pre_question_anim');
  }

  function selectQues(qId) {
    const { [qId]: isQuestionAvailable } = questionsDataObj || {};
    if (isQuestionAvailable) {
      setCurrentQuesionId(qId);
    } else {
      // eslint-disable-next-line no-alert
      window.alert(`Q id ${qId} not found in the questions`);
    }
  }
  function nextQues() {
    const { [currentQuesionId]: questionsObj } = questionsDataObj || {};
    const {
      meta: {
        // prev_question: prevQuesId,
        // is_first_ques: isFirstQues,
        is_last_ques: isLastQues,
        next_question: nextQuesId,
      },
    } = questionsObj;
    if (isLastQues) {
      // eslint-disable-next-line no-alert
      const jumptToFirst = window.confirm('Jump to first question ?');
      if (jumptToFirst) {
        const [firstQuestionObj] = getSortedAndMainQuestions(questionsDataObj || {});
        const { id: firstQuestionId } = firstQuestionObj || {};
        selectQues(firstQuestionId);
      }
    } else {
      selectQues(nextQuesId);
    }
  }
  function prevQues() {
    const { [currentQuesionId]: questionsObj } = questionsDataObj || {};
    const {
      meta: {
        is_first_ques: isFirstQues,
        prev_question: prevQuesId,
        // is_last_ques: isLastQues,
        // next_question: nextQuesId,
      },
    } = questionsObj;
    if (isFirstQues) {
      // eslint-disable-next-line no-alert
      window.alert('Jump to last question ?');
    } else {
      selectQues(prevQuesId);
    }
  }
  function setStartTime(qId) {
    const { [qId]: questionResponseObj } = responsesDataObj || {};
    const { start_time: isStartedTimeExists } = questionResponseObj || {};
    if (isStartedTimeExists) {
      return false;
      //   return userResponse;
    }
    const startTime = new Date().getTime() / 1000;
    const updatedUserResponse = { ...(questionResponseObj || {}), start_time: startTime };
    // eslint-disable-next-line no-use-before-define
    updateQuestionsUserResponse(qId, updatedUserResponse);
    return true;
  }
  function generateStartTime(userResponse = {}) {
    const { start_time: isStartedTimeExists } = userResponse || {};
    if (isStartedTimeExists) {
      return userResponse;
    }
    const startTime = new Date().getTime() / 1000;
    return { ...(userResponse || {}), start_time: startTime };
  }
  function generateEndTime(userResponse = {}) {
    const { start_time: startTime } = userResponse || {};
    // second argument is callback
    const endTime = new Date().getTime() / 1000;
    return { ...(userResponse || {}), end_time: endTime, duration: endTime - startTime };
  }
  function generateIsQuizOver(qId, userResponse) {
    const { [qId]: questionsObj } = questionsDataObj || {};
    const {
      meta: { is_last_ques: isLastQues },
    } = questionsObj || {};
    return { is_quiz_over: isLastQues, ...(userResponse || {}) };
  }
  function decideScoreAndBonus(questionId, userResponse) {
    /*
        Sort bonusConfigArray by duration in ascending order
        from:[
          {duration: 5, timing_score: 150},
          {duration: 15, timing_score: 50},
          {duration: 10, timing_score: 100}
        ]
        To:[
          {duration: 5, timing_score: 150},
          {duration: 10, timing_score: 100},
          {duration: 15, timing_score: 50}
        ]
      */
    const {
      score_schema: {
        question_score: questionScore = 0,
        timing_configuration: bonusConfigArray = [],
      } = {},
    } = questionsDataObj[questionId] || {};

    const sortedBonusConfAr = bonusConfigArray
      .map((item) => ({ ...item, duration: Number(item.duration) }))
      .filter((item) => !Number.isNaN(item.duration))
      .sort((a, b) => a.duration - b.duration);

    // userResponse = { ...userResponse, duration: userResponse.end_time - userResponse.start_time };
    const { correct: isAttemptedCorrect, duration: timeTakenToAttempt } = userResponse;
    let scoreObj;
    if (isAttemptedCorrect) {
      let bonusScore = 0;
      let bonusScoreObj = {};
      const bonusAchieved = sortedBonusConfAr.some((item) => {
        let { duration, timing_score: timingScore } = item;
        timingScore = Number.isNaN(Number(timingScore)) ? 0 : Number(timingScore);
        if (timeTakenToAttempt <= duration) {
          bonusScore = timingScore;
          bonusScoreObj = item;
          return true;
        }
      });
      scoreObj = {
        score: questionScore + bonusScore,
        bonus_achieved: bonusAchieved,
        bonus_score_obj: bonusScoreObj,
      };
      /* Setting score to state ie. to update to quiz tobar with animation effect */
      // this.setState({ score: questionScore + bonusScore });
      setCurrentQuesScore(questionScore + bonusScore);
    } else {
      scoreObj = { score: 0, bonus_achieved: false };
    }
    return { ...userResponse, ...scoreObj };
  }

  function postAttemptedResponse(userResponse) {
    postQuesReponseTrigger(userResponse);
  }
  /*
    process whether it is completely attempted or not.
  */
  function updateQuestionsUserResponse(qId, userResponse = {}) {
    const { [qId]: prevUserResponse = {} } = responsesDataObj || {};
    const updatedUserResponse = { ...prevUserResponse, ...userResponse };

    updateResponsesObjAndMetaInfo(questionsDataObj, {
      ...responsesDataObj,
      [qId]: { ...updatedUserResponse },
    });
  }
  function attemptQuestion(qId, userResponse = {}) {
    const { [qId]: existingUserResponse = {} } = responsesDataObj || {};
    let updatedUserResponse = generateStartTime({
      ...(existingUserResponse || {}),
      ...userResponse,
    }); // just in case start time doesnt exists in response obj
    updatedUserResponse = generateEndTime(updatedUserResponse);
    updatedUserResponse = generateIsQuizOver(qId, updatedUserResponse);
    updatedUserResponse = decideScoreAndBonus(qId, updatedUserResponse);
    //  update correct or wrong in attemption component
    //  update attemption_status true or false in attemption component

    if (readOnly) {
      // eslint-disable-next-line no-console
      console.log('No questions can be attempted.');
    } else {
      // updateQuestionsUserResponse(9, { attemption_status: true, ...userResponse });
      updateQuestionsUserResponse(qId, updatedUserResponse);
      // eslint-disable-next-line no-use-before-define
      onAttemptionCurrentQuesAttemption();
      postAttemptedResponse(updatedUserResponse);
    }
  }

  // console.log({ questionsDataObj, responsesDataObj, questionsMetaInfo }, 'mk');

  function updateTimeToRender(renderEventLabel) {
    const { labels } = getTimeToRenderConfig() || {};
    const eventLabelExists = Object.values(labels || {}).indexOf(renderEventLabel);
    if (eventLabelExists >= 0) {
      setTimeToRender(renderEventLabel);
      return true;
    }
    return false;
  }
  function decideAndSetNextRender(currentTimeToRenderLabel) {
    const timeToRenderObj = getTimeToRenderConfig();
    const {
      timeToRenderConfig,
      labels: { renderPreQuesAnim, renderQues, renderMeme, renderLB },
      //   durationObj,
    } = timeToRenderObj;
    const { [currentTimeToRenderLabel]: currentRenderObj = {} } = timeToRenderConfig;
    const {
      label: currentRenderLabel,
      duration,
      onEndDuration,
      nextEventLabel,
    } = currentRenderObj;
    if (Number.isFinite(duration)) {
      switch (currentRenderLabel) {
        case renderPreQuesAnim: {
          // if (nextEventLabel) {
          //   setTimeout(() => {
          //     updateTimeToRender(nextEventLabel);
          //   }, duration);
          // }
          // return true;
          // This logic is being handled at compoud timer as time shoulb be rendered to UI.
          return false;
        }
        case renderQues: {
          //   setTimeout(() => {
          //     updateTimeToRender(nextEventLabel);
          //   }, duration);
          return true;
        }
        case renderMeme: {
          if (nextEventLabel) {
            setTimeout(() => {
              updateTimeToRender(nextEventLabel);
            }, duration);
          }
          return true;
        }
        case renderLB: {
          if (nextEventLabel) {
            setTimeout(() => {
              nextQues();
              updateTimeToRender(nextEventLabel);
            }, duration);
          }
          return true;
        }
        default: {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  useEffect(() => {
    if (timeToRender) {
      decideAndSetNextRender(timeToRender);
      return () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeToRender]);
  function onEndOfPreQuesAnim() {
    const {
      labels: { renderQues },
    } = getTimeToRenderConfig() || {};
    updateTimeToRender(renderQues);
  }
  function startAttemptingQues() {
    const {
      labels: { renderPreQuesAnim },
    } = getTimeToRenderConfig() || {};
    updateTimeToRender(renderPreQuesAnim);
  }

  function onAttemptionCurrentQuesAttemption() {
    const {
      labels: { renderQues },
      timeToRenderConfig,
    } = getTimeToRenderConfig() || {};
    const { onEndDuration, nextEventLabel } = timeToRenderConfig[renderQues];
    if (Number.isFinite(onEndDuration)) {
      setTimeout(() => {
        updateTimeToRender(nextEventLabel);
      }, onEndDuration);
    }
  }

  const getCurrentQuesionIndex = () => {
    const { meta: { index = 0 } = {} } =
      (questionsDataObj && questionsDataObj[currentQuesionId]) || {};
    return index;
  };
  return (
    <QuizQuesContext.Provider
      value={{
        quizQp,
        fetchQuizQp,

        questionsDataObj,
        responsesDataObj,

        questionsMetaInfo,

        currentQuesionId,
        currentQuesScore,
        controls: {
          nextQues,
          attemptQuestion,
          setStartTime,
          currentQuesionIndex: getCurrentQuesionIndex(),
        },

        timeToRenderObj,
        timeToRenderControls: {
          timeToRender,
          onEndOfPreQuesAnim,
          startAttemptingQues,
          onAttemptionCurrentQuesAttemption,
        },
      }}
    >
      {children}
    </QuizQuesContext.Provider>
  );
}

QuizQuesContextProvider.propTypes = {
  children: PropTypes.node,
};

QuizQuesContextProvider.defaultProps = {
  children: 'No child element passed to QuizQuesContextProvider',
};

export function useQuizQuesContext() {
  const context = React.useContext(QuizQuesContext);
  if (context === undefined) {
    throw new Error(
      'useQuizUitilityContext must be used within a QuizQuesContextProvider'
    );
  }
  return context;
}
// http://localhost:3000/quiz/80/
// http://127.0.0.1:3000/quiz/80/
