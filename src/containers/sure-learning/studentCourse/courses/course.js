import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  // useHistory
} from 'react-router-dom';
import {
  Typography,
  // Divider,
  withStyles,
  lighten,
  Button,
  Grid,
  Paper,
} from '@material-ui/core';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinearProgress from '@material-ui/core/LinearProgress';
import useFetch from '../../hoc/useFetch';
// import { useAlert } from '../../hoc/alert/alert';
import Loader from '../../hoc/loader';
import urls from '../../url';

import styles from './course.style';
// import CourseEnrol from './courseEnrol';

const Course = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  // const history = useHistory();
  const {
    data: courses,
    isLoading: coursesLoading,
    doFetch: fetchCourses,
  } = useFetch();

  useEffect(() => {
    fetchCourses({
      url: urls.courses,
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
      },
    });
  }, [fetchCourses, auth.personal_info.token]);

  const continueCourse = (id) => {
    localStorage.setItem('courseID', id);
  };

  const BorderLinearProgress = withStyles({
    root: {
      height: 10,
      backgroundColor: lighten('#ff6c5c', 0.5),
    },
    bar: {
      borderRadius: 20,
      backgroundColor: '#ff6c5c',
    },
  })(LinearProgress);

  let loader = null;
  if (coursesLoading) {
    loader = <Loader open />;
  }
  // const backToHome = () => {
  //   history.push('/');
  // };
  return (
    <>
      <Grid container style={{ marginTop: '20vh' }}>
        <Grid item md={1} xs={1} />
        <Grid item md={10} xs={10}>
          <Grid>
            <Paper style={{ backgroundColor: 'powderblue' }}>
              <Typography
                variant="h4"
                styles={{ color: 'white' }}
                className={classes.typographyPadding}
              >
                Courses
              </Typography>
            </Paper>
          </Grid>
          {courses
            && courses.results.map((data, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className={classes.root} key={i}>
                <Paper className={classes.paper}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={3} style={{ margin: 'auto' }}>
                      <ButtonBase className={classes.image}>
                        <img
                          className={classes.img}
                          src={data.course.course_image}
                          alt="course"
                        />
                      </ButtonBase>
                    </Grid>
                    <Grid item xs={12} md={3} style={{ margin: 'auto' }}>
                      <Typography variant="body2" gutterBottom>
                        {' '}
                        Course Name:
                        {' '}
                        {data.course.course_name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Start Date:
                        {data.register_date}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} style={{ margin: ' auto' }}>
                      <div className={classes.root}>
                        <Typography variant="body2" gutterBottom>
                          Session Progress :
                          {' '}
                          {data.session_progress || 0}
                          {' '}
                          %
                        </Typography>
                        <BorderLinearProgress
                          className={classes.margin}
                          variant="determinate"
                          color="secondary"
                          max="100"
                          value={parseInt(data.session_progress, 10) || 0}
                        />
                      </div>
                    </Grid>
                    <Grid item md={3} xs={12} style={{ margin: 'auto' }}>
                      <Link to="CourseEnrol" style={{ textDecoration: 'none' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ justifyContent: 'center' }}
                          onClick={() => continueCourse(data.course.id)}
                        >
                          Continue..
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                </Paper>
              </div>
            ))}
        </Grid>
      </Grid>
      {loader}
    </>
  );
};
Course.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(Course);
