/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Input,
  OutlinedInput,
  TableBody,
  Paper,
  Menu, Fade, ListItemIcon
} from '@material-ui/core';
import {  ChevronRight as ArrowCircleRightIcon} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
import Layout from 'containers/Layout';
import clsx from 'clsx';
import moment from 'moment';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import { DashboardContextProvider } from 'containers/dashboard/dashboard-context';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import  {AlertNotificationContext} from 'context-api/alert-context/alert-state'
import axios from 'axios';
import { apiConfig } from 'containers/dashboard/dashboard-constants';
import DownloadReport from './downloadReport'

const useStyles = makeStyles((theme) => ({
  gradeDiv: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },

  cardContantFlex: {
    display: 'flex',
    alignItems: 'center',
  },
  cardLetter: {
    padding: '6px 10px',
    borderRadius: '8px',
    margin: '0 10px 0 0',
    fontSize: '1.4rem',
  },
  absentDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid red',
    padding: '0 5px',
  },
  link: {
    cursor: 'pointer',
    color: 'blue',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  colorBlue: {
    color: 'blue',
  },
  colorRed: {
    color: 'lightpink',
  },
  colorWhite: {
    color: 'white',
  },
  backgrounColorGreen: {
    backgroundColor: 'lightgreen',
  },
  backgrounColorBlue: {
    backgroundColor: 'lightblue',
  },
  backgrounColorRed: {
    backgroundColor: 'lightpink',
  },
  colorBlue: {
    color: '#4180e7',
    fontWeight: 'bolder',
  },
  colorRed: {
    color: '#ff3573',
    fontWeight: 'bolder',
  },
  colorGreen: {
    color: '#08cf39',
    fontWeight: '900',
  },
  colorYellow: {
    color: '#f89910',
    fontWeight: '900'

  },
  clickable: {
    cursor: 'pointer',
  },
  TableHeaderColor: {
    backgroundColor: '#FFD9D9',
    border: '1px solid #D7E0E7',
    borderRadius: '8px 8px 0px 0px',
    color:'black',
    fontWeight:'bolder',
    fontSize:'20px'
  },
  tableAlignLeft : {
    textAlign:'left !important'
  },
  tableAlignRight : {
    textAlign:'right !important'
  },
  branchTableFont : {
    fontWeight:'bolder !important',
    '&:hover' : {
      textDecoration: 'underline',
      color:'#4768A1',
      cursor:'pointer'
    },
    
  },
  tableHeadText : {
    fontWeight:'bolder',
    color:'#F39494',
    font: 'normal normal medium 20px/24px Rubik',
    textAlign:'left'
  }
}));


