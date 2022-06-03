/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  SvgIcon,
  Badge,
  IconButton,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  ClickAwayListener,
  Typography,
  withStyles,
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  LocalizationProvider,
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
} from '@material-ui/pickers-4.2';
import DateRangeIcon from '@material-ui/icons/DateRange';
// import MomentUtils as  from '@material-ui/pickers-4.2/adapter/moment';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';

// import MomentUtils from '@date-io/moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import filterImage from '../../../assets/images/unfiltered.svg';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import hwGiven from '../../../assets/images/hw-given.svg';
import hwEvaluated from '../../../assets/images/hw-evaluated.svg';
import submitted from '../../../assets/images/student-submitted.svg';
import HomeWorkCard from '../homework-card';
import AddHomework from '../../../assets/images/AddHomework.svg';
import CancelIcon from '../../../assets/images/Cancel-icon.svg';
import './styles.scss';
import {
  fetchTeacherHomeworkDetails,
  setSelectedHomework,
  fetchStudentsListForTeacherHomework,
  setSelectedFilters,
  resetSelectedFilters,
} from '../../../redux/actions';
import HomeworkRow from './homework-row';
import ViewHomework from './view-homework';
import ViewHomeworkSubmission from './view-homework-submission';
import { Tabs, Tab } from '../../../components/custom-tabs';
import hwEvaluatedIcon from '../../../assets/images/hw-evaluated.svg';
import expiredIcon from '../../../assets/images/Expired.svg';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import AssignmentIcon from '@material-ui/icons/Assignment';
import axiosInstance from '../../../config/axios';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.homeworkTableWrapper,
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '100%',
    marginLeft: '5px',
    marginTop: '5px',
    [theme.breakpoints.down('xs')]: {
      width: '100',
      margin: 'auto',
    },
  },
  container: {
    maxHeight: 440,
  },
  homeworkTableMobileView: {
    color: theme.palette.secondary.main
  }, homeworkblock: {
    color: theme.palette.secondary.main,
    fontWeight: 600
  },
  dayicon: theme.dayIcon
}));


function getDaysAfter(date, amount) {
  // TODO: replace with implementation for your date library
  return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
}
function getDaysBefore(date, amount) {
  // TODO: replace with implementation for your date library
  return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
}

