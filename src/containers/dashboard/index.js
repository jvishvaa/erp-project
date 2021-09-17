import React from 'react';
import Dashboard from './dashboard';
import Layout from '../Layout';
import { DashboardContextProvider } from './dashboard-context';

const DashboardWrapper = () => {
  return (
    <Layout>
      <DashboardContextProvider>
        <Dashboard />
      </DashboardContextProvider>
    </Layout>
  );
};

export default DashboardWrapper;
