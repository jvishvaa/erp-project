import React, { useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from 'containers/Layout';
import {
  Breadcrumb,
  Select,
  Tabs,
  Button,
  DatePicker,
  message,
  Spin,
  Divider,
} from 'antd';
import moment from 'moment';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import GeneralDiaryCard from 'v2/FaceLift/Diary/Diary-Card/GeneralDiaryCard.js';
import DailyDiaryCard from 'v2/FaceLift/Diary/Diary-Card/DailyDiaryCard.js';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
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
  const [gradeDropdown, setGradeDropdown] = useState();
  const [gradeID, setGradeID] = useState();
  const [loading, setLoading] = useState(false);
  const [sectionDropdown, setSectionDropdown] = useState();
  const [sectionID, setSectionID] = useState();
  const [date, setDate] = useState(moment().format(dateFormat));
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [showTab, setShowTab] = useState('1');
  const [dataFiltered, setDataFiltered] = useState(false);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const { Option } = Select;
  const formRef = createRef();
  const history = useHistory();
  const { TabPane } = Tabs;

  const onTabChange = (key) => {
    setShowTab(key);
  };

  const fetchDailyDiaryList = () => {
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
      date_fetch: date,
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
  const handleCreateGeneralDiary = () => {
    history.push('/create/general-diary');
  };
  console.log('showTabData', dailyDiaryData);
  const handleCreateDailyDiary = () => {
    history.push('/create/daily-diary');
  };

  const handleClearGrade = () => {
    setSectionDropdown([]);
  };

  const handleClearAll = () => {
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
    setSectionDropdown([]);
    setGradeID();
    setSectionID();
    // setDiaryListData([]);
    setDataFiltered(false);
  };

  const sectionOptions = sectionDropdown?.map((each) => {
    return (
      <Option key={each?.section_id} value={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const handleSection = (e) => {
    const sections = e.map((item) => item?.value).join(',');
    setSectionID(sections);
  };

  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const handleGrade = (e, value) => {
    const grades = e.map((item) => item?.value).join(',');
    setSectionDropdown([]);
    formRef.current.setFieldsValue({
      section: [],
    });

    if (grades) {
      setGradeID(grades);
      const params = {
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        grade_id: grades,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.sections}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            const sectionData = result?.data?.data || [];
            setSectionDropdown(sectionData);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          const gradeData = result?.data?.data || [];
          setGradeDropdown(gradeData);
        }
      })
      .catch((error) => message.error('error', error?.message));
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
      <div className='row th-bg-white'>
        <div className='col-12 px-md-4'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-grey'>Diary</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>View Diary</Breadcrumb.Item>
          </Breadcrumb>
        </div>
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
              format={dateFormat}
            />
          </div>
          {!isStudentDiary && (
            <div className='col-md-2'>
              <Button
                type='primary'
                className='th-br-6 th-bg-primary th-pointer th-white'
                onClick={() => history.push('/create-diary')}
                block
              >
                <PlusOutlined className='ml-2' />
                Create Diary
              </Button>
            </div>
          )}
        </div>
        {showTab == 1 && (
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
                {dailyDiaryData?.map((item, i) => (
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
              </>
            ) : null}
          </div>
        )}
        <div className='row px-3 py-3'>
          <Tabs activeKey={showTab} onChange={onTabChange} className='th-width-100 px-3'>
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
      </div>
    </Layout>
  );
};

export default Diary;
