import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  Grid,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../config/axios';
import MobileDatepicker from '../homework/student-homework/student-homework-mobile-datepicker'
// import MobileDatepicker from '../../student-homework/student-homework-mobile-datepicker';
// import '../student-homework/student-homework.css';
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
  table: {
    width: '98%',
    marginLeft: '3px',
    marginTop: '85px',
  },
}));

const TeacherClassWorkReport = () => {
  const module_id= 178;
  const classes = useStyles();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [moduleId, setModuleId] = useState();
  const [tableDisplay, setTableDisplay] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportHeaderData, setReportHeaderData] = useState([]);
  useEffect(() => {
    callApiReportData();
  }, [startDate, endDate, moduleId]);
  const handleStartDateChange = (date) => {
    const endDate = getDaysAfter(date.clone(), 6);
    setEndDate(endDate);
    setStartDate(date.format('YYYY-MM-DD'));
    // getTeacherHomeworkDetails(2, date, endDate);
  };

  const handleEndDateChange = (date) => {
    const startDate = getDaysBefore(date.clone(), 6);
    setStartDate(startDate);
    setEndDate(date.format('YYYY-MM-DD'));
    // getTeacherHomeworkDetails(2, startDate, date);
  };
  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }

  // useEffect(() => {
  //   if (NavData && NavData.length) {
  //     NavData.forEach((item) => {
  //       if (
  //         item.parent_modules === 'Homework' &&
  //         item.child_module &&
  //         item.child_module.length > 0
  //       ) {
  //         item.child_module.forEach((item) => {
  //           if (item.child_name === 'Teacher Homework') {
  //             setModuleId(item.child_id);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, []);
  const callApiReportData = () => {
    axiosInstance
      .get(
        `/academic/teacher-homework-count/?module_id=${moduleId}&start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        console.log(res, 'Teacher-homework');
        if (res.data.data.header[0].subject_name) {
          setReportData(res?.data.data);
          setReportHeaderData(res?.data?.header);
          setTableDisplay(true);
        } else {
          setTableDisplay(false);
        }
      })
      .catch((error) => {
        if (error.message === "Cannot read property 'hw_given' of undefined") {
          setAlert('error', 'No data present');
        } else {
          setAlert('error', error.message);
        }
      });
  };
  return (
    <div>
      <Layout className='layout-container'>
        <div
          className='message_log_breadcrumb_wrapper'
          style={{ backgroundColor: '#F9F9F9' }}
        >
          <CommonBreadcrumbs  componentName='Classwork Report' />
        </div>
        <div className='create_group_filter_container'>
          <Grid container spacing={5} className='message_log_container'>
            <div className='mobile-date-picker'>
              <MobileDatepicker
                onChange={(date) => handleEndDateChange(date)}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
            </div>
          </Grid>
        </div>
        <div className={classes.table}>
          {' '}
          <Paper className={`homework_table_wrapper ${classes.root}`}>
            {tableDisplay ? (
              <>
                <TableContainer
                  className={`table table-shadow homework_table ${classes.container}`}
                >
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead className='view_groups_header tb-header'>
                      <TableRow>
                        <TableCell className='homework_header homework_header_dropdown_wrapper'>
                          Titles
                        </TableCell>
                        <TableCell>ClassWork given</TableCell>
                        <TableCell>Number of Submitted</TableCell>
                        <TableCell>Number of Student Evaluated</TableCell>
                        <TableCell>Number of Student Not Evaluated</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className='table_body'>
                      {reportData?.rows &&
                        reportData?.rows.map((data) => (
                          <TableRow>
                            <TableCell className='homework_header'>
                              {data?.subject_name}
                            </TableCell>
                            <TableCell align='middle'>{data?.status?.hw_given}</TableCell>
                            <TableCell align='middle'>
                              {data?.status?.student_submitted}
                            </TableCell>
                            <TableCell align='middle'>
                              {data?.status?.hw_evaluated}
                            </TableCell>
                            <TableCell align='middle'>
                              {data?.status?.hw_notevaluated}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <></>
            )}
          </Paper>
        </div>
      </Layout>
    </div>
  );
};

export default TeacherClassWorkReport;