const CurriculumCompletionBranchWise = (props) => {
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  // const branch = data?.role_details?.branch;
  // const selectedBranchId = branch?.map((el) => el?.id);
  const history = useHistory();
  const [expanded, setExpanded] = useState(true);
  const [feesStatus, setFeesStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [propsData,setPropsData] = useState([]);
  const [moduleId,setModuleId] = useState(null);
  const [iscurriculam,setIsCurriculam] = useState(false)

  const [date, setDate] = useState('');
  const { session_year: sessionYearId = '' } =
    JSON.parse(sessionStorage.getItem('acad_session')) || {};
  let dateToday = moment().format('YYYY-MM-DD');

  // const handleDateClass = (e) => {
  //   setDate(e.target.value);
  // };

  useEffect(() => {
    setPropsData(history?.location?.state?.branchData)
    setModuleId(history?.location?.state?.module_id)
    setIsCurriculam(history?.location?.state?.iscurriculam)
  },[history])




  // const handleChange = () => {
  //   // console.log('hello');
  //   setExpanded(expanded ? false : true);
  // };

  // const handleVolumeChange = (event) => {
  //   setVolume(event.target.value);
  // };

  // useEffect(() => {
  //   if (history?.location?.state?.filter === true) {
  //     const branchIds = history?.location?.state?.branch.map((el) => el?.branch?.id)
  //     feesStatusAllBranch({ academic_year: sessionYearId, branch: branchIds.toString() })
  //   } else {
  //     feesStatusAllBranch({ academic_year: sessionYearId, branch: selectedBranchId.toString() });
  //   }
  //   setLoading(true);
  // }, []);

  // const feesStatusAllBranch = async (params = {}) => {
  //   axiosInstance
  //     .get(`${endpoints.ownerDashboard.getFeesForAllBranch}`, {
  //       params: { ...params },
  //     })
  //     .then((res) => {
  //       setLoading(false)
  //       setFeesStatus(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const handleRote = (branchName, branchId) => {
  //   history.push({
  //     pathname: `/fees-status-branch-wise-details/${branchId}`,
  //     state: {
  //       branchName: branchName,
  //       branchId: branchId
  //     }
  //   })
  // }
const AttendanceGradeRoute = (each) => {
  history.push({
    pathname: `/attendance-report/${each?.branch?.id}`,
    state: {
      acad_session_id: each?.id,
      module_id: moduleId,
    },
  });
}

const handleRouteGrade = (each) => {
  iscurriculam ? curriculamGradeRoute(each) : AttendanceGradeRoute(each)
}

  const curriculamGradeRoute =(each) => {
    history.push({
      pathname: `/curriculum-completion/${each?.branch?.id}`,
      state : {
        branchId:each?.branch?.id,
        acad_sess_id : each?.id,
        branchName:each?.branch?.branch_name,
        acad_session_id:each?.session_year?.id,
        module_id:moduleId
      }
    })
  }

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3} justifyContent='space-between'>
          <Grid item xs={12}>
          < CommonBreadcrumbs 
          componentName='Dashboard'
          childComponentName='Academic Performance' 
          childComponentNameNext = {iscurriculam ? 'Curriculum Completion' : 'Attendance Report'}
          />

          </Grid>
          <Grid item xs={6}>
            {/* <OutlinedInput
              margin='dense'
              // type={values.showPassword ? 'text' : 'password'}
              // value={values.password}
              // onChange={handleChange('password')}
              placeholder='Search'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                  //   onClick={handleClickShowPassword}
                  //   onMouseDown={handleMouseDownPassword}
                  >
                    <SearchSharpIcon />
                  </IconButton>
                </InputAdornment>
              }
            /> */}
          </Grid>
          <Grid item xs={12} style ={{display : 'flex',justifyContent : 'space-between'}}>
            <Typography variant='body1' className={clsx(classes.tableHeadText)}>
                {/* Curriculum Completion Details */}
                {iscurriculam ? 'Curriculum Completion Details' : 'Student Attendance Report'}
            </Typography>
            {!iscurriculam && 
            
            <DashboardContextProvider>
            <DownloadReport title = 'Attendance' branchData = {propsData}/>
            </DashboardContextProvider>}
            
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead className={clsx(classes.TableHeaderColor)}>
                  <TableRow>
                    <TableCell className={clsx(classes.tableAlignLeft)} >Branch Details </TableCell>
                    {/* <TableCell className={clsx(classes.tableAlignRight)}>Avg.Completion </TableCell> */}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {propsData && propsData?.map((each, index) => {
                    return (
                      <TableRow key={index} onClick ={() => handleRouteGrade(each)} style={{cursor : 'pointer'}}>
                        <TableCell className={clsx(classes.tableAlignLeft, classes.branchTableFont)} >{each?.branch?.branch_name}</TableCell>
                        <TableCell className={clsx(classes.tableAlignRight)}>
                          <IconButton size='large'
                            // onClick={() => handleRote(each.branch_name, each?.branch)}
                          >
                            <ArrowCircleRightIcon />
                          </IconButton>

                        </TableCell>
                        {/* <TableCell/> */}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletionBranchWise);
