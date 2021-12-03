import React, { useState, useEffect, useContext } from 'react';
import Layout from '../Layout/index';
// import Avatar from '@material-ui/core/Avatar';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import './attendance.scss';
import {
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { Link, useHistory } from 'react-router-dom';
import RangeCalender from './calender.jsx';
import { Autocomplete, Pagination } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loader from '../../components/loader/loader';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import Group from '../../assets/images/noImg.jpg';
import Avatar from '@material-ui/core/Avatar';
import ClearIcon from '../../components/icon/ClearIcon';
import Chip from '@material-ui/core/Chip';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import OutlinedFlagRoundedIcon from '@material-ui/icons/OutlinedFlagRounded';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import flag from '../../assets/images/flag.svg';
import AcademicYear from 'components/icon/AcademicYear';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import './AttendanceCalender.scss';
import { student } from 'containers/Finance/src/_reducers/student.reducer';
// import { StaticDateRangePicker, LocalizationProvider } from '@material-ui/lab';
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import Box from '@material-ui/core/Box';
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
  title: {
    fontSize: '1.1rem',
  },

  content: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contentData: {
    fontSize: '12px',
    wordBreak: 'break-all',
  },
  contentsmall: {
    fontSize: '15px',
  },
  textRight: {
    textAlign: 'right',
  },

  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  paperSize: {
    width: '300px',
    height: '670px',
    borderRadius: '10px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const AttedanceCalender = () => {
  const history = useHistory();

  const classes = useStyles();

  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);

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
  const [studentDataAll, setStudentDataAll] = useState(null);
  const [counter, setCounter] = useState(2);
  const [todayDate, setTodayDate] = useState();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [sevenDay, setSevenDay] = useState();
  const [studentData, setStudentData] = useState([]);
  const [teacherView, setTeacherView] = useState(true);
  const [backButton, setBackButton] = useState(false);
  const [updatedDays, setUpdatedDays] = useState();
  const [updatedEventDays, setUpdatedEventDays] = useState();
  const [holidayDetails, setHolidayDetails] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  console.log('year', academicYear);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [ holidayId , setHolidayid ] = useState('')
  const [ holidayData , setHolidayData ] = useState('')

  let path = window.location.pathname;
  console.log(path, 'path');

  let userName = JSON.parse(localStorage.getItem('userDetails'))?.erp || {};
  let studentDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

  console.log(userName, 'userName');

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
              localStorage.setItem('moduleId', item.child_id);
            }
            if (item.child_name === 'Student Calendar') {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
          });
        }
      });
    }
    console.log(history);
    if (history?.location?.state?.payload) {
      console.log(history?.location?.state, 'vinod');
      setCounter(history?.location?.state?.payload?.counter);
      setStartDate(history?.location?.state?.payload?.startDate);
      setEndDate(history?.location?.state?.payload?.endDate);
    }
  
  }, []);
  useEffect(() => {
    if (path === '/attendance-calendar/teacher-view') {
      console.log(path, 'path');
      console.log(history, 'checking counter');
      if (history?.location?.state?.backButtonStatus) {
        setSelectedBranch(history?.location?.state?.payload?.branch_id);
        setSelectedGrade(history?.location?.state?.payload?.grade_id);
        setSelectedSection(history?.location?.state?.payload?.section_id);
        setCounter(history?.location?.state?.payload?.counter);
        setStartDate(history?.location?.state?.payload?.startDate);
        if (history?.location?.state?.payload?.counter == 1) {
          var dateToday = new Date();
          var formatDateToday = moment(dateToday).format('YYYY-MM-DD');
          axiosInstance
            .get(`/academic/events_list/`, {
              params: {
                start_date: formatDateToday,
                data: formatDateToday,
                branch_id: history?.location?.state?.payload?.branch_id?.branch?.id,
                grade_id: history?.location?.state?.payload?.grade_id?.grade_id,

                section_id: history?.location?.state?.payload?.section_id?.section_id,
                academic_year: history?.location?.state?.payload?.academic_year_id?.id,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log(res.data.events, 'current eventssss');
              setCurrentEvent(res.data.events);
              setStudentDataAll(res.data);
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
            axiosInstance
            .get(
              `${endpoints.academics.getHoliday}?start_date=${formatDateToday}&end_date=${formatDateToday}&branch=${history?.location?.state?.payload?.branch_id?.branch?.id}&grade=${history?.location?.state?.payload?.grade_id?.grade_id}`
            )
            .then((res) => {
              console.log(res, 'holiday');
              setHolidayDetails(res.data.holiday_detail);
            })
            .catch((error) => {
              console.log(error, 'err');
            });
        } else {
          console.log(history , "his");
           axiosInstance
            .get(`/academic/student_attendance_between_date_range/`, {
              params: {
                start_date: history?.location?.state?.payload?.startDate,
                end_date: history?.location?.state?.payload?.endDate,
                branch_id: history?.location?.state?.payload?.branch_id?.branch?.id,
                grade_id: history?.location?.state?.payload?.grade_id?.grade_id,

                section_id: history?.location?.state?.payload?.section_id?.section_id,
                academic_year: history?.location?.state?.payload?.academic_year_id?.id,
              },
            })
            .then((res) => {
              setLoading(false);
              setStudentDataAll(res.data);
              let temp = [...res.data.present_list, ...res.data.absent_list];
              setStudentData(temp);
              setAlert('success', 'Data Sucessfully Fetched');
            
           
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
            axiosInstance
            .get(
              `${endpoints.academics.getHoliday}?start_date=${history?.location?.state?.payload?.startDate}&end_date=${history?.location?.state?.payload?.endDate}&branch=${history?.location?.state?.payload?.branch_id?.branch?.id}&grade=${history?.location?.state?.payload?.grade_id?.grade_id}`
            )
            .then((res) => {
              console.log(res, 'holiday');
              setHolidayDetails(res.data.holiday_detail);
            })
            .catch((error) => {
              console.log(error, 'err');
            });
        }
      } else {
        setTeacherView(true);
        setSelectedBranch([]);
        setSelectedGrade([]);
        setSelectedSection([]);
        setCurrentEvent(null);
      }
    }
    if (path === '/attendance-calendar/student-view') {
      if (history?.location?.state?.backButtonStatus) {
        console.log(path, 'path');
        setTeacherView(false);
        setCounter(history?.location?.state?.payload?.counter);
        if (history?.location?.state?.payload?.counter == 1) {
          var date = new Date();
          var formatDate = moment(date).format('YYYY-MM-DD');
          console.log(userName[0], 'format date');
          axiosInstance
            .get(`academic/single_student_calender/`, {
              params: {
                start_date: formatDate,
                erp_id: userName[0],
              },
            })
            .then((res) => {
              setLoading(false);
              console.log(res.data.events, 'current eventssss');
              setCurrentEvent(res.data.events);
              setStudentDataAll(res.data);
           
           
            })
            .catch((error) => {
              setLoading(false);
              setAlert('error', 'no attendance');
              setStudentDataAll(null);
              console.log(error);
            });
            axiosInstance
            .get(
              `${endpoints.academics.getHoliday}?start_date=${formatDate}&end_date=${formatDate}&branch=${selectedBranch.branch.id}&grade=${selectedGrade.grade_id}`
            )
            .then((res) => {
              console.log(res, 'holiday');
              setHolidayDetails(res.data.holiday_detail);
            })
            .catch((error) => {
              console.log(error, 'err');
            });
        } else {
          axiosInstance
            .get(`/academic/student_calender/`, {
              params: {
                start_date: history?.location?.state?.payload?.startDate,
                end_date: history?.location?.state?.payload?.endDate,
                erp_id: userName,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log(res, 'respond student');
              setStudentDataAll(res.data);
              let temp = [...res.data.present_list, ...res.data.absent_list];
              setStudentData(temp);
              setAlert('success', 'Data Sucessfully Fetched');
            
           
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
        }
      }
    }
  }, [path]);

  useEffect(() => {
   
    if (path === '/attendance-calendar/teacher-view') {
      console.log(path, 'path');
      setTeacherView(true);
      setStudentDataAll(null);
    }
    if (path === '/attendance-calendar/student-view') {
      console.log(path, 'path');
      setTeacherView(false);
      setStudentDataAll(null);
    }
  }, [path]);

  

  useEffect(() => {
    if (moduleId) {
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );
    }
  }, [moduleId]);

  useEffect(() => {
    let modId = +JSON.parse(localStorage.getItem('moduleId'));
    if (moduleId) {
      if (modId !== moduleId) {
        handleClearAll();
      }
      if (modId === moduleId) {
        const {
          academic = {},
          branch = {},
          grade = {},
          section = {},
        } = JSON.parse(localStorage.getItem('teacherFilters')) || {};
        if (window.location.pathname === '/attendance-calendar/teacher-view') {
          if (academic?.id) {
            const acadId = academic?.id || '';
            callApi(
              `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
              'branchList'
            );
            if (Object.keys(branch).length !== 0) {
              setSelectedBranch(branch);
              const branchIds = branch.branch.id;
              callApi(
                `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchIds}&module_id=${moduleId}`,
                'gradeList'
              );
              if (Object.keys(grade).length !== 0) {
                setSelectedGrade(grade);
                const gradeIds = grade.grade_id;
                callApi(
                  `${endpoints.academics.sections}?session_year=${acadId}&branch_id=${branchIds}&grade_id=${gradeIds}&module_id=${moduleId}`,
                  'section'
                );
                if (section) {
                  setSelectedSection(section);
                }
              }
            }
          }
        }
      }
    }
  }, [moduleId, window.location.pathname]);

  const handleClearAll = () => {
    console.log('clear all');
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setStudentDataAll(null);
    setCurrentEvent(null);
    setHolidayDetails('');
    setGradeList([])
    setSectionList([])
 
  };

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || []);
            const defaultValue = result?.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
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

  const StyledClearButton = withStyles({
    root: {
      backgroundColor: '#E2E2E2',
      color: '#8C8C8C',
      height: '42px',
      marginTop: 'auto',
    },
  })(Button);

  const setDate = () => {
    setStudentDataAll(null);
    console.log(startDate, 'startDs');
    var date = new Date();
    var formatDate = moment(date).format('YYYY-MM-DD');
    console.log(formatDate, 'format date');
    var day = date.getDay();
    let currentDay;
    setCounter(1);
    if (day === 0) {
      currentDay = 'Sunday';
    }
    if (day === 1) {
      currentDay = 'Monday';
    }
    if (day === 2) {
      currentDay = 'Tuesday';
    }
    if (day === 3) {
      currentDay = 'Wednesday';
    }
    if (day === 4) {
      currentDay = 'Thursday';
    }
    if (day === 5) {
      currentDay = 'Friday';
    }
    if (day === 6) {
      currentDay = 'Saturday';
    }
    setTodayDate(currentDay + ' ' + moment(date).format('DD-MM-YYYY'));
    console.log(currentDay, 'todays Date');
    setStartDate(date);
    setEndDate(date);
 
  };

  const weeklyData = () => {
    setCounter(2);
    setStudentDataAll(null);
    setCurrentEvent(null);
    console.log(startDate , "start");
  };

  const monthlyData = () => {
    setCounter(3);
    setStudentDataAll(null);
    setCurrentEvent(null);
  };

  const getToday = () => {
    var date = new Date();
    var formatDate = moment(date).format('YYYY-MM-DD');
    console.log(formatDate, 'format date');
    axiosInstance
    .get(`academic/student_attendance_between_date_range/`, {
      params: {
        start_date: formatDate,
        end_date: formatDate,
        branch_id: selectedBranch.branch.id,
        grade_id: selectedGrade.grade_id,

        section_id: selectedSection.section_id,
        academic_year: selectedAcademicYear.id,
      },
    })
    .then((res) => {
      console.log(res, "qa calender")
      setLoading(false);
      setStudentDataAll(res.data);
      let temp = [...res.data.present_list, ...res.data.absent_list];
      setStudentData(temp);
      setAlert('success', 'Data Sucessfully Fetched');
  
   
    })
    .catch((error) => {
      setLoading(false);
      setAlert('error', 'no attendance');
      setStudentDataAll(null);
      console.log(error);
    });

    axiosInstance
      .get(
        `${endpoints.academics.getHoliday}?start_date=${formatDate}&end_date=${formatDate}&branch=${selectedBranch.branch.id}&grade=${selectedGrade.grade_id}`
      )
      .then((res) => {
        console.log(res, 'holiday');
        setHolidayDetails(res.data.holiday_detail);
      })
      .catch((error) => {
        console.log(error, 'err');
      });
  };
  const handlePassData = (endDate, startDate, starttime) => {
    console.log(endDate, 'got date');
    console.log(startDate, 'startDate passss');
    setStartDate(starttime);
    setEndDate(endDate);
  };

  const getRangeData = () => {
    const payload = {
      academic_year_id: selectedAcademicYear,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      section_id: selectedSection,
      startDate: startDate,
      endDate: endDate,
    };
    console.log(payload, 'attendance calendar');

    localStorage.setItem(
      'teacherFilters',
      JSON.stringify({
        academic: selectedAcademicYear,
        branch: selectedBranch,
        grade: selectedGrade,
        section: selectedSection,
      })
    );

    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    if (selectedBranch.length == 0) {
      setAlert('warning', 'Select Branch');
      return;
    }
    if (selectedGrade.length == 0) {
      setAlert('warning', 'Select Grade');
      return;
    }
    if (selectedSection.length == 0) {
      setAlert('warning', 'Select Section');
      return;
    }
    setLoading(true);
    if (counter === 2) {
      axiosInstance
        .get(`academic/student_attendance_between_date_range/`, {
          params: {
            start_date: startDate,
            end_date: endDate,
            branch_id: selectedBranch.branch.id,
            grade_id: selectedGrade.grade_id,

            section_id: selectedSection.section_id,
            academic_year: selectedAcademicYear.id,
          },
        })
        .then((res) => {
          console.log(res, "qa calender")
          setLoading(false);
          setStudentDataAll(res.data);
          let temp = [...res.data.present_list, ...res.data.absent_list];
          setStudentData(temp);
          setAlert('success', 'Data Sucessfully Fetched');
        
        
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'no attendance');
          setStudentDataAll(null);
          console.log(error);
        });

      axiosInstance
        .get(
          `${endpoints.academics.getHoliday}?start_date=${startDate}&end_date=${endDate}&branch=${selectedBranch.branch.id}&grade=${selectedGrade.grade_id}`
        )
        .then((res) => {
          console.log(res, 'holiday');
          setHolidayDetails(res.data.holiday_detail);
        })
        .catch((error) => {
          console.log(error, 'err');
        });
    }
    if (counter === 1) {
      getToday();
    }
    if (counter === 3) {
      axiosInstance
        .get(`academic/student_attendance_between_date_range/`, {
          params: {
            start_date: startDate,
            end_date: endDate,
            branch_id: selectedBranch.branch.id,
            grade_id: selectedGrade.grade_id,
            // grade_id: 2,

            section_id: selectedSection.section_id,
            // section_id: 2,
            academic_year: selectedAcademicYear.id,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res, 'respond teacher');
          setStudentDataAll(res.data);
          let temp = [...res.data.present_list, ...res.data.absent_list];
          setStudentData(temp);
          setAlert('success', 'Data Sucessfully Fetched');
        
      
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'no attendance');
          setStudentDataAll(null);
          console.log(error);
        });

      axiosInstance
        .get(
          `${endpoints.academics.getHoliday}?start_date=${startDate}&end_date=${endDate}&branch=${selectedBranch.branch.id}&grade=${selectedGrade.grade_id}`
        )
        .then((res) => {
          console.log(res, 'holiday');
          setHolidayDetails(res.data.holiday_detail);
        })
        .catch((error) => {
          console.log(error, 'err');
        });
    }
  };

  const getTodayStudent = () => {
    var date = new Date();
    var formatDate = moment(date).format('YYYY-MM-DD');
    console.log(formatDate, 'format date');
    axiosInstance
      .get(`academic/single_student_calender/`, {
        params: {
          start_date: formatDate,
          erp_id: userName,
        },
      })
      .then((res) => {
        setLoading(false);
        setCurrentEvent(res.data.events);
        setStudentDataAll(res.data);
       
      
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', 'no attendance');
        setStudentDataAll(null);
        console.log(error);
      });
      axiosInstance
      .get(
        `${endpoints.academics.getHoliday}?start_date=${formatDate}&end_date=${formatDate}&branch=${studentDetails?.role_details?.branch[0]?.id}&grade=${studentDetails?.role_details?.grades[0]?.grade_id}`
      )
      .then((res) => {
        console.log(res, 'holiday');
        setHolidayDetails(res.data.holiday_detail);
      })
      .catch((error) => {
        console.log(error, 'err');
      });
  };

  const getStudentRange = () => {
    if (counter === 2) {
      axiosInstance
        .get(
          `academic/student_calender/?start_date=${startDate}&end_date=${endDate}&erp_id=${userName}`
      
        )
        .then((res) => {
          setLoading(false);
          console.log(res, 'respond student');
          setStudentDataAll(res.data);
          let temp = [...res.data.present_list, ...res.data.absent_list];
          setStudentData(temp);
          setAlert('success', 'Data Sucessfully Fetched');
       
       
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'no attendance');
          setStudentDataAll(null);
          console.log(error);
        });

        axiosInstance
        .get(
          `${endpoints.academics.getHoliday}?start_date=${startDate}&end_date=${endDate}&branch=${studentDetails?.role_details?.branch[0]?.id}&grade=${studentDetails?.role_details?.grades[0]?.grade_id}`
        )
        .then((res) => {
          console.log(res, 'holiday');
          setHolidayDetails(res.data.holiday_detail);
        })
        .catch((error) => {
          console.log(error, 'err');
        });
    }
    if (counter === 1) {
      getTodayStudent();
    }
    if (counter === 3) {
      axiosInstance
        .get(`academic/student_calender/`, {
          params: {
            start_date: startDate,
            end_date: endDate,
            erp_id: userName,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res, 'respond student');
          setStudentDataAll(res.data);
          let temp = [...res.data.present_list, ...res.data.absent_list];
          setStudentData(temp);
          setAlert('success', 'Data Sucessfully Fetched');
       
       
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'no attendance');
          setStudentDataAll(null);
          console.log(error);
        });
        axiosInstance
        .get(
          `${endpoints.academics.getHoliday}?start_date=${startDate}&end_date=${endDate}&branch=${studentDetails?.role_details?.branch[0]?.id}&grade=${studentDetails?.role_details?.grades[0]?.grade_id}`
        )
        .then((res) => {
          console.log(res, 'holiday');
          setHolidayDetails(res.data.holiday_detail);
        })
        .catch((error) => {
          console.log(error, 'err');
        });
    }
  };

  const selectModule = () => {
    if (path === '/attendance-calendar/teacher-view') {
      console.log(path, 'path');
      getRangeData();
    }
    if (path === '/attendance-calendar/student-view') {
      console.log(userName, 'path');
      getStudentRange();
    }
  };

  const convertTime = () => {
    console.log(currentEvent, 'current time');
  };

  const handleViewDetails = () => {
    const payload = {
      academic_year_id: selectedAcademicYear,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      section_id: selectedSection,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      counter: counter,
    };

    if (path === '/attendance-calendar/teacher-view') {
      history.push({
        pathname: '/OverallAttendance',
        state: {
          data: studentData,
          payload: payload,
        },
      });
    }
    if (path === '/attendance-calendar/student-view') {
      history.push({
        pathname: '/student-view/attendance',
        state: {
          data: studentData,
          payload: payload,
        },
      });
    }
  };

  const handleCreateEvent = () => {
    const payload = {
      academic_year_id: selectedAcademicYear,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      section_id: selectedSection,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      counter: counter,
    };
    console.log(payload);
    history.push({
      pathname: '/createEvent',
      state: {
        data: studentData,
        payload: payload,
      },
    });
  };

  const handleMarkHoliday = () => {
    const payload = {
      academic_year_id: selectedAcademicYear,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      section_id: selectedSection,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      counter: counter,
    };

    history.push({
      pathname: '/holidaymarking',
      state: {
        payload: payload,
      },
    });
  };

  const handleMarkAttendance = () => {
    const payload = {
      academic_year_id: selectedAcademicYear,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      section_id: selectedSection,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      counter: counter,
    };
    console.log(payload);
    history.push({
      pathname: '/markattendance',
      state: {
        data: studentData,
        payload: payload,
      },
    });
  };
  const handleYear = (event, value) => {
    setSelectedGrade([]);
    setSectionList([]);
    setSelectedSection([]);
    setSelectedBranch([]);
    // setSelectedAcadmeicYear(value);
    if (value?.id) {
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );
    }
  };

  const handleEditHoliday = (e) => {
    const payload = {
      academic_year_id: selectedAcademicYear,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      section_id: selectedSection,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      counter: counter,
    };
 
    history.push({
      pathname: '/holidaymarking',
      state: {
        data: holidayData,
        payload: payload
      },
    });
  }
  
  const handleDeleteHoliday = (data) => {
    axiosInstance
    .get(
      `${endpoints.academics.getHoliday}?holiday_id=${holidayId}`
    )
    .then((res) => {
      console.log(res, 'holiday');
      getholidayrefresh()
      handleClosePop()
    })
    .catch((error) => {
      console.log(error, 'err');
    });
  }

  const getholidayrefresh = () => {
    axiosInstance
        .get(
          `${endpoints.academics.getHoliday}?start_date=${startDate}&end_date=${endDate}&branch=${selectedBranch.branch.id}&grade=${selectedGrade.grade_id}`
        )
        .then((res) => {
          console.log(res, 'holiday');
          setHolidayDetails(res.data.holiday_detail);
        })
        .catch((error) => {
          console.log(error, 'err');
        });
  }

  const handleClickPop = (event , data) => {
    setAnchorEl(event.currentTarget);
    setHolidayid(data.id)
    console.log(data , "data");
    setHolidayData(data)
  };

  const handleClosePop = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);
  const id = openPop ? 'simple-popover' : undefined;

  const StyledFilterButton = withStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFFFFF',
      height: '42px',
      borderRadius: '10px',
      padding: '12px 40px',
      marginLeft: '20px',
      marginTop: 'auto',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },

    startIcon: {
      fill: '#FFFFFF',
      stroke: '#FFFFFF',
    },
  }))(Button);
  const [value, setValue] = React.useState([null, null]);

  const handleAcademicYear = (event, value) => {
    const teacherfilterdata = JSON.parse(localStorage.getItem('teacherFilters'));

    if (
      JSON.stringify(teacherfilterdata && teacherfilterdata.academic) ===
      JSON.stringify(value)
    ) {
    } else {
      // setSelectedAcadmeicYear(value);
      console.log(value, 'test');
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
      localStorage.removeItem('teacherFilters');
    }
  };

  return (
    <Layout>
      <div className='profile_breadcrumb_wrapper'>
        <CommonBreadcrumbs
          componentName='Attendance & Calendar'
          isAcademicYearVisible={true}
        />
      </div>
      {teacherView === true ? (
        <Grid
          container
          direction='row'
          className={classes.root}
          spacing={3}
          id='selectionContainer'
        >
        
          <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedBranch([]);
                if (value) {
                  const selectedId = value.branch.id;
                  setSelectedBranch(value);
                  console.log(value);
                  callApi(
                    `${endpoints.academics.grades}?session_year=${
                      selectedAcademicYear.id
                    }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                    'gradeList'
                  );
                }
                setGradeList([])
                setSelectedGrade([]);
                setSectionList([]);
                setSelectedSection([]);
              }}
              id='branch_id'
              className='dropdownIcon'
              value={selectedBranch || ''}
              options={branchList || ''}
              getOptionLabel={(option) => option?.branch?.branch_name || ''}
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
                setSelectedGrade([]);
                if (value) {
                  const selectedId = value.grade_id;
                  const branchId = selectedBranch.branch.id;
                  setSelectedGrade(value);
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
              value={selectedGrade || ''}
              options={gradeList || ''}
              getOptionLabel={(option) => option?.grade__grade_name || ''}
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
                setSelectedSection([]);
                if (value) {
                  const ids = value.id;
                  const secId = value.section_id;
                  setSelectedSection(value);
                  setSecSelectedId(secId);
                }
              }}
              id='section_id'
              className='dropdownIcon'
              value={selectedSection || ''}
              options={sectionList || ''}
              getOptionLabel={(option) =>
                option?.section__section_name || option?.section_name || ''
              }
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
      ) : (
        <div></div>
      )}
      <Grid
        container
        direction='row'
        className={classes.root}
        spacing={3}
        style={{ background: 'white' }}
        id='completeContainer'
      >
        <div className='whole-calender-filter'>
          <Grid className='calenderGrid'>
            <div className='buttonContainer'>
              <div className='today'>
                <Button
                  variant='contained'
                  size='small'
                  color={counter === 1 ? 'primary' : 'secondary'}
                  className={counter === 1 ? 'viewDetailsButtonClick' : 'viewDetails'}
                  // className='viewDetails'
                  onClick={() => setDate()}
                >
                  {/* <p className='btnLabel'>Secondary</p> */}
                  Today
                </Button>
              </div>
              <div className='today'>
                <Button
                  variant='contained'
                  size='small'
                  color={counter === 2 ? 'primary' : 'secondary'}
                  className={counter === 2 ? 'viewDetailsButtonClick' : 'viewDetails'}
                  onClick={() => weeklyData()}
                >
                  Weekly
                </Button>
              </div>
              <div className='today'>
                <Button
                  variant='contained'
                  size='small'
                  color={counter === 3 ? 'primary' : 'secondary'}
                  className={counter === 3 ? 'viewDetailsButtonClick' : 'viewDetails'}
                  onClick={() => monthlyData()}
                >
                  Monthly
                </Button>
              </div>
            </div>
            {counter === 2 ? (
              <RangeCalender
                endDate={endDate}
                startDate={startDate}
                gradeID={selectedGrade}
                branchID={selectedBranch}
                sectionID={selectedSection}
                academicYearID={selectedAcademicYear}
                handlePassData={handlePassData}
                sevenDay={sevenDay}
                counter={counter}
              />
            ) : counter === 1 ? (
              <RangeCalender
              endDate={endDate}
              startDate={startDate}
              gradeID={selectedGrade}
              branchID={selectedBranch}
              sectionID={selectedSection}
              academicYearID={selectedAcademicYear}
              handlePassData={handlePassData}
              sevenDay={sevenDay}
              counter={counter}
            />
          
            ) : counter === 3 ? (
              <RangeCalender
                gradeID={selectedGrade}
                branchID={selectedBranch}
                sectionID={selectedSection}
                academicYearID={selectedAcademicYear}
                handlePassData={handlePassData}
                sevenDay={sevenDay}
                counter={counter}
              />
            ) : (
              <></>
            )}
          </Grid>
          <Grid className='buttonGrid'>
            {teacherView === true ? (
              <StyledClearButton
                variant='contained'
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
              >
                Clear all
              </StyledClearButton>
            ) : (
              <></>
            )}
            <StyledFilterButton
              variant='contained'
              startIcon={<FilterFilledIcon className={classes.filterIcon} />}
              className={classes.filterButton}
              onClick={selectModule}
            >
              filter
            </StyledFilterButton>
          </Grid>
        </div>
        <div className='attendenceWhole'>
          <div className='startDate'> From {moment(startDate).format('DD-MM-YYYY')}</div>
          <Paper elevation={3} className={classes.paperSize} id='attendanceContainer'>
            <Grid container direction='row' className={classes.root} id='attendanceGrid'>
              <div className='attendanceBtnornot'>
                <Grid item md={6} xs={12}>
                  <Typography variant='h6' color='primary' className='attendancePara'>
                    Attendance
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} className='mark-btn-grid'>
                  {teacherView === true ? (
                    <Button
                      size='small'
                      color='primary'
                      variant='contained'
                      style={{ color: 'white' }}
                      onClick={handleMarkAttendance}
                    >
                      <span className={classes.contentData} id='mark-para'>
                        Mark Attendance
                      </span>
                    </Button>
                  ) : (
                    <>
                      {/* <p id='teacherUpdate'>Updated On {updatedDays}</p> */}
                    </>
                  )}
                </Grid>
              </div>
              <div className='stu-icon'>
                <Grid item md={3}>
                  <Typography className={classes.content} id='studentPara'>
                    Students
                  </Typography>
                </Grid>
                {teacherView === false ? (
                  <p className='erpId'>ERP_ID :{userName}</p>
                ) : (
                  <>
                    {/* <p id='studentPara'>Updated On {updatedDays}</p> */}
                  </>
                )}
                {/* <KeyboardArrowDownIcon className='downIcon' /> */}
              </div>
            </Grid>
            {studentDataAll != null ? (
              <>
                <div className='absentContainer'>
                  <div className='absentHeader'>
                    <p>Absent List</p>
                    <p>Absent Duration</p>
                  </div>
                  <Divider />
                  <div className='absentList'>
                    {studentDataAll.absent_list &&
                      studentDataAll.absent_list.map((data) => (
                        <div className='eachAbsent'>
                          <Avatar
                            alt={data?.student_name}
                            src='/static/images/avatar/1.jpg'
                            className='absentProfilePic'
                          />
                          <div className='studentName'>
                            <p className='absentName'>
                              {/* {data?.student_name?.slice(0, 10)} */}
                              {data?.student_name?.split(/\s(.+)/)[0]}
                            </p>
                            {/* <p className='absentName'>{data.student_last_name}</p> */}
                            {/* <Chip  className='chipDays' > {data.absent_count}  </Chip> */}
                            <div className='absentCount'>
                              <div className='absentChip'>
                                {' '}
                                {data.student_count} Days{' '}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className='btnArea'>
                    <Button
                      color='primary'
                      variant='contained'
                      style={{ color: 'white' }}
                      onClick={handleViewDetails}
                    >
                      <p className='btnLabel'>View More</p>
                    </Button>
                  </div>
                </div>
                <div className='presentContainer'>
                  <div className='presentHeader'>
                    <p className='presentPara'>Present List</p>
                    <p className='presentDuration'>Present Duration</p>
                  </div>
                  <Divider />
                  <div className='presentStudents'>
                    {studentDataAll.present_list &&
                      studentDataAll.present_list.map((data) => (
                        <div className='presentList'>
                          <Avatar
                            alt={data?.student_name}
                            src='/static/images/avatar/1.jpg'
                            className='presentProfilePic'
                          />
                          <div className='presentStudent'>
                            <p className='presentFName'>
                              {/* {data?.student_name.slice(0, 10)} */}
                              {data?.student_name?.split(/\s(.+)/)[0]}
                            </p>
                            {counter != 1 ? (
                              <div className='absentCount'>
                                <div className='absentChip'>
                                  {' '}
                                  {data.student_count} Days{' '}
                                </div>
                              </div>
                            ) : (
                              <div className='absentCount'>
                                <div className='absentChip'> 1 Days </div>
                              </div>
                            )}
                            {/* <p className='presentLName'> {data.student_last_name}</p> */}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className='noImg'>
                <img src={Group} width='100%' className='noDataImg' />
              </div>
            )}
          </Paper>
        </div>
       
        <div className='eventWhole'>
        <div className='startDate'> To {moment(endDate).format('DD-MM-YYYY')}</div>
          <Paper
            elevation={3}
            className={[classes.root, classes.paperSize]}
            id='eventContainer'
          >
            <Grid container direction='row' className='eventContainer'>
              <Grid item md={6} xs={12}>
                <Typography variant='h6' color='primary' className='eventPara'>
                  Holiday
                </Typography>
              </Grid>
              <Grid item md={6} xs={12} className='event-btn'>
                {teacherView === true ? (
                  <Button
                    size='small'
                    onClick={handleMarkHoliday}
                    color='primary'
                    variant='contained'
                    style={{ color: 'white' }}
                  >
                    {/* ADD EVENT */}
                    <span className={classes.contentData} id='event-text'>
                      Mark Holiday
                    </span>
                  </Button>
                ) : (
                  <div></div>
                )}
              </Grid>
              <div className='event-details'>
                <Grid item md={5}>
                  <Typography className={classes.contentsmall} id='eventpara'>
                    Holiday Details
                  </Typography>
                </Grid>
                <Grid item md={7} className='detailsPara'>
                  <Typography className={classes.contentsmall} id='updated'>
                    {/* Updated at {updatedEventDays} */}
                  </Typography>
                </Grid>
              </div>
            </Grid>
            { holidayDetails?.length === 0  ? (
              <div className='noImgEvent'>
                <img src={Group} width='100%' className='noDataImgEvent' />
              </div>
            )  : (
              <div className='eventGrid'>
                <Divider className='event-divider' />
                <div className='eventList'>
                  {holidayDetails &&
                    holidayDetails?.map((data) => (
                      <>
                      <Typography
                        className={[classes.contentsmall, classes.root]}
                        id='eventData'
                      >
                        {/* {data.start_time.slice(0, 10)} */}
                        {/* {moment(data.holiday_date.slice(0, 10)).format('DD-MM-YYYY')} */}
                        <br />
                        <Grid
                          container
                          direction='row'
                          className='eventDetailsfirst'
                          style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' , width: '100%' }}>
                            <div style={{ display: 'flex' }} >
                            <div className='flagBgHoliday' style={{ marginRight: '5px' }}>
                              <img src={flag} className='flagImg' />
                            </div>

                            <Typography
                              className='eventNameData'
                              style={{ fontSize: '15px' , width: '100%' }}
                            >
                              {' '}
                              {data.title}{' '}
                            </Typography>
                            </div>
                            <>
                            {teacherView ? 
                            <IconButton style={{padding: '1px'}}  >  
                              <MoreVertIcon onClick={(e) => handleClickPop(e , data)} />
                            </IconButton>
                            : '' }
                            </>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                          >
                            <p>From</p>
                            <p>To</p>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                          >
                            <Typography style={{ fontSize: '15px' }}>
                              {moment(data.holiday_start_date.slice(0, 10)).format(
                                'DD-MM-YYYY'
                              )}
                            </Typography>
                            <Typography style={{ fontSize: '15px' }}>
                              {moment(data.holiday_end_date.slice(0, 10)).format(
                                'DD-MM-YYYY'
                              )}
                            </Typography>
                          </div>
                        </Grid>
                        <Typography className={classes.contentData}>
                          {data.description}
                        </Typography>
                      </Typography>
                <Popover
                  id={id}
                  open={openPop}
                  anchorEl={anchorEl}
                  onClose={handleClosePop}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <div style={{padding: '10px'}} >
                  <Typography className={classes.typography} style={{cursor: 'pointer'}}  onClick={() => handleEditHoliday(data)} >
                    Edit
                  </Typography>
                  <Divider />
                  <Typography className={classes.typography} style={{cursor: 'pointer'}} onClick={() => handleDeleteHoliday(data)} >
                    Delete
                  </Typography>
                  </div>
                </Popover>
                </>
                    ))}
                </div>
              </div>
            )
            //  : (
            //   <div className='noImgEvent'>
            //     <img src={Group} width='100%' className='noDataImgEvent' />
            //   </div>
            // )
            }
          </Paper>
        </div>
        {/* </Grid> */}
      </Grid>
      {loading && <Loader />}
    </Layout>
  );
};

export default AttedanceCalender;
