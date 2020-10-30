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
  MANAGEMENT_ONLINECLASS_REQUEST,
  MANAGEMENT_ONLINECLASS_FAILURE,
  MANAGEMENT_ONLINECLASS_SUCCESS,
  LIST_GRADE_REQUEST,
  LIST_GRADE_FAILURE,
  LIST_GRADE_SUCCESS,
  LIST_SECTION_FAILURE,
  LIST_SECTION_REQUEST,
  LIST_SECTION_SUCCESS,
  CANCEL_CLASS,
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
    managementView: {
      currentPage: 1,
      totalPages: 1,
      managementOnlineClasses: [],
      loadingManagementOnlineClasses: false,
      errorLoadingManagementOnlineClasses: '',
      currentServerTime: new Date(),
    },
    grades: [],
    sections: [],
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

  const listOnlineClassesManagementView = async (url) => {
    dispatch(request(MANAGEMENT_ONLINECLASS_REQUEST));
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.managementOnlineClass}?${url}`
      );
      dispatch(success(data, MANAGEMENT_ONLINECLASS_SUCCESS));
    } catch (error) {
      dispatch(failure(error, MANAGEMENT_ONLINECLASS_FAILURE));
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

  const listGrades = async () => {
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

  const listSections = async (gradeId) => {
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

  const cancelClass = async (id) => {
    try {
      dispatch(success(id, CANCEL_CLASS));
      const formData = { zoom_meeting_id: id, is_canceled: 'true' };
      const { data } = await axiosInstance.put(
        `${endpoints.onlineClass.cancelClass}`,
        formData
      );
    } catch (error) {
      setAlert('error', 'Failed to cancel class');
    }
  };

  return (
    <OnlineclassViewContext.Provider
      value={{
        ...state,
        dispatch,
        listOnlineClassesStudentView,
        listOnlineClassesManagementView,
        handleAccept,
        handleJoin,
        listGrades,
        listSections,
        cancelClass,
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
