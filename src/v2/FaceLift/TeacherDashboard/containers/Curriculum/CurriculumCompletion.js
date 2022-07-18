import React, { useState } from 'react';
import Layout from 'v2/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import CalendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';

const { RangePicker } = DatePicker;
const curriculumCompletionData = [
  {
    grade: 'Grade 1',
    completion_perc: '70%',
    id: 1,
  },
  {
    grade: 'Grade 2',
    completion_perc: '70%',
    id: 2,
  },
  {
    grade: 'Grade 3',
    completion_perc: '70%',
    id: 3,
  },
];

const columns = [
  {
    title: <span className='th-white pl-4 th-fw-700 '>GRADE</span>,
    dataIndex: 'grade',
    align: 'left',
    width: '70%',
    render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
  },
  {
    title: <span className='th-white th-fw-700'>AVG. COMPLETION</span>,
    dataIndex: 'completion_perc',
    align: 'center',
    width: '20%',
    render: (data) => <span className='th-fw-400 th-black-1'>{data}</span>,
  },
];

const CurriculumCompletion = () => {
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
        width: tableWidthCalculator(70) + '%',
        render: (data) => <span className='pl-5 ml-md-5 th-black-2'>{data}</span>,
      },
      {
        title: 'avg. completion',
        dataIndex: 'completion_perc',
        align: 'center',
        width: '20%',
        render: (data) => <span>{data}</span>,
      },

      {
        title: 'icon',
        align: 'left',
        // width: '5%',
        align: 'center',
        key: 'icon',

        render: () => (
          <span onClick={() => history.push('./subjectwise-curriculum-report')}>
            <RightOutlined className='th-pointer' />
          </span>
        ),
      },
    ];
    const data = [
      {
        sectionName: 'Section A',
        completion_perc: '70%',
        id: 1,
      },
      {
        sectionName: 'Section B',
        completion_perc: '70%',
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
              Curriculum Completion
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
              dataSource={curriculumCompletionData}
              pagination={false}
              expandIconColumnIndex={2}
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

export default CurriculumCompletion;
