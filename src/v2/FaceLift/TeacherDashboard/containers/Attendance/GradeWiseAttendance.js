import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';

const GradeWiseAttendance = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [gradewiseAttendanceData, setGradewiseAttendanceData] = useState([]);
  const [attendanceCountData, setAttendanceCountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    }
  };

  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.grade_id);
    }

    setExpandedRowKeys(keys);
  };

  const fetchGradewiseAttendanceData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherAttendance.gradewiseAttendance}`, {
        params: { ...params },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setGradewiseAttendanceData(response?.data?.result?.grades);
          setAttendanceCountData(response?.data?.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error?.message);
        setLoading(false);
      });
  };

  const expandedRowRender = (record) => {
    const innerColumn = [
      {
        dataIndex: 'section_name',
        align: 'center',
        width: tableWidthCalculator(20) + '%',
        render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      },
      {
        align: 'center',
        width: '15%',
        dataIndex: 'total_strength',
        render: (data) => <span className='th-black-2 th-16'>{data}</span>,
      },
      {
        dataIndex: 'total_marked',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data}</span>,
      },
      {
        dataIndex: 'total_unmarked',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-red th-16'>{data}</span>,
      },
      {
        dataIndex: 'present_count',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-green th-16'>{data}</span>,
      },
      {
        dataIndex: 'absent_count',
        align: 'center',
        width: '15%',
        render: (data) => <span className='th-red th-16'>{data}</span>,
      },
      {
        title: 'icon',
        align: 'center',
        width: '5%',
        key: 'icon',
        render: (text, row) => (
          <span
            onClick={() =>
              history.push({
                pathname: '/sectionwise-attendance',
                state: {
                  gradeName: record?.grade_name,
                  gradeID: record?.grade_id,
                  sectionName: row?.section_name,
                  sectionID: row?.section_id,
                  date: date,
                },
              })
            }
          >
            <RightOutlined className='th-grey th-pointer' />
          </span>
        ),
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={record?.sections}
        rowKey={(record) => record?.id}
        pagination={false}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
      />
    );
  };

  useEffect(() => {
    fetchGradewiseAttendanceData({
      session_year: selectedAcademicYear?.id,
      date: date,
      branch_id: selectedBranch?.branch?.id,
    });
  }, [date]);

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>GRADE</span>,
      dataIndex: 'grade_name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL STUDENTS</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'total_strength',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>MARKED</span>,
      dataIndex: 'total_marked',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>UNMARKED</span>,
      dataIndex: 'total_unmarked',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>PRESENT</span>,
      dataIndex: 'present_count',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-green th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ABSENT</span>,
      dataIndex: 'absent_count',
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-red th-16'>{data}</span>,
    },
  ];
  return (
    <Layout>
      <div className='row th-16 py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
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
              defaultValue={moment()}
              onChange={(value) => handleDateChange(value)}
              showToday={false}
              suffixIcon={<DownOutlined className='th-black-1' />}
              className='th-black-2 pl-0 th-date-picker'
              format={'YYYY-MM-DD'}
            />
          </span>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <div className='row pt-2 align-items-center th-bg-white th-br-4 th-13 th-grey th-fw-500'>
              <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding w-100'>
                Total Students:{' '}
                <span className='th-primary'>{attendanceCountData?.total_strength}</span>
              </div>
              <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                Students Present:{' '}
                <span className='th-green'>{attendanceCountData?.total_present}</span>
              </div>
              <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                Students Absent:{' '}
                <span className='th-fw-500 th-red'>
                  {attendanceCountData?.total_absent}
                </span>
              </div>
              <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                Students Marked:{' '}
                <span className='th-fw-500 th-green'>
                  {attendanceCountData?.total_marked}
                </span>
              </div>
              <div className='col-md-2 col-12 pb-0 pb-sm-2 th-custom-col-padding'>
                Students Unmarked:{' '}
                <span className='th-fw-500 th-red'>
                  {attendanceCountData?.total_unmarked}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              columns={columns}
              rowKey={(record) => record?.grade_id}
              expandable={{ expandedRowRender }}
              dataSource={gradewiseAttendanceData}
              pagination={false}
              expandIconColumnIndex={6}
              expandedRowKeys={expandedRowKeys}
              onExpand={onTableRowExpand}
              expandIcon={({ expanded, onExpand, record }) =>
                expanded ? (
                  <UpOutlined
                    className='th-black-1 th-pointer'
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : (
                  <DownOutlined
                    className='th-black-1 th-pointer'
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
