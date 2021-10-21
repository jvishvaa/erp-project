/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect,useContext } from 'react';
import { withStyles, Button, Grid, Typography, Box } from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../containers/Layout';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import PropTypes from 'prop-types';
import urls from '../../../config/endpoints';
import './modulOnlineClass.css';
import axios from 'axios';
import ButtonBackgroundImage from '../../../assets/images/button.svg';
import { Card, CardContent, CardActions, CardMedia, makeStyles } from '@material-ui/core';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
const useStyles = makeStyles((theme) => ({}));

function TrainingModule() {
  const classes = useStyles({});
  const image = 'https://dev.udaansurelearning.com/static/media/course.63579270.jpg';

  const courseType = 'is_training_course';
 const course='trainer_driven'
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState('');
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const moduleData = udaanDetails.role_permission.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Trainer_Driven') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(`${endpoints.sureLearning.inHouseModules}?${course}=true`, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res, 'academicss');
        //   setGradeList(res.data.course_type);
          // setSubjectList(res.data.course_sub_type)
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);

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

  const moduleClick = () => {};

  return (
    <Layout>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Trainer Driven Courses'
          isAcademicYearVisible={true}
        />

        <div className={classes.moduleBox}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={3}>
              <Grid item md={12} xs={12} style={{ margin: '5px 5px', height: '100%' }}>
                <Card sx={{ maxWidth: 345 }} style={{ backgroundColor: getCardColor(1) }}>
                  <div
                    style={{
                      display: 'flex',
                      display: 'flex',
                      alignItem: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CardMedia
                      className={classes.media}
                      component='img'
                      alt='Contemplative Reptile'
                      title='Contemplative Reptile'
                      image='https://udaansurelearning.com/static/media/course.63579270.jpg'
                    />
                  </div>
                  <CardContent justify='center' className={classes.content1}>
                    <Grid container direction='row'>
                      <Grid item md={12} xs={12} style={{ paddingLeft: '10px' }}>
                        <Typography style={{ color: 'white' }}>
                          {' '}
                          <strong>{'course_name'}</strong>{' '}
                        </Typography>
                      </Grid>
                      <Grid item md={10} xs={12}>
                        <Typography style={{ color: 'white' }}>
                          {' '}
                          <strong>{'category'}</strong>{' '}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardContent justify='center' className={classes.content}>
                    <Grid container direction='row'>
                      <Grid item md={12} xs={12} style={{ marginTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography
                            style={{
                              verticalAlign: 'middle',
                              display: 'inline-flex',
                              fontSize: '16px',
                              color: 'white',
                            }}
                          >
                            {'start_date'}
                          </Typography>

                          <Typography
                            style={{
                              verticalAlign: 'middle',
                              display: 'inline-flex',
                              fontSize: '16px',
                              color: 'white',
                            }}
                          >
                            {'end_date'}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item md={12} xs={12} style={{ marginTop: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                          <Typography
                            style={{
                              verticalAlign: 'middle',
                              display: 'inline-flex',
                              fontSize: '16px',
                              color: 'white',
                            }}
                          >
                            {'.total_duration'}
                          </Typography>
                          <Typography
                            style={{
                              verticalAlign: 'middle',
                              display: 'inline-flex',
                              fontSize: '16px',
                              color: 'white',
                            }}
                          >
                            {'.pending_hours'}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions justify='center' className={classes.action}>
                    <div
                      style={{
                        height: '40px',
                        display: 'flex',
                        width: '80%',
                        justifyContent: 'center',
                        backgroundImage: `url(${ButtonBackgroundImage})`,
                        backgroundPosition: 'center',
                        backgroundSize: '60%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      <Typography
                        onClick={() => moduleClick()}
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                          cursor: 'pointer',
                        }}
                      >
                        Start
                      </Typography>
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
}
TrainingModule.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
export default TrainingModule;
