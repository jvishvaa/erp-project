import React, { useState } from 'react';
import Layout from 'containers/Layout';
import { Table, Breadcrumb, DatePicker, Avatar, Input, Select, Checkbox } from 'antd';
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
const { Option } = Select;

const StudentwiseHomework = () => {
  const [submittedCheckedID, setSubmittedCheckedID] = useState([]);
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSubmittedCheckedID([...submittedCheckedID, id]);
    } else {
      const index = submittedCheckedID.indexOf(id);
      if (index > -1) {
        const newList = submittedCheckedID.slice();
        newList.splice(index, 1);
        setSubmittedCheckedID(newList);
      }
    }
  };

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>STUDENTS</span>,
      align: 'left',
      width: '50%',
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
      title: <span className='th-white th-fw-700'>SUBMITTED</span>,
      dataIndex: 'score',
      align: 'center',
      width: '20%',
      render: (text, row) => (
        <Checkbox
          onChange={(e) => handleCheckboxChange(e, row?.id)}
          className='th-custom-checkbox'
        />
      ),
    },
    {
      title: <span className='th-white th-fw-700'>EVALUATED</span>,
      dataIndex: 'score',
      align: 'center',
      width: '20%',
      render: (text, row) =>
        submittedCheckedID?.includes(row?.id) ? <Checkbox defaultChecked={true} /> : '-',
    },
    {
      title: '',
      align: 'left',
      width: '10%',
      render: (text, row) =>
        submittedCheckedID?.includes(row?.id) && <img src={fileIcon} />,
    },
  ];

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-homework' className='th-grey'>
              Teacher Homework
            </Breadcrumb.Item>

            <Breadcrumb.Item className='th-black-1'>Students</Breadcrumb.Item>
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
              Homework: <span className='th-primary'>Title</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Assigned On: <span className='th-primary'>03/06/22</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Due Date: <span className='th-primary'>03/06/22</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Total Marks: <span className='th-primary'>40</span>
            </div>
          </div>
          <div className='row th-13 pt-2 th-bg-white th-br-4 align-items-center text-left th-fw-500 th-grey'>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Total Students: <span className='th-primary'>80</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Students Submitted: <span className='th-green'>75</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Students Pending: <span className='th-red'>75</span>
            </div>
            <div className='col-md-2 col-6 th-custom-col-padding pb-2'>
              Students Evaluated: <span className='th-primary'>75</span>
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

export default StudentwiseHomework;
