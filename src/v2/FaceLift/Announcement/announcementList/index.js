import React, { useState, useEffect } from 'react';
import { Breadcrumb, Tabs, Select, DatePicker, Spin, Pagination, Button } from 'antd';
import Layout from 'containers/Layout';
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
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
    window.location.host.split('.')[0] === 'localhost:3000'
      ? true
      : false;
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
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
  const [branchIds, setBranchIds] = useState('');
  const [allowedPublishBranches, setAllowedPublishBranches] = useState([]);
  const [showCategoryCount, setShowCategoryCount] = useState(5);
  const [category, setCategory] = useState('');
  const history = useHistory();
  const showBranchFilter = [1, 2, 4, 8, 9];
  const branchOptions = branchList?.map((each) => {
    return (
      <Option value={each?.branch?.id} key={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });
  const handleBranchChange = (item) => {
    const branches = item?.map((i) => i.value).join(',');
    setBranchIds(branches);
  };
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
          ...(branchIds
            ? { branch_id: branchIds }
            : { branch_id: selectedBranch?.branch?.id }),
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
          let categories_ordered = res?.data?.data;
          [categories_ordered[0], categories_ordered[5]] = [categories_ordered[5], categories_ordered[0]];
          // swapping "Holiday" and "Circular" 
          // Circular Exam Event General TimeTable [Top  5 - not ordered]
          setCategories(categories_ordered);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchAnnouncementConfigs = () => {
    axios
      .get(
        `${endpoints.academics.getConfigAnnouncement}?config_key=anncmt_cumctn_config&config_type=json`
      )
      .then((res) => {
        if (res?.data?.status_code == 200) {
          if (res?.data?.result?.enbl_brnches.length > 0) {
            setAllowedPublishBranches(res?.data?.result?.enbl_brnches);
          } else {
            setAllowedPublishBranches([]);
          }
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
  }, [showTab, pageNumber, date, selectedCategoryId, branchIds]);

  useEffect(() => {
    fetchCategories();
    fetchAnnouncementConfigs();
  }, [window.location.pathname]);

  useEffect(() => {
    handleCategoryChange(category?.id, category?.category_name);
  }, [category]);

  const headerStyling = {
    backgroundColor: '#cccccc',
    padding: '10px',
  };

  const TabContent = () => {
    return (
      <>
        <div className='row'>
          <div className='col-md-6 col-0'>{''}</div>
          <div className='col-md-4 px-0 py-2 py-md-0'>
            {showBranchFilter.includes(userLevel) && (
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                className='th-primary th-bg-grey th-br-4 th-width-100 text-left'
                placement='bottomRight'
                mode='multiple'
                maxTagCount={3}
                showArrow={true}
                allowClear={true}
                bordered={false}
                suffixIcon={<DownOutlined className='th-primary' />}
                placeholder='Select Branches'
                // placeholder={
                //   <span className='th-primary'>{selectedBranch?.branch?.branch_name}</span>
                // }
                dropdownMatchSelectWidth={false}
                onChange={(e, value) => handleBranchChange(value)}
                optionFilterProp='children'
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {branchOptions}
              </Select>
            )}
          </div>
          {/* <div className='col-md-2 col-5 px-0 px-md-2'>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
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
            </div>{' '} */}
          <div className='col-md-2'>
            <span className='d-flex py-1'>
              <img src={calendarIcon} className='pl-2' />
              <DatePicker
                allowClear={true}
                bordered={false}
                placement='bottomRight'
                placeholder={'Select Date'}
                onChange={(value) => handleDateChange(value)}
                showToday={false}
                suffixIcon={<DownOutlined className='th-black-1' />}
                className='th-black-2 pl-0 th-date-picker th-pointer'
                format={'DD/MM/YYYY'}
              />
            </span>
          </div>
        </div>
        <div className='mb-3'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='row'>
                <div className='md-1 px-1 py-1'>
                  <Button
                    className={`${
                      selectedCategoryName == 'All' ? 'th-button-active' : 'th-button'
                    } th-br-4`}
                    onClick={() => setCategory()}
                  >
                    <span>All</span>
                  </Button>
                </div>
                {categories?.slice(0, showCategoryCount).map((item) => (
                  <div className='md-1 px-1 py-1'>
                    <Button
                      className={`${
                        item?.id == category?.id ? 'th-button-active' : 'th-button'
                      } th-br-4`}
                      onClick={() => setCategory(item)}
                    >
                      <span>{item?.category_name}</span>
                    </Button>
                  </div>
                ))}
                {categories.length > 5 && (
                  <div className='md-1 px-1 py-1'>
                    <Button
                      className='th-button th-br-4'
                      type='secondary'
                      onClick={() => {
                        showCategoryCount == categories.length
                          ? setShowCategoryCount(5)
                          : setShowCategoryCount(categories.length);
                      }}
                    >
                      Show {showCategoryCount == categories.length ? 'Less' : 'Other Categories'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <>
          <div className='row mb-3 px-1'>
            <div className='col-md-12' style={headerStyling}>
              <div className='row'>
                <div className='col-md-1 col-4'>
                  <b>TYPE</b>
                </div>
                <div className='col-md-2 col-5 text-truncate'>
                  <b>TITLE</b>
                </div>
                <div className='col-md-7 col-5 text-truncate'>
                  <b>DESCRIPTION</b>
                </div>
                {showTab != 2 ? (
                  <div className='col-md-2 col-3 px-md-3 text-right'>
                    <b>TIME LINE</b>
                  </div>
                ) : (
                  <div className='col-md-2 col-3 pl-5 pr-1 text-center'>
                    <b>ACTION</b>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
        {loading ? (
          <div className='d-flex justify-content-center align-items-center h-50 pt-5'>
            <Spin tip='Loading...' size='large' />
          </div>
        ) : listCount > 0 ? (
          announcementListData?.map((item) => {
            return (
              <div className='th-14 th-fw-500 th-black-1 th-lh-20 mb-4 px-2'>
                <div className='th-black-2 th-fw-600 mb-2'>{item?.date}</div>
                {item?.events.map((item) => (
                  <ListCard
                    data={item}
                    showTab={showTab}
                    setTab={onChange}
                    allowedPublishBranches={allowedPublishBranches}
                  />
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

              <Breadcrumb.Item className='th-black-1 th-16'>
                Announcements
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='row'>
            <div className='col-12 px-2'>
              <div className='th-bg-white th-tabs'>
                <Tabs type='card' onChange={onChange} activeKey={showTab}>
                  <TabPane
                    tab={
                      <div>
                        INBOX{' '}
                        {showTab == 1 && !loading && (
                          <span className='th-fw-400'>
                            {listCount > 0 ? `(${listCount})` : ''}
                          </span>
                        )}
                      </div>
                    }
                    key='1'
                  >
                    {TabContent()}
                  </TabPane>
                  {userLevel !== 12 && userLevel !== 13 && (
                    <>
                      <TabPane
                        tab={
                          <div>
                            DRAFTS{' '}
                            {showTab == 2 && !loading && (
                              <span className='th-fw-400'>
                                {listCount > 0 ? `(${listCount})` : ''}
                              </span>
                            )}
                          </div>
                        }
                        key='2'
                      >
                        {TabContent()}
                      </TabPane>
                      <TabPane
                        tab={
                          <div>
                            SENT{' '}
                            {showTab == 3 && !loading && (
                              <span className='th-fw-400'>
                                {listCount > 0 ? `(${listCount})` : ''}
                              </span>
                            )}
                          </div>
                        }
                        key='3'
                      >
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
              )}{' '}
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default AnnouncementList;
