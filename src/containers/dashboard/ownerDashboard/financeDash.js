/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Divider,
  Button,
  Typography,
  InputAdornment,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  Tooltip,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowRightAlt as ArrowRightAltIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
import Layout from '../../Layout';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import AcadView from './academic/academicView';
import { blue, red } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/ChevronRight';
import Loading from '../../../components/loader/loader';
import axios from 'axios';
import endpoints from 'config/endpoints';
import RefreshIcon from '@material-ui/icons/Refresh';
import apiRequest from '../StudentDashboard/config/apiRequest';

// import Box from '@mui/material/Box';
// import Box from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  studentStrenghtDownloadButton: {
    width: '100%',
    color: theme.palette.secondary.main,
    backgroundColor: 'white !important',
    border: `1px solid ${theme.palette.primary.main} !important`,
  },
  cardContant: {
    padding: '8px',
  },
  lookALikeButton: {
    width: '100%',
    margin: '5px 0 0 0',
    // backgroundColor: 'rgba(0,0,0,0.1)',
    // borderRadius: '8px',
    padding: '5px',
    textAlign: 'center',
  },

  colorGreen: {
    color: 'lightgreen',
    textDecoration: 'underline',
  },
  colorRed: {
    color: 'red',
    textDecoration: 'underline',
  },
  colorYellow: {
    color: 'yellow',
    textDecoration: 'underline',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  clickable: {
    cursor: 'pointer',
  },
  textBold: {
    fontWeight: '800',
  },
  customTextSize: {
    fontSize: '15px',
  },
  textBoldRandom: {
    fontWeight: '800',
    color: 'blue',
  },
  absentGrid: {
    // border: '1px solid red',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px',
  },
  detailsDiv: {
    borderRadius: '5px',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    margin: '5px 0',
  },
  accordion: {
    margin: '10px 0 !important',
    border: '1px solid black',
    '&::before': {
      backgroundColor: 'black',
    },
  },
  applyColor1: {
    backgroundColor: 'lavenderblush',
  },
  applyColor2: {
    backgroundColor: 'lightgreen',
  },
  applyBorder: {
    // backgroundColor: 'lightgreen',
    border: '1px solid lightgrey',
  },
  applyColor3: {
    backgroundColor: 'aliceblue',
  },
  cuirularButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '80%',
  },
  transactionTable: {
    border: '1px solid lightgrey',
    display: 'flex',
    borderRadius: '5px',
  },
  transactionTextDesign: {
    fontSize: '10px',
  },
  transactionTextDesignLeft: {
    textAlign: 'right',
    fontSize: '10px',
  },
  transactionTextDesignGray: {
    textAlign: 'right',
    fontSize: '10px',
    color: 'grey',
  },
  viewButton: {
    color: 'black',
    textAlign: 'right',
    backgroundColor: 'white',
    fontSize: '15px',
  },
  viewButtonAlign: {
    textAlign: 'right',
  },
  roleStyle: {
    fontWeight: 'bold',
    color: '#4180e7',
  },
  fontDesign: {
    fontSize: '12px',
  },
  fontColor2: {
    color: '#ff3573',
  },
  fontColor3: {
    color: '#08cf39',
  },
  cardtopicStyle: {
    fontSize: '15px',
  },
  customLeftText: {
    textAlign: 'left',
  },
  // customBorder: {
  //   borderLeft:'2px solid grey',
  //   borderRight:'2px solid grey',
  //   paddingLeft:'10px',
  //   paddingRight:'10px'
  //   // borderRadius:'5px'
  // }
}));

const arr = [
  {
    branchName: 'Branch 1',
    curriculumCompletion: '7%',
    studentReport: '85%',
    attendanceReport: '85%',
  },
  {
    branchName: 'Branch 2',
    curriculumCompletion: '71%',
    studentReport: '86%',
    attendanceReport: '86%',
  },
  {
    branchName: 'Branch 3',
    curriculumCompletion: '72%',
    studentReport: '87%',
    attendanceReport: '87%',
  },
];

const todayArray = [
  {
    role: 'Admins',
    total: '5',
    present: '4',
    absent: '4',
  },
  {
    role: 'Teacher',
    total: '1250',
    present: '1150',
    absent: '50',
  },
  {
    role: 'Staffs',
    total: '1250',
    present: '1150',
    absent: '50',
  },
  {
    role: 'Students',
    total: '1250',
    present: '1150',
    absent: '50',
  },
];

