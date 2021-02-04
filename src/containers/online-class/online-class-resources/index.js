import React from 'react';
import Layout from '../../Layout';
import Resources from './resources';
import OnlineclassViewProvider from '../online-class-context/online-class-state';

const ResourceView = () => {
  return (
    <div>
      <Layout>
        <OnlineclassViewProvider>
          <Resources />
        </OnlineclassViewProvider>
      </Layout>
    </div>
  );
};

export default ResourceView;
