import React, { useContext, useState, useEffect } from 'react';
import {
  makeStyles,
  Divider,
  TextField,
  Grid,
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  withStyles,
} from '@material-ui/core';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { Autocomplete, Pagination } from '@material-ui/lab';
import MobileDatepicker from './mobile-datepicker';
import Layout from '../Layout';
import line from '../../assets/images/line.svg';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import ClearIcon from '../../components/icon/ClearIcon';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MediaQuery from 'react-responsive';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import './overallattendance.scss';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state'
import '../teacherBatchView/style.scss'
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { useHistory } from 'react-router';
import { useForm, Controller } from "react-hook-form";
import { fi } from 'date-fns/locale';

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
  },
}));

const Attend = () => {
  const moduleId = 178;
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
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
  const [defaultData, setDefaultData] = useState()
  const history = useHistory()
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [result, setResult] = useState()

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
      setResult(history?.location?.state?.data)
      console.log(history?.location?.state?.payload?.branch_id)
      console.log(history?.location?.state?.data , "student data")
  }

    else{
      const date = new Date();
      console.log(new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(date))
      callApi(`${endpoints.userManagement.academicYear}`,'academicYearList')
    }


  }, []);

const handleOpenOnViewDetails = ()=>{
  if(history?.location?.state?.payload)
  {
    callApi(`${endpoints.userManagement.academicYear}`,'academicYearList')
  // console.log("history data is there")
  }
  else{
  }
}

// useEffect(() => {
//   if(history){
//     console.log(history?.location?.state?.payload?.academic_year_id?.session_year)
//     setSelectedAcadmeicYear(history?.location?.state?.payload?.academic_year_id)
//   }
// }, [history])
  //pagination

  const [activePage, setActivePage] = useState(1)

  let totalPages = result && Math.ceil(result.length / 8)
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

  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
const handleFilter = ()=>{
  const payload = {
    academic_year_id: selectedAcademicYear?.selectedAcademicYear?.id,
    branch_id: selectedBranch?.branch?.id,
    grade_id: selectedGrade?.grade_id,
    section_id: selectedSection?.section_id,
    start_date: startDate,
    end_date: endDate
  }
  console.log(payload)
  // if(selectedAcademicYear.length < 0 || selectedBranch.length < 0 || selectedGrade.length < 0 || selectedSection.length < 0){
  //   alert('select filters')
  // }
  // else{
    axiosInstance.
  get(
    `${endpoints.academics.attendance}?academic_year=${selectedAcademicYear.id}&branch_id=${selectedBranch.branch.id}&grade_id=${selectedGrade.grade_id}&section_id=${selectedSection.section_id}&start_date=${startDate}&end_date=${endDate}`
  )
  .then(res=>{
    console.log(res.data)
    let temp = [...res.data.absent_list, ...res.data.present_list]
    console.log(temp)
    setResult(temp)
  })
  .catch(err=>console.log(err))
  }
  
// }

const handleStartDateChange = (date) => {
  const endDate = getDaysAfter(date.clone(), 6);
  setEndDate(endDate);
  setStartDate(date.format('YYYY-MM-DD'));
  // getTeacherHomeworkDetails(2, date, endDate);
};

const handleEndDateChange = (date) => {
  const startDate = getDaysBefore(date.clone(), 6);
  setStartDate(startDate);
  setEndDate(date.format('YYYY-MM-DD'));
  // getTeacherHomeworkDetails(2, startDate, date);
};
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
const defaultValues = {
  firstName: "Elon",
  lastName: "Musk",
  gender: "male"
};


  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      borderRadius: '10px',
      marginLeft: '20px',
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
      marginLeft: '20px',
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

  const handleDateChange = (event, value) => {
    setDateValue(value);
    console.log('date', value);
  };
  
const handleSinlgeStudent = (id)=>{
  console.log(id)
  const studentData = result.filter((item)=>item.id == id)
  console.log(studentData)
  const payload = {
    academic_year_id: selectedAcademicYear,
    branch_id: selectedBranch,
    grade_id: selectedGrade,
    section_id: selectedSection,
    startDate: startDate,
    endDate: endDate
  }
  history.push({
    pathname: '/attendance',
    state: {
      studentData,
      payload
    }
  })
}

  const dummyData = [
    {
      name: 'Akash',
      rollno: '11',
      ERPno: '123456789',
    },
    {
      name: 'Sharma',
      rollno: '12',
      ERPno: '123456789',
    },
    {
      name: 'Akash',
      rollno: '13',
      ERPno: '123456789',
    },
    {
      name: 'Sharma',
      rollno: '14',
      ERPno: '123456789',
    },
    {
      name: 'Akash',
      rollno: '15',
      ERPno: '123456789',
    },
    {
      name: 'Sharma',
      rollno: '16',
      ERPno: '123456789',
    },
    {
      name: 'Akash',
      rollno: '17',
      ERPno: '123456789',
    },
  ]

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper'  style={{marginLeft:'-10px'}}>
          <CommonBreadcrumbs componentName='Attendance' />
      </div>
      <Grid container direction='row' className={classes.root} spacing={3}>
        <Grid item md={3}  xs={12}>
          <MobileDatepicker
          // style={{ width: '100%' }}
            onChange={(date) => handleEndDateChange(date)}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
          />
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
      </Grid>
      <Grid container direction='row'>
        <StyledClearButton
          variant='contained'
          startIcon={<ClearIcon />}
        >
          Clear all
        </StyledClearButton>

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
     
      <br />
      <br />
      <MediaQuery minWidth={541}>
        <Grid container direction='row' className={classes.root} spacing={2}>
          {/* <Grid item md={1}></Grid> */}

          <Grid item sm={2} md={3}>
            <Typography color='primary'>{startDate && startDate} to {endDate && endDate} </Typography>
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
          <Grid item sm={1} md={1}>
            <img src={line} className={classes.lines} />
          </Grid>
          <Grid item xs={8} sm={2} md={2} lg={2}>
            <Typography variant='subtitle2' color='secondary'>
              Number of students: {result && result.length || 0}
            </Typography>
          </Grid>
          {/* <Grid item xs={8} sm={2} md={2} lg={2}>
            <Button>Download Excel</Button>
          </Grid> */}
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={540}>
        <Grid container direction='row'>
          {/* <Grid item md={1}></Grid> */}
        </Grid>
      </MediaQuery>
      <Grid container direction='row'>
        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>
        <br />
      </Grid>
      <Grid container spacing={2} direction='row'>
        {result && result
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
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card className={classes.bord} onClick={()=>handleSinlgeStudent(item.id)} style={{cursor:'pointer'}}>
                <CardMedia className={classes.cover} />
                <div>
                  <CardContent>
                    <Grid container direction='row'>
                      <Grid item xs={1} sm={1} md={1} lg={1} style={{ marginTop: 15 }}>
                        <Avatar>{item.student_first_name.slice(0, 1)}</Avatar>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{ marginLeft: 30, textAlign: 'start' }}
                      >
                        <Typography>{item.student_first_name.slice(0, 6) || ""}</Typography>
                        <Typography>{item.student}</Typography>
                      </Grid>
                      <p class='box'>
                        <span class='content1'>1st</span>
                        <span class='content'>2nd</span>
                      </p>
                    </Grid>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <br />

      <Grid container justify='center'>
        {' '}
        {
          result && <Pagination count={totalPages} page={activePage} onChange={handlePageChange} color='secondary' />

        }
      </Grid>
    </Layout>
  );
};

export default Attend;