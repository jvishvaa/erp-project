import React from 'react';
import OnlineclassProvider from './online-class-context/online-class-state';
import ViewClassStudentCollection from './view-class/view-class-student/view-class-student-collection';

const OnlineClass = () => {
  return (
    <OnlineclassProvider>
      <ViewClassStudentCollection />
    </OnlineclassProvider>
  );
};

export default OnlineClass;
