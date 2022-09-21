import Layout from '../../containers/Layout';
import React from 'react';
import { DashboardContextProvider } from '../../containers/dashboard/dashboard-context/index.js';
import CreateclassProvider from '../../containers/online-class/create-class/create-class-context/create-class-state';
import Workshop from './Workshop';
import FeeReminder from 'v2/FaceLift/FeeReminder/FeeReminder';

const ConnectionPod = () => {
  return (
    <>
      <Layout>
        <FeeReminder />
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
