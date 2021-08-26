import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  Grid,
  TextField,
  Button,
  SvgIcon,
  Icon,
  Slide,
  useTheme,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import MobileDatepicker from '../student-homework/student-homework-mobile-datepicker';
import '../student-homework/student-homework.css';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';

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

const StudentHomeWorkReport = () => {
  const classes = useStyles();
  // const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [moduleId, setModuleId] = useState();
  const [tableDisplay, setTableDisplay] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [selectedOtherLanguages, setSelectedOtherLanguages] = useState();
  const [reportHeaderData, setReportHeaderData] = useState([]);
   const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  useEffect(() => {
    callApiReportData();
  }, [startDate, endDate]);
  const callApiReportData = () => {
    axiosInstance
      .get(
        `/academic/student_homework_report/?start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        console.log(res, 'student-homework');
        if (res.data.status_code==200) {
          setReportData(res?.data?.result?.hw_report);
          setReportHeaderData(res?.data?.result?.hw_report);
          setTableDisplay(true);
        } else {
          setTableDisplay(false);
        }
      })
      .catch((error) => {
        if (error.message === "Cannot read property 'hw_given' of undefined") {
          setAlert('error', 'No data present');
        } else {
          // setAlert('error', error.message);
        }
      });
  };
  function checkDate(){
    console.log(startDate,endDate,'Black Panther')
    //  axiosInstance
    //   .get(
    //     `/academic/student_homework_report/?start_date=${startDate}&end_date=${endDate}`
    //   )
    //   .then((res) => {
    //     console.log(res, 'student-homework');
    //     if (res.data.status_code==200) {
    //       setReportData(res?.data?.result?.hw_report);
    //       setReportHeaderData(res?.data?.result?.hw_report);
    //       setTableDisplay(true);
    //       // setStudentHomeworkData(res?.data);
    //       // setMendaterySubjects(res.data.header?.mandatory_subjects);
    //       // setOptionalSubjects(res.data.header.optional_subjects);
    //       // setOtherSubjects(res.data.header.others_subjects);
    //       // handleChangeDataFormat();
    //     } else {
    //       setTableDisplay(false);
    //     }
  }
  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
      // console.log('start date', moment(new Date(v1[0])).format('YYYY-MM-DD'));
      // console.log('end date', moment(new Date(v1[1])).format('YYYY-MM-DD'));
    }
    setDateRangeTechPer(v1);
    checkDate();
  }
  return (
    <div>
      <Layout className='layout-container'>
        <CommonBreadcrumbs componentName='Homework Report' 
          isAcademicYearVisible={true}
        />
        <div className='create_group_filter_container'>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={MomentUtils} className='dropdownIcon'>
              <DateRangePicker
                startText='Select-Date-Range'
                size='small'
                value={dateRangeTechPer || ''}
                onChange={(newValue) => {
                  handleDate(newValue)
                  // setDateRangeTechPer(newValue);
                  // setDateRangeTechPer(()=>newValue);
                }}
                renderInput={({ inputProps, ...startProps }, endProps) => {
                  return (
                    <>
                      <TextField
                        {...startProps}
                        format={(date) => moment(date).format('DD-MM-YYYY')}
                        inputProps={{
                          ...inputProps,
                          value: `${moment(inputProps.value).format(
                            'DD-MM-YYYY'
                          )} - ${moment(endProps.inputProps.value).format('DD-MM-YYYY')}`,
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
          </Grid>
        </div>
        <div className={classes.table}>
          {' '}
          <Paper className={classes.root}>
            {tableDisplay ? (
              <>
                <TableContainer
                  className={`table table-shadow homework_table ${classes.container}`}
                >
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead className='view_groups_header tb-header'>
                      <TableRow>
                        <TableCell className='homework_header homework_header_dropdown_wrapper'>
                          S No
                        </TableCell>
                        <TableCell>Total HomeWork Got</TableCell>
                        <TableCell>Total HomeWork Submitted</TableCell>
                        <TableCell>Total HomeWork Evaluated</TableCell>
                        <TableCell>Total HomeWork Not Evaluated</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody className='table_body'>
                          <TableRow>
                            <TableCell className='homework_header'>
                              1
                            </TableCell>
                            <TableCell align='middle'>{reportData.total_hw_given}</TableCell>
                            <TableCell align='middle'>{reportData.total_hw_submitted}</TableCell>
                            <TableCell align='middle'>{reportData.total_hw_evaluated}</TableCell>
                            <TableCell align='middle'>{reportData.total_hw_not_evaluated}</TableCell>
                          </TableRow>
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

export default StudentHomeWorkReport;
