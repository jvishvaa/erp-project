import React from 'react';
import Layout from '../../Layout';
import OnlineClassFilter from './components/online-class-filter';
import OnlineClassResourceTable from './components/online-class-resource-table';
import './online-class-resource.scss';

const OnlineClassResource = () => {
  return (
    <div className='viewclass__management-container'>
      <Layout>
        <OnlineClassFilter />
        <OnlineClassResourceTable />
      </Layout>
    </div>
  );
};

export default OnlineClassResource;
