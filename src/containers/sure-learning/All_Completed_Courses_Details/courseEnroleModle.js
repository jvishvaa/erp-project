/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Paper, Grid, Typography, withStyles, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { Link } from 'react-router-dom';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import axios from 'axios';
import styles from './courseEnroleMode.style';
import Layout from 'containers/Layout';

const CourseEnroleModle = ({ classes, history }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [moduleId, setModuleId] = useState(null);
  const [ratigggg] = useState(5);
  const [rating] = useState(5);
  const [flagg, setFlagg] = useState(false);
  const [count, setCount] = useState(1);
  const [showVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [IDResponse, setIDResponse] = useState([]);
  const [loader, setLoader] = useState(false);
  const star = [];
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  const nonStar = [];
  let i = 0;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'Enrolled_Self_Courses') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  const getCourseDetails = (id) => {
    setLoader(true);
    axios
      .get(`${endpoints.sureLearning.getCourseDetails}${id}/course_details_view/`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setIDResponse(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (moduleId !== null) {
      getCourseDetails(localStorage.getItem('viewID'));
    }
  }, [moduleId]);

  useEffect(() => {
    if (ratigggg.length > 2) {
      setFlagg(true);
    }
  }, [ratigggg]);

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

  const backToAllCourses = () => {
    history.push('/sure_learning/completed_courses');
  };

  function completeCourse() {
    // const courseType = localStorage.getItem('coursesType');
    let obj;
    let courseType = 'trainer_driven';
    if (courseType === 'self_driven') {
      obj = {
        course: IDResponse.id,
        is_self_driven: true,
      };
    } else if (courseType === 'trainer_driven') {
      obj = {
        course: IDResponse.id,
        is_trainer_driven: true,
      };
    } else {
      obj = {
        course: IDResponse.id,
        is_induction_training: true,
      };
    }
    setLoading(true);
    fetch(`${endpoints.sureLearning.getInstructureCourses}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        Authorization: udaanToken,
        'Content-Type': 'application/json',
        module: moduleId,
      },
    }).then((res) => {
      if (res.status === 201) {
        setLoading(false);
        setAlert('success', 'Successfully Completed');

        history.push('/sure_learning/completed_courses');
        return res.json();
      }
      if (res.status !== 201) {
        setLoading(false);
        setAlert('error', 'User Already Register With This Course')
        return res.json();
      }
      return 0;
    });
  }

  const courseContent = () => {
    let courseContentData = null;

    courseContentData = (
      <>
        {IDResponse &&
          IDResponse.course_content &&
          IDResponse.course_content.map((item, Indedid) => (
            <ExpansionPanel key={Indedid} className={classes.expansionPanel}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={classes.TypographyText} variant='h5'>
                  {item.title}{' '}
                </Typography>
              </ExpansionPanelSummary>

              {item.content_related_chapters !== null &&
                item.content_related_chapters.map((dataL, index) => (
                  <Grid key={index} container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <Box borderTop={3} className={classes.Box}>
                        <Typography
                          className={classes.TypographyText}
                          variant='h5'
                          style={{ marginLeft: '10%' }}
                        >
                          {dataL.title}
                          <Link
                            to={{
                              pathname: '/modelBody',
                              state: {
                                current: {
                                  chapterData: dataL.chapter_wise_videos,
                                  chapterId: dataL.id,
                                  itemID: item.id,
                                  isCompleted: dataL.is_chapter_completed,
                                  completeData: item.content_related_chapters,
                                  currentIndex: index,
                                },
                              },
                            }}
                            style={{ textDecoration: 'none' }}
                          >
                            <Button style={{ float: 'right' }}>
                              <OpenInNewIcon />
                            </Button>
                          </Link>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ))}
            </ExpansionPanel>
          ))}
      </>
    );
    return courseContentData;
  };

  const courseExplanation = () => {
    let courseExplanationData = null;

    courseExplanationData = (
      <>
        {IDResponse &&
          IDResponse.course_related_explanation &&
          IDResponse.course_related_explanation.map((item, index) => (
            <React.Fragment key={index}>
              <Typography
                component='span'
                variant='h6'
                className={classes.TypographyText}
                style={{ fontWeight: 'bold' }}
              >
                {item.question}
              </Typography>
              {item.example.map((example, indexId) => (
                <h3 key={indexId} className={classes.TypographyText}>
                  ‣ {example}
                </h3>
              ))}
            </React.Fragment>
          ))}
      </>
    );
    return courseExplanationData;
  };
  const ShowPage = () => {
    let ShowPageData = null;
    ShowPageData = (
      <>
        <Grid container>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Paper className={classes.paper}>
              <Box border={5} className={classes.Box}>
                <Grid container spacing={1}>
                  <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                    <Typography
                      component='span'
                      variant='h5'
                      className={classes.Typography}
                    >
                      {(IDResponse && IDResponse.course_name) || ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {IDResponse &&
          IDResponse.course_category &&
          IDResponse.course_category.category_name && (
            <Grid container>
              <Grid item md={1} />
              <Grid item md={10} xs={12}>
                <Paper className={classes.paperr}>
                  <Box border={5} className={classes.Box}>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Typography variant='h6' className={classes.TypographyText}>
                          <span style={{ fontWeight: 'bold' }}>
                            Course Category :&nbsp;
                          </span>
                          {IDResponse &&
                            IDResponse.course_category &&
                            IDResponse.course_category.category_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        {IDResponse &&
          IDResponse.course_sub_category &&
          IDResponse.course_sub_category.sub_category_name && (
            <Grid container>
              <Grid item md={1} />
              <Grid item md={10} xs={12}>
                <Paper className={classes.paperr}>
                  <Box border={5} className={classes.Box}>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Typography variant='h6' className={classes.TypographyText}>
                          <span style={{ fontWeight: 'bold' }}>
                            Course Sub Category :&nbsp;
                          </span>
                          {IDResponse &&
                            IDResponse.course_sub_category &&
                            IDResponse.course_sub_category.sub_category_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        <Grid container>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Paper className={classes.paperr}>
              <Box border={5} className={classes.Box}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    {courseExplanation()}
                    <Typography variant='h6' className={classes.TypographyText}>
                      <span style={{ fontWeight: 'bold' }}>Course Description</span>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Paper className={classes.paperrr}>
              <Box border={5} className={classes.Box}>
                <Typography variant='h4' className={classes.title}>
                  Course Content
                </Typography>
                {courseContent()}
              </Box>
            </Paper>
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={5} xs={12}>
            <Button variant='contained' color='primary' onClick={() => completeCourse()}>
              Complete
            </Button>
          </Grid>
          <Grid item md={5} xs={12}>
            <Button
              variant='contained'
              color='primary'
              style={{ float: 'right' }}
              onClick={() => backToAllCourses()}
            >
              Back
            </Button>
          </Grid>
          <Grid item md={1} />
        </Grid>
      </>
    );
    return ShowPageData;
  };

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='All Completed Courses'
        childComponentNameNext='Course details'
        isAcademicYearVisible={true}
      />
      {ShowPage()}
    </Layout>
  );
};

CourseEnroleModle.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(CourseEnroleModle);
