/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
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
import qs from 'qs';
import { fetchTeacherHomeworkDetails, setSelectedHomework } from '../../../redux/actions';
import HomeworkRow from './homework-row';
import ViewHomework from './view-homework';

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

const TeacherHomework = withRouter(
  ({
    getTeacherHomeworkDetails,
    homeworkCols,
    homeworkRows,
    fetchingTeacherHomework,
    onSetSelectedHomework,
    history,
    ...props
  }) => {
    const [value, setValue] = useState([null, null]);
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
      isOpen: false,
      subjectId: '',
      date: '',
      subjectName: '',
    });

    const handleViewHomework = ({ date, subject: subjectName, subjectId }) => {
      setViewHomework({
        isOpen: true,
        subjectId,
        date,
        subjectName,
      });
    };

    const handleStartDateChange = (date) => {
      const endDate = getDaysAfter(date.clone(), 7);
      setEndDate(endDate);
      setStartDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, date, endDate);
    };

    const handleEndDateChange = (date) => {
      const startDate = getDaysBefore(date.clone(), 7);
      setStartDate(startDate);
      setEndDate(date.format('YYYY-MM-DD'));
      getTeacherHomeworkDetails(2, startDate, date);
    };

    useEffect(() => {
      console.log('dytes***', startDate, endDate);
      getTeacherHomeworkDetails(2, startDate, endDate);
    }, [getTeacherHomeworkDetails, startDate, endDate]);

    const renderRef = useRef(0);

    renderRef.current += 1;

    console.log(
      'rerenders ',
      renderRef.current,
      homeworkCols.length,
      homeworkRows.length,
      startDate,
      endDate
    );
    // useEffect(() => {
    //   console.log('dytes***', startDate, endDate);
    // }, []);

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
              {viewHomework.isOpen ? (
                <ViewHomework
                  viewHomework={viewHomework}
                  setViewHomework={setViewHomework}
                />
              ) : (
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
                        <Paper className={`homework_table_wrapper ${classes.root}`}>
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
                                    setSelectedCol={(col) => {
                                      setSelectedCol(col);
                                      onSetSelectedHomework(col);
                                    }}
                                    handleViewHomework={handleViewHomework}
                                  />
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      )}
                    </Grid>
                    {selectedCol.subject && <HomeWorkCard data={selectedCol} />}
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
});

const mapDispatchToProps = (dispatch) => ({
  getTeacherHomeworkDetails: (moduleId, startDate, endDate) => {
    dispatch(fetchTeacherHomeworkDetails(moduleId, startDate, endDate));
  },
  onSetSelectedHomework: (data) => {
    dispatch(setSelectedHomework(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherHomework);
