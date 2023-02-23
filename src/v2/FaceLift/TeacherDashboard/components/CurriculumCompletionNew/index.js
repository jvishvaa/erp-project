import React, { useState, useEffect } from 'react';
import { Progress, Spin } from 'antd';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const CurriculumTracker = (props) => {
  const [loading, setLoading] = useState(false);
  const [curriculumData, setCurriculumData] = useState([]);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const fetchCurriculumReport = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.curriculumReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data.status_code === 200) {
          setCurriculumData(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCurriculumReport({
      acadsession_id: selectedBranch?.id,
      branch: selectedBranch?.branch?.id,
    });
  }, []);

  return (
    <div
      className={`th-bg-white th-br-5 py-3 px-2 shadow-sm mb-1`}
      style={{ height: 440 }}
    >
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>
          Curriculum Completion
        </div>
      </div>
      <div className='row'>
        {loading ? (
          <div className='text-center py-5'>
            <Spin tip={<span className='th-12'>Loading...</span>}></Spin>
          </div>
        ) : (
          <>
            <div className='col-12 mb-1' style={{ height: 335, overflowY: 'auto' }}>
              {curriculumData.length > 0 ? (
                <div className='row mt-2 th-bg-grey px-1 py-2 th-br-5'>
                  {curriculumData.map((item, index) => (
                    <div className='col-md-6 px-1 my-1'>
                      <div
                        className='th-bg-white row align-items-center th-br-5 px-lg-2'
                        style={{ outline: '1px solid #d9d9d9' }}
                      >
                        <div className='col-9 px-lg-0  th-fw-600 py-1 th-12'>
                          <div
                            className='th-black-2  text-truncate'
                            title={item?.subject_name}
                          >
                            {item?.subject_name}
                          </div>
                          <div className='th-black-1 text-truncate'>
                            {item?.grade_name}
                          </div>
                          <div className='th-grey th-fw-500'>
                            Period : {item?.period_completed}
                          </div>
                        </div>
                        <div className='col-3 px-lg-0'>
                          <Progress
                            type='circle'
                            strokeWidth='11'
                            percent={item?.completed_percentage}
                            strokeColor={
                              item?.completed_percentage < 40
                                ? '#F33434'
                                : item?.completed_percentage <= 75
                                ? '#F3A734'
                                : '#2FC069'
                            }
                            width={40}
                            format={(percent) => (
                              <span
                                className='th-fw-500 th-9'
                                style={{
                                  color:
                                    percent < 50
                                      ? '#F32D2D'
                                      : percent <= 75
                                      ? '#FFC700'
                                      : percent <= 90
                                      ? '#87D068'
                                      : '#10B479',
                                }}
                              >
                                {percent} %
                              </span>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='d-flex justify-content-center pt-5'>
                  <img src={NoDataIcon} />
                </div>
              )}
            </div>
            <div className='row justify-content-end mt-2 pr-3'>
              <div
                className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                style={{ outline: '1px solid #d9d9d9' }}
                // onClick={() => history.push('/student-assessment-dashboard')}
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

export default CurriculumTracker;
