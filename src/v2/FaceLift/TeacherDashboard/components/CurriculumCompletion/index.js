import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Tooltip } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const CurriculumCompletion = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [curriculumData, setCurriculumData] = useState([]);

  const fetchCurriculumData = (params = {}) => {
    axios
      .get(`${endpoints.teacherDashboard.curriculumCompletion}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCurriculumData(response?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchCurriculumData({ session_year: selectedAcademicYear?.id });
  }, [selectedAcademicYear]);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 mt-3 shadow-sm'>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Curriculum Completion
        </div>
      </div>
      {curriculumData?.length > 0 ? (
        <div className='my-1 p-2'>
          <div className='th-custom-col-padding'>
            <div className='px-2'>
              <div className='row justify-content-between mb-1'>
                <div className='col-4 th-grey th-fw-400 th-12'>Grade</div>
                <div className='col-4 th-grey th-fw-400 th-12 text-center'>Subject</div>
                <div className='col-4 th-grey th-fw-400 th-12 px-0 text-center'>
                  Avg. Completion %
                </div>
              </div>
              <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
                {curriculumData?.map((item, i) => (
                  <div className='th-bg-grey mb-2 th-br-6' style={{ cursor: 'pointer' }}>
                    <div
                      className='row justify-content-between py-3 th-br-6 align-items-center'
                      // onClick={() => history.push('./curriculum-report')}
                    >
                      <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 text-truncate'>
                        <Tooltip
                          placement='top'
                          title={
                            <span>
                              {item?.grade_name} {item?.section_name}
                            </span>
                          }
                        >
                          {item?.grade_name} {item?.section_name}
                        </Tooltip>
                      </div>
                      <div className='col-4 th-black-1 th-14 th-fw-400 pr-0 pl-1 text-center'>
                        {item?.subject_name}
                      </div>
                      <div className='col-4 text-center th-16 th-fw-600 th-green-1 pr-0'>
                        {item?.percentage_completion}%{' '}
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

export default CurriculumCompletion;
