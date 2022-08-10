import React, { useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from 'containers/Layout';
import { Breadcrumb, Select, Tabs, Button, DatePicker, message, Form } from 'antd';
import moment from 'moment';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import DiaryCard from 'v2/FaceLift/Diary/Diary-Card/index';
import { DownOutlined, CheckOutlined } from '@ant-design/icons';

const Diary = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const academicYearList = useSelector(
    (state) => state.commonFilterReducer?.academicYearList
  );
  const [moduleId, setModuleId] = useState();
  const [periodData, setPeriodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [academicYearID, setAcademicYearID] = useState();
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [branchID, setBranchID] = useState();
  const [gradeDropdown, setGradeDropdown] = useState();
  const [gradeID, setGradeID] = useState();
  const [sectionDropdown, setSectionDropdown] = useState();
  const [sectionID, setSectionID] = useState();
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [showTab, setShowTab] = useState('1');

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const { Option } = Select;
  const formRef = createRef();
  const history = useHistory();
  const { TabPane } = Tabs;

  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/MM/DD';

  const onChange = (key) => {
    setShowTab(key);
  };

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const fetchDiaryList = () => {
    if (!branchID || !sectionID || !academicYearID || !gradeID) {
      message.error('Please Select All Filters');
    } else {
      setLoading(true);
      const params = {
        module_id: moduleId,
        session_year: academicYearID,
        branch: branchID,
        grades: gradeID,
        sections: sectionID,
        page: 1,
        page_size: 6,
        start_date: startDate,
        end_date: endDate,
      };
      axios
        .get(`${endpoints.generalDiary.diaryList}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setPeriodData(result?.data?.result?.results.reverse());
            setLoading(false);
          }
        })
        .catch((error) => {
          message.error('error', error?.message);
          setLoading(false);
        });
    }
  };

  const handleCreateGeneralDiary = () => {
    history.push('/create/general-diary');
  };

  const handleCreateDailyDiary = () => {
    history.push('/create/daily-diary');
  };

  const handleClearAcademic = () => {
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSectionDropdown([]);
  };

  const handleClearBranch = () => {
    setGradeDropdown([]);
    setSectionDropdown([]);
  };

  const handleClearGrade = () => {
    setSectionDropdown([]);
  };

  const handleClearAll = () => {
    formRef.current.setFieldsValue({
      year: null,
      branch: null,
      grade: [],
      section: [],
    });
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSectionDropdown([]);
    setAcademicYearID();
    setBranchID();
    setGradeID();
    setSectionID();
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
        session_year: academicYearID,
        branch_id: branchID,
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

  const branchOptions = branchDropdown?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const handleBranch = (e, value) => {
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
    setGradeDropdown([]);
    setSectionDropdown([]);
    if (e) {
      setBranchID(e);
      const params = {
        session_year: academicYearID,
        branch_id: e,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.grades}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            const gradeData = result?.data?.data || [];
            setGradeDropdown(gradeData);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const yearOptions = academicYearList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.session_year}
      </Option>
    );
  });

  const handleAcademicYear = (e) => {
    formRef.current.setFieldsValue({
      branch: null,
      grade: [],
      section: [],
    });
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSectionDropdown([]);
    if (e) {
      setAcademicYearID(e);
      const params = {
        session_year: e,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.branches}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setBranchDropdown(result?.data?.data?.results);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
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

  return (
    <Layout>
      <div className='row'>
        <div className='col-12 px-md-4'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-black-1'>Diary</Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>Teacher Diary</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='row mt-3'>
          <div className='col-12 px-2 px-md-3'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row py-2'>
                <div className='col-md-3 pl-md-2'>
                  <Form.Item name='year'>
                    <Select
                      className='th-width-100 th-br-6 text-left'
                      onChange={handleAcademicYear}
                      placeholder='Academic Year'
                      allowClear
                      onClear={handleClearAcademic}
                    >
                      {yearOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-3'>
                  <Form.Item name='branch'>
                    <Select
                      className='th-width-100 th-br-4 text-left'
                      onChange={handleBranch}
                      placeholder='Branch'
                      allowClear
                      onClear={handleClearBranch}
                    >
                      {branchOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-3'>
                  <Form.Item name='grade'>
                    <Select
                      mode='multiple'
                      className='th-grey th-bg-grey th-br-4 w-100 text-left'
                      placement='bottomRight'
                      placeholder='Grades'
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      maxTagCount={2}
                      allowClear={true}
                      dropdownMatchSelectWidth={false}
                      onChange={(e, value) => handleGrade(value)}
                      onClear={handleClearGrade}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-3'>
                  <Form.Item name='section'>
                    <Select
                      mode='multiple'
                      placeholder='Sections'
                      className='th-grey th-bg-grey th-br-4 w-100 text-left'
                      placement='bottomRight'
                      showArrow={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      maxTagCount={2}
                      allowClear={true}
                      dropdownMatchSelectWidth={false}
                      onChange={(e, value) => handleSection(value)}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {sectionOptions}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>

        <div className='row p-2'>
          <div className='col-md-3'>
            <RangePicker
              className='th-width-100 th-br-4'
              onChange={(value) => handleDateChange(value)}
              defaultValue={[moment(), moment()]}
              format={dateFormat}
              separator={'to'}
            />
          </div>
        </div>

        <div className='row p-2'>
          <div className='col-md-2 col-6 mb-2 mb-md-0'>
            <Button
              type='primary'
              className='th-br-6 th-pointer th-bg-grey th-black-2'
              onClick={handleClearAll}
              block
            >
              Clear All
            </Button>
          </div>
          <div className='col-md-2 col-6 mb-2 mb-md-0'>
            <Button
              type='primary'
              className='th-br-6 th-bg-primary th-pointer th-white'
              onClick={fetchDiaryList}
              block
            >
              Filter
            </Button>
          </div>
          <div className='col-md-3 mb-2 mb-md-0'>
            <Button
              type='primary'
              className='th-br-6 th-bg-primary th-pointer th-white'
              onClick={handleCreateGeneralDiary}
              block
            >
              Create General Diary
            </Button>
          </div>
          <div className='col-md-3 mb-2 mb-md-0'>
            <Button
              type='primary'
              className='th-br-6 th-pointer th-bg-primary th-white'
              onClick={handleCreateDailyDiary}
              block
            >
              Create Daily Diary
            </Button>
          </div>
        </div>
        <div className='row px-3 py-3'>
          <Tabs defaultActiveKey='1' onChange={onChange} className='th-width-100 px-3'>
            <TabPane tab='All' key='1' className='th-pointer'>
              <div className='row'>
                {loading ? (
                  <div className='th-width-100 text-center mt-5'>
                    <Spin tip='Loading...'></Spin>
                  </div>
                ) : (
                  periodData?.map((diary, i) => (
                    <div className='col-md-4'>
                      <DiaryCard
                        diary={diary}
                        showTab={showTab}
                        fetchDiaryList={fetchDiaryList}
                      />
                    </div>
                  ))
                )}
              </div>
            </TabPane>
            <TabPane tab='Daily Diary' key='2' className='th-pointer'>
              <div className='row'>
                {loading ? (
                  <div className='th-width-100 text-center mt-5'>
                    <Spin tip='Loading...'></Spin>
                  </div>
                ) : (
                  periodData
                    ?.filter((item) => item.dairy_type == 2)
                    .map((diary, i) => (
                      <div className='col-md-4'>
                        <DiaryCard
                          diary={diary}
                          showTab={showTab}
                          fetchDiaryList={fetchDiaryList}
                        />
                      </div>
                    ))
                )}
              </div>
            </TabPane>
            <TabPane tab='General Diary' key='3' className='th-pointer'>
              <div className='row'>
                {loading ? (
                  <div className='th-width-100 text-center mt-5'>
                    <Spin tip='Loading...'></Spin>
                  </div>
                ) : (
                  periodData
                    ?.filter((item) => item.dairy_type == 1)
                    .map((diary, i) => (
                      <div className='col-md-4 mb-2'>
                        <DiaryCard
                          diary={diary}
                          showTab={showTab}
                          fetchDiaryList={fetchDiaryList}
                        />
                      </div>
                    ))
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
