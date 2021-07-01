import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  Button,IconButton,
  Grid,TextField
} from '@material-ui/core';
import { Autocomplete,Pagination } from '@material-ui/lab/';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../config/axios';
import MobileDatepicker from './MobileDatePicker'
import endpoints from 'config/endpoints';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';

// import '../student-homework/student-homework.css';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(1),
    },
    root1:{
      flexGrow:1,
      margin:10,
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

const StudentClassWorkReport = () => {
//   const moduleId= 178;
  const classes = useStyles();
//   const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
//   const [moduleId, setModuleId] = useState();
  const [tableDisplay, setTableDisplay] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportHeaderData, setReportHeaderData] = useState([]);
  const [gradesGet, setGradesGet] = useState();
   const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);

  useEffect(() => {
    callApiReportData();
  }, [startDate, endDate]);

//   useEffect(() => {
//     if (NavData && NavData.length) {
//       NavData.forEach((item) => {
//         if (
//           item.parent_modules === 'Classwork' &&
//           item.child_module &&
//           item.child_module.length>0
//         ){
//           item.child_module.forEach((item) => {
//             if (item.child_name === 'Student Homework') {
//               setModuleId(item.child_id);
//             }
//           });
//         }
//     }
//   }, []);
const checkDate=()=>{
  console.log(startDate,endDate,'******')
  // axiosInstance
  //     .get(
  //       `/academic/student_classwork_report/?start_date=${startDate}&end_date=${endDate}`
  //     )
  //     .then((res) => {
  //       console.log(res.data.result, 'Teacher-homework');
  //       if (res.data.status_code==200) {
  //         setReportData(res?.data?.result?.cw_report);
  //         setReportHeaderData(res?.data?.result?.cw_report);
  //         setTableDisplay(true);
  //       } else {
  //         setTableDisplay(false);
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.message === "Cannot read property 'hw_given' of undefined") {
  //         setAlert('error', 'No data present');
  //       } else {
  //         setAlert('error', error.message);
  //       }
  //     });
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
  const callApiReportData = () => {
     axiosInstance
      .get(
        `/academic/student_classwork_report/?start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        console.log(res.data.result, 'Teacher-homework');
        if (res.data.status_code==200) {
          setReportData(res?.data?.result?.cw_report);
          setReportHeaderData(res?.data?.result?.cw_report);
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
    <>
      <Layout>
          <Grid container direction='row'>
          <Grid item md={12} xs={12} style={{marginTop:"10px",marginLeft:'10px',marginBottom:'70px'}}>
            <Grid container spacing={2} justify='middle' className='signatureNavDiv'>
              <Grid item md={12} xs={12} style={{ display: 'flex' }}>         
               <CommonBreadcrumbs
            componentName={`Online Class`}
            childComponentName={`Student Classwork Report`}
          />
          </Grid>
          </Grid>
          </Grid>
        </Grid>
        <form>
           <div className={classes.root1} style={{marginLeft:'15px'}}>
            <Grid container spacing={3} direction='row'>
               {/* <Grid item  md={3} xs={12}>
                  <MobileDatepicker
                onChange={(date) => handleEndDateChange(date)}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
               </Grid> */}
               <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={MomentUtils} className='dropdownIcon'>
              <DateRangePicker
                startText='Select-Date-Range'
                size='small'
                value={dateRangeTechPer || ''}
                onChange={(newValue) => {
                  // setDateRangeTechPer(newValue);
                  handleDate(newValue)
                  // setDateRangeTechPer(()=>newValue);
                // checkDate()
                }}

                renderInput={({ inputProps, ...startProps }, endProps) => {
                  return (
                    <>
                      <TextField
                        {...startProps}
                        format={(date) => moment(date).format('MM-DD-YYYY')}
                        inputProps={{
                          ...inputProps,
                          value: `${moment(inputProps.value).format(
                            'MM-DD-YYYY'
                          )} - ${moment(endProps.inputProps.value).format('MM-DD-YYYY')}`,
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
            </Grid>
           </div>
        </form>
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
                        <TableCell>S.No</TableCell>
                        <TableCell>Total ClassWork Submitted</TableCell>
                        <TableCell>Total ClassWork Not Submitted</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className='table_body'>
                          <TableRow >
                             <TableCell align='center'>
                                 1
                                 </TableCell> 
                            <TableCell align='center'>
                                {reportData.total_classwork_submitted}
                                
                            </TableCell>
                            <TableCell align='center'>
                                    {reportData.total_classwork_submitted}
                                </TableCell>
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
    </>
  );
};

export default StudentClassWorkReport;
