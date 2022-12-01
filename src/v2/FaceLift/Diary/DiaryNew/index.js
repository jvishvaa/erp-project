import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from 'containers/Layout';
import { Breadcrumb, Tabs, Button, DatePicker, message, Spin, Divider } from 'antd';
import moment from 'moment';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import GeneralDiaryCard from 'v2/FaceLift/Diary/DiaryNew/Diary-Card/GeneralDiaryCard.js';
import DailyDiaryCard from 'v2/FaceLift/Diary/DiaryNew/Diary-Card/DailyDiaryCard.js';
import { PlusOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import GrievanceModal from 'v2/FaceLift/myComponents/GrievanceModal';

const dateFormat = 'YYYY-MM-DD';
const isOrchids =
  window.location.host.split('.')[0] === 'orchids' ||
  window.location.host.split('.')[0] === 'qa'
    ? true
    : false;
const Diary = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  let isStudentDiary = window.location.pathname.includes('diary/student');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [moduleId, setModuleId] = useState();
  const [generalDiaryList, setGeneralDiaryList] = useState([]);
  const [dailyDiaryData, setDailyDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(moment().format(dateFormat));
  const [showTab, setShowTab] = useState('1');
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [showSubjectsCount, setShowSubjectsCount] = useState(10);

  const history = useHistory();
  const { TabPane } = Tabs;

  const onTabChange = (key) => {
    setShowTab(key);
  };
  const handleCloseGrievanceModal = () => {
    setShowGrievanceModal(false);
  };

  const fetchDailyDiaryList = () => {
    setDailyDiaryData([]);
    setLoading(true);
    axios
      .get(`/academic/new/dialy-diary-messages/?date=${date}&diary_type=2`)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setDailyDiaryData(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error('error', error?.message);
        setLoading(false);
      });
  };

  const fetchGeneralDiaryList = () => {
    setLoading(true);
    const params = {
      created_date: date,
      dairy_type: 1,
      module_id: moduleId,
      session_year: selectedAcademicYear?.id,
      branch: selectedBranch?.branch?.id,
    };
    axios
      .get(`${endpoints.generalDiary.diaryList}`, { params })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setGeneralDiaryList(response?.data?.result?.results);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error('error', error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Diary' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Diary') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (date) {
      showTab == '1' ? fetchDailyDiaryList() : fetchGeneralDiaryList();
    }
  }, [date, showTab]);

  const handleDateChange = (value) => {
    setDate(moment(value).format(dateFormat));
  };
  return (
    <Layout>
      <div className='row pt-2'>
        <div className='col-12 px-md-4'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-grey'>Diary</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>View Diary</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-12 py-2'>
          <div className='row th-bg-white py-2'>
            <div className='row p-2 '>
              <div className='col-md-2'>
                <DatePicker
                  className='th-br-6 th-date-picker w-100'
                  disabledDate={(current) => current.isAfter(moment())}
                  allowClear={false}
                  placement='bottomRight'
                  defaultValue={moment()}
                  showToday={false}
                  onChange={handleDateChange}
                  format={'DD/MM/YYYY'}
                />
              </div>
              {!isStudentDiary && (
                <div className='col-md-2'>
                  <Button
                    type='primary'
                    className='th-br-6 th-bg-primary th-pointer th-white'
                    onClick={() => history.push('/create/diary')}
                    block
                  >
                    <PlusOutlined className='ml-2' />
                    Create Diary
                  </Button>
                </div>
              )}
            </div>
            {showTab == 1 && !isStudentDiary && (
              <div className='row px-2'>
                {dailyDiaryData.length > 0 ? (
                  <>
                    {dailyDiaryData.length > 1 && (
                      <>
                        <div className='col-md-2 col-6'>
                          <Button
                            className={`${
                              selectedSubject == '' ? 'th-button-active' : 'th-button'
                            } th-width-100 th-br-6 mt-2`}
                            onClick={() => setSelectedSubject('')}
                          >
                            All Subjects
                          </Button>
                        </div>
                      </>
                    )}
                    {dailyDiaryData?.slice(0, showSubjectsCount).map((item, i) => (
                      <div className='col-md-2 col-6'>
                        <Button
                          className={`${
                            item?.subject_id == selectedSubject
                              ? 'th-button-active'
                              : 'th-button'
                          } th-width-100 th-br-6 mt-2`}
                          onClick={() => setSelectedSubject(item?.subject_id)}
                        >
                          {item?.subject_name}
                        </Button>
                      </div>
                    ))}
                    {dailyDiaryData.length > 10 && (
                      <div className='col-md-2 col-6'>
                        <Button
                          className='th-button th-width-100 th-br-6 mt-2'
                          onClick={() => {
                            if (showSubjectsCount == dailyDiaryData.length) {
                              setShowSubjectsCount(10);
                            } else {
                              setShowSubjectsCount(dailyDiaryData.length);
                            }
                          }}
                        >
                          Show{' '}
                          {showSubjectsCount == dailyDiaryData.length ? 'Less' : 'More'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            )}
            <div className='row px-2 py-3'>
              <Tabs
                activeKey={showTab}
                onChange={onTabChange}
                className='th-width-100 px-3'
              >
                <TabPane tab='Daily Diary' key='1' className='th-pointer'>
                  <div className='row th-bg-white'>
                    {loading ? (
                      <div className='th-width-100 text-center mt-5'>
                        <Spin tip='Loading...'></Spin>
                      </div>
                    ) : dailyDiaryData.length > 0 ? (
                      <div
                        className='col-12 px-0'
                        style={{ maxHeight: 400, overflowY: 'scroll' }}
                      >
                        {isStudentDiary ? (
                          <div
                            className='row px-0'
                            // style={{ maxHeight: 400, overflowY: 'scroll' }}
                          >
                            {dailyDiaryData.map((each) =>
                              each?.grade_data?.map((item) => {
                                return (
                                  <div className='col-md-4 mb-2 pl-0'>
                                    <DailyDiaryCard
                                      diary={item}
                                      subject={each}
                                      isStudentDiary={true}
                                      fetchDiaryList={fetchDailyDiaryList}
                                    />
                                  </div>
                                );
                              })
                            )}
                          </div>
                        ) : (
                          <>
                            {dailyDiaryData
                              ?.filter((item) => {
                                if (selectedSubject) {
                                  return item?.subject_id == selectedSubject;
                                } else {
                                  return item;
                                }
                              })
                              .map((each) => {
                                return (
                                  <div className='row px-0 th-black-1 th-divider'>
                                    <Divider
                                      className=''
                                      orientation='left'
                                      orientationMargin='0'
                                    >
                                      <span className='th-fw-700 th-22'>
                                        {each?.subject_name}
                                      </span>
                                    </Divider>
                                    {each?.grade_data?.map((item) => {
                                      return (
                                        <div className='col-md-4 mb-2 pl-0'>
                                          <DailyDiaryCard
                                            diary={item}
                                            subject={each}
                                            fetchDiaryList={fetchDailyDiaryList}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className='row justify-content-center pt-5'>
                        <img src={NoDataIcon} />
                      </div>
                    )}
                  </div>
                </TabPane>
                <TabPane tab='General Diary' key='2' className='th-pointer'>
                  <div className='row'>
                    {loading ? (
                      <div className='th-width-100 text-center mt-5'>
                        <Spin tip='Loading...'></Spin>
                      </div>
                    ) : generalDiaryList.length > 0 ? (
                      generalDiaryList.map((diary, i) => (
                        <div className='col-md-4 mb-2 pl-0'>
                          <GeneralDiaryCard
                            diary={diary}
                            showTab={showTab}
                            isStudentDiary={isStudentDiary}
                            fetchDiaryList={fetchGeneralDiaryList}
                          />
                        </div>
                      ))
                    ) : (
                      <div className='row justify-content-center pt-5'>
                        <img src={NoDataIcon} />
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
            {(user_level == 13 || user_level == 12) && isOrchids ? (
              <div
                className='row justify-content-end'
                style={{ position: 'fixed', bottom: '5%', right: '2%' }}
              >
                <div
                  className='th-bg-white px-2 py-1 th-br-6 th-pointer'
                  style={{ border: '1px solid #d9d9d9' }}
                  onClick={() => setShowGrievanceModal(true)}
                >
                  Having any issues with Diary ?<br />
                  <span
                    className='th-primary pl-1'
                    style={{ textDecoration: 'underline' }}
                  >
                    Raise your query
                  </span>
                </div>
              </div>
            ) : null}
            {showGrievanceModal && (
              <GrievanceModal
                title={'Dairy Related Query'}
                showGrievanceModal={showGrievanceModal}
                handleClose={handleCloseGrievanceModal}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Diary;
