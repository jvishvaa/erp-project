import React, { useState } from 'react';
import Layout from '../../../../containers/Layout';
import { Grid, TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const volume = [{ volume: '1' }, { volume: '2' }, { volume: '3' }, { volume: '4' }];
function createData(grades, subjects, totalstudents, studentsbelowthreshold, avgscore) {
  return { grades, subjects, totalstudents, studentsbelowthreshold, avgscore };
}
const rows = [
  createData('Grade1 -SectionB', 'English', 50, 3, '85%'),
  createData('Grade1 -SectionC', 'Science', 50, 3, '85%'),
  createData('Grade2 -SectionA', 'Maths', 50, 3, '85%'),
  createData('Grade2 -SectionC', 'English', 50, 3, '85%'),
  createData('Grade3 -SectionA', 'Science', 50, 3, '85%'),
  createData('Grade3 -SectionB', 'Science', 50, 3, '85%'),
  createData('Grade4 -SectionC', 'English', 50, 3, '85%'),
  createData('Grade4 -SectionA', 'Science', 50, 3, '85%'),
  createData('Grade5 -SectionB', 'English', 50, 3, '85%'),
];
const AssessmentDetails = () => {
  const [periodDate, setPeriodDate] = useState();

  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };
  let date = moment().format('YYYY-MM-DD');
  const history = useHistory();
  const assessmentHandler = () => {
    history.push('/assessment-test-list');
  };
  return (
    <>
      <Layout>
        <Grid xs={12} container spacing={2} style={{ margin: '10px' }}>
          <Grid item xs={12}>            
            <CommonBreadcrumbs
              componentName='Dashboard'
              childComponentName='Assessments  '       
            />         
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                id='combo-box-demo'
                options={volume}
                className='volume-container'
                getOptionLabel={(option) => option.volume}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label='Volume'
                    variant='outlined'
                    style={{ width: '202px', height: '40px' }}
                  />
                )}
              />
            </Grid>
            <Grid xs={6} container justifyContent='flex-end'>
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
          <Grid item xs={12}>
            <Typography
              style={{
                color: '#FFC258',
                fontWeight: 'bold',
                fontSize: '20px',
                width: '283px',
                height: '24px',
                marginTop: '10px',
              }}
            >
              Student Assessment Details:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ width: '100%' }}>
              <CardContent>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#FFEDCC' }}>
                        <TableCell>Grades</TableCell>
                        <TableCell>Subjects</TableCell>
                        <TableCell>Total Students</TableCell>
                        <TableCell>Students Below Threshold</TableCell>
                        <TableCell>Avg. Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.grades}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          onClick={assessmentHandler}
                        >
                          <TableCell
                            style={{ display: 'flex', justifyContent: 'flex-start' }}
                          >
                            {row.grades}
                          </TableCell>
                          <TableCell style={{ color: 'green' }}>{row.subjects}</TableCell>
                          <TableCell style={{ color: '#061B2E', height: '22px ' }}>
                            {row.totalstudents}
                          </TableCell>
                          <TableCell
                            align='right'
                            style={{ color: '#061B2E', height: '22px' }}
                          >
                            {row.studentsbelowthreshold}
                          </TableCell>
                          <TableCell
                            align='right'
                            style={{ color: '#061B2E', height: '22px' }}
                          >
                            {row.avgscore}
                          </TableCell>
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
export default AssessmentDetails;
