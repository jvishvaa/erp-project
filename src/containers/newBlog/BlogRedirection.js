import React, { useState, useEffect } from 'react';
import './blog.css';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axiosInstance from '../../config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';
import { Breadcrumb, Button, message, Spin } from 'antd';
import moment from 'moment';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { getActivityIcon } from 'v2/getActivityIcon';
const BlogWallRedirect = () => {
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const history = useHistory();
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [physicalActivityId, setPhysicalActivityId] = useState('');
  const [visualId, setVisualId] = useState('');
  const [blogSubId, setBlogSubId] = useState('');
  const [publicSubId, setPublicSubId] = useState('');
  const [musicSubId, setMusicSubId] = useState('');
  const [danceSubId, setDanceSubId] = useState('');
  const [theaterSubId, setTheaterSubId] = useState('');

  const handleBlogWriting = () => {
    history.push('/blog/studentview');
  };

  const handlePublicSpeaking = () => {
    history.push('/blog/publicspeaking');
  };

  useEffect(() => {
    getActivitySession();
    ActvityLocalStorage();
  }, []);

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
        debugger;
        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      })
      .catch((err) => {});
  };

  const fetchActivityTypeList = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newBlog.blogRedirectApi}?type=student`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        const physicalData = result?.data?.result.filter(
          (item) => item?.name == 'Physical Activity'
        );
        setPhysicalActivityId(physicalData[0]);
        const visualData = result?.data?.result.filter(
          (item) => item?.name.toLowerCase() == 'visual art'
        );
        setVisualId(visualData[0]);
        const blogActivityData = result?.data?.result.filter(
          (item) => item?.name == 'Blog Activity'
        );
        setBlogSubId(blogActivityData[0]?.id);
        const publicActivityData = result?.data?.result.filter(
          (item) => item?.name == 'Public Speaking'
        );
        setPublicSubId(publicActivityData[0]?.id);
        setActivityData(result?.data?.result);
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
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    // }
  };

  useEffect(() => {
    fetchActivityTypeList();
  }, []);

  const handlePhysicalActivity = () => {
    history.push({
      pathname: '/student/phycial/activity',
      state: {
        activity: physicalActivityId,
      },
    });
  };

  const handleActivityRedirection = (activityName) => {
    const currentActivity =
      activityName == 'visual art'
        ? visualId
        : activityName == 'music'
        ? musicSubId
        : activityName == 'dance'
        ? danceSubId
        : theaterSubId;
    history.push({
      pathname: '/student/visual/activity',
      state: {
        activity: currentActivity,
      },
    });
  };

  const handleExplore = (data) => {
    let activityName = data?.name.toLowerCase();
    if (activityName == 'blog activity') {
      localStorage.setItem('BlogActivityId', JSON.stringify(blogSubId));
      handleBlogWriting();
      return;
    } else if (activityName === 'public speaking') {
      localStorage.setItem('PublicActivityId', JSON.stringify(publicSubId));
      handlePublicSpeaking();
      return;
    } else if (activityName === 'physical activity') {
      localStorage.setItem('PhysicalActivityId', JSON.stringify(physicalActivityId));

      handlePhysicalActivity();
      return;
    } else if (activityName === 'visual art') {
      localStorage.setItem('ActivityData', JSON.stringify(visualId));
      handleActivityRedirection(activityName);
      return;
    } else if (activityName === 'music') {
      localStorage.setItem('ActivityData', JSON.stringify(musicSubId));
      handleActivityRedirection(activityName);
      return;
    } else if (activityName === 'dance') {
      localStorage.setItem('ActivityData', JSON.stringify(danceSubId));
      handleActivityRedirection(activityName);
      return;
    } else if (activityName === 'theater') {
      localStorage.setItem('ActivityData', JSON.stringify(theaterSubId));
      handleActivityRedirection(activityName);
      return;
    } else {
      message.error('Permission Denied');
      return;
    }
  };

  return (
    <Layout>
      {''}
      <div className='row px-2'>
        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-grey th-16'>
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
          ) : activityData.length > 0 ? (
            <div className='row p-3'>
              {activityData
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((each, index) => (
                  <div className='col-md-4 mb-2 '>
                    <div className='th-br-10 th-bg-grey shadow-sm wall_card'>
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
                                <span className='th-12 th-fw-500 ml-2'>
                                  {each?.title}
                                </span>
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
export default BlogWallRedirect;
