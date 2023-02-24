import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Spin, Badge, Modal } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { getActivityIcon } from 'v2/getActivityIcon';
import moment from 'moment';
import axiosInstance from 'axios';

const Activity = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const { token } = JSON.parse(localStorage.getItem('userDetails'));
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const fetchActivityData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.activities}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data?.status_code === 200) {
          setActivityData(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };
  const getActivitySession = () => {
    setLoading(true);
    axiosInstance
      .post(
        `${endpoints.newBlog.activitySessionLogin}`,
        {},
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: token,
          },
        }
      )
      .then((response) => {
        fetchActivityData({
          session_year: selectedAcademicYear?.session_year,
          user_id: response?.data?.result?.user_id,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear) getActivitySession();
  }, [selectedAcademicYear]);

  return (
    <div
      className={`th-bg-white th-br-5 py-3 px-2 shadow-sm mb-1`}
      style={{ height: 440 }}
    >
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>Recent Activity</div>
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
            <div className='col-12' style={{ height: 340, overflowY: 'auto' }}>
              {activityData.length > 0 ? (
                <div className='row mt-1 th-bg-grey p-1 th-br-5'>
                  {activityData?.map((item, index) => (
                    <Badge.Ribbon
                      style={{ top: '32px', right: '-4px' }}
                      text={
                        <span className='th-white th-12'>
                          {item?.activity_type?.name}
                        </span>
                      }
                    >
                      <div className='col-12 px-1 mt-1'>
                        <div
                          className='th-bg-white row align-items-center th-br-5 px-0 th-pointer'
                          style={{ outline: '1px solid #d9d9d9' }}
                          onClick={() => {
                            setCurrentActivity(item);
                            setShowActivityModal(true);
                          }}
                        >
                          <div
                            className='col-12 px-2 py-1'
                            style={{ borderBottom: '1px solid #d9d9d9' }}
                          >
                            <div className='d-flex justify-content-between th-12 align-items-center'>
                              <div className='th-primary d-flex align-items-center'>
                                {item?.activity_type?.name == 'Public Speaking' ? (
                                  <>
                                    <Badge
                                      status={
                                        item?.asset_state ? 'success' : 'processing'
                                      }
                                    />
                                    <div className='th-fw-500 text-capitalize'>
                                      {item?.asset_state}
                                    </div>
                                  </>
                                ) : null}
                              </div>
                              <div className='th-grey th-10'>
                                Assigned On:&nbsp;
                                {moment(item?.created_at).format('DD/MM/YYYY')}
                              </div>
                            </div>
                          </div>

                          <div className='col-12 px-2 py-2'>
                            <div className='row align-items-center'>
                              <div className='col-2 px-1'>
                                <img
                                  src={getActivityIcon(item?.activity_type?.name)}
                                  alt='icon'
                                  style={{
                                    width: 48,
                                    height: 48,
                                    objectFit: 'cover',
                                  }}
                                  className='th-br-4'
                                />
                              </div>
                              <div className='col-10 pl-1'>
                                <div className='row ml-2 w-100'>
                                  <div className='col-12 px-0 th-black-2 th-fw-600 th-14 '>
                                    <div
                                      className='th-width-50 text-truncate'
                                      title={
                                        item?.grade_name[0] +
                                        ' ' +
                                        item?.section_name[0]?.slice(-1)
                                      }
                                    >
                                      {item?.grade_name[0] +
                                        ' ' +
                                        item?.section_name[0]?.slice(-1)}
                                    </div>
                                  </div>
                                  <div className='col-12 px-0 th-black-1 th-fw-600 th-16'>
                                    <div className='th-truncate-1' title={item?.title}>
                                      {item?.title}
                                    </div>
                                  </div>
                                  <div className='col-12 px-0 text-truncate th-grey th-fw-400 th-10'>
                                    Submission Date :{' '}
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
            <div className='row justify-content-end my-2 pr-3'>
              <div
                className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
                style={{ outline: '1px solid #d9d9d9' }}
                onClick={() => history.push('/blog/wall/central/redirect')}
              >
                View All
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        centered
        visible={showActivityModal}
        onCancel={() => {
          setShowActivityModal(false);
        }}
        footer={false}
        width={500}
      >
        <div className='row th-bg-white p-2 pb-3'>
          <div className='col-12'>
            <span className='th-black-1 th-fw-500 th-25'>
              {currentActivity?.title}({currentActivity?.activity_type?.name})
            </span>
          </div>
          <div className='col-12'>
            <span className='th-grey th-12'>
              Submission on -
              {moment(currentActivity?.submission_date).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className='col-12 mt-3'>
            <div className='row th-12 th-grey'>
              <div className='col-2 px-0 th-14'>
                <div className='d-flex justify-content-between'>
                  <span>Grade</span>
                  <span>:&nbsp;</span>
                </div>
              </div>
              <div className='col-10 pl-0'>
                <span>{currentActivity?.grade_name[0]}</span>
              </div>
            </div>
            <div className='row th-12 th-grey'>
              <div className='col-2 px-0 th-14'>
                <div className='d-flex justify-content-between'>
                  <span>Section</span>
                  <span>:&nbsp;</span>
                </div>
              </div>
              <div className='col-10 pl-0'>
                <span>
                  <span>{currentActivity?.section_name[0]}</span>
                </span>
              </div>
            </div>
            <div className='row th-12 th-grey'>
              <div className='d-flex flex-column'>
                <div className='th-14'>Instructions</div>
                <div>{currentActivity?.description}</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Activity;
