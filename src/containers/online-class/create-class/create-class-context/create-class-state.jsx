import React, { useReducer, createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import createClassReducer from './create-class-reducer';
import {
  LIST_GRADE_FAILURE,
  LIST_GRADE_REQUEST,
  LIST_GRADE_SUCCESS,
  LIST_COURSE_FAILURE,
  LIST_COURSE_REQUEST,
  LIST_COURSE_SUCCESS,
  LIST_SECTION_FAILURE,
  LIST_SECTION_REQUEST,
  LIST_SECTION_SUCCESS,
  LIST_STUDENT_FAILURE,
  LIST_STUDENT_REQUEST,
  LIST_STUDENT_SUCCESS,
  VERIFY_TUTOREMAIL_REQUEST,
  VERIFY_TUTOREMAIL_SUCCESS,
  VERIFY_TUTOREMAIL_FAILURE,
  CLEAR_VALIDATION,
  CLEAR_FILERED_STUDENTS,
  CLEAR_GRADE_DROP,
  CLEAR_SECTION_DROP,
  CLEAR_SUBJECT_DROP,
  CLEAR_COURSE_DROP,
  LIST_FILTERED_STUDENTS,
  CREATE_NEW_CLASS_REQUEST,
  CREATE_NEW_CLASS_SUCCESS,
  CREATE_NEW_CLASS_FAILURE,
  RESET_CREATE_CLASS_CONTEXT,
  LIST_TUTOR_EMAILS_REQUEST,
  LIST_TUTOR_EMAILS_SUCCESS,
  LIST_TUTOR_EMAILS_FAILURE,
  LIST_SUBJECT_SUCCESS,
  LIST_SUBJECT_FAILURE,
  UPDATE_CLASS_TYPE,
  SET_EDIT_DATA,
  SET_EDIT_DATA_FALSE,
} from './create-class-constants';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import { getFormatedTime } from '../utils';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

export const CreateclassContext = createContext();

const CreateclassProvider = (props) => {
  const { children } = props;
  const { setAlert } = useContext(AlertNotificationContext);
  const initalState = {
    isEdit: false,
    editData: [],
    grades: [],
    sections: [],
    subjects: [],
    courses: [],
    studentList: [],
    filteredStudents: [],
    errorLoadingStudents: '',
    loadingStudents: false,
    isTutorEmailValid: false,
    isValidatingTutorEmail: null,
    creatingOnlineClass: false,
    isCreated: false,
    tutorEmails: [],
    tutorEmailsLoading: false,
    classTypeId: null,
  };

  const [state, dispatch] = useReducer(createClassReducer, initalState);

  // const { role_details: roleDetails } =
  //   JSON.parse(localStorage.getItem('userDetails')) || {};

  // all the actions related

  function request(type) {
    return { type };
  }

  function success(data, type) {
    return { type, payload: data };
  }

  function failure(error, type) {
    return { type, payload: error };
  }

  // const listTutorEmails = async (selectedDate, selectedTime, duration, info) => {
  //   dispatch(request(LIST_TUTOR_EMAILS_REQUEST));
  //   const startTime = `${selectedDate} ${getFormatedTime(selectedTime)}`;
  //   const { role_details: roleDetails } =
  //     JSON.parse(localStorage.getItem('userDetails')) || {};
  //   const { branchId, gradeId, sectionIds, subjectId } = info;

  //   try {
  //     const { data } = await axiosInstance.get(
  //       `/erp_user/tutor_availability_check/?erp_user_id=${roleDetails.erp_user_id}&start_time=${startTime}&duration=${duration}&branch_id=${branchId}&grade_id=${gradeId}&section_id=${sectionIds}&subject_id=${subjectId}`
  //     );
  //     if (data.status === 'success')
  //       dispatch(success(data.data, LIST_TUTOR_EMAILS_SUCCESS));
  //     else throw new Error(data.message);
  //   } catch (error) {
  //     dispatch(failure(error));
  //   }
  // };

  const listTutorEmails = async (reqData) => {
    const { branchIds, gradeIds,acadYears } = reqData;
    dispatch(request(LIST_TUTOR_EMAILS_REQUEST));

    try {
      const { data } = await axiosInstance.get(
        `/erp_user/teacher-list/?branch_id=${branchIds}&grade_id=${gradeIds}&session_year=${acadYears}`
      );
      if (data.status === 'success')
        dispatch(success(data.data, LIST_TUTOR_EMAILS_SUCCESS));
      else throw new Error(data?.message);
    } catch (error) {
      dispatch(failure(error, LIST_TUTOR_EMAILS_FAILURE));
    }
  };

  const clearTutorEmailsList = () => {
    dispatch(success([], LIST_TUTOR_EMAILS_SUCCESS));
  };

  const listGradesCreateClass = async (branch, moduleId, acadId) => {
    dispatch(request(LIST_GRADE_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branch.join(
          ','
        )}&module_id=${moduleId}`
      );
      if (data.status === 'success') dispatch(success(data.data, LIST_GRADE_SUCCESS));
      else throw new Error(data.message);
    } catch (error) {
      dispatch(failure(error, LIST_GRADE_FAILURE));
    }
  };

  const listCoursesCreateClass = async (gradeIds) => {
    dispatch(request(LIST_COURSE_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.academics.courses}?grade=${gradeIds.join(',')}`
      );
      if (data.status_code === 200) dispatch(success(data.result, LIST_COURSE_SUCCESS));
      else throw new Error(data.message);
    } catch (error) {
      dispatch(failure(error, LIST_COURSE_FAILURE));
    }
  };

  const listSectionsCreateClass = async (gradeId, moduleId) => {
    // dispatch(request(LIST_SECTION_REQUEST));
    // try {
    //   const { data } = await axiosInstance.get(
    //     `${endpoints.academics.sections}?branch_id=${branch.join(
    //       ','
    //     )}&grade_id=${gradeId}&module_id=${moduleId}`
    //   );
    //   if (data.status === 'success') {
    //     dispatch(success(data.data, LIST_SECTION_SUCCESS));
    //     return data.data;
    //   } else {
    //     throw new Error(data.message);
    //   }
    // } catch (error) {
    //   dispatch(failure(error, LIST_SECTION_FAILURE));
    // }
  };

  const listSectionAndSubjects = async (
    roleId,
    moduleId,
    erpId,
    isSuperUser,
    gradeIds,
    branchIds,
    acadId
  ) => {
    try {
      const { data } = await axiosInstance.get(
        `/erp_user/sub-sec-list/?role=${roleId}&module_id=${moduleId}&erp_id=${erpId}&is_super=${isSuperUser}&grade_id=${gradeIds.join(
          ','
        )}&branch_id=${branchIds.join(
          ','
        )}&session_year=${acadId}`
      );
      if (data.status === 'success') {
        const { section, subject } = data.data;
        dispatch(success(section, LIST_SECTION_SUCCESS));
        dispatch(success(subject, LIST_SUBJECT_SUCCESS));
      }
    } catch (error) {
      dispatch(failure(error, LIST_SECTION_FAILURE));
      dispatch(failure(error, LIST_SUBJECT_FAILURE));
    }
  };

  const listStudents = async (url) => {
    dispatch(request(LIST_STUDENT_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.filterStudent}?${url}`
      );
      if (data.status === 'success') dispatch(success(data.data, LIST_STUDENT_SUCCESS));
      else throw new Error(data.message);
    } catch (error) {
      dispatch(failure(error, LIST_STUDENT_FAILURE));
    }
  };

  const clearStudentsList = () => {
    dispatch(success([], LIST_STUDENT_SUCCESS));
  };

  const clearTutorEmailValidation = () => {
    return { type: CLEAR_VALIDATION };
  };

  const verifyTutorEmail = async (
    tutorEmail,
    selectedDate,
    selectedTime,
    duration,
    info
  ) => {
    const startTime = `${selectedDate} ${getFormatedTime(selectedTime)}`;
    const { role_details: roleDetails } =
      JSON.parse(localStorage.getItem('userDetails')) || {};
    dispatch(request(VERIFY_TUTOREMAIL_REQUEST));
    try {
      let url = `${endpoints.onlineClass.teacherAvailability}?erp_user_id=${roleDetails.erp_user_id}&tutor_email=${tutorEmail}&start_time=${startTime}&duration=${duration}`;
      const { branchId, gradeId, sectionIds, subjectId } = info;
      if (branchId) url += `&branch_id=${branchId}`;
      if (gradeId) url += `&grade_id=${gradeId}`;
      if (sectionIds) url += `&section_id=${sectionIds}`;
      if (subjectId) url += `&subject_id=${subjectId}`;
      const { data } = await axiosInstance.get(url);

      if (data.status === 'success') dispatch(success('', VERIFY_TUTOREMAIL_SUCCESS));
      else throw new Error(data.message);
    } catch (error) {
      const { response } = error || {};
      if (response?.data) setAlert('error', response.data.message);
      else setAlert('error', error.message);
      dispatch(failure(error, VERIFY_TUTOREMAIL_FAILURE));
    }
  };

  const createNewOnlineClass = async (formdata) => {
    dispatch(request(CREATE_NEW_CLASS_REQUEST));
    try {
      const { data } = await axiosInstance.post(
        `${endpoints.onlineClass.createClass}`,
        formdata
      );
      if (data.status === 'success')
        dispatch(success(initalState, CREATE_NEW_CLASS_SUCCESS));
      else {
        dispatch(success(initalState, CREATE_NEW_CLASS_FAILURE));
        setAlert('error', data.message || data.description);
      }
    } catch (error) {
      const { response } = error || {};
      if (response?.data)
        setAlert('error', response.data.message || response.data.description);
      else setAlert('error', response.data.message || response.data.description);
      dispatch(failure(error, CREATE_NEW_CLASS_FAILURE));
    }
  };

  const createSpecialOnlineClass = async (formdata) => {
    dispatch(request(CREATE_NEW_CLASS_REQUEST));
    try {
      const { data } = await axiosInstance.post(
        `${endpoints.onlineClass.createSpecialClass}`,
        formdata
      );
      if (data.status_code === 200)
        dispatch(success(initalState, CREATE_NEW_CLASS_SUCCESS));
      else {
        dispatch(success(initalState, CREATE_NEW_CLASS_FAILURE));
        setAlert('error', data.message || data.description);
      }
    } catch (error) {
      const { response } = error || {};
      if (response?.data)
        setAlert('error', response.data.message || response.data.description);
      else setAlert('error', response.data.message || response.data.description);
      dispatch(failure(error, CREATE_NEW_CLASS_FAILURE));
    }
  };

  const setClassTypeId = (classtype) => {
    return { type: UPDATE_CLASS_TYPE, payload: classtype };
  };

  const clearFilteredStudents = () => {
    return { type: CLEAR_FILERED_STUDENTS };
  };

  const clearGrades = () => {
    return { type: CLEAR_GRADE_DROP };
  };

  const clearSections = () => {
    return { type: CLEAR_SECTION_DROP };
  };

  const clearSubjects = () => {
    return { type: CLEAR_SUBJECT_DROP };
  };

  const clearCourses = () => {
    return { type: CLEAR_COURSE_DROP };
  };

  const listFilteredStudents = (students) => {
    return { type: LIST_FILTERED_STUDENTS, payload: students };
  };

  const resetContext = () => {
    return { type: RESET_CREATE_CLASS_CONTEXT, payload: initalState };
  };

  const setEditData = (data) => {
    return { type: SET_EDIT_DATA, payload: data };
  };

  const setEditDataFalse = (editData) => {
    return { type: SET_EDIT_DATA_FALSE, payload: [] };
  };

  return (
    <CreateclassContext.Provider
      value={{
        ...state,
        dispatch,
        listStudents,
        listGradesCreateClass,
        listCoursesCreateClass,
        listSectionsCreateClass,
        verifyTutorEmail,
        clearTutorEmailValidation,
        clearFilteredStudents,
        listFilteredStudents,
        setClassTypeId,
        createNewOnlineClass,
        createSpecialOnlineClass,
        resetContext,
        listTutorEmails,
        listSectionAndSubjects,
        clearTutorEmailsList,
        clearStudentsList,
        clearGrades,
        clearSections,
        clearSubjects,
        clearCourses,
        setEditData,
        setEditDataFalse,
      }}
    >
      {children}
    </CreateclassContext.Provider>
  );
};

CreateclassProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CreateclassProvider;
