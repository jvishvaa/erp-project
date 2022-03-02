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
  TableRow,
  TableCell,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
import { connect, useSelector } from 'react-redux';
// import { getModuleInfo } from '../../utility-functions';
import clsx from 'clsx';
import moment from 'moment';
import Loader from 'components/loader/loader';
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
  pagination: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const BranchWiseStuffAttendance = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [loading, setloading] = useState(false);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [branchAttendance, setBranchAttendance] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(10);
  const {
    match: {
      params: { branchId },
    },
  } = props;

  let dateToday = moment().format('YYYY-MM-DD');

  const handleDateClass = (e) => {
    setDate(e);
    setCurrentPage(1);
  };
  const moduleId = 1;

  const handleChange = () => {
    console.log('hello');
    setExpanded(expanded ? false : true);
  };

  const handleClick = (data) => {
    const payload = {
      academic_year: selectedAcademicYear,
      branchName: data.branch_name,
      acad_session_id:data.acadsession__id
    };
    history.push({
      pathname: `/staff-attendance-report/staff-type-wise/${data?.branch_id}`,
      state: {
        payload: payload,
      },
    });
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const getData = (params = {}) => {
    setloading(true);
    axiosInstance
      .get(`${endpoints.staff.staffAttandance}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
        },
      })
      .then((res) => {
        setloading(false);
        setBranchAttendance(res.data.result.data);
        setTotalPageCount(res.data.result.total_pages);
        setloading(false);
        if (res.status !== 200) {
          alert.warning('something went wrong please try again ');
        }
      })
      .catch((err) => {
        console.log('error is ', err);
      });
  };

  useEffect(() => {
    getData({
      session_year_id: selectedAcademicYear.id,
      date_range_type: date,
      page: currentPage,
      page_size: 5,
    });
  }, [date, currentPage]);

  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{ width: '100%', overflow: 'hidden', padding: '20px' }}
          className='whole-subject-curr'
        >
          <Grid container spacing={3} justifyContent='space-between'>
            <Grid item xs={6}>
              <div className={clsx(classes.breadcrumb)}>
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  Dashboard
                </Typography>
                <ArrowForwardIosIcon />
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  Attendance
                </Typography>
              </div>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label='Date'
                type='date'
                variant='outlined'
                margin='dense'
                value={date}
                // defaultValue="2017-05-24"
                // sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleDateClass(e.target.value)}
              />
            </Grid>
            {branchAttendance.length > 0 ? (
              <>
                {branchAttendance?.map((each, index) => {
                  return (
                    <Grid item xs={12} key={index}>
                      <Card elevation={1}>
                        <CardHeader
                          title={
                            <Typography
                              variant='h5'
                              // className={clsx(classes.clickable)}
                              // onClick={() => history.push('/finance-owner/academic-performance')}
                            >
                              {each.branch_name}
                            </Typography>
                          }
                          className={clsx(classes.link)}
                          onClick={() => handleClick(each)}
                        />
                        <Divider />
                        <CardContent>
                          <Grid container spacing={2} justifyContent='center'>
                            <Grid item xs={3}>
                              <Card elevation={0}>
                                <CardContent>
                                  <Typography variant='body1'>Total Staff</Typography>
                                  <Typography
                                    variant='h6'
                                    className={clsx(classes.textBold)}
                                  >
                                    {each.total_people}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={3}>
                              <Card elevation={1}>
                                <CardContent className={clsx(classes.cardContantFlex)}>
                                  <span
                                    className={clsx(
                                      classes.cardLetter,
                                      classes.backgrounColorGreen,
                                      classes.colorWhite,
                                      classes.textBold
                                    )}
                                  >
                                    P
                                  </span>
                                  <div>
                                    <Typography variant='h6'>{`${each.attendance_details.total_present}/${each.total_people}`}</Typography>
                                    <Typography variant='body1'>Total Present</Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={3}>
                              <Card elevation={1}>
                                <CardContent className={clsx(classes.cardContantFlex)}>
                                  <span
                                    className={clsx(
                                      classes.cardLetter,
                                      classes.backgrounColorRed,
                                      classes.colorWhite,
                                      classes.textBold
                                    )}
                                  >
                                    A
                                  </span>
                                  <div>
                                    <Typography variant='h6'>{`${each.attendance_details.total_absent}/${each.total_people}`}</Typography>
                                    <Typography variant='body1'>Total Absent</Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={3}>
                              <Card elevation={1}>
                                <CardContent className={clsx(classes.cardContantFlex)}>
                                  <span
                                    className={clsx(
                                      classes.cardLetter,
                                      classes.backgrounColorBlue,
                                      classes.colorWhite,
                                      classes.textBold
                                    )}
                                  >
                                    %
                                  </span>
                                  <div>
                                    <Typography variant='h6'>
                                      {(each.attendance_details.total_present /
                                        each.total_people) *
                                        100}
                                    </Typography>
                                    <Typography variant='body1'>
                                      % {each.branch_name} Staff Present
                                    </Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={6}>
                              <div className={clsx(classes.absentDiv)}>
                                <span style={{ fontSize: '1rem' }}>
                                  Absentfor more than 3 continuous days.
                                </span>
                                <span
                                  style={{
                                    padding: '5px',
                                    backgroundColor: 'lightpink',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {each.moreAbsent}
                                </span>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Pagination
                    onChange={handlePagination}
                    count={totalPageCount}
                    // count={Math.ceil(totalEbooks / pageSize)}
                    color='primary'
                    // page={pageNo}
                    page={currentPage}
                    className={clsx(classes.pagination)}
                  />
                </Grid>
              </>
            ) : (
              <Grid
                xs={6}
                style={{ textAlign: 'center', margin: 'auto ', padding: '100px' }}
                spacing={6}
              >
                <Card elevation={0}>
                  <CardContent>
                    <Typography variant='h6' className={clsx(classes.textBold)}>
                      No Data for Selected Date
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {loading && <Loader />}
        </div>
      )}
    </Layout>
  );
};

export default withRouter(BranchWiseStuffAttendance);
