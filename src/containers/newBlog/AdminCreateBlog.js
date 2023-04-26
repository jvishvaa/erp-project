import React, { useState, useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import Layout from 'containers/Layout';
import {
  fetchBranches as fetchBranchRedux,
  fetchGrades,
} from './apis';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import Loader from '../../components/loader/loader';
import Carousel from 'react-elastic-carousel';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { useFormik } from 'formik';
import {
  Breadcrumb,
  Button,
  Form,
  Select,
  Space,
  DatePicker,
  Input,
  message,
  Checkbox,
  Modal,
} from 'antd';

import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';
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
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const physicalId = localStorage?.getItem('PhysicalActivityId')
    ? JSON.parse(localStorage?.getItem('PhysicalActivityId'))
    : '';
  const blogActId = localStorage?.getItem('BlogActivityId')
    ? JSON.parse(localStorage?.getItem('BlogActivityId'))
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
  const [requestOngoing, setRequestOngoing] = useState(false);
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
  const [selectedBranchName, setSelectedBranchName] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeName, setSelectedGradeName] = useState([]);
  const [selectedRound, setSelectedRound] = useState([]);
  const [selectedRoundID, setSelectedRoundID] = useState('');
  const [gradeIds, setGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionName, setSelectedSectionName] = useState([]);
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
  const [criteriaTitle, setCriteriaTitle] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState('');
  const [selectedCriteriaTitleId, setSelectedCriteriaTitleId] = useState(null);
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
      fetchCriteria(value?.id);
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
  useEffect(() => {
    fetchSubActivityListData();
  }, []);

  const fetchSubActivityListData = () => {
    axiosInstance
      .get(
        `${endpoints.newBlog.subActivityListApi}?type_id=${sudActId}&is_type=${true}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((result) => {
        setLoading(false);
        setSubActivityListData(result?.data?.result);
      });
  };
  const fetchCriteria = (SubId) => {
    axiosInstance
      .get(`${endpoints.newBlog.criteriaTitleList}?type_id=${SubId}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        setLoading(false);
        setCriteriaTitle(result?.data?.result);
      });
  };
  const fetchSections = (sessionId, branchIds, gradeIds, moduleId) => {
    if (gradeIds.length !== 0) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.newBlog.erpSectionmapppingV3}?session_year=${sessionId}&branch_id=${branchIds}&module_id=${moduleId}&grade_id=${gradeIds}`
        )
        .then((result) => {
          setLoading(false);
          if (result.data) {
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

  const handleBranch = (value, event) => {
    setSelectedSection([]);
    setSelectedGrade([]);
    setGradeList([]);
    setSectionList([]);
    setSelectedSection([]);
    setSelectedBranch([]);
    setGrades([]);
    formRef.current.setFieldsValue({
      // branch:[],
      grade: [],
      section: [],
    });
    if (value?.length > 0) {
      setSelectedGrade([]);
      setSelectedSection([]);
      const all = branchDropdown.slice();
      const allBranchIds = all.map((item) => parseInt(item?.id));
      const allBranchNames = all.map((item) => item);
      if (value.includes('All')) {
        setSelectedBranch(allBranchIds);
        setSelectedBranchName(allBranchNames);
        formRef.current.setFieldsValue({
          branch: allBranchIds,
          grade: [],
          section: [],
          data: null,
        });
        getGrades(selectedAcademicYear?.id, allBranchIds);
      } else {
        setSelectedBranch(value);
        setSelectedBranchName(event);
        formRef.current.setFieldsValue({
          branch: value,
          grade: [],
          section: [],
          data: null,
        });
        getGrades(selectedAcademicYear?.id, value);
      }
    }
    getTemplate(activityName?.id);
  };

  const handleGrade = (value, event) => {
    setSelectedGrade([]);
    setSelectedSection([]);
    setSectionList([]);

    formRef.current.setFieldsValue({
      section: [],
    });
    if (value) {
      setSelectedSection([]);
      const all = grades.slice();
      const allGradeIds = all.map((item) => parseInt(item?.grade_id));
      const allGradeName = all.map((item) => item);
      if (value.includes('All')) {
        setSelectedGrade(allGradeIds);
        setSelectedGradeName(allGradeName);
        formRef.current.setFieldsValue({
          grade: allGradeIds,
          section: [],
          data: null,
        });
        fetchSections(selectedAcademicYear?.id, selectedBranch, allGradeIds, moduleId);
      } else {
        setSelectedGrade(value);
        setSelectedGradeName(event);
        fetchSections(selectedAcademicYear?.id, selectedBranch, value, moduleId);
      }
    }
  };
  const handleSection = (value, event) => {
    setSelectedSection([]);
    if (value) {
      const all = sectionList.slice();
      const allSectionIds = all.map((item) => parseInt(item.section_id));
      const allSectionName = all.map((item) => item);
      if (value.includes('All')) {
        setSelectedSection(allSectionIds);
        setSelectedSectionName(allSectionName)
        formRef.current.setFieldsValue({
          section: allSectionIds,
          date: null,
        });
      } else {
        formRef.current.setFieldsValue({
          section: value,
          date: null,
        });
        setSelectedSection(value);
        setSelectedSectionName(event)
      }
    }
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
      criteria: [],
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
    if (selectedRound?.length === 0 && physicalId !== '') {
      setLoading(false);
      message.error('Please Select Round');
      return;
    }
    if (selectedCriteria?.length === 0 && physicalId !== '') {
      setLoading(false);
      message.error('Please Select Criteria Title');
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
      setRequestOngoing(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('issue_date', null);
      formData.append('submission_date', startDate + hoursAndMinutes);
      formData.append('image', selectedFile);
      formData.append(
        'activity_type_id',
        selectedCriteriaTitleId ? selectedCriteriaTitleId : activityName?.id
        // activityName?.id ? activityName?.id : selectedSubActivityId
      );
      formData.append('session_year', selectedAcademicYear.session_year);
      formData.append('created_at', startDate + hoursAndMinutes);
      formData.append('created_by', user_id.id);
      formData.append('branch_ids', selectedBranch);
      formData.append('grade_ids', selectedGrade);
      formData.append('section_ids', selectedSection);
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
          setRequestOngoing(false);
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
        })
        .catch((error) => {
          setRequestOngoing(false);
          setLoading(false);
          message.error(error);
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
        if (activityDataType?.name.toLowerCase() == 'blog activity') {
          blogActivityFun(response.data.result);
        } else {
          setActivityCategory(response.data.result);
        }
      });
  };

  const blogActivityFun = (data) => {
    let res = data.filter((item) => item?.name.toLowerCase() === 'blog activity');
    setActivityCategory(res);
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
    onSubmit: (values) => {},
    validateOnChange: false,
    validateOnBlur: false,
  });

  const getBranch = async (acadId) => {
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
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      message.error('Failed To Fetch Branch');
    }
  };

  const getGrades = async (acadId, branchId) => {
    if (branchId) {
      setLoading(true);
      try {
        setGrades([]);
        setGradeList([]);
        const data = await fetchGrades(acadId, branchId, moduleId);
        setGrades(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        message.error('Failed to Fetch Grade');
      }
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
      <Option key={each?.id} value={each?.id} id={each?.id} branch_name={each?.branch_name}>
        {each?.branch_name}
      </Option>
    );
  });


  const gradeOptions = grades?.map((each) => {
    return (
      <Option
        key={each?.grade_id}
        value={each?.grade_id}
        id={each?.grade_id}
        grade__grade_name={each?.grade__grade_name}
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
        section__section_name={each?.section__section_name}
      >
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

  const criteriaOptions = criteriaTitle?.map((each) => {
    return (
      <Option id={each?.id} value={each?.criteria_title}>
        {each?.criteria_title}
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
                href={
                  activityDataType?.name.toLowerCase() === 'physical activity'
                    ? '/physical/activity'
                    : '/blog/blogview'
                }
                className='th-grey-1 th-18 th-pointer'
              >
                {activityDataType?.name}
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
                          onChange={handleSubActivity}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={true}
                        >
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
                            maxTagCount={1}
                            showArrow={true}
                            suffixIcon={<DownOutlined className='th-grey' />}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(value, e) => {
                              handleBranch(value, e);
                            }}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
                            {branchDropdown.length > 0 && (
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
                            maxTagCount={1}
                            showArrow={1}
                            getPopupContainer={(trigger) => trigger.parentNode}
                            showSearch
                            optionFilterProp='children'
                            suffixIcon={<DownOutlined className='th-grey' />}
                            filterOption={(input, options) => {
                              return (
                                options.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={(value, e) => {
                              handleGrade(value, e);
                            }}
                            onClear={handleClearGrade}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
                            {grades?.length > 0 && (
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
                            maxTagCount={1}
                            showArrow={1}
                            placeholder={'Select Section'}
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
                              handleSection(value, e);
                            }}
                            className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                            bordered={true}
                          >
                            {sectionList.length > 0 && (
                              <Option key='0' value='All'>
                                All
                              </Option>
                            )}
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
                              suffixIcon={<DownOutlined className='th-grey' />}
                              placeholder={'Select Round'}
                              value={selectedRound || []}
                              showSearch
                              optionFilterProp='children'
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
                      {physicalId ? (
                        <div className='col-md-2 col-6'>
                          <div className='mb-2 text-left'>Criteria Title</div>
                          <Form.Item name='criteria'>
                            <Select
                              placeholder={'Select Criteria Title'}
                              getPopupContainer={(trigger) => trigger.parentNode}
                              showSearch
                              optionFilterProp='children'
                              value={selectedCriteria || []}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              onChange={(e, value) => {
                                handleCriteriaTitle(e, value);
                              }}
                              onClear={handleClearGrade}
                              className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                              bordered={true}
                            >
                              {criteriaOptions}
                            </Select>
                          </Form.Item>
                        </div>
                      ) : (
                        ''
                      )}

                      <div className='col-md-2 col-6 pl-md-3'>
                        <div className='mb-2 text-left'>Submission End Date</div>
                        <Space direction='vertical' className='w-100' size={12}>
                          <Form.Item name='date'>
                            <DatePicker
                              className='text-left th-date-picker th-br-4 th-bg-grey w-100 th-black-1'
                              bordered={true}
                              format={'YYYY/MM/DD'}
                              onChange={(value) => handleStartDateChange(value)}
                            />
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
                    {selectedBranchName.map((each) => (
                      <b style={{ padding: '4px', fontWeight: '500' }}>
                        {each?.branch_name}
                      </b>
                    ))}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'gray' }}>
                  Grade -&nbsp;
                  <span style={{ color: 'black' }}>
                    {selectedGradeName.map((each) => (
                      <b style={{ padding: '4px', fontWeight: '500' }}>
                        {each?.grade__grade_name}
                      </b>
                    ))}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'gray' }}>
                  Section -&nbsp;
                  <span style={{ color: 'black' }}>
                    {selectedSectionName.map((each) => (
                      <b style={{ padding: '4px', fontWeight: '500' }}>
                        {each?.section__section_name}
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
    </div>
  );
};
export default AdminCreateBlog;