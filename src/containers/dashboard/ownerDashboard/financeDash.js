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
  CardActions,
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
  Paper,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowRightAlt as ArrowRightAltIcon,
  MonetizationOn as MonetizationOnIcon,
  ChevronRight as ChevronRightIcon,
  ArrowForwardIosSharp as ArrowForwardIosSharpIcon,
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
import { divide } from 'lodash';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
// import Box from '@mui/material/Box';
// import Box from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  refreshButtonMargin: {
    marginTop: '10px',
  },
  classTableStaff: {
    border: '1px solid lightgray',
    borderRadius: '4px',
    margin: '1px 0',
  },
  cardHeaderAttendance: {
    borderRadius: '8px',
    border: '1px solid #D7E0E7',
  },
  newBorder: {
    border: '1px solid #D7E0E7',
    borderRadius: '4px',
    opacity: '1',
  },
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
    cursor: 'pointer',
  },
  detailsDiv: {
    borderRadius: '5px',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px',
    margin: '5px 0',
  },
  accordion: {
    margin: '10px 0 !important',
    // border: '1px solid black',
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
    // height: '90%',
  },
  transactionTable: {
    border: '1px solid lightgrey',
    display: 'flex',
    borderRadius: '5px',
    margin: '2px 0',
    padding: '3px',
  },
  transactionTextDesign: {
    fontSize: '12px',
    lineHeight: '17px',
  },
  transactionTextDesignLeft: {
    textAlign: 'right',
    fontSize: '14px',
    lineHeight: '17px',
  },
  transactionTextDesignGray: {
    textAlign: 'right',
    fontSize: '12px',
    lineHeight: '17px',
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
    fontSize: '10px',
  },
  fontColor2: {
    color: '#ff3573',
  },
  fontColor3: {
    color: '#08cf39',
  },
  cardtopicStyle: {
    fontSize: '18px',
    // border:'1px solid #D7E0E7'
  },
  customLeftText: {
    textAlign: 'left',
  },
  viewMoreButton: {
    // fontSize: '16px',
    color: 'black',
    backgroundColor: 'white',
    font: 'normal normal normal 16px/19px',
    letterSpacing: '0px',
  },
  feesOverviewContainer: {},
  cardHeaderText: {
    fontSize: '18px',
    lineHeight: '22px',
  },
  refreshButton: {
    float: 'right',
  },
  feesOverview: {
    width: '100%',
    minHeight: '170px',
  },
  totalFessText: {
    fontSize: '24px',
    lineHeight: '28px',
  },
  sideBorder: {
    borderLeft: '2px solid lightgray',
    borderRight: '2px solid lightgray',
  },
  feesOverviewValue: {
    fontSize: '20px',
    lineHeight: '24px',
  },
  color1: {
    color: '#2DC8A8',
  },
  color2: {
    color: '#FE8083',
  },
  color3: {
    color: '#FFC258',
  },
  feesOverviewViewMore: {
    textDecoration: 'none',
    fontSize: '18px',
    lineHeight: '22px',
    float: 'right',
    backgroundColor: 'white',
    color: '#536476',
  },
  arrowViewViewMore: {
    textDecoration: 'none',
    lineHeight: '22px',
    float: 'right',
    backgroundColor: 'white',
    color: '#536476',
  },
  resentTransactionText: {
    margin: '10px 0 0',
    padding: '5px 0 5px 5px',
    backgroundColor: '#536476',
    color: 'white',
  },
}));

