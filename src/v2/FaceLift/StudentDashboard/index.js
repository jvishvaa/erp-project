import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import StudentDashboardConfigOff from './StudentDashboardConfigOff';
import StudentDashboardConfigOn from './studentDashboardConfigOn';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';

const StudentDashboardNew = () => {
  const [configOn, setConfigOn] = useState(true);
  const [newTimeTable, setNewTimeTable] = useState(false);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
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
          setConfigOn(response?.data?.dashboard_enabled);
        }
      })
      .catch((error) => console.log(error));
  };
  const CheckTimetableConfig = () => {
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=tt-enabled-v2`)
      .then((response) => {
        if (response?.data?.result?.includes(String(selectedBranch?.branch?.id))) {
          setNewTimeTable(true);
        } else {
          setNewTimeTable(false);
        }
      })
      .catch((error) => console.error('error', error?.message))
      .finally(() => {});
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchConfigStatus({ branch_id: selectedBranch?.branch?.id });
      CheckTimetableConfig();
    }
  }, [selectedBranch]);
  return (
    <Layout>
      <div className=''>
        {configOn ? (
          <StudentDashboardConfigOn newTimeTable={newTimeTable} />
        ) : (
          <StudentDashboardConfigOff />
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboardNew;
