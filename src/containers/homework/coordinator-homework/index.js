/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
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
import Divider from '@material-ui/core/Divider/Divider';
import Paper from '@material-ui/core/Paper';
import GetAppIcon from '@material-ui/icons/GetApp';
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
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  LocalizationProvider,
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
} from '@material-ui/pickers-4.2';
// import MomentUtils as  from '@material-ui/pickers-4.2/adapter/moment';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';

// import MomentUtils from '@date-io/moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { connect } from 'react-redux';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import hwGiven from '../../../assets/images/hw-given.svg';
import hwEvaluated from '../../../assets/images/hw-evaluated.svg';
import submitted from '../../../assets/images/student-submitted.svg';
import HomeWorkCard from '../homework-card';

import './styles.scss';
import {
  fetchCoordinateTeacherHomeworkDetails,
  setSelectedHomework,
  fetchStudentsListForTeacherHomework,
  setTeacherUserIDCoord,
} from '../../../redux/actions';
import HomeworkRow from './homework-row';
import ViewHomework from './view-homework';
import ViewHomeworkSubmission from './view-homework-submission';
import { Tabs, Tab } from '../../../components/custom-tabs';
import hwEvaluatedIcon from '../../../assets/images/hw-evaluated.svg';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
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
}));

function getDaysAfter(date, amount) {
  // TODO: replace with implementation for your date library
  return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
}
function getDaysBefore(date, amount) {
  // TODO: replace with implementation for your date library
  return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
}

