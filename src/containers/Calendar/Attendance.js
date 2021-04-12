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
import FormGroup from "@material-ui/core/FormGroup";
import { useHistory } from 'react-router';
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
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState()
  const history = useHistory()

  useEffect(() => {
    console.log(history)
    if(history?.location?.state?.payload){
      console.log(history?.location?.state?.payload?.academic_year_id?.session_year)
      setSelectedAcadmeicYear(history?.location?.state?.payload?.academic_year_id)
      setSelectedBranch(history?.location?.state?.payload?.branch_id)
      setSelectedGrade(history?.location?.state?.payload?.grade_id)
      setSelectedSection(history?.location?.state?.payload?.section_id)
      setStartDate(history?.location?.state?.payload?.startDate)
      setEndDate(history?.location?.state?.payload?.endDate)
      setData(history?.location?.state?.studentData)

      console.log(history?.location?.state?.studentData[0]?.student)
      axiosInstance
      .get(`${endpoints.academics.singleStudentAttendance}?start_date=${history?.location?.state?.payload?.endDate}&end_date=${history?.location?.state?.payload?.startDate}&erp_id=${history?.location?.state?.studentData[0]?.student}`)
      .then(res=>{
        if(res.status == 200){
          
        }
        if(res.status == 400){
          console.log(res.message)
        }
      })
      .catch(err=>console.log(err))

  }
  else{
    const date = new Date();
    console.log(new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(date))
    callApi(`${endpoints.userManagement.academicYear}`,'academicYearList')
  }
  
  }, []);

  const [activePage, setActivePage] = useState(1)

  let totalPages = data && Math.ceil(data.length / 8)
  console.log(totalPages)
  let offset = (activePage - 1)*8
  const handlePageChange = (e, value)=>{
      setActivePage(value)
  }

  const [state, setState] = React.useState({
    present: false,
    absent: false,
    first_half: false,
    second_half: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log(state)
  };

  const handleOpenOnViewDetails = ()=>{
    if(history?.location?.state?.payload)
    {
      callApi(`${endpoints.userManagement.academicYear}`,'academicYearList')
    // console.log("history data is there")
    }
    else{
    }
  }

const handleFilter = ()=>{
  const payload = {
    academic_year_id: selectedAcademicYear.id,
    branch_id: selectedBranch.branch.id,
    grade_id: selectedGrade.grade_id,
    section_id: selectedSection.section_id,
    dateValue: dateValue,
    attendanceType: attendanceType,
  }
console.log(payload, "testing")
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
              onOpen={()=>handleOpenOnViewDetails()}
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
              <strong>
                {data && data[0].student_first_name.slice(0,6)}
              </strong>
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <img src={line} className={classes.lines} />
          </Grid>

          <Grid item sm={2} md={3}>
            <Typography variant='subtitle2' color='primary'>
              {startDate} to {endDate}
            </Typography>
          </Grid>
          <Grid item sm={1} md={1}>
            <img src={line} className={classes.lines} />
          </Grid>

          <Grid item xs={12} md={5} >
            <FormGroup row className='checkboxStyle'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.present}
                      onChange={handleChange}
                      name="present"
                      disabled={state.absent}
                      color="primary"
                    />
                  }
                  label="Present"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.absent}
                      onChange={handleChange}
                      name="absent"
                      color="primary"
                      disabled={
                        state.present || (state.first_half && state.second_half)
                      }
                    />
                  }
                  label="Absent"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.first_half}
                      onChange={handleChange}
                      name="first_half"
                      color="primary"
                      disabled={state.present || state.absent}
                    />
                  }
                  label="1st half"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.second_half}
                      onChange={handleChange}
                      name="second_half"
                      color="primary"
                      disabled={state.present || state.absent}
                    />
                  }
                  label="2nd half"
                />
            </FormGroup>
          </Grid>
          {/* <Grid item xs={8} sm={2} md={2} lg={2}>
            <Button>Download Excel</Button>
          </Grid> */}
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={540}>
        <Grid container direction='row'>
          <Grid item sm={2} md={3}>
            <Typography variant='subtitle2' color='primary'>
            {startDate} to {endDate}
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
        {data && data
        .filter((item,index)=>{
          if(state.present){
            const pageCondition = index >= offset && index < offset + 8
            return pageCondition && (item.is_first_shift_present && item.is_second_shift_present)
          }
          else if(state.absent){
            const pageCondition = index >= offset && index < offset + 8
            return pageCondition && (item.is_first_shift_present || item.is_second_shift_present)
          }
          else if(state.first_half){
            const pageCondition = index >= offset && index < offset + 8
            return pageCondition && item.is_first_shift_present
          }
          else if(state.second_half){
            const pageCondition = index >= offset && index < offset + 8
            return pageCondition && item.is_second_shift_present
          }
          else if(state.first_half && state.second_half){
            const pageCondition = index >= offset && index < offset + 8
            return pageCondition && (item.is_first_shift_present && item.is_second_shift_present)
          }
          else{
            const pageCondition = index >= offset && index < offset + 8
            return pageCondition && item
          }
        })
        .map((item) => {
          return (
            <Grid item>
              <Card className={classes.bord}>
                <CardMedia className={classes.cover} />
                <div>
                  <CardContent >
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
                        <h3 style={{color:'#014B7E', textAlign:'center'}}>{item.attendance_for_date}</h3>
                        <Grid
                          item
                          xs={11}
                          sm={1}
                          md={1}
                          lg={2}
                        >
                          <p class='box'>
                            <span style={{borderTopColor: item.is_first_shift_present ? "yellow" : 'blue', borderLeftColor:item.is_first_shift_present ? "yellow" : 'blue'}}>1st</span>
                            <span style={{borderBottomColor: item.is_second_shift_present ? "yellow" : 'blue', borderRightColor:item.is_second_shift_present ? "yellow" : 'blue'}}>2nd</span>
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
        {
          data && <Pagination count={totalPages} page={activePage} onChange={handlePageChange} color='secondary' />

        }
      </Grid>
    </Layout>
  );
};

export default Attendance;

