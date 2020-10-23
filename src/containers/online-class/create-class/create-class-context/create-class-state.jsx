import React, { useReducer, createContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
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
} from './create-class-constants';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';

export const CreateclassContext = createContext();

const CreateclassProvider = (props) => {
  const { children } = props;
  const initalState = {
    grades: [],
    sections: [],
    studentList: [],
    errorLoadingStudents: '',
    loadingStudents: false,
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

  return (
    <CreateclassContext.Provider
      value={{
        ...state,
        dispatch,
        listStudents,
        listGradesCreateClass,
        listSectionsCreateClass,
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
