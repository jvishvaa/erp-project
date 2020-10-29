import React from 'react';
import OnlineclassViewProvider from './online-class-context/online-class-state';
import CreateClass from './create-class/index';
// import OnlineclassProvider from './online-class-context/online-class-state';
import ViewClassManagement from './view-class/view-class-management/view-class-management';
import AttendeeList from './view-class/view-class-management/attendee-list/attendee-list';
import ViewClassStudentCollection from './view-class/view-class-student/view-class-student-collection';

const OnlineClass = () => {
  return (
    <OnlineclassViewProvider>
      {/* <CreateClass /> */}
      {/* <ViewClassManagement /> */}
      <ViewClassStudentCollection />
      {/* <AttendeeList /> */}
    </OnlineclassViewProvider>
  );
};

export default OnlineClass;
