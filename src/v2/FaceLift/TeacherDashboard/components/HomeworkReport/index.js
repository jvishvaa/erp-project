import React, { useState, useEffect } from 'react';
import ReportsCard from 'v2/FaceLift/myComponents/ReportsCard';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { ReloadOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const HomeWorkReport = () => {
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [homeworkReportData, setHomeworkReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHomeworkReportData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.homeworkReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setHomeworkReportData(response?.data?.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const getHomeWorkReportData = () => {
    if (selectedBranch && selectedAcademicYear)
      fetchHomeworkReportData({
        branch_ids: selectedBranch?.branch?.id,
        session_year_id: selectedAcademicYear?.id,
        level: user_level,
      });
  };

  useEffect(() => {
    getHomeWorkReportData();
  }, []);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 260 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Homeworks
          <span className='th-12 pl-2 pl-md-0 th-pointer th-primary'>
            {/* <ReloadOutlined onClick={getHomeWorkReportData} className='pl-md-3' /> */}
          </span>
        </div>
      </div>
      {loading ? (
        <div className='th-width-100 text-center mt-5'>
          <Spin tip='Loading...'></Spin>
        </div>
      ) : homeworkReportData?.length > 0 ? (
        <div className='my-1 p-2'>
          <ReportsCard data={homeworkReportData} type='homework' />
        </div>
      ) : (
        <div className='d-flex justify-content-center mt-5'>
          <img src={NoDataIcon} />
        </div>
      )}
    </div>
  );
};

export default HomeWorkReport;
