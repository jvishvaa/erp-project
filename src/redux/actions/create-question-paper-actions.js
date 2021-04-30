import axiosInstance from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';

export const createQuestionPaperActions = {
  ADD_NEW_QUESTION: 'ADD_NEW_QUESTION',
  ADD_QUESTION_TO_SECTION: 'ADD_QUESTION_TO_SECTION',
  CREATE_QUESTION_PAPER_STARTED: 'CREATE_QUESTION_PAPER_STARTED',
  CREATE_QUESTION_PAPER_SUCCESS: 'CREATE_QUESTION_PAPER_SUCCESS',
  CREATE_QUESTION_PAPER_FAILED: 'CREATE_QUESTION_PAPER_FAILED',
  SET_FILTER: 'SET_FILTER',
  RESET_STATE: 'RESET_STATE',
  DELETE_SECTION: 'DELETE_SECTION',
  DELETE_QUESTION_UNDER_SECTION: 'DELETE_QUESTION_UNDER_SECTION',
};

export const addQuestion = (question) => ({
  type: createQuestionPaperActions.ADD_NEW_QUESTION,
  data: question,
});

export const setFilter = (filter, data) => ({
  type: createQuestionPaperActions.SET_FILTER,
  filter,
  data,
});

export const addQuestionToSection = (data, questionId, section) => ({
  type: createQuestionPaperActions.ADD_QUESTION_TO_SECTION,
  data,
  questionId,
  section,
});

export const createQuestionPaper = (data) => async (dispatch) => {
  dispatch({ type: createQuestionPaperActions.CREATE_QUESTION_PAPER_STARTED });
  try {
    const response = await axios.post(
      `${endpoints.baseURLCentral}/assessment/question-paper/`,
      data,
      {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      }
    );
    dispatch({ type: createQuestionPaperActions.CREATE_QUESTION_PAPER_SUCCESS });
    if (response.data.status_code !== 200) {
      throw new Error();
    }
  } catch (e) {
    dispatch({ type: createQuestionPaperActions.CREATE_QUESTION_PAPER_FAILED });

    throw new Error();
  }
};

export const resetState = () => ({
  type: createQuestionPaperActions.RESET_STATE,
});
export const deleteSection = (questionId, sectionId) => ({
  type: createQuestionPaperActions.DELETE_SECTION,
  questionId,
  sectionId,
});

export const deleteQuestionSection = (questionId, sectionId) => ({
  type: createQuestionPaperActions.DELETE_QUESTION_UNDER_SECTION,
  questionId,
  sectionId,
});
