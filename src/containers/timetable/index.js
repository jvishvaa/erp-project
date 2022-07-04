import React, { useEffect, useState } from 'react';
import TimeTableNew from '../time-table/index';
import TimeTableOld from '../time-table-old/index';
import TeacherTimeTable from './teacherTimeTable'

const TimeTableCheck = () => {
  const [periodConfig, setPeriodConfig] = useState(null);
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const isTeacher = user_level == 11;

  useEffect(() => {
    const erp_config = JSON.parse(localStorage.getItem('userDetails'))?.erp_config;
    setPeriodConfig(erp_config);
  }, [periodConfig]);
  return (
    <>
      {isTeacher ?
        <TeacherTimeTable />
      : <TimeTableNew />}
    </>
  );
};

export default TimeTableCheck;
