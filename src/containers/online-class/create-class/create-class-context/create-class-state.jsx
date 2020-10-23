import React, { useReducer, createContext } from 'react';
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
} from './create-class-constants';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import { getFormatedTime } from '../utils';

export const CreateclassContext = createContext();

const CreateclassProvider = (props) => {
  const { children } = props;
  const initalState = {
    grades: [],
    sections: [],
    studentList: [],
    errorLoadingStudents: '',
    loadingStudents: false,
    isTutorEmailValid: null,
    isValidatingTutorEmail: null,
  };

  const [state, dispatch] = useReducer(createClassReducer, initalState);

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

  const listGradesCreateClass = async () => {
    dispatch(request(LIST_GRADE_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.academics.grades}?branch_id=1`
      );
      if (data.status === 'success') dispatch(success(data.data, LIST_GRADE_SUCCESS));
      else throw new Error(data.message);
    } catch (error) {
      dispatch(failure(error, LIST_GRADE_FAILURE));
    }
  };

  const listSectionsCreateClass = async (gradeId) => {
    dispatch(request(LIST_SECTION_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.academics.sections}?branch_id=1&grade_id=${gradeId}`
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

  const verifyTutorEmail = async (tutorEmail, selectedDate, selectedTime, duration) => {
    const startTime = `${selectedDate} ${getFormatedTime(selectedTime)}`;
    dispatch(request(VERIFY_TUTOREMAIL_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.teacherAvailability}?tutor_email=${tutorEmail}&start_time=${startTime}&duration=${duration}`
      );
      if (data.status === 'success') dispatch(success('', VERIFY_TUTOREMAIL_SUCCESS));
    } catch (error) {
      const { response } = error || {};
      if (response?.data) window.alert(response.data.message);
      else window.alert(error.message);
      dispatch(failure(error, VERIFY_TUTOREMAIL_FAILURE));
    }
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
