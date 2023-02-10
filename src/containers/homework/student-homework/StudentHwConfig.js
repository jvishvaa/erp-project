import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import StudentHomework from 'containers/homework/student-homework/student-homework';
import StudentHomeworkNew from 'containers/homework/student-homework/studentSide';

import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import { IsV2Checker } from 'v2/isV2Checker';

const StudentHwConfig = () => {
  const [configOn, setConfigOn] = useState(true);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const isV2 = IsV2Checker();
  console.log(isV2 , 'v2');
  const fetchConfigStatus = (params = {}) => {
    axios
      .get(`${endpoints.studentDashboard.checkConfigStatus}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // setConfigOn(response?.data?.dashboard_enabled);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchConfigStatus({ branch_id: selectedBranch?.branch?.id });
    }
  }, [selectedBranch]);
  return (
   <>
        {configOn ? <StudentHomeworkNew /> : <StudentHomework />}
    </>
  );
};

export default StudentHwConfig;
