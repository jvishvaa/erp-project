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
    <div
      className={`th-bg-white th-br-5 py-2 px-2 shadow-sm ${
        user_level == 11 ? 'mt-3' : ''
      }`}
      style={{ minHeight: 240 }}
    >
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Diary Report
          <span className='th-12 pl-2 pl-md-0 th-pointer th-primary'>
            {/* <ReloadOutlined onClick={getAssessmentData} className='pl-md-3' /> */}
          </span>
        </div>
      </div>
      {loading ? (
        <div className='th-width-100 text-center mt-5'>
          <Spin tip='Loading...'></Spin>
        </div>
      ) : diaryReportData?.length > 0 ? (
        <div className='mt-1 p-2'>
          <div className='th-custom-col-padding'>
            <div className='px-2'>
              <div className='row justify-content-between mb-1'>
                <div className='col-6 th-grey th-fw-400 th-12'>Grade</div>
                <div className='col-6 th-grey th-fw-400 th-12 pr-3 text-right'>
                  Total Assigned
                </div>
              </div>

              <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
                {diaryReportData?.map((item, i) => {
                  return (
                    <div
                      className='th-bg-grey mb-2 th-br-6 text-capitalize'
                      // style={{ cursor: 'pointer' }}
                    >
                      <div className='row justify-content-between py-3 th-br-6 align-items-center'>
                        <div className='col-6 th-black-1 th-14 th-fw-400 pr-0 text-truncate'>
                          <Tooltip
                            placement='top'
                            title={
                              <span className='text-capitalize'>{item?.grade_name}</span>
                            }
                          >
                            {item?.grade_name}
                          </Tooltip>
                        </div>

                        <div className='col-6 text-right pr-3 th-16 th-fw-600 th-green-1'>
                          <span className='mr-4'>
                            {item?.diary_count}
                            {/* <RightOutlined className='th-black-1 pl-3' /> */}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='row justify-content-end'>
                <u
                  className='th-primary th-pointer'
                  onClick={() =>
                    history.push({
                      pathname: '/gradewise-diary-report',
                      state: {
                        date: moment().format('YYYY-MM-DD'),
                        diaryType: 2,
                      },
                    })
                  }
                >
                  View All &gt;
                </u>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center mt-5'>
          <img src={NoDataIcon} />
        </div>
      )}
    </div>
  );
};

export default DiaryReport;
