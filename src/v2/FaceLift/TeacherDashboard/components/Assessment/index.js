import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { RightOutlined } from '@ant-design/icons';
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

  const fetchAssessmentData = (params = {}) => {
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
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchAssessmentData({ session_year: selectedAcademicYear?.id });
  }, [selectedAcademicYear]);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 260 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>Assessment</div>
      </div>
      {assessmentData?.length > 0 ? (
        <div className='my-1 p-2'>
          <div className='th-custom-col-padding'>
            <div className='px-2'>
              <div className='row justify-content-between mb-1'>
                <div className='col-4 th-grey th-fw-400 th-12'>Grade</div>
                <div className='col-4 th-grey th-fw-400 th-12'>Subject</div>
                <div className='col-4 th-grey th-fw-400 th-12 px-0 text-center'>
                  Avg. Score
                </div>
              </div>

              <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
                {assessmentData?.map((item, i) => (
                  <div className='th-bg-grey mb-2 th-br-6' style={{ cursor: 'pointer' }}>
                    <div
                      className='row justify-content-between py-3 th-br-6 align-items-center'
                      onClick={() => history.push('./assessment-reports')}
                    >
                      <div className='col-4 th-black-1 th-14 th-fw-400 pr-0'>
                        {item?.grade_name}
                      </div>
                      <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 pl-1 text-center'>
                        {item?.subject_name}
                      </div>
                      <div className='col-4 text-center th-16 th-fw-600 th-green-1 px-0'>
                        <span className='d-flex align-items-center justify-content-end'>
                          {item?.avg_score}
                          <RightOutlined className='th-black-1' />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
