import React from 'react';
import CreateclassProvider from './create-class-context/create-class-state';
import CreateClassForm from './create-class-form';

const CreateClass = () => {
  return (
    <div>
      <CreateclassProvider>
        <CreateClassForm />
      </CreateclassProvider>
    </div>
  );
};

export default CreateClass;
