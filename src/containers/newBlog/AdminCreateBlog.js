import React, { useState, useRef, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles, Dialog, DialogTitle } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import moment from 'moment';
import Layout from 'containers/Layout';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import {
  fetchAcademicYears,
  fetchBranches as fetchBranchRedux,
  fetchGrades,
  fetchSection,
} from '../lesson-plan/create-lesson-plan/apis';
import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory } from 'react-router-dom';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import Loader from '../../components/loader/loader';
import Carousel from 'react-elastic-carousel';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { useFormik } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import BackupIcon from '@material-ui/icons/Backup';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
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
  Modal,
} from 'antd';

import {
  fetchBranchesForCreateUser as getBranches,
  fetchGrades as getGrades,
  fetchSections as getSections,
  fetchSubjects as getSubjects,
} from '../../redux/actions';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { DownOutlined } from '@ant-design/icons';
import { element } from 'prop-types';
import { each } from 'highcharts';
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
    transform: 'scale(1.2)',
    padding: '5px',
  },
}));

const dummyRound = [
  { id: 1, round: 1, name: '1' },
  { id: 2, round: 2, name: '2' },
  { id: 3, round: 3, name: '3' },
  { id: 4, round: 4, name: '4' },
  { id: 5, round: 5, name: '5' },
];

