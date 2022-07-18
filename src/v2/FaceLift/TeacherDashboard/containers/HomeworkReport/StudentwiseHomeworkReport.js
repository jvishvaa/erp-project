import React from 'react';
import Layout from 'v2/Layout';
import { Table, Breadcrumb, Select, Avatar, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import demoPic from 'v2/Assets/images/student_pic.png';
import fileIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/fileIcon.svg';
const { Option } = Select;

const studentwiseReportData = [
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    submitted_on: '03/06/22',
    score: 37,
    id: 1,
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    submitted_on: '03/06/22',
    score: 'Evaluate',
    id: 1,
  },
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    submitted_on: '',
    score: '',
    id: 2,
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    submitted_on: '03/06/22',
    score: 37,
    id: 3,
  },
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    submitted_on: '',
    score: '',
    id: 4,
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    submitted_on: '03/06/22',
    score: 37,
    id: 5,
  },
];

const StudentwiseHomeworkReport = () => {
  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>STUDENTS</span>,
      align: 'left',
      width: '60%',
      render: (text, row) => (
        <div className='d-flex align-items-center pl-4'>
          <Avatar size={40} src={demoPic} />
          <div className='d-flex flex-column px-2 '>
            <span className='th-black-1'>{row.studentName}</span>
            <span className='th-grey th-14'>{row.erp}</span>
          </div>
        </div>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>SUBMITTED ON</span>,
      dataIndex: 'submitted_on',
      align: 'center',
      render: (text, row) =>
        row.submitted_on.length > 0 ? (
          <span className='th-black-1'>{row.submitted_on}</span>
        ) : (
          <span className='th-red'>Not Submitted</span>
        ),
    },
    {
      title: <span className='th-white th-fw-700'>SCORE OUT OF 40</span>,
      dataIndex: 'score',
      align: 'center',
      render: (text, row) =>
        row.submitted_on.length > 0 ? (
          isNaN(row.score) ? (
            <u className='th-primary'>{row.score}</u>
          ) : (
            <span className='th-black-1'>{row.score}</span>
          )
        ) : (
          '-'
        ),
    },
    {
      title: '',
      align: 'left',
      width: '5%',
      render: (text, row) => (
        <span className='pr-4'>
          {row.submitted_on.length > 0 ? <img src={fileIcon} /> : '-'}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className='row th-16 py-3 px-2'>
        <div className='col-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-dashboard' className='th-grey th-16'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/homework-report' className='th-grey th-16'>
              Homework Report
            </Breadcrumb.Item>
            <Breadcrumb.Item
              href='/subjectwise-homework-report'
              className='th-grey th-16'
            >
              Subjectwise Report
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/titlewise-homework-report' className='th-grey th-16'>
              Homeworks
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Students</Breadcrumb.Item>
          </Breadcrumb>
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
              Homework: <span className='th-primary'>Title</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Assigned On: <span className='th-primary'>03/06/22</span>
            </div>

            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Due Date: <span className='th-primary'>15/06/22</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Total Marks: <span className='th-primary'>40</span>
            </div>

            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Total Students: <span className='th-primary'>80</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Students Submitted: <span className='th-green'>75</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Students Pending: <span className='th-red'>28</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Students Evaluated: <span className='th-primary'>70</span>
            </div>

            <div className='col-md-2 col-12 th-custom-col-padding pb-2'>
              <Input
                className='th-bg-grey th-br-4'
                placeholder='Search a student'
                suffix={<SearchOutlined />}
                bordered={false}
              />
            </div>
            <div className='col-md-2 col-12 th-custom-col-padding pb-2'>
              <Select
                defaultValue={'All Students'}
                className='th-grey th-bg-grey th-br-4 w-100'
                bordered={false}
              >
                <Option value='1'>All Students</Option>
                <Option value='2'>Pending</Option>
                <Option value='2'>Submitted</Option>
                <Option value='2'>Evaluated</Option>
                <Option value='2'>Not Evaluated</Option>
              </Select>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={studentwiseReportData}
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

export default StudentwiseHomeworkReport;
