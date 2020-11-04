import React from 'react';
import Layout from '../../Layout';
import ViewClassManagementFilters from '../view-class/view-class-management/components/view-class-management-filters';
import OnlineClassResourceTable from './components/online-class-resource-table';
import './online-class-resource.scss';

const OnlineClassResource = () => {
  return (
    <Layout>
      <ViewClassManagementFilters />
      <OnlineClassResourceTable />
    </Layout>
  );
};

export default OnlineClassResource;
