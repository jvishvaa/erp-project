import Layout from '../../containers/Layout';
import React from 'react';
import { DashboardContextProvider } from '../../containers/dashboard/dashboard-context/index.js';
import CreateclassProvider from '../../containers/online-class/create-class/create-class-context/create-class-state';
import Workshop from './Workshop';

const ConnectionPod = () => {
  return (
    <>
      <Layout>
        <DashboardContextProvider>
          <CreateclassProvider>
            <Workshop />
          </CreateclassProvider>
        </DashboardContextProvider>
      </Layout>
    </>
  );
};

export default ConnectionPod;
