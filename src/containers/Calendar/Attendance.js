import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete, Pagination } from '@material-ui/lab/';
import Layout from '../Layout';
import line from '../../assets/images/line.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import ClearIcon from '../../components/icon/ClearIcon';
import Breadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import moment from 'moment';
import MobileDatepicker from './mobile-datepicker';
import './attendance.scss';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state'
import {
  Card,
  Grid,
  TextField,
  makeStyles,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  CardContent,
  CardMedia,
  Typography,
  withStyles,
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MediaQuery from 'react-responsive';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',
    margin: '1.5rem -0.1rem',
  },

  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
    flexGrow: 1,
    margin: 10,
  },
  root1: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Attendance = () => {
  const moduleId = 178;
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [attendanceType, setAttendanceType] = useState([])
  const [date, setDate] = useState(new Date())
  const[dateString, setDateString] = useState('')
  const [dateValue, setDateValue] = useState(moment(date).format('YYYY-MM-DD'));
  const [academicYear,setAcademicYear] = useState([]);
  const [selectedAcademicYear,setSelectedAcadmeicYear] = useState('');  
  const [branchList,setBranchList] = useState([])
  const [selectedBranch,setSelectedBranch] = useState([])
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([])
  const [data, setData] = useState()
  useEffect(() => {
    const date = new Date();
    console.log(new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(date))
    callApi(`${endpoints.userManagement.academicYear}`,'academicYearList')
    // callApi(`${endpoints.academics.branches}`,'branchList');
    //   callApi(
    //       `${endpoints.academics.grades}?branch_id=${selectedBranch.id}&module_id=15`,
    //       'gradeList'
    //   );
  }, []);

const handleFilter = ()=>{
  const payload = {
    academic_year_id: selectedAcademicYear.id,
    branch_id: selectedBranch.branch.id,
    grade_id: selectedGrade.grade_id,
    section_id: selectedSection.section_id,
    dateValue: dateValue,
    attendanceType: attendanceType,
  }
  // console.log(payload)
  axiosInstance
      // .get(
      //   `${endpoints.studentListApis.gradeWiseStudentCount}?academic_year_id=${selectedAcademicYear.id}&branch_id=${selectedGrade.grade_id}&grade_id=${selectedSection.section_id}`
      // )
      // .then(res=>{
      //   setData(res.data.data.students)

      // })
      // .catch(err=>console.log(err))
      .get(
        `${endpoints.idCards.getIdCardsApi}?academic_year_id=${selectedAcademicYear.id}&branch_id=${selectedBranch.branch.id}&grade_id=${selectedGrade.grade_id}&section_id=${selectedSection.section_id}`
      )
      .then(res=>{
        console.log(res.data.result.results)
        setData(res.data.result.results)

      })
      .catch(err=>console.log(err))

  // mapData()
}


const mapData = ()=>{
  data && data.map((item)=>(
    console.log(item)
  ))
}

const handleDateChange = ()=>{

}

  function callApi(api, key) {
    setLoading(true);
    axiosInstance.get(api)
    .then((result) => {
        if (result.status === 200) {
          if(key === 'academicYearList'){
            console.log(result?.data?.data || [])
            setAcademicYear(result?.data?.data || [])
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || [])
            setBranchList(result?.data?.data?.results || []);
          }
            if (key === 'gradeList') {
              console.log(result?.data?.data || [])
                setGradeList(result.data.data || []);
            }
            if (key === 'section') {
              console.log(result?.data?.data || [])
                setSectionList(result.data.data);
              }
            setLoading(false);
        } else {
            setAlert('error', result.data.message);
            setLoading(false);
        }
    })
    .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
    });
}
  
  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      borderRadius: '10px',
      // marginLeft: '20px',
      height: '42px',
      marginTop: 'auto',
    },
  })(Button);
  
  const StyledFilterButton = withStyles({
    root: {
      backgroundColor: '#FF6B6B',
      color: '#FFFFFF',
      height: '42px',
      borderRadius: '10px',
      padding: '12px 40px',
      // marginLeft: '20px',
      padding: '8px 32px',
      marginLeft: 'auto',
      marginTop: 'auto',
      '&:hover': {
        backgroundColor: '#FF6B6B',
      },
    },

    startIcon: {
      fill: '#FFFFFF',
      stroke: '#FFFFFF',
    },
  })(Button);
  
  const [datePopperOpen, setDatePopperOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().startOf('isoWeek'),
    moment().endOf('week'),
  ]);

  const dummyData = [
    {
      date: '12 December 2021',
    },
    {
      date: '13 December 2021',
    },
    {
      date: '14 December 2021',
    },
    {
      date: '15 December 2021',
    },
    {
      date: '16 December 2021',
    },
    {
      date: '17 December 2021',
    },
    {
      date: '18 December 2021',
    },
    {
      date: '19 December 2021',
    },
  ];

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper'>
          <CommonBreadcrumbs componentName='Attendance' />
      </div>
      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={3} xs={12}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              size='small'
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              className='button'
              id='date-picker'
              label='Date'
              maxDate={new Date()}
              inputVariant='outlined'
              value={dateValue}
              onChange={handleDateChange}
              className="dropdown"
              style={{width:'100%'}}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedAcadmeicYear(value)
                if(value){
                  callApi(
                    `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                    'branchList'
                  );
                }
                setSelectedGrade([]);
                setSectionList([]);
                setSelectedSection([]);
                setSelectedBranch([])

              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedAcademicYear}
              options={academicYear}
              getOptionLabel={(option) => option?.session_year}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Academic Year'
                  placeholder='Academic Year'
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              // multiple
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedBranch([])
                if(value){
                  // const ids = value.map((el)=>el)
                  const selectedId=value.branch.id
                  setSelectedBranch(value)
                  callApi(
                    `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id}&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                    'gradeList'
                  );
                }
                setSelectedGrade([]);
                setSectionList([]);
                setSelectedSection([]);

              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedBranch}
              options={branchList}
              getOptionLabel={(option) => option?.branch?.branch_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              // multiple
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedGrade([])
                if(value){
                  // const ids = value.map((el)=>el)
                  const selectedId=value.grade_id
                  // console.log(selectedBranch.branch)
                  const branchId=selectedBranch.branch.id
                  setSelectedGrade(value)
                  callApi(
                    `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${branchId}&grade_id=${selectedId}&module_id=${moduleId}`,
                    'section'
                  );
                }
                  setSectionList([]);
                  setSelectedSection([]);

              }}
              id='grade_id'
              className='dropdownIcon'
              value={selectedGrade}
              options={gradeList}
              getOptionLabel={(option) => option?.grade__grade_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              // multiple
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedSection([])
                if (value) {
                  const ids=value.id
                  const secId=value.section_id
                  setSelectedSection(value)
                  setSecSelectedId(secId)
                }

              }}
              id='section_id'
              className='dropdownIcon'
              value={selectedSection}
              options={sectionList}
              getOptionLabel={(option) => option?.section__section_name || option?.section_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Section'
                  placeholder='Section'
                />
              )}
            />
          </Grid>
        <Grid item md={11} xs={12}>
          <Divider />
        </Grid>
        <Grid container direction='row' style={{margin:'1%'}}>
          <Grid item md={2} xs={6}>
          <StyledClearButton
            variant='contained'
            startIcon={<ClearIcon />}
          >
            Clear all
          </StyledClearButton>
          </Grid>

          <Grid item md={2} xs={6}>
          <StyledFilterButton
            variant='contained'
            color='secondary'
            startIcon={<FilterFilledIcon className={classes.filterIcon} />}
            className={classes.filterButton}
            onClick={handleFilter}
          >
            filter
          </StyledFilterButton>
          </Grid>
        </Grid>
      </Grid>


      <br />
      <br />

      <MediaQuery minWidth={541}>
        <Grid container direction='row' className={classes.root} spacing={3}>
          {/* <Grid item md={1}></Grid> */}

          <Grid item sm={2} md={2}>
            <Typography variant='subtitle2' color='primary'>
              Sarathak Khanna
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <img src={line} className={classes.lines} />
          </Grid>

          <Grid item sm={2} md={2}>
            <Typography variant='subtitle2' color='primary'>
              12 Dec 2021-19 Dec 2021{' '}
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <img src={line} className={classes.lines} />
          </Grid>

          <Grid item sm={1} md={1}>
            <Typography variant='subtitle2'>
              <FormControlLabel control={<Checkbox color='primary' />} label='Present' />
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <Typography>
              <FormControlLabel control={<Checkbox color='primary' />} label='Absent' />
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <Typography>
              <FormControlLabel control={<Checkbox color='primary' />} label='1st Half' />
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <Typography>
              <FormControlLabel control={<Checkbox color='primary' />} label='2nd Half' />
            </Typography>
          </Grid>
          <Grid item xs={8} sm={2} md={2} lg={2}>
            <Button>Download Excel</Button>
          </Grid>
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={540}>
        <Grid container direction='row'>
          {/* <Grid item md={1}></Grid> */}

          <Grid item sm={1} md={3}>
            <Typography variant='subtitle2' color='primary'>
              Sarathak Khanna
            </Typography>
          </Grid>
          {/* <Grid item sm={1} md={1}>
                      <img src={line} className={classes.lines} />
                    </Grid> */}

          <Grid item sm={2} md={2}>
            <Typography variant='subtitle2' color='primary'>
              12 Dec 2021-19 Dec 2021{' '}
            </Typography>
          </Grid>
        </Grid>
      </MediaQuery>
      <Grid container direction='row'>
        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>
        <br />
      </Grid>

      <Grid container direction='row' className={classes.root} spacing={3}>
        {dummyData.map((data) => {
          return (
            <Grid item xs={12} sm={6} md={2} lg={2}>
              <Card className={classes.bord}>
                <CardMedia className={classes.cover} />
                <div>
                  <CardContent style={{ marginLeft: 55 }}>
                    <Grid
                      container
                      direction='row'
                      justify='flex-start'
                      align='flex-start'
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={2}
                        lg={12}
                        // style={{ textAlign: 'start' }}
                      >
                        <h3>{data.date}</h3>
                        <Grid
                          item
                          xs={11}
                          sm={1}
                          md={1}
                          lg={2}
                          style={{ marginLeft: 15 }}
                        >
                          {/* <div className='triangle'>
                            <div className='shifts'>
                              <span className='shifts'>1st</span>
                              <br />
                              <br />
                              <br />
                              <span className='shifts'>2nd</span>
                            </div>
                          </div> */}

                          <p class='box'>
                            <span class='content1'>1st</span>
                            <span class='content'>2nd</span>
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <br />

      {/* </Grid> */}
      <Grid container justify='center'>
        {' '}
        <Pagination count={3} color='primary' />
      </Grid>
    </Layout>
  );
};

export default Attendance;

