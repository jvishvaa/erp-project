import axiosInstance from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';

export const createQuestionPaperActions = {
  ADD_NEW_QUESTION: 'ADD_NEW_QUESTION',
  ADD_QUESTION_TO_SECTION: 'ADD_QUESTION_TO_SECTION',
  SET_IS_FETCH: 'SET_IS_FETCH',
  CREATE_QUESTION_PAPER_STARTED: 'CREATE_QUESTION_PAPER_STARTED',
  CREATE_QUESTION_PAPER_SUCCESS: 'CREATE_QUESTION_PAPER_SUCCESS',
  CREATE_QUESTION_PAPER_FAILED: 'CREATE_QUESTION_PAPER_FAILED',
  SET_FILTER: 'SET_FILTER',
  RESET_STATE: 'RESET_STATE',
  DELETE_SECTION: 'DELETE_SECTION',
  DELETE_QUESTION_UNDER_SECTION: 'DELETE_QUESTION_UNDER_SECTION',
};
export const editQuestionPaperActions = {
  ADD_NEW_QUESTION: 'ADD_NEW_QUESTION',
  ADD_QUESTION_TO_SECTION: 'ADD_QUESTION_TO_SECTION',
  SET_IS_FETCH: 'SET_IS_FETCH',
  EDIT_QUESTION_PAPER_STARTED: 'EDIT_QUESTION_PAPER_STARTED',
  EDIT_QUESTION_PAPER_SUCCESS: 'EDIT_QUESTION_PAPER_SUCCESS',
  EDIT_QUESTION_PAPER_FAILED: 'EDIT_QUESTION_PAPER_FAILED',
  SET_FILTER: 'SET_FILTER',
  RESET_STATE: 'RESET_STATE',
  DELETE_SECTION: 'DELETE_SECTION',
  DELETE_QUESTION_UNDER_SECTION: 'DELETE_QUESTION_UNDER_SECTION',
}
export const addSection = (question) => ({
  type: createQuestionPaperActions.ADD_NEW_QUESTION,
  data: question,
});

export const setFilter = (filter, data) => ({
  type: createQuestionPaperActions.SET_FILTER,
  filter,
  data,
});

export const setIsFetched = (isFetched) => ({
  type: createQuestionPaperActions.SET_IS_FETCH,
  isFetched,
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
    const response = await axiosInstance.post(
      `${endpoints.assessmentErp.createQuestionPaper}`,
      data
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
export const editQuestionPaper = (data, url) => async (dispatch) => {
  dispatch({ type: editQuestionPaperActions.EDIT_QUESTION_PAPER_STARTED });
  try {
    const response = await axiosInstance.put(
      `${endpoints.assessmentErp.editQuestionPaper.replace('<question-paper-id>', url)}`,
      data
    );
    dispatch({ type: editQuestionPaperActions.EDIT_QUESTION_PAPER_SUCCESS });
    if (response.data.status_code !== 200) {
      throw new Error();
    }
  } catch (e) {
    dispatch({ type: editQuestionPaperActions.EDIT_QUESTION_PAPER_FAILED });
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
