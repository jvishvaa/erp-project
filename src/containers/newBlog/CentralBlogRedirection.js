import React, { useState, useEffect, useContext } from 'react';
import './blog.css';
import Layout from 'containers/Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { Breadcrumb, Tabs, Spin, Button } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

import axios from 'axios';
import moment from 'moment';
import { getActivityIcon } from 'v2/generalActivityFunction';

const drawerWidth = 350;
const { TabPane } = Tabs;

const CentralBlogRedirection = () => {
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const history = useHistory();
  const [periodData, setPeriodData] = useState([]);
  const [subId, setSubId] = useState('');
  const [blogSubId, setBlogSubId] = useState('');
  const [visualSubId, setVisualSubId] = useState('');
  const [musicSubId, setMusicSubId] = useState('');
  const [theaterSubId, setTheaterSubId] = useState('');
  const [danceSubId, setDanceSubId] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [blogLoginId, setBlogLoginId] = useState('');

  const handleBlogWriting = () => {
    history.push('/blog/studentview');
  };

  const handlePublicSpeaking = () => {
    history.push({
      pathname: '/physical/activity',
      state: {
        subActiveId: subId,
      },
    });
  };

  const handleBlogActivity = () => {
    history.push({
      pathname: '/blog/blogview',
      state: {
        blogLoginId: blogLoginId,
      },
    });
  };

  const handleVisualActivityRoute = (data) => {
    if (data.toLowerCase() === 'visual art') {
      history.push({
        pathname: '/visual/activity',
        state: {
          subActiveId: visualSubId,
        },
      });
    } else if (data.toLowerCase() === 'music') {
      history.push({
        pathname: '/visual/activity',
        state: {
          subActiveId: musicSubId,
        },
      });
    } else if (data.toLowerCase() === 'dance') {
      history.push({
        pathname: '/visual/activity',
        state: {
          subActiveId: musicSubId,
        },
      });
    } else if (data.toLowerCase() === 'theater') {
      history.push({
        pathname: '/visual/activity',
        state: {
          subActiveId: theaterSubId,
        },
      });
    }
  };

  const periodDataAPI = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newBlog.blogRedirectApi}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        setLoading(false);
        setPeriodData(result?.data?.result);
        const physicalData = result?.data?.result.filter(
          (item) => item?.name == 'Physical Activity'
        );
        setSubId(physicalData[0]?.id);
        const blogActivityData = result?.data?.result.filter(
          (item) => item?.name == 'Blog Activity'
        );
        setBlogSubId(blogActivityData[0]?.id);
        const visualActivityData = result?.data?.result.filter(
          (item) => item?.name.toLowerCase() === 'visual art'
        );
        setVisualSubId(visualActivityData[0]);
        const musicActivityData = result?.data?.result.filter(
          (item) => item?.name.toLowerCase() === 'music'
        );
        setMusicSubId(musicActivityData[0]);
        const danceActivityData = result?.data?.result.filter(
          (item) => item?.name.toLowerCase() === 'dance'
        );
        setDanceSubId(danceActivityData[0]);
        const theaterActivityData = result?.data?.result.filter(
          (item) => item?.name.toLowerCase() === 'theater'
        );
        setTheaterSubId(theaterActivityData[0]);
      })
      .catch((err) => {
        setLoading(false);
      });
    // }
  };

  useEffect(() => {
    periodDataAPI();
  }, []);

  const handleExplore = (data) => {
    let dataLower = data?.name.toLowerCase();
    if (
      dataLower == 'blog wall' ||
      dataLower == 'blog writing' ||
      dataLower == 'blog writting'
    ) {
      return;
    } else if (dataLower === 'public speaking') {
      // handlePublicSpeaking()
      // return
    } else if (dataLower === 'physical activity') {
      localStorage.setItem('PhysicalActivityId', JSON.stringify(subId));
      handlePublicSpeaking();
      return;
    } else if (dataLower === 'art writting' || dataLower === 'blog activity') {
      localStorage.setItem('BlogActivityId', JSON.stringify(blogSubId));
      if (user_level === 2 || user_level === 8 || user_level === 11) {
        handleBlogActivity();
        return;
      } else if (user_level === 13) {
        handleBlogWriting();
        return;
      } else {
        setAlert('error', 'Permission Denied');
        return;
      }
    } else if (dataLower === 'visual art') {
      localStorage.setItem('ActivityData', JSON.stringify(visualSubId));
      if (user_level === 2 || user_level === 6 || user_level === 11 || user_level === 8) {
        handleVisualActivityRoute(dataLower);
        return;
      } else if (user_level === 13) {
        setAlert('error', 'Permission Denied');
        return;
      } else {
        setAlert('error', 'Permission Denied');
        return;
      }
    } else if (dataLower === 'music') {
      localStorage.setItem('ActivityData', JSON.stringify(musicSubId));
      if (user_level === 2 || user_level === 6 || user_level === 11 || user_level === 8) {
        handleVisualActivityRoute(dataLower);
        return;
      } else if (user_level === 13) {
        setAlert('error', 'Permission Denied');
        return;
      } else {
        setAlert('error', 'Permission Denied');
        return;
      }
    } else if (dataLower === 'dance') {
      localStorage.setItem('ActivityData', JSON.stringify(danceSubId));
      if (user_level === 2 || user_level === 6 || user_level === 11 || user_level === 8) {
        handleVisualActivityRoute(dataLower);
        return;
      } else if (user_level === 13) {
        setAlert('error', 'Permission Denied');
        return;
      } else {
        setAlert('error', 'Permission Denied');
        return;
      }
    } else if (dataLower === 'theater') {
      localStorage.setItem('ActivityData', JSON.stringify(theaterSubId));
      if (user_level === 2 || user_level === 6 || user_level === 11 || user_level === 8) {
        handleVisualActivityRoute(dataLower);
        return;
      } else if (user_level === 13) {
        setAlert('error', 'Permission Denied');
        return;
      } else {
        setAlert('error', 'Permission Denied');
        return;
      }
    } else {
      setAlert('error', 'Level Does Not Exist');
      return;
    }
  };

  const getActivitySession = () => {
    setLoading(true);
    axios
      .post(
        `${endpoints.newBlog.activitySessionLogin}`,
        {},
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        setBlogLoginId(response?.data?.result);
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ActvityLocalStorage = () => {
    setLoading(true);
    axios
      .post(
        `${endpoints.newBlog.activityWebLogin}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        // getActivitySession();

        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    localStorage.setItem('PhysicalActivityId', '');
    getActivitySession();
    ActvityLocalStorage();
  }, []);
  return (
    <Layout>
      {''}
      <div className='row px-2'>
        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
              Activities Management
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='row th-bg-white th-br-5 m-3'>
          {loading ? (
            <div
              className='d-flex align-items-center justify-content-center w-100'
              style={{ height: '50vh' }}
            >
              <Spin tip='Loading' />
            </div>
          ) : periodData.length > 0 ? (
            <div className='row p-3' style={{ height: '72vh', overflowY: 'auto' }}>
              {periodData?.map((each, index) => (
                <div className='col-md-4 mb-2 mb-sm-0 '>
                  <div className='th-br-10 th-bg-grey shadow-sm'>
                    <div className='row p-3'>
                      <div className='col-4 px-0 th-br-5'>
                        <img
                          src={getActivityIcon(each?.name)}
                          alt='Icon'
                          style={{
                            height: '150px',
                            width: '100%',
                            objectFit: '-webkit-fill-available',
                          }}
                          className='th-br-5'
                        />
                      </div>
                      <div className='col-8 pr-0'>
                        <div className='d-flex flex-column justify-content-between h-100'>
                          <div className='d-flex flex-column align-item-center th-black-1 '>
                            <div className=''>
                              <span className='th-18 th-fw-700 text-capitalize'>
                                {each?.name}
                              </span>
                            </div>
                            <div>
                              <span className='th-12 th-fw-300'>
                                {each?.count}{' '}
                                {each?.count == 1 ? 'Activity' : 'Activities'}
                              </span>
                            </div>
                          </div>
                          <div className='d-flex flex-column th-bg-pink align-item-center th-br-5'>
                            <div className=''>
                              <span className='th-12 th-fw-300 ml-2 text-capitalize th-blue-1'>
                                Recently Added
                              </span>
                            </div>
                            <div>
                              <span className='th-12 th-fw-500 ml-2'>{each?.title}</span>
                            </div>
                          </div>
                          <div className='row align-item-center'>
                            <div className='col-sm-6 pl-0'>
                              <div className='th-12 th-fw-300 text-capitalize th-black-1'>
                                Last Updated
                              </div>
                              <div className='th-12 th-fw-400'>
                                {moment(each?.last_update).format('ll')}
                              </div>
                            </div>
                            <div className='col-sm-6 text-sm-right px-0 px-sm-2 pt-1 pt-sm-0'>
                              <Button
                                className='th-button-active th-br-6 text-truncate th-pointer'
                                onClick={() => handleExplore(each)}
                              >
                                Explore &gt;
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center w-100 py-5'>
              <img src={NoDataIcon} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default CentralBlogRedirection;
