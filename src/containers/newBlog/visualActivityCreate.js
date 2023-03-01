import React, { useState, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';

import {
  IconButton,
  Divider,
  TextField,
  // Button,
  makeStyles,
  Grid,
  Dialog,
  DialogTitle,
  // Input,
  // Select,
} from '@material-ui/core';
import Layout from 'containers/Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import { useHistory } from 'react-router-dom';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
import axiosInstance from 'v2/config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {
  Breadcrumb,
  Select,
  Form,
  DatePicker,
  Button,
  Input,
  message,
  Modal,
  Spin,
} from 'antd';

import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import {
  fetchAcademicYears,
  fetchBranches as fetchBranchRedux,
  fetchGrades,
  fetchSection,
} from '../lesson-plan/create-lesson-plan/apis';
import { getBranch } from 'containers/assessment-central/report-card/apis';
import { element } from 'prop-types';
import { each } from 'highcharts';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
  indeterminateColor: {
    color: '#f50057',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  customFileUpload: {
    border: '1px solid black',
    padding: '6px 12px',

    cursor: 'pointer',
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  buttonColor: {
    color: `${theme.palette.secondary.main} !important`,
    backgroundColor: 'white',
  },
  buttonColor1: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
  tickSize: {
    transform: 'scale(2.0)',
  },
}));

const dummyRound = [
  { id: 1, round: 1, name: '1' },
  { id: 2, round: 2, name: '2' },
  { id: 3, round: 3, name: '3' },
  { id: 4, round: 4, name: '4' },
  { id: 5, round: 5, name: '5' },
];

