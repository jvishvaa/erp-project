import React, { useState, useEffect, useContext } from 'react';
import Layout from '../Layout';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Grid, Button, Toolbar } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Loading from '../../components/loader/loader';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@material-ui/core/Box';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import Tooltip from '@material-ui/core/Tooltip';
import './Styles.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 200,
    margin: 40,
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    margin: '10px',
    maxWidth: '100%',
    height: '25vh fixed',
  },
  button: {
    margin: 20,
  },
  display: {
    display: 'inline-block',
  },
}));

const ResponderView = () => {
  const classes = useStyles();
  const [branches, setBranches] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [searchBranch, setSearchBranches] = useState('');
  const [page, setPage] = useState(1);
  const [filterPage, setFilterPage] = useState(1);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState(3);
  const limit = 5;
  const [totalCount, setTotalCount] = useState(0);
  const { setAlert } = useContext(AlertNotificationContext);
  const [opened, setOpened] = useState(false);
  const moduleId = 175;
  const [usrName, setUsrName] = useState('');
  const [userId, setUSerId] = useState('');

  const getAppointments = () => {
    if (searchBranch) {
      console.log('searchBranch:', searchBranch);
      axiosInstance
        .get(
          `${endpoints.Appointments.bookedAppointmentList}?branches=${searchBranch}&page=${page}`
        )
        .then((res) => {
          console.log('filter-list', res.data.data.results);
          console.log('total_pages,', res.data.data.total_pages);
          setAppointmentsList(res.data.data.results);
          setTotalCount(res.data.data.count);
        });
    } else {
      axiosInstance
        .get(
          `${endpoints.Appointments.bookedAppointmentList}?page=${page}&page_size=${limit}`
        )
        .then((res) => {
          console.log('appo-list', res.data.data.results);
          setAppointmentsList(res.data.data.results);
          setTotalCount(res.data.data.count);
        });
    }
  };

  useEffect(() => {
    callApi(
      `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
      'academicYearList'
    );
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    console.log('in useeffect');
    axiosInstance.get(endpoints.masterManagement.branchList).then((res) => {
      console.log('res', res.data.data);
      setBranches(res.data.data);
    });

    getAppointments();
  }, [page]);

  const handleChange = (e) => {
    console.log('response', e.target.value);
    setStatus(2);
    setResponse({ ...response, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    console.log('id', id);
    console.log('handleSubmit', response);
    console.log('status:', status);
    if (response == '') {
      setLoading(false);
      setAlert('error', "respone can't be empty");
    } else {
      axiosInstance
        .put(`academic/${id}/${endpoints.Appointments.updateAppointment}`, {
          appointment_status: status,
          response: response.response,
          schedule_date: response.schedule_date,
          schedule_time: response.schedule_time,
        })

        .then((result) => {
          if (result.data.status_code === 200) {
            setLoading(false);
            setAlert('success', result.data.message);
            getAppointments();
          } else {
            setLoading(false);
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    }
  };
  const handleDeclineSubmit = (e, id) => {
    e.preventDefault();
    axiosInstance
      .put(`academic/${id}/${endpoints.Appointments.updateAppointment}`, {
        appointment_status: status,
      })

      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
          getAppointments();
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleDateandTime = (id) => {
    console.log('id:-', id);
    console.log('resopnseeee', response);
    axiosInstance
      .put(`academic/${id}/${endpoints.Appointments.updateAppointment}`, {
        schedule_date: response.schedule_date,
        schedule_time: response.schedule_time,
      })

      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setAlert('success', result.data.message);
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };
  const handleBranche = (e, id) => {
    // e.preventDefault();

    if (id) {
      setPage(1);
      console.log('handleBranche:', id.id);
      setSearchBranches(id.id);
    } else {
      setSearchBranches('');
    }
  };
  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log('this academic year', result?.data?.data || []);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || []);
            setBranchList(result?.data?.data?.results || []);
          }
          // if (key === 'gradeList') {
          //   console.log(result?.data?.data || []);
          //   setGradeList(result.data.data || []);
          // }
          // if (key === 'section') {
          //   console.log(result?.data?.data || []);
          //   setSectionList(result.data.data);
          // }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  // useEffect(() => {
  //   callApi(
  //     `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
  //     'academicYearList'
  //   );
  // });

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    console.log('jhgvb');
    getAppointments();

    // axiosInstance
    //   .get(
    //     `${endpoints.Appointments.bookedAppointmentList}?branches=${searchBranch}&page=${page}`
    //   )
    //   .then((res) => {
    //     console.log('filter-list', res.data.data.results);
    //     setAppointmentsList(res.data.data.results);
    //     setTotalCount(res.data.data.count);
    //   });
  };
  // let userName = JSON.parse(localStorage.getItem('userDetails')) || {};
  // console.log(userName.first_name, 'userName');
  // console.log(userName.erp, 'Erp ID');
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <Grid md={12} sm={12} xs={12}>
          <CommonBreadcrumbs componentName='ResponderView' />
        </Grid>
        <form>
          <Grid container direction='row' spacing={2} style={{ width: '100%' }}>
            <Grid item xs={10} sm={5} md={3} className='responderV' lg={2}>
              <Autocomplete
                id='size-small-standard'
                size='small'
                // options={branches}
                className={classes.root}
                // onChange={handleBranche}
                style={{ marginTop: '40px', marginLeft: '20px' }}
                fullWidth
                // getOptionLabel={(option) => option.branch_name}
                onChange={(event, value) => {
                  console.log('moduleIdDDD', moduleId);
                  setSelectedAcadmeicYear(value);
                  if (value) {
                    callApi(
                      `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                      'branchList'
                    );
                  }
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedAcademicYear || ''}
                options={academicYear || ''}
                getOptionLabel={(option) => option?.session_year || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    name='Academic'
                    placeholder='Academic Year'
                  />
                )}
              />
            </Grid>

            <Grid item xs={10} sm={5} md={3} lg={2}>
              <Autocomplete
                id='size-small-standard'
                size='small'
                // options={branches}
                className={classes.root}
                style={{ marginTop: '40px', marginLeft: '20px' }}
                fullWidth
                // onChange={handleBranche}
                onChange={(event, value) => {
                  setSelectedBranch([]);
                  if (value) {
                    // const ids = value.map((el)=>el)
                    const selectedId = value.branch.id;
                    setSelectedBranch(value);
                    callApi(
                      `${endpoints.academics.grades}?session_year=${
                        selectedAcademicYear.id
                      }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                      'gradeList'
                    );
                  }
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || ''}
                options={branchList || ''}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branch'
                    name='branch'
                    placeholder='Branch'
                  />
                )}
              />
            </Grid>

            <Grid item xs={4} sm={5} md={3} lg={2}>
              <Button
                variant='contained'
                type='submit'
                color='primary'
                style={{ marginTop: '16%', marginLeft: '20%' }}
                onClick={handleFilter}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* <div className='paginateData'>
          <TablePagination
            component='div'
            className='customPagination'
            count={totalCount}
            rowsPerPage={limit}
            page={page - 1}
            onChangePage={handleChangePage}
            rowsPerPageOptions={false}
          />
        </div> */}
        {appointmentsList.map((item, index) => {
          return (
            <form>
              <Paper
                className={classes.paper}
                elevation={3}
                // style={{ backgroundColor: 'gray' }}
              >
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    container
                    direction='column'
                    spacing={2}
                    style={{ marginTop: 40 }}
                  >
                    <Typography gutterBottom variant='subtitle1'>
                      <Box
                        fontWeight='fontWeightBold'
                        m={1}
                        className={classes.display}
                        style={{ marginLeft: 15 }}
                      >
                        Student ERP:
                      </Box>{' '}
                      <Typography className={classes.display}>
                        {item.student?.username}
                      </Typography>
                    </Typography>
                    <Typography gutterBottom variant='subtitle1'>
                      <Box
                        fontWeight='fontWeightBold'
                        m={1}
                        className={classes.display}
                        style={{ marginLeft: 15 }}
                      >
                        Student Name:
                      </Box>
                      <Typography className={classes.display}>
                        {item.student?.first_name}
                      </Typography>
                    </Typography>

                    <Typography variant='subtitle1' gutterBottom>
                      <Box
                        fontWeight='fontWeightBold'
                        m={1}
                        className={classes.display}
                        style={{ marginLeft: 15 }}
                      >
                        Requested Date:
                      </Box>{' '}
                      <Typography className={classes.display}>
                        {item.appointment_date}
                      </Typography>
                    </Typography>
                    <Typography variant='subtitle1'>
                      <Box
                        fontWeight='fontWeightBold'
                        m={1}
                        className={classes.display}
                        style={{ marginLeft: 15 }}
                      >
                        Requested Time:
                      </Box>
                      <Typography className={classes.display}>
                        {item.appointment_time ? item.appointment_time.slice(0, 5) : ''}
                      </Typography>
                    </Typography>
                  </Grid>

                  <Grid item xs container direction='column' spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Typography gutterBottom variant='subtitle1'>
                        <Box
                          fontWeight='fontWeightBold'
                          m={1}
                          className={classes.display}
                          style={{ marginTop: 40 }}
                        >
                          Schedule Date:
                        </Box>

                        {item.schedule_date ||
                        item.appointment_status === 'Accepted' ||
                        item.appointment_status === 'Declined' ? (
                          <Typography className={classes.display}>
                            {item.schedule_date
                              ? item.schedule_date
                              : item.appointment_date}
                          </Typography>
                        ) : (
                          <TextField
                            name='schedule_date'
                            InputLabelProps={{ shrink: true, required: true }}
                            type='date'
                            variant='standard'
                            style={{ marginTop: 40 }}
                            onChange={handleChange}
                            size='small'
                          />
                        )}
                      </Typography>

                      <Typography variant='subtitle1' gutterBottom>
                        <Box
                          fontWeight='fontWeightBold'
                          m={1}
                          className={classes.display}
                        >
                          Schedule Time:
                        </Box>
                        {item.schedule_time ||
                        item.appointment_status === 'Accepted' ||
                        item.appointment_status === 'Declined' ? (
                          <Typography className={classes.display}>
                            {item.schedule_time
                              ? item.schedule_time
                              : item.appointment_time}
                          </Typography>
                        ) : (
                          <TextField
                            name='schedule_time'
                            InputLabelProps={{ shrink: true, required: true }}
                            type='time'
                            variant='standard'
                            onChange={handleChange}
                            size='small'
                          />
                        )}
                      </Typography>
                      <Typography variant='subtitle1'>
                        <Box
                          fontWeight='fontWeightBold'
                          m={1}
                          className={classes.display}
                        >
                          Status:
                        </Box>{' '}
                        <Typography className={classes.display}>
                          {item.appointment_status}
                        </Typography>
                      </Typography>
                      <Grid container spacing={1} direction='column'>
                        <Grid md={4} xs={12}>
                          {(item.response && item.appointment_status === 'Accepted') ||
                          item.appointment_status === 'Declined' ||
                          item.schedule_date ? (
                            <Tooltip
                              title='Change Schedule Date and Time'
                              aria-label='add'
                            >
                              <Grid xs={12} md={4} sm={4}>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  // name='appointment_status'
                                  // className={classes.button}
                                  style={{ borderRadius: 70, marginLeft: 10 }}
                                  type='submit'
                                  disabled
                                >
                                  <EditRoundedIcon fontSize='small' />
                                </Button>
                              </Grid>
                            </Tooltip>
                          ) : (
                            <Grid md={12} xs={12}>
                              <Tooltip
                                title='Change Schedule Date and Time'
                                aria-label='add'
                              >
                                <Button
                                  variant='contained'
                                  color='primary'
                                  // name='appointment_status'
                                  // className={classes.button}
                                  style={{ borderRadius: 70, marginLeft: 10 }}
                                  type='submit'
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('change time');
                                    handleDateandTime(item.id);
                                  }}
                                >
                                  <EditRoundedIcon fontSize='small' />
                                </Button>
                              </Tooltip>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4} style={{ marginTop: 40 }}>
                    <Typography variant='subtitle1' gutterBottom>
                      <Box fontWeight='fontWeightBold' m={1} className={classes.display}>
                        Appointment Mode:{' '}
                      </Box>
                      <Typography className={classes.display}>
                        {item.booking_mode}
                      </Typography>
                    </Typography>
                    <Typography variant='subtitle1'>
                      <Box fontWeight='fontWeightBold' m={1} className={classes.display}>
                        Appointment Host:
                      </Box>{' '}
                      <Typography className={classes.display}>
                        {item.role?.role_name}
                      </Typography>
                    </Typography>
                    <Typography variant='subtitle1'>
                      <Box fontWeight='fontWeightBold' m={1} className={classes.display}>
                        Concern:{' '}
                      </Box>
                      <Typography className={classes.display}>{item.message}</Typography>
                    </Typography>

                    {(item.response && item.appointment_status === 'Accepted') ||
                    item.appointment_status === 'Declined' ? (
                      <Grid container spacing={1} direction='column'>
                        <form>
                          {/* <Grid md={9} xs={12}>
                            <TextField
                              id='standard-basic'
                              label='response '
                              name='response'
                              helperText='Allowed 100 Charecters only'
                              onChange={handleChange}
                              defaultValue={item.response}
                              inputProps={{ maxLength: 100 }}
                              style={{ marginLeft: 15 }}
                              disabled
                            />
                          </Grid> */}
                          <Typography variant='subtitle1'>
                            <Box
                              fontWeight='fontWeightBold'
                              m={1}
                              className={classes.display}
                              style={{ marginLeft: 15 }}
                            >
                              response:{' '}
                            </Box>
                            <Typography className={classes.display}>
                              {' '}
                              {item.response}
                            </Typography>
                          </Typography>

                          <Grid container spacing={1} direction='row'>
                            <Grid item xs={6} sm={4} md={5} lg={4}>
                              <Button
                                variant='contained'
                                color='primary'
                                name='appointment_status'
                                // className={classes.button}
                                value='2'
                                type='submit'
                                disabled
                              >
                                Accept
                              </Button>
                            </Grid>
                            <Grid item xs={6} sm={4} md={5} lg={4}>
                              <Button
                                variant='contained'
                                color='primary'
                                name='appointment_status'
                                // className={classes.button}
                                // style={{ height: 40, top: 75 }}
                                type='submit'
                                disabled
                              >
                                Decline
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </Grid>
                    ) : (
                      <Grid container spacing={1} direction='column'>
                        <form>
                          <Grid md={9} xs={12}>
                            <TextField
                              id='standard-basic'
                              label='response '
                              name='response'
                              helperText='Allowed 20 Charecters only'
                              onChange={handleChange}
                              inputProps={{ maxLength: 20 }}
                              style={{ marginLeft: 15 }}
                            />
                          </Grid>
                          <Grid container spacing={1} direction='row'>
                            <Grid item xs={6} sm={4} md={5} lg={4}>
                              <Button
                                variant='contained'
                                color='primary'
                                name='appointment_status'
                                // className={classes.button}
                                value='2'
                                type='submit'
                                onClick={(e) => {
                                  // e.preventDefault();
                                  handleSubmit(e, item.id);
                                }}
                                style={{ display: 'inline' }}
                              >
                                Accept
                              </Button>
                            </Grid>
                            <Grid item xs={6} sm={4} md={5} lg={4}>
                              <Button
                                variant='contained'
                                color='primary'
                                name='appointment_status'
                                // className={classes.button}
                                // style={{ height: 40, top: 75 }}
                                style={{ display: 'inline' }}
                                type='submit'
                                onClick={(e) => {
                                  // e.preventDefault();
                                  handleDeclineSubmit(e, item.id);
                                }}
                              >
                                Decline
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </form>
          );
        })}
        <div className='paginateData'>
          <TablePagination
            component='div'
            className='customPagination'
            count={totalCount}
            rowsPerPage={limit}
            page={page - 1}
            onChangePage={handleChangePage}
            rowsPerPageOptions={false}
          />
        </div>
      </Layout>
    </>
  );
};

export default ResponderView;
