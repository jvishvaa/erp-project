import axiosInstance from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';

export const createAssesmentActions = {
  SET_FILTER_FOR_CREATE_ASSESMENT: 'SET_FILTER_FOR_CREATE_ASSESMENT',
  RESET_STATE: 'RESET_STATE',
  DELETE_SECTION: 'DELETE_SECTION',
  ADD_QUESTION_PAPER_TO_TEST: 'ADD_QUESTION_PAPER_TO_TEST',
  FETCH_QUESTION_PAPER_DETAILS_REQUEST: 'FETCH_QUESTION_PAPER_DETAILS_REQUEST',
  FETCH_QUESTION_PAPER_DETAILS_SUCCESS: 'FETCH_QUESTION_PAPER_DETAILS_SUCCESS',
  FETCH_QUESTION_PAPER_DETAILS_FAILURE: 'FETCH_QUESTION_PAPER_DETAILS_FAILURE',
  CREATE_ASSESMENT_REQUEST: 'CREATE_ASSESMENT_REQUEST',
  CREATE_ASSESMENT_SUCCESS: 'CREATE_ASSESMENT_SUCCESS',
  CREATE_ASSESMENT_FAILURE: 'CREATE_ASSESMENT_FAILURE',
  CHANGE_TEST_FORM_FIELD: 'CHANGE_TEST_FORM_FIELD',
};

export const resetFormState = () => ({
  type: createAssesmentActions.RESET_STATE,
});

export const changeTestFormField = (field, data) => ({
  type: createAssesmentActions.CHANGE_TEST_FORM_FIELD,
  field,
  data,
});

export const createAssesment = (data) => async (dispatch) => {
  dispatch({ type: createAssesmentActions.CREATE_ASSESMENT_REQUEST });
  try {
    const response = await axiosInstance.post(
      `${endpoints.assessmentErp.createAssessment}`,
      data
    );
    if (response.data.status_code !== 200) {
      throw new Error();
    }
  } catch (e) {
    throw new Error();
  }
};

export const setFilterForCreateAssesment = (filter, data) => ({
  type: createAssesmentActions.SET_FILTER_FOR_CREATE_ASSESMENT,
  filter,
  data,
});

export const addQuestionPaperToTest = (data) => ({
  type: createAssesmentActions.ADD_QUESTION_PAPER_TO_TEST,
  data,
});

export const fetchQuestionPaperDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: createAssesmentActions.FETCH_QUESTION_PAPER_DETAILS_REQUEST });
    const url = endpoints.assessmentErp?.questionPaperViewMore.replace(
      '<question-paper-id>',
      id
    );
    const response = await axiosInstance.get(url);
    if (response.data.status_code === 200) {
      const { sections, questions } = response.data.result;
      const parsedResponse = [];
      sections.forEach((sec) => {
        const sectionObject = { name: '', questions: [] };
        const sectionName = Object.keys(sec)[0];
        sectionObject.name = sectionName;
        sec[sectionName].forEach((qId) => {
          //iterating question ids and finding corresponding questions
          const questionFound = questions.find((q) => q.id === qId);
          if (questionFound) {
            sectionObject.questions.push(questionFound);
          }
        });
        parsedResponse.push(sectionObject);
      });
      dispatch({
        type: createAssesmentActions.FETCH_QUESTION_PAPER_DETAILS_SUCCESS,
        data: parsedResponse,
      });
    }
  } catch (e) {
    dispatch({ type: createAssesmentActions.FETCH_QUESTION_PAPER_DETAILS_FAILURE });
  }
  // {
  // id: 1;
  // questions: [
  //   {
  //     id: 1,
  //     sections: [{ id: 1, questions: [] }],
  //   },
  //   {
  //     id: 1,
  //     sections: [{ id: 1, questions: [] }],
  //   },
  // ];
  // }
  //   {
  //     "question_paper":1,
  //     "test_id":12384,
  //     "test_name":"vikash",
  //     "total_mark":100,
  //     "test_date":"2020-12-11",
  //     "test_type":"1",
  //     "test_duration":30,
  //     "instructions":"Hii",
  //     "descriptions":"Hello",
  //     "test_mark":[
  //         {
  //             "question_id":1,
  //             "question_mark":[1,0],
  //             "mark_type":"1",
  //             "child_mark":[{"option1": [1, -1]}]
  //         },
  //          {
  //             "question_id":1,
  //             "question_mark":[1,0],
  //             "mark_type":"1",
  //             "child_mark":[{"option1": [1, -1]}]
  //         }
  //     ]
  // }
};
