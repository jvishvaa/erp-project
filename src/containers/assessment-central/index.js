import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import {
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  Divider,
  Tabs,
  Tab,
  Paper,
  InputLabel,
  OutlinedInput,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  CircularProgress,
  SvgIcon,
  FormControlLabel,
  Checkbox,
  Box,
  Input,
  Switch,
} from '@material-ui/core';
import { connect, useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Layout from '../Layout';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import TabPanel from '../lesson-plan/create-lesson-plan/tab-panel';
import './styles.scss';
import AssesmentCard from './assesment-card';
import AssesmentDetails from './assesment-details';
import hidefilter from '../../assets/images/hidefilter.svg'; //hidefilter.svg
import showfilter from '../../assets/images/showfilter.svg'; //showfilter.svg
import {
  fetchAssesmentTypes,
  fetchAssesmentTests,
  fetchAssesmentTestDetail,
} from '../../redux/actions';
import {
  fetchAcademicYears,
  fetchBranches,
  fetchGrades,
  fetchSubjects,
} from '../lesson-plan/create-lesson-plan/apis';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import DateRangeSelector from '../../components/date-range-selector';
import infoIcon from '../../assets/images/info-icon.svg';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';
import axios from './../../config/axios';
import endpoints from 'config/endpoints';
import Loader from './../../components/loader/loader';
import FileSaver from 'file-saver';
import axiosInstance from './../../config/axios';
import { Breadcrumb, Button, Form, Select, Space, Typography, DatePicker } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { DownOutlined } from '@ant-design/icons';

const useStyles = makeStyles({
  tabsFlexContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    overflow: 'auto',
  },
});

const { RangePicker } = DatePicker;

const statuses = [
  { id: 1, name: 'Upcoming' },
  { id: 2, name: 'Completed' },
];

const { Option } = Select;

