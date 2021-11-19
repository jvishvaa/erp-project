import React, { useEffect, useState, useContext } from 'react';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';
import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
// import MobileDatepicker from './mobile-datepicker';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';

import {
    IconButton,
  } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';


import 'react-calendar/dist/Calendar.css';
import TimeRange from 'react-time-range';
import moment from 'moment';
import Layout from 'containers/Layout';
import Divider from '@material-ui/core/Divider';
// import MomentUtils from '@date-io/moment';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';

import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { addDays } from 'date-fns';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Breadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import '../Calendar/Styles.css';
import { setModulePermissionsRequestData } from 'redux/actions';
import LineAtt from '../../assets/images/LineAtt.svg';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { dateFormat } from 'highcharts';
import { useHistory } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { size } from 'lodash';
import { id } from 'date-fns/locale';
import './AttendanceCalender.scss';
function getDaysAfter(date, amount) {
  return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
}
function getDaysBefore(date, amount) {
  return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
}

const HolidayMark = () => {
  const [allDay, setAllDay] = useState(true);
  const [firstHalf, setFirstHalf] = useState(false);
  const [secondHalf, setSecondHalf] = useState(false);
  const [isconfirm, setIsConfirm] = useState(false);
  const [valuetime, onChange] = useState('10:00');
  const [state, setState] = useState();
  const [time, setTime] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [DateEnd, setDateEnd] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [evnetcategoryType, setEventcategoryType] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);

  const [ holidayName , setHolidayName ] = useState('')
  const [ holidayDesc , setHolidayDesc ] = useState('')

  const [minStartDate, setMinStartDate] = useState();
  const [maxStartDate, setMaxStartDate] = useState();
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(1);
  const [discripValue, setdiscripValue] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  const handleStartTimeChange = (start_time) => {
    const time = start_time.toString().slice(16, 21);
    setSelectedStartTime(start_time);
    setStartTime(time);
  };
  const handleEndTimeChange = (end_time) => {
    // let x=date._d
    // console.log(x.split(" "))
    setSelectedEndTime(end_time);
    setEndTime(end_time.toString().slice(16, 21));
  };
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
    button: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '40%',
    },
  }));



 
  const handleChangeHoliday = (event) => {
    setHolidayName(event.target.value)
  };
  const handleChangeHolidayDesc = (event) => {
    setHolidayDesc(event.target.value)
  };

  const handleBranch = (event = {}, value = []) => {
    setSelectedBranch([]);
    setGradeList([]);
    if (value?.length) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.branch?.id);
      setSelectedBranch(ids);
      callApi(
        `${endpoints.academics.grades}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
        'gradeList'
      );
    }
  };

  const handleGrade = (event = {}, value = []) => {
    setSelectedGrade([]);
    if (value?.length) {
      value =
        value.filter(({ grade_id }) => grade_id === 'all').length === 1
          ? [...gradeList].filter(({ grade_id }) => grade_id !== 'all')
          : value;
      const ids = value.map((el) => el) || [];
      const selectedId = value.map((el) => el?.grade_id) || [];
      const branchId = selectedBranch.map((el) => el?.branch?.id) || [];
      setSelectedGrade(ids);
     
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
   

  console.log(moment(startDateTechPer).format(
    'YYYY-MM-DD'
  ) , "dates submot");


    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    if (!holidayName) {
        setAlert('warning', 'Enter Holiday Name');
        return;
      }
      if (!holidayDesc) {
        setAlert('warning', 'Enter Holiday Description');
        return;
      }
    if (selectedBranch.length == 0) {
      setAlert('warning', 'Select Branch');
      return;
    }

    if (isEdit) {

        axiosInstance
      .put(endpoints.academics.getHoliday, {
        title: holidayName,
        description: holidayDesc,
        holiday_start_date: moment(startDateTechPer).format(
            'YYYY-MM-DD'
          ),
          holiday_end_date: moment(endDateTechPer).format(
            'YYYY-MM-DD'
          ),
        branch: selectedBranch.map(
            (el) => el?.branch?.id
          ),
        grade: selectedGrade.map(
            (el) => el?.grade_id
          ),
          holiday_id: history?.location?.state?.data?.id
      })
      .then((result) => {
        setAlert('success', result.data.message);
        handleBackButtonClick()
        
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'something went wrong');
        console.log(error);
      });

    } else {

    
    axiosInstance
      .post(endpoints.academics.getHoliday, {
        title: holidayName,
        description: holidayDesc,
        holiday_start_date: startDateTechPer.format(
            'YYYY-MM-DD'
          ),
          holiday_end_date: endDateTechPer.format(
            'YYYY-MM-DD'
          ),
        branch: selectedBranch.map(
            (el) => el?.branch?.id
          ),
        grade: selectedGrade.map(
            (el) => el?.grade_id
          ),
      })
      .then((result) => {
        setAlert('success', result.data.message);
        handleBackButtonClick()
        
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'something went wrong');
        console.log(error);
      });
    }
  };
  const handleBackButtonClick = (e) => {
    const payload = {
      academic_year_id: history?.location?.state?.payload?.academic_year_id,
      branch_id: history?.location?.state?.payload?.branch_id,
      grade_id: history?.location?.state?.payload?.grade_id,
      section_id: history?.location?.state?.payload?.section_id,
      startDate: history?.location?.state?.payload?.startDate,
      endDate: history?.location?.state?.payload?.endDate,
      counter: history?.location?.state?.payload?.counter,
    };
    history.push({
      pathname: '/attendance-calendar/teacher-view',
      state: {
        payload: payload,
        backButtonStatus: true,
      },
    });
  };

  const styles = {
    crossButton: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: 0,
    },
  };

  const classes = useStyles();
  const [academicYear, setAcademicYear] = useState([]);
  // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([]);
  const [eventType, seteventType] = useState();
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [ isEdit , setIsEdit] = useState(false);



  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || []);
            const defaultValue=result?.data?.data?.[0];
            handleAcademicYear({},defaultValue);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || []);
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            console.log(result?.data?.data || []);
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            console.log(result?.data?.data || []);
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
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Calendar & Attendance' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Calendar') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);
  console.log(moduleId, 'MODULE_ID');

  useEffect(() => {
    // callApi(
    //   `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
    //   'academicYearList'
    // );
    callApi(
      `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
      'branchList'
    );

    axiosInstance.get(endpoints.CreateEvent.getEventCategory).then((res) => {
      setEventcategoryType(res?.data);
    });
  }, [ moduleId]);

  useEffect(() => {
    console.log(history , "his");
      const branchIds = [];
    //   const i;
    if(history?.location?.state?.data){
        setIsEdit(true)
        console.log(history?.location?.state?.data?.branch?.length,"data");
        setHolidayDesc(history?.location?.state?.data?.description)
        setHolidayName(history?.location?.state?.data?.title)
        handleGrade(history?.location?.state?.data?.grade)
        setDateRangeTechPer([moment(history?.location?.state?.data?.holiday_start_date).format('MM/DD/YYYY') , moment(history?.location?.state?.data?.holiday_end_date).format('MM/DD/YYYY')])
        // handleBranch(history?.location?.state?.data?.branch)

       if(history?.location?.state?.data?.branch?.length) {
      const ids = history?.location?.state?.data?.branch.map((el , index) => el);
    //   branchIds.push(ids)
     let filterBranch = branchList.filter((item) => ids.indexOf(item.branch.id) !== -1)
      setSelectedBranch(filterBranch)
      if (moduleId){
      callApi(
        `${endpoints.academics.grades}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${history?.location?.state?.data?.branch}&module_id=${moduleId}`,
        'gradeList'
      );
      }
       }
       if(history?.location?.state?.data?.grade?.length && gradeList !== [] ) {
        const ids = history?.location?.state?.data?.grade.map((el , index) => el);
      //   branchIds.push(ids)
       let filterBranch = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1)
        setSelectedGrade(filterBranch)
         }
       

    }
  },[branchList ] )

  useEffect(() => {
    if(history?.location?.state?.data?.grade?.length) {
      const ids = history?.location?.state?.data?.grade.map((el , index) => el);
    //   branchIds.push(ids)
     let filterBranch = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1)
      setSelectedGrade(filterBranch)
       }
  },[gradeList] )


  
 

  const onunHandleClearAll = (e) => {
    e.preventDefault();

    document.getElementById('outlined-multiline-static').value = '';
    document.getElementById('eventname').value = '';
    // document.getElementById("coustom-date");
  };
  const handleAcademicYear=(event,value)=>{
    
      // setSelectedAcadmeicYear(value);
      if (value) {
        callApi(
          `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
          'branchList'
        );
      }
      setSelectedGrade([]);
      setSectionList([]);
      setSelectedSection([]);
      setSelectedBranch([]);
    }
    function handleDate(v1) {
        if (v1 && v1.length !== 0) {
          setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
          setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
        }
        setDateRangeTechPer(v1);
      }

  // const handleEventTypeChange = (e, value) => {
  //   if (value) {
  //     e.preventDefault();
  //     console.log('eventttttype:', value.id);
  //   } else {
  //   }
  // };

  return (
    <>
      <Layout>
        <div className='profile_breadcrumb_wrapper'>
          <CommonBreadcrumbs componentName='Mark Holiday' 
            isAcademicYearVisible={true}
          />
        </div>
        <form>
       
       
            <Grid container direction='row' spacing={2} className={classes.root}>
        
              <Grid item md={2} xs={12}>
              <Autocomplete
                        multiple
                        style={{ width: '100%' }}
                        size='small'
                        onChange={handleBranch}
                        id='branch_id'
                        className='dropdownIcon'
                        value={selectedBranch || []}
                        options={branchList || []}
                        getOptionLabel={(option) => option?.branch?.branch_name || ''}
                        getOptionSelected={(option, value) =>
                          option?.branch?.id == value?.branch?.id
                        }
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
              <Grid item md={2} xs={12}>
              <Autocomplete
                        multiple
                        style={{ width: '100%' }}
                        size='small'
                        limitTags={2}
                        onChange={handleGrade}
                        id='grade_id'
                        className='dropdownIcon'
                        value={selectedGrade || []}
                        options={gradeList || []}
                        getOptionLabel={(option) => option?.grade__grade_name || ''}
                        getOptionSelected={(option, value) => option?.id == value?.id}
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
            
              
            </Grid>
            <Grid container direction='row'>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              spacing={2}
              className={classes.root}
              alignItems='center'
            >
              {/* <Grid item xs={12} md={2} className='arrow-1'>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    size='small'
                    variant='dialog'
                    format='YYYY-MM-DD'
                    margin='none'
                    // className='button'
                    id='date-picker'
                    label='StartDate'
                    minDate={new Date()}
                    name='start_date'
                    inputVariant='outlined'
                    // className='arrow conte'
                    onChange={handleStartDateChange}
                    // handleStartDateChange={handleStartDateChange}
                    // handleEndDateChange={handleEndDateChange}

                    value={startDate}
                    className='dropdownIcon'
                    // style={{ background: 'white', width: '50%' }}
                    // onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>


              </Grid> */}

<Grid item xs={12} sm={3} className='date-range-holiday' >
                      <LocalizationProvider dateAdapter={MomentUtils}>
                        <DateRangePicker
                          minDate={minStartDate ? new Date(minStartDate) : undefined}
                          maxDate={maxStartDate ? new Date(maxStartDate) : undefined}
                          startText='Select-date-range'
                          value={dateRangeTechPer}
                          onChange={(newValue) => {
                            console.log(newValue , "new");
                            setDateRangeTechPer(newValue);
                          }}
                          renderInput={({ inputProps, ...startProps }, endProps) => {
                            return (
                              <>
                                <TextField
                                  {...startProps}
                                  inputProps={{
                                    ...inputProps,
                                    value: `${moment(inputProps.value).format(
                                      'DD/MM/YYYY'
                                    )} - ${moment(endProps.inputProps.value).format(
                                      'DD/MM/YYYY'
                                    )}`,
                                    readOnly: true,
                                    endAdornment: (
                                      <IconButton>
                                        <DateRangeIcon
                                          style={{ width: '35px' }}
                                          color='primary'
                                        />
                                      </IconButton>
                                    ),
                                  }}
                                  size='small'
                                />
                              </>
                            );
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

              

              <Grid item md={4} lg={2} sm={6} xs={12}  >
                <TextField
                  variant='outlined'
                  size='small'
                  id='eventname'
                  label='Holiday Name'
                  value={holidayName}
                  fullWidth
                  onChange={handleChangeHoliday}
                />
              </Grid>
              
             
            </Grid>

            
          
            <Grid container direction='row'>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
            </Grid>
      
            <Grid container direction='row' className={classes.root}>



              <Grid item md={6} xs={12}>
                <TextField
                  id='outlined-multiline-static'
                  label='Add Holiday Description'
                  labelwidth='170'
                  name='description'
                  fullWidth
                  onChange={handleChangeHolidayDesc}
                  value={holidayDesc}
                  multiline
                  rows={5}
                  variant='outlined'
                />
              </Grid>
            </Grid>
            <Grid container direction='row' className={classes.root}>
              {/* <Grid item md={1} lg={1} xs={12}> */}
              <div className={classes.button}>
                <Button variant='contained' onClick={onunHandleClearAll}>
                  Clear All
                </Button>
                {/* </Grid> */}
                {/* <Grid item md={2} lg={1} xs={12}> */}
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleBackButtonClick}
                  style={{ marginLeft: '5%' }}
                >
                  Go Back
                </Button>
                {/* </Grid> */}
                {/* <Grid item md={1} lg={1} xs={12}> */}
                <Button
                  variant='contained'
                  type='submit'
                  value='Submit'
                  color='primary'
                  onClick={handleSubmit}
                >
                  Save Holiday
                </Button>
                {/* </Grid> */}
              </div>
            </Grid>
   
        </form>
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default HolidayMark;
