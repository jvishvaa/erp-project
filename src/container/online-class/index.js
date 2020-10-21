import React from 'react';
import OnlineclassProvider from './online-class-context/online-class-state';
import ViewClassManagement from './view-class/view-class-management/view-class-management';
// import ViewClassStudentCollection from './view-class/view-class-student/view-class-student-collection';

const OnlineClass = () => {
  return (
    <OnlineclassProvider>
      {/* <ViewClassStudentCollection /> */}
      <ViewClassManagement />
    </OnlineclassProvider>
  );
};

export default OnlineClass;
