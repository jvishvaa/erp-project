import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Carousel from 'react-elastic-carousel';
import Loader from '../../components/loader/loader';
import axios from 'axios';
import {
  fetchBranches as fetchBranchRedux,
  fetchGrades,
} from '../lesson-plan/create-lesson-plan/apis';
import {
  Breadcrumb,
  Button,
  Form,
  Select,
  Space,
  Typography,
  DatePicker,
  Input,
  message,
  Checkbox,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const AdminEditCreateBlogs = () => {
  const { Option } = Select;
  const formRef = useRef();
  const { TextArea } = Input;
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const history = useHistory();
  const [branchList, setBranchList] = useState([]);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [assigned, setAssigned] = useState(false);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [gradeIds, setGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [checked, setChecked] = React.useState('');
  const [activityName, setActivityName] = useState([]);
  const [templateId, setTemplatesId] = useState(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [flag, setFlag] = useState(false);
  const [requestOngoing, setRequestOngoing] = useState(false);
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
  });

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const handleEditorChange = (content, editor) => {
    setDesc(content);
  };
  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'Febraury',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];
  const [changeText, setChangeText] = useState('');
  const handleChangeActivity = (e, value) => {
    setActivityName(value);
  };
  const handleChangeText = (e, value) => {
    setChangeText(value);
  };

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Activity Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Blog Activity') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const getBranch = async (acadId) => {
    setLoading(true);

    try {
      setBranchList([]);
      setGrades([]);
      // setSubjects([]);
      if (moduleId) {
        const data = await fetchBranchRedux(acadId, moduleId);
        setBranchList(data);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      message.error('Failed To Fetch Branch');
    }
  };

  let allGradeIds = [];

  const getGrades = async (acadId, branchId) => {
    setLoading(true);
    try {
      setGrades([]);
      const data = await fetchGrades(acadId, branchId, moduleId);
      setGrades(data);
      setGradeList(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      message.error('Failed to Fetch Grade');
    }
  };

  const handleChange = (event, value) => {
    setChecked(value);
    setTemplatesId(value);
  };

  const fetchSections = (sessionId, branchIds, gradeIds, moduleId) => {
    if (gradeIds) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.newBlog.erpSectionmappping}?session_year=${sessionId}&branch_id=${branchIds}&module_id=${moduleId}&grade_id=${gradeIds}`
        )
        .then((result) => {
          setLoading(false);
          if (result.data) {
            setSectionList(result.data?.data);
            const gradeData = result?.data?.result || [];
            setSectionDropdown(gradeData);
          }
        });
    }
  };

  useEffect(() => {
    getBranch(academicYear?.id);
  }, [editFlag]);

  const handleBranch = (value) => {
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setGrades([]);
    formRef.current.setFieldsValue({
      branch: [],
      grade: [],
      section: [],
    });
    if (value?.length > 0) {
      setSelectedGrade([]);
      setSelectedSection([]);
      const all = branchList.slice();
      const allBranchIds = all.map((item) => parseInt(item?.branch?.id));
      if (value.includes('All')) {
        setSelectedBranch(allBranchIds);
        formRef.current.setFieldsValue({
          branch: allBranchIds,
          grade: [],
          section: [],
          // data: null,
        });
        getGrades(selectedAcademicYear?.id, allBranchIds);
      } else {
        setSelectedBranch(value);
        formRef.current.setFieldsValue({
          branch: value,
          grade: [],
          section: [],
          // data: null,
        });
        getGrades(selectedAcademicYear?.id, value);
      }
    }
  };

  const handleGrade = (value) => {
    setSelectedSection([]);
    setSectionList([]);
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
    });
    if (value) {
      const all = grades.slice();
      const allGradeIds = all.map((item) => item?.grade_id);
      if (value.includes('All')) {
        setSelectedGrade(allGradeIds);
        formRef.current.setFieldsValue({
          grade: allGradeIds,
          section: [],
        });
        fetchSections(selectedAcademicYear?.id, selectedBranch, allGradeIds, moduleId);
      } else {
        setSelectedGrade(value);
        formRef.current.setFieldsValue({
          grade: value,
          section: [],
        });
        fetchSections(selectedAcademicYear?.id, selectedBranch, value, moduleId);
      }
    }
  };
  const handleSection = (value) => {
    formRef.current.setFieldsValue({
      section: [],
    });
    if (value) {
      const all = sectionList.slice();
      const allSectionIds = all.map((item) => parseInt(item?.section_id));
      if (value.includes('All')) {
        setSelectedSection(allSectionIds);
        formRef.current.setFieldsValue({
          section: allSectionIds,
        });
      } else {
        setSelectedSection(value);
        formRef.current.setFieldsValue({
          section: value,
        });
      }
    }
  };
  const handleStartDateChange = (val) => {
    setStartDate(moment(val).format('YYYY-MM-DD'));
    setFlag(true);
  };

  const handleClear = () => {
    setSelectedGrade([]);
    setSelectedBranch([]);
    setSelectedSection([]);
    setActivityName([]);
    setDescription('');
    setTitle('');
    setStartDate('');
    formRef.current.setFieldsValue({
      activity_categories: [],
      branch: [],
      grade: [],
      section: [],
    });
  };
  const formatdate = new Date();
  const hoursAndMinutes =
    'T' +
    formatdate.getHours() +
    ':' +
    formatdate.getMinutes() +
    ':' +
    formatdate.getSeconds();
  const dataPost = () => {
    setLoading(true);
    if (activityName.length === 0) {
      message.error('Please Add Activity Name');
      setLoading(false);
      return;
    }
    if (selectedBranch?.length === 0) {
      message.error('Please Select Branch');
      setLoading(false);
      return;
    }
    if (selectedGrade?.length === 0) {
      message.error('Please Select Grade');
      setLoading(false);
      return;
    }
    if (selectedSection?.length === 0) {
      message.error('Please Select Section');
      setLoading(false);
      return;
    }
    if (!startDate) {
      message.error('Please Select Date');
      setLoading(false);
      return;
    }
    if (title.length === 0) {
      message.error('Please Add Title');
      setLoading(false);
      return;
    }
    if (!description) {
      message.error('Please Add Description');
      setLoading(false);
      return;
    } else {
      setRequestOngoing(true);
      let body = {
        title: title,
        description: description,
        issue_date: null,
        submission_date: flag ? startDate + hoursAndMinutes : startDate,
        activity_type_id: activityName.id,
        session_year: selectedAcademicYear.session_year,
        created_at: flag ? startDate + hoursAndMinutes : startDate,
        created_by: user_id.id,
        branch_ids: selectedBranch,
        grade_ids: selectedGrade,
        section_ids: selectedSection,
        is_draft: true,
        template_type: changeText.name,
        template_id: templateId,
      };
      // setLoading(true);
      axios
        .put(`${endpoints.newBlog.confirmAssign}${id}/`, body, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          message.success('Activity Updated Successfully');
          setSelectedGrade([]);
          setSelectedBranch([]);
          setSelectedSection([]);
          setActivityName([]);
          setDescription('');
          setTitle('');
          setStartDate('');
          setEditFlag(false);
          setRequestOngoing(false);
          history.push('/blog/blogview');
          setLoading(false);
        })
        .catch((error) => {
          setRequestOngoing(false);
          setLoading(false);
          message.error(error);
        });
    }
  };
  const [id, setId] = useState('');
  const [previewData, setPreviewData] = useState();

  useEffect(() => {
    if (history?.location?.pathname === '/blog/admineditcreateblogs' && moduleId) {
      handlePreview(history?.location?.state?.data?.id);

      setDescription(history?.location?.state?.data?.description);
      setTitle(history?.location?.state?.data?.title);
      setId(history?.location?.state?.data?.id);
    }
  }, [history, moduleId]);

  const handlePreview = (data) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.previewDetails}${data}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.status === 200) {
          setTemplatesId(response?.data?.result?.template?.id);
          setPreviewData(response?.data?.result);
          setActivityName(response?.data?.result?.activity_type);
          formRef.current.setFieldsValue({
            branch: response?.data?.result.branches.map((obj) => obj?.branch_id),
            grade: response?.data?.result?.grades?.map((obj) => obj?.grade_id),
            section: response?.data?.result?.sections.map((obj) => obj?.section_id),
          });
          setSelectedBranch(
            response?.data?.result?.branches.map((obj) => obj?.branch_id)
          );
          setSelectedGrade(response?.data?.result?.grades?.map((obj) => obj?.grade_id));
          setSelectedSection(
            response?.data?.result?.sections?.map((obj) => obj?.section_id)
          );
          setFileUrl(response?.data?.result?.template_path);
          setStartDate(response?.data?.result?.submission_date);
          setEditFlag(true);
          if (history.location.state.data) {
            const branchIds =
              response?.data?.result?.branches.map((obj) => obj?.branch_id) || [];
            const gradeId =
              response?.data?.result?.grades?.map((obj) => obj?.grade_id) || [];

            getGrades(selectedAcademicYear?.id, branchIds);
            fetchSections(selectedAcademicYear?.id, branchIds, gradeId, moduleId);

            formRef.current.setFieldsValue({
              activity_categories: response?.data?.result?.activity_type?.name,
              branch: response?.data?.result?.branches.map((obj) => obj?.branch_id),
              grade: response?.data?.result?.grades?.map((obj) => obj?.grade_id),
              section: response?.data?.result?.sections?.map((obj) => obj?.section_id),
              date: moment(response?.data?.result?.submission_date).format('YYYY-MM-DD'),
            });
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  };

  const [typeText, setTypeText] = useState([{ name: 'text' }, { name: 'template' }]);

  const [activityCategory, setActivityCategory] = useState([]);
  const getActivityCategory = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response.data.result);
        setLoading(false);
      });
  };
  useEffect(() => {
    getActivityCategory();
  }, []);

  const [activityStorage, setActivityStorage] = useState([]);
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
        setActivityStorage(response.data.result);

        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      });
  };

  const closePreview = () => {
    setAssigned(false);
  };
  const [title, setTitle] = useState('');
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const [description, setDescription] = useState('');
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];

  const getTemplate = (data) => {
    if (data) {
      setLoading(true);
      axios
        .get(`${endpoints.newBlog.getTemplates}${data}/`, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          setTemplates(response?.data?.result);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (activityName) {
      getTemplate(activityName.id);
    }
  }, [selectedBranch, selectedGrade, activityName]);

  const isSelected = (id) => {
    if (templateId === id) {
      return true;
    } else {
      return false;
    }
  };

  const actionTypeOption = activityCategory.map((each) => {
    return (
      <Option key={each?.id} value={each?.name} id={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const branchOptions = branchList?.map((each) => {
    return (
      <Option
        key={each?.branch?.id}
        value={each?.branch?.id}
        id={each?.branch?.id}
        branch_id={each?.branch?.id}
      >
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = grades?.map((each) => {
    return (
      <Option
        key={each?.grade_id}
        value={each?.grade_id}
        id={each?.grade_id}
        grade_id={each?.grade_id}
      >
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option
        key={each?.section_id}
        value={each?.section_id}
        id={each?.section_id}
        section_id={each?.section_id}
      >
        {each?.section__section_name}
      </Option>
    );
  });

  const handleAcademicYear = (event = {}, value = '') => {
    setAcademicYear('');
    if (value) {
      getBranch(value?.id);
      setAcademicYear(value);
    }
  };
  const getAcademic = async () => {
    handleAcademicYear({}, selectedAcademicYear);
  };

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      getAcademic();
    }
  }, [moduleId, selectedAcademicYear]);

  const handleClearGrade = () => {
    setSelectedGrade([]);
  };

  const goBack = () => {
    history.push('/blog/blogview');
  };

  return (
    <div>
      {loading && <Loader />}
      <Layout>
        <div className='row py-3 px-2 th-bg-grey'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey-1 th-18 th-pointer'
                href='/blog/wall/central/redirect'
              >
                Activity Management
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className='th-grey-1 th-18 th-pointer'
                href='/blog/blogview'
              >
                Blog Activity
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18 th-pointer'>
                Edit Activity
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='th-bg-white py-0 mx-3'>
            <div className='row'>
              <div className='col-12 py-3'>
                <Form id='filterForm' layout={'horizontal'} ref={formRef}>
                  <div className='row align-items-center'>
                    <div className='col-md-2 col-6 pl-0'>
                      <div className='mb-2 text-left'>Activity Categories</div>
                      <Form.Item name='activity_categories'>
                        <Select
                          allowClear
                          placeholder={'Select Activity'}
                          showSearch
                          optionFilterProp='children'
                          value={activityName || []}
                          defaultValue={activityName}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={handleChangeActivity}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {actionTypeOption}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2 col-6'>
                      <div className='mb-2 text-left'>Branch</div>
                      <Form.Item name='branch'>
                        <Select
                          allowClear
                          placeholder='Select Branch'
                          mode='multiple'
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          optionFilterProp='children'
                          maxTagCount={2}
                          showArrow={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          value={selectedBranch || []}
                          onChange={(value) => {
                            handleBranch(value);
                          }}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {branchList?.length > 1 && (
                            <>
                              <Option key={0} value={'All'}>
                                All
                              </Option>
                            </>
                          )}
                          {branchOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2 col-6'>
                      <div className='mb-2 text-left'>Grade</div>
                      <Form.Item name='grade'>
                        <Select
                          allowClear
                          placeholder={'Select Grade'}
                          mode='multiple'
                          maxTagCount={2}
                          showArrow={2}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          showSearch
                          optionFilterProp='children'
                          value={selectedGrade || []}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(value) => {
                            handleGrade(value);
                          }}
                          onClear={handleClearGrade}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {grades.length > 1 && (
                            <Option key='0' value='All'>
                              All
                            </Option>
                          )}
                          {gradeOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                      <div className='mb-2 text-left'>Section</div>
                      <Form.Item name='section'>
                        <Select
                          allowClear
                          mode='multiple'
                          suffixIcon={<DownOutlined className='th-grey' />}
                          maxTagCount={2}
                          showArrow={2}
                          placeholder={'Select Section'}
                          value={selectedSection || []}
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(value) => {
                            handleSection(value);
                          }}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {sectionList.length > 1 && (
                            <Option key='0' value='All'>
                              All
                            </Option>
                          )}
                          {sectionOptions}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className='col-md-2 col-6'>
                      <div className='mb-2 text-left'>Submission End Date</div>
                      <Form.Item name='date'>
                        <Space direction='vertical' className='w-100' size={12}>
                          <DatePicker
                            className='text-left th-date-picker th-br-4 th-bg-grey w-100 th-black-1'
                            bordered={true}
                            format={'YYYY/MM/DD'}
                            value={startDate && moment(startDate)}
                            allowClear={false}
                            onChange={(value) => handleStartDateChange(value)}
                          />
                        </Space>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
              <div className='col-12 py-3 px-0'>
                <div className='col-md-6 py-3 py-md-0'>
                  <span className='th-grey th-14'>Title*</span>
                  <Input
                    className='th-br-4 mt-1 th-16'
                    showCount
                    maxLength='30'
                    value={title}
                    onChange={handleTitle}
                  />
                  <div className='text-right'>
                    <span className='th-red th-12 text-right'>Max. 30 Characters</span>
                  </div>
                </div>
                <div className='col-md-6'>
                  <span className='th-grey th-14'>Description*</span>
                  <div className='th-editor py-2'>
                    <TextArea rows={5} value={description} onChange={handleDescription} />
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-1'>
              {selectedBranch?.length !== 0 && activityName?.length !== 0 ? (
                <Carousel
                  breakPoints={breakPoints}
                  showThumbs={false}
                  infiniteLoop={true}
                >
                  {templates?.map((obj, index) => {
                    const isItemSelected = isSelected(obj?.id);
                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <img
                          src={obj?.template_path}
                          alt='images'
                          style={{ maxWidth: '34%' }}
                        />
                        <Checkbox
                          onChange={() => handleChange(obj?.id, obj?.id)}
                          checked={isItemSelected}
                          color='primary'
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <div>{obj?.title}</div>
                      </div>
                    );
                  })}
                </Carousel>
              ) : (
                ''
              )}
            </div>
            <div className='row mt-2'>
              <div className='col-12 px-0 py-3 d-flex'>
                <div className='col-md-2'>
                  <Button type='primary' className='w-100 th-14' onClick={goBack}>
                    Back
                  </Button>
                </div>
                <div className='col-md-2'>
                  <Button type='primary' className='w-100 th-14' onClick={handleClear}>
                    Clear All
                  </Button>
                </div>
                <div className='col-md-2'>
                  <Button
                    type='primary'
                    className='w-100 th-14'
                    disabled={user_level == 11 || requestOngoing}
                    onClick={dataPost}
                  >
                    Update Activity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};
export default AdminEditCreateBlogs;
