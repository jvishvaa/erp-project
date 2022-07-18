import React, { useState } from 'react';
import Layout from 'v2/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';

const gradewiseAssessmentReport = [
  {
    grade: 'Grade 1',
    total: 56,
    avg_score: '75%',
    below_threshold: '5',
    below_threshold_perc: '4',
    id: 1,
  },
  {
    grade: 'Grade 2',
    total: 56,
    avg_score: '75%',
    below_threshold: '8',
    below_threshold_perc: '-3',
    id: 2,
  },
  {
    grade: 'Grade 3',
    total: 56,
    avg_score: '75%',
    below_threshold: '5',
    below_threshold_perc: '4',
    id: 3,
  },
  {
    grade: 'Grade 4',
    total: 56,
    avg_score: '75%',
    below_threshold: '4',
    below_threshold_perc: '-2',
    id: 4,
  },
];

const columns = [
  {
    title: <span className='th-white pl-4 th-fw-700 '>GRADE</span>,
    dataIndex: 'grade',
    align: 'left',
    width: '30%',
    render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>TOTAL STUDENTS</span>,
    dataIndex: 'total',
    align: 'center',
    width: '15%',
    render: (data) => <span className='th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>CLASS AVG. SCORE</span>,
    dataIndex: 'avg_score',
    align: 'center',
    width: '20%',
    render: (data) => <span className='th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>STUDENTS BELOW THRESHOLD</span>,
    align: 'center',
    width: '25%',
    render: (text, row) => (
      <>
        <span className='th-fw-500 th-18 th-black-1'>{row.below_threshold}</span>
        {row.below_threshold_perc > 0 ? (
          <span className='th-red'> +{row.below_threshold_perc}%</span>
        ) : (
          <span className='th-green'> {row.below_threshold_perc}%</span>
        )}
      </>
    ),
  },
];

const Assessment = () => {
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
        align: 'left',
        width: '30%',
        render: (data) => <span className='th-grey pl-4'>{data}</span>,
      },
      {
        title: 'total',
        dataIndex: 'total',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },

      {
        title: 'avg score',
        dataIndex: 'avg_score',
        align: 'center',
        width: '20%',
        render: (data) => <span className='th-black-2'>{data}</span>,
      },
      {
        title: 'pending',
        dataIndex: 'pending',
        align: 'center',
        width: '25%',
        render: (text, row) => (
          <>
            <span className='th-fw-500 th-18 th-black-1'>{row.below_threshold}</span>
            {row.below_threshold_perc > 0 ? (
              <span className='th-red'> +{row.below_threshold_perc}%</span>
            ) : (
              <span className='th-green'> {row.below_threshold_perc}%</span>
            )}
          </>
        ),
      },

      {
        title: 'icon',
        align: 'center',
        key: 'icon',
        render: () => (
          <span onClick={() => history.push('./subjectwise-assessment-report')}>
            <RightOutlined className='th-grey th-pointer' />
          </span>
        ),
      },
    ];
    const data = [
      {
        sectionName: 'Section A',
        total: 56,
        avg_score: '75%',
        below_threshold: '5',
        below_threshold_perc: '4',
        id: 1,
      },
      {
        sectionName: 'Section B',
        total: 56,
        avg_score: '75%',
        below_threshold: '5',
        below_threshold_perc: '4',
        id: 1,
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
            <Breadcrumb.Item className='th-black-1 th-16'>Assessment</Breadcrumb.Item>
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
              dataSource={gradewiseAssessmentReport}
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

export default Assessment;
