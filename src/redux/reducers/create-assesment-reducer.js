import moment from 'moment';
import { createAssesmentActions } from '../actions';

const INITIAL_STATE = {
  selectedBranch: null,
  selectedGrade: null,
  selectedSubject: null,
  selectedQuestionPaper: null,
  selectedTestType: null,
  questionPaperDetails: [],
  fetchingQuestionPaperDetails: false,
  testName: '',
  testId: '',
  testDuration: 0,
  testDate: moment().format('YYYY-MM-DD'),
  testInstructions: '',
  totalMarks: 0,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case createAssesmentActions.ADD_QUESTION_PAPER_TO_TEST:
      return { ...state, selectedQuestionPaper: action.data };
    case createAssesmentActions.FETCH_QUESTION_PAPER_DETAILS_REQUEST:
      return { ...state, fetchingQuestionPaperDetails: true };
    case createAssesmentActions.FETCH_QUESTION_PAPER_DETAILS_SUCCESS:
      return { ...state, questionPaperDetails: action.data };
    case createAssesmentActions.FETCH_QUESTION_PAPER_DETAILS_FAILURE:
      return { ...state, fetchingQuestionPaperDetails: false };
    case createAssesmentActions.CHANGE_TEST_FORM_FIELD:
      return { ...state, [action.field]: action.data };

    case createAssesmentActions.RESET_STATE:
      return { ...state, ...INITIAL_STATE };

    default:
      return state;
  }
}
