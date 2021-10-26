/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import {
  Grid,
  Typography,
  withStyles,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  Paper,
  makeStyles,
  TableRow,
  TableHead,
} from '@material-ui/core';
// import as dateFns from 'date-fns';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import styles from './onlineClassStart.style';
import PropTypes from 'prop-types';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Loader from '../../../components/loader/loader';
import unfiltered from '../../../assets/images/unfiltered.svg';

const useStyles = makeStyles((theme) => ({}));

const InhouseOnlineClassStart = () => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [learningList, setLearningList] = useState();
  const [Loading, setLoading] = useState(false);

  const [permission, setPermission] = useState([]);

  const history = useHistory();
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);

  const [moduleId, setModuleId] = useState('');
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const moduleData = udaanDetails.role_permission.modules;
const mm =history.location;
console.log(mm,'moduless')
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
        .get(endpoints.sureLearning.onLineClassJoinApi, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            'Content-Type': 'application/json',
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res, 'academic');
          setLearningList(res);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);

  //   function getData() {
  //     setLoading(true);
  //     fetch(`${urls.onLineClassJoinApi}`, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${auth.personal_info.token}`,
  //         'Content-Type': 'application/json',
  //         module: localStorage.getItem('Trainer_Driven')
  //       },
  //     })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           setLoading(false);
  //           alert.success('Data Received');
  //           return res.json();
  //         }
  //         if (res.status !== 200) {
  //           setLoading(false);
  //           alert.warning('something went wrong please try again ');
  //         }
  //         return 0;
  //       }).then((data) => {
  //         setLearningList(data);
  //       });
  //   }

  let loader = null;
  if (Loading) {
    loader = <Loader open />;
  }

  //   useEffect(() => {
  //     if (auth) {
  //       getData();
  //     }
  //   }, [auth.personal_info.token]);

  function joinClassFunction(data) {
    setLoading(true);

    axios
      .put(`${endpoints.sureLearning.onlineMeetingApi}${data.class_id.id}/join_class/`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          'Content-Type': 'application/json',
          module: moduleId,
        },
      })

      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          alert.success('attendence marked successfully');
          if (
            data.class_details.zoom_details &&
            data.class_details.zoom_details.join_url
          ) {
            window.open(
              data.class_details.zoom_details && data.class_details.zoom_details.join_url,
              '_blank'
            );
          }
          return res.json();
        }
        if (res.status !== 200) {
          setLoading(false);
          alert.error('Somthing went wrong please try again');
          return res.json();
        }
        return 0;
      });
  }
  // For Permissions
  function getPermissonData(moduleId) {
      console.log('moduless',moduleId)
    axios
      .get(endpoints.sureLearning.getPermissons, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${udaanDetails.personal_info.token}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setPermission(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
      console.log(moduleId,'modulesss')
    getPermissonData(sessionStorage.getItem('online_Class_Start'));
  }, []);

  return (
    <>
      <Layout className='accessBlockerContainer'>
        <div className={classes.parentDiv}>
          <CommonBreadcrumbs
            componentName='Sure Learning'
            childComponentName='Trainer Driven Courses'
            isAcademicYearVisible={true}
          />


      <div className={classes.LeanrningFullModule} style={{ height: learningList && learningList && learningList.length < 10 ? '100vh' : '100%' }}>
        {/* <Typography variant="h4" className={classes.typographys}>Online Training</Typography> */}
        {/* <Divider className={classes.divider} /> */}
        <Grid container className={classes.paper2}>
          <Grid item md={12} sm={12} xs={12}>
            {/* {learningList && learningList && learningList.length === 0
        && (
          <Typography variant="h5" style={{ color: 'blue', textAlign: 'center' }}> online class are not scheduled</Typography>
        )}  */}
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            {/* {learningList && learningList && learningList.length !== 0
        && ( */}
        <>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Paper style={{ borderRadius: '15px' }}>
                <Table className={classes.paper1} style={{ borderRadius: '15px' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell float="left">S.No</TableCell>
                      <TableCell float="left">Topic</TableCell>
                      <TableCell float="left">Course Name</TableCell>
                      <TableCell float="left">Trainer Name</TableCell>
                      <TableCell float="left">Start Date & Time</TableCell>
                      <TableCell float="left">End Date & Time</TableCell>
                      <TableCell float="left">Join</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* {learningList && learningList && learningList.length !== 0 && learningList.map((item, index) => { */}
                      {/* const startDate = item.class_details && item.class_details.zoom_details && item.class_details.zoom_details.start_time && new Date(item.class_details.zoom_details.start_time);
                      const endDate = item.class_details && item.class_details.zoom_details && item.class_details.zoom_details.end_time && new Date(item.class_details.zoom_details.end_time);
                      return ( */}
                        <TableRow 
                        // key={item.id}
                         className={classes.notesPaper}>
                          <TableCell float="left">
                              {/* {index + 1} */}
                              1</TableCell>
                          <TableCell float="left">
                            {/* {(item.class_details.zoom_details && item.class_details.zoom_details.topic) || ''} */}
                            zoom_details</TableCell>
                          <TableCell float="left">
                            {/* {(item.class_initiate && item.class_initiate.course && item.class_initiate.course.course_name) || ''} */}
                            course_name</TableCell>
                          <TableCell float="left">
                            {/* {(item.class_initiate && item.class_initiate.user && item.class_initiate.user.first_name) || ''} */}
                            first_name</TableCell>
                          <TableCell float="left">
                            {/* {(item.class_details.zoom_details && item.class_details.zoom_details.start_time && startDate.toString().split('G')[0]) || ''} */}
                            startDate</TableCell>
                          <TableCell float="left">
                            {/* {(item.class_details.zoom_details && item.class_details.zoom_details.end_time && endDate.toString().split('G')[0]) || ''} */}
                            endDate</TableCell>
                          <TableCell float="left">
                            <Button
                              variant="contained"
                              // disabled={!((dateFns.isSameDay(new Date(), new Date(item.class_details.zoom_details.start_time))) && (((new Date().getTime() - new Date(item.class_details.zoom_details.start_time).getTime()) >= 0)))}
                              color="primary"
                            //   onClick={(item) => joinClassFunction(item)}
                            >
                              Join
                            </Button>
                          </TableCell>
                        </TableRow>
                      {/* ); */}
                    {/* })} */}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </>
        {/* )} */}
          </Grid>
        </Grid>
        {loader}
      </div>
 
   </div>
      </Layout>
    </>
  );
};
InhouseOnlineClassStart.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(InhouseOnlineClassStart);
