import React from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb } from 'antd';

const EditPeReportCardConfig = () => {
  return (
    <React.Fragment>
      <Layout>
        <div className='row pt-3 pb-2'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16 th-grey'>
                Assessment
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Edit Report Card Config
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default EditPeReportCardConfig;
