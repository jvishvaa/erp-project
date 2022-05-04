/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  withStyles,
  Button,
  Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './courseInfoModal.Style';
import axios from 'axios';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';


const CourseInfoModalView = ({
  classes,
  ratingdata,
  courseName,
  courseDuration,
  button,
  viewData,
  viewid,
  editInfo,
  courseImg,
  publishCourse,
  unpublishCourse,
  activeStatus,
  courseId,
  activeFunc,
  enrollFunction,
  courseCategory,
}, props) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [ratigggg] = useState(parseInt(ratingdata, 10) || '5');
  const [rating] = useState(parseInt(ratingdata, 10) || '5');
  const [flagg, setFlagg] = useState(false);
  const [permission, setPermission] = useState([]);
  const [count, setCount] = useState(1);
  const star = [];
  const nonStar = [];
  let i = 0;
  const [enrollCourseId, setEnrollCourseId] = useState(null);
  const history = useHistory();


  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Enroll_for_Self_Courses' && item.module_type === 'Trainings') {
        getPermissonData(item.module);
        setEnrollCourseId(item.module);
      }
    })
  }, [])

  function getPermissonData(id) {
    console.log('getPermissonData', id);
    axios.get(endpoints.sureLearning.getPermissons, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: id
      },
    }).then(response => {
      setPermission(response.data.response)
      console.log(response.data.response, "Incoming permission data");
    }).catch(error => {
      console.log(error);
    })
  }


  // useEffect(() => {
  //   getPermissonData(localStorage.getItem('Self_Driven_Training'))
  // },[])

  useEffect(() => {
    if (ratigggg.length > 2) {
      setFlagg(true);
    }
  }, [ratigggg]);

  // toggleActive(moduleId).then(data => setTrainingChapters(data));

  for (i = 1; i <= rating; i += 1) {
    star.push(i);
  }
  for (i = 1; i <= (flagg === true ? 4 - rating : 5 - rating); i += 1) {
    nonStar.push(i);
    if (flagg && count === 1) {
      nonStar.shift();
      setCount(2);
    }
  }

  return (
    <>
      <Grid
        item
        md={3}
        xs={12}
        style={{ textAlign: 'center' }}
        className={classes.grid}
      >
        <Box border={3} style={{ color: 'lightgray' }}>
          <img
            src={courseImg || require('./course.jpg')}
            alt="course"
            height="180px"
            width="100%"
          />
          <Paper className={classes.paper}>
            <Typography
              variant="subtitle1"
              className={classes.typ}
              style={{ color: 'blue', fontFamily: 'Times New Roman' }}
            >
              <b>{courseName || ''}</b>
            </Typography>
            {courseCategory
              && (
                <Typography variant="subtitle1" className={classes.typ}>
                  Category :
                  {' '}
                  {courseCategory || ''}
                </Typography>
              )}
            <Typography variant="subtitle1" className={classes.typ}>
              Course Duration :
              {' '}
              {courseDuration || ''}
            </Typography>
            {/* <Typography variant="subtitle1" className={classes.typ1}>
              {' '}
              Course Type :
              {' '}
              <b>{courseType === true ? 'Free' : 'Paid' || ''}</b>
            </Typography> */}
            {/* <Typography variant='subtitle1' className={classes.typ}>
             Course Duration : {courseDuration || ''}</Typography>
          <Typography variant='subtitle1' className={classes.typ}>
          Users Count : {userCount || ''}</Typography>
          <Typography variant='subtitle1' className={classes.typ}>
            <Button>
              {star.map(() => {
                return (
                  <StarIcon style={{ color: 'gold' }} />
                )
              })}
              {flagg && <StarHalfIcon style={{ color: 'gold' }} />}
              {nonStar.map(() => {
                return (
                  <StarBorderIcon style={{ color: 'gold' }} />
                )
              })}
            </Button>
          </Typography> */}
            {(parseInt(button, 10) === 1 && (

              <Grid item md={12} xs={12} className={classes.typ2}>
                <Link to="/homeEnrol" style={{ textDecoration: 'none' }}>
                  <Button
                    // className={classes.buttonHover}
                    // style={{ marginRight: '2px', color: 'white' }}
                    color="primary"
                    variant="contained"
                    onClick={() => viewData(courseId)}
                  >
                    View
                  </Button>
                </Link>
              </Grid>
            ))
              || ''}
            {(parseInt(button, 10) === 2 && (
              <Grid item md={12} xs={12} className={classes.typ2}>
                <Link to="/sure-learning-trainee-courses-details" style={{ textDecoration: 'none' }}>
                  <Button
                    // className={classes.buttonHover}
                    // style={{ marginRight: '2px', color: 'white' }}
                    color="primary"
                    variant="contained"
                    onClick={() => { viewData(courseId); history.push("/sure-learning-trainee-courses-details") }}
                  >
                    Preview
                  </Button>
                </Link>
              </Grid>
            ))
              || ''}
            {(parseInt(button, 10) === 3 && (
              <Grid item md={12} xs={12} className={classes.typ2}>
                <Link to="/sure-learning-trainee-courses-details" style={{ textDecoration: 'none' }}>
                  {permission && permission.can_view ?
                    <Button
                      // className={classes.buttonHover}
                      color="primary"
                      variant="contained"
                      // style={{ color: 'white' }}
                      onClick={() => viewData(courseId)}
                    >
                      View
                    </Button> : null}
                </Link>
                &nbsp;&nbsp;
                {/* {localStorage.getItem('roleType') !== 'Admin' && localStorage.getItem('roleType') !== 'ADMIN' && ( */}
                <>
                  {activeStatus !== 'active' && permission && permission.can_update ?
                    (
                      <Link to="/editBody" style={{ textDecoration: 'none' }}>
                        <Button
                          // className={classes.buttonHover}
                          color="primary"
                          variant="contained"
                          // style={{ color: 'white' }}
                          onClick={() => editInfo(viewid)}
                        >
                          Edit
                        </Button>
                      </Link>
                    ) : null}
                  &nbsp;&nbsp;
                  {activeStatus === 'active' && permission && permission.can_activate_inactivate ?
                    (
                      <Button
                        // className={classes.buttonHover}
                        color="primary"
                        variant="contained"
                        // style={{ color: 'white' }}
                        onClick={() => activeFunc(
                          courseId,
                          activeStatus === 'active' ? 'inactive' : 'active',
                        )}
                      >
                        {activeStatus === 'active' ? 'Inactive' : 'Active'}
                      </Button>
                    ) : null}
                </>
              </Grid>
            ))
              || ''}
            {(parseInt(button, 10) === 4 && (
              <Grid item md={12} xs={12} className={classes.typ2}>
                <Link to="/sure-learning-trainee-courses-details" style={{ textDecoration: 'none' }}>
                  {permission && permission.can_view ?
                    <Button
                      // className={classes.buttonHover}
                      color="primary"
                      variant="contained"
                      // style={{ color: 'white' }}
                      onClick={() => viewData(viewid)}
                    >
                      Preview
                    </Button>
                    : null}
                </Link>
                &nbsp;&nbsp;
                {permission && permission.can_publish ?
                  <Button
                    // className={classes.buttonHover}
                    color="primary"
                    variant="contained"
                    // style={{ color: 'white' }}
                    onClick={() => publishCourse(viewid)}
                  >
                    Publish
                  </Button>
                  : null}
                &nbsp;&nbsp;
                {permission && permission.can_publish ?
                  <Button
                    // className={classes.buttonHover}
                    color="primary"
                    variant="contained"
                    // style={{ color: 'white' }}
                    onClick={() => unpublishCourse(viewid)}
                  >
                    Disapprove
                  </Button>
                  : null}
              </Grid>
            ))
              || ''}
            {(parseInt(button, 10) === 5 && (
              <Grid item md={12} xs={12} className={classes.typ2}>
                {permission && permission.can_enroll ?
                  <Button
                    // className={classes.buttonHover}
                    // style={{ marginRight: '2px', color: 'white' }}
                    color="primary"
                    variant="contained"
                    // style={{ color: 'white' }}
                    onClick={() => enrollFunction(courseId)}
                  >
                    Enroll
                  </Button>
                  : null}
              </Grid>
            ))
              || ''}
          </Paper>
        </Box>
      </Grid>
    </>
  );
};
CourseInfoModalView.defaultProps = {
  ratingdata: 0,
  courseName: null,
  // courseType: false,
  button: null,
  viewData: null,
  viewid: null,
  editInfo: null,
  courseImg: null,
  publishCourse: null,
  unpublishCourse: null,
  activeFunc: null,
  activeStatus: null,
  courseId: null,
  courseDuration: null,
  enrollFunction: null,
  courseCategory: null,
};
CourseInfoModalView.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  activeFunc: PropTypes.func,
  ratingdata: PropTypes.number,
  courseName: PropTypes.string,
  // courseType: PropTypes.bool,
  editInfo: PropTypes.func,
  courseImg: PropTypes.string,
  button: PropTypes.number,
  viewData: PropTypes.func,
  viewid: PropTypes.number,
  publishCourse: PropTypes.func,
  unpublishCourse: PropTypes.func,
  enrollFunction: PropTypes.func,
  activeStatus: PropTypes.string,
  courseId: PropTypes.number,
  courseDuration: PropTypes.string,
  courseCategory: PropTypes.string,
};
export default withStyles(styles)(CourseInfoModalView);
