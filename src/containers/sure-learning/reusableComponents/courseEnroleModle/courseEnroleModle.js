/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Paper, Grid, Typography, withStyles, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// import StarIcon from "@material-ui/icons/Star";
// import StarBorderIcon from "@material-ui/icons/StarBorder";
// import StarHalfIcon from "@material-ui/icons/StarHalf";
import Box from '@material-ui/core/Box';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link } from 'react-router-dom';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
// import ReusableContinueCourse from "../reusableVideoPlayList/reusableVideoPlayList";

// import { Container } from '@material-ui/core/Container';
import useFetch from '../../hoc/useFetch';
import Loader from '../../hoc/loader';
import endpoints from 'config/endpoints';
import styles from './courseEnroleMode.style';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import { useHistory } from 'react-router-dom';


const CourseEnroleModle = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [completeStatus] = useState(localStorage.getItem('completeCourseStatus'));
  const [courseType] = useState('self_driven');
  const [ratigggg] = useState(5);
  const [rating] = useState(5);
  const [flagg, setFlagg] = useState(false);
  const [count, setCount] = useState(1);
  const [showVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const [enrollCourseId, setEnrollCourseId] = useState(null);
  const [selfCoursesModule, setSetCoursesModule] = useState(null)

  const star = [];
  const nonStar = [];
  let i = 0;

  // const {
  //   // data: enroll,
  //   isLoading: enrollLoading,
  //   doFetch: fetchEnroll,
  // } = useFetch();

  const {
    data: IDResponse,
    isLoading: IDResponseLoading,
    doFetch: fetchIDResponse,
  } = useFetch();

  let id = null;

  const getModuleId = () => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Enroll_for_Self_Courses') {
        // setEnrollCourseId(item.module);
        return item.module;
      }
      if (item.module_name === 'Trainee_Courses') {
        // setEnrollCourseId(item.module);
        return item.module;
      }
    })
  }

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Enroll_for_Self_Courses') {
        setEnrollCourseId(item.module);
      }
      if (item.module_name === 'Trainee_Courses') {
        setSetCoursesModule(item.module);
      }
    })
  }, [])

  useEffect(() => {
    if (enrollCourseId) {
      id = localStorage.getItem('viewID');
      fetchIDResponse({
        url: `${endpoints.sureLearning.base}/courses/${id}/course_details_view/`,
        method: 'GET',
        headers: {
          'Content-Type': 'Application/json',
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: enrollCourseId ? enrollCourseId : selfCoursesModule
        },
      });
    }

  }, [enrollCourseId]);

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
    // history.push('/coursesView');
    // if (courseType === 'self_driven') {
    //   history.push('/sure-learning-trainee-courses');
    // } else if (courseType === 'trainer_driven') {
    //   history.push('/trainerDriven/testDrivenCoursesView');
    // } else {
    // if(localStorage.getItem('Branch_Wise_Report')==="null" && localStorage.getItem('Consolidated_Report')==="null")
    //    history.push('./teacherDashboard/training_course')
    // if(courseType === 'self_driven')
    //   history.push('/sure-learning-trainee-courses');
    // if(courseType === 'trainer_driven')
    // history.push('/trainerDriven/testDrivenCoursesView');
    // else
    //   history.push('/create_Course');
    // }
    history.push('/sure-learning-trainee-courses');
  };

  function completeCourse() {
    // const courseType = localStorage.getItem('coursesType');
    let obj;
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
    fetch(`${endpoints.sureLearning.principalCompletedViewCourse}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        Authorization: `Bearer ${auth.personal_info.token}`,
        'Content-Type': 'application/json',
        module: localStorage.getItem('Courses')
      },
    })
      .then((res) => {
        if (res.status === 201) {
          setLoading(false);
          setAlert('success', 'Successfully Completed');
          if (courseType === 'self_driven'
            //  && ((auth.personal_info && auth.personal_info.role === 'AcademicHeads')
            //  || (auth.personal_info && auth.personal_info.role === 'Planner')
            //  || (auth.personal_info && auth.personal_info.role === 'Coordinator')
            //  || (auth.personal_info && auth.personal_info.role === 'AcademicManager')
            //  || (auth.personal_info && auth.personal_info.role === 'Principal')
            //  || (auth.personal_info && auth.personal_info.role === 'LeadTeacher'))
          ) {
            history.push('/sure-learning-trainee-courses');
          } else if (courseType === 'trainer_driven'
            // && ((auth.personal_info && auth.personal_info.role === 'AcademicHeads')
            // || (auth.personal_info && auth.personal_info.role === 'Planner')
            // || (auth.personal_info && auth.personal_info.role === 'Coordinator')
            // || (auth.personal_info && auth.personal_info.role === 'AcademicManager')
            // || (auth.personal_info && auth.personal_info.role === 'Principal')
            // || (auth.personal_info && auth.personal_info.role === 'LeadTeacher'))
          ) {
            history.push('/trainerDriven/testDrivenCoursesView');
          }
          return res.json();
        } if (res.status !== 201) {
          setLoading(false);
          setAlert('warning', 'User Already Register With This Course');
          return res.json();
        }
        return 0;
      });
  }

  // const chapterData = (array) => {
  //   if (array !== null) {
  //     localStorage.setItem('chapterdata', JSON.stringify(array));
  //   } else {
  //     localStorage.setItem('chapterdata', null);
  //   }
  // };

  // const enrollFunction = (id) => {
  //   const obj = {
  //     course_id: id,
  //   };
  //   fetchEnroll({
  //     url: `${urls.base}/courses/enroll_course/`,
  //     method: 'POST',
  //     body: obj,
  //     headers: {
  //       'Content-Type': 'Application/json',
  //       Authorization: `Bearer ${auth.personal_info.token}`,
  //     },
  //   });
  // };

  const courseContent = () => {
    let courseContentData = null;

    courseContentData = (
      <>
        {IDResponse
          && IDResponse.course_content
          && IDResponse.course_content.map((item, Indedid) => (
            <ExpansionPanel key={Indedid} className={classes.expansionPanel}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.TypographyText} variant="h5">
                  {item.title}
                  {' '}
                </Typography>
              </ExpansionPanelSummary>

              {item.content_related_chapters !== null
                && item.content_related_chapters.map((dataL, index) => (
                  <Grid key={index} container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <Box borderTop={3} className={classes.Box}>
                        <Typography
                          className={classes.TypographyText}
                          variant="h5"
                          style={{ marginLeft: '10%' }}
                        >
                          {dataL.title}
                          <Link
                            to={{
                              pathname: '/sure-learning-trainee-courses-details-content-extension',

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
                            <Button
                              style={{ float: 'right' }}
                              variant='contained'
                              color='primary'
                            // disabled={!!IDResponse.is_lock}
                            // onClick={() => chapterData(dataL.chapter_wise_videos, dataL.id)}
                            >
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
        {IDResponse
          && IDResponse.course_related_explanation
          && IDResponse.course_related_explanation.map((item, index) => (
            <React.Fragment key={index}>
              <Typography
                component="span"
                variant="h6"
                className={classes.TypographyText}
                style={{ fontWeight: 'bold' }}
              >
                {item.question}
              </Typography>
              {item.example.map((example, indexId) => (
                <h3 key={indexId} className={classes.TypographyText}>
                  ‣
                  {' '}
                  {example}
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
                  {/* <Grid item md={5} xs={12}>
                    {IDResponse && IDResponse.course_demo ? (
                      <video
                        id="background-video"
                        controls
                        controlsList="nodownload"
                        alt="course"
                        height="100%"
                        width="100%"
                        className={classes.video}
                      >
                        <source src={IDResponse.course_demo} type="video/mp4" />
                        <track
                          src={IDResponse.course_demo}
                          kind="captions"
                          srcLang="en"
                          label="english_captions"
                        />
                      </video>
                    ) : (
                      ''
                    )}
                  </Grid> */}
                  <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                    <Typography
                      component="span"
                      variant="h5"
                      className={classes.Typography}
                    >
                      {(IDResponse && IDResponse.course_name) || ''}
                    </Typography>
                    {/* <Typography variant='h6' className={classes.Typography}>
                      Subtitle:{" "}
                      {(IDResponse &&
                        IDResponse.course_subtitle.subtitle_name) ||
                        ""}{" "}
                    </Typography> */}
                    {/* <Typography variant='h5' className={classes.Typography}>
                      {" "}
                      {IDResponse && IDResponse.is_not_free
                        ? "Free : "
                        : "Paid : "}
                      <Button
                        color='primary'
                        variant='contained'
                        onClick={() =>
                          enrollFunction(IDResponse && IDResponse.id)
                        }
                      >
                        Enroll
                      </Button>{" "}
                    </Typography>
                    <Typography variant='h6' className={classes.Typography}>
                      {star.map(() => {
                        return <StarIcon style={{ color: "gold" }} />;
                      })}
                      {flagg && <StarHalfIcon style={{ color: "gold" }} />}
                      {nonStar.map(() => {
                        return <StarBorderIcon style={{ color: "gold" }} />;
                      })}
                    </Typography> */}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {(IDResponse && IDResponse.course_category && IDResponse.course_category.category_name)
          && (
            <Grid container>
              <Grid item md={1} />
              <Grid item md={10} xs={12}>
                <Paper className={classes.paperr}>
                  <Box border={5} className={classes.Box}>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6" className={classes.TypographyText}>
                          <span style={{ fontWeight: 'bold' }}>
                            Course Category :&nbsp;
                          </span>
                          {IDResponse && IDResponse.course_category
                            && IDResponse.course_category.category_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        {(IDResponse && IDResponse.course_sub_category
          && IDResponse.course_sub_category.sub_category_name)
          && (
            <Grid container>
              <Grid item md={1} />
              <Grid item md={10} xs={12}>
                <Paper className={classes.paperr}>
                  <Box border={5} className={classes.Box}>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6" className={classes.TypographyText}>
                          <span style={{ fontWeight: 'bold' }}>
                            Course Sub Category :&nbsp;
                          </span>
                          {(IDResponse && IDResponse.course_sub_category
                            && IDResponse.course_sub_category.sub_category_name)}
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
                    <Typography variant="h6" className={classes.TypographyText}>
                      <span style={{ fontWeight: 'bold' }}>
                        Course Description
                      </span>
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
                <Typography variant="h4" className={classes.title}>
                  Course Content
                </Typography>
                {courseContent()}
              </Box>
            </Paper>
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={5} xs={12}>
            <Button
              variant="contained"
              color="primary"
              // disabled={(completeStatus === 'true')}
              disabled={(completeStatus === 'false') || (auth.personal_info && auth.personal_info.role === 'superadmin') || (auth.personal_info && auth.personal_info.role === 'Admin') || (auth.personal_info && auth.personal_info.role === 'ContentWriter') || IDResponse === null}
              onClick={() => completeCourse()}
            >
              Complete
            </Button>
          </Grid>
          {/* {((auth.personal_info && auth.personal_info.role !== 'superadmin') && (auth.personal_info && auth.personal_info.role !== 'Admin') && (auth.personal_info && auth.personal_info.role !== 'ContentWriter')) */}
          {/* && ( */}
          <Grid item md={5} xs={12}>
            <Button
              variant="contained"
              color="primary"
              style={{ float: 'right' }}
              disabled={(auth.personal_info && auth.personal_info.role === 'superadmin') || (auth.personal_info && auth.personal_info.role === 'Admin') || (auth.personal_info && auth.personal_info.role === 'ContentWriter')}
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

  let loader = null;
  if (IDResponseLoading || loading) {
    loader = <Loader open />;
  }
  // console.log('temp commit');
  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='Trainee Course Details'
        isAcademicYearVisible={true}
      />
      {showVideo === false ? ShowPage() : ''}
      {loader}
    </Layout>
  );
};

CourseEnroleModle.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(CourseEnroleModle);
