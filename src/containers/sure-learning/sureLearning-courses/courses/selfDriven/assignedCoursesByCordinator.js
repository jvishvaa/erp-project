import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  CardContent,
  CardMedia,
  CardActions,
  Card,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../../Layout';
import TablePagination from '@material-ui/core/TablePagination';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ButtonBackgroundImage from '../../../../../assets/images/button.svg';
import { useHistory } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import AllCoursesAssignedByCoordinator from '../selfDriven/steps/allCoursesAssignedByCoordinator';

function AssignedCoursesByCordinator() {
  const [state, setstate] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [page, setPage] = useState(2);
  const [totalCount, setTotalCount] = useState(100);
  const handlePagination = (event, page) => {
    localStorage.removeItem('viewMoreData');
    setPage(page);
    let data = JSON.parse(localStorage.getItem('filterData')) || '';
    localStorage.setItem('filterData', JSON.stringify({ ...data, page }));
  };
  const limit = 4;
  const history = useHistory();
  const allCoursesAssignedByCoordinator = (item, id) => {
    console.log('volume', item.id, id);
    history.push('/allCoursesAssignedByCoordinator');
    sessionStorage.setItem('course_id', id);
    sessionStorage.setItem('course', 'self_driven');
    sessionStorage.setItem('BreadCrumb', 'Self Driven Courses');
    // if (data && data.length) {
    //   data.forEach((con, index) => {
    //     if (con.id === item.id && index > 0) {
    //       console.log(index - 1, 'index');
    //       let int = index - 1;
    //       console.log(data[int], 'prev typ');
    //       console.log(int, 'prev');
    //       if (data[index - 1].is_completed) {
    //         console.log('volume', item.id, id);
    //         history.push('/allCoursesAssignedByCoordinator');
    //         sessionStorage.setItem('course_id', id);
    //         sessionStorage.setItem('course', 'self_driven');
    //         sessionStorage.setItem('BreadCrumb', 'Self Driven Courses');
    //       } else {
    //         setAlert('warning', 'please complete previous chapter');
    //       }
    //     }
    //     if (con.id === item.id && index < 1) {
    //       console.log('volume', item.id, id);
    //       history.push('/allCoursesAssignedByCoordinator');
    //       sessionStorage.setItem('course_id', id);
    //       sessionStorage.setItem('course', 'self_driven');
    //       sessionStorage.setItem('BreadCrumb', 'Self Driven Courses');
    //     }
    //   });
    // }
  };

  const useStyles = makeStyles({
    root: {
      width: '300px',
      marginBottom: '2%',
      color: 'white',
    },
    media: {
      height: 140,
    },
    content1: {
      height: 80,
    },
    content: {
      height: 155,
    },
  });
  const classes = useStyles();
  const getCardColor = (index) => {
    const colors = [
      '#54688c',
      '#f47a62',
      '#4a66da',
      '#75cba8',
      // "#f2bf5e"
    ];
    const diffColors = index % 4;
    return colors[diffColors];
  };

  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  console.log(moduleData, 'module');

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Self_Courses') {
          setModuleId(item.module);
        }
      });
    }
  }, []);
  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(endpoints.sureLearning.AsignedSelfDrivenCourses, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res.data, 'EnrolledSelfCources');
          setData(res.data);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);
  const StyledButton = withStyles((theme) => ({
    root: {
      marginLeft:'50px',
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      padding: '8px 15px',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  }))(Button);
  return (
    <Layout>
      <div>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Self Driven Courses'
          isAcademicYearVisible={true}
        />

        <Grid container direction='row' style={{ paddingTop: '20px' }}>
          {data.map((item, index) => {
            return (
              <Grid item xs={12} sm={6} md={3}>
                <Grid item md={12} xs={12} style={{ margin: '5px 5px', height: '100%' }}>
                  <Card
                    sx={{ maxWidth: 345 }}
                    style={{ backgroundColor: getCardColor(index) }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        display: 'flex',
                        alignItem: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.course_image === null ? (
                        <CardMedia
                          className={classes.media}
                          component='img'
                          alt={''}
                          title={item.course_name}
                          image={
                            'https://udaansurelearning.com/static/media/course.63579270.jpg'
                          }
                        />
                      ) : (
                        <CardMedia
                          className={classes.media}
                          component='img'
                          alt={''}
                          title={item.course_name}
                          image={item.course_image}
                        />
                      )}
                    </div>
                    <CardContent justify='center' className={classes.content1}>
                      <Grid container direction='row'>
                        <Grid item md={12} xs={12} style={{ paddingLeft: '10px' }}>
                          <Typography style={{ color: 'white' }}>
                            {' '}
                            <strong>{item.course_name}</strong>{' '}
                          </Typography>
                        </Grid>
                        <Grid item md={10} xs={12}>
                          <Typography style={{ color: 'white' }}>
                            {' '}
                            <strong>{item.category}</strong>{' '}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardContent justify='center' className={classes.content}>
                      <Grid container direction='row'>
                        {/* <Grid item md={12} xs={12} style={{ paddingLeft: '10px' }}>
                          <Typography style = {{color : 'white'}}>
                            {' '}
                            <strong>{item.course_name}</strong>{' '}
                          </Typography>
                        </Grid>
                        <Grid item md={10} xs={12} >
                          <Typography style = {{color : 'white'}}>
                            {' '}
                            <strong>{item.category}</strong>{' '}
                          </Typography>
                        </Grid> */}

                        <Grid item md={12} xs={12} style={{ marginTop: '15px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              <strong>Start Date </strong>{' '}
                              <CalendarTodayIcon
                                style={{
                                  marginLeft: '9px',
                                  fontSize: '18px',
                                  color: 'white',
                                }}
                              />
                            </Typography>
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              <strong>End Date</strong>{' '}
                              <CalendarTodayIcon
                                style={{
                                  marginLeft: '9px',
                                  fontSize: '18px',
                                  color: 'white',
                                }}
                              />
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item md={12} xs={12} style={{ marginBottom: '5px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              {item.start_date}
                            </Typography>

                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              {item.end_date}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item md={12} xs={12} style={{ marginTop: '5px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              {' '}
                              <strong>Total Hours </strong>
                              <AccessAlarmsIcon
                                style={{
                                  marginLeft: '9px',
                                  fontSize: '18px',
                                  color: 'white',
                                }}
                              />
                            </Typography>
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              <strong>Pending Hours </strong>{' '}
                              <AccessAlarmsIcon
                                style={{
                                  marginLeft: '9px',
                                  fontSize: '18px',
                                  color: 'white',
                                }}
                              />
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item md={12} xs={12} style={{ marginBottom: '5px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              {item.total_duration}
                            </Typography>
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              {item.pending_hours}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions justify='center' className={classes.action}>
                      <StyledButton
                        style={{ fontSize: '20px' ,paddingLeft:30}}
                        // variant='none'
                        onClick={() => allCoursesAssignedByCoordinator(item, item.id)}
                      >
                        <div
                          style={{
                            width: '100%',
                            cursor: 'pointer',
                            backgroundImage: `url(${ButtonBackgroundImage})`,
                            paddingLeft: '25px',
                            height: 'auto',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}
                        >
                          <Typography
                            style={{
                              color: 'black',
                              paddingRight: '25px',
                              fontWeight: 'bold',
                            }}
                          >
                            Start
                          </Typography>
                        </div>
                      </StyledButton>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            );
          })}
          {/* <Pagination
            onChange={handlePagination}
            style={{ marginTop: 25, marginLeft: 500 }}
            count={Math.ceil(totalCount / limit)}
            color='primary'
            page={page}
          /> */}
        </Grid>
      </div>
    </Layout>
  );
}

export default AssignedCoursesByCordinator;
