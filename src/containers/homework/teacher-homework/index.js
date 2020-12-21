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
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  SvgIcon,
  Badge,
  IconButton,
  useMediaQuery,
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

const TeacherHomework = withRouter(
  ({
    getTeacherHomeworkDetails,
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
    const [moduleId, setModuleId] = useState();
    const [modulePermision, setModulePermision] = useState(true);
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));
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
      getTeacherHomeworkDetails(3384, date, endDate);
    };

    const handleEndDateChange = (date) => {
      const startDate = getDaysBefore(date.clone(), 7);
      setStartDate(startDate);
      setEndDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, startDate, date);
    };

    const handleSelectCol = (col, view) => {
      const { homeworkId } = col;
      console.log('homework id', homeworkId);
      fetchStudentLists(homeworkId);
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

    useEffect(() => {
      const [startDate, endDate] = dateRange;
      if (teacherModuleId) {
        if (activeView === 'list-homework') {
          if (startDate && endDate) {
            getTeacherHomeworkDetails(
              teacherModuleId,
              startDate.format('YYYY-MM-DD'),
              endDate.format('YYYY-MM-DD')
            );
          }
        }
      }
    }, [getTeacherHomeworkDetails, dateRange, activeView, teacherModuleId]);

    useEffect(() => {
      const homeworkModule = NavData?.filter(
        (parent) => parent.parent_modules === 'Homework'
      );
      console.log('homeworkModule ', homeworkModule);
      const teacherModuleId =
        homeworkModule.length > 0
          ? homeworkModule[0].child_module.filter(
              (child) => child.child_name === 'Teacher Homework'
            )
          : null;

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
                console.log('item.child_id ', item.child_id);
              }
            });
          }
        });
      }
    }, []);

    const renderRef = useRef(0);

    renderRef.current += 1;

    const tableContainer = useRef(null);

    console.log('popper open', datePopperOpen);

    return (
      <>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
          <div className='message_log_wrapper'>
            <div className='message_log_breadcrumb_wrapper'>
              <CommonBreadcrumbs componentName='Homework' />
            </div>
            <div className='message_log_white_wrapper'>
              {activeView !== 'view-homework' && activeView !== 'view-received-homework' && (
                <div className='date-container'>
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
                              style={{ minWidth: '250px' }}
                              onClick={() => {
                                console.log('triggered');
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
                </div>
              )}
              {activeView !== 'view-homework' && activeView !== 'view-received-homework' && (
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
                  {activeView === 'list-homework' && (
                    <Grid xs={12} md={selectedCol?.subject ? 8 : 12} item>
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
                  )}
                  {activeView !== 'view-homework' &&
                    activeView !== 'view-received-homework' &&
                    selectedCol.subject && (
                      <HomeWorkCard
                        height={tableContainer.current?.offsetHeight}
                        data={selectedCol}
                        evaluatedStudents={evaluatedStudents}
                        unevaluatedStudents={unevaluatedStudents}
                        submittedStudents={submittedStudents}
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

export default connect(mapStateToProps, mapDispatchToProps)(TeacherHomework);