const VisualActivityCreate = () => {
  const formRef = createRef();
  const { Option } = Select;
  const { TextArea } = Input;
  const classes = useStyles();
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
  // const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);

  const [assigned, setAssigned] = useState(false);

  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [roundDropdown, setRoundDropdown] = useState(dummyRound);

  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const [subActivityListData, setSubActivityListData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedRound, setSelectedRound] = useState([]);
  const [selectedRoundID, setSelectedRoundID] = useState('');
  const [gradeIds, setGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [activityName, setActivityName] = useState([]);
  const [changeText, setChangeText] = useState('');
  const [visible, setVisible] = useState(false);
  const [isPhysicalActivity, setIsPhysicalActivity] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [subActivityName, setSubActivityName] = useState([]);
  const [isVisualActivity, setIsVisualActivity] = useState(false);
  const [isSubmissionHide, setIsSubmissionHide] = useState(false);
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
  });
  const [sudActId, setSubActId] = useState(localActivityData);
  const [selectedSubActivityId, setSelectedSubActivityId] = useState('');
  const [branchDropdown, setBranchDropdown] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [academicYear, setAcademicYear] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

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
        // transformedData.unshift({
        //   branch_name: 'Select All',
        //   id: 'all',
        // });
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
      if (branchId) {
        const data = await fetchGrades(acadId, branchId, moduleId);
        const transformedData = data?.map((obj) => ({
          id: obj?.grade_id,
          name: obj?.grade__grade_name,
        }));
        // transformedData.unshift({
        //   name: 'Select All',
        //   id: 'all',
        // });
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

  const fetchSectionsFun = (sessionId, branchIds, gradeIds, moduleId) => {
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
            const transformedData = result.data?.data.map((obj) => ({
              id: obj?.section_id,
              name: obj?.section__section_name,
            }));
            // transformedData.unshift({
            //   name: 'Select All',
            //   id: 'all',
            // });
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
  const handleBranch = (value) => {
    setSelectedGrade([]);
    setSelectedSection([]);
    if (value) {
      setSelectedGrade([]);
      setSelectedSection([]);
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
      let branchId = value?.map((item) => item?.id);
      formRef.current.setFieldsValue({
        branch: value,
        grade: [],
        section: [],
        date:null,
      });
      setSelectedBranch(value);
      fetchGradesFun(selectedAcademicYear?.id, branchId);
    }
    getTemplate(activityName.id);
  };

  const handleGrade = (e, value) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...gradeList].filter(({ id }) => id !== 'all')
          : value;
      let gradeId = value?.map((item) => item?.id);
      let branchIds = selectedBranch?.map((element) => parseInt(element?.id));
      formRef.current.setFieldsValue({
        grade: value,
        section: [],
        data: null
      });
      setSelectedGrade(value);
      fetchSectionsFun(selectedAcademicYear?.id, branchIds, gradeId, moduleId);
    }
  };
  const handleSection = (value) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionDropdown].filter(({ id }) => id !== 'all')
          : value;
      formRef.current.setFieldsValue({
        section: value,
      });
      setSelectedSection(value);
    }
  };

  const handleStartDateChange = (val) => {
    setStartDate(moment(val).format('YYYY-MM-DD'));
    formRef.current.setFieldsValue({
      date: val,
    });
  };
  let branchIdss = selectedBranch.map((obj) => obj?.name).join(', ');
  let branchname = [...branchIdss];
  let gradeIdss = selectedGrade.map((obj) => obj?.name).join(', ');
  let gradename = [...gradeIdss];
  let sectionIdss = selectedSection.map((obj) => obj?.name).join(', ');
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
    const branchIds = selectedBranch.map((obj) => obj?.id);
    const gradeIds = selectedGrade.map((obj) => obj?.id);
    const sectionIds = selectedSection.map((obj) => obj?.id);

    if (branchIds?.length === 0) {
      setLoading(false);
      message.error('Please Select Branch');
      return;
    }
    if (gradeIds?.length === 0) {
      setLoading(false);
      message.error('Please Select Grade');
      return;
    }
    if (sectionIds?.length === 0) {
      setLoading(false);
      message.error('Please Select Section');
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
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('issue_date', null);
      formData.append('submission_date', startDate + hoursAndMinutes);
      formData.append('image', selectedFile);
      formData.append('activity_type_id', localActivityData?.id);
      formData.append('session_year', selectedAcademicYear.session_year);
      formData.append('created_at', startDate + hoursAndMinutes);
      formData.append('created_by', user_id.id);
      formData.append('branch_ids', branchIds);
      formData.append('grade_ids', gradeIds);
      formData.append('section_ids', sectionIds);
      formData.append('is_draft', false);
      formData.append('template_type', 'template');
      formData.append('template_id', checked);
      formData.append('round_count', selectedRoundID);
      axios
        .post(`${endpoints.newBlog.activityCreate}`, formData, {
          headers: {
            // Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then(() => {
          setLoading(false);
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
        });
    }
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
  const [title, setTitle] = useState('');
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const [description, setDescription] = useState('');
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };
  const [templates, setTemplates] = useState([]);

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

  const [checked, setChecked] = React.useState('');

  const handleGoBack = () => {
    history.goBack();
  };

  const branchOption = branchList.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each?.branch_name}
        children={each?.id}
        id={each?.id}
        name={each?.branch_name}
      >
        {each?.branch_name}
      </Option>
    );
  });

  const gradeOption = gradeList.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each?.id}
        id={each?.id}
        children={each?.id}
        name={each?.name}
      >
        {each?.name}
      </Option>
    );
  });

  const sectionOption = sectionDropdown.map((each) => {
    return (
      <Option
        id={each?.id}
        value={each?.id}
        key={each?.id}
        children={each?.id}
        name={each?.name}
      >
        {each?.name}
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
    selectedSection([]);
  };

  // useEffect(() => {
  //   if (
  //     localActivityData?.name.toLowerCase() === 'music' ||
  //     localActivityData?.name.toLowerCase() === 'theatre' ||
  //     localActivityData?.name.toLowerCase() === 'dance'

  //   ) {
  //     setIsSubmissionHide(true);
  //   } else {
  //     setIsSubmissionHide(false);
  //   }
  // }, [localActivityData?.name]);

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
                        value={selectedBranch}
                        dropdownMatchSelectWidth={false}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(event, value) => {
                          handleBranch(value);
                        }}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={true}
                        onClear={handleClearBranch}
                      >
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
                        value={selectedGrade}
                        dropdownMatchSelectWidth={false}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(event, value) => {
                          handleGrade(event, value);
                        }}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={true}
                        onClear={handleClearGrade}
                      >
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
                        value={selectedSection}
                        dropdownMatchSelectWidth={false}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(event, value) => {
                          handleSection(value);
                        }}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={true}
                        onClear={handleClearSection}
                      >
                        {sectionOption}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='col-md-2 col-6 pl-0'>
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
                disabled={user_level == 11}
                onClick={dataPost}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
        {/* <Dialog open={assigned} maxWidth={maxWidth} style={{ borderRadius: '10px' }}> */}
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
      {/* <Layout>



        <Grid
          container
          direction='row'
          style={{ paddingLeft: '22px', paddingRight: '10px' }}
        ></Grid>
        <div
          className='col-md-6'
          style={{ zIndex: 2, display: 'flex', alignItems: 'center' }}
        >
          <div>
            <IconButton aria-label='back' onClick={handleGoBack}>
              <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
            </IconButton>
          </div>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
              Activity Management
            </Breadcrumb.Item>
            <Breadcrumb.Item href='' className='th-grey th-16'>
              Activity
            </Breadcrumb.Item>
            <Breadcrumb.Item href='' className='th-grey th-16'>
              Create {localActivityData?.name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div style={{ paddingLeft: '22px', paddingRight: '10px' }}>
          <Button
            variant='primary'
            style={{ borderRadius: '1px', color: 'white' }}
            disabled
          >
            Create {localActivityData?.name}
          </Button>
          <Divider className={classes.dividerColor} />
        </div>
        <div
          style={{
            paddingLeft: '22px',
            paddingRight: '10px',
            paddingTop: '50px',
            fontSize: '15px',
          }}
        >
          <div
            style={{
              marginLeft: '9px',
              display: 'flex',
              justifyContent: 'space-between',
              marginRight: '6px',
            }}
          >
            <div>
              {' '}
              Submission End Date *: &nbsp;&nbsp;&nbsp;
              <TextField
                required
                size='small'
                style={{ marginTop: '-6px' }}
                onChange={(e) => handleStartDateChange(e.target.value)}
                type='date'
                value={startDate || ' '}
                variant='outlined'
              />
            </div>
          </div>
          <Grid container spacing={2} style={{ marginTop: '23px' }}>
            <Grid item md={6} xs={12}>
              <Autocomplete
                multiple
                fullWidth
                size='small'
                limitTags={1}
                options={branchList || []}
                value={selectedBranch || []}
                getOptionLabel={(option) => option?.branch_name}
                filterSelectedOptions
                onChange={(event, value) => {
                  handleBranch(event, value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    variant='outlined'
                    label='Branch'
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                multiple
                fullWidth
                limitTags={1}
                size='small'
                className='filter-student meeting-form-input'
                options={gradeList || []}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                value={selectedGrade || []}
                onChange={(event, value) => {
                  handleGrade(event, value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    variant='outlined'
                    label='Grade'
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                multiple
                fullWidth
                limitTags={1}
                size='small'
                className='filter-student meeting-form-input'
                options={sectionDropdown || []}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                value={selectedSection || []}
                onChange={(event, value) => {
                  handleSection(event, value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    variant='outlined'
                    label='Section'
                  />
                )}
              />
            </Grid>
          </Grid>
          <div
            style={{
              border: '1px solid lightgrey',
              borderRadius: '5px',
              height: 'auto',
              marginTop: '20px',
            }}
          >
            <div style={{ marginTop: '23px', marginLeft: '73px', display: 'flex' }}>
              Activity Details *: &nbsp;&nbsp;&nbsp;&nbsp;
              <TextField
                id='outlined-basic'
                size='small'
                fullWidth
                value={title}
                onChange={handleTitle}
                style={{ maxWidth: '80%' }}
                label='Title *'
                variant='outlined'
              />
            </div>
            <br />
            <div
              style={{
                marginLeft: '13%',
                marginRight: '8%',
                marginBottom: '23px',
              }}
            >
              <TextField
                label='Description/Instructions *'
                placeholder='Description/Instructions *'
                multiline
                value={description}
                onChange={handleDescription}
                fullWidth
                style={{ maxWidth: '97%' }}
                rows='8'
                variant='outlined'
              />
            </div>
          </div>
          <div
            style={{
              border: '1px solid lightgrey',
              borderRadius: '5px',
              height: 'auto',
              marginTop: '20px',
            }}
          ></div>
          <div
            style={{
              marginTop: '60px',
              marginLeft: '50px',

              display: 'flex',
            }}
          >
            <Button
              variant='outlined'
              className={classes.buttonColor}
              size='medium'
              onClick={goBack}
            >
              Back
            </Button>{' '}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              variant='outlined'
              className={classes.buttonColor}
              size='medium'
              onClick={PreviewBlog}
            >
              Preview
            </Button>{' '}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              variant='outlined'
              onClick={handleClear}
              className={classes.buttonColor1}
              size='medium'
            >
              Clear
            </Button>{' '}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              variant='contained'
              color='primary'
              disabled={user_level == 11}
              onClick={dataPost}
            >
              Submit
            </Button>
          </div>
        </div>
        <Dialog open={assigned} maxWidth={maxWidth} style={{ borderRadius: '10px' }}>
          <div style={{ width: '642px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
              }}
            >
              <DialogTitle id='confirm-dialog'>Preview</DialogTitle>
              <div style={{ marginTop: '21px', marginRight: '34px' }}>
                <CloseIcon style={{ cursor: 'pointer' }} onClick={closePreview} />
              </div>
            </div>

            <div
              style={{
                border: '1px solid lightgray',
                height: ' auto',
                marginLeft: '16px',
                marginRight: '32px',
                borderRadius: '10px',
                marginBottom: '9px',
              }}
            >
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

                <div style={{ paddingTop: '16px', fontSize: '12px', color: '#536476' }}>
                </div>
                <div style={{ paddingTop: '19px', fontSize: '16px', color: '#7F92A3' }}>
                  Instructions
                </div>
                <div style={{ paddingTop: '8px', fontSize: '16px' }}>{description}</div>
                <div style={{ paddingTop: '28px', fontSize: '14px' }}>
                  <img src={fileUrl} width='50%' />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Layout> */}
    </div>
  );
};
export default VisualActivityCreate;
