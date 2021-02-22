import React, { createContext, useState } from 'react';
import axios from 'axios';
import endpoints from '../../../../config/endpoints';
import useFetcher from '../../../../utility-functions/custom-hooks/use-fetcher';
// import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const {
  assessment: {
    userAssessmentQuestionAnalysis: userAssessmentQuestionAnalysisAPIEndpoint,
    assessmentAnalysisTeacherExcel: assessmentAnalysisTeacherExcelAPIEndpoint,
  } = {},
} = endpoints || {};

export const AssessmentHandlerContext = createContext();

const APIEndpoint =
  'http://13.232.30.169/qbox/assessment/<question-paper-id>/qp-questions-list/';

const getSortedAndMainQuestions = (dataObj) => {
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
};

export const AssessmentHandlerContextProvider = ({ children, ...restProps }) => {
  const storageKey = 'mk';

  const [questionsDataObj, setQuestionsDataObj] = useState();
  // JSON.parse(localStorage.getItem(storageKey)).questions
  const [questionsMetaInfo, setQuestionsMetaInfo] = useState();
  const [currentQuesionId, setCurrentQuesionId] = useState();
  const [startedAt, setStartedAt] = useState();
  // const [currentQuesionId, setCurrentQuesionId] = useState(288);
  // const [startedAt, setStartedAt] = useState(new Date());

  // const [currentSubQuestionId, setCurrentSubQuestionId] = useState();
  const [assessmentDetails, setAssessmentDetails] = useState({});

  function updateAssessmentDetails(res) {
    const { data: { result = {} } = {} } = res || {};
    const { assessment_details: assessmentDetailsObj } = result || {};
    const {
      id: testId,
      test_duration: testDuration,
      question_paper_id: questionPaperId,
      question_paper__subject_name: questionPaperSubjectNames = [],
    } = assessmentDetailsObj || {};

    let userDetails = {};
    try {
      const { user_id: userId, role_details: { name: userName } = {} } =
        JSON.parse(localStorage.getItem('userDetails')) || {};
      userDetails = {
        user: userId,
        user_name: userName,
        user_grade: 'Grade1',
        user_section: 'SecA',
      };
    } catch (e) {
      userDetails = {};
    }
    const assessmentDtObj = {
      ...userDetails,
      subject_name: questionPaperSubjectNames,
      paper_id: questionPaperId,
      test: testId,
      start_time: startedAt,
      test_duration: testDuration,
      // end_time: new Date().getTime(),
    };
    setAssessmentDetails(assessmentDtObj);
  }
  // eslint-disable-next-line no-console
  console.log(restProps);
  function setLocalData(questionsData, metaInfo) {
    try {
      let prevlocalData = localStorage.getItem(storageKey);
      prevlocalData = JSON.parse(prevlocalData);
      const localData = JSON.stringify({
        ...prevlocalData,
        questions: questionsData,
        meta: metaInfo,
      });
      localStorage.setItem(storageKey, localData);
      return true;
    } catch (e) {
      return false;
    }
  }

  function retrieveLocalQuestion(questionId) {
    let localData = {};
    try {
      localData = localStorage.getItem(storageKey);
      localData = JSON.parse(localData);
    } catch (e) {
      localData = {};
    }
    const { questions = {} } = localData || {};
    const defaultData = {
      user_response: {
        attemption_status: null, // null | false | true,
        // ... rest key value pairs for the answer.
      },
    };

    return questions[questionId] || defaultData;
  }

  function formulateQuestionMetaInfo(questionsDataObj = {}) {
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
      const { user_response: { attemption_status: attemptionStatus = null } = {} } =
        questionObj || {};
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

  function updateLocalDataAndSetMetaInfo(questionsData) {
    const metaInfo = formulateQuestionMetaInfo(questionsData) || {};
    setLocalData(questionsData, metaInfo);
    setQuestionsMetaInfo(metaInfo);
  }

  function updateQuestionsDataObj(questionsData) {
    setQuestionsDataObj(questionsData);
    updateLocalDataAndSetMetaInfo(questionsData);
  }

  /*
    process whether it is completely attempted or not.
  */
  function updateQuestionsUserResponse(qId, userResponse = {}) {
    const { [qId]: questionObj = {} } = questionsDataObj || {};
    const { user_reponse: prevUserResponse } = questionObj;
    const updatedUserResponse = { ...prevUserResponse, ...userResponse };

    updateQuestionsDataObj({
      ...questionsDataObj,
      [qId]: { ...questionObj, user_response: updatedUserResponse },
    });
  }
  function attemptQuestion(qId, userResponse = {}) {
    // updateQuestionsUserResponse(9, { attemption_status: true, ...userResponse });
    updateQuestionsUserResponse(qId, userResponse);
  }
  function questionDataProcessor(apiResp) {
    const { data: { result: apiData = {} } = {} } = apiResp || {};

    const { questions = [], sections = [] } = apiData;

    const questionsObj = {};
    const processFunc = (element, index, subIndex = null, isSubQuestion = false) => {
      const { id: questionId } = element || {};

      const { id: nextQuesId = null } = questions[index + 1] || {};
      const { id: prevQuesId = null } = questions[index - 1] || {};
      const mk = retrieveLocalQuestion(questionId);
      const { user_response: userResponse } = mk;
      questionsObj[questionId] = {
        ...element,

        meta: {
          index,
          subIndex,
          isSubQuestion,
          next_question: nextQuesId,
          prev_question: prevQuesId,

          is_first_ques: !prevQuesId,
          is_last_ques: !nextQuesId,
        },
        user_response: userResponse,
      };
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
    updateQuestionsDataObj(questionsObj);
  }

  const assessmentQpHookProps = {
    // url: 'http://13.232.30.169/qbox/assessment/3/qp-questions-list/',
    dataType: 'array',
    defaultQueryParamObj: {},
    fetchOnLoad: false,
    includeAuthtoken: true,
    isCentral: true,
    APIDataKeyName: 'result',
  };
  const [assessmentQp, fetchAssessmentQpHook] = useFetcher(assessmentQpHookProps);
  function fetchAssessmentQp(params = {}, callbacks) {
    const { onResolve: onResolveInstacnceOne = () => {} } = callbacks || {};
    const { assessment_id: assessmentId } = params || {};
    if (!assessmentId) {
      // eslint-disable-next-line no-alert
      window.alert('param not fed');
      return null;
    }
    const APIEndpointURL = APIEndpoint.replace('<question-paper-id>', assessmentId);
    const dataProp = {
      url: APIEndpointURL,
      // queryParamObj: { assessment_id: assessmentId },
      callbacks: {
        ...callbacks,
        onResolve: (res) => {
          onResolveInstacnceOne(res);
          questionDataProcessor(res);
          updateAssessmentDetails(res);
        },
      },
    };
    fetchAssessmentQpHook(dataProp);
    return null;
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

  function start() {
    const [firstQuestionObj] = getSortedAndMainQuestions(questionsDataObj || {});
    const { id, duration } = firstQuestionObj || {};
    if (id) {
      selectQues(id);
      setStartedAt(new Date());
    } else {
      // eslint-disable-next-line no-alert
      window.alert(`Question not found to start the assessment.`);
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

  function submit(callbacks = {}) {
    const userReponses = [];
    Object.values(questionsDataObj).forEach((item) => {
      const {
        id: qId,
        parent_id: parentId,
        user_response: { answer, attemption_status: attemptionStatus } = {},
        question_type: questionType,
      } = item || {};
      const hasParentId = parentId > 0;
      const obj = {
        question: qId,
        question_type: questionType,
        is_parent: !hasParentId,
        parent_id: parentId,
        user_answer: answer,
      };
      if (attemptionStatus) {
        userReponses.push(obj);
      }
    });
    const payLoad = {
      ...assessmentDetails,
      start_time: new Date(startedAt),
      end_time: new Date(),
      user_response: userReponses,
    };

    const API = 'http://13.232.30.169/qbox/assessment/user_response/';
    const { onStart = () => {}, onResolve = () => {}, onReject = () => {} } =
      callbacks || {};
    onStart();

    axios
      .post(API, payLoad, { headers: { 'x-api-key': 'vikash@12345#1231' } })
      .then((res) => {
        onResolve(res);
        // console.log(res);
      })
      .catch((er) => {
        onReject(er);
        // console.log(er);
      });
  }

  return (
    <AssessmentHandlerContext.Provider
      value={{
        assessmentQp,
        fetchAssessmentQp,

        questionsDataObj,

        questionsArray: getSortedAndMainQuestions(questionsDataObj || {}),

        questionsMetaInfo,

        currentQuesionId,
        controls: {
          selectQues,
          nextQues,
          prevQues,
          attemptQuestion,
          currentQuesionId,
          isStarted: Boolean(currentQuesionId),
          start,
          startedAt,
          submit,
        },

        assessmentDetails,
      }}
    >
      {children}
    </AssessmentHandlerContext.Provider>
  );
};
/*
    attemption_status: true => attempted
    attemption_status: false => incomplete
    attemption_status: null => unattempted


    var1
    {
        meta:{
            no_of_questions: int,
            no_of_attempted: int, // attempted indicates when only question is completely attempted.
            no_of_incomplete: int,
            no_of_unattempted: int,
            is_ready_to_submit: no_of_questions === no_of_attempted,
            last_updated_at: new Date().getTime()
        },
        questions:{ 
            234: {
                grade_subject_mapping: 13
                id: 234
                is_published: false
                parent_id: 0
                question_answer: (5) [{…}, {…}, {…}, {…}, {…}]
                question_type: 5
                sub_questions: (2) [{…}, {…}]
                time_or_slide: ""
                topic: null
                topic_name: null
                
                index: 0,
                user_response: {
                    attemption_status: null | false | true,
                    ... rest key value pairs for the answer.
                }
                
                next_question: question_id,
                is_last_ques: true or false.
            },
            ...
        }
    }
    var2
    currentQuestionId = int
    fnntio to parse and set locakst and assessmntQp.
    function nextQues, prevQues, submit assess, selectQues(id), attenmtQuestion(id, userResponse.).
*/
