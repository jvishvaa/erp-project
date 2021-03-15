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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  ClickAwayListener,
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
import AddHomework from '../../../assets/images/AddHomework.svg';
import CancelIcon from '../../../assets/images/Cancel-icon.svg';
import './styles.scss';
import {
  fetchTeacherHomeworkDetails,
  setSelectedHomework,
  fetchStudentsListForTeacherHomework,
} from '../../../redux/actions';
import HomeworkRow from './homework-row';
import ViewHomework from './view-homework';
import ViewHomeworkSubmission from './view-homework-submission';
import { Tabs, Tab } from '../../../components/custom-tabs';
import hwEvaluatedIcon from '../../../assets/images/hw-evaluated.svg';
import expiredIcon from '../../../assets/images/Expired.svg';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
    unSubmittedStudents,
    fetchingStudentLists,
    fetchStudentLists,
    history,
    ...props
  }) => {
    const [dateRange, setDateRange] = useState([
      moment().startOf('isoWeek'),
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
    const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));
    const [setClassname, setClassNameForcontainer] = useState('');
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
      //  setClassNameForcontainer("home-wrapper")
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

    const navigateToAddScreen = ({ date, subject, subjectId }) => {
      history.push(`/homework/add/${date}/${subject}/${subjectId}`);
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

    console.log('homeworkCols', homeworkCols);

    return (
      <>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
          <div className=' teacher-homework message_log_wrapper'>
            <div
              className='message_log_breadcrumb_wrapper'
              style={{ backgroundColor: '#F9F9F9' }}
            >
              <CommonBreadcrumbs componentName='Homework' />
            </div>
            <div className='message_log_white_wrapper'>
              {activeView !== 'view-homework' && activeView !== 'view-received-homework' && (
                <div className='date-container' >
                  <ClickAwayListener onClickAway={(e) => {setDatePopperOpen(false)}}>
                    <LocalizationProvider
                      dateAdapter={MomentUtils}
                      style={{ backgroundColor: '#F9F9F9' }}
                    >
                      <DateRangePicker
                        id='date-range-picker-date'
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
                                InputProps={{
                                  ...inputProps,
                                  value: `${moment(inputProps.value).format(
                                    'DD-MM-YYYY'
                                  )} - ${moment(endProps.inputProps.value).format(
                                    'DD-MM-YYYY'
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
                  </ClickAwayListener>
                </div>
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
                      <span>Expired</span>
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
                              <span style={{ fontSize: '16px' }}>Add Homework</span>
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
                              <span style={{ fontSize: '16px' }}>HW Evaluated</span>
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
                              <span style={{ fontSize: '16px' }}>HW Assigned</span>
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
                              <span style={{ fontSize: '16px' }}>Students Submitted</span>
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
                              <span>Evaluated</span>
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
                              <span style={{ fontSize: '16px' }}>Expired</span>
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
                            className={`homework_table_wrapper ${classes.root}`}
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
                                        <TableCell style={{width: '250px !important'}}>
                                          {col.subject_name.split('_').join('/')}
                                        </TableCell>
                                      ) : (
                                        <TableCell style={{width: '250px !important'}}>{col}</TableCell>
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
                        onClose={() => {
                          setActiveView('list-homework');
                          setSelectedCol({});
                        }}
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
  fetchStudentLists: (id, subjectId) => {
    dispatch(fetchStudentsListForTeacherHomework(id, subjectId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherHomework);