const AdminCreateBlog = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const physicalId = localStorage?.getItem('PhysicalActivityId')
    ? JSON.parse(localStorage?.getItem('PhysicalActivityId'))
    : '';
  const branch_update_user =
    JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const activityDataType = localStorage.getItem('ActivityData')
    ? JSON.parse(localStorage.getItem('ActivityData'))
    : '';
  const { Option } = Select;
  const { TextArea } = Input;
  const formRef = createRef();
  const [branchList, setBranchList] = useState([]);
  const [maxWidth, setMaxWidth] = React.useState('lg');
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
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [subActivityName, setSubActivityName] = useState([]);
  const [isVisualActivity, setIsVisualActivity] = useState(false);
  const [academicYear, setAcademicYear] = useState('');
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
  });

  const [sudActId, setSubActId] = useState(physicalId);
  const [selectedSubActivityId, setSelectedSubActivityId] = useState('');

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const handleEditorChange = (content, editor) => {
    setDesc(content);
  };

  const handleSubActivity = (e, value) => {
    setVisible(false);
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setIsPhysicalActivity(false);
    setIsVisualActivity(false);
    if (value) {
      formRef.current.setFieldsValue({
        sub_activity: value,
        branch: [],
        grade: [],
        section: [],
        round: [],
        date: null,
      });
      setSubActivityName(value);
      setIsPhysicalActivity(true);
      setSelectedSubActivityId(value?.id);
      setVisible(true);
      console.log(value);
    }
  };

  const handleChangeActivity = (e, value) => {
    setActivityName([]);
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setIsPhysicalActivity(false);
    setVisible(false);
    if (value) {
      formRef.current.setFieldsValue({
        activity_categories: value,
        branch: [],
        grade: [],
        section: [],
        round: [],
        date: null,
      });
      setSelectedBranch([]);
      setSelectedGrade([]);
      setSelectedSection([]);
      setVisible(true);
      setActivityName(value);
      if (value?.value == 'Physical Activity') {
        setIsPhysicalActivity(true);
      } else if (value?.value === 'Visual Act') {
        setIsVisualActivity(true);
      }
    }
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

  const fetchBranches = () => {
    var branchIds = branch_update_user?.branches?.map((item) => item?.id);
    setLoading(true);
    axiosInstance
      .get(`${endpoints.newBlog.activityBranch}?branch_ids=${branchIds}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log('res', res);
        setLoading(false);
        if (res?.data) {
          const transformedData = res?.data?.result?.map((obj) => ({
            id: obj.id,
            name: obj.name,
          }));
          transformedData.unshift({
            name: 'Select All',
            id: 'all',
          });
          setBranchList(transformedData);
          setLoading(false);
        }
      });
    // })
  };

  let allGradeIds = [];

  // const fetchGrades = (value) => {
  //   const ids = value.map((el) => el.id) || [];
  //   setLoading(true);
  //   axiosInstance
  //     .get(`${endpoints.newBlog.activityGrade}?branch_ids=${ids}`, {
  //       headers: {
  //         'X-DTS-HOST': X_DTS_HOST,
  //       },
  //     })
  //     .then((res) => {
  //       setLoading(false);
  //       console.log(res, 'result');
  //       if (res) {
  //         setLoading(false);
  //         const gradeData = res?.data?.result || [];
  //         for (let i = 0; i < gradeData?.length; i++) {
  //           allGradeIds.push(gradeData[i].id);
  //         }
  //         gradeData.unshift({
  //           name: 'Select All',
  //           id: allGradeIds,
  //         });
  //         setGradeList(gradeData);
  //       }
  //     });
  // };

  useEffect(() => {
    fetchSubActivityListData();
  }, []);

  const fetchSubActivityListData = () => {
    axiosInstance
      .get(`${endpoints.newBlog.subActivityListApi}?type_id=${sudActId}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        setLoading(false);
        setSubActivityListData(result?.data?.result);
      });
  };
  const fetchSections = (sessionId, branchIds, gradeIds, moduleId) => {
    if (gradeIds) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.newBlog.erpSectionmappping}?session_year=${sessionId}&branch_id=${branchIds}&module_id=${moduleId}&grade_id=${gradeIds}`
          // {
          //   headers: {
          //     'X-DTS-HOST': X_DTS_HOST,
          //   },
          // }
        )
        .then((result) => {
          setLoading(false);
          if (result.data) {
            console.log(result.data);
            setSectionList(result.data?.data);
            const gradeData = result?.data?.result || [];
            gradeData.unshift({
              name: 'Select All',
              id: 'all',
            });
            setSectionDropdown(gradeData);
          }
        });
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);
  const handleBranch = (e, value) => {
    setSelectedSection([]);
    setSelectedGrade([]);
    if (value?.length > 0) {
      setSelectedGrade([]);
      setSelectedSection([]);
      const branchId = value?.map((element) => parseInt(element?.key)) || [];
      // value =
      //   value.filter(({ value }) => value === 'all').length === 1
      //     ? [...branchDropdown].filter(({ id }) => id !== 'all')
      //     : value;

      formRef.current.setFieldsValue({
        branch: value,
        grade: [],
        section: [],
        data: null,
      });
      setSelectedBranch(value);
      // fetchGrades(branchId);
      getGrades(selectedAcademicYear?.id, branchId);
    }
    getTemplate(activityName?.id);
  };

  const handleGrade = (e, value) => {
    setSelectedGrade([]);
    setSelectedSection([]);
    if (value) {
      setSelectedSection([]);
      const branchIds = selectedBranch.map((element) => parseInt(element?.key));
      const gradeId = value?.map((element) => parseInt(element?.key));
      // value =
      //   value.filter(({ name }) => name === 'Select All').length === 1
      //     ? [...gradeList].filter(({ name }) => name !== 'Select All')
      //     : value;
      formRef.current.setFieldsValue({
        grade: value,
        section: [],
        data: null,
      });
      setSelectedGrade(value);
      fetchSections(selectedAcademicYear?.id, branchIds, gradeId, moduleId);

      // fetchSections(value);
    }
  };
  const handleSection = (e, value) => {
    setSelectedSection([]);
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionDropdown].filter(({ id }) => id !== 'all')
          : value;
      formRef.current.setFieldsValue({
        date: null,
      });
      setSelectedSection(value);
    }
  };

  const handleRound = (e, value) => {
    if (value) {
      setSelectedRound(value?.value);
      setSelectedRoundID(value?.id);
    }
  };

  const handleStartDateChange = (val) => {
    setStartDate(moment(val).format('YYYY-MM-DD'));
    formRef.current.setFieldsValue({
      date: val,
    });
  };

  const PreviewBlog = () => {
    setAssigned(true);
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileUrl(URL.createObjectURL(event.target.files[0]));
  };
  const deleteSelectedImage = () => {
    setFileUrl(null);
    setSelectedFile(null);
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
        getActivitySession();

        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false);
      });
  };
  const handleClear = () => {
    setSelectedGrade([]);
    setSelectedBranch([]);
    setSelectedSection([]);
    setActivityName([]);
    setDescription('');
    setTitle('');
    setSelectedRound([]);
    setStartDate('');
    formRef.current.setFieldsValue({
      sub_activity: [],
      activity_categories: [],
      branch: [],
      grade: [],
      section: [],
      round: [],
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
    const branchIds = selectedBranch.map((obj) => obj?.key);
    const gradeIds = selectedGrade.map((obj) => obj?.key);
    const sectionIds = selectedSection.map((obj) => obj?.id);
    // setLoading(true);
    if (physicalId == '') {
      if (activityName?.length === 0) {
        message.error('Please Select Activity Categories');
        setLoading(false);
        return;
      }
    } else {
      if (subActivityName?.length === 0) {
        message.error('Please Select Sub Activity Categories');
        setLoading(false);
        return;
      }
    }
    if (activityName.length === 0 && physicalId == undefined) {
      setLoading(false);
      message.error('Please Select Activity Type');
      return;
    }
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
    if (selectedRound?.length === 0 && physicalId !== '') {
      setLoading(false);
      message.error('Please Select Round');
      return;
    }
    if (!startDate) {
      setLoading(false);
      message.error('Please Select Date');
      return;
    }
    if (title.length === 0) {
      setLoading(false);
      message.error('Please Add Title');
      return;
    }
    if (!description) {
      setLoading(false);
      message.error('Please Add Description');
      return;
    } else {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('issue_date', null);
      formData.append('submission_date', startDate + hoursAndMinutes);
      formData.append('image', selectedFile);
      formData.append(
        'activity_type_id',
        activityName?.id ? activityName?.id : selectedSubActivityId
      );
      formData.append('session_year', selectedAcademicYear.session_year);
      formData.append('created_at', startDate + hoursAndMinutes);
      formData.append('created_by', user_id.id);
      formData.append('branch_ids', branchIds);
      formData.append('grade_ids', gradeIds);
      formData.append('section_ids', sectionIds);
      formData.append('is_draft', physicalId ? false : true);
      formData.append('template_type', 'template');
      formData.append('template_id', checked);
      formData.append('round_count', selectedRoundID);
      axios
        .post(`${endpoints.newBlog.activityCreate}`, formData, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
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
          if (isPhysicalActivity == true) {
            history.push('/physical/activity');
            return;
          } else if (isVisualActivity == true) {
            history.push('visual/activity');
            return;
          } else {
            history.push('/blog/blogview');
            return;
          }
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
        console.log(response, 'session');

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
    getTemplate(activityName?.id);
  }, [selectedBranch, activityName]);

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      getAcademic();
    }
  }, [moduleId, selectedAcademicYear]);

  const [checked, setChecked] = React.useState('');

  const handleChange = (event, value) => {
    setChecked(value);
  };
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];

  const handleGoBack = () => {
    history.goBack();
  };

  const formik = useFormik({
    initialValues: {
      activity: '',
      date: '', //[moment().startOf('isoWeek'), moment().endOf('week')],
      branch: [],
      academic: selectedAcademicYear,
      grade: '',
      subject: [],
      assesment_type: '',
      section: [],
      group: '',
    },
    onSubmit: (values) => {
      // filterResults(1);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const getBranch = async (acadId) => {
    setLoading(true);
    try {
      setBranchDropdown([]);
      setGrades([]);
      // setSubjects([]);
      if (moduleId) {
        const data = await fetchBranchRedux(acadId, moduleId);
        setBranchDropdown(data);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      message.error('Failed To Fetch Branch');
    }
  };

  const getGrades = async (acadId, branchId) => {
    setLoading(true);
    try {
      setGrades([]);
      // setSubjects([]);
      const data = await fetchGrades(acadId, branchId, moduleId);
      setGrades(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      message.error('Failed to Fetch Grade');
    }
  };

  const actionTypeOption = activityCategory.map((each) => {
    return (
      <Option key={each?.id} value={each?.name} id={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const branchOptions = branchDropdown?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = grades?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade__grade_name} id={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.section_id} value={each?.id} id={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const roundOptions = roundDropdown.map((each) => {
    return (
      <Option key={each?.id} value={each?.name} id={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const subActionTypeOption = subActivityListData.map((each) => {
    return (
      <Option key={each?.id} value={each?.sub_type} id={each?.id}>
        {each?.sub_type}
      </Option>
    );
  });

  const handleAcademicYear = (event = {}, value = '') => {
    // formik.setFieldValue('academic', '');
    setAcademicYear('');
    if (value) {
      getBranch(value?.id);
      setAcademicYear(value);
      // formik.setFieldValue('academic', value);
    }
  };
  const getAcademic = async () => {
    handleAcademicYear({}, selectedAcademicYear);
  };

  const handleClearGrade = () => {
    setSelectedGrade([]);
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
                href='/blog/blogview'
                className='th-grey-1 th-18 th-pointer'
              >
                Blog Activity
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-18'>
                Create {activityDataType?.name}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='th-bg-white py-0 mx-3'>
          <div className='row'>
            <div className='col-12 py-3'>
              <Form id='filterForm' layout={'horizontal'} ref={formRef}>
                <div className='row align-items-center'>
                  {physicalId ? (
                    <div className='col-md-2 col-6 pl-0'>
                      <div className='mb-2 text-left'>Sub-Activity Categories</div>
                      <Form.Item name='sub_activity'>
                        <Select
                          allowClear
                          placeholder={'Select Sub-Activity'}
                          showSearch
                          optionFilterProp='children'
                          value={subActivityName || []}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          // defaultValue={subjectName}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          // onChange={(e, value) => {
                          //   formik.setFieldValue('status', value);
                          // }}
                          // onClear={handleClearSubject}
                          onChange={handleSubActivity}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {/* {statusOption} */}
                          {/* {actionTypeOption} */}
                          {subActionTypeOption}
                        </Select>
                      </Form.Item>
                    </div>
                  ) : (
                    <div className='col-md-2 col-6 pl-0'>
                      <div className='mb-2 text-left'>Activity Categories</div>
                      <Form.Item name='activity_categories'>
                        <Select
                          allowClear
                          placeholder={'Select Activity'}
                          showSearch
                          optionFilterProp='children'
                          value={activityName || []}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          // defaultValue={subjectName}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          // onChange={(e, value) => {
                          //   formik.setFieldValue('status', value);
                          // }}
                          // onClear={handleClearSubject}
                          onChange={handleChangeActivity}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
                          {/* {statusOption} */}
                          {actionTypeOption}
                        </Select>
                      </Form.Item>
                    </div>
                  )}
                  {visible ? (
                    <>
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
                            onChange={(e, value) => {
                              handleBranch(e, value);
                            }}
                            // onClear={handleClearBoard}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
                            {/* {branchDropdown.length > 1 && (
                          <>
                            <Option key={0} value={'all'}>
                              All
                            </Option>
                          </>
                        )} */}
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
                            onChange={(e, value) => {
                              handleGrade(e, value);
                            }}
                            onClear={handleClearGrade}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
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
                            // defaultValue={subjectName}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(e, value) => {
                              handleSection(e, value);
                            }}
                            // onClear={handleClearSubject}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
                            {sectionOptions}
                          </Select>
                        </Form.Item>
                      </div>
                      {physicalId ? (
                        <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                          <div className='mb-2 text-left'>Round</div>
                          <Form.Item name='round'>
                            <Select
                              allowClear
                              // mode='multiple'
                              suffixIcon={<DownOutlined className='th-grey' />}
                              // maxTagCount={2}
                              // showArrow={2}
                              placeholder={'Select Round'}
                              value={selectedRound || []}
                              showSearch
                              optionFilterProp='children'
                              // defaultValue={subjectName}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              onChange={(event, value) => {
                                handleRound(event, value);
                              }}
                              // onClear={handleClearSubject}
                              className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                              bordered={true}
                            >
                              {roundOptions}
                            </Select>
                          </Form.Item>
                        </div>
                      ) : (
                        ''
                      )}

                      <div className='col-md-2 col-6'>
                        <div className='mb-2 text-left'>Submission End Date</div>
                        <Space direction='vertical' className='w-100' size={12}>
                          <Form.Item name='date'>
                            <DatePicker
                              className='text-left th-date-picker th-br-4 th-bg-grey w-100 th-black-1'
                              bordered={true}
                              format={'YYYY/MM/DD'}
                              // allowClear={false}
                              onChange={(value) => handleStartDateChange(value)}
                            />
                            {/* <RangePicker
                          allowClear={false}
                          style={{ width: '105%', border: 'none' }}
                          bordered={true}
                          placement='bottomRight'
                          showToday={false}
                          suffixIcon={<DownOutlined />}
                          // defaultValue={[moment(), moment()]}
                          // value={formik?.values.date}
                          // onChange={(value) => handleDateChange(value)}
                          className='th-range-picker th-br-4 th-bg-grey'
                          separator={'-'}
                          format={'DD/MM/YYYY'}
                          getPopupContainer={(trigger) => trigger.parentNode}
                        /> */}
                          </Form.Item>
                        </Space>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
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
            {isPhysicalActivity ? (
              ''
            ) : (
              <>
                {(selectedBranch?.length !== 0) & (activityName?.length !== 0) ? (
                  <Carousel
                    breakPoints={breakPoints}
                    showThumbs={false}
                    infiniteLoop={true}
                  >
                    {templates?.map((obj, index) => (
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
                          value={checked}
                          onChange={() => handleChange(obj?.id, obj?.id)}
                          className={classes.tickSize}
                          // color='primary'
                          // inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <div>{obj?.title}</div>
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  ''
                )}
              </>
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
                <Button type='primary' className='w-100 th-14' onClick={PreviewBlog}>
                  Preview
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
                  disabled={user_level == 11}
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
            title={`Preview - ${activityDataType?.name}`}
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
                  Branch -&nbsp;
                  <span style={{ color: 'black' }}>
                    {selectedBranch.map((each) => (
                      <b style={{ padding: '4px', fontWeight: '500' }}>
                        {each?.children}
                      </b>
                    ))}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'gray' }}>
                  Grade -&nbsp;
                  <span style={{ color: 'black' }}>
                    {selectedGrade.map((each) => (
                      <b style={{ padding: '4px', fontWeight: '500' }}>
                        {each?.children}
                      </b>
                    ))}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'gray' }}>
                  Section -&nbsp;
                  <span style={{ color: 'black' }}>
                    {selectedSection.map((each) => (
                      <b style={{ padding: '4px', fontWeight: '500' }}>
                        {each?.children}
                      </b>
                    ))}
                  </span>
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
        </div>
      </Layout>

      {/* <Layout>
        {loading && <Loader />}

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
            {physicalId ? (
              <Breadcrumb.Item href='' className='th-grey th-16'>
                Create Physical Activity
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item href='' className='th-grey th-16'>
                Create Activity
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>
        <div style={{ paddingLeft: '22px', paddingRight: '10px' }}>
          {physicalId ? (
            <Button
              variant='primary'
              style={{ borderRadius: '1px', color: 'white' }}
              disabled
            >
              Create Physical Activity
            </Button>
          ) : (
            <Button
              variant='primary'
              style={{ borderRadius: '1px', color: 'white' }}
              disabled
            >
              Create Activity
            </Button>
          )}

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
            <div style={{ display: 'flex' }}>
              {physicalId ? (
                <>
                  Sub-Activity Category * :
                  <Autocomplete
                    style={{ marginTop: '-7px', width: '222px', marginLeft: '18px' }}
                    size='small'
                    onChange={handleSubActivity}
                    options={subActivityListData || []}
                    value={subActivityName || []}
                    getOptionLabel={(option) => option?.sub_type}
                    filterSelectedOptions
                    renderInput={(params) => <TextField {...params} variant='outlined' />}
                  />
                </>
              ) : (
                <>
                  Activity Category * :
                  <Autocomplete
                    style={{ marginTop: '-7px', width: '222px', marginLeft: '18px' }}
                    size='small'
                    onChange={handleChangeActivity}
                    options={activityCategory || []}
                    value={activityName || []}
                    getOptionLabel={(option) => option?.name}
                    filterSelectedOptions
                    renderInput={(params) => <TextField {...params} variant='outlined' />}
                  />
                </>
              )}
            </div>
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
          {visible ? (
            <Grid container spacing={2} style={{ marginTop: '23px' }}>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  multiple
                  fullWidth
                  size='small'
                  limitTags={1}
                  options={branchList || []}
                  value={selectedBranch || []}
                  getOptionLabel={(option) => option?.name}
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
              {physicalId ? (
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    size='small'
                    className='filter-student meeting-form-input'
                    options={roundDropdown || []}
                    getOptionLabel={(option) => option?.name || ''}
                    filterSelectedOptions
                    value={selectedRound || []}
                    onChange={(event, value) => {
                      handleRound(event, value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        variant='outlined'
                        label='Round'
                      />
                    )}
                  />
                </Grid>
              ) : (
                ''
              )}
            </Grid>
          ) : (
            ''
          )}

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
          >
            {isPhysicalActivity ? (
              ''
            ) : (
              <>
                {selectedBranch?.length !== 0 && activityName?.length !== 0 ? (
                  <Carousel
                    breakPoints={breakPoints}
                    showThumbs={false}
                    infiniteLoop={true}
                  >
                    {templates?.map((obj, index) => (
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
                          value={checked}
                          onChange={() => handleChange(obj?.id, obj?.id)}
                          className={classes.tickSize}
                          color='primary'
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <div>{obj?.title}</div>
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  ''
                )}
              </>
            )}
          </div>
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
          </div>
        </Dialog>
      </Layout> */}
    </div>
  );
};
export default AdminCreateBlog;
