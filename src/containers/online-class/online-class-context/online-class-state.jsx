import React, { useReducer, createContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import onlineclassReducer from './online-class-reducer';
import {
  LIST_GRADE_FAILURE,
  LIST_GRADE_REQUEST,
  LIST_GRADE_SUCCESS,
  LIST_SECTION_FAILURE,
  LIST_SECTION_REQUEST,
  LIST_SECTION_SUCCESS,
} from './online-class-constants';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';

export const OnlineclassContext = createContext();

const OnlineclassProvider = (props) => {
  const { children } = props;
  const initalState = {
    createOnlineClass: {
      grades: [],
      sections: [],
      loading: false,
      message: null,
    },
  };

  const [state, dispatch] = useReducer(onlineclassReducer, initalState);

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
      const response = await axiosInstance.get(
        `${endpoints.academics.grades}?branch_id=1`
      );
      dispatch(success(response.data, LIST_GRADE_SUCCESS));
    } catch (error) {
      dispatch(failure(error, LIST_GRADE_FAILURE));
    }
  };

  const listSectionsCreateClass = async (gradeId) => {
    dispatch(request(LIST_SECTION_REQUEST));
    try {
      const response = await axiosInstance.get(
        `${endpoints.academics.sections}?branch_id=1&grade_id=${gradeId}`
      );
      dispatch(success(response.data, LIST_SECTION_SUCCESS));
    } catch (error) {
      dispatch(failure(error, LIST_SECTION_FAILURE));
    }
  };

  return (
    <OnlineclassContext.Provider
      value={{
        ...state,
        dispatch,
        listGradesCreateClass,
        listSectionsCreateClass,
      }}
    >
      {children}
    </OnlineclassContext.Provider>
  );
};

OnlineclassProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OnlineclassProvider;
