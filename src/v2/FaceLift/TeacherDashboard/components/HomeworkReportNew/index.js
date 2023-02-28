import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Spin, Badge } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/noHomeworkIcon.svg';
import { getSubjectIcon } from 'v2/getSubjectIcon';
import moment from 'moment';

const HomeworkReport = () => {
  const history = useHistory();
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
      .get(`${endpoints.studentDashboard.classwisehomeworkReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data?.status_code === 200) {
          setHomeworkReportData(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchHomeworkReportData({
        acadsession_id: selectedBranch?.id,
      });
  }, [selectedAcademicYear]);

  return (
    <div className={`th-bg-white th-br-5 py-3 px-2 shadow-sm`} style={{ height: 436 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1 pb-1'>Homework Report</div>
      </div>
      <div className='row'>
        {loading ? (
          <div
            className='d-flex align-items-center justify-content-center w-100'
            style={{ height: 300 }}
          >
            <Spin tip={<span className='th-12'>Loading...</span>}></Spin>
          </div>
        ) : (
          <>
            <div
              className='col-12'
              style={{ height: 335, overflowY: 'auto', overflowX: 'hidden' }}
            >
              {homeworkReportData?.length > 0 ? (
                <div className='row mt-1 th-bg-grey p-1 th-br-5'>
                  {homeworkReportData?.map((item, index) => (
                    <Badge.Ribbon
                      style={{ top: '36px', right: '-4px' }}
                      text={<span className='th-white th-12'>{item?.subject_name}</span>}
                    >
                      {' '}
                      <div className='col-12 px-1 mt-1'>
                        <div
                          className='th-bg-white row align-items-center th-br-5 px-lg-2 th-pointer'
                          style={{ outline: '1px solid #d9d9d9' }}
                          onClick={() =>
                            history.push({
                              pathname: '/homework/teacher',
                              state: {
                                currentHomework: item,
                              },
                            })
                          }
                        >
                          <div
                            className='col-12 px-0 py-1'
                            style={{ borderBottom: '1px solid #d9d9d9' }}
                          >
                            <div className='d-flex justify-content-between th-12 align-items-center'>
                              <div className='th-primary d-flex align-items-center'>
                                <Badge
                                  status={
                                    moment().isAfter(item?.submission_date, 'days')
                                      ? 'error'
                                      : 'processing'
                                  }
                                />
                                <div
                                  className={`${
                                    moment().isAfter(item?.submission_date, 'days')
                                      ? 'th-red'
                                      : 'th-primary'
                                  } th-fw-500`}
                                >
                                  {moment().isAfter(item?.submission_date, 'days')
                                    ? 'Overdue'
                                    : 'Pending'}
                                </div>
                              </div>
                              <div className='th-grey th-10'>
                                Assigned On:&nbsp;
                                {moment(item?.assigned_date).format('DD/MM/YYYY')}
                              </div>
                            </div>
                          </div>

                          <div className='col-12 px-0 py-2'>
                            <div className='row align-items-center'>
                              <div className='col-2 px-1'>
                                <img
                                  src={getSubjectIcon(item?.subject_name.toLowerCase())}
                                  alt='icon'
                                  height={40}
                                />
                              </div>
                              <div className='col-10 px-0'>
                                <div className='row ml-2 w-100'>
                                  <div className='col-12 px-0 th-black-2 th-fw-600 th-14 '>
                                    <div
                                      className='text-truncate th-width-50'
                                      title={
                                        item?.grade_name +
                                        ' ' +
                                        item?.section_name.slice(-1)
                                      }
                                    >
                                      {item?.grade_name} {item?.section_name.slice(-1)}
                                    </div>
                                  </div>
                                  <div className='col-12 px-0 th-black-1 th-fw-600 th-16'>
                                    <div
                                      className='text-truncate th-width-100'
                                      title={item?.title}
                                    >
                                      {item?.title}
                                    </div>
                                  </div>
                                  <div className='col-12 px-0 text-truncate th-grey th-fw-400 th-10'>
                                    Submission Date :&nbsp;
                                    {moment(item?.submission_date).format('DD/MM/YYYY')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Badge.Ribbon>
                  ))}
                </div>
              ) : (
                <div className='d-flex justify-content-center pt-5'>
                  <img src={NoDataIcon} alt='no-data' />
                </div>
              )}
            </div>
            <div className='row justify-content-end pr-3 pt-3'>
              <div
                className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                style={{ outline: '1px solid #d9d9d9' }}
                onClick={() => history.push('/homework/teacher')}
              >
                View All
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeworkReport;
