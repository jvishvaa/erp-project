import React, { useState } from 'react';
import Layout from '../../../../containers/Layout';
import { Grid, TextField, Typography, makeStyles } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
function createData(searchStudent, score, classAvgScore, actions) {
  return { searchStudent, score, classAvgScore, actions };
}
const rows = [
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
  createData('Student Name', '6.5/10', '6.5/10', 'View Student Profile', 'View Report'),
];
const useStyles = makeStyles((theme) => ({
  gradeDiv: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardContantFlex: {
    display: 'flex',
    alignItems: 'center',
  },
  cardLetter: {
    padding: '6px 10px',
    borderRadius: '8px',
    margin: '0 10px 0 0',
    fontSize: '1.4rem',
  },
  absentDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid red',
    padding: '0 5px',
  },
  link: {
    cursor: 'pointer',
    color: 'blue',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  colorBlue: {
    color: 'blue',
  },
  colorRed: {
    color: 'lightpink',
  },
  colorWhite: {
    color: 'white',
  },
  backgrounColorGreen: {
    backgroundColor: 'lightgreen',
  },
  backgrounColorBlue: {
    backgroundColor: 'lightblue',
  },
  backgrounColorRed: {
    backgroundColor: 'lightpink',
  },
  textLeft: {
    textAlign: 'left !important',
  },
}));
const AssessmentTestStudent = () => {
  const [periodDate, setPeriodDate] = useState();
  const classes = useStyles();
  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };
  let date = moment().format('YYYY-MM-DD');
  const history = useHistory();
  const assessmentHandlerOne = () => {
    history.push('/assessment-view-student-profile');
  };
  const assessmentHandlerTwo = () => {
    history.push('/assessment-test-student-report');
  };
  return (
    <>
      <Layout>
        <Grid container spacing={2} style={{ margin: '10px' }}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label='breadcrumb'>
              <Typography style={{ color: '#808B94' }}>Dashboard</Typography>
              <Typography style={{ color: '#808B94' }}>Assessments</Typography>
              <Typography style={{ color: '#061B2E' }}>Tests</Typography>
              <Typography style={{ color: '#061B2E' }}>Students</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ height: '119px', marginTop: '-15px' }}>
              <CardContent>
                <ArrowBackIosIcon style={{ color: '#061B2E', height: '18px' }} />
                <span style={{ marginTop: '1px', color: '#061B2E' }}>Back to Test</span>
                <Grid item xs={12}>
                  <Typography style={{ color: '#7F92A3', fontSize: '16px' }}>
                    Volume 1
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  spacing={2}
                  style={{ fontSize: '18px', color: '#7F92A3' }}
                >
                  <Grid item xs={4} md={3}>
                    Grade & Section : 1 A
                  </Grid>
                  <Grid item xs={4} md={4}>
                    Test: Maths Quiz 1
                    <span
                      style={{
                        textDecoration: 'underline',
                        color: 'blue',
                        cursor: 'pointer',
                      }}
                    >
                      View Test Question
                    </span>
                  </Grid>
                  <Grid item xs={4} md={3}>
                    <TextField
                      style={{
                        cursor: 'pointer',
                        border: '1px solid black',
                        borderRadius: '5px',
                        paddingTop: '5px',
                      }}
                      id='date'
                      type='date'
                      size='small'
                      defaultValue={date}
                      onChange={handleDateClass}
                      inputProps={{ min: date }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography
              style={{
                color: '#FFC258',
                font: 'rubik',
                marginTop: '-14px',
                fontWeight: 'bold',
              }}
            >
              TotalStudents:120
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#FFEDCC' }}>
                        <TableCell>
                          <div
                            style={{
                              display: 'flex',
                              backgroundColor: 'white',
                              alignItems: 'center',
                              width: '70%',
                            }}
                          >
                            <div>
                              <SearchIcon />
                            </div>
                            <InputBase
                              placeholder='Find Students'
                              inputProps={{ 'aria-label': 'search' }}
                            />
                          </div>
                        </TableCell>
                        <TableCell align='right'>Score</TableCell>
                        <TableCell align='right'>Class Average Score</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.searchStudent}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell
                            className={clsx(classes.textLeft)}
                            style={{ color: '#1C85EB' }}
                          >
                            <AccountCircleIcon />
                            {row.searchStudent}
                          </TableCell>
                          <TableCell
                            align='right'
                            style={{ color: '#7F92A3', opacity: '100%' }}
                          >
                            {row.score}
                          </TableCell>
                          <TableCell
                            align='right'
                            style={{ color: '#7F92A3', opacity: '100%' }}
                          >
                            {row.classAvgScore}
                          </TableCell>
                          <TableCell align='right'>
                            <u
                              onClick={assessmentHandlerOne}
                              style={{ cursor: 'pointer' }}
                            >
                              {row.actions}{' '}
                            </u>
                            {'\u00A0'} {'\u00A0'} {'\u00A0'}
                            <u
                              onClick={assessmentHandlerTwo}
                              style={{ cursor: 'pointer', color: '#1C85EB' }}
                            >
                              View Report
                            </u>{' '}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};
export default AssessmentTestStudent;
