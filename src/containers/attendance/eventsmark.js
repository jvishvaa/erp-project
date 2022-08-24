import React, { useEffect, useState, useContext } from 'react';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';

import { IconButton } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Layout from 'containers/Layout';
import Divider from '@material-ui/core/Divider';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
// import endpoints from 'v2/config/endpoints';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import '../Calendar/Styles.css';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import './AttendanceCalender.scss';
function getDaysAfter(date, amount) {
  return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
}

const EventsMark = () => {
  const [flag,setFlag] = useState(false);
  const [evnetcategoryType, setEventcategoryType] = useState([]);
  const [selectedSession, setSelectedSession] = useState([]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);

  const [holidayName, setHolidayName] = useState('');
  const [holidayDesc, setHolidayDesc] = useState('');
  const [minStartDate, setMinStartDate] = useState();
  const [maxStartDate, setMaxStartDate] = useState();
  const [eventIdSave, setEventIdSave] = useState('')
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

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
    // width: '20%',
    },
  }));

  const handleChangeHoliday = (event) => {
    setHolidayName(event.target.value);
  };
  const handleChangeHolidayDesc = (event) => {
    setHolidayDesc(event.target.value);
  };

  const handleBranch = (event = {}, value = []) => {
    setFlag(true);
    setSelectedBranch([]);
    setGradeList([]);
    if (value?.length) {
      value = value.filter(({id}) => id === 'all').length === 1 
      ? [...branchList].filter(({id}) => id !== 'all') : value;
      const ids = value.map((el) => el);
      const selectedSession = value.map((el) => el?.acadSession);
      setSelectedSession(selectedSession);
      const selectedId = value.map((el) => el?.id);
      setSelectedBranch(ids);
      callApi(
        `${endpoints.academics.grades}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
        'gradeList'
      );
    }
    if (value?.length === 0) {      
      setSelectedGrade([]);
      setGradeList([]);
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
      setSelectedGrade(ids);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;

    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    if (!holidayName) {
      setAlert('warning', 'Enter Events Name');
      return;
    }
    if (!holidayDesc) {
      setAlert('warning', 'Enter Events Description');
      return;
    }
    if (selectedBranch.length == 0) {
      setAlert('warning', 'Select Branch');
      return;
    }

    if (isEdit) {
      const startDate = new Date(startDateTechPer)
      const endDate = new Date(endDateTechPer)
      axiosInstance
        .patch(`${endpoints.academics.getEvents}?id=${eventIdSave}`, {
          event_name: holidayName,
          description:holidayDesc,
          start_date: moment(startDate).format('YYYY-MM-DD'),
          end_date: moment(endDate).format('YYYY-MM-DD'),
          is_full_day: false,
          grade_ids: selectedGrade.map((el) => el?.grade_id),
          // academic_year: selectedAcademicYear?.id,
          // branch_ids: selectedBranch.map((el) => el?.id),
          acad_session: selectedSession,
          start_time: "00:01",
          end_time: "23:59",
        })
        .then((result) => {
          setAlert('success', result.data.message);
          handleBackButtonClick();
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'something went wrong');
        });
    } else {
      axiosInstance
        .post(endpoints.academics.getEvents, {
          event_name: holidayName,
          description:holidayDesc,
          start_date: startDateTechPer.format('YYYY-MM-DD'),
          end_date: endDateTechPer.format('YYYY-MM-DD'),
          is_full_day: false,
          grade_ids: selectedGrade.map((el) => el?.grade_id),
          // academic_year: selectedAcademicYear?.id,
          acad_session: selectedSession,
          // branch_ids: selectedBranch.map((el) => el?.id),
          start_time: "00:01",
          end_time: "23:59",
        })

        .then((result) => {
          setAlert('success', result.data.message);
          handleBackButtonClick();
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'something went wrong');
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

  const classes = useStyles();
  const [academicYear, setAcademicYear] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            const defaultValue = result?.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
           
            if(result?.data?.data?.length !== 0){
              const transformedData = result?.data?.data?.results?.map((obj) => ({
                id: obj?.branch?.id,
                branch_name: obj?.branch?.branch_name,
                acadSession : obj?.id,
              }));
              transformedData.unshift({
                branch_name: 'Select All',
                id: 'all',
                acadSession : 'Acad session'
              });
              // setBranchList(result?.data?.data?.results || []);
              setBranchList(transformedData);

            }
          }
          if (key === 'gradeList') {            
            const transformedData = result?.data?.data?.map((obj) => ({
              grade_id: obj?.grade_id,
              grade__grade_name : obj?.grade__grade_name,
              acadSession : obj?.id,
            }));
            transformedData.unshift({
              grade__grade_name : 'Select All',
              grade_id: 'all',
              acadSession : 'Acad session'
            });
            // setBranchList(result?.data?.data?.results || []);
            setGradeList(transformedData);
            // setGradeList(result.data.data || []);
          }
          if (key === 'section') {
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
  useEffect(() => {
    callApi(
      `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
      'branchList'
    );

    axiosInstance.get(endpoints.CreateEvent.getEventCategory).then((res) => {
      setEventcategoryType(res?.data);
    });
  }, [moduleId]);

  useEffect(() => {
    if (history?.location?.state?.data) {
      setIsEdit(true);
      setHolidayDesc(history?.location?.state?.data?.description);
      setHolidayName(history?.location?.state?.data?.event_name);
      handleGrade(history?.location?.state?.data?.grades);
      setDateRangeTechPer([
        moment(history?.location?.state?.data?.start_time).format('MM/DD/YYYY'),
        moment(history?.location?.state?.data?.end_time).format('MM/DD/YYYY'),
      ]);

      // if (history?.location?.state?.data?.branch?.length) {
      //   const ids = history?.location?.state?.data?.branch.map((el, index) => el);

      //   let filterBranch = branchList.filter(
      //     (item) => ids.indexOf(item?.id) !== -1
      //   );
      //   setSelectedBranch(filterBranch);
      //   if (moduleId) {
      //     callApi(
      //       `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${history?.location?.state?.data?.branch}&module_id=${moduleId}`,
      //       'gradeList'
      //     );
      //   }
      // }
      // if (history?.location?.state?.data?.grade?.length && gradeList !== []) {
      //   const ids = history?.location?.state?.data?.grade.map((el, index) => el);

      //   let filterBranch = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1);
      //   setSelectedGrade(filterBranch);
      // }
      // if (history?.location?.state?.data?.grades?.length) {
      //   const ids = history?.location?.state?.data?.grades.map((el,index) => el);

      //   let filterBranch = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1);
      //   setSelectedGrade(filterBranch);
      // }
    }
  }, [branchList]);

  useEffect(() => {
      if(flag == false){
        if(isEdit && branchList.length >0 ){
          const gradeId = history?.location?.state?.gradeId;
          let filterGrade = gradeList.filter((item) => gradeId.indexOf(item?.grade_id) !== -1);
          setSelectedGrade(filterGrade);
  
      }

      }

  },[gradeList])

  const isEdited = history?.location?.state?.isEdit;

  useEffect(() => {
    if (isEdited && branchList.length > 0) {
      gradeEdit();
    }
  }, [isEdited, branchList]);

  const gradeEdit = () => {
    setEventIdSave(history?.location?.state?.data?.id)
    const acadId = history?.location?.state?.data?.acad_session;
    
    let filterBranch = branchList.filter((item) => acadId.indexOf(item?.acadSession) !== -1);
    const selectedSession = filterBranch.map((el) => el?.acadSession)
    setSelectedSession(selectedSession)
    setSelectedBranch(filterBranch);

    const allBranchIds = filterBranch.map((i) => {
      return i?.id;
    });
    callApi(
      `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${allBranchIds}&module_id=${moduleId}`,
      'gradeList'
    );
    // const gradeId = history?.location?.state?.gradeId;
    // const gradeId = history?.location?.state?.payload?.grade_id?.grade_id;
    // let filterGrade = gradeList.filter((item) => gradeId.indexOf(item.id) !== -1);
  };

  // useEffect(() => {
  //   if (history?.location?.state?.data?.section_mapping_data) {
  //     const ids = history?.location?.state?.data?.section_mapping_data.map((el, index) => el?.grade_id);
  //     let filterBranch = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1);
  //     setSelectedGrade(filterBranch);
  //   }
  // }, [gradeList]);

  const onunHandleClearAll = (e) => {
    setSelectedBranch();
    setSelectedGrade();
    setHolidayName('');
    setHolidayDesc('');
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
  };
  const handleAcademicYear = (event, value) => {
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
  };

  return (
    <>
      <Layout>
        <div className='profile_breadcrumb_wrapper'>
          <CommonBreadcrumbs  componentName='Add Events' isAcademicYearVisible={true} />
        </div>
        <form>
          <Grid container direction='row' spacing={2} className={classes.root}>
            <Grid item md={2} xs={12}>
              <Autocomplete
                multiple
                limitTags={2}
                style={{ width: '90%' }}
                size='small'
                onChange={handleBranch}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || []}
                options={branchList || []}
                getOptionLabel={(option) => option?.branch_name || ''}
                getOptionSelected={(option, value) =>
                  option?.id == value?.id
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
                getOptionSelected={(option, value) => option?.grade_id == value?.grade_id}
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
            <Grid item md={12} xs={12} style={{marginLeft:'26px', width:'96%'}}>
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
            <Grid item xs={12} sm={2} className='date-range-holiday'>
              <LocalizationProvider dateAdapter={MomentUtils}>
                <DateRangePicker
                  minDate={minStartDate ? new Date(minStartDate) : undefined}
                  maxDate={maxStartDate ? new Date(maxStartDate) : undefined}
                  startText='Select-date-range'
                  value={dateRangeTechPer}
                  onChange={(newValue) => {                  
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

            <Grid item md={4} lg={2} sm={3} xs={12}>
              <TextField
                variant='outlined'
                size='small'
                id='eventname'
                label='Events Name'
                value={holidayName}
                fullWidth
                onChange={handleChangeHoliday}
                inputProps={{
                  maxLength: 25,
                }}
              />
            </Grid>
          </Grid>

          <Grid container direction='row'>
            <Grid item md={12} xs={12} style={{marginLeft:'26px', width:'96%'}}>
              <Divider />
            </Grid>
          </Grid>

          <Grid container direction='row' className={classes.root}>
            <Grid item md={6} xs={12}>
              <TextField
                id='outlined-multiline-static'
                label='Add Events Description'
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
            <div className={classes.button}>
              <Button style={{margin: '5px'}} variant='contained' onClick={onunHandleClearAll}>
                Clear All
              </Button>
              <Button
              style={{margin:'5px '}}
                variant='contained'
                color='primary'
                onClick={handleBackButtonClick}
              >
                Go Back
              </Button>
              <Button
               style={{margin: '5px'}}
                variant='contained'
                type='submit'
                value='Submit'
                color='primary'
                onClick={handleSubmit}
              >
                Save Events
              </Button>
            </div>
          </Grid>
        </form>
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default EventsMark;
