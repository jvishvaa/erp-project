import React from 'react';
import Layout from '../../Layout';
import CreateclassProvider from './create-class-context/create-class-state';
import CreateClassForm from './create-class-form';

const CreateClass = () => {
  return (
    <div>
      <Layout>
        <CreateclassProvider>
          <CreateClassForm />
        </CreateclassProvider>
      </Layout>
    </div>
  );
};

export default CreateClass;
