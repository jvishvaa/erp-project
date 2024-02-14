import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import TeacherDashboardConfigOff from './TeacherDashboardConfigOff';
import TeacherDashboardConfigOn from './TeacherDashboardConfigOn';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';

const TeacherDashoboardNew = () => {
  const [configOn, setConfigOn] = useState(true);
  const [newTimeTable, setNewTimeTable] = useState(null);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const fetchConfigStatus = (params = {}) => {
    axios
      .get(`${endpoints.doodle.checkDoodle}`, { params: { ...params } })
      .then((response) => {
        if (response?.data?.result) {
          if (response?.data?.result.includes(String(selectedBranch?.branch?.id))) {
            setConfigOn(true);
          } else {
            setConfigOn(false);
          }
        }
      })
      .catch((error) => {
        console.error('error', error?.message);
      });
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
      fetchConfigStatus({ config_key: 'teacher_dashboard_cfg' });
      CheckTimetableConfig();
    }
  }, [selectedBranch]);
  return (
    <Layout>
      <div className=''>
        {configOn ? (
          <TeacherDashboardConfigOn newTimeTable={newTimeTable} />
        ) : (
          <TeacherDashboardConfigOff />
        )}
      </div>
    </Layout>
  );
};

export default TeacherDashoboardNew;
