import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import TimeTableNewView from './TimeTableNewView';
import { Breadcrumb, Select, message, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const StudentTimeTable = () => {
  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>TimeTable</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row px-3'>
          <div className='col-12 th-bg-white'>
            <div className='row'>
              <div className='col-md-5 py-2'>
                <div className='d-flex align-items-center'>
                  <span className='th-fw-600'>Select Date Range: </span>
                  <span className='pl-2'>
                    <RangePicker />
                  </span>
                </div>
              </div>
            </div>
            <div></div>
            <div className='mt-3 px-2'>
              <TimeTableNewView />
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default StudentTimeTable;
