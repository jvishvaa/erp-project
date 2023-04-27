import React, { useState, useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axiosInstance from 'v2/config/axios';
import endpoints from '../../config/endpoints';
import {
  Breadcrumb,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  message,
  Modal,
} from 'antd';

import axios from 'axios';
import {
  fetchBranches as fetchBranchRedux,
  fetchGrades,
} from '../lesson-plan/create-lesson-plan/apis';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const VisualActivityCreate = () => {
  const formRef = createRef();
  const { Option } = Select;
  const { TextArea } = Input;
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const localActivityData = localStorage?.getItem('ActivityData')
    ? JSON.parse(localStorage?.getItem('ActivityData'))
    : '';
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const history = useHistory();
  const [branchList, setBranchList] = useState([]);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState('');
  const [assigned, setAssigned] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [description, setDescription] = useState('');
  const [moduleId, setModuleId] = React.useState();
  const [activityCategory, setActivityCategory] = useState([]);
  const [title, setTitle] = useState('');
  const [grades, setGrades] = useState([]);
  const [subActivityListData, setSubActivityListData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeName, setSelectedGradeName] = useState([]);
  const [selectedRound, setSelectedRound] = useState([]);
  const [selectedRoundID, setSelectedRoundID] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionName, setSelectedSectionName] = useState([]);
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [activityName, setActivityName] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [subActivityName, setSubActivityName] = useState([]);
  const [isVisualActivity, setIsVisualActivity] = useState(false);
  const [isSubmissionHide, setIsSubmissionHide] = useState(false);
  const [criteriaTitle, setCriteriaTitle] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState('');
  const [selectedCriteriaTitleId, setSelectedCriteriaTitleId] = useState(null);
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
  });
  const [sudActId, setSubActId] = useState(localActivityData);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [academicYear, setAcademicYear] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [requestOngoing, setRequestOngoing] = useState(false);
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

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      getAcademic();
    }
  }, [moduleId, selectedAcademicYear]);
  const getAcademic = async () => {
    handleAcademicYear({}, selectedAcademicYear);
  };

  const handleAcademicYear = (event = {}, value = '') => {
    setAcademicYear('');
    if (value) {
      fetchBranches(value?.id);
      setAcademicYear(value);
    }
  };
  const fetchBranches = async (acadId) => {
    setLoading(true);
    try {
      setBranchDropdown([]);
      setGrades([]);
      if (moduleId) {
        const data = await fetchBranchRedux(acadId, moduleId);
        const transformedData = data?.map((obj) => ({
          id: obj?.branch?.id,
          branch_name: obj?.branch?.branch_name,
        }));
        setBranchDropdown(transformedData);
        setBranchList(transformedData);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      message.error('Failed To Fetch Branch');
    }
  };

  let allGradeIds = [];

  const fetchGradesFun = async (acadId, branchId) => {
    setLoading(true);
    try {
      setGrades([]);
      setGradeList([]);
      if (branchId.length !== 0) {
        const data = await fetchGrades(acadId, branchId, moduleId);
        const transformedData = data?.map((obj) => ({
          id: obj?.grade_id,
          name: obj?.grade__grade_name,
          mapping_id:obj?.id
        }));
        setGradeList(transformedData);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      message.error('Failed To Fetch Grade');
    }
  };

  useEffect(() => {
    fetchSubActivityListData();
    fetchCriteria();
  }, []);

  const fetchSubActivityListData = () => {
    axiosInstance
      .get(`${endpoints.newBlog.subActivityListApi}?type_id=${sudActId?.id}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        setLoading(false);
        setSubActivityListData(result?.data?.result);
      });
  };

  const fetchCriteria = () => {
    axiosInstance
      .get(`${endpoints.newBlog.criteriaTitleList}?type_id=${sudActId?.id}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        setLoading(false);
        setCriteriaTitle(result?.data?.result);
      });
  };

  const fetchSectionsFun = (sessionId, branchIds, gradeIds, moduleId) => {
    setSectionDropdown([]);
    if (gradeIds.length !== 0) {
      setLoading(true);
      setSectionList([]);
      axiosInstance
        .get(
          `${endpoints.newBlog.erpSectionmappping}?session_year=${sessionId}&branch_id=${branchIds}&module_id=${moduleId}&grade_id=${gradeIds}`
        )
        .then((result) => {
          setLoading(false);
          if (result.data) {
            setSectionList(result.data?.data);
            const transformedData = result.data?.data.map((obj) => ({
              id: obj?.section_id,
              name: obj?.section__section_name,
              mapping_id: obj?.id,
            }));
            setSectionDropdown(transformedData);
          }
        })
        .catch((err) => {
          message.error('Failed To Fetch Section');
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);
  const handleBranch = (value, event) => {
    if (value) {
      setSelectedBranch([]);
      setSelectedGrade([]);
      setSelectedSection([]);
      const all = branchList.slice();
      const allBranchIds = all.map((item) => item.id);
      const allBranchName = all.map((item) => item);
      if (value.includes('All')) {
        setSelectedBranch(allBranchIds);
        setSelectedBranchName(allBranchName);
        formRef.current.setFieldsValue({
          branch: allBranchIds,
          grade: [],
          section: [],
          date: null,
        });
        fetchGradesFun(selectedAcademicYear?.id, allBranchIds);
      } else {
        setSelectedBranch(value);
        setSelectedBranchName(event);
        formRef.current.setFieldsValue({
          branch: value,
          grade: [],
          section: [],
          date: null,
        });
        fetchGradesFun(selectedAcademicYear?.id, value);
      }
    }
    getTemplate(activityName.id);
  };

  const handleGrade = (value, event) => {
    setSelectedGrade([]);
    setSelectedSection([]);
    if (value) {
      setSelectedGrade([]);
      setSelectedSection([]);
      const all = gradeList.slice();
      const allGradeId = all.map((item) => item.id);
      const reqAllGradeIds = all.map((item)=> parseInt(item?.mapping_id))
      const reqAllGradeIds2 = gradeList.filter((item)=> value.includes(item.mapping_id)).map((item) => item.id)
      const allGradeName = all.map((item) => item);
      if (value.includes('All')) {
        setSelectedGrade(allGradeId);
        setSelectedGradeName(allGradeName);
        formRef.current.setFieldsValue({
          grade: reqAllGradeIds,
          section: [],
          date: null,
        });
        fetchSectionsFun(selectedAcademicYear?.id, selectedBranch, allGradeId, moduleId);
      } else {
        // const gradeName = value.map((item) => item?.name)
        setSelectedGrade(reqAllGradeIds2);
        setSelectedGradeName(event);
        fetchSectionsFun(selectedAcademicYear?.id, selectedBranch, reqAllGradeIds2, moduleId);
        // formRef.current.setFieldsValue({
        //   grade: value,
        //   section: [],
        //   date: null,
        // });
      }
    }
  };
  const handleSection = (value, event) => {
    setSelectedSection([]);
    if (value) {
      setSelectedSection([]);
      const all = sectionDropdown.slice();
      const allSectionId = all.map((item) => item?.mapping_id);
      const reqAllSectionIds = all.map((item) => parseInt(item?.section_id));
      const allSectionName = all.map((item) => item);
      const reqAllSectionIds2 = sectionList.filter((item)=>value.includes(item.id)).map((item) => item?.section_id)
      if (value.includes('All')) {
        setSelectedSection(reqAllSectionIds);
        setSelectedSectionName(allSectionName);
        formRef.current.setFieldsValue({
          section: allSectionId,
        });
      } else {
        setSelectedSection(reqAllSectionIds2);
        setSelectedSectionName(event);
        // formRef.current.setFieldsValue({
        //   section: value,
        // });
      }
    }
  };

  const handleStartDateChange = (val) => {
    setStartDate(moment(val).format('YYYY-MM-DD'));
    formRef.current.setFieldsValue({
      date: val,
    });
  };
  let branchIdss = selectedBranchName.map((obj) => obj?.branch_name).join(', ');
  let branchname = [...branchIdss];
  let gradeIdss = selectedGradeName.map((obj) => obj?.name).join(', ');
  let gradename = [...gradeIdss];
  let sectionIdss = selectedSectionName.map((obj) => obj?.name).join(', ');
  let sectionname = [...sectionIdss];

  const PreviewBlog = () => {
    setAssigned(true);
  };

  const handleClear = () => {
    setSelectedGrade([]);
    setSelectedBranch([]);
    setSelectedSection([]);
    setActivityName([]);
    setDescription('');
    setTitle('');
    setSelectedRound([]);
    setStartDate(null);
    formRef.current.setFieldsValue({
      branch: [],
      grade: [],
      section: [],
      date: null,
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
    if (selectedBranch?.length === 0) {
      setLoading(false);
      message.error('Please Select Branch');
      return;
    }
    if (selectedGrade?.length === 0) {
      setLoading(false);
      message.error('Please Select Grade');
      return;
    }
    if (selectedSection?.length === 0) {
      setLoading(false);
      message.error('Please Select Section');
      return;
    }
    if (selectedCriteria?.length === 0) {
      setLoading(false);
      message.error('Please Select Criteria Title');
      return;
    }
    if (!startDate) {
      setLoading(false);
      message.error('Please Select the Date');
      return;
    }
    if (title.length === 0) {
      setLoading(false);
      message.error('Please Add Title');
      return;
    }
    if (!description) {
      setLoading(false);
      message.error('Please Add Description ');
      return;
    } else {
      setRequestOngoing(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('issue_date', null);
      formData.append('submission_date', startDate + hoursAndMinutes);
      formData.append('image', selectedFile);
      formData.append('activity_type_id', selectedCriteriaTitleId);
      formData.append('session_year', selectedAcademicYear.session_year);
      formData.append('created_at', startDate + hoursAndMinutes);
      formData.append('created_by', user_id.id);
      formData.append('branch_ids', selectedBranch);
      formData.append('grade_ids', selectedGrade);
      formData.append('section_ids', selectedSection);
      formData.append('is_draft', false);
      formData.append('template_type', 'template');
      formData.append('template_id', checked);
      formData.append('round_count', selectedRoundID);
      axios
        .post(`${endpoints.newBlog.activityCreate}`, formData, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then(() => {
          setLoading(false);
          setRequestOngoing(false);
          message.success('Activity Successfully Created');
          setLoading(false);
          setSelectedGrade([]);
          setSelectedBranch([]);
          setSelectedSection([]);
          setActivityName([]);
          setDescription('');
          setTitle('');
          setStartDate('');
          history.push('/visual/activity');
          return;
        })
        .catch((error) => {
          message.error(error);
          setLoading(false);
          setRequestOngoing(false);
        });
    }
  };

  const getActivityCategory = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setLoading(false);
        setActivityCategory(response.data.result);
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
  const goBack = () => {
    history.goBack();
  };

  const closePreview = () => {
    setAssigned(false);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

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
    getTemplate();
  }, [selectedBranch, activityName]);

  const branchOption = branchList.map((each) => {
    return (
      <Option key={each?.id} value={each?.id} id={each?.id} branch_name={each?.branch_name}>
        {each?.branch_name}
      </Option>
    );
  });

  const gradeOption = gradeList.map((each) => {
    return (
      <Option key={each?.mapping_id} value={each?.mapping_id} id={each?.id} name={each?.name}>
        {each?.name}
      </Option>
    );
  });

  const sectionOption = sectionDropdown.map((each) => {
    return (
      <Option
        id={each?.mapping_id}
        value={each?.mapping_id}
        key={each?.mapping_id}
        children={each?.id}
        name={each?.name}
      >
        {each?.name}
      </Option>
    );
  });

  const criteriaOption = criteriaTitle?.map((each) => {
    return (
      <Option id={each?.id} value={each?.criteria_title}>
        {each?.criteria_title}
      </Option>
    );
  });

  const handleClearBranch = () => {
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
  };

  const handleClearGrade = () => {
    setSelectedGrade([]);
  };

  const handleClearSection = () => {
    setSelectedSection([])
  };

  const handleCriteriaTitle = (e, value) => {
    if (value) {
      setSelectedCriteriaTitleId(value?.id);
      setSelectedCriteria(value?.value);
      formRef.current.setFieldsValue({
        criteria: value,
      });
    }
  };

  return (
    <div>
      <Layout>
        <div className='row py-3 px-2 th-bg-grey'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-bg-grey th-pointer th-18'
                href='/blog/wall/central/redirect'
              >
                Activity Management
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className='th-bg-grey th-18 th-pointer'
                href='/visual/activity'
              >
                {localActivityData?.name}
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-bg-black th-18'>
                Create {localActivityData?.name}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='th-bg-white py-0 mx-3'>
          <div className='row'>
            <div className='col-12 py-3'>
              <Form id='filterForm' layout={'horizontal'} ref={formRef}>
                <div className='row align-items-center'>
                  <div className='col-md-3 col-6 pl-0'>
                    <div className='col-mb-3 text-left'> Branch</div>
                    <Form.Item name='branch'>
                      <Select
                        allowClear
                        placeholder={'Select Branch'}
                        placement='bottomRight'
                        showSearch
                        mode='multiple'
                        maxTagCount={2}
                        showArrow={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        optionFilterProp='children'
                        // value={selectedBranch}
                        dropdownMatchSelectWidth={false}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(value, e) => {
                          handleBranch(value, e);
                        }}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={true}
                        onClear={handleClearBranch}
                      >
                        {branchList?.length > 0 && (
                          <Option key='0' value='All'>
                            All
                          </Option>
                        )}
                        {branchOption}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-3 col-6 pl-0'>
                    <div className='col-mb-3 text-left'>Grade</div>
                    <Form.Item name='grade'>
                      <Select
                        allowClear
                        placeholder={'Select Grade'}
                        placement='bottomRight'
                        showSearch
                        mode='multiple'
                        maxTagCount={2}
                        showArrow={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        optionFilterProp='children'
                        // value={selectedGrade}
                        dropdownMatchSelectWidth={false}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(value, e) => {
                          handleGrade(value, e);
                        }}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={true}
                        onClear={handleClearGrade}
                      >
                        {gradeList.length > 0 && (
                          <Option key='0' value='All'>
                            All
                          </Option>
                        )}
                        {gradeOption}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-3 col-6 pl-0'>
                    <div className='col-mb-3 text-left'>Section</div>
                    <Form.Item name='section'>
                      <Select
                        allowClear
                        placeholder={'Select Section'}
                        placement='bottomRight'
                        showSearch
                        mode='multiple'
                        maxTagCount={2}
                        showArrow={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        optionFilterProp='children'
                        // value={selectedSection}
                        dropdownMatchSelectWidth={false}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(value, e) => {
                          handleSection(value, e);
                        }}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={true}
                        onClear={handleClearSection}
                      >
                        {sectionDropdown.length > 0 && (
                          <Option key='0' value='All'>
                            All
                          </Option>
                        )}
                        {sectionOption}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-3 col-6 pl-0'>
                    <div className='col-mb-3 text-left'>Criteria Title</div>
                    <Form.Item name='criteria'>
                      <Select
                        // allowClear
                        placeholder={'Select Criteria Title'}
                        placement='bottomRight'
                        showSearch
                        // mode='single'
                        // maxTagCount={2}
                        showArrow={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        optionFilterProp='children'
                        value={selectedCriteria || []}
                        dropdownMatchSelectWidth={false}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(event, value) => {
                          handleCriteriaTitle(event, value);
                        }}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={true}
                      >
                        {criteriaOption}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='col-md-3 col-6 pl-0'>
                    <div className='col-mb-3 text-left'>Submission Date</div>
                    <Form.Item name='date'>
                      <DatePicker
                        className='w-100 th-black-1 th-bg-grey th-br-4 p-1 mb-2 th-date-picker'
                        onChange={(value) => handleStartDateChange(value)}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>

          <div className='col-12 py-3 px-0'>
            <div className='col-md-6 py-3 py-md-0'>
              <span className='th-grey th-14'>Title</span>
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
              <Button type='primary' className='w-100 th-14' onClick={PreviewBlog}>
                Preview
              </Button>
            </div>
            <div className='col-md-2'>
              <Button
                type='primary'
                className='w-100 th-14'
                disabled={user_level == 11 || requestOngoing}
                onClick={dataPost}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
        <Modal
          centered
          visible={assigned}
          onCancel={closePreview}
          footer={false}
          width={500}
          className='th-upload-modal'
          title={`Preview - ${localActivityData?.name}`}
        >
          <div>
            <div style={{ marginLeft: '23px', marginTop: '28px' }}>
              <div style={{ fontSize: '15px', color: '#7F92A3' }}>
                Title -{activityName.name}
              </div>
              <div style={{ fontSize: '21px' }}>{title}</div>
              <div style={{ fontSize: '10px', color: '#7F92A3' }}>
                Submission on -{startDate}
              </div>
              <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
                Branch -&nbsp;<span style={{ color: 'black' }}>{branchname}</span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Grade -&nbsp;<span style={{ color: 'black' }}>{gradename}</span>
              </div>
              <div style={{ fontSize: '10px', color: 'gray' }}>
                Section -&nbsp;<span style={{ color: 'black' }}>{sectionname}</span>
              </div>

              <div
                style={{ paddingTop: '16px', fontSize: '12px', color: '#536476' }}
              ></div>
              <div style={{ paddingTop: '19px', fontSize: '16px', color: '#7F92A3' }}>
                Instructions
              </div>
              <div style={{ paddingTop: '8px', fontSize: '16px' }}>{description}</div>
              <div style={{ paddingTop: '28px', fontSize: '14px' }}>
                <img src={fileUrl} width='50%' />
              </div>
            </div>
          </div>
        </Modal>
      </Layout>
    </div>
  );
};
export default VisualActivityCreate;
