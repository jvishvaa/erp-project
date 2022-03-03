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
  PersonSharp as PersonSharpIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
import clsx from 'clsx';
import moment from 'moment';
// import { getModuleInfo } from '../../utility-functions';
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
}));

const StuffTypeWiseStuffAttendance = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [volume, setVolume] = React.useState('');
  const [expanded, setExpanded] = useState(true);
  const [loading, setloading] = useState(true);
  const [branchName, setBranchName] = useState(history.location.state.payload.branchName);
  const [branchData, setBranchData] = useState([]);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const {
    match: {
      params: { branchId },
    },
  } = props;

  const { acad_session_id } = history.location.state.payload;

  let dateToday = moment().format('YYYY-MM-DD');

  const handleDateClass = (e) => {
    setDate(e.target.value);
  };

  const handleChange = () => {
    console.log('hello');
    setExpanded(expanded ? false : true);
  };

  const getGradeWiseState = () => {
    axiosInstance
      .get(
        `${endpoints.staff.staffRoleStates}?acad_session_id=${acad_session_id}&date_range_type=${date}`,
        {
          headers: {
            'X-DTS-Host': window.location.host,
          },
        }
      )
      .then((res) => {
        setloading(false);
        console.log('value of res.data ', res.data.result);
        setBranchData(res?.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (erpUser) => {
    const payload = {
      academic_year: history.location.state.payload.academic_year,
      erp_user_name: erpUser.erp_user__roles__role_name,
      branchName: branchName,
      roleIds: erpUser?.erp_user__roles_id,
      acad_session_id: acad_session_id,
    };
    history.push({
      pathname: `/stuff-attendance-report/${erpUser.erp_user__roles__role_name.toLowerCase()}/${branchId}`,
      state: {
        payload: payload,
      },
    });
  };

  useEffect(() => {
    getGradeWiseState();
  }, [date]);

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
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
                <ArrowForwardIosIcon />
                <Typography
                  variant='h6'
                  className={clsx(classes.textBold, classes.colorBlue)}
                >
                  {branchName}
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
                onChange={(e) => handleDateClass(e)}
              />
              {/* <Autocomplete
                disabled
                id='combo-box-demo'
                getOptionLabel={(option) => option.title}
                style={{ width: 140 }}
                renderInput={(params) => (
                  <TextField {...params} label='Today Date' variant='outlined' />
                )}
              /> */}
            </Grid>
            {branchData.length > 0 ? (
              <>
                {branchData?.map((each, index) => {
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
                              <PersonSharpIcon /> {each.erp_user__roles__role_name}
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
                                    <Typography variant='h6'>{`${each.total_present}/${each.total_people}`}</Typography>
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
                                    <Typography variant='h6'>{`${each.total_absent}/${each.total_people}`}</Typography>
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
                                      {each.percentage_present}
                                    </Typography>
                                    <Typography variant='body1'>
                                      % {each.erp_user__roles__role_name} Staff Present
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

          {/* {loading && <Loader />} */}
        </div>
      )}
    </Layout>
  );
};

export default withRouter(StuffTypeWiseStuffAttendance);
