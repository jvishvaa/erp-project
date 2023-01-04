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
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
const { RangePicker } = DatePicker;

const GradeWiseAttendance = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const history = useHistory();
  const [date, setDate] = useState();
  const [gradewiseAttendanceData, setGradewiseAttendanceData] = useState([]);
  const [attendanceCountData, setAttendanceCountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [value, setValue] = useState(null);
  let today = moment().format('YYYY-MM-DD');


  const disabledDate = (current) => {
    if (!date) {
      return false;
    }
    const tooLate = date[0] && current.diff(date[0], 'days') > 7;
    const tooEarly = date[1] && date[1].diff(current, 'days') > 7;
    return !!tooEarly || !!tooLate;
  };
  const onOpenChange = (open) => {
    if (open) {
      setDate([null, null]);
    } else {
      setDate(null);
    }
    console.log(value);
  };


  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    }
  };
  useEffect(() => {
    if (history?.location?.state?.start_date != undefined) {
    setDate([moment(history?.location?.state?.start_date) , moment(history?.location?.state?.end_date)])
    } else {
      setDate([moment() , moment()])
    }
  }, [history])

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
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setGradewiseAttendanceData(response?.data?.result?.grades);
          setAttendanceCountData(response?.data?.result);
          setLoading(false);
        } else {
          setLoading(false);
          setGradewiseAttendanceData([]);
          setAttendanceCountData([]);
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
                  date: startDate,
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
        rowClassName='th-pointer'
        onRow={(row, rowindex) => {
          return {

            onClick: (e) =>
              history.push({
                pathname: '/sectionwise-attendance',
                state: {
                  gradeName: record?.grade_name,
                  gradeID: record?.grade_id,
                  sectionName: row?.section_name,
                  sectionID: row?.section_id,
                  date: startDate,
                },
              })
          }
        }}
      />
    );
  };

  useEffect(() => {
    let selected_branch;
    if (history?.location?.state?.selectedbranchData) {
      selected_branch = history?.location?.state?.selectedbranchData;
    
    fetchGradewiseAttendanceData({
      session_year: selectedAcademicYear?.id,
      start_date: history?.location?.state?.start_date,
      end_date: history?.location?.state?.end_date,
      branch_id: selected_branch?.branch_id || selectedBranch?.branch?.id,
    });
    setStartDate(history?.location?.state?.start_date)
    setEndDate(history?.location?.state?.end_date)
  }
  }, [history]);

  useEffect(() => {
    let selected_branch;
    if (value != null ) {
      selected_branch = history?.location?.state?.selectedbranchData;
    
    fetchGradewiseAttendanceData({
      session_year: selectedAcademicYear?.id,
      start_date: moment(value[0]).format('YYYY-MM-DD'),
      end_date: moment(value[1]).format('YYYY-MM-DD'),
      branch_id: selected_branch?.branch_id || selectedBranch?.branch?.id,
    });
    setStartDate(moment(value[0]).format('YYYY-MM-DD'))
    setEndDate(moment(value[1]).format('YYYY-MM-DD'))
  }
  }, [value]);

  useEffect(() => {
    let selected_branch;
    if (history?.location?.state?.start_date == undefined && today ) {
      selected_branch = history?.location?.state?.selectedbranchData;
    
    fetchGradewiseAttendanceData({
      session_year: selectedAcademicYear?.id,
      start_date: today,
      end_date: today,
      branch_id: selected_branch?.branch_id || selectedBranch?.branch?.id,
    });
    setStartDate(today)
    setEndDate(today)
  }
  }, [today]);

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
            {user_level !== 11 && (
              <Breadcrumb.Item
                onClick={() => history.goBack()}
                className='th-grey th-pointer'
              >
                Rolewise Attendance
              </Breadcrumb.Item>
            )}
            <Breadcrumb.Item className='th-black-1'>Attendance</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
          <span className='th-br-4 p-1 th-bg-white'>
            <img src={calendarIcon} className='pl-2' />
            {/* <DatePicker
              disabledDate={(current) => current.isAfter(moment())}
              allowClear={false}
              bordered={false}
              placement='bottomRight'
              defaultValue={moment()}
              value={moment(date)}
              onChange={(value) => handleDateChange(value)}
              showToday={false}
              suffixIcon={<DownOutlined className='th-black-1' />}
              className='th-black-2 pl-0 th-date-picker'
              format={'YYYY/MM/DD'}
            /> */}
            <RangePicker
              placement='bottomRight'
              className='th-black-2 pl-0 th-date-picker'
              value={date || value}
              disabledDate={disabledDate}
              onCalendarChange={(val) => setDate(val)}
              onChange={(val) => setValue(val)}
              onOpenChange={onOpenChange}
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
              <div className='col-md-4 col-12 pb-0 pb-sm-2 th-custom-col-padding'>
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
                index % 2 === 0 ? 'th-bg-grey th-pointer' : 'th-bg-white th-pointer'
              }
              loading={loading}
              columns={columns}
              rowKey={(record) => record?.grade_id}
              expandable={{ expandedRowRender }}
              dataSource={gradewiseAttendanceData}
              expandRowByClick={true}
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
