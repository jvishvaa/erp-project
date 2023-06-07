import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import CoordinatorHomework from 'containers/homework/coordinator-homework';
import TeacherHomework from 'containers/homework/teacher-homework';
import CoordinatorTeacherHomeworkv2 from 'containers/homework/coordinator-homework/newMgmtView';
import axios from 'v2/config/axios';
import endpoints from 'config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import { IsV2Checker } from 'v2/isV2Checker';
import { Alert, Space, Spin, message } from 'antd';

const TeacherHwConfig = () => {
  const [configOn, setConfigOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isHWAutoAssign, setIsHWAutoAssign] = useState(false);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const isV2 = IsV2Checker();
  const fetchConfigStatus = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.academics.homeworkConfig}`, {})
      .then((response) => {
        let checkActive = response?.data?.result.includes(
          selectedBranch?.branch?.id.toString()
        );
        setConfigOn(checkActive);
        setLoading(false);
      })
      .catch((error) => setLoading(false));
  };

  const fetchAllowAutoHWAssign = () => {
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=hw_auto_asgn`)
      .then((response) => {
        if (response?.data?.result) {
          if (response?.data?.result.includes(String(selectedBranch?.branch?.id))) {
            setIsHWAutoAssign(true);
          } else {
            setIsHWAutoAssign(false);
          }
        }
      })
      .catch((error) => {
        message.error('error', error?.message);
      });
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchConfigStatus();
      fetchAllowAutoHWAssign();
    }
  }, [selectedBranch]);
  return (
    <>
      {loading ? (
        <div style={{ marginTop: '50vh', display: 'flex', justifyContent: 'center' }}>
          <Spin tip='Loading' size='Large' />
        </div>
      ) : (
        <>
          {configOn ? (
            <CoordinatorTeacherHomeworkv2 isHWAutoAssign={isHWAutoAssign} />
          ) : (
            <TeacherHomework />
          )}
        </>
      )}
    </>
  );
};

export default TeacherHwConfig;
