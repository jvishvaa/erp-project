import React, { useState, useEffect } from 'react';
import OverviewCard from 'v2/FaceLift/myComponents/OverViewCard';
import avgTestScore from 'assets/dashboardIcons/academicPerformanceIcons/avgTestScore.svg';
import { useSelector } from 'react-redux';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import attendanceReport from 'assets/dashboardIcons/academicPerformanceIcons/attendanceReport.svg';
import curriculumCompletion from 'assets/dashboardIcons/academicPerformanceIcons/curriculumCompletion.svg';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const AcademicPerformance = (props) => {
  const { selectedBranchList } = props;
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [curriculumStats, setCurriculumStats] = useState('');
  const [testScoreStats, setTestScoreStats] = useState('');
  const [attendacneStats, setAttendanceStats] = useState('');

  const fetchCurriculumStats = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.curriculumStats}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCurriculumStats(response?.data?.result[0]?.percentage_completed);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchTestScoreStats = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.testScoreStats}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setTestScoreStats(response?.data?.result?.overall_avg);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchAttendanceStats = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.overallAttendanceStats}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAttendanceStats(response?.data?.result[1]?.percentage_attendance);
        }
      })
      .catch((error) => console.log(error));
  };

  const getAcademicOverviewData = () => {
    if (selectedBranch) {
      if (selectedBranchList?.length > 0) {
        const selectedBranchIds = selectedBranchList
          ?.map((item) => item?.value)
          .join(',');
        const selectedAcadSessionIds = selectedBranchList
          ?.map((item) => item?.acadId)
          .join(',');

        fetchCurriculumStats({
          branch_id: selectedBranchIds,
          acad_session_id: selectedAcadSessionIds,
        });
        fetchTestScoreStats({ acad_session_id: selectedAcadSessionIds });
        fetchAttendanceStats({
          acad_session: selectedAcadSessionIds,
          session_year_id: selectedAcademicYear?.id,
        });
      }
    }
  };

  const AcademicPerformanceData = [
    {
      title: 'Curriculum Completion',
      value: curriculumStats,
      icon: curriculumCompletion,
    },
    {
      title: 'Avg. Test Score',
      value: testScoreStats,
      icon: avgTestScore,
    },
    {
      title: 'Attendance Report',
      value: attendacneStats,
      icon: attendanceReport,
    },
  ];

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 240 }}>
      <div className='th-16 mt-2 th-fw-500 th-black-1 col-md-12 pb-2'>
        Academic Performance Overview{' '}
        <ReloadOutlined onClick={getAcademicOverviewData} className='pl-3' />
      </div>
      <div className='row justify-content-between '>
        {curriculumStats || testScoreStats || attendacneStats ? (
          AcademicPerformanceData?.map((item) => (
            <OverviewCard data={item} selectedBranchList={selectedBranchList} />
          ))
        ) : (
          <div className='col text-center'>
            <img src={NoDataIcon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicPerformance;
