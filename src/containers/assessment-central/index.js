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
} from '@material-ui/core';
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

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

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
      academic: '',
      grade: '',
      subject: [],
      assesment_type: '',
    },
    onSubmit: (values) => {
      filterResults(1);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const getAcademic = async () => {
    try {
      setAcademicDropdown([]);
      setBranchDropdown([]);
      setGrades([]);
      setSubjects([]);
      const data = await fetchAcademicYears(moduleId);
      handleAcademicYear({}, data[0]);
      setAcademicDropdown(data);
    } catch (e) {
      setAlert('error', 'Failed to fetch academic');
    }
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

  const filterResults = async (page) => {
    const {
      branch = [],
      grade,
      subject,
      assesment_type: assesmentType,
      date,
      status,
    } = formik.values;
    // const acadSessionId = branch?.id;
    const acadSessionIds = branch.map((element) => element?.id) || [];
    const subjectIds = subject.map(({ subject_id }) => subject_id);
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
        9
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
      if (formik.values.branch) {
        const branchIds =
          formik.values.branch.map((element) => element?.branch?.id) || [];
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
    if (moduleId) {
      getAcademic();
    }
    getAssesmentTypes();
  }, [moduleId]);

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
    if (value.length > 0) {
      const branchIds = value?.map((element) => element?.branch?.id) || [];
      getGrades(formik.values.academic?.id, branchIds);
      formik.setFieldValue('branch', value);
    }
  };

  const handleGrade = (event, value) => {
    formik.setFieldValue('grade', '');
    if (value) {
      const acadSessionIds = formik.values.branch.map((element) => element?.id) || [];
      getSubjects(acadSessionIds, value?.grade_id);
      formik.setFieldValue('grade', value);
    }
  };

  const handleSubject = (event, value) => {
    formik.setFieldValue('subject', '');
    if (value) {
      formik.setFieldValue('subject', value);
    }
  };

  return (
    <Layout>
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
                  <Grid item xs={12} md={3}>
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
                  </Grid>
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
                    style={{ borderRadius: '10px' }}
                    variant='contained'
                    className='disabled-btn'
                    onClick={() => {
                      formik.handleReset();
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </Grid>
              <Grid item md={2} xs={6}>
                <div className='btn-container with-border'>
                  <Button
                    style={{ borderRadius: '10px' }}
                    variant='contained'
                    className=''
                    color='primary'
                    onClick={() => {
                      handleFilterAssessment();
                    }}
                  >
                    FILTER
                  </Button>
                  <div className='border-line-container'>
                    <div className='line' />
                  </div>
                </div>
              </Grid>
              {/* <Grid item md={2} xs={6}>
                <div className='btn-container'>
                  <Button
                    variant='contained'
                    style={{ borderRadius: '10px' }}
                    className='disabled-btn'
                    onClick={() => history.push('/assessment-reports')}
                  >
                    REPORTS
                  </Button>
                </div>
              </Grid> */}
              <Grid item md={2} xs={6}>
                <div className='btn-container'>
                  <Button
                    style={{ borderRadius: '10px' }}
                    variant='contained'
                    className=''
                    startIcon={<AddIcon />}
                    color='primary'
                    onClick={() => {
                      history.push('/create-assesment?clear=true');
                    }}
                  >
                    CREATE NEW
                  </Button>
                </div>
              </Grid>
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
                {/* <Grid item md={1} xs={12}>
                  <Typography component='h4' className='tab-header' color='secondary'>
                    List
                  </Typography>
                </Grid> */}
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