const Assesment = ({ handleColumnSelectedTestChange, handleClose }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const fileRef = useRef();
  const formRef = createRef();

  // const [statuses, setStatuses] = useState([]);
  const [academicDropdown, setAcademicDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [assesmentTypes, setAssesmentTypes] = useState([]);
  const [expandFilter, setExpandFilter] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [assesmentTests, setAssesmentTests] = useState([]);
  const [assesmentTestsPage, setAssesmentTestsPage] = useState(1);
  const [assesmentTestsTotalPage, setAssesmentTestsTotalPage] = useState(0);
  const [filteredAssesmentTests, setFilteredAssesmentTests] = useState([]);
  const [filteredAssesmentTestsPage, setFilteredAssesmentTestPage] = useState(1);
  const [filteredAssesmentTestsTotalPage, setFilteredAssesmentTestsTotalPage] =
    useState(0);
  const [showFilteredList, setShowFilteredList] = useState(false);
  const [selectedAssesmentTest, setSelectedAssesmentTest] = useState();
  const [fetchingTests, setFetchingTests] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [ quizAccess , setQuizAccess ] = useState()
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [bulkUpload, setBulkUpload] = useState(false);
  const [file, setFile] = useState(null);
  const isSuperuser = JSON.parse(localStorage.getItem('userDetails'))?.is_superuser;
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level || {};
  const isSuperAdmin = userLevel === 1;
  const [loading, setLoading] = useState(false);
  const [gradeId, setGradeId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState([]);
  const [sectionToggle, setSectionToggle] = useState(false);
  const [sectionList, setSectionList] = useState([]);
  const [sectionFlag, setSectionFlag] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [groupFlag, setGroupFlag] = useState(false);
  const [isRestoreUnable, setIsRestoreUnable] = useState(false)
  const testFilterData = JSON.parse(sessionStorage.getItem('createTestData')) || {}
  const testFilterDropdownList = JSON.parse(sessionStorage.getItem('dropDownData')) || {}
  let isRestoreFields = history?.location?.state?.dataRestore || false
  let selectedBranch = useSelector((state) => state.commonFilterReducer.selectedBranch);
  const [checkDel, setCheckDel] = useState(false);
  const [showFilter, setShowfilter] = useState(false);
  const filtersData = history?.location?.state?.filtersData


  useEffect(() => {
    if (isRestoreFields) setIsRestoreUnable(true)
  }, [])


  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Test') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      status: '',
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
      filterResults(1);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

// useEffect(() => {
//   if(filtersData && moduleId){
//     debugger
//     handleBranch('',filtersData?.branch)
//       formik.setFieldValue('branch', filtersData?.branch);
//       // handleGrade('',filtersData?.grade)
//       // formik.setFieldValue('grade', filtersData?.grade);
//       // handleSubject()
//       formik.setFieldValue('status', filtersData?.status);
//       formik.setFieldValue('section', filtersData?.section);
//       formik.setFieldValue('group', filtersData?.group);
//       formik.setFieldValue('assesment_type', filtersData?.assesment_type);
//       formik.setFieldValue('date', filtersData?.date);
//       formRef.current.setFieldsValue({
//         branch : filtersData?.branch,
//         // grade : filtersData?.grade,
//         // subject : filtersData?.subject,
//         status : filtersData?.status,
//         assessmentType : filtersData?.assesment_type,
//         section : filtersData?.section,
//         date : filtersData?.date


//       })
//       // formik.setFieldValue('grade', filtersData?.grade);
     
//   }

// },[filtersData, moduleId])

useEffect(() => {
  if(filtersData && formik.values.branch.length){
    handleGrade('',filtersData?.grade)
      formik.setFieldValue('grade', filtersData?.grade);
      formRef.current.setFieldsValue({
        grade : filtersData?.grade,
      })
  }
},[formik.values.branch])

useEffect(() => {
  if(filtersData && formik.values.grade){
    handleSubject('',filtersData?.subject)
    formik.setFieldValue('subject', filtersData?.subject);
    formRef.current.setFieldsValue({
        subject : filtersData?.subject,
      })
  }
},[formik.values.grade])


  const getAcademic = async () => {
    // try {
    //   setAcademicDropdown([]);
    //   setBranchDropdown([]);
    //   setGrades([]);
    //   setSubjects([]);
    //   const data = await fetchAcademicYears(moduleId);
    handleAcademicYear({}, selectedAcademicYear);
    //   setAcademicDropdown(data);
    // } catch (e) {
    //   setAlert('error', 'Failed to fetch academic');
    // }
  };

  useEffect(() => {
    if (formik.values.subject.length > 0) {
      handleFilterAssessment();
    }
  }, [formik.values.date]);

  const getBranch = async (acadId) => {
    setLoading(true)
    try {
      setBranchDropdown([]);
      setGrades([]);
      setSubjects([]);
      if(moduleId){
        const data = await fetchBranches(acadId, moduleId);
        setBranchDropdown(data);
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
      setAlert('error', 'Failed to fetch branch');
    }
    

  };

  const getGrades = async (acadId, branchId) => {
    setLoading(true)
    try {
      setGrades([]);
      setSubjects([]);
      const data = await fetchGrades(acadId, branchId, moduleId);
      setGrades(data);
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setAlert('error', 'Failed to fetch grades');
    }
  };

  const getSubjects = async (acadSessionIds, mappingId) => {
    setLoading(true)
    try {
      setSubjects([]);
      const data = await fetchSubjects(acadSessionIds, mappingId);
      setSubjects(data);
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setAlert('error', 'Failed to fetch subjects');
    }
  };

  const getAssesmentTypes = async () => {
    try {
      const data = await fetchAssesmentTypes();
      setAssesmentTypes(data);
    } catch (e) { }
  };
  let filterData1 = [];
  const filterResults = async (page) => {
    setLoading(true)
    const {
      branch = [],
      grade,
      subject,
      assesment_type: assesmentType,
      date,
      status,
      section,
      group,
    } = formik.values;
    filterData1 = {
      branch: formik.values.branch,
      grade: formik.values.grade,
      subject: formik.values.subject,
      status: formik.values.status,
      assesment_type : formik.values.assesmentType,
      date :formik.values?.date ,
      section : formik.values.section,
      group : formik.values.group,

    };
    setFilterData(filterData1);
    // const acadSessionId = branch?.id;
    const acadSessionIds = branch.map((element) => element?.value) || [];
    const subjectIds = subject.map((item) => item?.value);
    const sectionMappingIds = section;
    const groupIds = group;
    sessionStorage.setItem('createTestData', JSON.stringify(formik?.values))
    sessionStorage.setItem('dropDownData', JSON.stringify({ branch: branchDropdown, grade: grades, subject: subjects, assesmentTypes: assesmentTypes, section: sectionList, group: groupList, isSectionToggle: sectionToggle }))
    try {
      setFetchingTests(true);
      const { results, totalPages } = await fetchAssesmentTests(
        false,
        activeTab,
        acadSessionIds,
        grade?.value,
        subjectIds,
        assesmentType?.value,
        status?.value,
        date,
        page,
        9,
        sectionToggle,
        sectionMappingIds,
        groupIds,
        sectionFlag,
        groupFlag
      );
      setShowFilteredList(true);
      setFilteredAssesmentTestsTotalPage(totalPages);
      setFilteredAssesmentTests(results);
      setFetchingTests(false);
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setAlert('error', 'Fetching tests failed');
      setFetchingTests(false);
    }
  };

  const handleAssesmentTestsPageChange = async (page) => {
    if (showFilteredList) {
      setFilteredAssesmentTestPage(page);
      filterResults(page);
    } else {
      setAssesmentTestsPage(page);
    }
  };

  const handleSelectTest = async (test) => {
    try {
      const { results } = await fetchAssesmentTestDetail(test.id);
      setSelectedAssesmentTest({
        ...results,
        testType: test.test_type__exam_name,
        subjects: test.question_paper__subject_name,
        grade: test.grade_name,
      });
    } catch (e) {
      setAlert('error', 'Failed to fetch test details');
    }
  };

  // useEffect(() => {
  //   if (formik.values.academic) {
  //     getBranch(formik.values.academic?.id);
  //     if (formik.values.branch.length) {
  //       const branchIds =
  //         formik.values.branch.map((element) => element?.branch?.id) || [];
  //       setSelectedBranchId(branchIds);
  //       getGrades(formik.values.academic?.id, branchIds);
  //       if (formik.values.grade) {
  //         const acadSessionIds = formik.values.branch.map((element) => element?.id) || [];
  //         getSubjects(acadSessionIds, formik.values.grade?.grade_id);
  //       } else {
  //         setSubjects([]);
  //       }
  //     } else {
  //       setGrades([]);
  //     }
  //   } else {
  //     setBranchDropdown([]);
  //   }
  // }, [moduleId]);

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      getAcademic();
    }
    getAssesmentTypes();
  }, [moduleId, selectedAcademicYear]);

  const clearResults = () => {
    formik.handleReset();
    setFilteredAssesmentTests([]);
    setFilteredAssesmentTestsTotalPage(0);
    setFilteredAssesmentTestPage(1);
  };

  useEffect(() => {
    if (formik?.values?.status  && formik?.values?.branch?.length && formik?.values?.grade && formik?.values?.subject?.length && formik?.values?.date) {
      setFilteredAssesmentTestPage(1);
      setSelectedAssesmentTest(null);
      filterResults(1); // reseting the page
    }
    // clearResults();
  }, [activeTab, formik.values]);

  useEffect(() => {
    if (formik.values.status?.name === 'Upcoming') {
      // formik.setFieldValue('date', [moment(), moment().add(6, 'days')]);
      setMinDate(Date(moment()));
    } else {
      setMinDate(null);
    }
  }, [formik.values.status]);

  let results = [];

  if (showFilteredList) {
    results = filteredAssesmentTests;
  } else {
    results = assesmentTests;
  }
  let checkDelete = '';
  const checkDelPermission = () => {
    axiosInstance
      .get(`assessment/assessment-deletion-access-config/`)
      .then((res) => {
        console.log(res);
        checkDelete = res.data.result.find((each) => parseInt(each) === userLevel);
        setCheckDel(checkDelete != undefined ? true : false);
      })
      .catch((error) => {
        setAlert('error', 'Something Wrong!');
      });
  };

  const handleFilterAssessment = () => {
    checkDelPermission();
    if (!formik?.values?.status) {
      setAlert('error', 'Select Status');
      return;
    }
    // if (!formik?.values?.academic) {
    //   setAlert('error', 'Select Academic Year');
    //   return;
    // }
    if (formik?.values?.branch.length === 0) {
      setAlert('error', 'Select Branch');
      return;
    }
    if (!formik?.values?.grade) {
      setAlert('error', 'Select Grade');
      return;
    }
    if (!formik?.values?.subject?.length) {
      setAlert('error', 'Select Subject');
      return;
    }
    // if (!formik?.values?.assesment_type) {
    //   setAlert('error', 'Select Assessment Type');
    //   return;
    // }
    if(!formik?.values?.date){
      setAlert('error', 'Select Date');
      return;
    }
    formik.handleSubmit();
    sessionStorage.setItem('createTestData', JSON.stringify(formik?.values))
    sessionStorage.setItem('dropDownData', JSON.stringify({ branch: branchDropdown, grade: grades, subject: subjects, assesmentTypes: assesmentTypes, section: sectionList, group: groupList, isSectionToggle: sectionToggle }))
  };

  useEffect(() => {
    if (isRestoreUnable) {
      formik.setFieldValue('status', testFilterData?.status)
      formik.setFieldValue('branch', testFilterData?.branch);
      formik.setFieldValue('grade', testFilterData?.grade);
      formik.setFieldValue('subject', testFilterData?.subject);
      formik.setFieldValue('section', testFilterData?.section);
      formik.setFieldValue('group', testFilterData?.group);
      formik.setFieldValue('assesment_type', testFilterData?.assesment_type)
      let date = [moment(testFilterData?.date[0]),moment(testFilterData?.date[1])]
      formik.setFieldValue('date',date )
      formRef.current.setFieldsValue({
          status : testFilterData?.status,
          branch : testFilterData?.branch,
          grade : testFilterData?.grade,
          subject : testFilterData?.subject,
          group : testFilterData?.group,
          section : testFilterData?.section,
          assessmentType : testFilterData?.assesment_type,
          date : date
      })
      setBranchDropdown(testFilterDropdownList?.branch)
      setGrades(testFilterDropdownList?.grade)
      setSubjects(testFilterDropdownList?.subject)
      setAssesmentTypes(testFilterDropdownList?.assesmentTypes)
      setGroupList(testFilterDropdownList?.group)
      setSectionList(testFilterDropdownList?.section)
      setSectionToggle(testFilterDropdownList?.isSectionToggle)
      history.replace({ state: { dataRestore: false } })
      testFilterDropdownList?.isSectionToggle ? setGroupFlag(true) : setSectionFlag(true);
      if (testFilterData?.status?.id) formik.handleSubmit();
    }

  }, [isRestoreUnable])

  const handleAcademicYear = (event = {}, value = '') => {
    formik.setFieldValue('academic', '');
    if (value) {
      getBranch(value?.id);
      formik.setFieldValue('academic', value);
    }
  };

  const handleBranch = (event, value) => {
    formRef.current.setFieldsValue({
      grade: [],
      subject: [],
    });
    formik.setFieldValue('branch', []);
    formik.setFieldValue('grade', []);
    formik.setFieldValue('subject', []);
    formik.setFieldValue('section', []);
    formik.setFieldValue('group', '');
    setSectionList([]);
    setGroupList([]);
    setGrades([])
    setSubjects([])
    if (value?.length > 0) {
      formik.setFieldValue('grade', []);
      formik.setFieldValue('subject', []);
      const branchIds = value?.map((element) => parseInt(element?.key)) || [];
      getGrades(formik.values.academic?.id, branchIds);
      formik.setFieldValue('branch', value);
    }
  };

  const fetchSection = (acadSessionId, branchId, gradeId, moduleId) => {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${acadSessionId}&branch_id=${branchId}&grade_id=${gradeId}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          const transformData = res?.data?.data.map((item) => ({
            section_id: item.section_id,
            section__section_name: item.section__section_name,
            id: item.id,
          }));
          transformData.unshift({
            value: 'all',
            section__section_name: 'All',
            id: 'all',
            section_id: 'section_mapping_id',
          });
          setSectionList(transformData);
        }
      });
  };

  const handleSection = (e, value) => {
    formik.setFieldValue('section', []);
    setSectionFlag(false);
    if (value.length) {
      value =
        value.filter((item) => item?.value === 'all').length === 1
          ? [...sectionOptions].filter((item) => item?.props?.value !== 'all').map((items) => items?.props?.value)
          : value?.map((i) => (i?.value)); 
      formik.setFieldValue('section', value);
      setSectionFlag(true);
    }
  };

  const fetchGroupList = (acadId, grade) => {
    axiosInstance
      .get(
        `${endpoints.assessmentErp.getGroups
        }?acad_session=${acadId}&grade=${grade}&is_active=${true}`
      )
      .then((result) => {
        if (result?.status === 200) {
          setGroupList(result?.data);
        }
      });
  };

  const handleGroup = (e, value) => {
    setGroupFlag(false);
    formik.setFieldValue('group', '');
    formik.setFieldValue('section', []);
    formik.setFieldValue('group', '');
    if (value) {
      // const sections = value?.group_section_mapping.map((i) => i?.section_mapping_id);
      formik.setFieldValue('group', value);
      setGroupFlag(true);
    }
  };

  const handleGrade = (event, value) => {
    formRef.current.setFieldsValue({
      subject: [],
    });
    formik.setFieldValue('grade', []);
    formik.setFieldValue('subject', []);
    formik.setFieldValue('section', []);
    formik.setFieldValue('group', '');
    setSectionList([]);
    setGroupList([]);
    setSubjects([])
    if (value) {
      const acadSessionIds = formik.values.branch.map((element) => element?.value) || [];
      getSubjects(acadSessionIds, value?.value);
      formik.setFieldValue('grade', value);
      const branchIds = formik?.values?.branch.map((i) => parseInt(i?.key));
      const sectionData = fetchSection(
        selectedAcademicYear?.id,
        branchIds,
        value?.value,
        moduleId
      );
      setSectionList(sectionData);
      const groupData = fetchGroupList(acadSessionIds, value?.value);
      setGroupList(groupData);
    }
  };

  const handleSubject = (event, value) => {
    formik.setFieldValue('subject', []);
    if (value) {
      formik.setFieldValue('subject', value);
      // handleFilterAssessment()
    }
  };

  const handleClearAll = (event, value) => {
    formik.handleReset();
    setFilteredAssesmentTests([]);
    setFilteredAssesmentTestsTotalPage(0);
    setFilteredAssesmentTestPage(1);
    setSelectedAssesmentTest(null);
  };

  const handleFileChange = (event) => {
    const { files } = event.target || {};
    const fil = files[0] || '';
    if (fil?.name?.lastIndexOf('.xls') > 0 || fil?.name?.lastIndexOf('.xlsx') > 0) {
      setFile(fil);
    } else {
      setFile(null);
      fileRef.current.value = null;
      setAlert(
        'error',
        'Only excel file is acceptable either with .xls or .xlsx extension'
      );
    }
  };

  useEffect(() => {
    fetchUserAccessQuiz()
    console.log("hittttt");
  },[])
  const fetchUserAccessQuiz = () => {
    axiosInstance
    .get(`${endpoints.academics.checkQuizUser}`)
    .then((res) => {
      console.log(res);
      setQuizAccess(res.data.result)
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const { token: TOKEN = '' } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const excelDownload = (data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'upload_mark_status.xls');
  };

  const uploadMarks = () => {
    if (!file) {
      setAlert('warning', 'Please select file');
    }
    const data = new FormData();
    data.append('file', file);
    if (file) {
      setLoading(true);
      axiosInstance
        .post(`${endpoints.assessment.bulkUploadMarks}`, data)
        .then((result) => {
          setLoading(false);
          if (result?.status === 200) {
            setAlert('success', 'File successfully uploaded');
            excelDownload(result.data);
          } else {
            setAlert('error', result?.error);
          }
          fileRef.current.value = null;
          setFile(null);
        })
        .catch((error) => {
          setAlert('error', error?.response?.data?.error);
          fileRef.current.value = null;
          setFile(null);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleDateChange = (value) => {
    if (value) {
      formik.setFieldValue('date', value);
    }
  };

  const [addedId, setAddedId] = useState([]);

  const selectAssetmentCard = (id, checked) => {
    if (checked) {
      setAddedId([...addedId, id]);
    } else {
      const previousArr = [...addedId]
      const index = addedId.indexOf(id);
      previousArr.splice(index, 1);
      setAddedId(previousArr);
    }
  }


  const handleSectionToggle = (event) => {
    setSectionToggle(event.target.checked);
    formik.setFieldValue('section', []);
    formRef.current.setFieldsValue({
      section : [],
      group : ''
    })
    formik.setFieldValue('group', '');
  };

  const filterbasedonsub = (subjectid) => {
    let filtereddata = filteredAssesmentTests?.filter((data) => addedId?.includes(data?.id))
    let newfiltered = filtereddata?.map((id) => id?.subjects[0])
    // newfiltered.includes(subjectid)
    return newfiltered.includes(subjectid)
  }

  const reportLoad = (e , v) => {
    console.log(e , v);
    setLoading(e)
  }

  const branchOptions = branchDropdown?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = grades?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  const subjectOptions = subjects?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });
  const assessmentTypeoption = assesmentTypes.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.exam_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const groupOptions = groupList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.group_name}
      </Option>
    );
  });

  const statusOption = statuses?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.name}
      </Option>
    );
  });

  // let newid = filterbasedonsub()

  return (
    <Layout>
      {loading && <Loader />}
      {/* <div
        className='assesment-container assessment-ques'
        style={{
          background: 'white',
          height: '90vh',
          overflowX: 'hidden',
          overflowY: 'scroll',
        }}
      > */}
      <div className='row py-3 px-2 th-bg-grey'>
        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-black-1 th-18'>Create Test</Breadcrumb.Item>
            {/* <Breadcrumb.Item className='th-black-1 th-18'>
                Question Bank
              </Breadcrumb.Item> */}
          </Breadcrumb>
        </div>
      </div>
      <div className='th-bg-white py-0 mx-3'>
      <div className='row'>
        <div className='col-12 py-3'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
            <div className='col-md-2 col-6 pl-0'>
                  <div className='mb-2 text-left'>Status</div>
                  <Form.Item name='status'>
                    <Select
                      allowClear
                      placeholder={
                        // subjectName ? (
                        //   <span className='th-black-1'>{subjectName}</span>
                        // ) : (
                        //   'Select Subject'
                        // )
                        'Select Status'
                      }
                      showSearch
                      optionFilterProp='children'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      // defaultValue={subjectName}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        formik.setFieldValue('status', value);
                      }}
                      // onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {statusOption}
                    </Select>
                  </Form.Item>
                </div>
              <div className='col-md-2 col-6'>
                <div className='mb-2 text-left'>Branch</div>
                <Form.Item name='branch'>
                  <Select
                    allowClear
                    placeholder= 'Select Branch'                   
                    mode='multiple'
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    maxTagCount={2}
                    showArrow={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={formik.values.branch || []}
                    onChange={(e, value) => {
                      handleBranch(e, value);
                    }}
                    // onClear={handleClearBoard}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
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
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleGrade(e, value);
                    }}
                    // onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-6'>
                <div className='mb-2 text-left'>Subject</div>
                <Form.Item name='subject'>
                  <Select
                    allowClear
                    mode='multiple'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    maxTagCount={2}
                    showArrow={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    placeholder={
                      // subjectName ? (
                      //   <span className='th-black-1'>{subjectName}</span>
                      // ) : (
                      //   'Select Subject'
                      // )
                      'Select Subject'
                    }
                    showSearch
                    optionFilterProp='children'
                    // defaultValue={subjectName}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleSubject(e, value);
                    }}
                    // onClear={handleClearSubject}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {subjectOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-6 px-0'>
                  <div className='mb-2 ml-1 text-left'>Date Range</div>
                  <Form.Item name='date'>
                    <Space direction='vertical' size={12}>
                      <RangePicker
                        allowClear={false}
                        style={{width:'105%', border:'none'}}
                        bordered={true}
                        placement='bottomRight'
                        showToday={false}
                        suffixIcon={<DownOutlined />}
                        // defaultValue={[moment(), moment()]}
                        value={formik?.values.date}
                        onChange={(value) => handleDateChange(value)}
                        className='th-range-picker th-br-4 th-bg-grey'
                        separator={'-'}
                        format={'DD/MM/YYYY'}
                        getPopupContainer={(trigger) => trigger.parentNode}
                      />
                    </Space>
                    
                  </Form.Item>
                </div>
              <div className='col-md-2 d-flex mt-2 pr-1'>
              {!handleClose && <div
                className='col-md-5 col-6 ml-2'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                 <Button
                  // type='primary'
                  onClick={() => history.push('/create-assesment?clear=true')}
                  // style={{ width: '30%' }}
                  // shape='round'
                  className='th-br-6 th-button-active ml-3'
                >
                  Create
                </Button>

              </div>}
              {/* {handleClose && <div
                className='col-md-8 col-6 px-0'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                 <Button
                  // type='primary'
                  onClick={() => {
                  handleColumnSelectedTestChange(addedId)
                  handleClose()}}
                  // style={{ width: '30%' }}
                  // shape='round'
                  className='th-br-6 th-button'
                >
                  Back
                </Button>

              </div>} */}
              <div className='col-md-7 hideShowFilterIcon text-right pr-0'>
                {/* <IconButton onClick={() => setShowfilter(!showFilter)}>
                  <SvgIcon
                    component={() => (
                      <img
                        style={{ height: '20px', width: '25px' }}
                        src={showFilter ? hidefilter : showfilter}
                      />
                    )}
                  />
                </IconButton> */}
                {showFilter && <span onClick={() => setShowfilter(!showFilter)} style={{color : 'blue' , cursor:'pointer' , borderBottom : '1px solid'}}>Close</span>}
                {!showFilter && <span onClick={() => setShowfilter(!showFilter)} style={{color : 'blue' , cursor:'pointer' , borderBottom : '1px solid'}}> More Filters</span>}

                
              </div>
              </div>
            </div>
            {showFilter && (
              <div className='row align-items-center mt-2'>
                <div className='col-md-2 col-6 pl-0'>
                  <div className='mb-2 text-left'>Assesment Type</div>
                  <Form.Item name='assessmentType'>
                    <Select
                      allowClear
                      placeholder='Select Type'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      // options={branchDropdown.map(item => ({
                      //   value: item,
                      //   label: item?.branch?.branch_name,
                      // }))}
                      // value={formik.values.branch || []}
                      onChange={(e, value) => {
                        formik.setFieldValue('assesment_type', value);
                      }}
                      // onClear={handleClearBoard}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {assessmentTypeoption}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 d-flex'>
                  <Typography className='d-flex align-items-center'>Section</Typography>
                  <div className='d-flex align-items-center'>
                    <Switch onChange={handleSectionToggle} checked={sectionToggle} />
                  </div>
                  <Typography className='d-flex align-items-center'>Group</Typography>
                </div>
                {!sectionToggle ? (
                  <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                    <div className='mb-2 text-left'>Section</div>
                    <Form.Item name='section'>
                      <Select
                        allowClear
                        mode='multiple'
                        placeholder={
                          // subjectName ? (
                          //   <span className='th-black-1'>{subjectName}</span>
                          // ) : (
                          //   'Select Subject'
                          // )
                          'Select Section'
                        }
                        value={formik.values.section || []}
                        showSearch
                        optionFilterProp='children'
                        // defaultValue={subjectName}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e, value) => {
                          handleSection(e, value);
                        }}
                        // onClear={handleClearSubject}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={false}
                      >
                        {sectionOptions}
                      </Select>
                    </Form.Item>
                  </div>
                ) : (
                  <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                    <div className='mb-2 text-left'>Group</div>
                    <Form.Item name='group'>
                      <Select
                        allowClear
                        placeholder={
                          // subjectName ? (
                          //   <span className='th-black-1'>{subjectName}</span>
                          // ) : (
                          //   'Select Subject'
                          // )
                          'Select Group'
                        }
                        showSearch
                        optionFilterProp='children'
                        // defaultValue={subjectName}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e, value) => {
                          handleGroup(e, value);
                        }}
                        // onClear={handleClearSubject}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={false}
                      >
                        {groupOptions}
                      </Select>
                    </Form.Item>
                  </div>
                )}
                
              </div>
            )}
          </Form>
        </div>
      </div>
      <div className='row '>
        <div className='col-md-1 col-6'>
          <Button
            className={`${
              activeTab == 'all' ? 'th-button-active' : 'th-button'
            } th-width-100 th-br-6 mt-2`}
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
        </div>
        <div className='col-md-2 col-6'>
          <Button
            className={`${
              activeTab == 'online-pattern' ? 'th-button-active' : 'th-button'
            } th-width-100 th-br-6 mt-2`}
            onClick={() => setActiveTab('online-pattern')}
          >
            Online
          </Button>
        </div>
        <div className='col-md-2 col-6'>
          <Button
            className={`${
              activeTab == 'physical-test' ? 'th-button-active' : 'th-button'
            } th-width-100 th-br-6 mt-2`}
            onClick={() => setActiveTab('physical-test')}
          >
            Offline
          </Button>
        </div>
        {!handleClose && checkDel &&  <div className='col-md-2 col-6'>
          <Button
            className={`${
              activeTab == 'deleted' ? 'th-button-active' : 'th-button'
            } th-width-100 th-br-6 mt-2`}
            onClick={() => setActiveTab('deleted')}
          >
            Deleted
          </Button>
        </div>}
        {handleClose && addedId.length > 0 && <div className='col-md-2 col-6 d-flex justify-content-end align-items-end'>
        <h6 className=' mt-2'>Total Selected: {addedId.length}</h6>
        </div>}
        {handleClose && addedId.length > 0 && <div className='col-md-2 col-6'>
        <Button
            className={'th-br-6 th-button th-width-100 mt-2'}
            startIcon={<AddIcon style={{ fontSize: '30px' }} />}
            onClick={() => {
              handleColumnSelectedTestChange(addedId);
              handleClose();
            }}
          >
            Add Selected
          </Button>
        </div>}
{(isSuperAdmin || isSuperuser) && !handleClose && (
  <>
  <div className='col-md-2'>
    <FormControlLabel
      control={
        <Checkbox
          checked={bulkUpload}
          onChange={() => setBulkUpload(!bulkUpload)}
          name='checked'
          color='primary'
        />
      }
      label={<Typography color='secondary'>Upload Marks</Typography>}
    />
  </div>
  <div className='col-md-5'>
    <div className = 'row'>
  {bulkUpload ? (
    <div className='col-md-7 th-12'>
      <Input
        type='file'
        inputRef={fileRef}
        className='th-18'
        inputProps={{ accept: '.xlsx,.xls' }}
        onChange={handleFileChange}
      />
      <div>Accepted Files : [.xlsx,.xls] files</div>
      <Box display='flex' flexDirection='row' style={{ color: 'gray' }}>
        <Box p={1}>
          {`Download Format: `}
          <a
            style={{ cursor: 'pointer' }}
            href='assets/download-format/Response.xlsx'
            download='format.xlsx'
          >
            Download format
          </a>
        </Box>
      </Box>
    </div>
  ) : (
    <div></div>
  )}
   {bulkUpload && <div className='col-md-5'>
      <Button
        variant='contained'
        color='primary'
        onClick={() => uploadMarks()}
        className='th-button-active th-width-100 th-br-6 mt-2'
      >
        Upload
      </Button>
   </div>}
   </div>
   </div>
</>
)}

      </div>
