import React, { useState, useEffect } from 'react';
import NumberCard from '../../../myComponents/NumberCard';
import { Select } from 'antd';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import students from 'assets/dashboardIcons/attendanceOverviewIcons/students.svg';
import admins from 'assets/dashboardIcons/attendanceOverviewIcons/admins.svg';
import teachers from 'assets/dashboardIcons/attendanceOverviewIcons/teachers.svg';
import otherStaff from 'assets/dashboardIcons/attendanceOverviewIcons/otherStaff.svg';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const { Option } = Select;
const iconsData = [
  {
    title: 'Students',
    headerIcon: students,
  },
  {
    title: 'Teacher',
    headerIcon: teachers,
  },
  {
    title: 'Admin',
    headerIcon: admins,
  },
  {
    title: 'Other Staff',
    headerIcon: otherStaff,
  },
];

const AttendanceReport = (props) => {
  const { selectedBranchList } = props;
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);

  const history = useHistory();
  const [attendanceFilter, setAttendanceFilter] = useState('today');

  const handleChange = (value) => {
    setAttendanceFilter(value);
  };
  const [attendanceReportData, setAttendanceReportData] = useState([]);

  const fetchAttendanceReportData = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.staffAttendanceStats}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAttendanceReportData(response?.data?.result);
        }
      })
      .catch((error) => console.log(error));
  };

  const mergeIconReportData = (iconsData, reportData) => {
    return iconsData
      ?.map((x) => {
        const y = reportData?.find((item) => x.title === item.role_name);
        if (y) {
          return Object.assign({}, x, y);
        } else return x;
      })
      ?.concat(
        reportData?.filter((item) => iconsData.every((x) => x.title !== item.role_name))
      );
  };

  const finalAttendanceData = mergeIconReportData(iconsData, attendanceReportData);
  const showAllData = () => {
    const branchListAttendance = selectedBranchList;
    const acadIds = branchListAttendance?.map((o, i) => (o.id = o.acadId));
    history.push({
      pathname: '/staff-attendance-report/branch-wise',
      state: {
        acadId: selectedBranchList?.length > 0 ? branchListAttendance : branchList,
      },
    });
  };

  const getAttendanceData = () => {
    if (selectedAcademicYear) {
      if (selectedBranchList.length > 0) {
        const selectedBranch = selectedBranchList?.map((item) => item?.acadId).join(',');
        fetchAttendanceReportData({
          session_year_id: selectedAcademicYear?.id,
          date_range_type: attendanceFilter,
          acad_session_id: selectedBranch,
        });
      } else {
        fetchAttendanceReportData({
          session_year_id: selectedAcademicYear?.id,
          date_range_type: attendanceFilter,
          // acad_session_id: selectedBranch?.branch?.id,
        });
      }
    }
  };
  useEffect(() => {
    if (attendanceReportData?.length > 0) getAttendanceData();
  }, [attendanceFilter]);

  return (
    <div className='col-md-12'>
      <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
        <div className='row justify-content-between'>
          <div className='col-8 col-md-6 th-16 th-fw-500 th-black-1 d-flex flex-column flex-md-row align-items-md-center'>
            Attendance Report{' '}
            <div className='th-12 pl-0 pl-md-3 th-pointer th-primary'>
              {attendanceReportData?.length > 0 ? (
                <span onClick={showAllData} className='mr-3 mr-md-0'>
                  (View All Attendance &gt;)
                </span>
              ) : null}
              <ReloadOutlined onClick={getAttendanceData} className='pl-md-3' />
            </div>
          </div>

          {attendanceReportData?.length > 0 ? (
            <div className='col-4 col-md-6 text-right'>
              <Select
                value={attendanceFilter}
                className='th-primary th-bg-grey th-br-4 th-select th-pointer'
                bordered={false}
                placement='bottomRight'
                suffixIcon={<DownOutlined className='th-primary' />}
                dropdownMatchSelectWidth={false}
                onChange={handleChange}
              >
                <Option value={'today'}>Today</Option>
                <Option value={'week'}>Last Week</Option>
                <Option value={'month'}>Last Month</Option>
              </Select>
            </div>
          ) : null}
        </div>
        <div className='row pt-2'>
          {attendanceReportData?.length > 0 ? (
            finalAttendanceData?.map((item, i) => (
              <div
                className='col-md-3 th-custom-col-padding'
                // onClick={() => history.push('./gradewise-attendance')}
              >
                <NumberCard data={item} />
              </div>
            ))
          ) : (
            <div className='col text-center'>
              <img src={NoDataIcon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
