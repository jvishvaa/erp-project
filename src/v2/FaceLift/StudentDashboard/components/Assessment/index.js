import React, { useState, useEffect } from 'react';
import { message } from 'antd';
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
      .get(`${endpoints.studentDashboard.assessment}`, {
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
      fetchAssessmentData({ session_year_id: selectedAcademicYear?.id });
  }, [selectedAcademicYear]);

  return (
    <div
      className='th-bg-white th-br-5 py-3 px-2 shadow-sm mt-3'
      style={{ minHeight: 240 }}
    >
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>Assessment</div>
      </div>
      {assessmentData?.length > 0 ? (
        <div className='my-1 p-2'>
          <div className='th-custom-col-padding'>
            <div className='px-2'>
              <div className='row justify-content-between mb-1'>
                <div className='col-6 th-grey th-fw-400 th-12'>Subject</div>
                <div className='col-3 th-primary th-fw-400 th-12'>Your Score</div>
                <div className='col-3 th-grey th-fw-400 th-12 text-center'>
                  Avg. Test Score
                </div>
              </div>

              <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
                {assessmentData?.map((item, i) => (
                  <div
                    className='th-bg-grey mb-2 th-br-6 th-pointer'
                    onClick={() => history.push('./assessment')}
                  >
                    <div className='row justify-content-between py-3 th-br-6 align-items-center'>
                      <div className='col-6 th-black-1 th-14 th-fw-400'>
                        {item?.subject_name}
                      </div>
                      <div className='col-3 th-black-1 th-14 th-fw-400 '>
                        {item?.student_latest_score}%
                      </div>
                      <div className='col-3 text-center th-14 th-fw-400 th-black-1'>
                        {item?.student_time_avg}%
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