const transaction = [
  {
    bank: 'via Online Banking',
    branch: 'Branch Name 1',
    time: '30min ago',
    amount: '₹ 48,000',
  },
  {
    bank: 'via Online Banking',
    branch: 'Branch Name 1',
    time: '30min ago',
    amount: '₹ 48,000',
  },
  {
    bank: 'via Online Banking',
    branch: 'Branch Name 1',
    time: '30min ago',
    amount: '₹ 48,000',
  },
  {
    bank: 'via Online Banking',
    branch: 'Branch Name 1',
    time: '30min ago',
    amount: '₹ 48,000',
  },
];
const FinanceOwnerDashboard = (props) => {
  const classes = useStyles();
  const history = useHistory();
  console.log(props);

  const [academicPerformanceDetailsOpen, setAcademicPerformanceDetailsOpen] =
    useState(false);
  const [expanded, setExpanded] = useState(true);
  const [volume, setVolume] = React.useState('');
  const [isAcad, setIsAcad] = useState(false);
  const [curriculumData, setCurriculumData] = useState([]);
  const [studentReportData, setStudentReportData] = useState();
  const [testScoreData, setTestScoreData] = useState();
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleChange = (each, value) => (e, isExpanded) => {
    const testclick = document.querySelectorAll('#branchWise');
    console.log(isExpanded, 'each');
    console.log(each, 'ind');
    setClicked(true);
    setLoading(true);
    setExpanded(isExpanded ? value : false);
    getCurriculumReport(each?.branch?.id, each?.id);
    getStudentReport(each?.branch?.id, each?.session_year?.id);
    getTestScore(each?.id);
  };

  const AcadPerformanceClick = () => {
    setIsAcad(true);
  };

  const getCurriculumReport = (branch, acad) => {
    axios
      .get(
        `${endpoints.ownerDashboard.getCurrReport}?branch_id=${branch}&acad_session_id=${acad}`,
        {
          headers: {
            'X-DTS-Host': window.location.host,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'currreport');
        setCurriculumData(res.data.result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getStudentReport = (branch, year) => {
    // axios
    //   .get(
    //     `${endpoints.ownerDashboard.getStudentAttendance}?branch_id=${branch}&session_year_id=${year}`,
    //     {
    //       headers: {
    //         'X-DTS-Host': window.location.host,
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    apiRequest('get',`${endpoints.ownerDashboard.getStudentAttendance}?branch_id=${branch}&session_year_id=${year}` , null ,null , true , 5000)
      .then((res) => {
        console.log(res, 'stureport');
        setStudentReportData(res.data.result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getTestScore = (acad) => {
    // axios
    //   .get(`${endpoints.ownerDashboard.getAvgTest}?acad_session_id=${acad}`, {
    //     headers: {
    //       'X-DTS-Host': window.location.host,
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
      apiRequest('get',`${endpoints.ownerDashboard.getAvgTest}?acad_session_id=${acad}` , null ,null , true ,5000)
      .then((res) => {
        console.log(res, 'avgport');
        setTestScoreData(res.data.result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (props?.branchList?.length > 0) {
      getCurriculumReport(props?.branchList[0]?.branch?.id, props?.branchList[0]?.id);
      getStudentReport(
        props?.branchList[0]?.branch?.id,
        props?.branchList[0]?.session_year?.id
      );
      getTestScore(props?.branchList[0]?.id);
    }
  }, [props?.branchList]);

  const handleAttendance = (each) => {
    history.push({
      pathname: `/attendance-report/${each?.branch?.id}`,
      state: {
        acad_session_id: each?.id,
        module_id: props?.moduleId,
      },
    });
  };

  const handleStudentreport = (each) => {
    // console.log("hit");
    history.push(`/student-report-dash/${each?.branch?.id}`);
  };

  const handleRoute = (data) => {
    console.log(data);
    // history.push(`/curriculum-completion/${data.branch.id}/`)
    history.push({
      pathname: `/curriculum-completion/${data?.branch?.id}`,
      state: {
        acad_session_id: data?.id,
        module_id: props?.moduleId,
      },
    });
  };

  const staffRedirect = () => {
    history.push({
      pathname: '/staff-attendance-report/branch-wise',
      state: {
        acadId: props?.branchList,
      },
    });
  };

  const feeredirect = () => {
    if (user_level != 10) {
      if (props?.branchCounter === true) {
        history.push({
          pathname: '/fees-table-status',
          state: {
            branch: props?.branchList,
            filter: true,
          },
        });
      } else {
        history.push('/fees-table-status');
      }
    }
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
      <Grid item container spacing={2}>
        {academicPerformanceDetailsOpen === false ? (
          <>
            <Grid item xs={12}>
              <Card elevation={0}>
                <CardHeader
                  title={
                    <Typography
                      // variant='h5'
                      className={clsx(classes.clickable, classes.cardtopicStyle)}
                      style={{ display: 'flex' }}
                      // onClick={() => setAcademicPerformanceDetailsOpen(true)}
                      onClick={staffRedirect}
                    >
                      <b>Today's Attendance Overview :</b>{' '}
                      {props?.branchCounter ? (
                        <Tooltip
                          title={
                            props?.selectedBranch &&
                            props?.selectedBranch?.map(
                              (item) => item?.branch?.branch_name + ' '
                            )
                          }
                        >
                          <Chip
                            variant='outlined'
                            size='small'
                            // icon={props?.selectedBranch?.length}
                            avatar={<Avatar>{props?.selectedBranch?.length}</Avatar>}
                            label={' Branch Selected'}
                          />
                        </Tooltip>
                      ) : (
                        // <div style={{ display: 'flex' }}>
                        //   {props?.selectedBranch &&
                        //     props?.selectedBranch?.map((item) => (
                        //       <div style={{ margin: '0 5px' }}>
                        //         {item?.branch?.branch_name}
                        //       </div>
                        //     ))}
                        // </div>
                        <>All Branch</>
                      )}
                    </Typography>
                  }
                  action={
                    <Button
                      className={clsx(classes.viewButton)}
                      aria-label='view all'
                      onClick={props.handleTodayAttendance}
                    >
                      <RefreshIcon style={{ color: 'blue' }} />
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  {props?.todayCounter ? (
                    <Grid container spacing={2}>
                      {props?.roleWiseAttendance?.length > 0 &&
                        props?.roleWiseAttendance.map((each, index) => (
                          <Grid item xs={3}>
                            <div
                              className={clsx(classes.detailsDiv, classes.applyBorder)}
                            >
                              <div>
                                <Typography
                                  className={clsx(classes.roleStyle)}
                                  variant='body2'
                                >
                                  <b>{each.role_name}</b>
                                </Typography>
                                <Typography
                                  className={clsx(classes.fontDesign)}
                                  variant='body2'
                                >
                                  <b>Total : {each?.total_people}</b>
                                </Typography>
                                <Typography
                                  className={clsx(classes.fontDesign, classes.fontColor3)}
                                  variant='body2'
                                >
                                  <b>Present : {each?.total_present}</b>
                                </Typography>
                                <Typography
                                  className={clsx(classes.fontDesign, classes.fontColor2)}
                                  variant='caption'
                                >
                                  <b>Absent : {each?.total_absent}</b>
                                </Typography>
                              </div>
                              <div className={clsx(classes.cuirularButton)}>
                                <Box
                                  sx={{ position: 'relative', display: 'inline-flex' }}
                                >
                                  <CircularProgress
                                    variant='determinate'
                                    value={each?.percentage_present}
                                  />
                                  <Box
                                    sx={{
                                      top: 0,
                                      left: 0,
                                      bottom: 0,
                                      right: 0,
                                      position: 'absolute',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Typography
                                      variant='caption'
                                      component='div'
                                      color='text.secondary'
                                    >
                                      {`${Math.round(each?.percentage_present)}%`}
                                    </Typography>
                                  </Box>
                                </Box>
                                <IconButton size='small'>
                                  <ArrowRightAltIcon />
                                </IconButton>
                              </div>
                            </div>
                          </Grid>
                        ))}

                      <Grid item xs={3}>
                        <div className={clsx(classes.detailsDiv, classes.applyBorder)}>
                          <div>
                            <Typography
                              className={clsx(classes.roleStyle)}
                              variant='body2'
                            >
                              <b>Students</b>
                            </Typography>
                            <Typography
                              className={clsx(classes.fontDesign)}
                              variant='body2'
                            >
                              <b>
                                Total :{' '}
                                {/* {props?.studentAttendance
                                  ? props?.studentAttendance?.total_strength
                                  : ''} */}
                                {isNaN(
                                  props?.studentAttendance?.total_strength
                                )
                                  ? 0
                                  : Math.round(props?.studentAttendance?.total_strength)}
                              </b>
                            </Typography>
                            <Typography
                              className={clsx(classes.fontDesign, classes.fontColor3)}
                              variant='body2'
                            >
                              <b>
                                Present :{' '}
                                {isNaN(
                                  props?.studentAttendance?.total_present
                                  
                                  ) 
                                  ? 0
                                  : Math.round(props?.studentAttendance?.total_present)}
                              </b>
                            </Typography>
                            <Typography
                              className={clsx(classes.fontDesign, classes.fontColor2)}
                              variant='caption'
                            >
                              <b>
                                Absent :{' '}
                                {/* {props?.studentAttendance
                                  ? props?.studentAttendance?.total_strength -
                                  props?.studentAttendance?.total_present
                                  : ''} */}

                                {isNaN(
                                  props?.studentAttendance?.total_strength - props?.studentAttendance?.total_present
                                )
                                  ? 0
                                  : Math.round(props?.studentAttendance?.total_strength - props?.studentAttendance?.total_present)}
                              </b>
                            </Typography>
                          </div>
                          <div className={clsx(classes.cuirularButton)}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              <CircularProgress
                                variant='determinate'
                                value={props?.studentAttendance?.total_avg}
                              />
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: 'absolute',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography
                                  variant='caption'
                                  component='div'
                                  color='text.secondary'
                                >
                                  {isNaN(
                                    props?.studentAttendance?.total_avg
                                  )
                                    ? 0
                                    : Math.round(props?.studentAttendance?.total_avg)}%
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton size='small'>
                              <ArrowRightAltIcon />
                            </IconButton>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                      <Typography style={{ fontWeight: '600' }}>No Records</Typography>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              {/* <Grid item xs={12}> */}
              <Card>
                <CardHeader
                  style={{ cursor: 'pointer' }}
                  title={
                    <Typography
                      // variant='h5'
                      style={{ display: 'flex' }}
                      className={clsx(classes.clickable)}
                      // onClick={() => user_level != 10 ? history.push('/fees-table-status') : ''}
                      onClick={feeredirect}
                      className={clsx(classes.cardtopicStyle)}
                    >
                      <b>Fee Status Overview :</b>{' '}
                      {props?.branchCounter ? (
                        <Tooltip
                          title={
                            props?.selectedBranch &&
                            props?.selectedBranch?.map(
                              (item) => item?.branch?.branch_name + ' '
                            )
                          }
                        >
                          <Chip
                            variant='outlined'
                            size='small'
                            // icon={props?.selectedBranch?.length}
                            avatar={<Avatar>{props?.selectedBranch?.length}</Avatar>}
                            label={' Branch Selected'}
                          />
                        </Tooltip>
                      ) : (
                        // <div style={{ display: 'flex' }}>
                        //   {props?.selectedBranch &&
                        //     props?.selectedBranch?.map((item) => (
                        //       <div style={{ margin: '0 5px' }}>
                        //         {item?.branch?.branch_name}
                        //       </div>
                        //     ))}
                        // </div>
                        <>All Branch</>
                      )}
                    </Typography>
                  }
                  action={
                    user_level != 10 ? (
                      <Button
                        className={clsx(classes.viewButton)}
                        aria-label='view all'
                        onClick={props.handleFeeRefresh}
                      >
                        <RefreshIcon style={{ color: 'blue' }} />
                      </Button>
                    ) : (
                      ''
                    )
                  }
                />
                <Divider />
                <CardContent>
                  {props?.financeData?.totalfees ? (
                    <Grid container spacing={3} alignItems='center'>
                      <Grid item xs={12}>
                        <Typography
                          // variant='h6'
                          // style={{ textAlign: 'end' }}
                          className={clsx(classes.textBold, classes.textAlignCenter)}
                        >
                          Total Fee{' '}
                          <b
                            style={{
                              color: '#628fef',
                              fontWeight: '800',
                              marginLeft: '10px',
                            }}
                          >
                            ₹ {props?.financeData ? props?.financeData?.totalfees : ''}
                          </b>
                        </Typography>
                        {/* <Typography
                        // variant='h5'
                        color='primary'
                        className={clsx(classes.textBold)}
                      >
                        ₹ 170,00,000
                      </Typography> */}
                      </Grid>

                      <Grid item xs={4}>
                        <Card elevation={0}>
                          <CardContent className={clsx(classes.cardContant)}>
                            <Typography
                              // variant='body2'
                              // className={classes.textAlignCenter,classes.cus}
                              className={clsx(
                                classes.textAlignCenter,
                                classes.customTextSize
                              )}
                            >
                              Total Collected
                            </Typography>
                            <div className={clsx(classes.lookALikeButton)}>
                              <Typography
                                variant='body2'
                                className={clsx(
                                  classes.textAlignCenter,
                                  classes.textBold,
                                  classes.colorGreen,
                                  classes.customTextSize
                                )}
                              >
                                ₹ { props?.financeData ? props?.financeData?.paid : ''}
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card elevation={0}>
                          <CardContent className={clsx(classes.cardContant)}>
                            <Typography
                              variant='body2'
                              // className={classes.textAlignCenter}
                              className={clsx(
                                classes.customTextSize,
                                classes.textAlignCenter
                              )}
                            >
                              Total Pending
                            </Typography>
                            <div className={clsx(classes.lookALikeButton)}>
                              <Typography
                                variant='body2'
                                className={clsx(
                                  classes.textAlignCenter,
                                  classes.textBold,
                                  classes.colorRed,
                                  classes.customTextSize
                                )}
                              >
                                ₹{' '}
                                {props?.financeData
                                  ? Math.round(props?.financeData?.outstanding)
                                  : ''}
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card elevation={0}>
                          <CardContent className={clsx(classes.cardContant)}>
                            <Typography
                              variant='body2'
                              className={classes.textAlignCenter}
                            >
                              Total Admissions
                            </Typography>
                            <div className={clsx(classes.lookALikeButton)}>
                              <Typography
                                variant='body2'
                                className={clsx(
                                  classes.textAlignCenter,
                                  classes.textBold,
                                  classes.colorYellow,
                                  classes.customTextSize
                                )}
                              >
                                {props?.financeData
                                  ? props?.financeData?.no_of_admission
                                  : ''}
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      style={{ minHeight: '180px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                      {user_level != 10 ? (
                      <Typography style={{ fontWeight: '600' }}>
                        No Records
                      </Typography>
                      ) : (
                        <Typography style={{ fontWeight: '600' }}>
                        Access Denied
                      </Typography>
                      )}
                    </Grid>
                  )}
                </CardContent>
              </Card>
              {/* </Grid> */}
              <Card>
                <CardHeader
                  style={{ backgroundColor: '#d6dfe7' }}
                  title={
                    <Typography className={clsx(classes.cardtopicStyle)}>
                      <b> Recent Transaction </b>
                    </Typography>
                  }
                  action={
                    user_level != 10 ? (
                    <Button
                      className={clsx(classes.viewButton)}
                      aria-label='view all'
                      onClick={props.handlerecent}
                    >
                      <RefreshIcon style={{ color: 'blue' }} />
                    </Button>
                    ) : ''
                  }
                ></CardHeader>
                <CardContent
                  style={{
                    minHeight: '250px',
                    display: 'flex',
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}
                >
                  {props?.recentTransCounter ? (
                    <Grid container spacing={3} alignItems='center'>
                      {props?.recentTrans &&
                        props?.recentTrans?.map((each, index) => {
                          return (
                            <>
                              <Grid
                                item
                                xs={12}
                                className={clsx(classes.transactionTable)}
                              >
                                <Grid item md={1}>
                                  <MonetizationOnIcon />
                                </Grid>
                                <Grid item md={8}>
                                  <Typography
                                    variant='body2'
                                    className={clsx(classes.transactionTextDesign)}
                                  >
                                    Deposition in the bank <b>{each?.mode}</b>
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    className={clsx(classes.transactionTextDesign)}
                                  >
                                    Branch Name {each?.branch}
                                  </Typography>
                                </Grid>
                                <Grid item md={3}>
                                  <Typography
                                    variant='body2'
                                    className={clsx(classes.transactionTextDesignGray)}
                                  >
                                    {each?.date}
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    className={clsx(classes.transactionTextDesignLeft)}
                                  >
                                    <b>₹ {each?.amount} </b>
                                  </Typography>
                                </Grid>
                              </Grid>

                              {/* <Grid item xs={12}
                      className={clsx(classes.viewButtonAlign)}
                    >
                      <Button
                        // style={{color:'black',backgroundColor:'white'}}
                        className={clsx(classes.viewButton)}

                      >

                        View All <DeleteIcon style={{ color: 'black' }} />
                      </Button>

                    </Grid> */}
                            </>
                          );
                        })}
                    </Grid>
                  ) : (
                    <Grid
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: 'auto',
                        alignItems: 'center',
                        flexDirection: 'column'

                      }}
                    >
                      <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                      {user_level != 10 ? (
                      <Typography style={{ fontWeight: '600' }}>No Records</Typography>
                      ) : (
                      <Typography style={{ fontWeight: '600' }}>Access Denied</Typography>
                      )}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item container spacing={2} xs={6}>
              <Grid item xs={12}>
                <Card>
                  <Card>
                    <CardHeader
                      title={
                        <Typography
                          // variant='h5'
                          style={{ display: 'flex' }}
                          className={clsx(classes.clickable, classes.cardtopicStyle)}
                          onClick={() => setAcademicPerformanceDetailsOpen(true)}
                        // onClick={() => history.push('/finance-owner/academic-performance')}
                        >
                          <b>Academic Performance : </b>{' '}
                          {props?.branchCounter ? (
                            <Tooltip
                              title={
                                props?.selectedBranch &&
                                props?.selectedBranch?.map(
                                  (item) => item?.branch?.branch_name + ' '
                                )
                              }
                            >
                              <Chip
                                variant='outlined'
                                size='small'
                                // icon={props?.selectedBranch?.length}
                                avatar={<Avatar>{props?.selectedBranch?.length}</Avatar>}
                                label={' Branch Selected'}
                              />
                            </Tooltip>
                          ) : (
                            // <div style={{ display: 'flex' }}>
                            //   {props?.selectedBranch &&
                            //     props?.selectedBranch?.map((item) => (
                            //       <div style={{ margin: '0 5px' }}>
                            //         {item?.branch?.branch_name}
                            //       </div>
                            //     ))}
                            // </div>
                            <>All Branch</>
                          )}
                        </Typography>
                      }
                      action={
                        <Button
                          className={clsx(classes.viewButton)}
                          aria-label='view all'
                          onClick={props.handleAcadRefresh}
                        >
                          <RefreshIcon style={{ color: 'blue' }} />
                        </Button>
                      }
                    />
                    <Divider />
                    <CardContent
                      style={{
                        minHeight: '180px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {props?.acadCounter ? (
                        <Grid container spacing={3} alignItems='center'>
                          <Grid
                            item
                            xs={12}
                            style={{ borderRadius: '5px', backgroundColor: '#ffd4d9' }}
                          >
                            <div className={clsx(classes.absentGrid)}>
                              <div style={{ width: '53%' }}>
                                <Typography
                                  variant='body2'
                                  className={clsx(classes.customTextSize)}
                                >
                                  Curriculum Completion
                                </Typography>
                              </div>
                              <div style={{ width: '33%', textAlign: 'center' }}>
                                <Typography variant='body2'>
                                  ------------------
                                </Typography>
                              </div>
                              <div
                                style={{
                                  width: '13%',
                                  display: 'flex',
                                  fontWeight: 'bolder',
                                }}
                              >
                                <Typography style={{ fontSize: '15px' }}>
                                  <b>
                                    {props?.currBranch?.length > 0 ? (
                                      <>
                                        {' '}
                                        {`${Math.round(
                                          props?.currBranch[0]?.percentage_completed
                                        )}%`}
                                      </>
                                    ) : (
                                      <>0%</>
                                    )}
                                  </b>
                                </Typography>
                                <IconButton aria-label='delete' size='small'>
                                  <DeleteIcon fontSize='inherit' />
                                </IconButton>
                              </div>
                            </div>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            style={{
                              borderRadius: '5px',
                              backgroundColor: '#b3f5e6',
                              marginTop: '5px',
                            }}
                          >
                            <div className={clsx(classes.absentGrid)}>
                              <div style={{ width: '53%' }}>
                                <Typography
                                  variant='body2'
                                  // className={classes.textAlignCenter}
                                  className={clsx(classes.customTextSize)}
                                >
                                  Average Test Score
                                </Typography>
                              </div>
                              <div style={{ width: '33%', textAlign: 'center' }}>
                                <Typography variant='body2'>
                                  ------------------
                                </Typography>
                              </div>
                              <div
                                style={{
                                  width: '13%',
                                  display: 'flex',
                                  fontWeight: 'bolder',
                                }}
                              >
                                <Typography style={{ fontSize: '15px' }}>
                                  <b>
                                    {props?.avgTest ? (
                                      <>
                                        {isNaN(props?.avgTest?.overall_avg)
                                          ? 0
                                          : Math.round(props?.avgTest?.overall_avg)}
                                      </>
                                    ) : (
                                      <>0%</>
                                    )}
                                  </b>
                                </Typography>
                                <IconButton aria-label='delete' size='small'>
                                  <DeleteIcon fontSize='inherit' />
                                </IconButton>
                              </div>
                            </div>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            style={{
                              borderRadius: '5px',
                              backgroundColor: '#fff2cc',
                              marginTop: '5px',
                            }}
                          >
                            <div className={clsx(classes.absentGrid)}>
                              <div style={{ width: '53%' }}>
                                <Typography
                                  variant='body2'
                                  className={clsx(classes.customTextSize)}
                                >
                                  Student Attendance Report
                                </Typography>
                              </div>
                              <div style={{ width: '33%', textAlign: 'center' }}>
                                <Typography variant='body2'>
                                  ------------------
                                </Typography>
                              </div>
                              <div style={{ width: '13%', display: 'flex' }}>
                                <Typography className={clsx(classes.customTextSize)}>
                                  <b>
                                    {' '}
                                    {props?.studentAttendanceOverview ? (
                                      <>
                                        {isNaN(
                                          props?.studentAttendanceOverview?.total_avg
                                        )
                                          ? 0
                                          : Math.round(props?.studentAttendanceOverview?.total_avg)}
                                      </>
                                    ) : (
                                      <>0%</>
                                    )}
                                  </b>
                                </Typography>
                                <IconButton aria-label='delete' size='small'>
                                  <DeleteIcon fontSize='inherit' />
                                </IconButton>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: 'auto',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                          <Typography style={{ fontWeight: '600' }}>No Records</Typography>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  {/* <Grid item xs={12}> */}
                  {/* <Card> */}
                  <CardHeader
                    title={
                      <Typography
                        className={clsx(classes.clickable, classes.cardtopicStyle)}
                        // variant='h5'
                        // className={clsx(classes.clickable)}
                        // onClick={() => history.push('/staff-attendance-report/branch-wise')}
                        onClick={staffRedirect}
                        style={{ display: 'flex' }}
                      >
                        <b>Staff Details :</b>{' '}
                        {props?.branchCounter ? (
                          <Tooltip
                            title={
                              props?.selectedBranch &&
                              props?.selectedBranch?.map(
                                (item) => item?.branch?.branch_name + ' '
                              )
                            }
                          >
                            <Chip
                              variant='outlined'
                              size='small'
                              // icon={props?.selectedBranch?.length}
                              avatar={<Avatar>{props?.selectedBranch?.length}</Avatar>}
                              label={' Branch Selected'}
                            />
                          </Tooltip>
                        ) : (
                          // <div style={{ display: 'flex' }}>
                          //   {props?.selectedBranch &&
                          //     props?.selectedBranch?.map((item) => (
                          //       <div style={{ margin: '0 5px' }}>
                          //         {item?.branch?.branch_name}
                          //       </div>
                          //     ))}
                          // </div>
                          <>All Branch</>
                        )}
                      </Typography>
                    }
                    action={
                      <Button
                        className={clsx(classes.viewButton)}
                        aria-label='view all'
                        onClick={props.handlestaffOverViewRefresh}
                      >
                        <RefreshIcon style={{ color: 'blue' }} />
                      </Button>
                    }
                  />
                  <Divider />
                  <CardContent
                    style={{
                      minHeight: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {props?.staffOverAll[0] ? (
                      <Grid
                        container
                        spacing={3}
                        alignItems='center'
                        style={{ overflowX: 'auto', maxHeight: '300px' }}
                      >
                        <Grid item sm={12} xs={12}>
                          <Grid item xs={12}>
                            <div className={clsx(classes.absentGrid)}>
                              <div style={{ width: '50%' }}>
                                <Typography className={clsx(classes.customTextSize)}>
                                  <b>Overall Attendance</b>
                                </Typography>
                              </div>
                              {/* <div style={{ width: '50%', paddingLeft: '10px', fontSize: '15px', textAlign: 'center' }}>
                              Absent for more than 3 continuous day
                            </div> */}
                            </div>
                          </Grid>
                        </Grid>
                        {props?.staffOverAll &&
                          props?.staffOverAll?.map((item) => (
                            <Grid item xs={12}>
                              <div className={clsx(classes.absentGrid)}>
                                <div style={{ width: '33%' }}>
                                  <Typography
                                    variant='body2'
                                    // className={classes.textAlignCenter}
                                    className={clsx(
                                      classes.customTextSize,
                                      classes.customLeftText
                                    )}
                                  >
                                    {item?.role_name}
                                  </Typography>
                                </div>
                                <div style={{ width: '33%' }}>
                                  <Typography
                                    variant='body2'
                                    className={clsx(
                                      classes.textAlignCenter,
                                      classes.textBold,
                                      classes.colorGreen
                                    )}
                                  >
                                    <b>{`${Math.round(item?.percentage_present)}%`}</b>
                                  </Typography>
                                </div>
                                {/* <div style={{ width: '33%' }}>
                            <Button disabled style={{ height: '50%', backgroundColor: '#ffd4d9' }}>
                              {item?.total_absent}
                            </Button>
                          </div> */}
                              </div>
                            </Grid>
                          ))}
                      </Grid>
                    ) : (
                      <Grid
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          margin: 'auto',
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                        <Typography style={{ fontWeight: '600' }}>No Records</Typography>
                      </Grid>
                    )}
                  </CardContent>
                  {/* </Card> */}
                  {/* </Grid> */}
                </Card>
              </Grid>
            </Grid>
          </>
        ) : isAcad ? (
          <>
            <AcadView props={props} />
          </>
        ) : (
          <>
            <Grid
              item
              container
              xs={12}
              spacing={2}
              justifyContent='space-between'
              alignItems='center'
            >
              <Grid item xs={3}>
                <IconButton onClick={() => setAcademicPerformanceDetailsOpen(false)}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              {/* <Grid item xs={3}>
                <FormControl fullWidth variant='outlined' margin='dense'>
                  <InputLabel id='volume'>Volume</InputLabel>
                  <Select
                    labelId='volume'
                    value={volume}
                    label='Volume'
                    onChange={handleVolumeChange}
                  >
                    <MenuItem value={10}>Volume 1</MenuItem>
                    <MenuItem value={20}>Volume 2</MenuItem>
                    <MenuItem value={30}>Volume 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
            </Grid>
            <Grid item xs={12}>
              {props?.branchList?.length > 0 &&
                props?.branchList?.map((each, index) => {
                  return (
                    <div className={`acc${index + 1}`}>
                      {each ? (
                        <Accordion
                          elevation={0}
                          className={clsx(classes.accordion)}
                          // {...{
                          //   ...(index === 0 && {
                          //     expanded: true,
                          //   }),
                          // }}
                          expanded={expanded === index + 1}
                          onChange={handleChange(each, index + 1)}
                          id='branchWise'
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${index}-content`}
                            id={`${index}-header`}
                          >
                            <Typography>{each?.branch?.branch_name}</Typography>
                          </AccordionSummary>
                          {expanded && (
                            <AccordionDetails>
                              <div style={{ width: '100%' }}>
                                <Grid container spacing={2}>
                                  {loading ? (
                                    <Loading />
                                  ) : (
                                    <>
                                      <Grid
                                        item
                                        xs={4}
                                        onClick={() => handleRoute(each)}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <div
                                          className={clsx(
                                            classes.detailsDiv,
                                            classes.applyColor1
                                          )}
                                        >
                                          <div>
                                            <Typography variant='body2'>
                                              Curriculum Completion
                                            </Typography>
                                          </div>
                                          <div className={clsx(classes.textAlignEnd)}>
                                            <Typography
                                              variant='body2'
                                              className={clsx(classes.textBold)}
                                            >
                                              {curriculumData.length > 0 ? (
                                                `${Math.round(
                                                  curriculumData[0]?.percentage_completed
                                                )}%`
                                              ) : (
                                                <>0%</>
                                              )}
                                            </Typography>
                                          </div>
                                        </div>
                                      </Grid>

                                      <Grid
                                        item
                                        xs={4}
                                        onClick={() => handleStudentreport(each)}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <div
                                          className={clsx(
                                            classes.detailsDiv,
                                            classes.applyColor2
                                          )}
                                        >
                                          <div>
                                            <Typography variant='body2'>
                                              Student Report
                                            </Typography>
                                            <Typography variant='caption'>
                                              Learning & Engagement Reports
                                            </Typography>
                                          </div>
                                          <div className={clsx(classes.textAlignEnd)}>
                                            <Typography
                                              variant='body2'
                                              className={clsx(classes.textBold)}
                                            >
                                              {testScoreData?.overall_avg > 0 ? (
                                                <>
                                                  {`${Math.round(
                                                    testScoreData?.overall_avg
                                                  )}%`}{' '}
                                                </>
                                              ) : (
                                                <>0%</>
                                              )}
                                            </Typography>
                                            <Typography variant='caption'>
                                              Av. Score
                                            </Typography>
                                          </div>
                                        </div>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={4}
                                        onClick={() => handleAttendance(each)}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <div
                                          className={clsx(
                                            classes.detailsDiv,
                                            classes.applyColor3
                                          )}
                                        >
                                          <div>
                                            <Typography variant='body2'>
                                              Attendance Report
                                            </Typography>
                                          </div>
                                          <div className={clsx(classes.textAlignEnd)}>
                                            <Typography
                                              variant='body2'
                                              className={clsx(classes.textBold)}
                                            >
                                              {studentReportData?.total_avg > 0 ? (
                                                <>
                                                  {' '}
                                                  {`${Math.round(
                                                    studentReportData?.total_avg
                                                  )}%`}
                                                </>
                                              ) : (
                                                <>0%</>
                                              )}
                                            </Typography>
                                            <Typography variant='caption'>
                                              Av. Attendance
                                            </Typography>
                                          </div>
                                        </div>
                                      </Grid>
                                    </>
                                  )}
                                </Grid>
                              </div>
                            </AccordionDetails>
                          )}
                        </Accordion>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default withRouter(FinanceOwnerDashboard);
