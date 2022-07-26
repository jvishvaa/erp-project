import React, { useState, useEffect } from 'react';
import ReportsCard from 'v2/FaceLift/myComponents/ReportsCard';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { ReloadOutlined } from '@ant-design/icons';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Spin } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const ClassWorkReport = () => {
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const [classWorkReportData, setClassWorkReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClassWorkReportData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.classworkReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setClassWorkReportData(response?.data?.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const getClassWorkReportData = () => {
    if (selectedBranch && selectedAcademicYear) {
      fetchClassWorkReportData({
        branch_ids: selectedBranch?.branch?.id,
        session_year_id: selectedAcademicYear?.id,
        level: user_level,
      });
    }
  };

  useEffect(() => {
    getClassWorkReportData();
  }, []);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 260 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Classwork Report{' '}
          <span className='th-12 pl-2 pl-md-0 th-pointer th-primary'>
            {/* <ReloadOutlined onClick={getClassWorkReportData} className='pl-md-3' /> */}
          </span>
        </div>
      </div>
      {loading ? (
        <div className='th-width-100 text-center mt-5'>
          <Spin tip='Loading...'></Spin>
        </div>
      ) : classWorkReportData?.length > 0 ? (
        <div className='my-1 p-2'>
          <ReportsCard data={classWorkReportData} type='classwork' />
        </div>
      ) : (
        <div className='d-flex justify-content-center mt-5'>
          <img src={NoDataIcon} />
        </div>
      )}
    </div>
  );
};

export default ClassWorkReport;
