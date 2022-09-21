import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, message } from 'antd';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const BranchWiseAttendance = () => {

const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [branchwiseAttendanceData, setBranchwiseAttendanceData] = useState([]);
  const [attendanceCountData, setAttendanceCountData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchBranchwiseAttendanceData = (params = {}) => {
    setLoading(true);
    axios
    .get(`${endpoints?.adminDashboard?.staffAttandance}`, {
      params: { ...params },
      headers: {
        'X-DTS-Host': X_DTS_HOST,
      },
    })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          
          setBranchwiseAttendanceData(response?.data?.result?.data);
          setLoading(false);
        } else {
          setLoading(false);
          setBranchwiseAttendanceData([]);
          setAttendanceCountData([]);
        }
      })
      .catch((error) => {
        message.error(error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    let acadIds;
    if(history?.location?.state?.acadId?.length){
      let branches = history?.location?.state?.acadId
      acadIds = branches.map((item) => item?.acadId || item?.id)
    }
    fetchBranchwiseAttendanceData({
      session_year: selectedAcademicYear?.id,
      date_range_type: date,
      // branch_id: selectedBranch?.branch?.id,
      acad_session_id : acadIds?.toString()
    });
  }, [date]);

  const toRolewiseAttendance = (branch) => {
history.push({
  pathname : './rolewise-attendance',
  state : {
    selectedbranchData : branch,
    allBranchdata : history?.location?.state?.acadId
  }
})
}

  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>BRANCH</span>,
      dataIndex: 'branch_name',
      width: '20%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL</span>,
      width: '15%',
      align: 'center',
      dataIndex: 'total_people',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>MARKED</span>,
      // dataIndex: 'total_marked',
      width: '15%',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          {row?.attendance_details?.total_present + row?.attendance_details?.total_absent}
        </span>
      ),    },
    {
      title: <span className='th-white th-fw-700'>UNMARKED</span>,
      // dataIndex: 'total_unmarked',
      width: '15%',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          {row?.total_people - (row?.attendance_details?.total_present + row?.attendance_details?.total_absent)}
        </span>
      ),    },
    {
      title: <span className='th-white th-fw-700'>PRESENT</span>,
      dataIndex: 'attendance_details',
      width: '15%',
      align: 'center',
      render: (text ,row) => <span className='th-green th-16'>{row?.attendance_details?.total_present}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ABSENT</span>,
      dataIndex: 'attendance_details',
      width: '15%',
      align: 'center',
      render: (text, row) => <span className='th-red th-16'>{row?.attendance_details?.total_absent}</span>,
    },
    {
      // title: 'icon',
      align: 'center',
      width: '5%',
      key: 'icon',
      render: (text, row) => (
        <span
          onClick={() =>
            history.push({
              pathname : './rolewise-attendance',
              state : {
                selectedbranchData : row,
                allBranchdata : history?.location?.state?.acadId
              }
            })
          }
        >
          <RightOutlined className='th-grey th-pointer' />
        </span>
      ),
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
            <Breadcrumb.Item className='th-black-1'>Branchwise Attendance</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
          <span className='th-br-4 p-1 th-bg-white'>
            <img src={calendarIcon} className='pl-2' />
            <DatePicker
              disabledDate={(current) => current.isAfter(moment())}
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
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              columns={columns}
              rowKey={(record) => record?.grade_id}
              dataSource={branchwiseAttendanceData}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BranchWiseAttendance;
