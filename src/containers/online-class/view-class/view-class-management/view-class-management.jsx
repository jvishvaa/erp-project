import React from 'react';
import ViewClassManagementFilters from './components/view-class-management-filters';
import ViewClassManagementTable from './components/view-class-management-table';
import './view-class-management.scss';

const ViewClassManagement = () => {
  return (
    <div className='viewclass__management-container'>
      <ViewClassManagementFilters />
      <ViewClassManagementTable />
    </div>
  );
};

export default ViewClassManagement;
