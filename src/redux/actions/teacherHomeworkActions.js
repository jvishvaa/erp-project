import axios from '../../config/axios';

export const teacherHomeworkActions = {
  ADD_HOMEWORK_REQUEST: 'ADD_HOMEWORK_REQUEST',
  ADD_HOMEWORK_SUCCESS: 'ADD_HOMEWORK_SUCCESS',
  ADD_HOMEWORK_FAILURE: 'ADD_HOMEWORK_FAILURE',
  FETCH_TEACHER_HOMEWORK_REQUEST: 'FETCH_TEACHER_HOMEWORK_REQUEST',
  FETCH_TEACHER_HOMEWORK_SUCCESS: 'FETCH_TEACHER_HOMEWORK_SUCCESS',
  FETCH_TEACHER_HOMEWORK_FAILURE: 'FETCH_TEACHER_HOMEWORK_FAILURE',
  SET_SELECTED_HOME_WORK: 'SET_SELECTED_HOME_WORK',
  FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_REQUEST:
    'FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_REQUEST',
  FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_SUCCESS:
    'FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_SUCCESS',
  FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_FAILURE:
    'FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_FAILURE',
  FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_REQUEST:
    'FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_REQUEST',
  FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_SUCCESS:
    'FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_SUCCESS',
  FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_FAILURE:
    'FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_FAILURE',
  FETCH_SUBMITTED_HOMEWORK_DETAILS_REQUEST: 'FETCH_SUBMITTED_HOMEWORK_DETAILS_REQUEST',
  FETCH_SUBMITTED_HOMEWORK_DETAILS_SUCCESS: 'FETCH_SUBMITTED_HOMEWORK_DETAILS_SUCCESS',
  FETCH_SUBMITTED_HOMEWORK_DETAILS_FAILURE: 'FETCH_SUBMITTED_HOMEWORK_DETAILS_FAILURE',
};

const {
  ADD_HOMEWORK_REQUEST,
  ADD_HOMEWORK_SUCCESS,
  ADD_HOMEWORK_FAILURE,
  FETCH_TEACHER_HOMEWORK_REQUEST,
  FETCH_TEACHER_HOMEWORK_SUCCESS,
  FETCH_TEACHER_HOMEWORK_FAILURE,
  SET_SELECTED_HOME_WORK,
  FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_REQUEST,
  FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_SUCCESS,
  FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_FAILURE,
  FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_REQUEST,
  FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_SUCCESS,
  FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_FAILURE,
  FETCH_SUBMITTED_HOMEWORK_DETAILS_REQUEST,
  FETCH_SUBMITTED_HOMEWORK_DETAILS_SUCCESS,
  FETCH_SUBMITTED_HOMEWORK_DETAILS_FAILURE,
} = teacherHomeworkActions;

export const addHomeWork = (data) => async (dispatch) => {
  dispatch({ type: ADD_HOMEWORK_REQUEST });
  try {
    const response = await axios.post('/academic/upload-homework/', data);
    dispatch({ type: ADD_HOMEWORK_SUCCESS });

    return 'success';
  } catch (e) {
    dispatch({ type: ADD_HOMEWORK_FAILURE });
    throw new Error(e);
  }
};

export const fetchTeacherHomeworkDetailsById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_REQUEST });
  try {
    const response = await axios.get(`/academic/${id}/hw-questions/?hw_status=1`);
    console.log('dispatching action with ', response.data.data);
    dispatch({
      type: FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_SUCCESS,
      data: response.data.data,
    });
  } catch (error) {
    dispatch({ type: FETCH_TEACHER_HOMEWORK_DETAIL_BY_ID_FAILURE });
  }
};

export const fetchSubmittedHomeworkDetails = (id) => async (dispatch) => {
  dispatch({ type: FETCH_SUBMITTED_HOMEWORK_DETAILS_REQUEST });
  try {
    const response = await axios.get(
      `/academic/stu-submited-data/?student_homework=${id}`
    );
    dispatch({
      type: FETCH_SUBMITTED_HOMEWORK_DETAILS_SUCCESS,
      data: response.data.data,
      totalQuestions: response.data.data.length,
    });
  } catch (error) {
    dispatch({ type: FETCH_SUBMITTED_HOMEWORK_DETAILS_FAILURE });
  }
};

export const fetchTeacherHomeworkDetails = (moduleId, startDate, endDate) => async (
  dispatch
) => {
  dispatch({ type: FETCH_TEACHER_HOMEWORK_REQUEST });
  try {
    const response = await axios.get(
      `/academic/student-homework/?module_id=${moduleId}&start_date=${startDate}&end_date=${endDate}`
    );
    const { header, rows } = response.data.data;
    // const {
    //   mandatory_subjects: mandatorySubjects,
    //   optional_subjects: optionSubjects,
    //   others_subjects: otherSubjects,
    // } = header;
    const homeworkColumns = [...header];
    const homeworkRows = rows.map((row) => {
      const obj = { date: row.class_date };
      homeworkColumns.forEach((col) => {
        const homeworkStatus = row.hw_details.find((detail) => detail.subject === col.id);
        obj[col.subject_name] = homeworkStatus
          ? { hw_id: homeworkStatus.id, ...homeworkStatus.status }
          : {};
      });
      return obj;
    });
    homeworkColumns.unshift('Date');
    dispatch({
      type: FETCH_TEACHER_HOMEWORK_SUCCESS,
      data: { homeworkColumns, homeworkRows },
    });
    console.log(response);
  } catch (e) {
    console.log('error ', e);
    dispatch({ type: FETCH_TEACHER_HOMEWORK_FAILURE });
  }
};

export const setSelectedHomework = (data) => ({
  type: SET_SELECTED_HOME_WORK,
  data,
});

export const fetchStudentsListForTeacherHomework = (id) => async (dispatch) => {
  dispatch({ type: FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_REQUEST });
  try {
    const response = await axios.get(`/academic/homework-submitted-data/?homework=${id}`);
    const {
      evaluated_list: evaluatedStudents,
      submitted_list: submittedStudents,
      unevaluated_list: unevaluatedStudents,
    } = response.data;
    dispatch({
      type: FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_SUCCESS,
      evaluatedStudents,
      submittedStudents,
      unevaluatedStudents,
    });
  } catch (error) {
    dispatch({ type: FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_FAILURE });
  }
};
