import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { Grid, Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@material-ui/lab/Pagination';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import './Styles.scss';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import image from '../../assets/images/bookappointment.png';
import bookimage from '../../assets/images/ljnljn.png';
import CardHeader from '@material-ui/core/CardHeader';
import BookAppointment from './BookAppointment';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import EditAppointment from './EditAppointment';
import Loading from '../../components/loader/loader';
import line from '../../assets/images/line.svg';
import MediaQuery from 'react-responsive';
import CallIcon from '@material-ui/icons/Call';
import MessageIcon from '@material-ui/icons/Message';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },

  container: {
    maxHeight: '70vh',
  },

  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  tablePaginationCaption: {
    fontWeight: 600,
  },
  card: {
    width: '270px',
    height: '240px',
    borderRadius: '15px',
    marginLeft: '32px',
  },
  paper: {
    margin: 30,
    width: '92%',
    borderRadius: '10px',
    background: '#ACF5B8',
    position: 'static',
  },
  papermain: {
    margin: 30,
    width: '92%',
  },
  imageStyles: {
    margin: '10%',
    width: '200px',
    height: '150px',
  },
  lines: {
    marginLeft: '40%',
    marginTop: '7%',
  },
  icon: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
}));
const Appointments = () => {
  const [addFlag, setAddFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [data, setData] = useState([]);
  const [bookingmode, setBookingmode] = useState([]);
  const classes = useStyles();
  const [delFlag, setDelFlag] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = React.useState(1);
  const [editFlag, setEditFlag] = useState(false);

  const [goBackFlag, setGoBackFlag] = useState(false);

  const [AppointmentId, setAppointmentId] = useState();
  const [appointmentwith, setAppointmentWith] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [appointmentMedium, setAppointmentMedium] = useState();
  const [message, setMessage] = useState();
  const [bookingModeID, setBookingModeID] = useState();

  const limit = 6;

  const handleEditAppointment = (id, role, date, time, booking_mode, message) => {
    console.log('========>', id, role, date, time, booking_mode, message);
    setTableFlag(false);
    setAddFlag(false);
    setEditFlag(true);
    console.log('id', id);
    setAppointmentId(id);
    setAppointmentWith(role);
    setDate(date);
    setTime(time);
    setAppointmentMedium(booking_mode);
    console.log('bookingmode-->', booking_mode);
    setMessage(message);

    if (booking_mode === 'Zoom Meeting') {
      setBookingModeID(1);
    } else if (booking_mode === 'Telephonic') {
      setBookingModeID(2);
    } else if (booking_mode === 'Visit') {
      setBookingModeID(3);
    } else {
      setBookingModeID('');
    }
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setEditFlag(false);
    setGoBackFlag(!goBackFlag);
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.Appointments.bookAppointment}?page=${page}&page_size=${limit}`)
      .then((response) => {
        console.log('response', response.data.data.results);
        setData(response.data.data.results);
        console.log('count', response.data.data.count);
        setTotalCount(response.data.data.count);
      });
  }, [page, goBackFlag]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [page, goBackFlag]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleAddAppointment = () => {
    setTableFlag(false);
    setAddFlag(true);
    setEditFlag(false);
  };

  const deleteRecord = (evt, index) => {
    console.log('evt', evt.target);
    console.log('index:', index);
  };
  // const postRowClick = (id, basePath, record) => (record.editable ? 'edit' : 'edit');

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <Grid xs={12} md={12} sm={12}>
          <CommonBreadcrumbs
            componentName='Appointments'
            childComponentName={
              addFlag
                ? 'BookAppointment'
                : editFlag && !tableFlag
                ? 'EditAppointment'
                : null
            }
          />
        </Grid>
        {addFlag && !tableFlag && !editFlag ? (
          <BookAppointment handleGoBack={handleGoBack} setLoading={setLoading} />
        ) : null}
        {!tableFlag && !addFlag && editFlag && (
          <EditAppointment
            id={AppointmentId}
            role={appointmentwith}
            date={date}
            time={time}
            booking_mode={bookingModeID}
            message={message}
            handleGoBack={handleGoBack}

            // setLoading={setLoading}
          />
        )}
        {tableFlag && !addFlag && !editFlag && (
          <Grid>
            <paper className={classes.papermain}>
              <img src={bookimage} style={{ width: 'inherit' }} />
            </paper>

            {data.map((item, index) => {
              return (
                <Paper elevation={3} className={classes.paper}>
                  <MediaQuery minWidth={1316}>
                    <Grid container direction='row' style={{ marginLeft: 10 }}>
                      {/* <Grid item md={1}></Grid> */}
                      <Grid item md={2}>
                        <Typography variant='subtitle2'>Appointment With</Typography>

                        <Typography>{item.role?.role_name} </Typography>
                      </Grid>
                      <Grid item md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      <Grid item md={1}>
                        <Typography variant='subtitle2'> Date </Typography>
                        <Typography>{item.appointment_date}</Typography>
                      </Grid>
                      <Grid item md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      <Grid item md={1}>
                        <Typography variant='subtitle2'>Time</Typography>
                        <Typography>
                          {item.appointment_time ? item.appointment_time.slice(0, 5) : ''}
                        </Typography>
                      </Grid>
                      <Grid item md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid>

                      <Grid item md={1}>
                        <Typography variant='subtitle2'>Mode</Typography>
                        <Typography> {item.booking_mode} </Typography>
                      </Grid>
                      <Grid item md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid>
                      <Grid item md={1}>
                        <Typography variant='subtitle2'>Status</Typography>
                        <Typography> {item.appointment_status}</Typography>
                      </Grid>
                      <Grid item xs={12} md={1} sm={12}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid>
                      <Grid item xs={12} md={1} sm={12}>
                        <IconButton
                          onClick={(e) =>
                            handleEditAppointment(
                              item.id,
                              item.role,
                              item.appointment_date,
                              item.appointment_time,
                              item.booking_mode,
                              item.message
                            )
                          }
                          title='Edit Appointmant'
                        >
                          <EditOutlinedIcon
                            color='primary'
                            className={classes.icon}
                            fontSize='small'
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </MediaQuery>
                  <MediaQuery maxWidth={1315} minWidth={960}>
                    <Grid container direction='row' style={{ marginLeft: 10 }}>
                      {/* <Grid item md={1}></Grid> */}
                      <Grid item md={2}>
                        <Typography variant='subtitle2'>Appointment With</Typography>

                        <Typography>{item.role?.role_name} </Typography>
                      </Grid>
                      <Grid item md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      <Grid item md={2}>
                        <Typography variant='subtitle2'> Date </Typography>
                        <Typography>{item.appointment_date}</Typography>
                      </Grid>
                      <Grid item md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      <Grid item md={1}>
                        <Typography variant='subtitle2'>Time</Typography>
                        <Typography>
                          {item.appointment_time ? item.appointment_time.slice(0, 5) : ''}
                        </Typography>
                      </Grid>
                      <Grid item md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid>

                      {/* <Grid item md={1}>
                        <Typography variant='subtitle2'>Mode</Typography>
                        <Typography> {item.booking_mode} </Typography>
                      </Grid>
                      <Grid item md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid> */}
                      <Grid item md={1}>
                        <Typography variant='subtitle2'>Status</Typography>
                        <Typography> {item.appointment_status}</Typography>
                      </Grid>
                      <Grid item xs={12} md={1} sm={12}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid>
                      <Grid item xs={12} md={1} sm={12}>
                        <IconButton
                          onClick={(e) =>
                            handleEditAppointment(
                              item.id,
                              item.role,
                              item.appointment_date,
                              item.appointment_time,
                              item.booking_mode,
                              item.message
                            )
                          }
                          title='Edit Appointmant'
                        >
                          <EditOutlinedIcon
                            color='primary'
                            className={classes.icon}
                            fontSize='small'
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </MediaQuery>
                  <MediaQuery maxWidth={959} minWidth={900}>
                    <Grid container direction='row'>
                      {/* <Grid item md={1}></Grid> */}
                      {/* <Grid sm={1} md={1}></Grid> */}
                      <Grid item sm={2} md={2} style={{ marginLeft: 10 }}>
                        <Typography variant='subtitle2'>Appointment With</Typography>

                        <Typography>{item.role?.role_name} </Typography>
                      </Grid>
                      <Grid item sm={1} md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      <Grid item sm={2} md={2}>
                        <Typography variant='subtitle2'> Date </Typography>
                        <Typography>{item.appointment_date}</Typography>
                      </Grid>
                      <Grid item sm={1} md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      {/* <Grid item sm={1} md={1}>
                        <Typography variant='subtitle2'>Time</Typography>
                        <Typography>
                          {item.appointment_time ? item.appointment_time.slice(0, 5) : ''}
                        </Typography>
                      </Grid>
                      <Grid item sm={1} md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid> */}

                      {/* <Grid item md={1}>
                        <Typography variant='subtitle2'>Mode</Typography>
                        <Typography> {item.booking_mode} </Typography>
                      </Grid>
                      <Grid item md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid> */}
                      <Grid item sm={2} md={1}>
                        <Typography variant='subtitle2'>Status</Typography>
                        <Typography> {item.appointment_status}</Typography>
                      </Grid>
                      <Grid item xs={1} md={1} sm={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid>
                      <Grid item xs={1} md={1} sm={1}>
                        <IconButton
                          onClick={(e) =>
                            handleEditAppointment(
                              item.id,
                              item.role,
                              item.appointment_date,
                              item.appointment_time,
                              item.booking_mode,
                              item.message
                            )
                          }
                          title='Edit Appointmant'
                        >
                          <EditOutlinedIcon
                            color='primary'
                            className={classes.icon}
                            fontSize='small'
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </MediaQuery>
                  <MediaQuery maxWidth={899} minWidth={678}>
                    <Grid container direction='row'>
                      {/* <Grid item md={1}></Grid> */}
                      {/* <Grid sm={1} md={1}></Grid> */}
                      <Grid item xs={3} sm={3} md={2} style={{ marginLeft: 10 }}>
                        <Typography variant='subtitle2'>Appointment With</Typography>

                        <Typography>{item.role?.role_name} </Typography>
                      </Grid>
                      <Grid item xs={1} sm={1} md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      <Grid item xs={3} sm={2} md={2}>
                        <Typography variant='subtitle2'> Date </Typography>
                        <Typography>{item.appointment_date}</Typography>
                      </Grid>
                      <Grid item sm={1} md={1}>
                        <img src={line} className={classes.lines} />
                      </Grid>

                      {/* <Grid item sm={1} md={1}>
                        <Typography variant='subtitle2'>Time</Typography>
                        <Typography>
                          {item.appointment_time ? item.appointment_time.slice(0, 5) : ''}
                        </Typography>
                      </Grid>
                      <Grid item sm={1} md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid> */}

                      {/* <Grid item md={1}>
                        <Typography variant='subtitle2'>Mode</Typography>
                        <Typography> {item.booking_mode} </Typography>
                      </Grid>
                      <Grid item md={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid> */}
                      <Grid item sm={2} md={1}>
                        <Typography variant='subtitle2'>Status</Typography>
                        <Typography> {item.appointment_status}</Typography>
                      </Grid>
                      <Grid item xs={1} md={1} sm={1}>
                        {' '}
                        <img src={line} className={classes.lines} />
                      </Grid>
                      <Grid item xs={1} md={1} sm={1}>
                        <IconButton
                          onClick={(e) =>
                            handleEditAppointment(
                              item.id,
                              item.role,
                              item.appointment_date,
                              item.appointment_time,
                              item.booking_mode,
                              item.message
                            )
                          }
                          title='Edit Appointmant'
                        >
                          <EditOutlinedIcon
                            color='primary'
                            className={classes.icon}
                            fontSize='small'
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </MediaQuery>
                  <MediaQuery maxWidth={677} minWidth={385}>
                    <Grid container direction='row' style={{ marginRight: 20 }}>
                      {/* <Grid item md={1}></Grid> */}
                      {/* <Grid sm={1} md={1}></Grid> */}
                      <Grid item xs={9} sm={9} md={2} style={{ marginLeft: 40 }}>
                        <Typography variant='subtitle2' style={{ display: 'inline' }}>
                          Appointment With :
                          <Typography style={{ display: 'inline' }}>
                            {item.role?.role_name}{' '}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2'>
                          Date {'      '}:
                          <Typography style={{ display: 'inline', marginLeft: 60 }}>
                            {item.appointment_date}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2'>
                          Time:
                          <Typography style={{ display: 'inline', marginLeft: 60 }}>
                            {item.appointment_time
                              ? item.appointment_time.slice(0, 5)
                              : ''}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2' style={{ display: 'inline' }}>
                          Mode:
                          <Typography style={{ display: 'inline', marginLeft: 55 }}>
                            {item.booking_mode}{' '}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2'>
                          Status :
                          <Typography style={{ display: 'inline', marginLeft: 55 }}>
                            {item.appointment_status}{' '}
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={1}
                        md={1}
                        sm={1}
                        container
                        justify='center'
                        alignItems='center'
                      >
                        <IconButton
                          onClick={(e) =>
                            handleEditAppointment(
                              item.id,
                              item.role,
                              item.appointment_date,
                              item.appointment_time,
                              item.booking_mode,
                              item.message
                            )
                          }
                          title='Edit Appointmant'
                        >
                          <EditOutlinedIcon
                            color='primary'
                            className={classes.icon}
                            fontSize='small'
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </MediaQuery>
                  <MediaQuery maxWidth={384} minWidth={200}>
                    <Grid container direction='row'>
                      {/* <Grid item md={1}></Grid> */}
                      {/* <Grid sm={1} md={1}></Grid> */}

                      <Grid item xs={8} sm={8} md={2}>
                        <Typography variant='subtitle2' style={{ display: 'inline' }}>
                          Appointment With :
                          <Typography style={{ display: 'inline' }}>
                            {item.role?.role_name}{' '}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2'>
                          Date {'      '}:
                          <Typography style={{ display: 'inline' }}>
                            {item.appointment_date}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2'>
                          Time:
                          <Typography style={{ display: 'inline' }}>
                            {item.appointment_time
                              ? item.appointment_time.slice(0, 5)
                              : ''}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2' style={{ display: 'inline' }}>
                          Mode:
                          <Typography style={{ display: 'inline' }}>
                            {item.booking_mode}{' '}
                          </Typography>
                        </Typography>
                        <Typography variant='subtitle2'>
                          Status :
                          <Typography style={{ display: 'inline' }}>
                            {item.appointment_status}{' '}
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={1}
                        md={1}
                        sm={1}
                        container
                        justify='center'
                        alignItems='center'
                      >
                        <IconButton
                          onClick={(e) =>
                            handleEditAppointment(
                              item.id,
                              item.role,
                              item.appointment_date,
                              item.appointment_time,
                              item.booking_mode,
                              item.message
                            )
                          }
                          title='Edit Appointmant'
                        >
                          <EditOutlinedIcon
                            color='primary'
                            className={classes.icon}
                            fontSize='small'
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </MediaQuery>
                </Paper>
              );
            })}
            <div className='paginateData'>
              <TablePagination
                component='div'
                className='customPagination'
                count={totalCount}
                rowsPerPage={limit}
                page={page - 1}
                nextIconButtonText='Next Page'
                onChangePage={handleChangePage}
                rowsPerPageOptions={false}
              />
            </div>
            <Grid container direction='row' spacing={2}>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      component='img'
                      alt='Contemplative Reptile'
                      // height='200'
                      className={classes.imageStyles}
                      image={image}
                      title='Contemplative Reptile'
                    />
                  </CardActionArea>
                  <CardActions>
                    <Button
                      variant='contained'
                      // href={`/book-appointment`}
                      color='primary'
                      style={{ marginLeft: '25%', marginTop: '-10%' }}
                      onClick={handleAddAppointment}
                    >
                      BookAppointment
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardActionArea className='cardsStyles'>
                    <Typography
                      variant='h5'
                      gutterBottom
                      color='secondary'
                      align='center'
                      style={{ marginTop: '10%' }}
                    >
                      FRONT OFFICE EXECUTIVE
                    </Typography>

                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      Available at these timings
                    </Typography>
                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      9:00 am - 8:00 pm
                    </Typography>
                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      EST Monday – Friday
                    </Typography>

                    <Grid container direction='row' justify='center'>
                      <Typography
                        variant='h5'
                        gutterBottom
                        color='secondary'
                        align='center'
                      >
                        <CallIcon color='secondary' fontSize='large' clss/>
                      </Typography>
                      <Typography
                        variant='h5'
                        gutterBottom
                        color='secondary'
                        align='center'
                      >
                        +91 99999999999
                      </Typography>
                      <Grid container direction='row' justify='center'>
                        <Typography
                          variant='h5'
                          gutterBottom
                          color='secondary'
                          align='center'
                        >
                          <MessageIcon color='secondary' fontSize='large' />
                        </Typography>
                        <Typography
                          variant='h5'
                          gutterBottom
                          color='secondary'
                          align='center'
                        >
                          Send Whatsapp
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardActionArea className='cardsStyles'>
                    <Typography
                      variant='h5'
                      gutterBottom
                      color='secondary'
                      align='center'
                      style={{ marginTop: '10%' }}
                    >
                      OPS MANAGEMENT
                    </Typography>

                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      Available at these timings
                    </Typography>
                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      9:00 am - 8:00 pm
                    </Typography>
                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      EST Monday – Friday
                    </Typography>

                    <Grid container direction='row' justify='center'>
                      <Typography
                        variant='h5'
                        gutterBottom
                        color='secondary'
                        align='center'
                      >
                        <CallIcon color='secondary' fontSize='large' />
                      </Typography>
                      <Typography
                        variant='h5'
                        gutterBottom
                        color='secondary'
                        align='center'
                      >
                        +91 99999999999
                      </Typography>
                      <Grid container direction='row' justify='center'>
                        <Typography
                          variant='h5'
                          gutterBottom
                          color='secondary'
                          align='center'
                        >
                          <MessageIcon color='secondary' fontSize='large' />
                        </Typography>
                        <Typography
                          variant='h5'
                          gutterBottom
                          color='secondary'
                          align='center'
                        >
                          Send Whatsapp
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardActionArea className='cardsStyles'>
                    <Typography
                      variant='h5'
                      gutterBottom
                      color='secondary'
                      align='center'
                      style={{ marginTop: '10%' }}
                    >
                      CAMPUS-IN-CHARGE
                    </Typography>

                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      Available at these timings
                    </Typography>
                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      9:00 am - 8:00 pm
                    </Typography>
                    <Typography
                      variant='h6'
                      gutterBottom
                      color='secondary'
                      align='center'
                    >
                      EST Monday – Friday
                    </Typography>

                    <Grid container direction='row' justify='center'>
                      <Typography
                        variant='h5'
                        gutterBottom
                        color='secondary'
                        align='center'
                      >
                        <CallIcon color='secondary' fontSize='large' />
                      </Typography>
                      <Typography
                        variant='h5'
                        gutterBottom
                        color='secondary'
                        align='center'
                      >
                        +91 99999999999
                      </Typography>
                      <Grid container direction='row' justify='center'>
                        <Typography
                          variant='h5'
                          gutterBottom
                          color='secondary'
                          align='center'
                        >
                          <MessageIcon color='secondary' fontSize='large' />
                        </Typography>
                        <Typography
                          variant='h5'
                          gutterBottom
                          color='secondary'
                          align='center'
                        >
                          Send Whatsapp
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Layout>
    </>
  );
};
export default Appointments;
