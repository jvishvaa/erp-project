import React, { useState, useEffect } from 'react';
import { Breadcrumb, Tabs, Select, DatePicker, Spin, Pagination } from 'antd';
import Layout from 'v2/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ListCard from './ListCard';
import { getSortedAnnouncements } from 'v2/generalAnnouncementFunctions';
import { DownOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import '../index.css';
const { TabPane } = Tabs;
const { Option } = Select;

const AnnouncementList = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const [loading, setLoading] = useState(false);
  const [showTab, setShowTab] = useState('1');
  const [announcementList, setAnnouncementList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('All');
  const [pageNumber, setPageNumber] = useState(1);
  const [listCount, setListCount] = useState('');
  const [date, setDate] = useState('');
  const history = useHistory();

  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    } else {
      setDate('');
    }
  };

  const onChange = (key) => {
    setShowTab(key.toString());
  };

  const handleCategoryChange = (e, value) => {
    if (e) {
      setSelectedCategoryId(e);
      setSelectedCategoryName(value.children);
    } else {
      setSelectedCategoryId('');
      setSelectedCategoryName('All');
    }
  };

  const fetchAnnouncementList = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.adminDashboard.announcements}`, {
        params: {
          ...params,
          ...(date ? { date: date } : {}),
          ...(selectedCategoryId ? { is_category: selectedCategoryId } : {}),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAnnouncementList(response?.data?.data);
          setListCount(response?.data?.count);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    axios
      .get(`${endpoints.createAnnouncement.announcementCategory}`, {})
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setCategories(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const categoryOptions = categories?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.category_name}
      </Option>
    );
  });

  useEffect(() => {
    if (showTab == 1) {
      fetchAnnouncementList({
        session_year: selectedAcademicYear?.id,
        page_number: pageNumber,
        page_size: 10,
      });
    } else if (showTab == 2) {
      fetchAnnouncementList({
        session_year: selectedAcademicYear?.id,
        page_number: pageNumber,
        page_size: 10,
        is_draft: 'True',
      });
    } else {
      fetchAnnouncementList({
        session_year: selectedAcademicYear?.id,
        page_number: pageNumber,
        page_size: 10,
        is_sent: 'True',
      });
    }
  }, [showTab, pageNumber, date, selectedCategoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const TabContent = () => {
    return (
      <>
        <div className='row mb-2 mb-md-0'>
          <div className='col-md-8 col-0'>{''}</div>
          <div className='col-md-2 col-5 px-0 px-md-2'>
            <Select
              className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
              bordered={false}
              value={selectedCategoryName}
              placement='bottomRight'
              placeholder={'All'}
              suffixIcon={<DownOutlined className='th-black-1' />}
              dropdownMatchSelectWidth={false}
              onChange={(e, val) => handleCategoryChange(e, val)}
              allowClear
              menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
            >
              {categoryOptions}
            </Select>
          </div>{' '}
          <div className='col-md-2 col-7 px-2 th-br-4'>
            <span className='d-flex'>
              <img src={calendarIcon} className='pl-2' />
              <DatePicker
                allowClear={true}
                bordered={false}
                placement='bottomRight'
                placeholder={'Till Date'}
                onChange={(value) => handleDateChange(value)}
                showToday={false}
                suffixIcon={<DownOutlined className='th-black-1' />}
                className='th-black-2 pl-0 th-date-picker th-pointer'
                format={'DD/MM/YYYY'}
              />
            </span>
          </div>
        </div>
        {loading ? (
          <div className='d-flex justify-content-center align-items-center h-50'>
            <Spin tip='Loading...' size='large' />
          </div>
        ) : listCount > 0 ? (
          announcementListData?.map((item) => {
            return (
              <div className='th-14 th-fw-500 th-black-1 th-lh-20 mb-4'>
                <div className='th-black-2 th-fw-600 mb-2'>{item?.date}</div>
                {item?.events.map((item) => (
                  <ListCard data={item} showTab={showTab} setTab={onChange} />
                ))}
              </div>
            );
          })
        ) : (
          <div className='d-flex justify-content-center mt-5'>
            <img src={NoDataIcon} />
          </div>
        )}

        {!loading && (
          <div className='text-center'>
            <Pagination
              current={pageNumber}
              hideOnSinglePage={true}
              showSizeChanger={false}
              onChange={(page) => {
                setPageNumber(page);
              }}
              total={listCount}
            />
          </div>
        )}
      </>
    );
  };

  const announcementListData = getSortedAnnouncements(announcementList, true);
  return (
    <React.Fragment>
      <Layout>
        {' '}
        <div className='row th-16 py-3 px-2'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>

              <Breadcrumb.Item className='th-black-1'>Announcements</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='card-container th-tabs'>
                <Tabs type='card' onChange={onChange} activeKey={showTab}>
                  <TabPane
                    tab={
                      <div>
                        INBOX{' '}
                        {showTab == 1 && !loading && (
                          <span className='th-fw-400'>({listCount})</span>
                        )}
                      </div>
                    }
                    key='1'
                  >
                    {TabContent()}
                  </TabPane>
                  {userLevel !== 12 && userLevel !== 13 && (
                    <>
                      <TabPane tab='DRAFTS' key='2'>
                        {TabContent()}
                      </TabPane>
                      <TabPane tab='SENT' key='3'>
                        {TabContent()}
                      </TabPane>
                    </>
                  )}
                </Tabs>
              </div>
              {userLevel !== 12 && userLevel !== 13 && (
                <div
                  style={{ position: 'fixed', bottom: '5%', right: '2%' }}
                  className='th-bg-primary th-white th-br-6 px-4 py-3 th-fw-500 th-pointer'
                  onClick={() => history.push('./create-announcement')}
                >
                  <span className='d-flex align-items-center'>
                    <PlusOutlined size='small' className='mr-2' />
                    Create New
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default AnnouncementList;
