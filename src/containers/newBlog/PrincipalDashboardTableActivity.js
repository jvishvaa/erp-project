import React, { useState, useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message, Tabs, DatePicker } from 'antd';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { DownOutlined } from '@ant-design/icons';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import PublicSpeakingPrincipalTable from './PublicSpeakingPrincipalTable';

const PrincipalDashboardTableActivity = () => {
  const boardListData = useSelector((state) => state.commonFilterReducer?.branchList);
  const formRef = createRef();
  const [value, setValue] = React.useState(0);
  const localActivityData = JSON.parse(localStorage.getItem('ActivityData')) || {};
  const subLocalActivityData = localStorage.getItem('VisualActivityId')
    ? JSON.parse(localStorage.getItem('VisualActivityId'))
    : '';
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
  const newBranches =
    JSON?.parse(localStorage?.getItem('ActivityManagementSession')) || {};
  const user_level = dataes?.user_level;
  const [moduleId, setModuleId] = useState();
  const [view, setView] = useState(false);
  const [flag, setFlag] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  // const { setAlert } = useContext(AlertNotificationContext);
  const [academicYear, setAcademicYear] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [boardId, setBoardId] = useState();
  const { Option } = Select;
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState("");
  const [gradeData, setGradeData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const selectedBranchGlobal = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [subjectId, setSubjectId] = useState(null);
  const [subjectName, setSubjectName] = useState([]);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/MM/DD';

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item.child_name === 'Blog Activity' &&
              window.location.pathname === '/principal-dashboard-activity'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
          });
        }
      });
    }
  }, []);


  useEffect(() => {
    if (moduleId && selectedBranchGlobal) {
      fetchGradeData();
    }
  }, [selectedBranchGlobal, moduleId]);

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranchGlobal?.branch?.id,
      module_id: moduleId,
    };
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeData(res?.data?.data);
          setGradeName(res?.data?.data[0]?.grade__grade_name);
          // }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (gradeId !== '') {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranchGlobal?.branch?.id,
        module_id: moduleId,
        grade_id: gradeId,
      });
    }
  }, [gradeId]);

  const fetchSubjectData = (params = {}) => {
    if (gradeId) {
      axios
        .get(`${endpoints.academics.sections}`, {
          params: { ...params },
        })
        .then((res) => {
          if (res.data.status_code === 200) {
            setSubjectData(res?.data?.data);
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
  };

  const handleGrade = (item) => {
    setSubjectData([]);
    setSubjectId(null);
    setSubjectName([])
    setGradeName("")
    formRef.current.setFieldsValue({
      section: [],
      // board: null,
    });
    setFlag(false);
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
    }
  };

  const handleSubject = (value, event) => {
    setFlag(false);
    setSubjectId([]);
    setSubjectName([]);
    if (value) {
      const all = subjectData.slice();
      const reqAllSectionIds = all.map((item) => parseInt(item.section_id));
      const allSectionIds = all.map((item) => parseInt(item.id));
      const reqAllSectionIds2 = subjectData
        .filter((item) => value.includes(item.id))
        .map((item) => parseInt(item?.section_id));
      const allSectionName = all.map((item) => item);
      if (value.includes('All')) {
        setSubjectId(reqAllSectionIds);
        setSubjectName(allSectionName);
        formRef.current.setFieldsValue({
          section: allSectionIds,
          date: null,
        });
      } else {
        setSubjectId(reqAllSectionIds2);
        setSubjectName(event);
      }
    }
  };

  const handleClearGrade = () => {
    setGradeId('');
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = () => {
    setSelectedBranch([]);
    setSelectedGrade([]);
    if (value?.length) {
      const branchIds = value.map((obj) => obj?.id);
      setSelectedBranch(value);

      if (branchIds) {
        setLoading(true);
        axios
          .get(
            `${endpoints.newBlog.activityGrade}?branch_ids=${selectedBranchGlobal?.branch?.id}`,
            {
              headers: {
                'X-DTS-HOST': X_DTS_HOST,
              },
            }
          )
          .then((response) => {
            setGradeList(response?.data?.result);
            setLoading(false);
          });
      }
    }
  };

  const handleClearSubject = () => {};

  const goSearch = () => {
    setLoading(true);
    if (gradeId == undefined) {
      message.error('Please Select Grade ');
      setLoading(false);
      return;
    } else if (subjectId == undefined) {
      message.error('Please Select Section');
      setLoading(false);
      return;
    } else {
      setFlag(true);
      setLoading(false);
    }
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each?.id}
        id={each?.id}
        section__section_name={each?.section__section_name}
      >
        {each?.section__section_name}
      </Option>
    );
  });

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  return (
    <div>
      <Layout>
        <div className='px-2'>
          <div className='row'>
            <div className='col-8'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  href='/blog/wall/central/redirect'
                  className='th-grey-1 th-16'
                >
                  Activity Management
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1 th-16'>
                  Public Speaking Report
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='py-3 th-bg-white mx-3 mt-3 th-br-5'>
            <div className='row mt-2'>
              <div className='col-md-9' style={{ zIndex: 5 }}>
                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                  <div className='row align-items-center'>
                    <div className='col-md-3 col-6 px-0'>
                      <div className='mb-2 text-left'>Grade</div>
                      <Form.Item name='grade'>
                        <Select
                          allowClear
                          placeholder='Select Grade'
                          showSearch
                          // disabled={user_level == 13}
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleGrade(value);
                          }}
                          onClear={handleClearGrade}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {gradeOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-6 pr-0 px-0 pl-md-3'>
                      <div className='mb-2 text-left'>Section</div>
                      <Form.Item name='section'>
                        <Select
                          placeholder='Select Section'
                          allowClear
                          mode='multiple'
                          suffixIcon={<DownOutlined className='th-grey' />}
                          maxTagCount={1}
                          showArrow={1}
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(value, e) => {
                            handleSubject(value, e);
                          }}
                          onClear={handleClearSubject}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {subjectData.length > 0 && (
                            <Option key='0' value='All'>
                              All
                            </Option>
                          )}

                          {subjectOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-6 pt-3'>
                      <RangePicker
                        className='th-width-100 th-br-4'
                        onChange={(value) => handleDateChange(value)}
                        defaultValue={[moment(), moment()]}
                        format={dateFormat}
                        separator={'to'}
                        allowClear={false}
                      />
                    </div>
                    <div className='col-md-3 col-6 pt-3'>
                      <ButtonAnt
                        className='th-button-active th-br-6 text-truncate th-pointer'
                        icon={<SearchOutlined />}
                        onClick={goSearch}
                      >
                        Search
                      </ButtonAnt>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div className='row'>
              <div className='col-12 px-0'>
                <PublicSpeakingPrincipalTable
                  style={{ border: '1px solid red' }}
                  selectedBranch={selectedBranchGlobal?.branch?.id}
                  selectedBoardName={selectedBranchGlobal?.branch?.branch_name}
                  setValue={setValue}
                  value={value}
                  handleChange={handleChange}
                  selectedGrade={gradeId}
                  selectedGradeName={gradeName}
                  selectedSubject={subjectId}
                  setSubjectName={subjectName}
                  flag={flag}
                  setFlag={setFlag}
                  loading={loading}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default PrincipalDashboardTableActivity;