<hr/>
      <div className='row mt-2 py-2'>
        {results.length === 0 ? (
          <div className='row justify-content-center my-5'>
            <img src={NoDataIcon} />
          </div>
        ) : (
          <div className='row '>
            <Grid container>
              {results.map((test) => (
                <Grid item md={4} className='p-1'>
                  <AssesmentCard
                    value={test}
                    onEdit={() => {}}
                    onClick={handleSelectTest}
                    isSelected={selectedAssesmentTest?.id === test.id}
                    filterResults={filterResults}
                    activeTab={activeTab}
                    addedId={addedId}
                    selectAssetmentCard={selectAssetmentCard}
                    handleClose={handleClose}
                    filteredAssesmentTests={filteredAssesmentTests}
                    // isdisable= {let newid= filterbasedonsub() } newid.includes(test.subject[0])
                    filterbasedonsub={filterbasedonsub}
                    isdisable={filterbasedonsub(test?.subjects[0])}
                    checkDel={checkDel}
                  />
                </Grid>
              ))}
            </Grid>
            {selectedAssesmentTest && (
              <Grid item md={4}>
                <AssesmentDetails
                  test={selectedAssesmentTest}
                  onClose={() => {
                    setSelectedAssesmentTest(null);
                  }}
                  filterData={filterData}
                  handleClose={handleClose}
                  reportLoad={reportLoad}
                  quizAccess={quizAccess}
                  userLevel={userLevel}
                />
              </Grid>
            )}
          </div>
        )}
      </div>
      </div>
      <div className='pagination-container d-flex justify-content-center'>
          <Pagination
            page={showFilteredList ? filteredAssesmentTestsPage : assesmentTestsPage}
            count={
              showFilteredList ? filteredAssesmentTestsTotalPage : assesmentTestsTotalPage
            }
            color='secondary'
            onChange={(e, page) => handleAssesmentTestsPageChange(page)}
          />
        </div>
      {/* </div> */}
      
    </Layout>
  );
};

export default Assesment;
