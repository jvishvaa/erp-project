import React, { useState } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import CalendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';

const { RangePicker } = DatePicker;
const gradewiseClassworkReport = [
  {
    grade: 'Grade 1',
    assigned: 100,
    submitted: 90,
    pending: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    evaluated: 10,
    id: 1,
  },
  {
    grade: 'Grade 2',
    assigned: 100,
    submitted: 90,
    pending: 10,
    evaluated: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    id: 2,
  },
  {
    grade: 'Grade 3',
    assigned: 100,
    submitted: 90,
    pending: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    evaluated: 10,
    id: 3,
  },
];

const columns = [
  {
    title: <span className='th-white pl-4 th-fw-700 '>GRADE</span>,
    dataIndex: 'grade',
    align: 'left',
    width: '35%',
    render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>CLASSWORKS ASSIGNED</span>,
    dataIndex: 'assigned',
    align: 'center',
    width: '15%',
    render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>PENDING</span>,
    dataIndex: 'pending',
    align: 'center',
    width: '15%',
    render: (text, row) => (
      <>
        <span className='th-red'>{row.pending}</span>
        <span className='th-black-2'> ({row.pending_perc})</span>
      </>
    ),
  },
  {
    title: <span className='th-white th-fw-700'>SUBMITTED</span>,
    dataIndex: 'submitted',
    align: 'center',
    width: '15%',
    render: (data) => <span className='th-green'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>EVALUATED</span>,
    dataIndex: 'evaluated',
    align: 'center',
    width: '15%',
    render: (text, row) => (
      <>
        <span className='th-primary'>{row.evaluated}</span>
        <span className='th-grey'> ({row.evaluated_perc})</span>
      </>
    ),
  },
];

const ClassworkReport = () => {
  const history = useHistory();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };
  const expandedRowRender = () => {
    const innerColumn = [
      {
        title: 'sectionName',
        dataIndex: 'sectionName',
        align: 'center',
        width: tableWidthCalculator(35) + '%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'assigned',
        dataIndex: 'assigned',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'pending',
        dataIndex: 'pending',
        align: 'center',
        width: '15%',
        render: (text, row) => (
          <>
            <span className='th-red'>{row.pending}</span>
            <span className='th-black-2'> ({row.pending_perc})</span>
          </>
        ),
      },
      {
        title: 'submitted',
        dataIndex: 'submitted',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green'>{data}</span>,
      },
      {
        title: 'evaluated',
        dataIndex: 'evaluated',
        align: 'center',
        width: '15%',
        render: (text, row) => (
          <>
            <span className='th-primary'>{row.evaluated}</span>
            <span className='th-grey'> ({row.evaluated_perc})</span>
          </>
        ),
      },
      {
        title: 'icon',
        align: 'center',
        width: '5%',
        key: 'icon',
        id: 6,
        render: () => (
          <span onClick={() => history.push('./subjectwise-classwork-report')}>
            <RightOutlined className='th-grey th-pointer' />
          </span>
        ),
      },
    ];
    const data = [
      {
        sectionName: 'Section A',
        assigned: 60,
        submitted: 53,
        pending: 7,
        pending_perc: '10%',
        evaluated_perc: '10%',
        evaluated: 10,
        id: 1,
      },
      {
        sectionName: 'Section B',
        assigned: 65,
        submitted: 58,
        pending: 7,
        pending_perc: '10%',
        evaluated_perc: '10%',
        evaluated: 10,
        id: 2,
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
        scroll={{ x: 'max-content' }}
      />
    );
  };

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-dashboard' className='th-grey th-16'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Classwork Report
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 mt-3 mt-sm-0 text-right'>
          <div>
            <RangePicker
              allowClear={false}
              bordered={false}
              placement='bottomRight'
              showToday={false}
              suffixIcon={<DownOutlined />}
              defaultValue={[moment(), moment()]}
              onChange={(value) => handleDateChange(value)}
              className='th-range-picker th-br-4'
              separator={'to'}
              format={'DD/MM/YYYY'}
            />
          </div>
          <div className='th-date-range'>
            <img src={CalendarIcon} />
          </div>
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
              dataSource={gradewiseClassworkReport}
              pagination={false}
              expandIconColumnIndex={5}
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

export default ClassworkReport;
