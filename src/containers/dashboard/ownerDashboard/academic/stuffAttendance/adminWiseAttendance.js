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
  Input,
  OutlinedInput,
  TableBody,
  Paper,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  PersonSharp as PersonSharpIcon,
  SearchSharp as SearchSharpIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import clsx from 'clsx';
import moment from 'moment';
import Loader from 'components/loader/loader';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
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
  colorGreen: {
    color: 'lightgreen',
  },
  colorRed: {
    color: 'red',
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

const StuffTypeAdminWiseStuffAttendance = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [loading, setloading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [branchName, setBranchName] = useState(history.location.state.payload.branchName);
  const [adminData, setAdminData] = useState([]);
  const [userName, setUserName] = useState(history.location.state.payload.erp_user_name);
  const [academicYearData, setAcademicYearData] = useState(
    history.location.state.payload.academic_year
  );
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const {
    match: {
      params: { roleName, branchId },
    },
  } = props;

  const { roleIds, acad_session_id } = history.location.state.payload;

  let dateToday = moment().format('YYYY-MM-DD');

  const handleDateClass = (e) => {
    setDate(e);
  };

  const handleChange = () => {
    setExpanded(expanded ? false : true);
  };

  const handleClick = (each) => {
    const payload = {
      branchName: branchName,
      userName: userName,
    };
    console.log(payload, branchId, each.erp_user_id);
    history.push({
      pathname: `/staff-attendance-report/staff-details/${branchId}/${each.erp_user_id}`,
      state: {
        payload: payload,
      },
    });
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const getGradeWiseState = () => {
    axiosInstance
      .get(
        `${endpoints.staff.staffStats}?role_id=${roleIds}&acad_session_id=${acad_session_id}&date_range_type=${date}`,
        {
          headers: {
            'X-DTS-Host': "dev.olvorchidnaigaon.letseduvate.com",
          },
        }
      )
      .then((res) => {
        setloading(false);
        setAdminData(res?.data?.result);
        if (res.status !== 200) {
          alert.warning('something went wrong please try again ');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getGradeWiseState();
  }, [date]);

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
          <Grid container spacing={3} justifyContent='space-between'>
            <Grid item xs={12}>
              <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small' onClick={() => history.goBack()}>
                <ArrowBackIcon />
              </IconButton>
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  Dashboard
                </Typography>
                <ArrowForwardIosIcon />
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  Attendance
                </Typography>
                <ArrowForwardIosIcon />
                <Typography variant='h6' className={clsx(classes.textBold)}>
                  {branchName}
                </Typography>
                <ArrowForwardIosIcon />
                <Typography
                  variant='h6'
                  className={clsx(classes.textBold, classes.colorBlue)}
                >
                  {userName}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6}>
              <OutlinedInput
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
              />
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
              {/* <Autocomplete
                  disabled
                  id="combo-box-demo"
                  getOptionLabel={(option) => option.title}
                  style={{ width: 140 }}
                  renderInput={(params) => <TextField {...params} label="Today Date" variant="outlined" />}
                /> */}
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ERP NO</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Present</TableCell>
                      <TableCell>Absent</TableCell>
                      {/* <TableCell>ABSENT FOR MORE THAN 3 DAYS</TableCell> */}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminData?.map((each, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{each.erp_user__erp_id}</TableCell>
                          <TableCell>{each.erp_user__name}</TableCell>
                          <TableCell className={clsx(classes.colorGreen)}>
                            {each.total_present}
                          </TableCell>
                          <TableCell className={clsx(classes.colorRed)}>
                            {each.total_absent}
                          </TableCell>
                          {/* <TableCell className={clsx(classes.colorRed)}>
                            {each.percentage_present}
                          </TableCell> */}
                          <TableCell>
                            <IconButton onClick={() => handleClick(each)}>
                              <ArrowForwardIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* {loading && <Loader />} */}
        </div>
      )}
    </Layout>
  );
};

export default withRouter(StuffTypeAdminWiseStuffAttendance);
