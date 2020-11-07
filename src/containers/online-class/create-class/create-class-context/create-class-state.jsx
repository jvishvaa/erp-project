import React, { useReducer, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import createClassReducer from './create-class-reducer';
import {
  LIST_GRADE_FAILURE,
  LIST_GRADE_REQUEST,
  LIST_GRADE_SUCCESS,
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
  LIST_FILTERED_STUDENTS,
  CREATE_NEW_CLASS_REQUEST,
  CREATE_NEW_CLASS_SUCCESS,
  CREATE_NEW_CLASS_FAILURE,
  RESET_CREATE_CLASS_CONTEXT,
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
    grades: [],
    sections: [],
    studentList: [],
    filteredStudents: [],
    errorLoadingStudents: '',
    loadingStudents: false,
    isTutorEmailValid: null,
    isValidatingTutorEmail: null,
    creatingOnlineClass: false,
    isCreated: false,
  };

  const [state, dispatch] = useReducer(createClassReducer, initalState);

  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};

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

  const listGradesCreateClass = async (moduleId) => {
    dispatch(request(LIST_GRADE_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.academics.grades}?branch_id=${roleDetails.branch.join(
          ','
        )}&module_id=${moduleId}`
      );
      if (data.status === 'success') dispatch(success(data.data, LIST_GRADE_SUCCESS));
      else throw new Error(data.message);
    } catch (error) {
      dispatch(failure(error, LIST_GRADE_FAILURE));
    }
  };

  const listSectionsCreateClass = async (gradeId, moduleId) => {
    dispatch(request(LIST_SECTION_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.academics.sections}?branch_id=${roleDetails.branch.join(
          ','
        )}&grade_id=${gradeId}&module_id=${moduleId}`
      );
      if (data.status === 'success') {
        dispatch(success(data.data, LIST_SECTION_SUCCESS));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(failure(error, LIST_SECTION_FAILURE));
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
    } catch (error) {
      const { response } = error || {};
      if (response?.data && response.data.message)
        setAlert('error', response.data.message);
      else setAlert('error', error.message);
      dispatch(failure(error, CREATE_NEW_CLASS_FAILURE));
    }
  };

  const clearFilteredStudents = () => {
    return { type: CLEAR_FILERED_STUDENTS };
  };

  const listFilteredStudents = (students) => {
    return { type: LIST_FILTERED_STUDENTS, payload: students };
  };

  const resetContext = () => {
    return { type: RESET_CREATE_CLASS_CONTEXT, payload: initalState };
  };

  return (
    <CreateclassContext.Provider
      value={{
        ...state,
        dispatch,
        listStudents,
        listGradesCreateClass,
        listSectionsCreateClass,
        verifyTutorEmail,
        clearTutorEmailValidation,
        clearFilteredStudents,
        listFilteredStudents,
        createNewOnlineClass,
        resetContext,
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
