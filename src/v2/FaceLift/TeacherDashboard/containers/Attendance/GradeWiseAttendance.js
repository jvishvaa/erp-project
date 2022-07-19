import React, { useState } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';

const gradeWiseAttendanceData = [
  {
    grade: 'Grade 1',
    total_students: 100,
    total_present: 90,
    total_absent: 10,
    id: 1,
  },
  {
    grade: 'Grade 2',
    total_students: 100,
    total_present: 90,
    total_absent: 10,
    id: 2,
  },
  {
    grade: 'Grade 3',
    total_students: 100,
    total_present: 90,
    total_absent: 10,
    id: 3,
  },
  {
    grade: 'Grade 4',
    total_students: 100,
    total_present: 90,
    total_absent: 10,
    id: 4,
  },
  {
    grade: 'Grade 5',
    total_students: 100,
    total_present: 90,
    total_absent: 10,
    id: 5,
  },
];

const columns = [
  {
    title: <span className='th-white pl-4 th-fw-700 '>GRADE</span>,
    dataIndex: 'grade',
    width: '45%',
    align: 'left',
    key: 'grade',
    id: 1,
    render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>TOTAL STUDENTS</span>,
    dataIndex: 'total_students',
    width: '20%',
    align: 'center',
    key: 'total',
    id: 2,
    render: (data) => <span className='th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>PRESENT</span>,
    dataIndex: 'total_present',
    width: '20%',
    align: 'center',
    key: 'present',
    id: 3,
    render: (data) => <span className='th-green'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>ABSENT</span>,
    dataIndex: 'total_absent',
    width: '20%',
    align: 'center',
    key: 'absent',
    id: 4,
    render: (data) => <span className='th-red'>{data}</span>,
  },
];

const GradeWiseAttendance = () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const history = useHistory();
  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    }
  };

  const expandedRowRender = () => {
    const innerColumn = [
      {
        title: 'sectionName',
        dataIndex: 'sectionName',
        align: 'center',
        width: tableWidthCalculator(45) + '%',
        key: 'section',
        id: 1,
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'total',
        dataIndex: 'total',
        align: 'center',
        width: '20%',
        key: 'total',
        id: 2,
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'present',
        dataIndex: 'present',
        align: 'center',
        width: '20%',
        key: 'prsent',
        id: 3,
        render: (data) => <span className='th-green'>{data}</span>,
      },
      {
        title: 'absent',
        dataIndex: 'absent',
        align: 'center',
        width: '20%',
        key: 'absent',
        id: 4,
        render: (data) => <span className='th-red'>{data}</span>,
      },
      {
        title: 'icon',
        align: 'center',
        width: '5%',
        key: 'icon',
        id: 5,
        render: () => (
          <span onClick={() => history.push('./sectionwise-attendance')}>
            <RightOutlined className='th-grey th-pointer' />
          </span>
        ),
      },
    ];

    const data = [
      {
        sectionName: 'Section A',
        total: 60,
        present: 50,
        absent: 10,
      },
      {
        sectionName: 'Section B',
        total: 65,
        present: 58,
        absent: 7,
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={data}
        rowKey={(record) => record?.id}
        pagination={false}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
      />
    );
  };

  return (
    <Layout>
      <div className='row th-16 py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-dashboard' className='th-grey'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>Attendance</Breadcrumb.Item>
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
              onChange={(value) => handleDateChange(value)}
              showToday={false}
              suffixIcon={<DownOutlined className='th-black-1' />}
              className='th-black-2 pl-0 th-date-picker'
              format={'DD/MM/YYYY'}
            />
          </span>
        </div>

        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              columns={columns}
              rowKey={(record) => record?.id}
              expandable={{ expandedRowRender }}
              dataSource={gradeWiseAttendanceData}
              pagination={false}
              expandIconColumnIndex={4}
              expandIcon={({ expanded, onExpand, record }) =>
                expanded ? (
                  <UpOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : (
                  <DownOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                )
              }
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GradeWiseAttendance;