const CoordinatorTeacherHomework = withRouter(
  ({
    getCoordinateTeacherHomeworkDetails,
    homeworkCols,
    homeworkRows,
    fetchingTeacherHomework,
    onSetSelectedHomework,
    evaluatedStudents,
    unevaluatedStudents,
    submittedStudents,
    unSubmittedStudents,
    fetchingStudentLists,
    fetchStudentLists,
    history,
    selectedTeacherByCoordinatorToCreateHw,
    setFirstTeacherUserIdOnloadCordinatorHomewok,
    ...props
  }) => {
    //const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
    const [dateRange, setDateRange] = useState([
      moment().startOf('isoWeek'),
      moment().endOf('week'),
    ]);
    const [dateRangeTechPer, setDateRangeTechPer] = useState([
      moment().subtract(6, 'days'),
      moment(),
    ]);
    const [activeView, setActiveView] = useState('list-homework');
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    const [selectedCol, setSelectedCol] = useState({});
    // const [branchList, setBranchList] = useState([]);
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    // const [isEmail, setIsEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [moduleId, setModuleId] = useState();
    // const [modulePermision, setModulePermision] = useState(true);
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));

    const [startDateTechPer, setStartDateTechPer] = useState(
      moment().format('YYYY-MM-DD')
    );
    const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));

    const [selectedCoTeacherOptValue, setselectedCoTeacherOptValue] = useState([]);
    const [selectedCoTeacherOpt, setSelectedCoTeacherOpt] = useState([]);
    const [selectedTeacherUser_id, setSelectedTeacherUser_id] = useState();

    const [viewHomework, setViewHomework] = useState({
      subjectId: '',
      date: '',
      subjectName: '',
    });

    const [receivedHomework, setReceivedHomework] = useState({
      studentHomeworkId: '',
      date: '',
      subjectName: '',
    });

    const [datePopperOpen, setDatePopperOpen] = useState(false);

    const [teacherModuleId, setTeacherModuleId] = useState(null);
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('md'));

    useEffect(() => {
      if (NavData && NavData.length) {
        NavData.forEach((item) => {
          if (
            item.parent_modules === 'Homework' &&
            item.child_module &&
            item.child_module.length > 0
          ) {
            item.child_module.forEach((item) => {
              if (item.child_name === 'Management View') {
                setTeacherModuleId(item.child_id);
              }
            });
          }
        });
      }
    }, []);

    const handleViewHomework = ({
      date,
      subject: subjectName,
      subjectId,
      homeworkId,
    }) => {
      setViewHomework({
        subjectId,
        date,
        subjectName,
        homeworkId,
      });
      setActiveView('view-homework');
    };

    // const handleStartDateChange = (date) => {
    //   const endDate = getDaysAfter(date.clone(), 7);
    //   setEndDate(endDate);
    //   setStartDate(date.format('YYYY-MM-DD'));
    //   getTeacherHomeworkDetails(3384, date, endDate);
    // };

    // const handleEndDateChange = (date) => {
    //   const startDate = getDaysBefore(date.clone(), 7);
    //   setStartDate(startDate);
    //   setEndDate(date.format('YYYY-MM-DD'));
    //   getTeacherHomeworkDetails(2, startDate, date);
    // };

    const handleSelectCol = (col, view) => {
      const { homeworkId, subjectId } = col;
      console.log('homework id', homeworkId);
      fetchStudentLists(homeworkId, subjectId);
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
      subject,
      subjectId,
      selectedTeacherByCoordinatorToCreateHw,
    }) => {
      history.push(
        `/homework/cadd/${date}/${subject}/${subjectId}/${selectedTeacherByCoordinatorToCreateHw}`
      );
    };

    useEffect(() => {
      const [startDate, endDate] = dateRange;
      if (teacherModuleId) {
        if (activeView === 'list-homework') {
          if (startDate && endDate) {
            getTeacherListApi();
          }
        }
      }
    }, [getCoordinateTeacherHomeworkDetails, dateRange, activeView, teacherModuleId]);

    const getTeacherListApi = async () => {
      const [startDate, endDate] = dateRange;

      try {
        setLoading(true);
        // alert(2, startDate, endDate);
        const result = await axiosInstance.get(
          endpoints.coordinatorTeacherHomeworkApi.getAllTeacherList,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // const resultOptions = [];
        if (result.status === 200) {
          setSelectedCoTeacherOpt(result.data.result);
          setselectedCoTeacherOptValue(result.data.result[0]);
          let newCoorTechID = result.data.result[0].user_id;
          setSelectedTeacherUser_id(result.data.result[0].user_id);
          setFirstTeacherUserIdOnloadCordinatorHomewok(result.data.result[0]);

          if (selectedTeacherByCoordinatorToCreateHw !== false) {
            let myResult = result.data.result.filter(
              (item) => item.user_id == selectedTeacherByCoordinatorToCreateHw
            );

            newCoorTechID = myResult[0].user_id;
            setselectedCoTeacherOptValue(myResult[0]);
            setSelectedTeacherUser_id(newCoorTechID);
            setFirstTeacherUserIdOnloadCordinatorHomewok(myResult[0]);
          }

          if (activeView === 'list-homework') {
            if (startDate && endDate) {
              getCoordinateTeacherHomeworkDetails(
                teacherModuleId,
                startDate.format('YYYY-MM-DD'),
                endDate.format('YYYY-MM-DD'),
                newCoorTechID
              );
            }
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      } catch (error) {
        setAlert('error', error.message);
        setLoading(false);
      }
    };

    const handleCoordinateTeacher = (e, value) => {
      if (value?.user_id > 0) {
        setFirstTeacherUserIdOnloadCordinatorHomewok(value);
        setSelectedTeacherUser_id(value?.user_id);
        setselectedCoTeacherOptValue(value);
        getCoordinateTeacherHomeworkDetails(
          teacherModuleId,
          startDate,
          endDate,
          value.user_id
        );
      }
    };

    const downloadGetTeacherPerformanceListApi = async () => {
      const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
      // console.log('file will downloade', startDateTechPer, endDateTechPer);
      try {
        setLoading(true);
        if (startDateTechPer && startDateTechPer) {
          const dwURL = `${
            endpoints.coordinatorTeacherHomeworkApi.getTecherPerformance
          }?start_date=${startDateTechPer.format(
            'YYYY-MM-DD'
          )}&end_date=${endDateTechPer.format(
            'YYYY-MM-DD'
          )}&user_id=${selectedTeacherByCoordinatorToCreateHw}`;

          const result = await axiosInstance.get(dwURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob', //important
          });
          if (result.status === 200) {
            // console.log(result, '===========================');
            setLoading(false);
            const downloadUrl = window.URL.createObjectURL(new Blob([result.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute(
              'download',
              'Teacher_performance_' +
                startDateTechPer.format('YYYY-MM-DD') +
                '_' +
                endDateTechPer.format('YYYY-MM-DD') +
                '.xls'
            ); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
            setAlert('success', 'File downloaded successfully');
          }
        }
      } catch (error) {
        setAlert('error', error.message);
        setLoading(false);
      }
    };

    const renderRef = useRef(0);

    renderRef.current += 1;

    const tableContainer = useRef(null);

    // console.log('popper open', datePopperOpen);

    return (
      <>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
          <div className=' teacher-homework-coordinator message_log_wrapper-coordinator'>
            <div className='message_log_breadcrumb_wrapper'>
              <CommonBreadcrumbs componentName='Homework' />
            </div>
            <div className='message_log_white_wrapper'>
              {activeView !== 'view-homework' && activeView !== 'view-received-homework' && (
                <Grid container className='date-container' spacing={3}>
                  <Grid item xs={12} sm={3} className='date-container2'>
                    <Grid className={classes.paper}>
                      <Autocomplete
                        size='small'
                        id='Teacher'
                        options={selectedCoTeacherOpt}
                        getOptionLabel={(option) => option?.name}
                        onChange={handleCoordinateTeacher}
                        // filterSelectedOptions
                        value={selectedCoTeacherOptValue}
                        renderInput={(params) => (
                          <TextField
                            className=''
                            {...params}
                            variant='outlined'
                            label='Teacher'
                            placeholder='Teacher'
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3} className='date-container3'>
                    <Grid className={classes.paper}>
                      <LocalizationProvider dateAdapter={MomentUtils}>
                        <DateRangePicker
                          disableCloseOnSelect={false}
                          startText='Select-dates'
                          PopperProps={{ open: datePopperOpen }}
                          // endText='End-date'
                          value={dateRange}
                          // calendars='1'
                          onChange={(newValue) => {
                            console.log('onChange truggered', newValue);
                            const [startDate, endDate] = newValue;
                            const sevenDaysAfter = moment(startDate).add(6, 'days');
                            setDateRange([startDate, sevenDaysAfter]);
                            setDatePopperOpen(false);
                          }}
                          renderInput={(
                            // {
                            //   inputProps: { value: startValue, ...restStartInputProps },
                            //   ...startProps
                            // },
                            // {
                            //   inputProps: { value: endValue, ...restEndInputProps },
                            //   ...endProps
                            // }
                            { inputProps, ...startProps },
                            // startProps,
                            endProps
                          ) => {
                            console.log('startProps ', startProps, 'endProps', endProps);
                            return (
                              <>
                                <TextField
                                  {...startProps}
                                  inputProps={{
                                    ...inputProps,
                                    value: `${inputProps.value} - ${endProps.inputProps.value}`,
                                    readOnly: true,
                                  }}
                                  size='small'
                                  style={{ minWidth: '100%' }}
                                  onClick={() => {
                                    // console.log('triggered');
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
                    </Grid>
                  </Grid>
                  {isMobile ? (
                    <Grid item xs={12} className='date-container4'>
                      <Divider />
                    </Grid>
                  ) : (
                    <div className='vertical_divider'></div>
                  )}

                  <Grid item xs={12} sm={4} className='bulk_container'>
                    <LocalizationProvider dateAdapter={MomentUtils}>
                      <DateRangePicker
                        startText='Select-date-range'
                        value={dateRangeTechPer}
                        onChange={(newValue) => {
                          setDateRangeTechPer(newValue);
                        }}
                        renderInput={({ inputProps, ...startProps }, endProps) => {
                          return (
                            <>
                              <TextField
                                {...startProps}
                                inputProps={{
                                  ...inputProps,
                                  value: `${inputProps.value} - ${endProps.inputProps.value}`,
                                  readOnly: true,
                                }}
                                size='small'
                                style={{ minWidth: '100%' }}
                              />
                            </>
                          );
                        }}
                      />
                    </LocalizationProvider>
                    <div className='download_button'>
                      <Button
                        style={{
                          cursor: 'pointer',
                          backgroundColor: '#ffffff',
                          border: '1px solid #ff6b6b',
                          borderRadius: '5px',
                        }}
                        onClick={downloadGetTeacherPerformanceListApi}
                      >
                        <GetAppIcon color='primary' />
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              )}
              {activeView !== 'view-homework' &&
                activeView !== 'view-received-homework' &&
                isMobile && (
                  <div className='homework_block_wrapper'>
                    <div className='homework_block'>Weekly Time table</div>
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
                      <span>Assigned</span>
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
                      <span>Submitted</span>
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
                      <span>Evaluated</span>
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
                          <div className='homework_block_wrapper'>
                            {/* <div className='homework_block'>Weekly Time table</div> */}
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
                              <span>HW given</span>
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
                              <span>Students submitted</span>
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
                              <span>HW Evaluated</span>
                            </div>
                          </div>
                        )}
                      {fetchingTeacherHomework ? (
                        <div
                          style={{
                            height: '60vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <CircularProgress color='primary' />
                        </div>
                      ) : (
                        <Grid
                          xs={12}
                          md={selectedCol?.subject ? 8 : 12}
                          item
                          className='home-work-grid'
                        >
                          <Paper
                            className={`homework_table_wrapper ${classes.root}`}
                            ref={tableContainer}
                          >
                            <TableContainer
                              className={`table table-shadow homework_table ${classes.container}`}
                            >
                              <Table stickyHeader aria-label='sticky table'>
                                <TableHead className='view_groups_header'>
                                  <TableRow>
                                    {/* {messageRows.header.map((headers, i) => (
                              <TableCell className='homework_header'>{headers}</TableCell>
                            ))} */}
                                    {homeworkCols.map((col) => {
                                      return typeof col === 'object' ? (
                                        <TableCell>{col.subject_name}</TableCell>
                                      ) : (
                                        <TableCell>{col}</TableCell>
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
                                      setSelectedCol={handleSelectCol}
                                      handleViewHomework={handleViewHomework}
                                      coord_selected_teacher_id={selectedTeacherUser_id}
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
                                      <ListItem className='homework-table-mobile-view'>
                                        <div className='day-icon'>
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
                                            <IconButton
                                              onClick={() => {
                                                navigateToAddScreen({
                                                  date: row.date,
                                                  subject: col.subject_name,
                                                  subjectId: col.id,
                                                  selectedTeacherByCoordinatorToCreateHw: selectedTeacherByCoordinatorToCreateHw
                                                    ? selectedTeacherByCoordinatorToCreateHw
                                                    : selectedCoTeacherOptValue,
                                                });
                                              }}
                                            >
                                              <AddCircleOutlineIcon color='primary' />
                                            </IconButton>
                                          ) : (
                                            <>
                                              <IconButton
                                                onClick={() => {
                                                  handleViewHomework({
                                                    date: row.date,
                                                    subject: col.subject_name,
                                                    subjectId: col.id,
                                                    homeworkId: data.hw_id,
                                                    coord_selected_teacher_id: selectedTeacherUser_id,
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
                                                      subjectId: col.id,
                                                      homeworkId: data.hw_id,
                                                      view: 'submissionStats',
                                                      coord_selected_teacher_id: selectedTeacherUser_id,
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
                                                      subjectId: col.id,
                                                      homeworkId: data.hw_id,
                                                      view: 'evaluationStats',
                                                      coord_selected_teacher_id: selectedTeacherUser_id,
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
                        onClose={() => {
                          setActiveView('list-homework');
                          setSelectedCol({});
                        }}
                      />
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
  homeworkCols: state.teacherHomework.homeworkCols,
  homeworkRows: state.teacherHomework.homeworkRows,
  fetchingTeacherHomework: state.teacherHomework.fetchingTeacherHomework,
  evaluatedStudents: state.teacherHomework.evaluatedStudents,
  submittedStudents: state.teacherHomework.submittedStudents,
  unevaluatedStudents: state.teacherHomework.unevaluatedStudents,
  fetchingStudentLists: state.teacherHomework.fetchingStudentLists,
  selectedTeacherByCoordinatorToCreateHw:
    state.teacherHomework.selectedTeacherByCoordinatorToCreateHw,
});

const mapDispatchToProps = (dispatch) => ({
  getCoordinateTeacherHomeworkDetails: (
    teacherModuleId,
    startDate,
    endDate,
    selectedTeacherUser_id
  ) => {
    dispatch(
      fetchCoordinateTeacherHomeworkDetails(
        teacherModuleId,
        startDate,
        endDate,
        selectedTeacherUser_id
      )
    );
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
  fetchStudentLists: (id, subjectId) => {
    dispatch(fetchStudentsListForTeacherHomework(id, subjectId));
  },
  setFirstTeacherUserIdOnloadCordinatorHomewok: (selectedTeacherUser_id) => {
    return dispatch(setTeacherUserIDCoord(selectedTeacherUser_id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoordinatorTeacherHomework);
