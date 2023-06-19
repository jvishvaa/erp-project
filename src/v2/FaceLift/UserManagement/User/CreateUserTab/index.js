import { Breadcrumb, Tabs } from 'antd';
import React from 'react';
import Layout from 'containers/Layout';
import CreateUser from '../CreateUser';
import BulkUpload from '../CreateUser/BulkUpload';
const { TabPane } = Tabs;
const CreateUserTab = () => {
  return (
    <React.Fragment>
      <Layout>
        <div className='row pt-3'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                href='/user-management/view-users'
                className='th-black-1 th-16 th-grey'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Create User</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row pt-3'>
          <div className='col-md-12'>
            <div className='th-tabs th-bg-white mb-3'>
              <Tabs type='card' onChange={(e) => console.log(e)}>
                <TabPane tab='Create User' key='1'>
                  <CreateUser />
                </TabPane>
                <TabPane tab='Bulk Upload' key='2'>
                  <BulkUpload />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default CreateUserTab;
