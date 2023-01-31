import React, { useState, useEffect } from 'react';
import { message, Spin, Tag, Progress, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import NoExamIcon from 'v2/Assets/dashboardIcons/studentDashboardIcons/notest.png';
import redSmiley from 'v2/Assets/dashboardIcons/studentDashboardIcons/red.png';
import yellowSmiley from 'v2/Assets/dashboardIcons/studentDashboardIcons/yellow.png';
import lightGreenSmiley from 'v2/Assets/dashboardIcons/studentDashboardIcons/lightGreen.png';
import greenSmiley from 'v2/Assets/dashboardIcons/studentDashboardIcons/green.png';

const Assessment = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level || '';
  const [performanceData, setPerformanceData] = useState({});
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [upcomingAssessmentData, setUpcomingAssessmentData] = useState([]);
  const getAssessmentRemarks = (average) => {
    return average <= 50
      ? redSmiley
      : average <= 75
      ? yellowSmiley
      : average <= 90
      ? lightGreenSmiley
      : greenSmiley;
  };
  const fetchStudentPerformancetData = (params = {}) => {
    setLoadingPerformance(true);
    axios
      .get(`${endpoints.studentDashboard.assessmentPerformance}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setPerformanceData(response?.data?.result);
        }
        setLoadingPerformance(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingPerformance(false);
      });
  };
  const fetchUpcomingAssessmentData = (params = {}) => {
    setLoadingAssessments(true);
    axios
      .get(`${endpoints.studentDashboard.upcomingAssessment}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setUpcomingAssessmentData(response?.data?.result);
        }
        setLoadingAssessments(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoadingAssessments(false);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear) {
      fetchStudentPerformancetData({ session_year: selectedAcademicYear?.id });
      fetchUpcomingAssessmentData({ session_year: selectedAcademicYear?.id });
    }
  }, [selectedAcademicYear]);
  return (
    <div
      className='th-bg-white th-br-5 py-3 px-2 mt-3 shadow-sm mb-3'
      style={{ height: userLevel == 13 ? '875px' : '845px' }}
    >
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Assessment Details
          <span className='th-12 pl-2 pl-md-0 th-pointer th-primary'></span>
        </div>
      </div>
      {loadingPerformance ? (
        <div
          className='th-width-100 mt-2 d-flex align-items-center justify-content-center'
          style={{ height: 145 }}
        >
          <Spin tip='Loading...'></Spin>
        </div>
      ) : (
        <div className=' mt-2'>
          <div className='row justify-content-between mb-1'>
            <div className='row justify-content-center align-items-center mb-2'>
              <div className='th-grey p-1 th-fw-500 th-16'>Overall Performance </div>
              <div className='th-16 th-black-1 th-fw-700'>
                {performanceData?.overall_performance?.overall_performance
                  ? `: ${performanceData?.overall_performance?.overall_performance} %`
                  : null}
              </div>
            </div>
          </div>
          {performanceData?.overall_performance?.overall_performance ? (
            <>
              {/* Chart */}
              <div className='th-width-100 text-center th-assessment-progress'>
                <Progress
                  type='dashboard'
                  percent={performanceData?.overall_performance?.overall_performance}
                  gapDegree={180}
                  strokeColor={{
                    '0%': '#F32D2D',
                    '40%': '#FFC700',
                    '70%': '#87d068',
                    '100%': '#10B479',
                  }}
                  status='active'
                  width='330px'
                  strokeWidth='4'
                  format={() => (
                    <div className='mt-3'>
                      <div>
                        <img
                          src={getAssessmentRemarks(
                            performanceData?.overall_performance?.overall_performance
                          )}
                          height='80px'
                        />
                      </div>
                      <div className='my-2'>
                        <span
                          className='th-18 th-fw-700'
                          style={{
                            color:
                              performanceData?.overall_performance?.overall_performance <
                              50
                                ? '#F32D2D'
                                : performanceData?.overall_performance
                                    ?.overall_performance <= 75
                                ? '#FFC700'
                                : performanceData?.overall_performance
                                    ?.overall_performance <= 90
                                ? '#87D068'
                                : '#10B479',
                          }}
                        >
                          {performanceData?.overall_performance?.overall_performance < 50
                            ? 'Good Effort.!'
                            : performanceData?.overall_performance?.overall_performance <=
                              75
                            ? 'Well Done.!'
                            : performanceData?.overall_performance?.overall_performance <=
                              90
                            ? 'Excellent.!'
                            : 'Outstanding.!'}
                        </span>
                      </div>
                    </div>
                  )}
                />
              </div>
              {performanceData?.subjects_performance ? (
                <div
                  className='row th-bg-grey p-2 th-br-8'
                  style={{ marginTop: '-100px' }}
                >
                  <div className='th-fw-500 th-green-2 row justify-content-center mb-2'>
                    Performance
                  </div>
                  {performanceData?.subjects_performance?.map((item) => (
                    <div className='row py-2 th-12 th-black-2'>
                      <div className='col-6 text-truncate text-center'>
                        <Tooltip title={item?.subject}>{item?.subject}</Tooltip>
                      </div>
                      <div className='col-6 text-center px-0'>{item?.average} %</div>
                    </div>
                  ))}
                  <div className='row justify-content-end mt-2'>
                    <div
                      className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                      style={{ outline: '1px solid #d9d9d9' }}
                      onClick={() => history.push('/student-assessment-dashboard')}
                    >
                      View Details
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className='row th-bg-grey p-2 th-br-8'
                  style={{ marginTop: '-100px' }}
                >
                  <div
                    className='col-6 px-1 pr-2'
                    style={{ borderRight: '1px solid #d9d9d9' }}
                  >
                    <div className='th-fw-500 th-green-2 text-center mb-2'>
                      Top Performance
                    </div>
                    {performanceData?.top_performance_subjects?.map((item) => (
                      <div className='row py-2 th-12 th-black-2'>
                        <div className='col-9 text-truncate'>
                          <Tooltip title={item?.subject}>{item?.subject}</Tooltip>
                        </div>
                        <div className='col-3 text-center px-0'>{item?.average} %</div>
                      </div>
                    ))}
                  </div>
                  <div className='col-6 px-0 pl-2'>
                    <div className='th-fw-500 th-yellow text-center mb-2'>
                      Below Performance
                    </div>
                    {performanceData?.below_performance_subjects?.map((item) => (
                      <div className='row py-2 th-12 th-black-2 '>
                        <div className='col-9 text-truncate'>
                          <Tooltip title={item?.subject}>{item?.subject}</Tooltip>
                        </div>
                        <div className='col-3 text-center px-0'>{item?.average} %</div>
                      </div>
                    ))}
                  </div>
                  <div className='row justify-content-end mt-2'>
                    <div
                      className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                      style={{ outline: '1px solid #d9d9d9' }}
                      onClick={() => history.push('/student-assessment-dashboard')}
                    >
                      View Details
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='d-flex w-100  justify-content-center align-items-center'>
              <img src={NoDataIcon} style={{ objectFit: 'contain', height: 'inherit' }} />
            </div>
          )}
        </div>
      )}

      {loadingAssessments ? (
        <div
          className='th-width-100 d-flex align-items-center justify-content-center'
          style={{ height: 145 }}
        >
          <Spin tip='Loading...'></Spin>
        </div>
      ) : (
        <div className='row justify-content-between'>
          <div className='row justify-content-center my-2'>
            <div className='th-grey p-1 th-fw-500 th-16'>Upcoming Exams</div>
          </div>
          <div className='row'>
            {upcomingAssessmentData.length > 0 ? (
              <>
                <div className='row'>
                  <div className='col-12 th-12 th-br-8 px-2 th-bg-grey'>
                    {upcomingAssessmentData?.slice(0, 3).map((item) => (
                      <div
                        className='py-1 my-2 th-bg-white th-black-2 th-br-4 shadow-sm'
                        style={{
                          borderLeft: '4px solid #1b4ccb ',
                          // outline: '1px solid #1b4ccb',
                        }}
                      >
                        <div className='row py-1'>
                          <div className='col-12 text-left th-primary th-fw-500'>
                            {item?.subject}
                          </div>
                        </div>
                        <div
                          className='row py-1 align-items-center'
                          style={{ borderTop: '1px solid #d9d9d9' }}
                        >
                          <div className='col-3 text-left'>
                            <Tag color='processing' className='th-br-6'>
                              {item?.total_mark} Marks
                            </Tag>
                          </div>
                          <div className='col-9 text-right th-fw-500'>
                            <span className=' mr-2'>
                              {moment(item?.date).format('DD-MM-YYYY')}
                            </span>
                            <span>{moment(item?.time, 'hh:mm A').format('hh:mm A')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className='d-flex w-100 justify-content-center align-items-center'>
                {/* <div className='th-black-2 th-12 th-fw-500'> No Upcoming Assessments</div> */}
                <img src={NoExamIcon} style={{ objectFit: 'contain', height: '120px' }} />
              </div>
            )}
            <div className='row justify-content-end align-items-center mt-2'>
              <div
                className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                style={{ outline: '1px solid #d9d9d9' }}
                onClick={() => history.push('/assessment/?page=1&status=0')}
              >
                View Details
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
