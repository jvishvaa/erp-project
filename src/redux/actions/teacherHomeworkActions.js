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
  ADD_HOMEWORK_SUCCESS_COORD: 'ADD_HOMEWORK_SUCCESS_COORD',
  SET_TEACHER_HOMEWORK_ID_FROM_CORD: 'SET_TEACHER_HOMEWORK_ID_FROM_CORD',
  SET_TEACHER_HOMEWORK_ID_FROM_CORD_SUCCESS: 'SET_TEACHER_HOMEWORK_ID_FROM_CORD_SUCCESS',
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
  ADD_HOMEWORK_SUCCESS_COORD,
  SET_TEACHER_HOMEWORK_ID_FROM_CORD,
  SET_TEACHER_HOMEWORK_ID_FROM_CORD_SUCCESS,
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
      data: response.data.data.hw_questions,
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
    const isQuestionwise = response.data.data.is_question_wise;
    if (isQuestionwise) {
      dispatch({
        type: FETCH_SUBMITTED_HOMEWORK_DETAILS_SUCCESS,
        data: response.data.data.hw_questions,
        totalQuestions: response.data.data.hw_questions.length,
        isQuestionwise,
      });
    } else {
      dispatch({
        type: FETCH_SUBMITTED_HOMEWORK_DETAILS_SUCCESS,
        data: response.data.data.hw_questions.questions,
        totalQuestions: response.data.data.hw_questions.questions.length,
        collatedSubmissionFiles: response.data.data.hw_questions.submitted_files,
        isQuestionwise,
      });
    }
    return response.data.data;
  } catch (error) {
    dispatch({ type: FETCH_SUBMITTED_HOMEWORK_DETAILS_FAILURE });
    return [];
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
      const obj = { date: row.class_date, canUpload: row.can_upload };
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

export const fetchStudentsListForTeacherHomework = (id, subjectId) => async (dispatch) => {
  dispatch({ type: FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_REQUEST });
  try {
    const response = await axios.get(`/academic/homework-submitted-data/?homework=${id}&subject=${subjectId}`);
    const {
      evaluated_list: evaluatedStudents,
      submitted_list: submittedStudents,
      un_submitted_list: unSubmittedStudents,
      unevaluated_list: unevaluatedStudents,
    } = response.data;
    dispatch({
      type: FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_SUCCESS,
      evaluatedStudents,
      submittedStudents,
      unSubmittedStudents,
      unevaluatedStudents,
    });
  } catch (error) {
    dispatch({ type: FETCH_STUDENT_LIST_FOR_TEACHER_HOMEWORK_FAILURE });
  }
};

export const evaluateHomework = async (id, data) => {
  try {
    const response = await axios.put(`/academic/${id}/teacher-evaluation/`, data);
    if (response.data.status_code === 200) {
      return;
    }
    throw new Error();
  } catch (error) {
    throw new Error();
  }
};

export const finalEvaluationForHomework = async (id, data) => {
  try {
    const response = await axios.put(`/academic/${id}/evaluation-completed/`, data);
    if (response.data.status_code === 200) {
      return;
    }
    throw new Error();
  } catch (error) {
    throw new Error();
  }
};

export const addHomeWorkCoord = (data) => async (dispatch) => {
  dispatch({ type: ADD_HOMEWORK_REQUEST });
  try {
    const response = await axios.post('/academic/upload-homework/', data);
    dispatch({ type: ADD_HOMEWORK_SUCCESS_COORD, data: data.user_id });

    return 'success';
  } catch (e) {
    dispatch({ type: ADD_HOMEWORK_FAILURE });
    throw new Error(e);
  }
};

//Added By Vijay============
export const fetchCoordinateTeacherHomeworkDetails = (
  moduleId,
  startDate,
  endDate,
  user_id
) => async (dispatch) => {
  dispatch({ type: FETCH_TEACHER_HOMEWORK_REQUEST });
  try {
    const response = await axios.get(
      `/academic/student-homework/?module_id=${moduleId}&start_date=${startDate}&end_date=${endDate}&teacher_id=${user_id}`
    );
    const { header, rows } = response.data.data;
    // const {
    //   mandatory_subjects: mandatorySubjects,
    //   optional_subjects: optionSubjects,
    //   others_subjects: otherSubjects,
    // } = header;
    //   const abb = {
    //     "id": 1555,
    //     "subject_name": "Grade2_SecA_Drawing_mmmy"
    // };
    // header[0].subject_name="Grade2_SecA_hindi1--CCCCCCC";
    const homeworkColumns = [...header];
    const homeworkRows = rows.map((row) => {
      const obj = { date: row.class_date, canUpload: row.can_upload };
      homeworkColumns.forEach((col) => {
        const homeworkStatus = row.hw_details.find((detail) => detail.subject === col.id);

        obj[col.subject_name] = homeworkStatus
          ? { hw_id: homeworkStatus.id, ...homeworkStatus.status }
          : {};
      });
      // console.log(obj,"---------------");
      return obj;
    });
    homeworkColumns.unshift('Date');
    dispatch({
      type: FETCH_TEACHER_HOMEWORK_SUCCESS,
      data: { homeworkColumns, homeworkRows },
    });
    console.log('teacher details', response);
  } catch (e) {
    // console.log('error ', e);
    dispatch({ type: FETCH_TEACHER_HOMEWORK_FAILURE });
  }
};

export const setTeacherUserIDCoord = (data) => async (dispatch) => {
  dispatch({ type: SET_TEACHER_HOMEWORK_ID_FROM_CORD });
  try {
    dispatch({ type: SET_TEACHER_HOMEWORK_ID_FROM_CORD_SUCCESS, data: data.user_id });

    return 'success';
  } catch (e) {
    dispatch({ type: ADD_HOMEWORK_FAILURE });
    throw new Error(e);
  }
};
