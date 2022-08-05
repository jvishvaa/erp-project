import React, { useState, useEffect } from 'react';
import { message, Spin, Tooltip } from 'antd';
import { RightOutlined, ReloadOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const Assessment = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [assessmentData, setAssessmentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssessmentData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.assessment}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAssessmentData(response?.data?.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const getAssessmentData = () => {
    if (selectedAcademicYear)
      fetchAssessmentData({ session_year: selectedAcademicYear?.id });
  };

  useEffect(() => {
    getAssessmentData();
  }, []);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 260 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Assessment
          <span className='th-12 pl-2 pl-md-0 th-pointer th-primary'>
            {/* <ReloadOutlined onClick={getAssessmentData} className='pl-md-3' /> */}
          </span>
        </div>
      </div>
      {loading ? (
        <div className='th-width-100 text-center mt-5'>
          <Spin tip='Loading...'></Spin>
        </div>
      ) : assessmentData?.length > 0 ? (
        <div className='my-1 p-2'>
          <div className='th-custom-col-padding'>
            <div className='px-2'>
              <div className='row justify-content-between mb-1'>
                <div className='col-4 th-grey th-fw-400 th-12'>Grade</div>
                <div className='col-4 th-grey th-fw-400 th-12 text-center'>Subject</div>
                <div className='col-4 th-grey th-fw-400 th-12 px-0 text-center'>
                  Avg. Score
                </div>
              </div>

              <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
                {assessmentData?.map((item, i) => {
                  let section = item.section_name.charAt(item.section_name.length - 1);
                  return (
                    <div
                      className='th-bg-grey mb-2 th-br-6 text-capitalize'
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className='row justify-content-between py-3 th-br-6 align-items-center'
                        onClick={() => history.push('./assessment-reports')}
                      >
                        <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 text-truncate'>
                          <Tooltip
                            placement='top'
                            title={
                              <span className='text-capitalize'>
                                {item?.grade_name} {section}
                              </span>
                            }
                          >
                            {item?.grade_name} {section}
                          </Tooltip>
                        </div>
                        <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 pl-1 text-center'>
                          {item?.subject_name}
                        </div>
                        <div className='col-4 text-center th-16 th-fw-600 th-green-1 px-0'>
                          <span className='d-flex align-items-center justify-content-end pr-2 pr-md-1'>
                            {item?.avg_score}
                            <RightOutlined className='th-black-1 pl-3' />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

export default Assessment;
