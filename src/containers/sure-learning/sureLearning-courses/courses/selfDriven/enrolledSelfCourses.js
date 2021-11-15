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
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ButtonBackgroundImage from '../../../../../assets/images/button.svg';
import { useHistory } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import endpoints from 'config/endpoints';
import axiosInstance from '../../../../../config/axios';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import './enrollCourse.scss';
const useStyles = makeStyles({
  root: {
    width: '300px',
    marginBottom: '2%',
    color: 'white',
  },
  media: {
    height: 140,
  },
  content: {
    marginTop: '5px',
  },
});
function EnrolledSelfCourses() {
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [page, setPage] = useState(2);
  const noImg = 'https://dev.udaansurelearning.com/static/media/course.63579270.jpg';
  const [EnrolledSelfCourses, setEnrolledSelfCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(200);
  const handlePagination = (event, page) => {
    localStorage.removeItem('viewMoreData');
    setPage(page);
    let data = JSON.parse(localStorage.getItem('filterData')) || '';
    localStorage.setItem('filterData', JSON.stringify({ ...data, page }));
  };
  const limit = 4;
  const history = useHistory();
  const handleViewMore = (id) => {
    history.push('/allCoursesAssignedByCoordinator');
    sessionStorage.setItem('course_id', id);
    sessionStorage.setItem('course', 'is_training_course');
    sessionStorage.setItem('BreadCrumb', 'Enrolled Courses');
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
        .get(endpoints.sureLearning.EnrolledSelfCources, {
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
  const StyledButton = withStyles((theme) => ({
    root: {
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
          childComponentName='Enrolled courses'
          isAcademicYearVisible={true}
        />

        <div id='enrollContainer'>
          {data.map((item, index) => {
            return (
              <div id='cardContainer'>
                <div id='mainGrid'>
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
                      {item.course_image == null ? (
                        <CardMedia
                          className={classes.media}
                          component='img'
                          alt={item.course_name}
                          title={item.course_name}
                          image={noImg}
                          id='courseImg'
                        />
                      ) : (
                        <CardMedia
                          component='img'
                          className={classes.media}
                          id='courseImg'
                          alt={item.course_name}
                          title={item.course_name}
                          image={item.course_image}
                        />
                      )}
                    </div>
                    <CardContent justify='center' className={classes.content1}>
                      <div id='titleArea'>
                        <div id='nameArea'>
                          <Typography style={{ color: 'white', fontWeight: 600 }}>
                            {item.course_name}
                          </Typography>
                        </div>
                        <div id='nameArea'>
                          <Typography style={{ color: 'white', fontSize: '15px' }}>
                            {item.category}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                    <CardContent justify='center' className={classes.content}>
                      <div id='timeContainer'>
                        <Grid item md={12} xs={12} style={{ marginTop: '5px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '12px',
                                color: 'white',
                              }}
                            >
                              <strong>Start Date </strong>
                              <CalendarTodayIcon
                                style={{
                                  fontSize: '14px',
                                  color: 'white',
                                }}
                              />
                            </Typography>
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '12px',
                                color: 'white',
                              }}
                            >
                              <strong>End Date</strong>{' '}
                              <CalendarTodayIcon
                                style={{
                                  fontSize: '14px',
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
                                fontSize: '12px',
                                color: 'white',
                              }}
                            >
                              {item.start_date}
                            </Typography>

                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '12px',
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
                                fontSize: '12px',
                                color: 'white',
                              }}
                            >
                              {' '}
                              <strong>Total Hours </strong>
                              <AccessAlarmsIcon
                                style={{
                                  fontSize: '14px',
                                  color: 'white',
                                }}
                              />
                            </Typography>
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '12px',
                                color: 'white',
                              }}
                            >
                              <strong>Pending Hours </strong>{' '}
                              <AccessAlarmsIcon
                                style={{
                                  fontSize: '14px',
                                  color: 'white',
                                }}
                              />
                            </Typography>
                          </div>
                        </Grid>
                        <div id='dateArea'>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '12px',
                                color: 'white',
                              }}
                            >
                              {item.total_duration}
                            </Typography>
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                fontSize: '12px',
                                color: 'white',
                              }}
                            >
                              {item.pending_hours}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardActions justify='center' style={{ justifyContent: 'center' }}>
                      <StyledButton
                        style={{ fontSize: '20px' }}
                        // variant='none'
                        onClick={() => handleViewMore(item.id)}
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
                </div>
              </div>
            );
          })}
          {/* <Pagination
            onChange={handlePagination}
            style={{ marginTop: 25, marginLeft: 500 }}
            count={Math.ceil(totalCount / limit)}
            color='primary'
            page={page}
          /> */}
        </div>
      </div>
    </Layout>
  );
}

export default EnrolledSelfCourses;
