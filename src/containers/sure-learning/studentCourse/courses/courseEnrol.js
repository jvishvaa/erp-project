/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  withStyles,
  Button,
  // lighten,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
// import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import useFetch from '../../hoc/useFetch';
// import { useAlert } from '../../hoc/alert/alert';
import Loader from '../../hoc/loader';
import urls from '../../url';

import styles from './courseEnrol.style';

const CourseEnrol = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));

  // const alert = useAlert();
  // const history = useHistory();
  // const {
  //   data: sendChapterId,
  //   isLoading: ChapterIdLoading,
  //   doFetch: fetchChapterId,
  // } = useFetch();

  const {
    data: IDResponsedata,
    isLoading: courseIDLoading1,
    doFetch: courseID1,
  } = useFetch();

  let id = null;
  useEffect(() => {
    id = localStorage.getItem('courseID');
    courseID1({
      url: `${urls.base}/courses/customer_enroll_courses/?course_id=${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
      },
    });
  }, []);

  // const BorderLinearProgress = withStyles({
  //   root: {
  //     height: 10,
  //     backgroundColor: lighten('#ff6c5c', 0.5),
  //   },
  //   bar: {
  //     borderRadius: 20,
  //     backgroundColor: '#ff6c5c',
  //   },
  // })(LinearProgress);

  const courseContent = () => {
    let courseContentData = null;
    courseContentData = (
      <>
        <Grid container style={{ marginBottom: '2rem' }}>
          {/* <Grid item md={1} xs={1} /> */}
          <Grid item md={12} xs={12}>
            <Grid>
              <Paper
                className={classes.paper}
                style={{ backgroundColor: 'powderblue' }}
              >
                <Typography
                  variant="h4"
                  styles={{ color: 'white' }}
                  className={classes.typographyPadding}
                >
                  Session&apos;s Play List
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {IDResponsedata
          && IDResponsedata.course_content
          && IDResponsedata.course_content.map((item) => (
            <ExpansionPanel
              key={Math.random()}
              className={classes.expansionPanel}
              style={{ marginBottom: '2%' }}
            >
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
                  <Link
                    key={dataL.id}
                    to={{
                      pathname: '/sure-learning-trainee-courses-details-content-extension',
                      state: {
                        current: {
                          chapterData: dataL.chapter_wise_videos,
                          chapterId: dataL.id,
                          itemID: item.id,
                          isCompleted: dataL.is_chapter_completed,
                        },
                        next:
                          item.content_related_chapters.length - 1 !== index
                            ? {
                              data: item.content_related_chapters,
                              index: index + 1,
                              itemId: item.id,
                            }
                            : undefined,
                      },
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Box borderTop={3} className={classes.Box}>
                          <Typography
                            className={classes.TypographyText}
                            variant="h5"
                            style={{ marginLeft: '10%' }}
                          >
                            <span
                              style={{
                                width: '15rem',
                                display: 'inline-block',
                              }}
                            >
                              {dataL.title}
                            </span>

                            {dataL ? (
                              <span>
                                {dataL.is_chapter_completed === true ? (
                                  <span
                                    htmlFor="Completed"
                                    style={{
                                      marginLeft: '20%',
                                      textAlign: 'center',
                                      color: 'green',
                                      fontSize: '20px',
                                    }}
                                  >
                                    Completed
                                  </span>
                                ) : (
                                  <span
                                    htmlFor="pending"
                                    style={{
                                      marginLeft: '20%',
                                      textAlign: 'center',
                                      color: 'red',
                                      fontSize: '20px',
                                    }}
                                  >
                                    Pending
                                  </span>
                                )}
                              </span>
                            ) : (
                              ''
                            )}
                            <Button style={{ float: 'right' }}>
                              <OpenInNewIcon />
                            </Button>
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Link>
                ))}
            </ExpansionPanel>
          ))}
      </>
    );
    return courseContentData;
  };

  let loader = null;
  if (courseIDLoading1) {
    loader = <Loader open />;
  }
  return (
    <>
      <Grid container style={{ marginTop: '20vh' }}>
        <Grid item md={1} xs={1} />
        <Grid item md={10} xs={10}>
          {courseContent()}
        </Grid>
      </Grid>
      {loader}
    </>
  );
};

CourseEnrol.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(CourseEnrol);
