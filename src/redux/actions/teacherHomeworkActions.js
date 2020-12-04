import axios from '../../config/axios';

export const teacherHomeworkActions = {
  ADD_HOMEWORK_REQUEST: 'ADD_HOMEWORK_REQUEST',
  ADD_HOMEWORK_SUCCESS: 'ADD_HOMEWORK_SUCCESS',
  ADD_HOMEWORK_FAILURE: 'ADD_HOMEWORK_FAILURE',
  FETCH_TEACHER_HOMEWORK_REQUEST: 'FETCH_TEACHER_HOMEWORK_REQUEST',
  FETCH_TEACHER_HOMEWORK_SUCCESS: 'FETCH_TEACHER_HOMEWORK_SUCCESS',
  FETCH_TEACHER_HOMEWORK_FAILURE: 'FETCH_TEACHER_HOMEWORK_FAILURE',
  SET_SELECTED_HOME_WORK: 'SET_SELECTED_HOME_WORK',
};

const {
  ADD_HOMEWORK_REQUEST,
  ADD_HOMEWORK_SUCCESS,
  ADD_HOMEWORK_FAILURE,
  FETCH_TEACHER_HOMEWORK_REQUEST,
  FETCH_TEACHER_HOMEWORK_SUCCESS,
  FETCH_TEACHER_HOMEWORK_FAILURE,
  SET_SELECTED_HOME_WORK,
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
        obj[col.subject_name] = homeworkStatus ? homeworkStatus.status : {};
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
