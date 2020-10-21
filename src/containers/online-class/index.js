import React from 'react';
// import CreateClass from './create-class/create-class';
import OnlineclassProvider from './online-class-context/online-class-state';
import ViewClassManagement from './view-class/view-class-management/view-class-management';
// import ViewClassStudentCollection from './view-class/view-class-student/view-class-student-collection';

const OnlineClass = () => {
  return (
    <OnlineclassProvider>
      {/* <ViewClassStudentCollection /> */}
      <ViewClassManagement />
      {/* <CreateClass /> */}
    </OnlineclassProvider>
  );
};

export default OnlineClass;
