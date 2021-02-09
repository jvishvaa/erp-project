/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';

import {
  makeStyles,
  Typography,
  SvgIcon,
  Grid,
  Box,
  Paper,
  Button,
} from '@material-ui/core';
import Loading from '../../../components/loader/loader';
import { AssessmentAnalysisContext } from './assessment-analysis-context';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { LevelsChart, CategoryChart } from './test-assessment-charts';

import teacherSideReport from '../../../assets/images/teacherSideReport.svg';
import studentTestComparision from '../../../assets/images/analysis-svgrepo-com.svg';

const useStyles = makeStyles(() => ({
  root: {
    // border: '1px solid',
    // borderColor: '#E2E2E2',
    // padding: '0.9rem',
    // borderRadius: '10px',
    // width: '100%',
    // boxShadow: 'none',
  },
  btn: {
    padding: '0.25rem 0.6rem',
    borderRadius: '0.6rem',
    fontSize: '0.75rem',
  },
  hr: {
    border: '1px solid #E2E2E2',
    margin: '1rem 0',
  },
  title: { color: '#014B7E', fontSize: '1.1rem', whiteSpace: 'pre-line' },
  chartContainer: {
    margin: 1,
    padding: 5,
    border: '1px solid #C9C9C9',
    borderRadius: '20px',
  },
}));

const AssessmentAnalysisUI = (props) => {
  const {
    history,
    match: {
      params: { assessmentId },
    },
  } = props;
  // const {} = history;
  const { user_id: user } = JSON.parse(localStorage.getItem('userDetails') || {});
  // const user = 20;
  const moduleId = 112;
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);

  const {
    assessmentQuestionAnalysis = {},
    fetchAssessmentQuestionAnalysis,

    teacherExcelReport: { fetching: downloading } = {},
    downloadTeacherExcelReport,
  } = useContext(AssessmentAnalysisContext);

  useEffect(() => {
    const { data } = assessmentQuestionAnalysis || {};
    if (!data) {
      fetchAssessmentQuestionAnalysis(
        { user, assessment_id: assessmentId },
        {
          onReject: (errorOrResp) => {
            const {
              message: errorMessage = 'Failed to connect to server',
              response: { statusText } = {},
              data: { message: messageFromDev } = {},
            } = errorOrResp || {};
            setAlert('error', `${messageFromDev || statusText || errorMessage}`);
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {[assessmentQuestionAnalysis.fetching, downloading].includes(true) ? (
        <Loading message='Loading...' />
      ) : null}

      <Paper elevation={0}>
        <Box m={{ xs: '1rem', sm: '2rem' }} className={classes.root}>
          <Typography variant='h6' className={classes.title}>
            Analysis
          </Typography>
          <hr className={classes.hr} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <Box className={classes.chartContainer}>
                <CategoryChart />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box className={classes.chartContainer}>
                <LevelsChart />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box className={classes.chartContainer}>
                    <div style={{ margin: 3 }}>
                      <Grid container justify='space-between'>
                        <Grid item>
                          <Typography variant='h6' className={classes.title}>
                            <small>Teacher side</small>
                            {`\nReport`}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <SvgIcon
                            component={() => (
                              <img style={{ width: 82 }} src={teacherSideReport} alt='' />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Button
                        onClick={() => {
                          downloadTeacherExcelReport(
                            {},
                            {
                              onReject: (errorOrResp) => {
                                debugger
                                const {
                                  message: errorMessage = 'Failed to connect to server',
                                  response: { statusText } = {},
                                  data: { message: messageFromDev } = {},
                                } = errorOrResp || {};
                                setAlert(
                                  'error',
                                  `${messageFromDev || statusText || errorMessage}`
                                );
                              },
                            }
                          );
                        }}
                        className={classes.btn}
                        size='small'
                      >
                        DOWLOAD EXCEL
                      </Button>
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className={classes.chartContainer}>
                    <div
                      style={{ margin: 3, cursor: 'pointer' }}
                      onClick={() => {
                        history.push('/assessment/test-comparision/');
                      }}
                    >
                      <Grid container justify='space-between'>
                        <Grid item />
                        <Grid item>
                          <SvgIcon
                            component={() => (
                              <img
                                style={{ width: 82, float: 'right' }}
                                src={studentTestComparision}
                                alt=''
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Typography variant='h6' className={classes.title}>
                        <small>Student</small>
                        {`\nTest comparision`}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};
export default withRouter(AssessmentAnalysisUI);
