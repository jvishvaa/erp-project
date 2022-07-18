import React from 'react';
import Layout from 'v2/Layout';
import { Table, Breadcrumb, DatePicker, Avatar, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import demoPic from 'v2/Assets/images/student_pic.png';
import fileIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/fileIcon.svg';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';

const studentwiseAssessmentData = [
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    score: 37,
    id: 1,
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    score: 34,
    id: 2,
  },
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    score: 33,
    id: 3,
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    submitted_on: '03/06/22',
    score: 37,
    id: 4,
  },
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    score: 36,
    id: 5,
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    score: 37,
    id: 6,
  },
];

const StudentPerformance = () => {
  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>STUDENTS DETAILS</span>,
      align: 'left',
      width: '60%',
      render: (text, row) => (
        <div className='d-flex align-items-center pl-4'>
          <Avatar size={40} src={demoPic} />
          <div className='d-flex flex-column px-2 '>
            <span className='th-black-1 th-16'>{row.studentName}</span>
            <span className='th-grey th-14'>{row.erp}</span>
          </div>
        </div>
      ),
    },

    {
      title: <span className='th-white th-fw-700'>SCORE</span>,
      dataIndex: 'score',
      align: 'center',
      width: '20%',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: '',
      align: 'left',
      width: '10%',
      render: (data) => <img src={fileIcon} />,
    },
  ];

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-dashboard' className='th-grey'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/assessment-report' className='th-grey'>
              Assessment
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/subjectwise-assessment-report' className='th-grey'>
              Subject Wise Assessment
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/tests-report' className='th-grey'>
              Tests
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>Student Performance</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
          <span className='th-br-4 p-1 th-bg-white'>
            <img src={calendarIcon} className='pl-2' />
            <DatePicker
              allowClear={false}
              bordered={false}
              placement='bottomRight'
              placeholder={'Till Date'}
              // onChange={(value) => handleDateChange(value)}
              showToday={false}
              suffixIcon={<DownOutlined className='th-black-1' />}
              className='th-black-2 pl-0 th-date-picker'
              format={'DD/MM/YYYY'}
            />
          </span>
        </div>
        <div className='col-12 '>
          <div className='row th-13 mt-3 pt-2 th-bg-white th-br-4 align-items-center text-left th-fw-500 th-grey'>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Grade <span className='th-primary'>1A</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Subject: <span className='th-primary'>Mathematics</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Test: <span className='th-primary'>Weekly Test 1</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Conducted On: <span className='th-primary'>03/06/22</span>
            </div>
          </div>
          <div className='row th-13 pt-2 th-bg-white th-br-4 align-items-center text-left th-fw-500 th-grey'>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Total Students: <span className='th-primary'>80</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Total Marks: <span className='th-primary'>75</span>
            </div>

            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Class Average: <span className='th-primary'>70</span>
            </div>

            <div className='col-md-2 col-12 th-custom-col-padding pb-2'>
              <Input
                className='th-bg-grey th-br-4'
                placeholder='Search a student'
                suffix={<SearchOutlined />}
                bordered={false}
              />
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={studentwiseAssessmentData}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentPerformance;
