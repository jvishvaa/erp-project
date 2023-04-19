import { Breadcrumb, Button, Checkbox, Steps, message } from 'antd';
import Layout from 'containers/Layout';
import React, { useState } from 'react';
import SchoolDetails from './school-details';
import UserDetails from './user-details';
import UploadExcel from './upload-excel';
const { Step } = Steps;

const steps = [
  {
    title: 'School Details',
    content: <SchoolDetails />,
  },
  {
    title: 'User Details',
    content: <UserDetails />,
  },
];

const CreateNoAcademicStaff = () => {
  const [current, setCurrent] = useState(0);
  const [excelUpload, setExcelUpload] = useState(true);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  console.log({ excelUpload });

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href='/user-management/view-users'
                className='th-grey th-16'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Create Non Academic Staff
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row my-3 pl-2'>
          <div className='col-md-10'>
            <Checkbox onChange={(e) => setExcelUpload(e.target.checked)}>
              Upload Excel
            </Checkbox>
          </div>
        </div>

        {excelUpload ? (
          <div className='row mt-3'>
            <div className='col-md-12 col-sm-12 col-12'>
              <UploadExcel />
            </div>
          </div>
        ) : (
          <>
            {/* STEP */}
            <div className='row mt-3 justify-content-center'>
              <div className='col-md-8 col-sm-10 col-12'>
                <div>
                  <Steps current={current} labelPlacement='vertical'>
                    {steps.map((item) => (
                      <Step key={item.title} title={item.title} />
                    ))}
                  </Steps>
                </div>
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col-md-12 col-sm-12 col-12'>
                <div className='steps-content'>{steps[current].content}</div>
                <div className='row'>
                  <div className='col-md-5'>
                    <div className='steps-action'>
                      {current > 0 && (
                        <Button className='mr-3' onClick={() => prev()}>
                          Back
                        </Button>
                      )}
                      {current < steps.length - 1 && (
                        <Button type='primary' onClick={() => next()}>
                          Next
                        </Button>
                      )}
                      {current === steps.length - 1 && (
                        <Button
                          type='primary'
                          onClick={() => message.success('Processing complete!')}
                        >
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Layout>
    </React.Fragment>
  );
};

export default CreateNoAcademicStaff;
