import React, { useState, useContext, useEffect } from 'react';
import {
  makeStyles,
  Box,
  Collapse,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Grid,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Layout from '../../../Layout/';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import Loader from '../../../../components/loader/loader';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
    head: {
      backgroundColor: '#ff6b6b',
      color: '#ffffff',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#d9d9d9',
    },
  },
});

function BranchTable(props) {
  const {
    branch_level_data = {},
    selectedSubject = {},
    dateRange = [],
    index = '',
  } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const classes = useRowStyles();
  const [gradeWiseData, setGradeWiseData] = useState([]);

  //to-call-grade-wise-data
  const handleGrade = (event, value) => {
    const [startDate, endDate] = dateRange;
    if (event) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.homeworkReport.branchWiseData}?subject=${
            selectedSubject?.subject_id
          }&start_date=${moment(startDate).format('YYYY-MM-DD')}&end_date=${moment(
            endDate
          ).format('YYYY-MM-DD')}&branch_id=${event?.branch_id}
      `
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setGradeWiseData(result?.data?.result?.hw_report);
            setOpen((prevState) => !prevState);
            setLoading(false);
          } else {
            setLoading(false);
            setAlert('error', result?.data?.description);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  };

  return (
    <React.Fragment>
      {loading && <Loader />}
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => handleGrade(branch_level_data)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {index + 1}
        </TableCell>
        <TableCell component='th' scope='row'>
          {branch_level_data?.branch_name}
        </TableCell>
        <TableCell align='right'>{branch_level_data?.total_hw_given}</TableCell>
        <TableCell align='right'>{branch_level_data?.total_hw_submitted}</TableCell>
        <TableCell align='right'>{branch_level_data?.total_hw_evaluated}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                Grade Wise Data
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell align='right'></TableCell>
                    <TableCell align='right'>S NO.</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Total Homework Given</TableCell>
                    <TableCell>Total Homework Submitted</TableCell>
                    <TableCell align='right'>Total Homework Evaluated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gradeWiseData?.map((grade_level_data, index) => (
                    <GradeTable
                      key={grade_level_data?.grade_id}
                      grade_level_data={grade_level_data}
                      index={index}
                      selectedSubject={selectedSubject}
                      dateRange={dateRange}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function GradeTable(props) {
  const {
    grade_level_data = {},
    index = '',
    selectedSubject = {},
    dateRange = [],
  } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const classes = useRowStyles();

  const [sectionWiseData, setSectionWiseData] = useState([]);
  const handleSection = (event, value) => {
    const [startDate, endDate] = dateRange;
    if (event) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.homeworkReport.branchWiseData}?subject=${
            selectedSubject?.subject_id
          }&start_date=${moment(startDate).format('YYYY-MM-DD')}&end_date=${moment(
            endDate
          ).format('YYYY-MM-DD')}&grade_id=${event?.grade_id}
    `
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSectionWiseData(result?.data?.result?.hw_report);
            setOpen((prevState) => !prevState);
            setLoading(false);
          } else {
            setAlert('error', result?.data?.description);
            setLoading(false);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
          setLoading(false);
        });
    }
  };

  return (
    <React.Fragment>
      {loading && <Loader />}
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => handleSection(grade_level_data)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='right'>{index + 1}</TableCell>
        <TableCell component='th' scope='row'>
          {grade_level_data?.grade_name}
        </TableCell>
        <TableCell align='right'>{grade_level_data?.total_hw_given}</TableCell>
        <TableCell align='right'>{grade_level_data?.total_hw_submitted}</TableCell>
        <TableCell align='right'>{grade_level_data?.total_hw_evaluated}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                Section Wise Data
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>S No.</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Total Homework Given</TableCell>
                    <TableCell align='right'>Total Homework Submitted</TableCell>
                    <TableCell align='right'>Total Homework Evaluated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectionWiseData?.map((section_level_data) => (
                    <SecTable
                      key={section_level_data?.name}
                      section_level_data={section_level_data}
                      index={index}
                      selectedSubject={selectedSubject}
                      dateRange={dateRange}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function SecTable(props) {
  const {
    section_level_data = {},
    index = '',
    selectedSubject = {},
    dateRange = [],
  } = props;
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const [studentWiseData, setStudentWiseData] = useState([]);

  const handleSection = (event, value) => {
    const [startDate, endDate] = dateRange;
    if (event) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.homeworkReport.branchWiseData}?subject=${
            selectedSubject?.subject_id
          }&start_date=${moment(startDate).format('YYYY-MM-DD')}&end_date=${moment(
            endDate
          ).format('YYYY-MM-DD')}&section_id=${event?.section_id}
      `
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setStudentWiseData(result?.data?.result?.hw_report);
            setOpen((prevState) => !prevState);
            setLoading(false);
          } else {
            setAlert('error', result?.data?.description);
            setLoading(false);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
          setLoading(false);
        });
    }
  };

  return (
    <React.Fragment>
      {loading && <Loader />}
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => handleSection(section_level_data)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {index + 1}
        </TableCell>
        <TableCell component='th' scope='row'>
          {section_level_data?.section_name}
        </TableCell>
        <TableCell align='right'>{section_level_data?.total_hw_given}</TableCell>
        <TableCell align='right'>{section_level_data?.total_hw_submitted}</TableCell>
        <TableCell align='right'>{section_level_data?.total_hw_evaluated}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                Student Wise Data
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>S NO.</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Total Homework Given</TableCell>
                    <TableCell align='right'>Total Homework Submitted</TableCell>
                    <TableCell align='right'>Total Homework Evaluated</TableCell>
                  </TableRow>
                </TableHead>
                {studentWiseData?.length > 0 ? (
                  <TableBody>
                    {studentWiseData?.map((student_level_data, index) => (
                      <TableRow key={index + 1} className={classes.root}>
                        <TableCell component='th' scope='row'>
                          {index + 1}
                        </TableCell>
                        <TableCell>{student_level_data?.student_name}</TableCell>
                        <TableCell align='right'>
                          {student_level_data?.total_hw_given}
                        </TableCell>
                        <TableCell align='right'>
                          {student_level_data?.total_hw_submitted}{' '}
                        </TableCell>
                        <TableCell align='right'>
                          {student_level_data?.total_hw_evaluated}{' '}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  'No Data'
                )}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function HomeWorkReportTeacher() {
  const classes = useRowStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const wider = '-10px 0px 20px 8px';
  const widerWidth = '95%';
  

  ///<<<<<<<<<<<<<<<<<<<<<<TABLE STATES>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.homeworkReport.subjectList}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setSubjectDropdown(result?.data?.result);
          setLoading(false);
        } else {
          setAlert(result?.data?.description);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  }, []);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [branchWiseData, setBranchWiseData] = useState([]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);

  const handleSubject = (event, value) => {
    //api call for subject dropdown
    setSelectedSubject('');
    setBranchWiseData([]);
    if (value) {
      setLoading(true);
      setSelectedSubject(value);
      setBranchWiseData([]);
      const [startDate, endDate] = dateRangeTechPer;
      axiosInstance
        .get(
          `${endpoints.homeworkReport.branchWiseData}?subject=${
            value?.subject_id
          }&start_date=${moment(startDate).format('YYYY-MM-DD')}&end_date=${moment(
            endDate
          ).format('YYYY-MM-DD')}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setBranchWiseData(result?.data?.result?.hw_report); //branch-wise-data
            setLoading(false);
          } else {
            setLoading(false);
            setAlert('error', result?.data?.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error?.message);
        });
    }
  };
  return (
    <>
      <Layout>
        {loading && <Loader />}
        <div style={{ width: '95%', margin: '20px auto', marginLeft: '30px' }}>
          <CommonBreadcrumbs
            componentName={`Homework`}
            childComponentName={`Teacher HW Report`}
          />
        </div>
        <Grid container spacing={5} style={{ width: widerWidth, margin: wider }}>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSubject}
              id='grade'
              className='dropdownIcon'
              value={selectedSubject || {}}
              options={subjectDropdown || []}
              getOptionLabel={(option) => option?.subject_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Subject'
                  placeholder='Subject'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={MomentUtils} className='dropdownIcon'>
              <DateRangePicker
                startText='Select-Date-Range'
                size='small'
                value={dateRangeTechPer}
                onChange={(newValue) => {
                  // setDateRangeTechPer(newValue);
                  setDateRangeTechPer(()=>newValue);
                  if(selectedSubject){
                    handleSubject(selectedSubject)
                  }
                }}
                renderInput={({ inputProps, ...startProps }, endProps) => {
                  return (
                    <>
                      <TextField
                        {...startProps}
                        format={(date) => moment(date).format('DD-MM-YYYY')}
                        inputProps={{
                          ...inputProps,
                          value: `${moment(inputProps.value).format(
                            'MM-DD-YYYY'
                          )} - ${moment(endProps.inputProps.value).format('MM-DD-YYYY')}`,
                          readOnly: true,
                        }}
                        size='small'
                        style={{ minWidth: '100%' }}
                      />
                    </>
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <div style={{ width: widerWidth, margin: wider }}>
          <TableContainer component={Paper}>
            <Table aria-label='collapsible table'>
              <TableHead>
                <TableRow className={classes.head}>
                  <TableCell />
                  <TableCell>S No</TableCell>
                  <TableCell align='right'>Branch</TableCell>
                  <TableCell align='right'>Total Homework Given</TableCell>
                  <TableCell align='right'>Total Homework Submitted</TableCell>
                  <TableCell align='right'>Total Homework Evaluated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchWiseData?.map((branch_level_data, index) => (
                  <BranchTable
                    key={branch_level_data?.branch_id}
                    index={index}
                    branch_level_data={branch_level_data}
                    selectedSubject={selectedSubject}
                    dateRange={dateRangeTechPer}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Layout>
    </>
  );
}
