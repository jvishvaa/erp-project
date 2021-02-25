import React, { createContext, useState } from 'react';
import endpoints from '../../../../config/endpoints';
import useFetcher from '../../../../utility-functions/custom-hooks/use-fetcher';

const {
  assessment: {
    // assessmentResultAnalysis: assessmentResultAnalysisAPIEndpoint = 'http://13.232.30.169/qbox/assessment/student-reports/',
    assessmentResultAnalysis: assessmentResultAnalysisAPIEndpoint,
  } = {},
} = endpoints || {};

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

const assessmentResultHookProps = {
  url: assessmentResultAnalysisAPIEndpoint,
  dataType: 'array',
  // defaultQueryParamObj: {},
  fetchOnLoad: false,
  includeAuthtoken: true,
  isCentral: true,
  APIDataKeyName: 'result',
};

export const AssessmentReviewContext = createContext();

export const AssessmentReviewContextProvider = ({ children, ...restProps }) => {
  const [questionsDataObj, setQuestionsDataObj] = useState();
  const [currentQuesionId, setCurrentQuesionId] = useState();

  const [assessmentResultDetails, setAssessmentResultDetails] = useState();

  const [assessmentId, setAssessmentId] = React.useState();
  const [assessmentResult, fetchAssessmentResultHook] = useFetcher(
    assessmentResultHookProps
  );

  function updateAssessmentResultDetails(res) {
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
      };
    } catch (e) {
      userDetails = {};
    }
    const assessmentDtObj = {
      ...assessmentDetailsObj,
      ...userDetails,
      subject_name: questionPaperSubjectNames,
      paper_id: questionPaperId,
      test: testId,
      test_duration: testDuration,
      // end_time: new Date().getTime(),
    };
    setAssessmentResultDetails(assessmentDtObj);
  }
  function updateQuestionsDataObj(questionsData) {
    setQuestionsDataObj(questionsData);
  }
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
  const formatQuesUserResponseObj = (apiData) => {
    const { user_response: userQuesResponsesArray = [] } = apiData || {};
    const userQuesResponsesObj = {};
    userQuesResponsesArray.forEach((quesResp) => {
      userQuesResponsesObj[quesResp.question] = {
        ...quesResp,
        answer: quesResp.user_answer,
      };
    });
    return userQuesResponsesObj;
  };
  function questionDataProcessor(apiResp) {
    const { data: { result: apiData = {} } = {} } = apiResp || {};

    const { questions = [], sections = [] } = apiData;
    const questionSectionsObj = parseSectionData(sections);
    const userQuesResponsesObj = formatQuesUserResponseObj(apiData || {}) || {};
    const questionsObj = {};
    const processFunc = (element, index, subIndex = null, isSubQuestion = false) => {
      const { id: questionId } = element || {};

      const { id: nextQuesId = null } = questions[index + 1] || {};
      const { id: prevQuesId = null } = questions[index - 1] || {};
      // const { user_response: userResponse } = retrieveLocalQuestion(questionId) || {};
      const userResponse = userQuesResponsesObj[questionId] || {};

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

  function fetchAssessmentResult(params = {}, callbacks) {
    const { onResolve: onResolveInstacnceOne = () => {} } = callbacks || {};
    const { test_id: testId, user_id: userId } = params || {};
    if ([!!testId, !!userId].includes(false)) {
      // eslint-disable-next-line no-alert
      window.alert('param not fed');
      return null;
    }
    const dataProp = {
      queryParamObj: { test_id: testId, user_id: userId },
      callbacks: {
        ...callbacks,
        onResolve: (res) => {
          onResolveInstacnceOne(res);
          questionDataProcessor(res);
          updateAssessmentResultDetails(res);
        },
      },
    };
    fetchAssessmentResultHook(dataProp);
    return null;
  }
  React.useEffect(() => {
    const { user_id: user } = JSON.parse(localStorage.getItem('userDetails') || {});
    if (assessmentId) {
      fetchAssessmentResult({ user_id: user, test_id: assessmentId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

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

  return (
    <AssessmentReviewContext.Provider
      value={{
        assessmentResult,
        fetchAssessmentResult,
        assessmentId,
        setAssessmentId,

        questionsDataObj,

        questionsArray: getSortedAndMainQuestions(questionsDataObj || {}),

        currentQuesionId,
        controls: {
          selectQues,
          nextQues,
          prevQues,
          currentQuesionId,
        },

        assessmentResultDetails,
      }}
    >
      {children}
    </AssessmentReviewContext.Provider>
  );
};
