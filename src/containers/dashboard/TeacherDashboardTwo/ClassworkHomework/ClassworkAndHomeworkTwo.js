import React, { useState,useEffect,useContext } from 'react';
import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  Table,
  TextField,
} from '@material-ui/core';
import Layout from 'containers/Layout';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@material-ui/icons';
import clsx from 'clsx';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import axios from 'axios';
import endpoints from 'config/endpoints';
// import Loader from 'containers/sure-learning/hoc/loader';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';

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
    // '&::before': {
    //   backgroundColor: 'black',
    // },
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
  textcenter: {
    textAlign: 'center !important',
  },
}));

const ClassworkAndHomeworkTwo = () => {
  const classes = useStyles();
  const [tableData,setTableData] = useState([])
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);



  const dataList = () => {
    setLoading(true);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

    axios
      .get(
        `${endpoints.teacherDashboard.cwHWTeacherDashboard}?acad_session=122&page_size=20&grade_id=59&end_date=2022-03-25&start_date=2022-02-28&branch_id=111&subject_id=101&section_id=68`,
        {
          headers: {
            'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        console.log('sideright', result?.data?.result);
        if (result?.data?.status_code === 200) {
          setTableData(result?.data?.result,);
          setAlert('success', result?.data?.message)
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  }

  useEffect(()=>{
    dataList()
  },[])

  const data = [
    {
      testType: 'English',
      subjectName: '88',
      totalTest: 70,
      avgScore: '78%',
      grade: 'Grade 1',
      section: 'Section A',
    },
    {
      testType: 'Hindi',
      subjectName: '98',
      totalTest: 70,
      avgScore: '78%',
      grade: 'Grade 2',
      section: 'Section B',
    },
    {
      testType: 'Maths',
      subjectName: '79',
      totalTest: 70,
      avgScore: '78%',
      grade: 'Grade 1',
      section: 'Section C',
    },
    {
      testType: 'English',
      subjectName: '46',
      totalTest: 70,
      avgScore: '78%',
      grade: 'Grade 4',
      section: 'Section A',
    },
    {
      testType: 'Science',
      subjectName: '97',
      totalTest: 70,
      avgScore: '78%',
      grade: 'Grade 1',
      section: 'Section A',
    },
    {
      testType: 'Social',
      subjectName: '99',
      totalTest: 70,
      avgScore: '78%',
      grade: 'Grade 2',
      section: 'Section A',
    },
    {
      testType: 'Math Quiz 1',
      subjectName: '100',
      totalTest: 70,
      avgScore: '78%',
      grade: 'Grade 1',
      section: 'Section A',
    },
  ];

  const subj = [
    { title: 'Maths', vol: '1' },
    { title: 'English', vol: '2' },
    { title: 'Hindi', vol: '3' },
    { title: 'Science', vol: '4' },
    { title: 'Lab', vol: '5' },
  ];

  const test = [
    { title: 'Test1', vol: '1' },
    { title: 'Test2', vol: '2' },
    { title: 'Test3', vol: '3' },
    { title: 'Test4', vol: '4' },
    { title: 'Test5', vol: '5' },
  ];

  const section = [
    { title: 'Grade A', vol: '1', subject: 'Maths' },
    { title: 'Grade B', vol: '2', subject: 'Science' },
    { title: 'Grade C', vol: '3', subject: 'English' },
    { title: 'Grade D', vol: '4', subject: 'Hindi' },
    { title: 'Grade E', vol: '5', subject: 'Socail Science' },
  ];

  const [periodDate, setPeriodDate] = useState();
  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };
  let date = moment().format('YYYY-MM-DD');

  return (
    <Layout>
      {/* {loading && <Loader />} */}
      <CommonBreadcrumbs
        componentName='Dashboard'
        childComponentName='Homework And Classwork'
      />
      <Grid
        xs={12}
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        style={{ padding: 15 }}
      >
        <Grid container direction='row' xs={12} sm={2} md={4} lg={4}>
          <Autocomplete
            id='combo-box-demo'
            size='small'
            options={section}
            getOptionLabel={(option) => option.title}
            style={{ width: 150, marginRight: 15 }}
            renderInput={(params) => (
              <TextField {...params} label='Grade' variant='outlined' />
            )}
          />
          <Autocomplete
            id='combo-box-demo'
            size='small'
            options={section}
            getOptionLabel={(option) => option.subject}
            style={{ width: 120 }}
            renderInput={(params) => (
              <TextField {...params} label='Subject' variant='outlined' />
            )}
          />
        </Grid>
        <div>
          <TextField
            style={{
              cursor: 'pointer',
              border: '1px solid black',
              borderRadius: '5px',
              paddingTop: '5px',
            }}
            id='date'
            // label='Till Date'
            type='date'
            size='small'
            defaultValue={date}
            onChange={handleDateClass}
            inputProps={{ min: date }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </Grid>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Grid
          container
          direction='row'
          xs={12}
          sm={8}
          md={4}
          style={{
            textAlign: 'center',
            marginLeft: 15,
            marginBottom: '15px',
            border: '1px solid #4093D4',
          }}
        >
          <Grid
            xs={6}
            style={{ background: '#4093D4', color: 'white', padding: '10px 0' }}
          >
            <b>Homework</b>
          </Grid>
          <Grid xs={6} style={{ padding: '10px 0' }}>
            <b>Classwork</b>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          sm={4}
          container
          direction='row'
          justifyContent='flex-end'
          style={{ marginRight: '15px' }}
        >
          <span style={{ color: '#074597' }}>Date Range Selected</span> : {date}
        </Grid>
      </div>
      <div style={{ padding: '0px 20px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ background: '#ebf2fe' }}>
              <TableRow>
                <TableCell>Grade and Subject</TableCell>
                <TableCell align='right' style={{ color: '#4DC41B' }}>
                  Total Submitted
                </TableCell>
                <TableCell align='right' style={{ color: '#F2A127' }}>
                  Total Pending
                </TableCell>
                <TableCell align='right' style={{ color: '#3A90E6' }}>
                  Total Evaluated
                </TableCell>
                <TableCell>Title</TableCell>
                {/* <TableCell></TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.totalTest}>
                  <TableCell align='left' component='th' scope='row'>
                    <b>{item.section_mapping__grade__grade_name}</b>
                    {'\u00A0'}-{'\u00A0'}
                    {item.section_mapping__section__section_name} {'\u00A0'}
                    {'\u00A0'}
                    {'\u00A0'}
                    {item.subject__subject_name}
                  </TableCell>
                  <TableCell align='right'>{item.total_submitted}</TableCell>
                  <TableCell align='right'>{item.total_pending}</TableCell>
                  <TableCell align='right'>{item.total_evaluated}</TableCell>
                  <TableCell align='right'>Lorem, ipsum dolor.</TableCell>
                  {/* <TableCell align='left'>
                    <ArrowForwardIosIcon />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default ClassworkAndHomeworkTwo;
