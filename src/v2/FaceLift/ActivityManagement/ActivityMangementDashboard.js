import Layout from 'containers/Layout';
import React, { useState, useEffect } from 'react';
import { Breadcrumb, Spin, message } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import { getActivitySportsIcon } from 'v2/generalActivityFunction';

const ActivityMangementDashboard = () => {
  const history = useHistory();
  const [studentBMIDetails, setStudentBMIDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [sportsDetails, setSportsDetails] = useState({});
  const { erp, token } = JSON.parse(localStorage.getItem('userDetails'));

  const fetchStudentBMIDetails = (params = {}) => {
    axios
      .get(`${endpoints?.activityManagementDashboard?.studentbmiDetails}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setStudentBMIDetails(res?.data?.result[0]);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const fetchSportsDetails = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints?.activityManagementDashboard?.studentSportsDetails}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSportsDetails(res?.data?.data);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (erp) {
      fetchStudentBMIDetails({
        erp_id: erp,
      });
      fetchSportsDetails({
        erp_id: erp,
      });
    }
  }, [erp]);

  return (
    <Layout>
      <div className='row'>
        <div className='col-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Activity Management Dashboard
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-12 py-3'>
          <div className='th-bg-white py-2'>
            <div className='row align-items-center py-2'>
              <div className='col-3'>
                <span className='th-fw-500 th-16'>Sports Activities</span>
              </div>
              {Object.keys(studentBMIDetails).length > 0 && (
                <div className='col-9'>
                  <div
                    className='row py-1 align-items-center th-br-8 th-fw-500'
                    style={{ outline: '1px solid #d9d9d9' }}
                  >
                    <div className='col-md-3'>BMI Details : </div>
                    <div className='col-md-3'>
                      Height :{' '}
                      <span className='th-primary'>{studentBMIDetails?.height} cm</span>
                    </div>
                    <div className='col-md-3'>
                      Wieght :{' '}
                      <span className='th-primary'>{studentBMIDetails?.weight} KGs</span>
                    </div>
                    <div className='col-md-3'>
                      Status :{' '}
                      <span className='th-primary'>{studentBMIDetails?.remarks} </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='row py-3 mt-2'>
              {loading ? (
                <div className='col-12 py-5 text-center'>
                  <Spin tip='Loading...' size='large' />
                </div>
              ) : (
                <>
                  {Object.keys(sportsDetails)
                    .filter((el) => sportsDetails[el].length > 0)
                    .map((item) => {
                      console.log('item', item);
                      return (
                        <div className='col-4'>
                          <div
                            className='th-br-8 th-bg-grey p-2 border-card'
                            style={{ height: 170 }}
                          >
                            <div className='d-flex flex-column'>
                              <div
                                className='mb-2 pb-1 d-flex align-items-center justify-content-between'
                                style={{ borderBottom: '1px solid #d9d9d9' }}
                              >
                                <div>
                                  <img
                                    src={getActivitySportsIcon(item.toLowerCase())}
                                    alt='swim'
                                    style={{ height: 30 }}
                                  />
                                  <span className='th-primary th-fw-600 pl-3'>
                                    {item}
                                  </span>
                                </div>
                                <div
                                  className='badge p-2 th-br-10 text-center th-bg-pink th-pointer'
                                  onClick={() => {
                                    history.push({
                                      pathname: '/student/phycial/activity',
                                      state: {
                                        activity: {
                                          name: 'Physical Activity',
                                          id: sportsDetails?.[item][0]?.all_act_ids,
                                          activity_sub_type_name:
                                            sportsDetails?.[item][0]
                                              ?.activity_sub_type_name,
                                          student_id:
                                            sportsDetails?.[item][0]?.student_id,
                                        },
                                      },
                                    });
                                  }}
                                >
                                  View &gt;
                                </div>
                              </div>
                              <div
                                className='d-flex flex-column justify-content-around'
                                style={{ height: 120 }}
                              >
                                {sportsDetails?.[item][0]?.user_reviews
                                  ?.slice(0, 2)
                                  ?.map((round, index) => {
                                    let rating = JSON.parse(round?.remarks).filter(
                                      (item) => item?.status == true
                                    )[0]?.name;
                                    return (
                                      <div className='py-2 th-black-2 row justify-content-between'>
                                        {/* <div className={`${index === 1 ? 'col-11' : 'col-12'}`}> */}
                                        <div className='col-12 px-0'>
                                          <div className='row'>
                                            <div
                                              className='col-8 th-truncate-2 text-break'
                                              title={round?.level?.name}
                                            >
                                              {round?.level?.name} :
                                            </div>
                                            <div
                                              className='col-4 th-fw-500 th-truncate-2 text-break'
                                              title={rating}
                                            >
                                              {rating}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivityMangementDashboard;
