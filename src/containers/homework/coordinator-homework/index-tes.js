/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef } from 'react';
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
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  fetchTeacherHomeworkDetails,
  setSelectedHomework,
  fetchStudentsListForTeacherHomework,
} from '../../../redux/actions';
import HomeworkRow from '../teacher-homework/homework-row';
import ViewHomework from '../teacher-homework/view-homework';
import ViewHomeworkSubmission from './view-homework-submission';
import teacherHomework from '../teacher-homework';

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
    getTeacherHomeworkDetails,
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
    ...props
  }) => {
    const [value, setValue] = useState([null, null]);
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
      const endDate = getDaysAfter(date.clone(), 6);
      setEndDate(endDate);
      setStartDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, date, endDate);
    };

    const handleEndDateChange = (date) => {
      const startDate = getDaysBefore(date.clone(), 6);
      setStartDate(startDate);
      setEndDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, startDate, date);
    };

    const handleSelectCol = (col) => {
      const { homeworkId } = col;
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
      getTeacherHomeworkDetails(2, startDate, endDate);
    }, [getTeacherHomeworkDetails, startDate, endDate]);

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
                <div className='date-picker-container'>
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
                    <Grid xs={12} md={8} item>
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
                        unSubmittedStudents={unSubmittedStudents}
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
  unSubmittedStudents: state.teacherHomework.unSubmittedStudents,
  unevaluatedStudents: state.teacherHomework.unevaluatedStudents,
  fetchingStudentLists: state.teacherHomework.fetchingStudentLists,
});

const mapDispatchToProps = (dispatch) => ({
  getTeacherHomeworkDetails: (moduleId, startDate, endDate) => {
    dispatch(fetchTeacherHomeworkDetails(moduleId, startDate, endDate));
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
  fetchStudentLists: (id) => {
    dispatch(fetchStudentsListForTeacherHomework(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoordinatorTeacherHomework);


/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect, useRef } from 'react';
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
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
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
  fetchTeacherHomeworkDetails,
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
    getTeacherHomeworkDetails,
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
    ...props
  }) => {
    const [value, setValue] = useState([null, null]);
    const [activeView, setActiveView] = useState('list-homework');
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    const [selectedCol, setSelectedCol] = useState({});
    // const [branchList, setBranchList] = useState([]);
    // const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    // const [isEmail, setIsEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [moduleId, setModuleId] = useState();
    // const [modulePermision, setModulePermision] = useState(true);
    const [selectedCoTeacherOptValue, setselectedCoTeacherOptValue] = useState([]);
    const [selectedCoTeacherOpt, setSelectedCoTeacherOpt] = useState([]);

    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
    const [viewHomework, setViewHomework] = useState({
      subjectId: '',
      date: '',
      subjectName: '',
    });
    // const [selectedTeacher, selectedTeacher] = useState([]);
    const [receivedHomework, setReceivedHomework] = useState({
      studentHomeworkId: '',
      date: '',
      subjectName: '',
    });

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
      const endDate = getDaysAfter(date.clone(), 6);
      setEndDate(endDate);
      setStartDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, date, endDate);
    };

    const handleEndDateChange = (date) => {
      const startDate = getDaysBefore(date.clone(), 6);
      setStartDate(startDate);
      setEndDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, startDate, date);
    };

    const handleSelectCol = (col) => {
      const { homeworkId } = col;
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
      getTeacherListApi(2, startDate, endDate);     
    }, [getTeacherHomeworkDetails, startDate, endDate]);

    
    const getTeacherListApi = async () => {
      try {
        setLoading(true);
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
          getTeacherHomeworkDetails(2, startDate, endDate);
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


    const handleCoordinateTeacher = (event, value) => {
      alert("dgshfj")
     
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
              <div className='homework_block_wrapper '>
                <div className='add-homework-container'>
                  <Grid>
                    <Autocomplete
                      size='small'
                      id='Teacher'

                      options={selectedCoTeacherOpt}
                      getOptionLabel={(option) => option?.name}
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
                </div>
                <div className='date-picker-container'>
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
                </div>
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
                    <Grid xs={12} md={8} item>
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
                        unSubmittedStudents={unSubmittedStudents}
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
  unSubmittedStudents: state.teacherHomework.unSubmittedStudents,
  unevaluatedStudents: state.teacherHomework.unevaluatedStudents,
  fetchingStudentLists: state.teacherHomework.fetchingStudentLists,
});

const mapDispatchToProps = (dispatch) => ({
  getTeacherHomeworkDetails: (moduleId, startDate, endDate) => {
    dispatch(fetchTeacherHomeworkDetails(moduleId, startDate, endDate));
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
  fetchStudentLists: (id) => {
    dispatch(fetchStudentsListForTeacherHomework(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoordinatorTeacherHomework);
