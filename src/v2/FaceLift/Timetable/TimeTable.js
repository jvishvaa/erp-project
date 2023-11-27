import React from 'react';
import TeacherTimeTable from './TeacherTimeTable';
import PrincipalTimeTable from './PrincipalTimeTable/PrincipalTimeTable';

const TimeTable = () => {
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  return <div>{user_level === 11 ? <TeacherTimeTable /> : <PrincipalTimeTable />}</div>;
};

export default TimeTable;
