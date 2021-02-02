import React from 'react';
import CreateclassProvider from '../create-class-context/create-class-state';
import ClassUpdate from './class-update';

const ClassUpdation = () => {
  return (
    <div>
        <CreateclassProvider>
          <ClassUpdate />
        </CreateclassProvider>
    </div>
  );
};

export default ClassUpdation;
