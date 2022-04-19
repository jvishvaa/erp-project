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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
import endpoints from 'config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import axios from 'axios';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import '../style.scss';

const useStyles = makeStyles((theme) => ({
  rootTab: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  gradeBoxContainer: {
    // marginTop: '15px',
  },
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
  gradeBox: {
    border: '1px solid black',
    padding: '3px',
  },
  gradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '15px 8px',
    maxHeight: '55vh',
    overflowY: 'scroll',
    backgroundColor: 'white',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3) ',
      borderRadius: '10px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      '-webkit-box-shadow': ' inset 0 0 6px rgba(0,0,0,0.5)',
    },
    //   ::-webkit-scrollbar {
    //     width: 12px;
    // }
  },
  eachGradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px 8px',
    margin: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachGradeName: {
    backgroundColor: 'gray',
    color: 'white',
    padding: '4px',
    borderRadius: '5px',
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
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const ReportTab = () => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [expanded, setExpanded] = useState(true);
  const [date, setDate] = useState('');
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const [testSection, setTestSection] = useState();
  const [cwSection, setCwSection] = useState();
  const [hwSection, setHwSection] = useState();
  const [cpSection, setCpSection] = useState();
  const [gradeList, setGradeList] = useState();
  const [alltest, setAllTest] = useState();
  const [allCp, setAllCp] = useState();
  const [acadId, setAcadId] = useState();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;

  let dateToday = moment().format('YYYY-MM-DD');

  useEffect(() => {
    console.log(history.location.state);
    setValue(history?.location?.state?.payload?.tab);
    getTestSection(history?.location?.state?.payload?.grade?.grade_id);
    getCwSection(history?.location?.state?.payload?.grade?.grade_id);
    getCpSection(history?.location?.state?.payload?.grade?.grade_id);
    getHwSection(history?.location?.state?.payload?.grade?.grade_id);
    setAcadId(history?.location?.state?.payload?.acadId);
    TestData(history?.location?.state?.payload?.grade?.grade_id);
    CPData(history?.location?.state?.payload?.grade?.grade_id);
  }, [history]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndexTab = (index) => {
    setValue(index);
  };

  const handleDateClass = (e) => {
    setDate(e.target.value);
  };

  const handleChange = (each, value) => (e, isExpanded) => {
    console.log('hello');
    setExpanded(isExpanded ? value : false);
    getTestSection(each?.grade_id);
    getCwSection(each?.grade_id);
    getHwSection(each?.grade_id);
    getCpSection(each?.grade_id);
    TestData(each?.grade_id);
    CPData(each?.grade_id);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const getTestSection = (each) => {
    axios
      .get(
        `${endpoints.ownerDashboard.getTestSection}?academic_session=${history?.location?.state?.payload?.acadId}&grade=${each}`,
        {
          headers: {
            'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'testDataSection');
        setTestSection(res?.data?.result);
      })
      .catch(() => {
        setTestSection();
      });
  };

  const TestData = async (each) => {
    await axios
      .get(
        `${endpoints.ownerDashboard.getTestData}?academic_session=${history?.location?.state?.payload?.acadId}&grade=${each}`,
        {
          headers: {
            'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'testData');
        setAllTest(res?.data?.result?.stats);
      })
      .catch(() => {
        setAllTest([]);
      });
  };

  const getCwSection = (each) => {
    axios
      .get(
        `${endpoints.ownerDashboard.getCwSection}?acad_session_id=${history?.location?.state?.payload?.acadId}&grade_id=${each}`,
        {
          headers: {
            'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'cwDataSection');
        setCwSection(res?.data?.result);
        //   setTestSection(res?.data?.result?.stats)
      })
      .catch(() => {
        setCwSection();
      });
  };

  const getHwSection = (each) => {
    axios
      .get(
        `${endpoints.ownerDashboard.getHwSection}?acad_session=${history?.location?.state?.payload?.acadId}&grade_id=${each}`,
        {
          headers: {
            'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'hwDataSection');
        setHwSection(res?.data?.result);
        //   setTestSection(res?.data?.result?.stats)
      })
      .catch(() => {
        setHwSection();
      });
  };
  const getCpSection = (each) => {
    axios
      .get(
        `${endpoints.ownerDashboard.getCpSection}?acad_session=${history?.location?.state?.payload?.acadId}&grade=${each}`,
        {
          headers: {
            'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'cpDataSection');
        setCpSection(res?.data?.result);
        //   setTestSection(res?.data?.result?.stats)
      })
      .catch(() => {
        setCpSection();
      });
  };

  const CPData = async (each) => {
    await axios
      .get(
        `${endpoints.ownerDashboard.getCPData}?acad_session=${history?.location?.state?.payload?.acadId}&grade=${each}`,
        {
          headers: {
            'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'cp');
        setAllCp(res.data.result);
      })
      .catch(() => {
        setAllCp([]);
      });
  };

  const handleTestClick = (item, each) => {
    const payload = {
      acad_session: history?.location?.state?.payload?.acadId,
      section: item,
      gradewise: each,
    };

    history.push({
      pathname: `/student-report/test-subject-wise/${history?.location?.state?.payload?.branch}/${each?.grade_id}/${item?.section_mapping_id}`,
      state: {
        payload: payload,
      },
    });
  };

  const handleCwClick = (item, each) => {
    console.log(item, 'cw');

    const payload = {
      acad_session: history?.location?.state?.payload?.acadId,
      section: item,
      gradewise: each,
    };

    history.push({
      pathname: `/student-report/classwork-subject-wise/${history?.location?.state?.payload?.branch}/${each?.grade_id}/${item?.section_mapping_id}`,
      state: {
        payload: payload,
      },
    });
  };

  const handleHwClick = (item, each) => {
    const payload = {
      acad_session: history?.location?.state?.payload?.acadId,
      section: item,
      gradewise: each,
    };

    history.push({
      pathname: `/student-report/homework-subject-wise/${history?.location?.state?.payload?.branch}/${each?.grade_id}/${item?.section_mapping_id}`,
      state: {
        payload: payload,
      },
    });
  };

  const handleCpClick = (item, each) => {
    const payload = {
      acad_session: history?.location?.state?.payload?.acadId,
      section: item,
      gradewise: each,
    };

    history.push({
      pathname: `/student-report/classparticipation-subject-wise/${history?.location?.state?.payload?.branch}/${each?.grade_id}/${item?.section_mapping_id}`,
      state: {
        payload: payload,
      },
    });
  };

  return (
    <Layout>
      <div
        style={{ width: '100%', overflow: 'hidden', padding: '20px' }}
        className='whole-report-curr'
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small' onClick={() => history.goBack()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Student Details
              </Typography>
            </div>
          </Grid>
          <Grid item container xs={9} spacing={3}>
            <Grid item xs={12}>
              <Typography variant='body1'>Overview of All Grades</Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={clsx(classes.gradeOverviewContainer)}>
                {history?.location?.state?.payload?.gradeList &&
                  history?.location?.state?.payload?.gradeList.map((each, index) => {
                    return (
                      <>
                        <div className={`acc${index + 1}`}>
                          {each ? (
                            <Accordion
                              elevation={0}
                              className={clsx(classes.accordion)}
                              // {...{
                              //     ...(index === 0 && {
                              //         expanded: expanded,
                              //         onChange: handleChange,
                              //     }),
                              // }}
                              expanded={expanded === index + 1}
                              onChange={handleChange(each, index + 1)}
                              style={{
                                margin: '10px 0',
                                border: '1px solid',
                                borderRadius: '10px',
                                border: '1px solid #EEEEEE',
                                borderRadius: '7px',
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  onClick={() =>
                                    history.push('/curriculum-completion-section')
                                  }
                                >
                                  {each.grade_name}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div
                                  style={{
                                    width: '100%',
                                    margin: '3%',
                                    border: '1px solid #D4D4D4',
                                    borderRadius: '7px',
                                    padding: '10px',
                                    background: '#FAFAFA',
                                  }}
                                >
                                  <Tabs
                                    value={value}
                                    onChange={handleChangeTab}
                                    indicatorColor='primary'
                                    textColor='primary'
                                    variant='fullWidth'
                                    aria-label='full width tabs example'
                                  >
                                    <Tab label='Test' {...a11yProps(0)} />
                                    <Tab label='HW..' {...a11yProps(1)} />
                                    <Tab label='C.W.' {...a11yProps(2)} />
                                    <Tab label='C.P.' {...a11yProps(3)} />
                                  </Tabs>
                                  <SwipeableViews
                                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                    index={value}
                                    onChangeIndex={handleChangeIndexTab}
                                  >
                                    <TabPanel
                                      value={value}
                                      index={0}
                                      dir={theme.direction}
                                      style={{ display: 'flex', flexDirection: 'column' }}
                                      className='tabPaneltest'
                                    >
                                      <TableContainer>
                                        <Table>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell></TableCell>
                                              <TableCell>T. Students</TableCell>
                                              <TableCell>St. Below Threshold</TableCell>
                                              <TableCell>Avg Marks</TableCell>
                                              <TableCell></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {alltest &&
                                              alltest.map((item, index) => {
                                                return (
                                                  <TableRow key={index}>
                                                    <TableCell>All Section</TableCell>
                                                    <TableCell>
                                                      {item?.total_students}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.below_threshold}
                                                    </TableCell>
                                                    <TableCell>
                                                      {' '}
                                                      {`${Math.round(item?.avg_score)}%`}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                            {testSection &&
                                              testSection.map((item, index) => {
                                                return (
                                                  <TableRow key={index}>
                                                    <TableCell>
                                                      {item?.section_name}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.total_students}
                                                    </TableCell>
                                                    <TableCell>
                                                      {
                                                        item?.assignment_details
                                                          ?.below_threshold
                                                      }
                                                    </TableCell>
                                                    <TableCell>
                                                      {`${Math.round(
                                                        item?.assignment_details
                                                          ?.avg_score
                                                      )}%`}
                                                    </TableCell>
                                                    <TableCell>
                                                      <IconButton
                                                        size='small'
                                                        onClick={() =>
                                                          handleTestClick(item, each)
                                                        }
                                                      >
                                                        <ArrowForwardIcon />
                                                      </IconButton>
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                      {/* <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          width: '50%',
                                          float: 'right',
                                        }}
                                      >
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        >
                                          T. Students
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        >
                                          St. Below Threshold
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        >
                                          Avg Marks
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        ></Typography>
                                      </div>
                                      <div className='firstSec'>
                                        {alltest &&
                                          alltest.map((item, index) => (
                                            <div
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '1px solid #EEEEEE',
                                                padding: '1% 2%',
                                              }}
                                            >
                                              <div>All Section</div>
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  width: '45%',
                                                  marginRight: '3%',
                                                }}
                                              >
                                                <div>{item?.total_students}</div>
                                                <div>{item?.below_threshold}</div>
                                                <div>
                                                  {`${Math.round(item?.avg_score)}%`}
                                                </div>
                                                <div style={{ width: '10%' }}></div>
                                              </div>
                                            </div>
                                          ))}
                                        {testSection &&
                                          testSection.map((item, index) => (
                                            <div
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '1px solid #EEEEEE',
                                                padding: '1% 2%',
                                              }}
                                              onClick={() => handleTestClick(item, each)}
                                            >
                                              <div>{item?.section_name}</div>
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  width: '45%',
                                                  marginRight: '3%',
                                                }}
                                              >
                                                <div>{item?.total_students}</div>
                                                <div>
                                                  {
                                                    item?.assignment_details
                                                      ?.below_threshold
                                                  }
                                                </div>
                                                <div>
                                                  {`${Math.round(
                                                    item?.assignment_details?.avg_score
                                                  )}%`}
                                                </div>
                                                <ArrowForwardIcon />
                                              </div>
                                            </div>
                                          ))}
                                      </div> */}
                                    </TabPanel>

                                    <TabPanel
                                      value={value}
                                      index={1}
                                      dir={theme.direction}
                                      className='tabPaneltest'
                                    >
                                      <TableContainer>
                                        <Table>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell></TableCell>
                                              <TableCell>T. Students</TableCell>
                                              <TableCell>St. Below Threshold</TableCell>
                                              <TableCell>Avg Marks</TableCell>
                                              <TableCell></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell>All Section</TableCell>
                                              <TableCell>
                                                {hwSection?.total_students}
                                              </TableCell>
                                              <TableCell>
                                                {hwSection?.no_stud_below_threshold}
                                              </TableCell>
                                              <TableCell>{`${Math.round(
                                                hwSection?.avg_marks
                                              )}%`}</TableCell>
                                              <TableCell></TableCell>
                                            </TableRow>
                                            {hwSection?.hw_details &&
                                              hwSection?.hw_details?.map((item) => {
                                                return (
                                                  <TableRow key={index}>
                                                    <TableCell>
                                                      {item?.section_name}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.total_students}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.threshold_count}
                                                    </TableCell>
                                                    <TableCell>
                                                      {Math.round(item?.average)}%
                                                    </TableCell>
                                                    <TableCell>
                                                      <IconButton
                                                        size='small'
                                                        onClick={() =>
                                                          handleHwClick(item, each)
                                                        }
                                                      >
                                                        <ArrowForwardIcon />
                                                      </IconButton>
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                      {/* <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          width: '60%',
                                          float: 'right',
                                        }}
                                      >
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        >
                                          T. Students
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        >
                                          St. Below Threshold
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        >
                                          Avg.Marks
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        ></Typography>
                                      </div>
                                      <div className='firstSec'>
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            border: '1px solid #EEEEEE',
                                            padding: '1% 2%',
                                          }}
                                        >
                                          <div>All Section</div>
                                          <div
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              width: '45%',
                                              marginRight: '3%',
                                            }}
                                          >
                                            <div style={{ width: '30%' }}>
                                              {hwSection?.total_students}
                                            </div>
                                            <div style={{ width: '30%' }}>
                                              {hwSection?.no_stud_below_threshold}
                                            </div>

                                            <div style={{ width: '30%' }}>
                                              {`${Math.round(hwSection?.avg_marks)}%`}
                                            </div>
                                            <div style={{ width: '30%' }}></div>
                                          </div>
                                        </div>
                                      </div>
                                      {hwSection?.hw_details &&
                                        hwSection?.hw_details?.map((item) => (
                                          <div
                                            className='firstSec'
                                            onClick={() => handleHwClick(item, each)}
                                          >
                                            <div
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '1px solid #EEEEEE',
                                                padding: '1% 2%',
                                              }}
                                            >
                                              <div>{item?.section_name}</div>
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  width: '45%',
                                                  marginRight: '3%',
                                                }}
                                              >
                                                <div>{item?.total_students}</div>
                                                <div>{item?.threshold_count}</div>
                                                <div>
                                                  {`${Math.round(item?.average)}%`}
                                                </div>
                                                <ArrowForwardIcon />
                                              </div>
                                            </div>
                                          </div>
                                        ))} */}
                                    </TabPanel>
                                    <TabPanel
                                      value={value}
                                      index={2}
                                      dir={theme.direction}
                                      className='tabPaneltest'
                                    >
                                      <TableContainer>
                                        <Table>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell></TableCell>
                                              <TableCell>T. Students</TableCell>
                                              <TableCell>St. Below Threshold</TableCell>
                                              <TableCell>Avg Marks</TableCell>
                                              <TableCell></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell>
                                                {cwSection?.section_name}
                                              </TableCell>
                                              <TableCell>
                                                {cwSection?.total_students}
                                              </TableCell>
                                              <TableCell>
                                                {cwSection?.students_below_threshold}
                                              </TableCell>
                                              <TableCell>
                                                {Math.round(cwSection?.avg_marks)}%
                                              </TableCell>
                                              <TableCell></TableCell>
                                            </TableRow>
                                            {cwSection?.result?.length > 0 &&
                                              cwSection?.result?.map((item, index) => {
                                                return (
                                                  <TableRow key={index}>
                                                    <TableCell>
                                                      {item?.section_name}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.total_students}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.students_below_threshold}
                                                    </TableCell>
                                                    <TableCell>
                                                      {Math.round(item?.avg_marks)}%
                                                    </TableCell>
                                                    <TableCell>
                                                      <IconButton
                                                        size='small'
                                                        onClick={() =>
                                                          handleCwClick(item, each)
                                                        }
                                                      >
                                                        <ArrowForwardIcon />
                                                      </IconButton>
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                      {/* <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          width: '50%',
                                          float: 'right',
                                        }}
                                      >
                                        <Typography style={{ fontWeight: '600' }}>
                                          T. Students
                                        </Typography>
                                        <Typography style={{ fontWeight: '600' }}>
                                          St. Below Threshold
                                        </Typography>
                                        <Typography style={{ fontWeight: '600' }}>
                                          Avg Marks
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '25%' }}
                                        ></Typography>
                                      </div>
                                      <div className='firstSec'>
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            border: '1px solid #EEEEEE',
                                            padding: '1% 2%',
                                          }}
                                        >
                                          <div>{cwSection?.section_name}</div>
                                          <div
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              width: '45%',
                                              marginRight: '3%',
                                            }}
                                          >
                                            <div>{cwSection?.total_students}</div>
                                            <div>
                                              {cwSection?.students_below_threshold}
                                            </div>
                                            <div>
                                              {`${Math.round(cwSection?.avg_marks)}%`}
                                            </div>
                                            <div style={{ width: '5%' }}></div>
                                          </div>
                                        </div>
                                      </div>
                                      {cwSection?.result?.length > 0 &&
                                        cwSection?.result?.map((item) => (
                                          <div
                                            className='firstSec'
                                            onClick={() => handleCwClick(item, each)}
                                          >
                                            <div
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '1px solid #EEEEEE',
                                                padding: '1% 2%',
                                              }}
                                            >
                                              <div>{item?.section_name}</div>
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  width: '45%',
                                                  marginRight: '3%',
                                                }}
                                              >
                                                <div>{item?.total_students}</div>
                                                <div>
                                                  {item?.students_below_threshold}
                                                </div>
                                                <div>
                                                  {`${Math.round(item?.avg_marks)}%`}
                                                </div>
                                                <ArrowForwardIcon />
                                              </div>
                                            </div>
                                          </div>
                                        ))} */}
                                    </TabPanel>
                                    <TabPanel
                                      value={value}
                                      index={3}
                                      dir={theme.direction}
                                      className='tabPaneltest'
                                    >
                                      <TableContainer>
                                        <Table>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell></TableCell>
                                              <TableCell>T. Students</TableCell>
                                              <TableCell>St. Below Threshold</TableCell>
                                              <TableCell>Avg Marks</TableCell>
                                              <TableCell></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {allCp &&
                                              allCp.map((item, index) => {
                                                return (
                                                  <TableRow key={index}>
                                                    <TableCell>All Section</TableCell>
                                                    <TableCell>
                                                      {item?.total_students_count}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.below_threshold}
                                                    </TableCell>
                                                    <TableCell>
                                                      {Math.round(item?.avg_score)}%
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                            {cpSection &&
                                              cpSection.map((item, index) => {
                                                return (
                                                  <TableRow key={index}>
                                                    <TableCell>
                                                      {item?.section_name}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.total_students_count}
                                                    </TableCell>
                                                    <TableCell>
                                                      {item?.below_threshold}
                                                    </TableCell>
                                                    <TableCell>
                                                      {Math.round(item?.avg_score)}%
                                                    </TableCell>
                                                    <TableCell>
                                                      <IconButton
                                                        size='small'
                                                        onClick={() =>
                                                          handleCpClick(item, each)
                                                        }
                                                      >
                                                        <ArrowForwardIcon />
                                                      </IconButton>
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                      {/* <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          width: '50%',
                                          float: 'right',
                                        }}
                                      >
                                        <Typography style={{ fontWeight: '600' }}>
                                          T. Students
                                        </Typography>
                                        <Typography style={{ fontWeight: '600' }}>
                                          St. Below Threshold
                                        </Typography>
                                        <Typography style={{ fontWeight: '600' }}>
                                          Avg Marks
                                        </Typography>
                                        <Typography
                                          style={{ fontWeight: '600', width: '30%' }}
                                        ></Typography>
                                      </div>
                                      <div className='firstSec'>
                                        {allCp &&
                                          allCp.map((item, index) => (
                                            <div
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '1px solid #EEEEEE',
                                                padding: '1% 2%',
                                              }}
                                            >
                                              <div>All Section</div>
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  width: '45%',
                                                  marginRight: '3%',
                                                }}
                                              >
                                                <div>{item?.total_students_count}</div>
                                                <div>{item?.below_threshold}</div>
                                                <div>
                                                  {`${Math.round(item?.avg_score)}%`}
                                                </div>
                                                <div style={{ width: '10%' }}></div>
                                              </div>
                                            </div>
                                          ))}
                                        {cpSection &&
                                          cpSection.map((item, index) => (
                                            <div
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                border: '1px solid #EEEEEE',
                                                padding: '1% 2%',
                                              }}
                                              onClick={() => handleCpClick(item, each)}
                                            >
                                              <div>{item?.section_name}</div>
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  width: '45%',
                                                  marginRight: '3%',
                                                }}
                                              >
                                                <div>{item?.total_students_count}</div>
                                                <div>{item?.below_threshold}</div>
                                                <div>
                                                  {`${Math.round(item?.avg_score)}%`}
                                                </div>
                                                <ArrowForwardIcon />
                                              </div>
                                            </div>
                                          ))}
                                      </div> */}
                                    </TabPanel>
                                  </SwipeableViews>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          ) : (
                            <></>
                          )}
                        </div>
                      </>
                    );
                  })}
              </div>
            </Grid>
          </Grid>
        </Grid>

        {/* {loading && <Loader />} */}
      </div>
    </Layout>
  );
};

export default withRouter(ReportTab);
