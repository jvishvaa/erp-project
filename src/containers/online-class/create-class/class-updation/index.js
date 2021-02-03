import React from 'react';
import CreateclassProvider from '../create-class-context/create-class-state';
import ClassUpdate from './class-update';

const ClassUpdation = (props) => {
  return (
    <div>
      <CreateclassProvider>
        <ClassUpdate {...props} />
      </CreateclassProvider>
    </div>
  );
};

export default ClassUpdation;
