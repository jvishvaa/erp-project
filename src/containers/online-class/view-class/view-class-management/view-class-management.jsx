import React from 'react';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import ViewClassManagementFilters from './components/view-class-management-filters';
import ViewClassManagementTable from './components/view-class-management-table';
import './view-class-management.scss';

const ViewClassManagement = () => {
  return (
    <Layout>
      <div className='breadcrumb-container'>
        <CommonBreadcrumbs componentName='Online Class' childComponentName='View Class' />
      </div>
      <div className='viewclass__management-container'>
        <ViewClassManagementFilters />
        <ViewClassManagementTable />
      </div>
    </Layout>
  );
};

export default ViewClassManagement;
