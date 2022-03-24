import React, { useState } from 'react';
import Layout from '../../../../containers/Layout';
import { Grid, TextField, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import moment from 'moment';
const grade = [{ grade: 'A+' }, { grade: 'A' }, { grade: 'B+' }, { grade: 'B' }];
const testtype = [{ testtype: 'All' }, { testtype: 'All1' }];
function createData(testType, date, testMarks, classAvgScore, action) {
  return { testType, date, testMarks, classAvgScore, action };
}
const rows = [
  createData('English Quiz 1', '01-02-2022, Mon', '2.0/10.0', '85%', 'View Test'),
  createData('English Quiz 2', '01-02-2022, Mon', '3.0/10.0', '85%', 'View Test'),
  createData('Combined Test 1', '01-02-2022, Mon', '30/100', '85%', 'View Test'),
  createData('English Quiz 3', '01-02-2022, Mon', '2.0/10.0', '85%', 'View Test'),
  createData('English Quiz 4', '01-02-2022, Mon', '3.0/10.0', '85%', 'View Test'),
  createData('Combined Test 2', '01-02-2022, Mon', '30/100', '85%', 'View Test'),
  createData('Quatertly Exam 1', '01-02-2022, Mon', '30/100', '85%', 'View Test'),
  createData('English Quiz 5', '01-02-2022, Mon', '2.0/10.0', '85%', 'View Test'),
  createData('English Quiz 6', '01-02-2022, Mon', '3.0/10.0', '85%', 'View Test'),
  createData('Combined Test 3', '01-02-2022, Mon', '30/100', '85%', 'View Test'),
  createData('English Quiz 7', '01-02-2022, Mon', '2.0/10.0', '85%', 'View Test'),
  createData('English Quiz 8', '01-02-2022, Mon', '3.0/10.0', '85%', 'View Test'),
];
const AssessmentTestStudentReport = () => {
  const [periodDate, setPeriodDate] = useState();
  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };
  let date = moment().format('YYYY-MM-DD');
  return (
    <>
      <Layout>
        <Grid container spacing={2} style={{ margin: '10px' }}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label='breadcrumb'>
              <Typography style={{ color: '#061B2E' }}>Dashboard</Typography>
              <Typography style={{ color: '#808B94' }}>Assessments</Typography>
              <Typography style={{ color: '#061B2E' }}>Tests</Typography>
              <Typography style={{ color: '#061B2E' }}>Students</Typography>
              <Typography style={{ color: '#061B2E' }}>Student Report</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ color: '#6B7175', marginTop: '-1.5%', fontSize: '18px' }}
          >
            <Typography>Volume 1</Typography>
          </Grid>
          <Grid item xs={12} container spacing={2} style={{ marginTop: '-20px' }}>
            <Grid item xs={2}>
              <Autocomplete
                id='combo-box-demo'
                options={grade}
                className='volume-container'
                getOptionLabel={(option) => option.grade}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label='Grade'
                    variant='outlined'
                    style={{ width: '100%' }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                id='combo-box-demo'
                options={testtype}
                className='volume-container'
                getOptionLabel={(option) => option.testtype}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label='Test Type'
                    variant='outlined'
                    style={{ width: '100%' }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} container justifyContent='flex-end'>
              <TextField
                style={{
                  cursor: 'pointer',
                  border: '1px solid black',
                  borderRadius: '5px',
                  paddingTop: '15px',
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
          <Grid item xs={12} container>
            <Card style={{ width: '100%' }}>
              <CardContent>
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={4}>
                    <AccountCircleIcon />
                    Student Name <br />
                    Reg. Number
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      style={{ color: '#FFC258', opcaity: '100%', height: '24px' }}
                    >
                      Total Tests:
                      <span style={{ color: '#061B2E', opcaity: '100%', height: '24px' }}>
                        24
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#FFEDCC' }}>
                        <TableCell>Test Type</TableCell>
                        <TableCell align='right'>Date</TableCell>
                        <TableCell align='right'>Test Marks</TableCell>
                        <TableCell align='right'>Class Avg. Score</TableCell>
                        <TableCell align='right'>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.testType}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align='right'>{row.testType}</TableCell>
                          <TableCell align='right'>{row.date}</TableCell>
                          <TableCell align='right'>{row.testMarks}</TableCell>
                          <TableCell align='right'>{row.classAvgScore}</TableCell>
                          <TableCell
                            align='right'
                            style={{
                              color: 'blue',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            {row.action}
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
export default AssessmentTestStudentReport;
