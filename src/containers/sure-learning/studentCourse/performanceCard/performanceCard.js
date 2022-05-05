/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  withStyles,
  Avatar,
  TableHead,
  TableRow,
  Table,
  TableCell,
  Tab,
  Tabs,
  AppBar,
  TableBody,
  Divider,
  useTheme,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Loader from '../../hoc/loader';
import urls from '../../url';
import useFetch from '../../hoc/useFetch';
import styles from './performanceCard.style';

const PerformanceCard = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [courseValue, setCourseValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = React.useState(0);
  const [openModel, setOpenModel] = React.useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const BorderLinearProgress = withStyles({
    root: {
      height: 20,
      backgroundColor: 'lightgray',
      borderRadius: ('5px', '5px', '5px', '5px'),
    },
    bar: {
      borderRadius: '10px',
      backgroundColor: 'lightseagreen',
    },
  })(LinearProgress);

  const {
    data: performanceData,
    isLoading: gettingPerformanceData,
    doFetch: FetchPerformanceData,
  } = useFetch(null);

  const {
    data: courseScore,
    isLoading: GettingCourseScore,
    doFetch: fetchCourseScore,
  } = useFetch(null);

  useEffect(() => {
    if (courseValue) {
      fetchCourseScore({
        url: `${urls.getCourseScoreApi}?course_id=${courseValue}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }, [courseValue]);

  useEffect(() => {
    if (auth && openModel) {
      FetchPerformanceData({
        url: `${urls.getPerformanceCardApi}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }, [auth, openModel]);

  useEffect(() => {
    if (performanceData) {
      fetchCourseScore({
        url: `${urls.getCourseScoreApi}?course_id=${performanceData
          && performanceData.courses
          && performanceData.courses.length !== 0
          && performanceData.courses[0].course
          && performanceData.courses[0].course.id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          'Content-Type': 'application/json',
        },
      });
      setOpen(true);
    }
  }, [performanceData]);

  let loader = null;
  if (gettingPerformanceData || GettingCourseScore) {
    loader = <Loader open />;
  }

  function handleChange(event, newValue) {
    setValue(newValue);
    setCourseValue(
      performanceData
        && performanceData.courses
        && performanceData.courses.length !== 0
        && performanceData.courses[newValue || 0].course
        && performanceData.courses[newValue || 0].course.id,
    );
  }

  function functionToCaluPercentage(total, marks) {
    const totalMarks = parseInt(total, 10) * 2;
    const marksArrived = parseInt(marks, 10);
    const percentage = (marksArrived / totalMarks) * 100;
    return Math.round(percentage);
  }

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.roott} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const handleClose = () => {
    setOpen(false);
    setOpenModel(false);
    setValue(0);
  };

  return (
    <>
      <IconButton
        color="secondary"
        onClick={() => {
          setOpenModel(true);
        }}
        variant="contained"
      >
        <TrendingUpIcon />
      </IconButton>
      <>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <Dialog
              fullScreen={fullScreen}
              maxWidth="lg"
              open={open}
              aria-labelledby="alert-dialog-title"
            >
              <DialogTitle id="alert-dialog-title" onClose={handleClose}>
                Performance Card
              </DialogTitle>
              <Divider />
              <DialogContent>
                <Grid container spacing={1}>
                  <Grid item md={12} xs={12}>
                    <Box border={2} className={classes.box}>
                      <Grid container spacing={2}>
                        <Grid item md={2} xs={10}>
                          <Avatar
                            alt="Remy"
                            src={
                              performanceData && performanceData.profile_pic
                                ? performanceData.profile_pic
                                : ''
                            }
                            className={classes.avatar}
                          />
                        </Grid>
                        <Grid item md={4} xs={10}>
                          <Typography
                            variant="h6"
                            className={classes.typography}
                          >
                            {performanceData
                              && performanceData.performance_card
                              && performanceData.performance_card.user
                              && performanceData.performance_card.user.first_name}
                          </Typography>
                          <BorderLinearProgress
                            className={classes.margin}
                            variant="determinate"
                            max="100"
                            value={
                              (performanceData
                                && performanceData.performance_card
                                && performanceData.performance_card
                                  .overall_percentage
                                && Math.round(
                                  performanceData.performance_card
                                    .overall_percentage,
                                ))
                              || 0
                            }
                          />
                        </Grid>
                        <Grid item md={3} />
                        <Grid item md={2} xs={12}>
                          <Typography
                            variant="h6"
                            className={classes.typography}
                          >
                            {' '}
                            Overall Percentage
                          </Typography>
                          <Typography
                            variant="h6"
                            className={classes.typography}
                          >
                            {(performanceData
                              && performanceData.performance_card
                              && performanceData.performance_card
                                .overall_percentage
                              && Math.round(
                                performanceData.performance_card
                                  .overall_percentage,
                              ))
                              || '0%'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        color="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                      >
                        {performanceData
                          && performanceData.courses
                          && performanceData.courses.map((item) => (
                            <Tab
                              style={{ marginRight: '5px', marginLeft: '5px' }}
                              label={item.course && item.course.course_name}
                              key={item.id}
                            />
                          ))}
                      </Tabs>
                    </AppBar>
                  </Grid>
                  {courseScore && courseScore.length === 0 ? (
                    <Grid item md={12} xs={12}>
                      <Typography
                        style={{
                          color: 'lightseagreen',
                          textAlign: 'center',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                        variant="h4"
                      >
                        Records Not Found
                      </Typography>
                    </Grid>
                  ) : (
                    ''
                  )}
                  {courseScore && courseScore.length !== 0 && (
                    <Grid item md={12} xs={12}>
                      <Box border={2} className={classes.box}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">
                                <Typography variant="h6">
                                  Element Quizzes
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography variant="h6">Weightage</Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography variant="h6">Score</Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography variant="h6">Percentage</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {courseScore
                              && courseScore.map((data, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <TableRow key={i}>
                                  <TableCell align="left">
                                    {(data.question_paper
                                      && data.question_paper.title)
                                      || ''}
                                  </TableCell>
                                  <TableCell align="left">
                                    {data.question_paper
                                      && data.question_paper.total_questions
                                      && data.question_paper.total_questions * 2}
                                  </TableCell>
                                  <TableCell align="left">
                                    {(data.mark_scored && data.mark_scored)
                                      || 0}
                                    {' '}
                                    /
                                    {' '}
                                    {(data.question_paper
                                      && data.question_paper.total_questions
                                        * 2)
                                      || 0}
                                  </TableCell>
                                  <TableCell align="left">
                                    {data.question_paper
                                    && data.question_paper.total_questions
                                    && typeof functionToCaluPercentage(
                                      data.question_paper.total_questions,
                                      data.mark_scored,
                                    ) !== 'string'
                                      ? `${functionToCaluPercentage(
                                        data.question_paper.total_questions,
                                        data.mark_scored,
                                      )}  %`
                                      : ''}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              {loader}
            </Dialog>
          </Grid>
        </Grid>
      </>
      {loader}
    </>
  );
};

PerformanceCard.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(PerformanceCard);
