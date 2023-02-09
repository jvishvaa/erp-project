import React, { useState, useEffect } from 'react';
import { message, Spin, Tooltip } from 'antd';
import { RightOutlined, ReloadOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import moment from 'moment';

const DiaryReport = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [diaryReportData, setDiaryReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  let { user_level } = JSON.parse(localStorage.getItem('userDetails')) || '';

  const fetchDiaryReportData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.diaryReport.dashboardDiaryreport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDiaryReportData(response?.data?.result?.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchDiaryReportData({ acad_session_id: selectedBranch?.id });
  }, []);

  return (
    <div className={`th-bg-white th-br-5 py-2 px-2 shadow-sm mt-3`}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 py-1 th-fw-500 th-black-1'>Diary Report</div>
        <div className='col-12'>
          <hr className='my-1' style={{ marginTop: '2px solid #d9d9d9' }} />
        </div>
      </div>
      {loading ? (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ height: '125px' }}
        >
          <Spin tip='Loading...'></Spin>
        </div>
      ) : diaryReportData?.length > 0 ? (
        <div className='px-2'>
          <div className='row justify-content-between my-2'>
            <div className='col-4 py-1 text-center px-1 px-sm-2'>
              <div className='th-bg-grey p-2 th-br-8 shadow-sm'>
                <div className='th-fw-400 th-14 th-fw-500 mb-2'>Classes</div>
                <div className='th-24 th-fw-600'>7</div>
              </div>
            </div>
            <div className='col-4 py-1 text-center px-1 px-sm-2'>
              <div className='th-bg-grey p-2 th-br-8 shadow-sm'>
                <div className='th-fw-400 th-14 th-fw-500 mb-2'>Assigned</div>
                <div className='th-24 th-fw-600'>4</div>
              </div>
            </div>
            <div className='col-4 py-1 text-center px-1 px-sm-2'>
              <div className='th-bg-grey p-2 th-br-8 shadow-sm'>
                <div className='th-fw-400 th-14 th-fw-500 mb-2'>Pending</div>
                <div className='th-24 th-fw-600'>3</div>
              </div>
            </div>
          </div>
          <div className='row justify-content-end'>
            <div
              onClick={() =>
                history.push({
                  pathname: '/gradewise-diary-report',
                  state: {
                    date: moment().format('YYYY-MM-DD'),
                    diaryType: 2,
                  },
                })
              }
              className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
              style={{ outline: '1px solid #d9d9d9' }}
            >
              View All
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center pt-2' style={{ height: 125 }}>
          <img src={NoDataIcon} height='110px' />
        </div>
      )}
    </div>
  );
};

export default DiaryReport;