const TeacherHomework = withRouter(
  ({
    selectedFilters,
    onSetSelectedFilters,
    onResetSelectedFilters,
    getTeacherHomeworkDetails,
    homeworkCols,
    homeworkRows,
    fetchingTeacherHomework,
    onSetSelectedHomework,
    evaluatedStudents,
    unevaluatedStudents,
    submittedStudents,
    unSubmittedStudents,
    absentList,
    fetchingStudentLists,
    fetchStudentLists,
    history,
    ...props
  }) => {
    const [dateRange, setDateRange] = useState([
      moment().startOf('isoWeek').subtract(1, 'days'),
      moment().endOf('week'),
    ]);
    const [activeView, setActiveView] = useState('list-homework');
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    const [selectedCol, setSelectedCol] = useState({});
    const [branchList, setBranchList] = useState([]);
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const [isEmail, setIsEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [moduleId, setModuleId] = useState();
    const [modulePermision, setModulePermision] = useState(true);
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
    const [setClassname, setClassNameForcontainer] = useState('');
    const [viewHomework, setViewHomework] = useState({
      subjectId: '',
      date: '',
      subjectName: '',
    });
    const [ hwFlag , setHwFlag ] = useState(false);
    const [ selectSub , setSelectSub ] = useState(false)

    const [receivedHomework, setReceivedHomework] = useState({
      studentHomeworkId: '',
      date: '',
      subjectName: '',
    });

    const [academicYear, setAcademicYear] = useState([]);
    // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState(selectedFilters.year);
    const selectedAcademicYear = useSelector(
      (state) => state.commonFilterReducer?.selectedYear
    );
    const [selectedBranch, setSelectedBranch] = useState(selectedFilters.branch);
    const [selectedGrades, setSelectedGrades] = useState([]);
    //const [branchList, setBranchList] = useState([]);
    const [gradeList, setGradeList] = useState([]);
    const [gradeIds, setGradeIds] = useState([]);
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [searchGrade, setSearchGrade] = useState('');
    const [searchSection, setSearchSection] = useState('');

    const [sectionDisplay, setSectionDisplay] = useState(selectedFilters.section);
    const [gradeDisplay, setGradeDisplay] = useState(selectedFilters.grade);

    const [datePopperOpen, setDatePopperOpen] = useState(false);

    const [teacherModuleId, setTeacherModuleId] = useState(null);
    const themeContext = useTheme();

    const isMobile = useMediaQuery(themeContext.breakpoints.down('md'));

    const handleViewHomework = ({
      date,
      subject: subjectName,
      subjectId,
      homeworkId,
      sectiondata,
      sessionYear,
      branch,
      grade,
    }) => {
      setViewHomework({
        subjectId: subjectId,
        date: date,
        subjectName: subjectName,
        sectiondata,
        homeworkId,
        sessionYear,
        branch,
        grade,
      });
      setActiveView('view-homework');
    };

    const handleStartDateChange = (date) => {
      const endDate = getDaysAfter(date.clone(), 6);
      setEndDate(endDate);
      setStartDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(3384, date, endDate);
    };

    const handleEndDateChange = (date) => {
      const startDate = getDaysBefore(date.clone(), 6);
      setStartDate(startDate);
      setEndDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, startDate, date);
    };

    const handleSelectCol = (col, view) => {
      //  setClassNameForcontainer("home-wrapper")
      const { homeworkId, subjectId, sectionId } = col;
      fetchStudentLists(homeworkId, subjectId, sectionId ,null, col?.date );
      setSelectedCol(col);
      if (isMobile) {
        setActiveView('card-view');
      }
      onSetSelectedHomework(col);
    };

    const handleChangeActiveView = (view) => {
      setActiveView(view);
    };

    const handleViewReceivedHomework = (studentHomeworkId) => {
      setReceivedHomework({
        studentHomeworkId,
        date: selectedCol.date,
        subject: selectedCol.subject,
      });
      handleChangeActiveView('view-received-homework');
    };

    const handleCloseCard = () => {
      setActiveView('list-homework');
      setSelectedCol({});
    }

    const handleCloseView = () => {
      setViewHomework({
        subjectId: '',
        date: '',
        subjectName: '',
      });
      setReceivedHomework({
        studentHomeworkId: '',
        date: '',
        subjectName: '',
      });
      setSelectedCol({});
      setActiveView('list-homework');
    };

    const navigateToAddScreen = ({
      date,
      sessionYear,
      branch,
      grade,
      subject,
      subjectId,
    }) => {
      history.push(
        `/homework/add/${date}/${sessionYear}/${branch}/${grade}/${subject}/${subjectId}`
      );
    };
   
    useEffect(() => {
      if (teacherModuleId) {
        if (selectedFilters.branch !== '') {
          setSelectedBranch(selectedFilters.branch);
          handleBranch('', selectedFilters.branch);
        }
        if (selectedFilters.grade !== '') {
          setGradeDisplay(selectedFilters.grade);
          handleGrade('', selectedFilters.grade);
        }
        if (selectedFilters.section !== '') {
          setSectionDisplay(selectedFilters.section);
          handleSection('', selectedFilters.section);
        }
      }
    }, [teacherModuleId]);
    useEffect(() => {
      const [startDate, endDate] = dateRange;
      if (teacherModuleId) {
        if (activeView === 'list-homework') {
          if (
            (startDate &&
              endDate &&
              selectedAcademicYear?.id &&
              selectedBranch?.id &&
              gradeDisplay?.id,
              sectionDisplay?.id)
          ) {
            //alert(searchSection)
            getTeacherHomeworkDetails(
              teacherModuleId,
              selectedAcademicYear.id,
              selectedBranch.id,
              gradeDisplay.grade_id,
              sectionDisplay.id,
              sectionDisplay.section_id,
              startDate.format('YYYY-MM-DD'),
              endDate.format('YYYY-MM-DD')
            );
          }
        }
      }
    }, [
      getTeacherHomeworkDetails,
      dateRange,
      activeView,
      teacherModuleId,
      sectionDisplay,
      gradeDisplay,
      hwFlag
    ]);

    useEffect(() => {
      const homeworkModule = NavData?.filter(
        (parent) => parent.parent_modules === 'Homework'
      );
      // const teacherModuleId =
      //   homeworkModule.length > 0
      //     ? homeworkModule[0].child_module.filter(
      //         (child) => child.child_name === 'Teacher Homework'
      //       )
      //     : null;

      if (NavData && NavData.length) {
        NavData.forEach((item) => {
          if (
            item.parent_modules === 'Homework' &&
            item.child_module &&
            item.child_module.length > 0
          ) {
            item.child_module.forEach((item) => {
              if (item.child_name === 'Teacher Homework') {
                setTeacherModuleId(item.child_id);
              }
            });
          }
        });
      }
    }, []);

  


    let slectedSubmitStudent = [];
    const handleUser = (e) => {
      if (slectedSubmitStudent?.length == 0) {
        slectedSubmitStudent.push({ 'student_homework_id': e?.student_homework_id, 'hw_submission_mode': e?.hw_submission_mode })
      }
      else if (slectedSubmitStudent.length > 0) {
        if (slectedSubmitStudent.filter((element) => element?.student_homework_id === e?.student_homework_id)?.length === 0) {
          slectedSubmitStudent.push({ 'student_homework_id': e?.student_homework_id, 'hw_submission_mode': e?.hw_submission_mode })
        } else {
          let tempArray = slectedSubmitStudent.filter((element) => element?.student_homework_id !== e?.student_homework_id)
          slectedSubmitStudent = tempArray
        }
      }
    }


    let slectedUnSubmitStudent = [];
    const handleUserUnsubmitted = (e) => {
      if (slectedUnSubmitStudent.includes(e?.user_id) == false) {
        slectedUnSubmitStudent.push(e?.user_id)
      }
      else if (slectedUnSubmitStudent.includes(e?.user_id) == true) {
        let tempArray = slectedUnSubmitStudent.filter(element => element !== e?.user_id)
        slectedUnSubmitStudent = tempArray;
      }
    }

    const handleUserAbsent = (e) => {
      if (slectedUnSubmitStudent.includes(e?.user_id) == false) {
        slectedUnSubmitStudent.push(e?.user_id)
      }
      else if (slectedUnSubmitStudent.includes(e?.user_id) == true) {
        let tempArray = slectedUnSubmitStudent.filter(element => element !== e?.user_id)
        slectedUnSubmitStudent = tempArray;
      }
    }

    const handleAllSubmit = () => {
      const testclick = document.getElementsByClassName('checkboxsubmit');
      const checkboxes = testclick[0]?.querySelectorAll('input[type=checkbox]')
      for (let i = 0; i < checkboxes.length; i ++) {
        checkboxes[i].click();
      }
      }

      const handleAllUnSubmit = () => {
        const testclick = document.getElementsByClassName('checkboxUnsubmit');
        const checkboxes = testclick[0]?.querySelectorAll('input[type=checkbox]')
        for (let i = 0; i < checkboxes.length; i ++) {
          checkboxes[i].click();
        }
        }

        const handleAllAbsent = () => {
          const testclick = document.getElementsByClassName('checkboxAbsent');
          const checkboxes = testclick[0]?.querySelectorAll('input[type=checkbox]')
          console.log(checkboxes , "all submit");
          for (let i = 0; i < checkboxes.length; i ++) {
            checkboxes[i].click();
          }
          console.log(slectedUnSubmitStudent);
          }

    const handleSubmittedStd = () => {
      if(slectedSubmitStudent.length > 0){
      axiosInstance
      .put(endpoints.homework.submitToUnsubmit, slectedSubmitStudent)
      .then((result) => {
        setAlert('success', result.data.message);
      fetchStudentLists(selectedCol?.homeworkId, selectedCol?.subjectId, selectedCol?.sectionId ,null, selectedCol?.date);
      if(hwFlag == true){
        setHwFlag(false)
      } else {
        setHwFlag(true)
      }
      slectedSubmitStudent = [];
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'something went wrong');
        console.log(error);
      });
    } else {
      setAlert('error','Please select Users')
    }
    }

    const handleUnSubmittedStd = () => {
      if(slectedUnSubmitStudent.length > 0){
      axiosInstance
      .put(`academic/${selectedCol?.homeworkId}/homework-unsubmitted-submitted/`, slectedUnSubmitStudent)
      .then((result) => {
        setAlert('success', result.data.message);
        console.log(selectedCol);
      fetchStudentLists(selectedCol?.homeworkId, selectedCol?.subjectId, selectedCol?.sectionId ,null, selectedCol?.date);
      if(hwFlag == true){
        setHwFlag(false)
      } else {
        setHwFlag(true)
      }
      slectedUnSubmitStudent = [];
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'something went wrong');
        console.log(error);
      });
    } else {
      setAlert('error','Please select Users')
    }
    }


    const renderRef = useRef(0);

    renderRef.current += 1;

    const tableContainer = useRef(null);

    function callApi(api, key) {
      setLoading(true);
      axiosInstance
        .get(api)
        .then((result) => {
          if (result.status === 200) {
            // if (key === 'academicYearList') {
            //   setAcademicYear(result?.data?.data || []);
            //   setLoading(false);
            //   if(academicYear){
            //     handleYear("",result?.data?.current_acad_session_data[0])
            //   }
            // }
            if (key === 'branchList') {
              // handleGrade();
              //setBranchList(result?.data?.data || []);
              setBranchList(
                result?.data?.data?.results.map((obj) => (obj && obj.branch) || {}) || []
              );
              setLoading(false);
            }
            if (key === 'gradeList') {
              setGrades(result.data.data || []);
              setLoading(false);
            }
          } else {
            setAlert('error', result.data.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setLoading(false);
        });
    }

    // useEffect(() => {
    //   if (teacherModuleId) {
    //     callApi(
    //       `${endpoints.userManagement.academicYear}?module_id=${teacherModuleId}`,
    //       'academicYearList'
    //     );
    //   }
    // }, [teacherModuleId]);

    useEffect(() => {
      if (selectedAcademicYear && teacherModuleId) {
        callApi(
          `${endpoints.mappingStudentGrade.branch}?session_year=${selectedAcademicYear?.id}&module_id=${teacherModuleId}`,
          'branchList'
        );
        // onSetSelectedFilters({
        //   year: selectedAcademicYear,
        //   branch: '',
        //   grade: '',
        //   section: '',
        // });
      }
    }, [selectedAcademicYear, teacherModuleId]);

    // const handleYear = (event, value) => {
    //   setGradeDisplay([]);
    //   setBranchList([]);
    //   setGrades([]);
    //   setSections([]);
    //   //setSearchGrade('');
    //   //setSearchSection('');
    //   setSelectedBranch([]);
    //   setSelectedAcadmeicYear(value);
    //   if (value?.id) {
    //     callApi(
    //       `${endpoints.mappingStudentGrade.branch}?session_year=${value?.id}&module_id=${teacherModuleId}`,
    //       'branchList'
    //     );
    //     onSetSelectedFilters({
    //       year: value,
    //       branch: '',
    //       grade: '',
    //       section: ''
    //     });
    //   }
    // };

    const handleBranch = (event, value) => {
      setGrades([]);
      setSections([]);
      setGradeDisplay([]);
      setSectionDisplay([]);
      handleCloseCard()
      setSearchGrade('');
      setSearchSection([]);
      setSelectedBranch([]);
      if (value) {
        setSelectedBranch(value);
        // endpoints.masterManagement.gradesDrop
        callApi(
          `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${value.id}&module_id=${teacherModuleId}`,
          'gradeList'
        );
        onSetSelectedFilters({
          year: selectedAcademicYear,
          branch: value,
          grade: '',
          section: '',
        });
      }
    };

    const handleGrade = (event, value) => {
      setSectionDisplay([]);
      setSections([]);
      // setGradeDisplay([]);
      handleCloseCard()
      setSearchGrade('');
      setSearchSection([]);
      if (value) {
        setSearchGrade(value?.grade_id);
        setGradeDisplay(value);
        onSetSelectedFilters({
          year: selectedAcademicYear,
          branch: selectedBranch,
          grade: value,
          section: '',
        });
        setLoading(true);
        axiosInstance
          .get(
            `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${selectedBranch.id}&grade_id=${value.grade_id}&module_id=${teacherModuleId}`
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              setSections(result.data?.data);
              setLoading(false);
            } else {
              setAlert('error', result.data.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setLoading(false);
          });
      }
    };

    const handleSection = (event, value) => {
      //setSearchSection([]);
      // setSectionDisplay([]);
      handleCloseCard();
      //let sec_id = [];
      if (value) {
        //let id = value.map(({ id }) => sec_id.push(id));
        //setSearchSection(sec_id);
        setSectionDisplay(value);
        onSetSelectedFilters({
          year: selectedAcademicYear,
          branch: selectedBranch,
          grade: gradeDisplay,
          section: value,
        });
      }
    };

    const handleCrearFilter = () => {
      // setSelectedAcadmeicYear('');
      setSelectedBranch([]);
      setGradeDisplay([]);
      setSectionDisplay([]);
      onResetSelectedFilters();
      setSelectedCol({});
    };

    //useEffect(() => {console.log(fetchingTeacherHomework,'fetchingTeacherHomework')},[fetchingTeacherHomework])

    return (
      <>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
          <div className=' teacher-homework message_log_wrapper'>
            <CommonBreadcrumbs componentName='Homework' isAcademicYearVisible={true} />
            <div className='message_log_white_wrapper'>
              {activeView !== 'view-homework' && activeView !== 'view-received-homework' && (
                <Grid container spacing={2} className="small-container" style={{ padding: '20px' }}>
                  {/* <Grid item xs={12} sm={3}>
                    <Autocomplete
                      style={{ width: '100%' }}
                      size='small'
                      onChange={handleYear}
                      id='branch_id'
                      className='dropdownIcon'
                      value={selectedAcademicYear}
                      options={academicYear || []}
                      getOptionLabel={(option) => option?.session_year || ''}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Academic Year'
                          placeholder='Academic Year'
                        />
                      )}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={3}>
                    <Autocomplete
                      style={{ width: '100%' }}
                      size='small'
                      onChange={handleBranch}
                      id='branch_id'
                      className='dropdownIcon'
                      value={selectedBranch}
                      options={branchList || []}
                      getOptionLabel={(option) => option?.branch_name || ''}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Branch'
                          placeholder='Branch'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Autocomplete
                      style={{ width: '100%' }}
                      size='small'
                      onChange={handleGrade}
                      id='grade'
                      required
                      value={gradeDisplay}
                      options={grades || []}
                      getOptionLabel={(option) => option?.grade__grade_name || ''}
                      filterSelectedOptions
                      className='dropdownIcon'
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Grades'
                          placeholder='Grades'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Autocomplete
                      style={{ width: '100%' }}
                      size='small'
                      onChange={handleSection}
                      id='section'
                      required
                      //multiple
                      value={sectionDisplay}
                      options={sections || []}
                      getOptionLabel={(option) => option?.section__section_name || ''}
                      filterSelectedOptions
                      className='dropdownIcon'
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Sections'
                          placeholder='Sections'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <div className='date-container' > */}
                    <ClickAwayListener
                      onClickAway={(e) => {
                        setDatePopperOpen(false);
                      }}
                    >
                      <LocalizationProvider
                        dateAdapter={MomentUtils}
                        style={{ backgroundColor: '#F9F9F9' }}
                      >
                        <DateRangePicker
                          id='date-range-picker-date'
                          disableCloseOnSelect={false}
                          startText='Select-dates'
                          // PopperProps={{ open: datePopperOpen }}
                          // endText='End-date'
                          value={dateRange}
                          // calendars='1'
                          onChange={(newValue) => {
                            const [startDate, endDate] = newValue;
                            const sevenDaysAfter = moment(startDate).add(6, 'days');
                            setDateRange([startDate, sevenDaysAfter]);
                            setDatePopperOpen(false);
                          }}
                          renderInput={({ inputProps, ...startProps }, endProps) => {
                            return (
                              <>
                                <TextField
                                  {...startProps}
                                  InputProps={{
                                    ...inputProps,
                                    value: `${moment(inputProps.value).format(
                                      'MM-DD-YYYY'
                                    )} - ${moment(endProps.inputProps.value).format(
                                      'MM-DD-YYYY'
                                    )}`,
                                    readOnly: true,
                                    endAdornment: (
                                      <InputAdornment position='start'>
                                        <DateRangeIcon
                                          style={{ width: '35px' }}
                                          color='primary'
                                        />
                                      </InputAdornment>
                                    ),
                                  }}
                                  size='small'
                                  style={{ width: '100%' }}
                                  onClick={() => {
                                    setDatePopperOpen(true);
                                  }}
                                />
                                {/* <TextField {...startProps} size='small' /> */}
                                {/* <DateRangeDelimiter> to </DateRangeDelimiter> */}
                                {/* <TextField {...endProps} size='small' /> */}
                              </>
                            );
                          }}
                        />
                      </LocalizationProvider>
                    </ClickAwayListener>
                    {/* </div> */}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      onClick={(e) => handleCrearFilter()}
                      className='labelColor cancelButton'
                    >
                      Clear All
                    </Button>
                  </Grid>
                </Grid>
              )}
              {activeView !== 'view-homework' &&
                activeView !== 'view-received-homework' &&
                isMobile && (
                  <div className='homework_block_wrapper'>
                    <div className={classes.homeworkblock}>Weekly Time table</div>
                    <div className='icon-desc-container'>
                      <SvgIcon
                        component={() => (
                          <img
                            style={{ width: '20px', marginRight: '5px' }}
                            src={hwGiven}
                            alt='given'
                          />
                        )}
                      />
                      <Typography color="secondary">Assigned</Typography>
                    </div>
                    <div className='icon-desc-container'>
                      <SvgIcon
                        component={() => (
                          <img
                            style={{ width: '20px', marginRight: '5px' }}
                            src={submitted}
                            alt='submitted'
                          />
                        )}
                      />
                      <Typography color="secondary">Submitted</Typography>
                    </div>
                    <div className='icon-desc-container'>
                      <SvgIcon
                        component={() => (
                          <img
                            style={{ width: '20px', marginRight: '5px' }}
                            src={hwEvaluated}
                            alt='evaluated'
                          />
                        )}
                      />
                      <Typography color="secondary">Evaluated</Typography>
                    </div>
                    <div className='icon-desc-container'>
                      <SvgIcon
                        component={() => (
                          <img
                            style={{ width: '20px', marginRight: '5px' }}
                            src={expiredIcon}
                            alt='expired'
                          />
                        )}
                      />
                      <Typography color="secondary">Expired</Typography>
                    </div>
                  </div>
                )}

              {activeView === 'view-homework' && (
                <ViewHomework
                  viewHomework={viewHomework}
                  setViewHomework={setViewHomework}
                  onClose={handleCloseView}
                />
              )}
              {activeView === 'view-received-homework' && (
                <ViewHomeworkSubmission
                  homework={receivedHomework}
                  onClose={handleCloseView}
                />
              )}
              <div className='create_group_filter_container'>
                <Grid container className='homework_container' spacing={2}>
                  {activeView === 'list-homework' && !isMobile && (
                    <>
                      {activeView !== 'view-homework' &&
                        activeView !== 'view-received-homework' && (
                          <Grid item xs={12} className={`homework_block_wrapper`}>
                            {/* <div className='homework_block'>Weekly Time table</div> */}
                            <div className='icon-desc-container'>
                              <SvgIcon
                                component={() => (
                                  <img
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={AddHomework}
                                    alt='AddHomework'
                                  />
                                )}
                              />
                              <Typography color="secondary" style={{ fontSize: '16px' }}>Add Homework</Typography>
                            </div>
                            <div className='icon-desc-container'>
                              <SvgIcon
                                component={() => (
                                  <img
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={hwEvaluated}
                                    alt='evaluated'
                                  />
                                )}
                              />
                              <Typography color="secondary" style={{ fontSize: '16px' }}>HW Evaluated</Typography>
                            </div>
                            <div className='icon-desc-container'>
                              <SvgIcon
                                component={() => (
                                  <img
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={hwGiven}
                                    alt='given'
                                  />
                                )}
                              />
                              <Typography color="secondary" style={{ fontSize: '16px' }}>HW Assigned</Typography>
                            </div>
                            <div className='icon-desc-container'>
                              <SvgIcon
                                component={() => (
                                  <img
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={submitted}
                                    alt='submitted'
                                  />
                                )}
                              />
                              <Typography color="secondary" style={{ fontSize: '16px' }}>Students Submitted</Typography>
                            </div>
                            {/* <div className='icon-desc-container'>
                              <SvgIcon
                                component={() => (
                                  <img
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={CancelIcon}
                                    alt='CancelIcon'
                                  />
                                )}
                              />
                              <Typography>Evaluated</span>
                            </div> */}
                            <div className='icon-desc-container'>
                              <SvgIcon
                                component={() => (
                                  <img
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={expiredIcon}
                                    alt='evaluated'
                                  />
                                )}
                              />
                              <Typography color="secondary" style={{ fontSize: '16px' }}>Expired</Typography>
                            </div>
                            <div className='icon-desc-container'>
                            <div className='badgeContent' >
                              <Badge color="success" variant="dot" >
                                <AssignmentIcon style={{color: '#014b7e'}} />
                              </Badge>
                            </div>
                            <Typography color="secondary" style={{ fontSize: '16px' }}>Online Submission</Typography>
                            </div>
                          </Grid>
                        )}
                      {fetchingTeacherHomework ? (
                        <div
                          style={{
                            height: '60vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 'auto',
                          }}
                        >
                          <CircularProgress color='primary' />
                        </div>
                      ) : (
                        <Grid
                          xs={12}
                          md={selectedCol?.subject ? 9 : 12}
                          item
                          className='table-cont'
                        >
                          <Paper
                            className={classes.root}
                            ref={tableContainer}
                          >
                            <TableContainer
                              className={`table table-shadow homework_table ${classes.container}`}
                            >
                              <Table stickyHeader aria-label='sticky table'>
                                <TableHead className='view_groups_header'>
                                  <TableRow className='tr-row'>
                                    {/* {messageRows.header.map((headers, i) => (
                              <TableCell className='homework_header'>{headers}</TableCell>
                            ))} */}
                                    {homeworkCols.map((col) => {
                                      return typeof col === 'object' ? (
                                        <TableCell style={{ minWidth: '260px' }}>
                                          {col.subject_name.split('_').join('/')}
                                        </TableCell>
                                      ) : (
                                        <TableCell style={{ zIndex: '20' }}>{col}</TableCell>
                                      );
                                    })}
                                  </TableRow>
                                </TableHead>
                                <TableBody className='table_body'>
                                  {homeworkRows.map((row) => (
                                    <HomeworkRow
                                      data={row}
                                      cols={homeworkCols}
                                      selectedCol={selectedCol}
                                      sectionData={sectionDisplay}
                                      setSelectedCol={handleSelectCol}
                                      handleViewHomework={handleViewHomework}
                                    />
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        </Grid>
                      )}
                    </>
                  )}
                  {activeView !== 'view-homework' &&
                    activeView !== 'view-received-homework' &&
                    selectedCol.subject && (
                      <HomeWorkCard
                        // height={tableContainer.current?.offsetHeight}
                        height='100%'
                        data={selectedCol}
                        evaluatedStudents={evaluatedStudents}
                        unevaluatedStudents={unevaluatedStudents}
                        submittedStudents={submittedStudents}
                        unSubmittedStudents={unSubmittedStudents}
                        loading={fetchingStudentLists}
                        onClick={handleViewReceivedHomework}
                        handleUser={handleUser}
                        handleUserUnsubmitted={handleUserUnsubmitted}
                        handleSubmittedStd={handleSubmittedStd}
                        handleUnSubmittedStd={handleUnSubmittedStd}
                        // onClose={() => {
                        //   setActiveView('list-homework');
                        //   setSelectedCol({});
                        // }}
                        onClose={handleCloseCard}
                        handleAllSubmit={handleAllSubmit}
                        absentList={absentList}
                        handleAllUnSubmit={handleAllUnSubmit}
                        handleAllAbsent={handleAllAbsent}
                        handleUserAbsent={handleUserAbsent}
                      />
                    )}
                  {activeView === 'list-homework' && isMobile && (
                    <Tabs
                      defaultActiveTab={
                        homeworkCols.length > 1 ? homeworkCols[1].subject_name : ''
                      }
                    >
                      {homeworkCols
                        .filter((col) => {
                          return typeof col === 'object';
                        })
                        .map((col) => {
                          return (
                            <Tab label={col.subject_name}>
                              <Tab.Content>
                                <List component='nav' aria-label='main mailbox folders'>
                                  {homeworkRows.map((row) => {
                                    const data = row[col.subject_name];
                                    return (
                                      <ListItem className={` ${classes.homeworkTableMobileView} homework-table-mobile-view`}>
                                        <div className={classes.dayicon}>
                                          {moment(row.date).format('dddd').split('')[0]}
                                        </div>
                                        <div className='date'>{row.date}</div>

                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flex: 1,
                                          }}
                                        >
                                          {!data.hasOwnProperty('student_submitted') ? (
                                            <>
                                              {row.canUpload ? (
                                                <IconButton
                                                  onClick={() => {
                                                    navigateToAddScreen({
                                                      date: row.date,
                                                      //sectionId: sectionDisplay?.id,
                                                      sessionYear: row.sessionYear,
                                                      branch: row.branch,
                                                      grade: row.grade,
                                                      subject: col.subject_name,
                                                      subjectId: col.subject_id,
                                                    });
                                                  }}
                                                >
                                                  <AddCircleOutlineIcon color='primary' />
                                                </IconButton>
                                              ) : (
                                                <></>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              <IconButton
                                                onClick={() => {
                                                  handleViewHomework({
                                                    date: row.date,
                                                    subject: col.subject_name,
                                                    subjectId: col.subject_id,
                                                    homeworkId: data.hw_id,
                                                    sectiondata: sectionDisplay,
                                                    sessionYear: row.sessionYear,
                                                    branch: row.branch,
                                                    grade: row.grade,
                                                  });
                                                }}
                                              >
                                                <SvgIcon
                                                  component={() => (
                                                    <img
                                                      style={{
                                                        width: '35px',
                                                        padding: '5px',
                                                      }}
                                                      src={hwGiven}
                                                      alt='hwGiven'
                                                    />
                                                  )}
                                                />
                                              </IconButton>

                                              {data.student_submitted > 0 && (
                                                <IconButton
                                                  onClick={() => {
                                                    // handleClick('submissionStats')
                                                    handleSelectCol({
                                                      date: row.date,
                                                      subject: col.subject_name,
                                                      subjectId: col.subject_id,
                                                      sectionId: sectionDisplay?.id,
                                                      homeworkId: data.hw_id,
                                                      view: 'submissionStats',
                                                    });
                                                  }}
                                                >
                                                  <Badge
                                                    badgeContent={data.student_submitted}
                                                    color='primary'
                                                    style={{ cursor: 'pointer' }}
                                                  >
                                                    <SvgIcon
                                                      component={() => (
                                                        <img
                                                          style={{
                                                            width: '35px',
                                                            padding: '5px',
                                                          }}
                                                          src={submitted}
                                                          alt='submitted'
                                                        />
                                                      )}
                                                      style={{ cursor: 'pointer' }}
                                                    />
                                                  </Badge>
                                                </IconButton>
                                              )}

                                              {data.hw_evaluated > 0 && (
                                                <IconButton
                                                  onClick={() => {
                                                    // handleClick('evaluationStats')
                                                    handleSelectCol({
                                                      date: row.date,
                                                      subject: col.subject_name,
                                                      subjectId: col.subject_id,
                                                      sectionId: sectionDisplay?.id,
                                                      homeworkId: data.hw_id,
                                                      view: 'evaluationStats',
                                                    });
                                                  }}
                                                >
                                                  <Badge
                                                    badgeContent={data.hw_evaluated}
                                                    color='primary'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                      // handleClick
                                                    }}
                                                  >
                                                    <SvgIcon
                                                      component={() => (
                                                        <img
                                                          style={{
                                                            width: '35px',
                                                            padding: '5px',
                                                          }}
                                                          src={hwEvaluatedIcon}
                                                          alt='hwEvaluated'
                                                        />
                                                      )}
                                                    />
                                                  </Badge>
                                                </IconButton>
                                              )}
                                              {!data.canUpload > 0 && (
                                                <IconButton>
                                                  <SvgIcon
                                                    component={() => (
                                                      <img
                                                        style={{
                                                          width: '35px',
                                                          padding: '5px',
                                                        }}
                                                        src={expiredIcon}
                                                        alt='hw expired'
                                                      />
                                                    )}
                                                  />
                                                </IconButton>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </ListItem>
                                    );
                                  })}
                                </List>
                              </Tab.Content>
                            </Tab>
                          );
                        })}
                    </Tabs>
                  )}
                  {activeView === 'list-homework' &&
                    homeworkRows.length === 0 &&
                    !fetchingTeacherHomework && (
                      <Grid container spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          style={{ textAlign: 'center', marginTop: '10px' }}
                        >
                          <img
                            src={filterImage}
                            alt='crash'
                            height='250px'
                            width='250px'
                          />
                          <Typography>
                            {/* Please select the filter to dislpay data */}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                </Grid>
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  }
);

const mapStateToProps = (state) => ({
  selectedFilters: state.teacherHomework.selectedFilters,
  homeworkCols: state.teacherHomework.homeworkCols,
  homeworkRows: state.teacherHomework.homeworkRows,
  fetchingTeacherHomework: state.teacherHomework.fetchingTeacherHomework,
  evaluatedStudents: state.teacherHomework.evaluatedStudents,
  submittedStudents: state.teacherHomework.submittedStudents,
  unSubmittedStudents: state.teacherHomework.unSubmittedStudents,
  unevaluatedStudents: state.teacherHomework.unevaluatedStudents,
  fetchingStudentLists: state.teacherHomework.fetchingStudentLists,
  absentList: state.teacherHomework.absentList,
});

const mapDispatchToProps = (dispatch) => ({
  getTeacherHomeworkDetails: (
    moduleId,
    acadYear,
    branch,
    grade,
    sectionId,
    section,
    startDate,
    endDate
  ) => {
    dispatch(
      fetchTeacherHomeworkDetails(
        moduleId,
        acadYear,
        branch,
        grade,
        sectionId,
        section,
        startDate,
        endDate
      )
    );
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
  fetchStudentLists: (id, subjectId, sectionId ,user , date ) => {
    dispatch(fetchStudentsListForTeacherHomework(id, subjectId, sectionId ,user , date));
  },
  onSetSelectedFilters: (data) => {
    dispatch(setSelectedFilters(data));
  },
  onResetSelectedFilters: () => {
    dispatch(resetSelectedFilters());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherHomework);
