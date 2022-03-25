import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import StudentRightDashboard from '../StudentDashboard/StudentRightDashboard/StudentRightDashboard';
import { useHistory } from 'react-router-dom';
import CirclePercentage from './CirclePercentage';
import Layout from '../../../../containers/Layout';
import TodayClass from './TodayClass';
import TodayAttendance from './TodayAttendance';
import Overview from './Overview';
// import Assessment from '../StudentDashboard/StudentLeftDashboard/Assessment/Assessment';
import AssessmentNew from './AssessmentNew';
import AssessmentNewTwo from './AssessmentNewTwo';
import CurriculumCompletionNew from './CurriculumCompletionNew';
import TrainingReportNew from './TrainingReportNew';
import TodayClassTwo from './TodayClassTwo';
import CurriculumCompletionNewTwo from './CurriculumCompletionNewTwo';
import RecentSubmissions from './RecentSubmissions';

function TeacherDashboardSecond() {
  return (
    <>
      <Layout>
        <Grid container spacing={2} style={{ margin: '5px' }}>
          <Grid item container xs={9} spacing={2}>
            <Grid>
              <Typography
                style={{
                  marginBottom: '10px',
                  fontWeight: '1000',
                  fontSize: '12px',
                  color: '#347394',
                }}
              >
                Good Morning Teacher...
              </Typography>
              <Typography
                style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '16px' }}
              >
                Dashboard
              </Typography>
            </Grid>
            <Grid item container xs={12} spacing={2}>
              <Grid item container xs={12} spacing={2}>
                <TodayClassTwo />
              </Grid>
              <Grid item container xs={12} spacing={2}>
                <Grid item container xs={6} spacing={0}>
                  <Grid item container xs={12} spacing={0} direction='column'>
                    <Grid>
                      <Grid>
                        <TodayAttendance />
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid>
                        <RecentSubmissions />
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid>
                        <TrainingReportNew />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container xs={6} spacing={0}>
                  <Grid item container xs={12} spacing={0} direction='column'>
                    <Grid>
                      <Grid>
                        <AssessmentNewTwo />
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid>
                        <CurriculumCompletionNewTwo />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* RH SIDE code below */}
          <Grid item container xs={3} spacing={2} style={{ backgroundColor: 'red' }}>
            {/* <StudentRightDashboard /> */}
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

export default TeacherDashboardSecond;