const FinanceOwnerDashboard = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [academicPerformanceDetailsOpen, setAcademicPerformanceDetailsOpen] = useState(
    false
  );
  const [expanded, setExpanded] = useState(true);
  const [volume, setVolume] = React.useState('');
  const [isAcad, setIsAcad] = useState(false);
  const [curriculumData, setCurriculumData] = useState([]);
  const [studentReportData, setStudentReportData] = useState();
  const [testScoreData, setTestScoreData] = useState();
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext)

  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  let users = [2, 3, 10]

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleChange = (each, value) => (e, isExpanded) => {
    const testclick = document.querySelectorAll('#branchWise');
    setClicked(true);
    setLoading(true);
    setExpanded(isExpanded ? value : false);
    getCurriculumReport(each?.branch?.id, each?.id);
    getStudentReport(each?.id, each?.session_year?.id);
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
            // 'X-DTS-Host': "dev.olvorchidnaigaon.letseduvate.com",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
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
    //         'X-DTS-Host': "qa.olvorchidnaigaon.letseduvate.com",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    apiRequest(
      'get',
      `${endpoints.ownerDashboard.getStudentAttendance}?acad_session=${branch}&session_year_id=${year}`,
      null,
      null,
      true,
      10000
    )
      .then((res) => {
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
    //       'X-DTS-Host': "qa.olvorchidnaigaon.letseduvate.com",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    apiRequest(
      'get',
      `${endpoints.ownerDashboard.getAvgTest}?acad_session_id=${acad}`,
      null,
      null,
      true,
      10000
    )
      .then((res) => {
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
        props?.branchList[0]?.id, //acad id
        props?.branchList[0]?.session_year?.id
      );
      getTestScore(props?.branchList[0]?.id);
    }
  }, [props?.branchList]);

  const handleAttendance = (each) => {
    history.push({
      pathname: `/attendance-report/${each?.id}`, //acad id
      state: {
        acad_session_id: each?.id,
        module_id: props?.moduleId,
      },
    });
  };

  const handleStudentreport = (each) => {
    history.push(`/student-report-dash/${each?.id}`); //acad id
  };

  const handleRoute = (data) => {
    // history.push(`/curriculum-completion/${data.branch.id}/`)
    history.push({
      pathname: `/curriculum-completion/${data?.branch?.id}`,
      state: {
        acad_session_id: data?.id,
        module_id: props?.moduleId,
        branchName: data?.branch?.branch_name,
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

  const handleRouteTransaction = (data) => {
    const branchName = data.map((item) => {
      return item?.branch?.branch_name;
    });

    const branchId = data.map((item) => {
      return item?.branch?.id; //acad id
    });

    history.push({
      pathname: `/trasaction-details/${branchId}/${branchName}`,
      state: {
        branchName: branchName,
      },
    });
  };

  const feeredirect = () => {
    if (!users.includes(user_level)) {
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

  const handleBranchRoute = (data, iscurriculam) => {
    history.push({
      pathname: `/curriculum-completion-branchWise`,
      state: {
        branchData: data,
        module_id: props?.moduleId,
        iscurriculam: iscurriculam,
      },
    });
  };

  useEffect(() => {
    if (history?.location?.state?.stateView === 'StudentDetails') {
      setAcademicPerformanceDetailsOpen(true);
    }
  }, []);

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '10px' }}>
      <Grid item container spacing={2}>
        {user_level !== 11 ? (
          academicPerformanceDetailsOpen === false ? (
            <>
              <Grid item xs={12}>
                <Card elevation={1} className={clsx(classes.cardHeaderAttendance)}>
                  <CardHeader
                    title={
                      <Typography
                        // variant='h5'
                        className={clsx(classes.clickable, classes.cardtopicStyle)}
                        style={{ display: 'flex' }}
                      // onClick={() => setAcademicPerformanceDetailsOpen(true)}
                      // onClick={staffRedirect}
                      >
                        <b>Today's Attendance Overview :&nbsp;</b>{' '}
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
                          <> All Branch </>
                        )}
                      </Typography>
                    }
                    action={
                      <>
                        <Button
                          variant='text'
                          className={clsx(classes.viewMoreButton)}
                          endIcon={<ChevronRightIcon style={{ color: 'black' }} />}
                          onClick={staffRedirect}
                        >
                          View All Attendance
                        </Button>
                        <IconButton
                          className={clsx(classes.viewButton)}
                          aria-label='view all'
                          onClick={props.handleTodayAttendance}
                        >
                          <RefreshIcon style={{ color: 'blue', fontSize: '20px' }} />
                        </IconButton>
                      </>
                    }
                  />
                  <CardContent>
                    <>
                      {props?.progress1?.attendence ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CircularProgress />
                        </div>
                      ) : (
                        <>
                          {props?.todayCounter ? (
                            <Grid container spacing={2}>
                              {props?.roleWiseAttendance?.length > 0 &&
                                props?.roleWiseAttendance.map((each, index) => (
                                  <Grid item xs={3}>
                                    <div
                                      className={clsx(
                                        classes.detailsDiv,
                                        classes.newBorder
                                      )}
                                    // style={{ width: '112%' }}
                                    >
                                      <div style={{ width: "126px" }}>
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
                                          className={clsx(classes.fontDesign)}
                                          variant='body2'
                                        >
                                          <b>Marked :<span>{each?.total_present + each?.total_absent + each?.total_half_day + each?.total_late}</span></b>
                                        </Typography>
                                        <Typography
                                          className={clsx(classes.fontDesign)}
                                          variant='body2'
                                        // style={{width:106}}
                                        >
                                          <b>UnMarked : {each?.total_people - (each?.total_present + each?.total_absent + each?.total_half_day + each?.total_late)}</b>
                                        </Typography>
                                        <Typography
                                          className={clsx(
                                            classes.fontDesign,
                                            classes.fontColor3
                                          )}
                                          variant='body2'
                                        >
                                          <b>Present : {each?.total_present}</b>
                                        </Typography>
                                        <Typography
                                          className={clsx(
                                            classes.fontDesign,
                                            classes.fontColor2
                                          )}
                                          variant='caption'
                                        >
                                          <b>Absent : {each?.total_absent}</b>
                                        </Typography>
                                      </div>
                                      <div className={clsx(classes.cuirularButton)}>
                                        <Box
                                          sx={{
                                            position: 'relative',
                                            display: 'inline-flex',
                                          }}
                                          style={{ marginBottom: "60px", marginRight: "3px" }}
                                        >
                                          <CircularProgress
                                            variant='determinate'
                                            value={each?.percentage_present}
                                            // value="100"
                                            style={{ width: '41px', height: '40px' }}
                                          />
                                          <Box
                                            sx={{
                                              // marginLeft:'-16px',
                                              // marginTop:'6px',
                                              margin: '6px 0px 0px 9px',
                                              borderRadius: '5px',
                                              padding: '1px',
                                              position: 'absolute',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                            }}
                                          >
                                            <Typography
                                              variant='caption'
                                              component='div'
                                              color='text.secondary'
                                            >
                                              <span style={{ fontSize: "10px", fontWeight: 600, marginTop: "9px" }}>{`${Math.round(each?.percentage_present)}%`}</span>

                                            </Typography>
                                          </Box>
                                        </Box>
                                        {/* <IconButton size='small'>
                                        <ArrowRightAltIcon />
                                      </IconButton> */}
                                      </div>
                                    </div>
                                  </Grid>
                                ))}

                              {/* <Grid item xs={3}>
                              <div
                                className={clsx(classes.detailsDiv, classes.applyBorder)}
                              >
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
                                      {props?.studentAttendance
                                  ? props?.studentAttendance?.total_strength
                                  : ''}
                                      {isNaN(props?.studentAttendance?.total_strength)
                                        ? 0
                                        : Math.round(
                                            props?.studentAttendance?.total_strength
                                          )}
                                    </b>
                                  </Typography>
                                  <Typography
                                    className={clsx(
                                      classes.fontDesign,
                                      classes.fontColor3
                                    )}
                                    variant='body2'
                                  >
                                    <b>
                                      Present :{' '}
                                      {isNaN(props?.studentAttendance?.total_present)
                                        ? 0
                                        : Math.round(
                                            props?.studentAttendance?.total_present
                                          )}
                                    </b>
                                  </Typography>
                                  <Typography
                                    className={clsx(
                                      classes.fontDesign,
                                      classes.fontColor2
                                    )}
                                    variant='caption'
                                  >
                                    <b>
                                      Absent :{' '}
                                      {props?.studentAttendance
                                  ? props?.studentAttendance?.total_strength -
                                  props?.studentAttendance?.total_present
                                  : ''}
                                      {isNaN(
                                        props?.studentAttendance?.total_strength -
                                          props?.studentAttendance?.total_present
                                      )
                                        ? 0
                                        : Math.round(
                                            props?.studentAttendance?.total_strength -
                                              props?.studentAttendance?.total_present
                                          )}
                                    </b>
                                  </Typography>
                                </div>
                                <div className={clsx(classes.cuirularButton)}>
                                  <Box
                                    sx={{ position: 'relative', display: 'inline-flex' }}
                                  >
                                    <CircularProgress
                                      style={{ width: '60px', height: '60px' }}
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
                                        {isNaN(props?.studentAttendance?.total_avg)
                                          ? 0
                                          : Math.round(
                                              props?.studentAttendance?.total_avg
                                            )}
                                        %
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <IconButton size='small'>
                                    <ArrowRightAltIcon />
                                  </IconButton>
                                </div>
                              </div>
                            </Grid> */}
                            </Grid>
                          ) : (
                            <Grid
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                              <Typography style={{ fontWeight: '600' }}>
                                No Records
                              </Typography>
                            </Grid>
                          )}
                        </>
                      )}
                    </>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card className={clsx(classes.feesOverviewContainer)}>
                  <CardContent>
                    <Typography className={clsx(classes.cardHeaderText)}>
                      <b>Fee Status Overview : &nbsp;</b>
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
                            avatar={<Avatar>{props?.selectedBranch?.length}</Avatar>}
                            label={' Branch Selected'}
                          />
                        </Tooltip>
                      ) : (
                        <>All Branch</>
                      )}
                      {!users.includes(user_level) ? (
                        <IconButton
                          size='small'
                          className={clsx(classes.refreshButton)}
                          aria-label='view all'
                          onClick={props.handleFeeRefresh}
                        >
                          <RefreshIcon fontSize='small' style={{ color: 'blue' }} />
                        </IconButton>
                      ) : (
                        ''
                      )}
                    </Typography>
                    <Card className={clsx(classes.feesOverview)}>
                      <CardContent style={{ paddingBottom: '8px' }}>
                        {props?.progress1?.feeStatus ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CircularProgress />
                          </div>
                        ) : (
                          <>
                            {props?.financeData?.totalfees ? (
                              <Grid container spacing={1}>
                                <Grid item xs={12}>
                                  <Typography
                                    className={clsx(
                                      classes.textAlignCenter
                                    )}
                                    style={{ marginBottom: '8px' }}
                                  >
                                    <b>Total Fee&nbsp;&nbsp; </b>
                                    <b
                                      style={{
                                        color: '#628fef',
                                      }}
                                    >
                                      ₹ &nbsp;
                                      {props?.financeData
                                        ? props?.financeData?.totalfees
                                          ?.toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : ''}
                                    </b>
                                  </Typography>
                                </Grid>
                                <Grid item xs={4} className={clsx(classes.textAlignCenter)}>
                                  <div>
                                    Total <br /> Collected
                                  </div>
                                  <Typography
                                    className={clsx(
                                      // classes.feesOverviewValue,
                                      classes.color1
                                    )}
                                  >
                                    <b>
                                      ₹
                                      {props?.financeData
                                        ? Math.round(props?.financeData?.paid)
                                          ?.toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : ''}
                                    </b>
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  className={clsx(
                                    classes.textAlignCenter,
                                    classes.sideBorder
                                  )}
                                >
                                  <div>
                                    Total <br /> Outstanding
                                  </div>
                                  <Typography
                                    className={clsx(
                                      // classes.feesOverviewValue,
                                      classes.color2
                                    )}
                                  >
                                    <b>
                                      ₹
                                      {props?.financeData
                                        ? Math.round(props?.financeData?.outstanding)
                                          ?.toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : ''}
                                    </b>
                                  </Typography>
                                </Grid>
                                <Grid item xs={4} className={clsx(classes.textAlignCenter)}>
                                  <div>
                                    Total <br /> Admissions
                                  </div>
                                  <Typography
                                    className={clsx(
                                      // classes.feesOverviewValue,
                                      classes.color3
                                    )}
                                  >
                                    <b>
                                      {props?.financeData
                                        ? props?.financeData?.no_of_admission
                                        : ''}
                                    </b>
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Divider style={{ margin: '8px 0' }} />
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    variant='text'
                                    className={clsx(classes.arrowViewViewMore)}
                                    onClick={feeredirect}
                                    endIcon={
                                      <ArrowForwardIosSharpIcon
                                        fontSize='small'
                                        style={{ color: '#536476' }}
                                      />
                                    }
                                  >
                                    View All
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid
                                style={{
                                  minHeight: '180px',
                                  textAlign: 'center',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                                {!users.includes(user_level) ? (
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
                          </>
                        )}
                      </CardContent>
                    </Card>
                    <Typography className={clsx(classes.resentTransactionText)}>
                      <b> Recent Transaction </b>
                      {!users.includes(user_level) ? (
                        <IconButton
                          size='small'
                          className={clsx(classes.refreshButton)}
                          aria-label='view all'
                          onClick={props.handlerecent}
                        >
                          <RefreshIcon fontSize='small' style={{ color: 'white' }} />
                        </IconButton>
                      ) : (
                        ''
                      )}
                    </Typography>
                    <div
                      style={{
                        minHeight: '235px',
                        // display: 'flex',
                        maxHeight: '300px',
                        overflow: 'auto',
                        width: '100%',
                      }}
                    >
                      <>
                        {props?.progress1?.tranction ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                            }}
                          >
                            <CircularProgress />
                          </div>
                        ) : (
                          <>
                            {props?.recentTransCounter ? (
                              props?.recentTrans && (
                                <>
                                  {props?.recentTrans?.slice(0, 5)?.map((each, index) => {
                                    return (
                                      <>
                                        <Grid
                                          container
                                          className={clsx(classes.transactionTable)}
                                        >
                                          <Grid item md={1}>
                                            <MonetizationOnIcon />
                                          </Grid>
                                          <Grid item md={8}>
                                            <Typography
                                              variant='body2'
                                              className={clsx(
                                                classes.transactionTextDesign
                                              )}
                                            >
                                              Deposition in the bank by <b>{each?.mode}</b>
                                            </Typography>
                                            <Typography
                                              variant='body2'
                                              className={clsx(
                                                classes.transactionTextDesign
                                              )}
                                            >
                                              Branch Name {each?.branch}
                                            </Typography>
                                          </Grid>
                                          <Grid item md={3}>
                                            <Typography
                                              variant='body2'
                                              className={clsx(
                                                classes.transactionTextDesignGray
                                              )}
                                            >
                                              {each?.date}
                                            </Typography>
                                            <Typography
                                              variant='body2'
                                              className={clsx(
                                                classes.transactionTextDesignLeft
                                              )}
                                            >
                                              <b>₹ {each?.amount} </b>
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </>
                                    );
                                  })}
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      margin: '10px 0 0',
                                    }}
                                  >
                                    <Typography
                                      style={{ fontSize: '14px', lineHeight: '17px' }}
                                    >
                                      {props?.recentTrans?.length} Transactions done Today.
                                    </Typography>
                                    <Button
                                      variant='text'
                                      className={clsx(classes.feesOverviewViewMore)}
                                      style={{ fontSize: '16px', lineHeight: '19px' }}
                                      onClick={() =>
                                        handleRouteTransaction(props.branchList)
                                      }
                                      endIcon={
                                        <ArrowForwardIosSharpIcon
                                          fontSize='small'
                                          style={{ color: '#536476' }}
                                        />
                                      }
                                    >
                                      View All
                                    </Button>
                                  </div>
                                </>
                              )
                            ) : (
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  margin: 'auto',
                                  alignItems: 'center',
                                  flexDirection: 'column',
                                }}
                              >
                                <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                                {!users.includes(user_level) ? (
                                  <Typography style={{ fontWeight: '600' }}>
                                    No Records
                                  </Typography>
                                ) : (
                                  <Typography style={{ fontWeight: '600' }}>
                                    Access Denied
                                  </Typography>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item container spacing={1} xs={6}>
                <Grid item xs={12}>
                  <Card>
                    <Card>
                      <CardHeader
                        title={
                          <Typography
                            // variant='h5'
                            style={{ display: 'flex' }}
                            className={clsx(classes.cardtopicStyle)}
                          // onClick={() => setAcademicPerformanceDetailsOpen(true)}
                          // onClick={() => history.push('/finance-owner/academic-performance')}
                          >
                            <b>Academic Performance &nbsp;</b>{''}
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
                          <IconButton
                            size='small'
                            className={clsx(
                              classes.viewButton,
                              classes.refreshButtonMargin
                            )}
                            aria-label='view all'
                            onClick={props.handleAcadRefresh}
                          >
                            <RefreshIcon style={{ color: 'blue', fontSize: '20px' }} />
                          </IconButton>
                        }
                      />
                      <CardContent
                        style={{
                          minHeight: '180px',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <>
                          {props?.progress1?.academic ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CircularProgress />
                            </div>
                          ) : (
                            <>
                              {props?.acadCounter ? (
                                <Grid container spacing={1} alignItems='center'>
                                  <Grid
                                    item
                                    xs={12}
                                    style={{
                                      borderRadius: '5px',
                                      backgroundColor: '#ffd4d9',
                                      // display:'flex'
                                    }}
                                  >
                                    <div className={clsx(classes.absentGrid)}
                                      onClick={() => props?.selectedBranch.length > 0 ? handleBranchRoute(props?.selectedBranch, true) : setAlert('error', 'Please select Atleast one Branch')}>
                                      <div style={{ width: '53%' }}>
                                        <Typography
                                          variant='body2'
                                          className={clsx(classes.customTextSize)}
                                        >
                                          Curriculum Completion
                                        </Typography>
                                      </div>
                                      <div
                                        style={{
                                          width: '13%',
                                          display: 'flex',
                                          fontWeight: 'bolder',
                                        }}
                                      >

                                        <IconButton
                                          aria-label='delete'
                                          size='small'
                                        >
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
                                    <div
                                      className={clsx(classes.absentGrid)}
                                      onClick={() => history.push('./academic-report')}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <div style={{ width: '53%' }}>
                                        <Typography
                                          variant='body2'
                                          // className={classes.textAlignCenter}
                                          className={clsx(classes.customTextSize)}
                                        >
                                          Academic Report
                                        </Typography>
                                      </div>
                                      <div style={{ width: '33%', textAlign: 'center' }}>
                                        <Typography variant='body2'>{''}</Typography>
                                      </div>
                                      <div
                                        style={{
                                          width: '13%',
                                          display: 'flex',
                                          fontWeight: 'bolder',
                                        }}
                                      >
                                        {/* <Typography style={{ fontSize: '15px' }}>
                                        <b>
                                          {props?.avgTest ? (
                                            <>
                                              {isNaN(props?.avgTest?.overall_avg)
                                                ? 0
                                                : Math.round(props?.avgTest?.overall_avg)}
                                              %
                                            </>
                                          ) : (
                                            <>0%</>
                                          )}
                                        </b>
                                      </Typography> */}
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
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <div
                                      className={clsx(classes.absentGrid)}
                                      onClick={() => {
                                        handleBranchRoute(props?.branchList, false);
                                      }}
                                    >
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
                                        <Typography
                                          className={clsx(classes.customTextSize)}
                                        >
                                          <b>
                                            {' '}
                                            {props?.studentAttendanceOverview ? (
                                              <>
                                                {isNaN(
                                                  props?.studentAttendanceOverview[0]
                                                    ?.percentage_attendance
                                                )
                                                  ? 0
                                                  : Math.round(
                                                    props?.studentAttendanceOverview[0]
                                                      ?.percentage_attendance
                                                  )}
                                                %
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
                                    alignItems: 'center',
                                  }}
                                >
                                  <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                                  <Typography style={{ fontWeight: '600' }}>
                                    No Records
                                  </Typography>
                                </Grid>
                              )}
                            </>
                          )}
                        </>
                      </CardContent>
                      <CardActions style={{ float: 'right' }}>
                        <Button
                          size='small'
                          variant='text'
                          className={clsx(classes.viewMoreButton)}
                          onClick={() => setAcademicPerformanceDetailsOpen(true)}
                          endIcon={<ChevronRightIcon style={{ color: 'black' }} />}
                        >
                          View All
                        </Button>
                      </CardActions>
                    </Card>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card style={{ minHeight: '248px' }}>
                    {/* <Grid item xs={12}> */}
                    {/* <Card> */}
                    <CardHeader
                      style={{ padding: '10px' }}
                      title={
                        <Typography
                          className={clsx(classes.clickable, classes.cardtopicStyle)}
                          // variant='h5'
                          // className={clsx(classes.clickable)}
                          // onClick={() => history.push('/staff-attendance-report/branch-wise')}
                          style={{ display: 'flex' }}
                        >
                          <b>Staff Details &nbsp;</b>{' '}
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
                        <>
                          <Button
                            size='small'
                            variant='text'
                            className={clsx(classes.viewMoreButton)}
                            onClick={staffRedirect}
                            endIcon={<ChevronRightIcon style={{ color: 'black' }} />}
                          >
                            View All
                          </Button>
                          <IconButton
                            className={clsx(classes.viewButton)}
                            aria-label='view all'
                            onClick={props.handlestaffOverViewRefresh}
                          >
                            <RefreshIcon style={{ color: 'blue', fontSize: '20px' }} />
                          </IconButton>
                        </>
                      }
                    />
                    <CardContent
                      style={{
                        // minHeight: '300px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <>
                        {props?.progress1?.staffDetails ? (
                          <CircularProgress />
                        ) : (
                          <>
                            {props?.staffOverAll[0] ? (
                              <Grid
                                container
                                spacing={1}
                                alignItems='center'
                                style={{ overflowX: 'auto', maxHeight: '300px' }}
                              >
                                <Grid item sm={12} xs={12}>
                                  <Grid item xs={12}>
                                    <div className={clsx(classes.absentGrid)}>
                                      <div style={{ width: '50%' }}>
                                        <Typography
                                          className={clsx(classes.customTextSize)}
                                        >
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
                                    <Grid
                                      item
                                      xs={12}
                                      className={clsx(classes.classTableStaff)}
                                    >
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
                                            <b>{`${Math.round(
                                              item?.percentage_present
                                            )}%`}</b>
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
                                  flexDirection: 'column',
                                }}
                              >
                                <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                                <Typography style={{ fontWeight: '600' }}>
                                  No Records
                                </Typography>
                              </Grid>
                            )}
                          </>
                        )}
                      </>
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
                          <Paper elevation={1}>
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
                                    <Grid container spacing={1}>
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
                                                  {curriculumData?.length > 0 ? (
                                                    `${Math.round(
                                                      curriculumData[0]
                                                        ?.percentage_completed
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
                                                  {studentReportData &&
                                                    studentReportData[1]
                                                      ?.percentage_attendance > 0 ? (
                                                    <>
                                                      {' '}
                                                      {`${Math.round(
                                                        studentReportData[1]
                                                          ?.percentage_attendance
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
                          </Paper>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
              </Grid>
            </>
          )) : (
          <Grid item container spacing={1} xs={12}>
            <Grid item xs={12}>
              <Card>
                <Card>
                  <CardHeader
                    title={
                      <Typography
                        // variant='h5'
                        style={{ display: 'flex' }}
                        className={clsx(classes.cardtopicStyle)}
                      // onClick={() => setAcademicPerformanceDetailsOpen(true)}
                      // onClick={() => history.push('/finance-owner/academic-performance')}
                      >
                        <b>Academic Performance &nbsp;</b>{''}
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
                              label={props?.selectedBranch[0]?.branch?.branch_name}
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
                          <></>
                        )}
                      </Typography>
                    }
                    action={
                      <IconButton
                        size='small'
                        className={clsx(
                          classes.viewButton,
                          classes.refreshButtonMargin
                        )}
                        aria-label='view all'
                        onClick={props.handleAcadRefresh}
                      >
                        <RefreshIcon style={{ color: 'blue', fontSize: '20px' }} />
                      </IconButton>
                    }
                  />
                  <CardContent
                    style={{
                      minHeight: '90px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <>
                      {props?.progress1?.academic ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CircularProgress />
                        </div>
                      ) : (
                        <>
                          {props?.acadCounter ? (
                            <Grid container spacing={1} alignItems='center'>
                              <Grid
                                item
                                xs={12}
                                style={{
                                  borderRadius: '5px',
                                  backgroundColor: '#ffd4d9',
                                  // display:'flex'
                                }}
                              >
                                <div className={clsx(classes.absentGrid)}
                                  onClick={() => props?.selectedBranch.length > 0 ? handleBranchRoute(props?.selectedBranch, true) : setAlert('error', 'Please select Atleast one Branch')}>
                                  <div style={{ width: '53%' }}>
                                    <Typography
                                      variant='body2'
                                      className={clsx(classes.customTextSize)}
                                    >
                                      Curriculum Completion
                                    </Typography>
                                  </div>
                                  <div
                                    style={{
                                      width: '13%',
                                      display: 'flex',
                                      fontWeight: 'bolder',
                                    }}
                                  >

                                    <IconButton
                                      aria-label='delete'
                                      size='small'
                                    >
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
                                <div
                                  className={clsx(classes.absentGrid)}
                                  onClick={() => history.push('./academic-report')}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div style={{ width: '53%' }}>
                                    <Typography
                                      variant='body2'
                                      // className={classes.textAlignCenter}
                                      className={clsx(classes.customTextSize)}
                                    >
                                      Academic Report
                                    </Typography>
                                  </div>
                                  <div style={{ width: '33%', textAlign: 'center' }}>
                                    <Typography variant='body2'>{''}</Typography>
                                  </div>
                                  <div
                                    style={{
                                      width: '13%',
                                      display: 'flex',
                                      fontWeight: 'bolder',
                                    }}
                                  >
                                    {/* <Typography style={{ fontSize: '15px' }}>
                                        <b>
                                          {props?.avgTest ? (
                                            <>
                                              {isNaN(props?.avgTest?.overall_avg)
                                                ? 0
                                                : Math.round(props?.avgTest?.overall_avg)}
                                              %
                                            </>
                                          ) : (
                                            <>0%</>
                                          )}
                                        </b>
                                      </Typography> */}
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
                                alignItems: 'center',
                              }}
                            >
                              <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
                              <Typography style={{ fontWeight: '600' }}>
                                No Records
                              </Typography>
                            </Grid>
                          )}
                        </>
                      )}
                    </>
                  </CardContent>
                  {/* <CardActions style={{ float: 'right' }}>
                      <Button
                        size='small'
                        variant='text'
                        className={clsx(classes.viewMoreButton)}
                        onClick={() => setAcademicPerformanceDetailsOpen(true)}
                        endIcon={<ChevronRightIcon style={{ color: 'black' }} />}
                      >
                        View All
                      </Button>
                    </CardActions> */}
                </Card>
              </Card>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default withRouter(FinanceOwnerDashboard);
