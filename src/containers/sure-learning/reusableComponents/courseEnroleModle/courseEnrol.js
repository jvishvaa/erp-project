/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  Paper, Grid, Typography, withStyles, Button,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import Box from '@material-ui/core/Box';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import ReusableContinueCourse from '../reusableVideoPlayList/reusableVideoPlayList';

import useFetch from '../../../hoc/useFetch';
// import { useAlert } from '../../../hoc/alert/alert';
import Loader from '../../../hoc/loader';
import urls from '../../../url';
import styles from './courseEnroleMode.style';

const CourseEnroleModle = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [ratigggg] = useState(5);
  const [rating] = useState(5);
  const [flagg, setFlagg] = useState(false);
  const [count, setCount] = useState(1);

  const star = [];
  const nonStar = [];
  let i = 0;

  const {
    data: IDResponse,
    isLoading: IDResponseLoading,
    doFetch: fetchIDResponse,
  } = useFetch();

  let id = null;
  useEffect(() => {
    id = localStorage.getItem('viewID');
    fetchIDResponse({
      url: `${urls.base}/courses/${id}/course_details_view/`,
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: localStorage.getItem('Enroll_for_Self_Courses')
      },
    });
  }, []);

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
  const chapterData = (array, idNo) => {
    if (array !== null && idNo) {
      localStorage.setItem('chapterdata', JSON.stringify(array));
      localStorage.setItem('chapterID', idNo);
    } else {
      localStorage.setItem('chapterdata', null);
      localStorage.setItem('chapterID', null);
    }
  };

  // const enrollFunction = id => {
  //   // setEnrolled(false);
  //   const obj = {
  //     course_id: id
  //   };
  //   // fetchEnroll({
  //   //   url: `${urls.base}/courses/enroll_course/`,
  //   //   method: "POST",
  //   //   body: obj,
  //   //   headers: {
  //   //     "Content-Type": "Application/json",
  //   //     Authorization: `Bearer ${auth.personal_info.token}`
  //   //   }
  //   // });

  //   fetch(`${urls.base}/courses/enroll_course/`, {
  //     method: "POST",
  //     body: JSON.stringify(obj),
  //     headers: {
  //       Authorization: `Bearer ${auth.personal_info.token}`,
  //       "Content-Type": "application/json"
  //     }
  //   })
  //     .then(res => {
  //       if (res.status === 201) {
  //         alert.success("Successfully Enrolled");
  //         return res.json();
  //       }
  //     })
  //     .then(data => {
  //       history.push("/course");
  //     });
  //   // setEnrolled(true);
  // };

  const courseContent = () => {
    let courseContentData = null;

    courseContentData = (
      <>
        {IDResponse
          && IDResponse.course_content
          && IDResponse.course_content.map((item, index) => (
            <ExpansionPanel key={index} className={classes.expansionPanel}>
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
                && item.content_related_chapters.map((dataL, indexID) => (
                  <Grid key={indexID} container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <Box borderTop={3} className={classes.Box}>
                        <Typography
                          className={classes.TypographyText}
                          variant="h5"
                          style={{ marginLeft: '10%' }}
                        >
                          {dataL.title}

                          <Link to="/homeBody">
                            <Button
                              style={{ float: 'right' }}
                              disabled={!!IDResponse.is_lock}
                              onClick={() => chapterData(dataL.chapter_wise_videos, dataL.id)}
                            >
                              {' '}
                              <OpenInNewIcon />
                              {' '}
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
          && IDResponse.course_related_explanation.map((item, indexIDNO) => (
            <React.Fragment key={indexIDNO}>
              <Typography
                variant="h5"
                className={classes.TypographyText}
                style={{ fontWeight: 'bold' }}
              >
                {item.question}
              </Typography>
              <Typography>
                {item.example.map((example, INDEXid) => (
                  <Typography
                    key={INDEXid}
                    variant="h6"
                    className={classes.TypographyText}
                  >
                    ‣
                    {' '}
                    {example}
                  </Typography>
                ))}
              </Typography>
              <br />
            </React.Fragment>
          ))}
      </>
    );
    return courseExplanationData;
  };

  const ShowPage = () => {
    let ShowPageDATA = null;
    ShowPageDATA = (
      <>
        <Grid container>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Paper className={classes.paper}>
              <Box border={5} className={classes.Box}>
                <Grid container spacing={4}>
                  <Grid item md={5} xs={12}>
                    {IDResponse && IDResponse.course_demo ? (
                      <video
                        id="background-video"
                        controls
                        alt="course"
                        height="100%"
                        width="100%"
                        controlsList="nodownload"
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
                  </Grid>
                  <Grid item md={7} xs={12}>
                    <Typography variant="h5" className={classes.Typography}>
                      Title:
                      {' '}
                      {(IDResponse && IDResponse.course_name) || ''}
                    </Typography>
                    <Typography variant="h6" className={classes.Typography}>
                      Subtitle:
                      {' '}
                      {(IDResponse
                        && IDResponse.course_subtitle.subtitle_name)
                        || ''}
                      {' '}
                    </Typography>
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
                      </Button>
                    </Typography> */}
                    <Typography variant="h6" className={classes.Typography}>
                      {star.map((item, idaa) => (
                        <StarIcon key={idaa} style={{ color: 'gold' }} />
                      ))}
                      {flagg && <StarHalfIcon style={{ color: 'gold' }} />}
                      {nonStar.map((item, iDDd) => (
                        <StarBorderIcon key={iDDd} style={{ color: 'gold' }} />
                      ))}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
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
                      <br />
                      ‣
                      {IDResponse.course_description}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container>
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
        </Grid>
      </>
    );
    return ShowPageDATA;
  };
  let loader = null;
  if (IDResponseLoading) {
    loader = <Loader open />;
  }

  return (
    <>
      <Grid container style={{ marginTop: '20vh' }}>
        <Grid item md={1} xs={1} />
        <Grid item md={10} xs={10}>
          {IDResponse ? ShowPage() : ''}
        </Grid>
      </Grid>
      {loader}
    </>
  );
};
CourseEnroleModle.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(CourseEnroleModle);
