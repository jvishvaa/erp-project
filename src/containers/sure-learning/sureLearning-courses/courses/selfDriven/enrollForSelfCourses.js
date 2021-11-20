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
import ButtonBackgroundImage from '../../../../../assets/images/button.svg';
import { Pagination } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import axiosInstance from '../../../../../config/axios';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    width: '300px',
    marginBottom: '2%',
    color: 'white',
  },
  media: {
    height: 220,
  },
  content1: {
    height: 50,
  },
  content: {
    height: 100,
  },
  action: {
    height: 45,
  },
});

function EnrollForSelfCourses() {
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [totalGenre, setTotalGenre] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState(2);
  const [totalCount, setTotalCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const classes = useStyles();
  const handlePagination = (event, page) => {
    // localStorage.removeItem('viewMoreData');
    setPageNumber(page);
    // let data = JSON.parse(localStorage.getItem('filterData')) || '';
    // localStorage.setItem('filterData', JSON.stringify({ ...data, page }));
  };
  const noImg = 'https://dev.udaansurelearning.com/static/media/course.63579270.jpg';
  const limit = 8;
  const history = useHistory();
  const getStatusInformation = async () => {
    setLoading(true);
    const response = await axios.get(
      `${endpoints.sureLearning.EnrollForSelfCources}?course_type=self_driven&page_size=8&page=1`,
      {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          'Content-Type': 'application/json',
          module: moduleId,
        },
      }
    );
    const getDataInfo = await response.json();
    setLoading(false);
    return getDataInfo;
  };
  function handleViewMore(item) {
    console.log('enid', item.id);
    const Enroll = {
      course: item.id,
    };
    setLoading(true);
    axios
      .post(`${endpoints.sureLearning.EnrollForSelfCources}`, JSON.stringify(Enroll), {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 201) {
          setLoading(false);
          setAlert('success', 'Course Successfully Enrolled');
          setRefresh(!refresh);
          getStatusInformation()
            .then((info) => {
              setData(info);
              setLoading(false);
            })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
          return '';
        }
        if (res.status === 409) {
          setLoading(false);
          setAlert('warning', 'Course already enrolled');
          return '';
        }
        if (res.status !== 201 && res.status !== 409) {
          setLoading(false);
          setAlert('warning', 'somthing went wrong please try again');
        }
        return 0;
      });
  }
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
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  console.log(moduleData, 'module');

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Enroll_Self_Courses') {
          setModuleId(item.module);
        }
      });
    }
  }, []);
  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(
          endpoints.sureLearning.EnrollForSelfCources +
            `?page_size=${limit}&page=${pageNumber}`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((res) => {
          console.log(res.data.total_pages, 'EnrollForSelfCources');
          setTotalGenre(res.data.total_pages);
          setData(res.data.results);
          // console.log(res.data.results[0].viewed_users, 'viewed_users');
          // setData(res.data.results);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId, pageNumber, refresh]);

  return (
    <Layout>
      <div>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Enroll Courses'
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
                      {item.course_image == null ? (
                        <CardMedia
                          className={classes.media}
                          component='img'
                          alt={item.course_name}
                          title={item.course_name}
                          image={noImg}
                        />
                      ) : (
                        <CardMedia
                          className={classes.media}
                          component='img'
                          alt={item.course_name}
                          title={item.course_name}
                          image={item.course_image}
                        />
                      )}
                    </div>
                    <CardContent justify='center' className={classes.content}>
                      <Grid container direction='row'>
                        <Grid item md={12} xs={12} style={{ marginTop: '20px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                // fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              {item.course_name}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item md={12} xs={12} style={{ marginTop: '10px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                // fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              Category:{' '}
                            </Typography>
                            <Typography style={{ color: 'white' }}>
                              {item.course_category.category_name}
                            </Typography>
                          </div>
                        </Grid>
                        {/* <Grid item md={12} xs={12} style={{ marginTop: '10px' }}>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                // fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              Course Duration:{' '}
                            </Typography>
                            <Typography style={{ color: 'white' }}>
                              {item.course_duration}
                            </Typography>
                          </div>
                        </Grid> */}
                      </Grid>
                    </CardContent>
                    <CardContent>
                      <Grid container direction='row'>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          style={{ marginTop: '10px' }}
                          className={classes.content1}
                        >
                          <div
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <Typography
                              style={{
                                verticalAlign: 'middle',
                                display: 'inline-flex',
                                // fontSize: '16px',
                                color: 'white',
                              }}
                            >
                              Course Duration:{' '}
                            </Typography>
                            <Typography style={{ color: 'white' }}>
                              {item.course_duration}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions justify='center' className={classes.action}>
                      <StyledButton
                        style={{ fontSize: '20px' }}
                        // variant='none'
                        onClick={() => handleViewMore(item)}
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
          <Grid container justify='center'>
            {/* {pageNumber > 1 && ( */}
            <Pagination
              onChange={handlePagination}
              count={totalGenre}
              color='primary'
              page={pageNumber}
              color='primary'
            />
            {/* )} */}
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}

export default EnrollForSelfCourses;
