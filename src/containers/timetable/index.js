import React, { useEffect, useState } from 'react';
import TimeTableNew from '../time-table/index';
import TimeTableOld from '../time-table-old/index';
import TeacherTimeTable from './teacherTimeTable';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { Spin, message } from 'antd';
import StudentTimeTable from 'v2/FaceLift/Timetable/StudentTimeTable';
import PrincipalTimeTable from 'v2/FaceLift/Timetable/PrincipalTimeTable/PrincipalTimeTable';

const TimeTableCheck = () => {
  const [periodConfig, setPeriodConfig] = useState(null);
  const user_level = JSON.parse(localStorage.getItem('userDetails'))?.user_level || {};
  const isTeacher = user_level == 11;
  const isStudent = user_level === 13;
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [showNewTimeTable, setShowNewTimeTable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const erp_config = JSON.parse(localStorage.getItem('userDetails'))?.erp_config;
    setPeriodConfig(erp_config);
  }, [periodConfig]);

  const CheckTimetableConfig = () => {
    setLoading(true);
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=tt-enabled-v2`)
      .then((response) => {
        if (response?.data?.result?.includes(String(selectedBranch?.branch?.id))) {
          setShowNewTimeTable(true);
        } else {
          setShowNewTimeTable(false);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (selectedBranch?.branch?.id) {
      CheckTimetableConfig();
    }
  }, [selectedBranch]);
  return (
    <>
      <Spin spinning={loading}>
        {loading ? null : showNewTimeTable ? (
          isStudent ? (
            <StudentTimeTable />
          ) : (
            <PrincipalTimeTable />
          )
        ) : isTeacher ? (
          <TeacherTimeTable />
        ) : (
          <TimeTableNew />
        )}
      </Spin>
    </>
  );
};

export default TimeTableCheck;
