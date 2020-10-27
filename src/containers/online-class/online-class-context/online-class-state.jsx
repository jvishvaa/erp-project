import React, { createContext, useContext, useReducer } from 'react';
import Proptypes from 'prop-types';
import onlineClassReducer from './online-class-reducer';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import {
  STUDENT_ONLINECLASS_FAILURE,
  STUDENT_ONLINECLASS_REQUEST,
  STUDENT_ONLINECLASS_SUCCESS,
  CLASS_ACCEPT_SUCCESS,
  CLASS_JOIN_SUCCESS,
} from './online-class-constants';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

export const OnlineclassViewContext = createContext();

const OnlineclassViewProvider = (props) => {
  const { children } = props;

  const { setAlert } = useContext(AlertNotificationContext);

  const initalState = {
    studentView: {
      currentPage: 1,
      totalPages: 1,
      studentOnlineClasses: [],
      loadingStudentOnlineClasses: false,
      errorLoadingStudentOnlineClasses: '',
      currentServerTime: new Date(),
    },
    managementView: {},
  };

  const [state, dispatch] = useReducer(onlineClassReducer, initalState);

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

  const listOnlineClassesStudentView = async (
    userId,
    isCompleted,
    pageNo,
    pageSize = 10
  ) => {
    dispatch(request(STUDENT_ONLINECLASS_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.studentOnlineclasses}?user_id=${userId}&page_number=${pageNo}&page_size=${pageSize}&is_completed=${isCompleted}`
      );
      dispatch(success(data, STUDENT_ONLINECLASS_SUCCESS));
    } catch (error) {
      dispatch(failure(error, STUDENT_ONLINECLASS_FAILURE));
    }
  };

  const handleAccept = async (meetingId) => {
    try {
      const formData = new FormData();
      formData.append('user_online_class_id', meetingId);
      formData.append('accept', 'true');
      await axiosInstance.post(`${endpoints.onlineClass.acceptOrJoinClass}`, formData);
      dispatch(success(meetingId, CLASS_ACCEPT_SUCCESS));
    } catch (error) {
      setAlert('error', 'Failed to accept the class');
    }
  };

  const handleJoin = async (meetingId) => {
    try {
      const formData = new FormData();
      formData.append('user_online_class_id', meetingId);
      formData.append('join', 'true');
      const { data } = await axiosInstance.post(
        `${endpoints.onlineClass.acceptOrJoinClass}`,
        formData
      );
      window.open(data.message, '_blank');
      dispatch(success(meetingId, CLASS_JOIN_SUCCESS));
    } catch (error) {
      setAlert('error', 'Failed to join the class');
    }
  };

  return (
    <OnlineclassViewContext.Provider
      value={{
        ...state,
        dispatch,
        listOnlineClassesStudentView,
        handleAccept,
        handleJoin,
      }}
    >
      {children}
    </OnlineclassViewContext.Provider>
  );
};

OnlineclassViewProvider.propTypes = {
  children: Proptypes.node.isRequired,
};

export default OnlineclassViewProvider;
