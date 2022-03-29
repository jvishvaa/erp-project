import React, { useState } from 'react';
import Layout from '../../../../containers/Layout';
import { Grid, TextField, Typography } from '@material-ui/core';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Autocomplete from '@material-ui/lab/Autocomplete';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
const grade = [{ grade: 'A+' }, { grade: 'A' }, { grade: 'B+' }, { grade: 'B' }];
const testtype = [{ testtype: 'All' }, { testtype: 'All1' }];
function createData(testtype, date, testlowestscore, studentbelowthreshold, avgscore) {
  return { testtype, date, testlowestscore, studentbelowthreshold, avgscore };
}
const rows = [
  createData('English Quiz 1', '01-02-2022, Mon', '2.0/10.0', 3, '85%'),
  createData('English Quiz 2', '01-02-2022, Mon', '3.0/10.0', 3, '85%'),
  createData('Combined Test 1', '01-02-2022, Mon', '30/100', 3, '85%'),
  createData('English Quiz 3', '01-02-2022, Mon', '2.0/10.0', 3, '85%'),
  createData('English Quiz 4', '01-02-2022, Mon', '3.0/10.0', 3, '85%'),
  createData('Combined Test 2', '01-02-2022, Mon', '30/100', 3, '85%'),
  createData('Quatertly Exam 1', '01-02-2022, Mon', '30/100', 3, '85%'),
  createData('English Quiz 5', '01-02-2022, Mon', '2.0/10.0', 3, '85%'),
  createData('English Quiz 6', '01-02-2022, Mon', '3.0/10.0', 3, '85%'),
  createData('Combined Test 3', '01-02-2022, Mon', '30/100', 3, '85%'),
  createData('English Quiz 7', '01-02-2022, Mon', '2.0/10.0', 3, '85%'),
  createData('English Quiz 8', '01-02-2022, Mon', '3.0/10.0', 3, '85%'),
];
const AssessmentTestList = () => {
  const [periodDate, setPeriodDate] = useState();
  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };
  let date = moment().format('YYYY-MM-DD');
  const history = useHistory();
  const assessmentHandler = () => {
    history.push('/assessment-test-student');
  };
  return (
    <>
      <Layout>
        <Grid container spacing={2} style={{ margin: '10px' }}>
          <Grid item xs={12}>
            {/* <Breadcrumbs aria-label='breadcrumb'>
              <Typography style={{ color: '#808B94', height: '24px' }}>
                Dashboard
              </Typography>
              <Typography style={{ color: '#808B94', height: '24px' }}>
                Assessments
              </Typography>
              <Typography style={{ color: '#061B2E', height: '24px' }}>
                Tests List
              </Typography>
            </Breadcrumbs> */}
            <CommonBreadcrumbs
              componentName='Dashboard'
              childComponentName='Assessments'
              childComponentNameNext='Tests List'
            />      
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ color: '#6B7175', height: '22px', marginTop: '-10px' }}>
              Volume 1
            </Typography>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={4}>
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
                    style={{ width: '202px', height: '40px' }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
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
                    style={{ width: '202px', height: '40px', marginLeft: '-160px' }}
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
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={4}>
              <Typography
                style={{
                  color: '#FFC258',
                  height: '24px',
                  marginTop: '10px',
                  fontWeight: 'bold',
                }}
              >
                Total Students: <span style={{ color: '#061B2E' }}>50</span>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                style={{
                  color: '#FFC258',
                  height: '24px',
                  marginTop: '10px',
                  marginLeft: '-200px',
                  fontWeight: 'bold',
                }}
              >
                Total Tests: <span style={{ color: '#061B2E' }}>24</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ width: '100%' }}>
              <CardContent>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow
                        style={{
                          backgroundColor: '#FFEDCC',
                          color: '#372D2D',
                          height: '24px',
                        }}
                      >
                        <TableCell>Test Type</TableCell>
                        <TableCell align='right'>Date</TableCell>
                        <TableCell align='right'>Test Lowest Score</TableCell>
                        <TableCell align='right'>Student Below Threshold</TableCell>
                        <TableCell align='right'>Avg. Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.testtype}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          onClick={assessmentHandler}
                        >
                          <TableCell align='right'>{row.testtype}</TableCell>
                          <TableCell align='right'>{row.date}</TableCell>
                          <TableCell align='right'>{row.testlowestscore}</TableCell>
                          <TableCell align='right'>{row.studentbelowthreshold}</TableCell>
                          <TableCell align='right'>{row.avgscore}</TableCell>
                          <KeyboardArrowRightIcon
                            style={{
                              cursor: 'pointer',
                              marginLeft: '-30px',
                              color: '#7F92A3',
                              marginTop: '18px',
                            }}
                          />
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
export default AssessmentTestList;
