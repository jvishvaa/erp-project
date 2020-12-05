import React from 'react';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import OnlineClassFilter from './components/online-class-filter';
import OnlineClassResourceTable from './components/online-class-resource-table';
import './online-class-resource.scss';

const OnlineClassResource = () => {
  return (
    <Layout>
      <div className='breadcrumb-container'>
        <CommonBreadcrumbs componentName='Online Class' childComponentName='Resources' />
      </div>
      <div className='viewclass__management-container'>
        <OnlineClassFilter />
        <OnlineClassResourceTable />
      </div>
    </Layout>
  );
};

export default OnlineClassResource;
