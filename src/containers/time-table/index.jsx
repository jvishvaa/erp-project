import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Layout/index';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from '../../components/loader/loader';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FilterImage from '../../assets/images/Filter_Icon.svg';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import UpperGrade from './uppergrade/upper-grade.jsx';
import DateAndCalander from './date-and-calander/date-and-calander.jsx';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../config/axios';
import { useLocation } from 'react-router-dom';
import { UserProvider } from './tableContext/userContext';
import TextField from '@material-ui/core/TextField';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import TimeTableMobile from './time-table-mobile-view/time-table-mobile';
import FilterMobile from './filterMobile/filterMobile';
import './timetable.scss';
const useStyles = makeStyles(() => ({
  formTextFields: {
    margin: '8px',
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const TimeTable = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const themeContext = useTheme();
  // const setMobileView  = !useMediaQuery(themeContext.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const setMobileView = useMediaQuery('(min-width:400px)');
  const [tableData, setTableData] = useState([]);
  const [Filter, setFilter] = useState(true);
  const [acadamicYearID, setAcadamicYear] = useState();
  const [gradeID, setGradeID] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const location = useLocation();
  const [sectionID, setSectionID] = useState();
  const [branchID, setBranchID] = useState();
  const [endTime, setEndTime] = useState(new Date('2014-08-18T00:00:00'));
  const [periodDescription, setPeriodDescription] = useState();
  const [periodName, setPeriodName] = useState();
  const [requiredMaterial, setRequiredMaterial] = useState();

  const [startTime, setStartTime] = useState(new Date('2014-08-18T00:00:00'));
  const [days, setDays] = useState([]);
  const [assignedTeacherID, setAssignedTeacherID] = useState();
  const [academicYear, setAcadamicYearName] = useState();
  const [gradeName, setGradeName] = useState();
  const [sectionIdOption, setSectionIdOption] = useState(null);
  const [branchName, setBranchName] = useState();
  const [loopMax, setLoopMax] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [assignedTeacher, setAssignedTeacher] = useState();
  const [lengthMonday, setLengthMonday] = useState();
  const [lengthTuesday, setLengthTuesday] = useState();
  const [lengthWednesday, setLengthWednesday] = useState();
  const [lengthThursday, setLengthThursday] = useState();
  const [lengthFriday, setLengthFriday] = useState();
  const [maxLength, setMaxLength] = useState();
  const [moduleId, setModuleId] = useState();
  const [sectinName, setSectionName] = useState();
  const [subject, setSubject] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [teacherView, setTeacherView] = useState(false);
  const [openCloseTable, setOpenCloseTable] = useState(false);
  const [ids, setIDS] = useState(false);
  const [openNewPeriod, setOpenNewPeriod] = useState(false);
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Time Table' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              location.pathname === '/time-table/student-view' &&
              item.child_name === 'Student Time Table'
            ) {
              setModuleId(item?.child_id);
              setTeacherView(false);
              setOpenCloseTable(false);
            } else if (
              location.pathname === '/time-table/teacher-view' &&
              item.child_name === 'Teacher Time Table'
            ) {
              setModuleId(item?.child_id);
              setTeacherView(true);
              setOpenCloseTable(false);
            }
          });
        }
      });
    }
  }, [location.pathname]);
  useEffect(() => {
    if (openCloseTable) {
      callGetTimeTableAPI();
    } else {
      setIDS(true);
    }
  }, [branchID]);
  const handleChangeMultipleDays = (event, value) => {
    if (value?.length) {
      setDays(value);
    }
    console.log(days, 'selected days');
  };
  const handlePassOpenNewPeriod = () => {
    console.log('openNewPeriod');
    setOpenNewPeriod(true);
  };
  const callGetTimeTableAPI = async () => {
    setLoading(true);
    await axiosInstance
      .get('/academic/time_table/', {
        params: {
          academic_year_id: acadamicYearID,
          branch_id: branchID,
          grade_id: gradeID,
          section_id: sectionID,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (tableData) {
            setLoading(false);
          }
          console.log('calculateLength();');
          calculateLength();
          setTableData(response.data.result);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const handlePassData = (
    acadamicYear_ID,
    grade_ID,
    section_ID,
    branch_ID,
    academic_Year,
    grade_Name,
    branch_Name,
    sectin_Name
  ) => {
    callingSubjectAPI();
    callingTeachersAPI();
    setAcadamicYear(Number(acadamicYear_ID));
    setGradeID(Number(grade_ID));
    setBranchID(Number(branch_ID));
    setSectionID(Number(section_ID));
    setGradeName(grade_Name);
    setAcadamicYearName(academic_Year);
    setBranchName(branch_Name);
    setSectionName(sectin_Name);
    setIDS({
      ...ids,
      academic_year_id: acadamicYear_ID,
      branch_id: grade_ID,
      grade_id: grade_ID,
      section_id: section_ID,
    });
  };
  const calculateLength = () => {
    if (tableData.Monday) {
      let lengthData = tableData.Monday.length;
      if (lengthData > 6) {
        setLengthMonday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Tuesday) {
      let lengthData = tableData.Tuesday.length;
      if (lengthData > 6) {
        setLengthTuesday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Wednesday) {
      let lengthData = tableData.Wednesday.length;
      if (lengthData > 6) {
        setLengthWednesday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Thursday) {
      let lengthData = tableData.Thursday.length;
      if (lengthData > 6) {
        setLengthThursday(lengthData);
      }
      console.log(lengthData);
    }
    if (tableData.Friday) {
      let lengthData = tableData.Friday.length;
      if (lengthData > 6) {
        setLengthFriday(lengthData);
      }
      console.log(lengthData);
    }
    // if(monday)
    let arrayLength = [
      lengthMonday,
      lengthTuesday,
      lengthWednesday,
      lengthThursday,
      lengthFriday,
    ];
    let sortedArray = arrayLength.sort();
    setMaxLength(lengthMonday);
    console.log(sortedArray, 'sorted array');
    console.log(maxLength, 'max length');
    let mappingArray = Array.from(Array(maxLength).keys());
    if (maxLength > 6) {
      setLoopMax(mappingArray);
    }
  };
  const handleDateEndTimeChange = (time) => {
    // let dataTime = time.toString().slice(16, 21)
    setEndTime(time);
  };
  const handleDateStartTimeChange = (time) => {
    // let dataTime = time.toString().slice(16, 21)
    setStartTime(time);
  };
  const handleClickAPI = () => {
    callGetTimeTableAPI();
  };
  const handleFilter = (value) => {
    setFilter(value);
  };
  const handleCloseTable = (value) => {
    setOpenCloseTable(value);

    if (!value) {
      setGradeName(null);
      setAcadamicYearName(null);
      setBranchName(null);
      setSectionName(null);
    }
  };
  const handleCloseNewPeriod = () => {
    setOpenNewPeriod(false);
  };
  const callingSubjectAPI = () => {
    axiosInstance
      .get('/erp_user/subjects-list/', {
        params: {
          grade: gradeID,
        },
      })
      .then((res) => {
        setSubject(res.data.data.results);
      })
      .catch((error) => {
        setAlert('error', "can't fetch subjects");
      });
  };
  const callingTeachersAPI = () => {
    axiosInstance
      .get('/academic/teachers-list/', {
        params: {
          grade: gradeID,
        },
      })
      .then((res) => {
        setAssignedTeacher(res.data.result);
      })
      .catch((error) => {
        setAlert('error', "can't fetch teachers list");
      });
  };
  const createPeriodAPI = () => {
    if (sectionIdOption === null) {
      setAlert('Warning', 'Please Add Subjects');
    }
    if (periodName.trim().length >= 10) {
      setAlert('Warning', 'Please Reduce Period Name Size');
    } else {
      let obj = {
        academic_year: acadamicYearID,
        section: sectionID,
        branch: branchID,
        grade: gradeID,
        subject: sectionIdOption,
        assigned_teacher: assignedTeacherID,
        // days: day,
        days: days,
        period_name: periodName,
        period_description: periodDescription,
        period_start_time: startTime.toString().slice(16, 21),
        period_end_time: endTime.toString().slice(16, 21),
        required_material: requiredMaterial,
      };
      axiosInstance
        .post('/academic/assign_multiple_class_periods/', obj)
        .then((response) => {
          if (response.status === 200) {
            setAlert('success', 'Period Added');
            handleCloseNewPeriod();
            callGetTimeTableAPI();
          }
        })
        .catch((error) => {
          setAlert('error', 'please fill all fields or change time range');
        });
    }
  };
  return (
    <>
      <Layout>
        {setMobileView ? (
          <>
            <Dialog
              open={openNewPeriod}
              onClose={handleCloseNewPeriod}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='add-new-dialog-title'>{'Add New Period'}</DialogTitle>
              <div className='dialog-data-container'>
                <div className={classes.formTextFields}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={subject}
                    getOptionLabel={(option) => option?.subject_name}
                    style={{ width: 250 }}
                    onChange={(event, option) => setSectionIdOption(option?.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        fullWidth
                        label='Subject'
                        variant='outlined'
                      />
                    )}
                  />
                </div>
                <div className={classes.formTextFields}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={assignedTeacher}
                    getOptionLabel={(option) => option?.name}
                    style={{ width: 250 }}
                    onChange={(event, option) => setAssignedTeacherID(option?.user_id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        fullWidth
                        label='Assigned Teacher'
                        variant='outlined'
                      />
                    )}
                  />
                </div>
                <div className={classes.formTextFields}>
                  <TextField
                    label='Required materials'
                    id='outlined-size-small'
                    variant='outlined'
                    size='small'
                    onChange={(e) => setRequiredMaterial(e.target.value)}
                  />
                </div>
                <div className={classes.formTextFields}>
                  <TextField
                    label='Period Name'
                    id='outlined-size-small'
                    variant='outlined'
                    size='small'
                    onChange={(e) => setPeriodName(e.target.value)}
                  />
                </div>
                <div className={classes.formTextFields}>
                  <TextField
                    label='Period Description'
                    id='outlined-size-small'
                    variant='outlined'
                    size='small'
                    onChange={(e) => setPeriodDescription(e.target.value)}
                  />
                </div>

                <FormControl
                  variant='outlined'
                  size='small'
                  id='select-day'
                  className={classes.formTextFields}
                >
                  <InputLabel id='demo-mutiple-chip-label'>Day</InputLabel>

                  {/* <Select
                    labelId='demo-mutiple-chip-label'
                    id='demo-mutiple-chip'
                    variant='outlined'
                    multiple
                    value={days}
                    onChange={handleChangeMultipleDays}
                    input={<Input id='select-multiple-chip' />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} className={classes.chip} />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {dayNames.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(dayNames, days, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <div style={{ width: '255px' }}>
                    <Autocomplete
                      multiple
                      size='small'
                      onChange={handleChangeMultipleDays}
                      style={{ width: '100%' }}
                      id='day'
                      options={dayNames || []}
                      value={days || []}
                      getOptionLabel={(option) => option || ''}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField {...params} variant='outlined' label='Days' />
                      )}
                    />
                  </div>
                </FormControl>

                <div className={classes.formTextFields} style={{ width: '43%' }}>
                  <MuiPickersUtilsProvider
                    variant='outlined'
                    fullWidth
                    utils={DateFnsUtils}
                  >
                    <KeyboardTimePicker
                      margin='normal'
                      id='time-picker'
                      variant='outlined'
                      label='Start Time'
                      fullWidth
                      ampm={false}
                      helperText='24-hour format'
                      value={startTime}
                      onChange={handleDateStartTimeChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className={classes.formTextFields} style={{ width: '43%' }}>
                  <MuiPickersUtilsProvider
                    variant='outlined'
                    fullWidth
                    utils={DateFnsUtils}
                  >
                    <KeyboardTimePicker
                      margin='normal'
                      id='time-picker'
                      variant='outlined'
                      label='End Time'
                      fullWidth
                      ampm={false}
                      helperText='24-hour format'
                      value={endTime}
                      onChange={handleDateEndTimeChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <DialogActions>
                <Button onClick={handleCloseNewPeriod} color='primary'>
                  Close
                </Button>
                <Button onClick={createPeriodAPI} color='primary' autoFocus>
                  Create
                </Button>
              </DialogActions>
            </Dialog>
            <div className='time-table-container'>
              <div className='time-table-breadcrums-container'>
                <CommonBreadcrumbs componentName='Time Table' />
                <div
                  className={Filter ? 'filter-container-hidden' : 'filter-container-show'}
                  onClick={() => {
                    handleFilter(true);
                  }}
                >
                  <div className='table-top-header'>
                    <div className='table-header-data'>{academicYear}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{branchName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{gradeName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{sectinName}</div>
                  </div>
                  <div className='filter-show'>
                    <div className='filter'>SHOW FILTER</div>
                    <img className='filterImage' src={FilterImage} />
                  </div>
                </div>
              </div>
              {Filter ? (
                <>
                  <UpperGrade
                    moduleId={moduleId}
                    teacherView={teacherView}
                    handleCloseTable={handleCloseTable}
                    handlePassData={handlePassData}
                    handleClickAPI={handleClickAPI}
                    handlePassOpenNewPeriod={handlePassOpenNewPeriod}
                  />
                  <div
                    className='filter-container'
                    onClick={() => {
                      handleFilter(false);
                    }}
                  >
                    <div className='filter'>HIDE FILTER</div>
                    <img src={FilterImage} />
                  </div>
                  <div className='devider-top'>
                    <Divider variant='middle' />
                  </div>
                  <div className='table-top-header'>
                    <div className='table-header-data'>{academicYear}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{branchName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{gradeName}</div>
                    <span class='dot'></span>
                    <div className='table-header-data'>{sectinName}</div>
                  </div>
                </>
              ) : (
                <> </>
              )}

              <div className='date-container'>
                {openCloseTable ? (
                  <UserProvider value={ids}>
                    <DateAndCalander
                      handleCloseNewPeriod={handleCloseNewPeriod}
                      openNewPeriod={openNewPeriod}
                      passId={ids}
                      section_ID={sectionID}
                      grade_ID={gradeID}
                      branch_ID={branchID}
                      acadamicYear_ID={acadamicYearID}
                      teacherView={teacherView}
                      handlePassData={handlePassData}
                      callGetAPI={callGetTimeTableAPI}
                      tableData={tableData}
                    />
                  </UserProvider>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className='mobile-table-view'>
            <div className='time-table-breadcrums-container'>
              <CommonBreadcrumbs componentName='Time Table' />
            </div>
            {/* <FilterMobile
              moduleId={moduleId}
              handleCloseTable={handleCloseTable}
              handlePassData={handlePassData}
              handleClickAPI={handleClickAPI}
            /> */}
            <TimeTableMobile
              teacherView={teacherView}
              callGetAPI={callGetTimeTableAPI}
              tableData={tableData}
            />
          </div>
        )}
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default TimeTable;
