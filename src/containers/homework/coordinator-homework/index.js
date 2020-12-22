/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef, useSelector } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Button, SvgIcon, Badge, IconButton } from '@material-ui/core';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
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

import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { connect } from 'react-redux';
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
} from '../../../redux/actions';
import HomeworkRow from './homework-row';
import ViewHomework from './view-homework';
import ViewHomeworkSubmission from './view-homework-submission';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '100%',
    marginLeft: '5px',
    marginTop: '5px',
    [theme.breakpoints.down('xs')]: {
      width: '87vw',
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
    fetchingStudentLists,
    fetchStudentLists,
    history,
    selectedTeacherByCoordinatorToCreateHw,
    ...props
  }) => {
    const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
    const [activeView, setActiveView] = useState('list-homework');
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    const [selectedCol, setSelectedCol] = useState({});
    const [branchList, setBranchList] = useState([]);
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const [isEmail, setIsEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [moduleIdCord, setModuleIdCord] = useState();
    const [modulePermision, setModulePermision] = useState(true);
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));

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
                setModuleIdCord(item.child_id);
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

    const handleStartDateChange = (date) => {
      const endDate = getDaysAfter(date.clone(), 7);
      setEndDate(endDate);
      setStartDate(date.format('YYYY-MM-DD'));
      getCoordinateTeacherHomeworkDetails(moduleIdCord, date, endDate, selectedTeacherUser_id);
    };

    const handleEndDateChange = (date) => {
      const startDate = getDaysBefore(date.clone(), 7);
      setStartDate(startDate);
      setEndDate(date.format('YYYY-MM-DD'));
      getCoordinateTeacherHomeworkDetails(moduleIdCord, startDate, date, selectedTeacherUser_id);
    };

    const handleSelectCol = (col, view) => {
      const { homeworkId } = col;
      console.log('homework id', homeworkId);
      fetchStudentLists(homeworkId);
      setSelectedCol(col);
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
      setActiveView('list-homework');
    };

    useEffect(() => {
      getTeacherListApi();
    }, [getCoordinateTeacherHomeworkDetails, dateRange, activeView,moduleIdCord]);

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


          if (selectedTeacherByCoordinatorToCreateHw !== false) {
            let myResult = result.data.result.filter(
              (item) => item.user_id == selectedTeacherByCoordinatorToCreateHw
            );
            // console.log(myResult, '=========myResult===');
            newCoorTechID = myResult[0].user_id;
            setselectedCoTeacherOptValue(myResult[0]);
            setSelectedTeacherUser_id(newCoorTechID);
          } 

          if (activeView === 'list-homework') {
            if (startDate && endDate) {
              // getCoordinateTeacherHomeworkDetails(
              //   2,
              //   startDate.format('YYYY-MM-DD'),
              //   endDate.format('YYYY-MM-DD')
              // );

              getCoordinateTeacherHomeworkDetails(
                moduleIdCord,
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
      if(value?.user_id > 0){
        setSelectedTeacherUser_id(value?.user_id);
        setselectedCoTeacherOptValue(value);
        getCoordinateTeacherHomeworkDetails(moduleIdCord, startDate, endDate, value.user_id);
      }
     
    };
    

    const renderRef = useRef(0);

    renderRef.current += 1;

    const tableContainer = useRef(null);

    return (
      <>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
          <div className='message_log_wrapper'>
            <div className='message_log_breadcrumb_wrapper'>
              <CommonBreadcrumbs componentName='Homework' />
            </div>
            <div className='message_log_white_wrapper'>
              <div className='date-container'>
                <Grid container spacing={5}>
                  <Grid item xs={3}>
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

                  <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={MomentUtils}>
                      {/* <div className='date-picker-container'>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        clearable
                        value={startDate}
                        placeholder='Start Date'
                        onChange={(date) => handleStartDateChange(date)}
                        format='YYYY-MM-DD'
                        label='Start Date'
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  <div className='date-picker-container'>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        placeholder='End Date'
                        value={endDate}
                        onChange={(date) => handleEndDateChange(date)}
                        format='YYYY-MM-DD'
                        label='End Date'
                      />
                    </MuiPickersUtilsProvider>
                  </div> */}
                      <DateRangePicker
                        startText='Select-dates'
                        // endText='End-date'
                        value={dateRange}
                        // calendars='1'
                        onChange={(newValue) => {
                          console.log(newValue);
                          setDateRange(newValue);
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
                                style={{ minWidth: '250px' }}
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
              </div>
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

              {activeView === 'list-homework' && (
                <div className='create_group_filter_container'>
                  <Grid container className='homework_container' spacing={2}>
                    <Grid xs={12} md={selectedCol.subject ? 8 : 12} item>
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
                      )}
                    </Grid>
                    {selectedCol.subject && (
                      <HomeWorkCard
                        height={tableContainer.current?.offsetHeight}
                        data={selectedCol}
                        evaluatedStudents={evaluatedStudents}
                        unevaluatedStudents={unevaluatedStudents}
                        submittedStudents={submittedStudents}
                        loading={fetchingStudentLists}
                        onClick={handleViewReceivedHomework}
                      />
                    )}
                  </Grid>
                </div>
              )}
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
  selectedTeacherByCoordinatorToCreateHw:state.teacherHomework.selectedTeacherByCoordinatorToCreateHw,
});

const mapDispatchToProps = (dispatch) => ({
  getCoordinateTeacherHomeworkDetails: (
    moduleIdCord,
    startDate,
    endDate,
    selectedTeacherUser_id
  ) => {
    dispatch(
      fetchCoordinateTeacherHomeworkDetails(
        moduleIdCord,
        startDate,
        endDate,
        selectedTeacherUser_id
      )
    );
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
  fetchStudentLists: (id) => {
    dispatch(fetchStudentsListForTeacherHomework(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoordinatorTeacherHomework);
