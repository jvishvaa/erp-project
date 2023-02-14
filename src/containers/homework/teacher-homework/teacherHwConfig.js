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
import { Alert, Space, Spin } from 'antd';

const TeacherHwConfig = () => {
  const [configOn, setConfigOn] = useState(true);
  const [loading, setLoading] = useState(false)
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const isV2 = IsV2Checker();
  console.log(isV2, 'v2');
  const fetchConfigStatus = (params = {}) => {
    setLoading(true)
    axios
      .get(`${endpoints.academics.homeworkConfig}`, {
      })
      .then((response) => {
        console.log(response);
        let checkActive = response?.data?.result.includes(selectedBranch?.branch?.id.toString())
        console.log(checkActive, 'ceck');
        setConfigOn(checkActive)
        setLoading(false)
      })
      .catch((error) =>
        setLoading(false));
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchConfigStatus();
    }
  }, [selectedBranch]);
  return (
    <>
      {loading ?
      <div style={{marginTop: '50vh' , display: 'flex', justifyContent: 'center'}}>
        <Spin tip='Loading' size='Large' /> 
      </div> :
        <>
          {configOn ? <CoordinatorTeacherHomeworkv2 /> : <TeacherHomework />}
        </>}
    </>
  );
};

export default TeacherHwConfig;
