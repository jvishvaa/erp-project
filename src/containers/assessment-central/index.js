import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  Divider,
  Tabs,
  Tab,
  Paper,
  Button,
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
  Switch
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
import Loader from './../../components/loader/loader'
import FileSaver from 'file-saver';
import axiosInstance from './../../config/axios';

const useStyles = makeStyles({
  tabsFlexContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    overflow: 'auto',
  },
});

const statuses = [
  { id: 1, name: 'Upcoming' },
  { id: 2, name: 'Completed' },
];

const Assesment = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const fileRef = useRef()

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
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [bulkUpload, setBulkUpload] = useState(false);
  const [file, setFile] = useState(null);
  const isSuperuser = JSON.parse(localStorage.getItem('userDetails'))?.is_superuser ;
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level || {};
  const isSuperAdmin = userLevel === 1
  console.log('super','orchids',isSuperAdmin,isSuperuser)
  const [loading,setLoading] = useState(false)
  const [gradeId,setGradeId] = useState('')
  const [selectedBranchId,setSelectedBranchId] = useState([])
  const [sectionToggle,setSectionToggle] = useState(false)
  const [sectionList,setSectionList] = useState([])
  const [sectionFlag,setSectionFlag] = useState(false)
  const [groupList,setGroupList] = useState([])
  const [groupFlag,setGroupFlag] = useState(false)

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
      date: [moment().startOf('isoWeek'), moment().endOf('week')],
      branch: [],
      academic: selectedAcademicYear,
      grade: '',
      subject: [],
      assesment_type: '',
      section : [],
      group : ''
    },
    onSubmit: (values) => {
      filterResults(1);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

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

  const getBranch = async (acadId) => {
    try {
      setBranchDropdown([]);
      setGrades([]);
      setSubjects([]);
      const data = await fetchBranches(acadId, moduleId);
      setBranchDropdown(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch branch');
    }
  };

  const getGrades = async (acadId, branchId) => {
    try {
      setGrades([]);
      setSubjects([]);
      const data = await fetchGrades(acadId, branchId, moduleId);
      setGrades(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch grades');
    }
  };

  const getSubjects = async (acadSessionIds, mappingId) => {
    try {
      setSubjects([]);
      const data = await fetchSubjects(acadSessionIds, mappingId);
      setSubjects(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch subjects');
    }
  };

  const getAssesmentTypes = async () => {
    try {
      const data = await fetchAssesmentTypes();
      setAssesmentTypes(data);
    } catch (e) {}
  };
  let filterData1 = [];
  const filterResults = async (page) => {
    const {
      branch = [],
      grade,
      subject,
      assesment_type: assesmentType,
      date,
      status,
      section,
      group
    } = formik.values;
    console.log(formik.values);
    filterData1 = {
      branch : formik.values.branch,
      grade : formik.values.grade,
      subject: formik.values.subject,
    }
    console.log(filterData1);
    setFilterData(filterData1)
    // const acadSessionId = branch?.id;
    const acadSessionIds = branch.map((element) => element?.id) || [];
    const subjectIds = subject.map(({ subject_id }) => subject_id);
    const sectionMappingIds = section.map((i)=>i?.id)
    const groupIds = group?.id
    try {
      setFetchingTests(true);
      const { results, totalPages } = await fetchAssesmentTests(
        false,
        activeTab,
        acadSessionIds,
        grade?.grade_id,
        subjectIds,
        assesmentType.id,
        status.id,
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
    } catch (e) {
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

  useEffect(() => {
    if (formik.values.academic) {
      getBranch(formik.values.academic?.id);
      if (formik.values.branch.length) {
        const branchIds =
          formik.values.branch.map((element) => element?.branch?.id) || [];
          setSelectedBranchId(branchIds)
        getGrades(formik.values.academic?.id, branchIds);
        if (formik.values.grade) {
          const acadSessionIds = formik.values.branch.map((element) => element?.id) || [];
          getSubjects(acadSessionIds, formik.values.grade?.grade_id);
        } else {
          setSubjects([]);
        }
      } else {
        setGrades([]);
      }
    } else {
      setBranchDropdown([]);
    }
  }, []);

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
    if (showFilteredList) {
      setFilteredAssesmentTestPage(1);
      setSelectedAssesmentTest(null);
      filterResults(1); // reseting the page
    }
    // clearResults();
  }, [activeTab]);

  useEffect(() => {
    if (formik.values.status?.name === 'Upcoming') {
      formik.setFieldValue('date', [moment(), moment().add(6, 'days')]);
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

  const handleFilterAssessment = () => {
    if (!formik?.values?.status) {
      setAlert('error', 'Select Status');
      return;
    }
    if (!formik?.values?.academic) {
      setAlert('error', 'Select Academic Year');
      return;
    }
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
    if (!formik?.values?.assesment_type) {
      setAlert('error', 'Select Assessment Type');
      return;
    }
    formik.handleSubmit();
  };

  const handleAcademicYear = (event = {}, value = '') => {
    formik.setFieldValue('academic', '');
    if (value) {
      getBranch(value?.id);
      formik.setFieldValue('academic', value);
    }
  };

  const handleBranch = (event, value) => {
    formik.setFieldValue('branch', []);
    formik.setFieldValue('grade', []);
    formik.setFieldValue('subject', []);
    formik.setFieldValue('section', []);
    formik.setFieldValue('group', '');
    setSectionList([])
    setGroupList([]) 
    if (value.length > 0) {
      const branchIds = value?.map((element) => element?.branch?.id) || [];
      getGrades(formik.values.academic?.id, branchIds);
      formik.setFieldValue('branch', value);
    }
  };

  const fetchSection =  (acadSessionId,branchId,gradeId,moduleId) => {
      axiosInstance.get(
        `${endpoints.academics.sections}?session_year=${
          acadSessionId
        }&branch_id=${branchId}&grade_id=${gradeId}&module_id=${moduleId}`
      ).then((res)=>{
        if (res?.data?.status_code === 200) {
          const transformData = res?.data?.data.map((item) => ({
            section_id: item.section_id,
            section__section_name: item.section__section_name,
            id: item.id,
          }));
          transformData.unshift({
            section_id: 'all',
            section__section_name: 'Select All',
            id: 'section_mapping_id',
          });
          setSectionList(transformData);
        }
      })  
  };

  const handleSection = (e, value) => {
    formik.setFieldValue('section',[])
    setSectionFlag(false)
    if (value.length) {
      value =
        value.filter(({ section_id }) => section_id === 'all').length === 1
          ? [...sectionList].filter(({ section_id }) => section_id !== 'all')
          : value;
        formik.setFieldValue('section',value)
        setSectionFlag(true)
    } 
  };

  const fetchGroupList = (acadId, grade) => {
    axiosInstance
      .get(
        `${
          endpoints.assessmentErp.getGroups
        }?acad_session=${acadId}&grade=${grade}&is_active=${true}&group_type=${1}`
      )
      .then((result) => {
        if (result?.status === 200) {
          setGroupList(result?.data);
        }
      });
  };

  const handleGroup = (e, value) => {
    setGroupFlag(false)
    formik.setFieldValue('group','')
    formik.setFieldValue('section', []);
    formik.setFieldValue('group', '');
    if (value) {
      const sections = value?.group_section_mapping.map((i)=>i?.section_mapping_id)
      formik.setFieldValue('group',value)
      setGroupFlag(true)
    }
  };

  const handleGrade = (event, value) => {
    formik.setFieldValue('grade', []);
    formik.setFieldValue('subject', []);
    formik.setFieldValue('section', []);
    formik.setFieldValue('group', '');
    setSectionList([])
    setGroupList([]) 
    if (value) {
      const acadSessionIds = formik.values.branch.map((element) => element?.id) || [];
      getSubjects(acadSessionIds, value?.grade_id);
      formik.setFieldValue('grade', value);
      const branchIds = formik?.values?.branch.map((i)=>i?.branch?.id)
      const sectionData = fetchSection(selectedAcademicYear?.id,branchIds,value?.grade_id,moduleId)
      setSectionList(sectionData)
      const groupData = fetchGroupList(acadSessionIds,value?.grade_id)
      setGroupList(groupData)
    }
  };

  const handleSubject = (event, value) => {
    formik.setFieldValue('subject', []);
    if (value) {
      formik.setFieldValue('subject', value);
    }
  };

  const handleClearAll =(event,value) =>{
    formik.handleReset();
    setFilteredAssesmentTests([]);
    setFilteredAssesmentTestsTotalPage(0);
    setFilteredAssesmentTestPage(1);
  }

  const handleFileChange = (event) => {
    const { files } = event.target || {};
    const fil = files[0] || '';
    if (fil?.name?.lastIndexOf('.xls') > 0 || fil?.name?.lastIndexOf('.xlsx') > 0) {
      setFile(fil);
    } else {
      setFile(null);
      fileRef.current.value = null
      setAlert(
        'error',
        'Only excel file is acceptable either with .xls or .xlsx extension'
      );
    }
  };

  const { token: TOKEN = '' } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const excelDownload = (data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, 'upload_mark_status.xls');
  }

  const uploadMarks = () => {
    const data = new FormData();
    data.append('file', file);
    if (file) {
      setLoading(true)
      axiosInstance
        .post(`${endpoints.assessment.bulkUploadMarks}`, data)
        .then((result) => {
          setLoading(false)
          if(result?.status === 200){
            setAlert('success','File successfully uploaded')
            excelDownload(result.data)
            fileRef.current.value = null
            setFile(null)
          }else{
            setAlert('error',result?.error)
            fileRef.current.value = null
            setFile(null)
          }
        }).catch((error)=>{setAlert('error',error?.response?.data?.error)})
        .finally(()=>setLoading(false));
    }
    if(!file){
      setAlert('warning','Please select file')
    }
  };

  const handleSectionToggle = (event) => {
    setSectionToggle(event.target.checked);
    formik.setFieldValue('section', []);
    formik.setFieldValue('group', '');
  };
  return (
    <Layout>
      {loading && <Loader />}
      <div className='assesment-container'>
        <div
          className='lesson-plan-breadcrumb-wrapper'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <CommonBreadcrumbs componentName='Create Test' isAcademicYearVisible={true} />
          <div>
            {!expandFilter ? (
              <IconButton
                onClick={() => {
                  setExpandFilter(true);
                }}
              >
                <Typography
                  component='h4'
                  color='secondary'
                  style={{ marginRight: '5px' }}
                >
                  Expand Filter
                </Typography>
                <FilterListIcon color='secondary' />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setExpandFilter(false);
                }}
              >
                <Typography
                  component='h4'
                  color='secondary'
                  style={{ marginRight: '5px' }}
                >
                  Close Filter
                </Typography>
                <FilterListIcon color='secondary' />
              </IconButton>
            )}
          </div>
        </div>
        <div className='content-container'>
          <Accordion
            className='collapsible-section'
            square
            expanded={expandFilter}
            onChange={() => {}}
          >
            <AccordionSummary></AccordionSummary>
            <AccordionDetails>
              <div className='form-grid-container mv-20' style={{ marginTop: '-50px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant='outlined'>
                      <Autocomplete
                        id='status'
                        name='status'
                        className='dropdownIcon'
                        onChange={(e, value) => {
                          formik.setFieldValue('status', value);
                        }}
                        value={formik.values.status}
                        options={statuses}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Status'
                            placeholder='Status'
                          />
                        )}
                        size='small'
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.status ? formik.errors.status : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3} className='dateRangeSelector'>
                    <FormControl fullWidth variant='outlined'>
                      <DateRangeSelector
                        value={formik.values.date}
                        onChange={(value) => {
                          formik.setFieldValue('date', value);
                          setDatePickerOpen(false);
                        }}
                        open={datePickerOpen}
                        onClick={() => setDatePickerOpen(true)}
                        minDate={minDate}
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.status ? formik.errors.status : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant='outlined'>
                      <Autocomplete
                        id='academic'
                        name='academic'
                        className='dropdownIcon'
                        onChange={handleAcademicYear}
                        value={formik.values.academic}
                        options={academicDropdown}
                        getOptionLabel={(option) => option?.session_year || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Academic Year'
                            placeholder='Academic Year'
                          />
                        )}
                        size='small'
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.academic ? formik.errors.academic : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant='outlined'>
                      <Autocomplete
                        id='branch'
                        name='branch'
                        className='dropdownIcon'
                        onChange={handleBranch}
                        multiple
                        value={formik.values.branch || []}
                        options={branchDropdown || []}
                        getOptionLabel={(option) => option?.branch?.branch_name || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Branch'
                            placeholder='Branch'
                          />
                        )}
                        size='small'
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.branch ? formik.errors.branch : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant='outlined'>
                      <Autocomplete
                        id='grade'
                        name='grade'
                        className='dropdownIcon'
                        onChange={handleGrade}
                        value={formik.values.grade || ''}
                        options={grades || []}
                        getOptionLabel={(option) => option?.grade__grade_name || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Grade'
                            placeholder='Grade'
                          />
                        )}
                        size='small'
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.grade ? formik.errors.grade : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant='outlined'>
                      <Autocomplete
                        id='subject'
                        name='subject'
                        onChange={handleSubject}
                        multiple
                        className='dropdownIcon'
                        value={formik.values.subject || ''}
                        options={subjects || []}
                        getOptionLabel={(option) => option?.subject_name || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Subject'
                            placeholder='Subject'
                          />
                        )}
                        size='small'
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.subject ? formik.errors.subject : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant='outlined'>
                      <Autocomplete
                        id='assesment_type'
                        name='assesment_type'
                        className='dropdownIcon'
                        onChange={(e, value) => {
                          formik.setFieldValue('assesment_type', value);
                        }}
                        value={formik.values.assesment_type || ''}
                        options={assesmentTypes || []}
                        getOptionLabel={(option) => option.exam_name || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Assessment Type'
                            placeholder='Assessment Type'
                          />
                        )}
                        size='small'
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.assesment_type ? formik.errors.assesment_type : ''}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    container
                    alignItems='center'
                    justifyContent='center'
                    xs={12}
                    md={3}
                  >
                    <Typography>Section</Typography>
                    <Switch
                      checked={sectionToggle}
                      onChange={handleSectionToggle}
                      color='default'
                      inputProps={{ 'aria-label': 'checkbox with default color' }}
                    />
                    <Typography>Group</Typography>
                  </Grid>
                  {!sectionToggle ? (
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth variant='outlined'>
                        <Autocomplete
                          id='section_name'
                          name='section_name'
                          multiple
                          limitTags={2}
                          className='dropdownIcon'
                          onChange={handleSection}
                          value={formik.values.section || []}
                          options={sectionList || []}
                          getOptionLabel={(option) => option?.section__section_name || ''}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant='outlined'
                              label='Section'
                              placeholder='Section'
                            />
                          )}
                          size='small'
                        />
                        {/* <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.assesment_type ? formik.errors.assesment_type : ''}
                      </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth variant='outlined'>
                          <Autocomplete
                            id='Group'
                            name='group'
                            // multiple
                            // limitTags={2}
                            className='dropdownIcon'
                            onChange={handleGroup}
                            value={formik?.values?.group || []}
                            options={groupList || []}
                            getOptionLabel={(option) => option?.group_name || ''}
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant='outlined'
                                label='Group'
                                placeholder='Group'
                              />
                            )}
                            size='small'
                          />
                        {/* <FormHelperText style={{ color: 'red' }}>
                        {formik.errors.assesment_type ? formik.errors.assesment_type : ''}
                      </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>
          <div className='divider-container'>
            <Divider />
          </div>

          <div className='form-actions-container mv-20'>
            <Grid container spacing={2}>
              <Grid item md={2} xs={6}>
                <div className='btn-container'>
                  <Button
                    style={{ width: '100%' }}
                    variant='contained'
                    className='cancelButton labelColor'
                    onClick={() => {
                      handleClearAll();
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </Grid>
              <Grid item md={2} xs={6}>
                <div className='btn-container with-border'>
                  <Button
                    style={{ width: '100%', color: 'white' }}
                    variant='contained'
                    color='primary'
                    size='medium'
                    onClick={() => {
                      handleFilterAssessment();
                    }}
                  >
                    Filter
                  </Button>
                </div>
              </Grid>
              <Grid item md={2} xs={6}>
                <div className='btn-container'>
                  <Button
                    style={{ width: '100%', color: 'white' }}
                    variant='contained'
                    startIcon={<AddIcon style={{ fontSize: '30px' }} />}
                    color='primary'
                    size='medium'
                    onClick={() => {
                      history.push('/create-assesment?clear=true');
                    }}
                  >
                    Create New
                  </Button>
                </div>
              </Grid>
              {(isSuperAdmin || isSuperuser) &&  <Grid item container md={6} xs={6} justifyContent='flex-end'>
                <div className='btn-container'>
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

                {bulkUpload ? (
                  <div>
                    <Input
                      type='file'
                      inputRef={fileRef}
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
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => uploadMarks()}
                      style={{marginLeft:'22%'}}
                    >
                      Upload
                    </Button>
                  </div>
                ) : (
                  <div></div>
                )}
              </Grid>}
            </Grid>
          </div>
          <div className='tabs-container'>
            <Paper square style={{ boxShadow: 'none' }}>
              <Grid
                container
                spacing={2}
                alignItems='center'
                justify='space-between'
                style={{ backgroundColor: '#fafafa' }}
              >
                <Grid item md={11} xs={12} style={{ alignItems: 'right' }}>
                  <Tabs
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={(event, value) => {
                      setActiveTab(value);
                    }}
                    aria-label='disabled tabs example'
                    value={activeTab}
                    classes={{
                      flexContainer: classes.tabsFlexContainer,
                    }}
                    textColor='secondary'
                    indicatorColor='secondary'
                  >
                    <Tab label='All' value='all' className='right-border' />
                    <Tab
                      // label='Physical Test'
                      label='Offline Test'
                      value='physical-test'
                      className='right-border'
                      icon={<img className='info-icon' src={infoIcon} alt='info' />}
                    />
                    <Tab
                      // label='Online Pattern'
                      label='Online Test'
                      value='online-pattern'
                      icon={<img className='info-icon' src={infoIcon} alt='info' />}
                    />
                  </Tabs>
                </Grid>
              </Grid>
              <TabPanel name='all' value={activeTab}>
                <div className='list-grid-outer-container'>
                  <Grid container>
                    <Grid item md={selectedAssesmentTest ? 8 : 12}>
                      <div className='list-container'>
                        {fetchingTests && (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                          </div>
                        )}
                        {results.length === 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}
                            >
                              <img src={unfiltered} alt='placeholder' />
                              <p className='select-filter-text'>
                                Please select the filter to display reports
                              </p>
                            </div>
                          </div>
                        )}
                        {results.length > 0 && (
                          <Grid container>
                            {results.map((test) => (
                              <Grid item md={selectedAssesmentTest ? 6 : 4}>
                                <AssesmentCard
                                  value={test}
                                  onEdit={() => {}}
                                  onClick={handleSelectTest}
                                  isSelected={selectedAssesmentTest?.id === test.id}
                                  filterResults={filterResults}
                                  activeTab={activeTab}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </div>
                    </Grid>
                    {selectedAssesmentTest && (
                      <Grid item md={4}>
                        <AssesmentDetails
                          test={selectedAssesmentTest}
                          onClose={() => {
                            setSelectedAssesmentTest(null);
                          }}
                          filterData={filterData}
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
              </TabPanel>
              <TabPanel name='physical-test' value={activeTab}>
                <div className='list-grid-outer-container'>
                  <Grid container>
                    <Grid item md={selectedAssesmentTest ? 8 : 12}>
                      <div className='list-container'>
                        {fetchingTests && (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                          </div>
                        )}
                        {results?.length === 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}
                            >
                              <img src={unfiltered} alt='placeholder' />
                              <p className='select-filter-text'>
                                Please select the filter to display reports
                              </p>
                            </div>
                          </div>
                        )}
                        {results?.length > 0 && (
                          <Grid container>
                            {results.map((test) => (
                              <Grid item md={selectedAssesmentTest ? 6 : 4}>
                                <AssesmentCard
                                  value={test}
                                  onEdit={() => {}}
                                  onClick={handleSelectTest}
                                  isSelected={selectedAssesmentTest?.id === test.id}
                                  filterResults={filterResults}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </div>
                    </Grid>
                    {selectedAssesmentTest && (
                      <Grid item md={4}>
                        <AssesmentDetails
                          test={selectedAssesmentTest}
                          onClose={() => {
                            setSelectedAssesmentTest(null);
                          }}
                          filterData={filterData}
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
              </TabPanel>
              <TabPanel name='online-pattern' value={activeTab}>
                <div className='list-grid-outer-container'>
                  <Grid container>
                    <Grid item md={selectedAssesmentTest ? 8 : 12}>
                      <div className='list-container'>
                        {fetchingTests && (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                          </div>
                        )}
                        {results?.length === 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}
                            >
                              <img src={unfiltered} alt='placeholder' />
                              <p className='select-filter-text'>
                                Please select the filter to display reports
                              </p>
                            </div>
                          </div>
                        )}
                        {results.length > 0 && (
                          <Grid container>
                            {results.map((test) => (
                              <Grid item md={selectedAssesmentTest ? 6 : 4}>
                                <AssesmentCard
                                  value={test}
                                  onEdit={() => {}}
                                  onClick={handleSelectTest}
                                  isSelected={selectedAssesmentTest?.id === test.id}
                                  filterResults={filterResults}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </div>
                    </Grid>
                    {selectedAssesmentTest && (
                      <Grid item md={4}>
                        <AssesmentDetails
                          test={selectedAssesmentTest}
                          onClose={() => {
                            setSelectedAssesmentTest(null);
                          }}
                          filterData={filterData1}
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
              </TabPanel>
            </Paper>
          </div>
        </div>
        <div className='pagination-container'>
          <Pagination
            page={showFilteredList ? filteredAssesmentTestsPage : assesmentTestsPage}
            count={
              showFilteredList ? filteredAssesmentTestsTotalPage : assesmentTestsTotalPage
            }
            color='secondary'
            onChange={(e, page) => handleAssesmentTestsPageChange(page)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Assesment;
