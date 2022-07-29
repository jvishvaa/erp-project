import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Layout/index';
import { Button, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from '../../components/loader/loader';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { getPeriodTypes, createPeriod } from './date-and-calander/apis';
import NoFilterData from 'components/noFilteredData/noFilterData';
import clsx from 'clsx';
import './timetable.scss';
import Filters from './uppergrade/Filters';
import { filter } from 'lodash';

const useStyles = makeStyles((theme) => ({
  formTextFields: {
    margin: '8px',
  },
  filter: {
    color: theme.palette.secondary.main,
    fontSize: '11px',
    fontWeight: 600,
    marginRight: '4px',
    cursor: 'pointer',
  },
  leftmarign: {
    marginLeft: '40px',
  },
  periodDialog: {
    padding: '0px 15px',
  },
  action: {
    paddingRight: '20px',
  },
}));

const dayNames = [
  { name: 'Sunday', id: 6 },
  { name: 'Monday', id: 0 },
  { name: 'Tuesday', id: 1 },
  { name: 'Wednesday', id: 2 },
  { name: 'Thursday', id: 3 },
  { name: 'Friday', id: 4 },
  { name: 'Saturday', id: 5 },
];

const TimeTable = (props) => {
  const classes = useStyles();
  // const theme = useTheme();
  // const themeContext = useTheme();
  // const setMobileView  = !useMediaQuery(themeContext.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const setMobileView = useMediaQuery('(min-width:650px)');
  const [Filter, setFilter] = useState(true);
  const [acadamicYearID, setAcadamicYear] = useState();
  const [gradeID, setGradeID] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const location = useLocation();
  const [sectionID, setSectionID] = useState();
  const [branchID, setBranchID] = useState();
  const [section_mappingId, setSectionMappingId] = useState();
  const [days, setDays] = useState([]);
  const [assignedTeacherID, setAssignedTeacherID] = useState();
  const [academicYear, setAcadamicYearName] = useState();
  const [gradeName, setGradeName] = useState();
  const [sectionIdOption, setSectionIdOption] = useState(null);
  const [branchName, setBranchName] = useState();
  const [assignedTeacher, setAssignedTeacher] = useState();
  const [ttID, setTTId] = useState();
  const [moduleId, setModuleId] = useState();
  const [sectinName, setSectionName] = useState();
  const [subject, setSubject] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [teacherView, setTeacherView] = useState(false);
  const [openCloseTable, setOpenCloseTable] = useState(false);
  const [ids, setIDS] = useState(false);
  const [openNewPeriod, setOpenNewPeriod] = useState(false);
  const [lectureList, setLectureList] = useState();
  const [selectedStartTime, setselectedStartTime] = useState(new Date('0'));
  const [selectedEndTime, setselectedEndTime] = useState(new Date('0'));
  const [periodTypeId, setperiodTypeId] = useState();
  const [getTTFlag, setGetTTFlag] = useState(false);
  const [isTimeTable, setIsTimeTable] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [periodType, setPeriodType] = useState();
  const sessionYear = JSON.parse(sessionStorage.getItem('acad_session'));
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
              location.pathname === '/timetable/studentview' &&
              item.child_name === 'Student Time Table'
            ) {
              setModuleId(item?.child_id);
              setTeacherView(false);
              setOpenCloseTable(false);
            } else if (
              location.pathname === '/timetable/teacherview' &&
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
      // callGetTimeTableAPI();
    } else {
      setIDS(true);
    }
  }, [branchID]);

  const calendarBtnHideFix = () => {
    setTimeout(() => {
      document
        .querySelectorAll('.MuiPickersModal-dialogRoot .MuiDialogActions-root button')
        .forEach((elem) => {
          elem.classList.remove('MuiButton-textPrimary');
          elem.classList.add('MuiButton-containedPrimary');
        });
    }, 1000);
  };

  const handleChangeMultipleDays = (event, value) => {
    if (value?.length) {
      setDays(value);
    } else {
      setDays([]);
    }
    console.log(days, 'selected days');
  };
  const handlePassOpenNewPeriod = () => {
    console.log('openNewPeriod');
    setOpenNewPeriod(true);
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

  const handleClickAPI = () => {
    // setFilterChange(true)
    setIsTimeTable(true);
  };

  const periodTypeList = async () => {
    const data = await getPeriodTypes();
    if (data?.status_code === 200) {
      setLectureList(data?.result);
      setPeriodType(data?.result[1]);
      setperiodTypeId(data?.result[1]?.id);
    }
  };

  useEffect(() => {
    if (section_mappingId) {
      callingSubjectAPI();
      callingTeachersAPI();
    }
    periodTypeList();
  }, [section_mappingId]);

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
  const handlettID = (ttid) => {
    setTTId(ttid);
  };

  const handleCloseNewPeriod = () => {
    setIsTimeTable([]);
    setDays([]);
    setPeriodType(lectureList[1]);
    setperiodTypeId(lectureList[1]?.id);
    setOpenNewPeriod(false);
    setselectedStartTime(new Date('0'));
    setselectedEndTime(new Date('0'));
  };
  const callingSubjectAPI = () => {
    axiosInstance
      .get(
        `/erp_user/v2/mapped-subjects-list/?section_mapping=${section_mappingId}&session_year=${sessionYear?.id}`,
        {
          params: {
            session_year: acadamicYearID,
          },
        }
      )
      .then((res) => {
        setSubject(res.data.result);
      })
      .catch((error) => {
        setAlert('error', "can't fetch subjects");
      });
  };
  const callingTeachersAPI = () => {
    axiosInstance
      .get(`/academic/teachers-list/?section_mapping=${section_mappingId}`, {
        params: {
          session_year: acadamicYearID,
        },
      })
      .then((res) => {
        setAssignedTeacher(res.data.result);
      })
      .catch((error) => {
        setAlert('error', "can't fetch teachers list");
      });
  };
  const addPeriod = () => {
    if (periodType?.type === 'Lecture') {
      if (!assignedTeacherID || !sectionIdOption || days.length === 0) {
        setAlert('Warning', 'Please Fill all Fields');
      } else {
        createPeriodAPI();
      }
    } else if (periodType?.type === 'Examination') {
      if (days.length === 0) {
        setAlert('Warning', 'Please Select Days');
      } else {
        createPeriodAPI();
      }
    } else if (periodType?.type === 'Competitions') {
      if (days.length === 0 || !assignedTeacherID) {
        setAlert('Warning', 'Please Fill all Fields');
      } else {
        createPeriodAPI();
      }
    } else if (periodType?.type === 'Miscellaneous Event') {
      if (days.length === 0 && !assignedTeacherID) {
        setAlert('Warning', 'Please Select All Fields');
      } else {
        createPeriodAPI();
      }
    } else if (periodType?.type === 'Break') {
      if (days.length === 0) {
        setAlert('Warning', 'Please Select Days');
      } else {
        createPeriodAPI();
      }
    }
  };

  const createPeriodAPI = async () => {
    let obj = {
      period_type_id: periodTypeId,
      start_time: `${moment(selectedStartTime).format('HH:mm:00')}`,
      end_time: `${moment(selectedEndTime).format('HH:mm:00')}`,
      days: days.map((item) => item.id),
      teacher_id: assignedTeacherID,
      subject_mapping_id: sectionIdOption,
      tt_id: ttID,
    };

    let data = await createPeriod(obj);
    if (data.status_code === 200) {
      setAlert('success', data.message);
      handleCloseNewPeriod();
      setDays([]);
      setGetTTFlag(true);
    } else {
      setAlert('warning', data?.response?.data?.developer_msg);
    }
  };
  const handlePeriodType = (value) => {
    setPeriodType(value);
    setperiodTypeId(value?.id);
  };
  return (
    <>
      <Layout>
        <>
          <Dialog
            open={openNewPeriod}
            onClose={handleCloseNewPeriod}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            className={classes.dialog}
          >
            <DialogTitle id='add-new-dialog-title'>{'Add New Period'}</DialogTitle>
            <div className={classes.periodDialog}>
              <div className={classes.formTextFields}>
                <Autocomplete
                  fullWidth
                  id='combo-box-demo'
                  options={lectureList || []}
                  getOptionLabel={(option) => option?.type}
                  value={periodType}
                  onChange={(e, value) => {
                    handlePeriodType(value);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size='small'
                      fullWidth
                      label='Period Type'
                      variant='outlined'
                    />
                  )}
                />
              </div>
              {(periodType?.type === 'Lecture' || periodType?.type === 'Examination') && (
                <div className={classes.formTextFields}>
                  <Autocomplete
                    fullWidth
                    id='combo-box-demo'
                    options={subject || []}
                    getOptionLabel={(option) => option?.subject_name}
                    onChange={(event, option) => setSectionIdOption(option?.id)}
                    filterSelectedOptions
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
              )}
              <div style={{ display: 'flex' }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <div className={classes.formTextFields}>
                    {/* <Grid item xs={6} sm={6} md={6}> */}
                    <TimePicker
                      onOpen={() => {
                        calendarBtnHideFix();
                      }}
                      style={{ minWidth: 150 }}
                      autoOk
                      format='hh:mm A'
                      label='Period Start Time'
                      value={selectedStartTime}
                      onChange={setselectedStartTime}
                    />
                    {/* </Grid> */}
                  </div>
                  <div className={classes.formTextFields}>
                    {/* <Grid item xs={6} sm={6} md={6}> */}
                    <TimePicker
                      onOpen={() => {
                        calendarBtnHideFix();
                      }}
                      style={{ minWidth: 150 }}
                      autoOk
                      format='hh:mm A'
                      label='Period End Time'
                      value={selectedEndTime}
                      onChange={setselectedEndTime}
                    />
                    {/* </Grid> */}
                  </div>
                </MuiPickersUtilsProvider>
              </div>
              {(periodType?.type === 'Lecture' ||
                periodType?.type === 'Examination' ||
                periodType?.type === 'Competitions' ||
                periodType?.type === 'Miscellaneous Event') && (
                <div className={classes.formTextFields}>
                  <Autocomplete
                    fullWidth
                    id='combo-box-demo'
                    options={assignedTeacher || []}
                    getOptionLabel={(option) => option?.name}
                    onChange={(event, option) => setAssignedTeacherID(option?.user_id)}
                    filterSelectedOptions
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
              )}
              <div className={classes.formTextFields}>
                <Autocomplete
                  fullWidth
                  multiple
                  // size='small'
                  onChange={handleChangeMultipleDays}
                  // style={{ width: '100%' }}
                  id='day'
                  options={dayNames || []}
                  value={days || []}
                  getOptionLabel={(option) => option.name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      fullWidth
                      size='small'
                      label='Day'
                    />
                  )}
                />
              </div>
            </div>
            <DialogActions className={classes.action}>
              <Button
                className='cancelButton labelColor'
                onClick={handleCloseNewPeriod}
                color='primary'
              >
                Close
              </Button>
              <Button
                onClick={addPeriod}
                color='primary'
                variant='contained'
                style={{ color: 'white' }}
                autoFocus
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
          <div className='time-table-container'>
            <div className='time-table-breadcrums-container'>
              <CommonBreadcrumbs
                componentName='Time Table'
                isAcademicYearVisible={true}
              />
              {/* <div
                className={Filter ? 'filter-container-hidden' : 'filter-container-show'}
                onClick={() => {
                  handleFilter(true);
                }}
              >
                <div className='filter-show'>
                  <div className='filter'>SHOW FILTER</div>
                  <img className='filterImage' src={FilterImage} />
                </div>
              </div> */}
            </div>
            {showFilter ? (
              <>
                <Filters
                  teacherModuleId={moduleId}
                  // teacherView={teacherView}
                  handleCloseTable={handleCloseTable}
                  handlePassData={handlePassData}
                  handleClickAPI={handleClickAPI}
                  // handlePassOpenNewPeriod={handlePassOpenNewPeriod}
                  section_mapping_id={setSectionMappingId}
                  handleAutoComplete={handleFilter}
                />
                {/* <div
                  className='filter-container'
                  onClick={() => {
                    handleFilter(false);
                  }}
                >
                  <div className={classes.filter}>HIDE FILTER</div>
                  <img src={FilterImage} />
                </div> */}
              </>
            ) : (
              <> </>
            )}
            {/* <div className={clsx(classes.leftmarign, 'devider-top')}>
              <Divider variant='middle' />
            </div>

            <div className={clsx(classes.leftmarign, 'table-top-header')}>
              <div className='table-header-data'>{academicYear}</div>
              <span class='dot'> </span>
              <div className='table-header-data'>{branchName}</div>
              <span class='dot'> </span>
              <div className='table-header-data'>{gradeName}</div>
              <span class='dot'> </span>
              <div className='table-header-data'>{sectinName}</div>
            </div> */}
            <div className='date-container'>
              {isTimeTable && (
                <DateAndCalander
                  openNewPeriod={openNewPeriod}
                  grade_ID={gradeID}
                  grade_Name={gradeName}
                  teacherView={teacherView}
                  section_mappingId={section_mappingId}
                  ttId={handlettID}
                  getTTFlag={getTTFlag}
                  setGetTTFlag={setGetTTFlag}
                  handlePassOpenNewPeriod={handlePassOpenNewPeriod}
                  isTimeTable={isTimeTable}
                  HideAutocomplete={(value) => setShowFilter(!value)}
                />
              )}
              {!isTimeTable && <NoFilterData selectfilter={true} />}
            </div>
          </div>
        </>
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default TimeTable;
