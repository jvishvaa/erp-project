import React, { useContext, useEffect, useState, useStyles } from 'react';
import Divider from '@material-ui/core/Divider';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import moment from 'moment';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import './lesson-report.css';
import { useLocation } from 'react-router-dom';
import { getModuleInfo } from '../../../utility-functions';

const LessonViewFilters = ({
  handleLessonList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [volumeDropdown, setVolumeDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);
  const [branchId, setBranchId] = useState('');
  const location = useLocation();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedCol, setSelectedCol] = useState({});
  const [loading, setLoading] = useState(false);
  const [erpYear, setErpYear] = useState({});
  // const [moduleId, setModuleId] = useState();
  // const [modulePermision, setModulePermision] = useState(true);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));
  const [academicYear, setAcademicYear] = useState([]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [selectedCoTeacherOptValue, setselectedCoTeacherOptValue] = useState([]);
  const [selectedCoTeacherOpt, setSelectedCoTeacherOpt] = useState([]);
  const [selectedTeacherUser_id, setSelectedTeacherUser_id] = useState();
  const [studentModuleId, setStudentModuleId] = useState();
  const [datePopperOpen, setDatePopperOpen] = useState(false);

  const [teacherModuleId, setTeacherModuleId] = useState(null);
  // const themeContext = useTheme();
  // const isMobile = useMediaQuery(themeContext.breakpoints.down('md'));

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [filterData, setFilterData] = useState({
    year: '',
    volume: '',
    grade: '',
    subject: '',
    branch: '',
    subject: [],
  });

  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }

  let a;
  const handleClear = () => {
    setFilterData({
      year: '',
      volume: '',
      subject: '',
      grade: '',
      branch: '',
    });
    setSelectedSubjects([]);
    setPeriodData([]);
    setSubjectDropdown([]);
    setSubjectIds([]);
    setGradeDropdown([]);
    setViewMoreData({});
    setViewMore(false);
    setDateRangeTechPer([]);
  };

  useEffect(() => {
    setLoading(true);
    handleClear();
    setLoading(false);
  }, [location.pathname]);
  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '', volume: '', branch: '', grade: ' ' });
    setSelectedSubjects([]);
    if (value) {
      setFilterData({ ...filterData, year: value, volume: '', branch: '', grade: ' ' });
      setSelectedSubjects([]);
    }
  };

  const handleVolume = (event, value) => {
    setFilterData({ ...filterData, volume: '', branch: '', grade: ' ' });
    setSelectedSubjects([]);
    if (value) {
      setFilterData({ ...filterData, volume: value, branch: '', grade: ' ' });
      setSelectedSubjects([]);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', subject: '', chapter: '' });

    if (value && filterData.branch) {
      setFilterData({ ...filterData, grade: value, subject: '', chapter: '' });
      axiosInstance
        .get(
          `${endpoints.lessonPlan.gradeSubjectMappingList}?session_year=${
            erpYear?.id
          }&branch=${filterData.branch.id}&grade=${
            value.grade_id
          }&module_id=${getModuleId()}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubjectDropdown(result.data.result);
          } else {
            setAlert('error', result.data.message);
            setSubjectDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSubjectDropdown([]);
        });
    } else {
      setSubjectDropdown([]);
    }
  };

  const handleSubject = (event, value) => {
    setSelectedSubjects([]);
    if (value.length) {
      const ids = value.map((el) => el.subject_id);
      setSubjectIds(ids);
      const subjs = value.map((el) => el) || [];
      setSelectedSubjects(subjs);
    }
  };
  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '' });

    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
        grade: '',
        subject: '',
        chapter: '',
      });
      axiosInstance
        .get(
          `${endpoints.communication.grades}?session_year=${erpYear?.id}&branch_id=${
            value.id
          }&module_id=${getModuleId()}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result?.data?.data);
          } else {
            setAlert('error', result.data.message);
            setGradeDropdown([]);
            setSubjectDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setGradeDropdown([]);
          setSubjectDropdown([]);
        });
    } else {
      setGradeDropdown([]);
      setSubjectDropdown([]);
    }
  };

  const handleFilter = () => {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    if (!filterData?.year) {
      return setAlert('warning', 'Select Year');
    }
    if (!filterData?.volume) {
      return setAlert('warning', 'Select Volume');
    }
    if (!filterData?.branch) {
      return setAlert('warning', 'Select Branch');
    }
    if (!filterData?.grade) {
      return setAlert('warning', 'Select Grade');
    }

    if (!subjectIds?.length > 0) {
      return setAlert('warning', 'Select Subject');
    }
    if (!(dateRangeTechPer[0] && dateRangeTechPer[1] !== undefined)) {
      return setAlert('warning', 'Select Date-range');
    }

    handleLessonList(
      filterData.grade.grade_id,
      subjectIds,
      filterData.volume.id,
      startDateTechPer,
      endDateTechPer
    );
  };
  function getModuleId() {
    const tempObj = {
      // '/lesson-plan/teacher-view/': 'Teacher View',
      // '/lesson-plan/teacher-view': 'Teacher View',
      // '/lesson-plan/student-view': 'Student View',
      // '/lesson-plan/student-view/': 'Student View',

      '/lesson-plan/report': 'Management Report',
      default: 'Teacher View',
    };
    const moduleName = tempObj[location.pathname] || tempObj['default'];
    return getModuleInfo(moduleName).id;
  }
  useEffect(() => {
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}?module_id=${getModuleId()}`)
      .then((res) => {
        setAcademicYear(res.data.data);

        const defaultYear = res?.data?.current_acad_session_data[0];
        handleAcademicYear({}, defaultYear);
      })
      .catch((error) => {
        setAlert('error ', error.message);
      });
    axios
      .get(`${endpoints.lessonPlan.academicYearList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setAcademicYearDropdown(result.data.result.results);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setVolumeDropdown(result.data.result.results);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  useEffect(() => {
    if (filterData.year?.id) {
      let erp_year;
      const acad = academicYear.map((year) => {
        if (year.session_year === filterData.year.session_year) {
          erp_year = year;
          setErpYear(year);
          setFilterData({ ...filterData, academic: year });
          return year;
        }
        return {};
      });

      axiosInstance
        .get(
          `${endpoints.communication.branches}?session_year=${
            erp_year?.id
          }&module_id=${getModuleId()}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            // setBranchDropdown(result.data.data);
            console.log('the branches', result.data.data.results);
            setBranchDropdown(
              result.data.data.results
                .map((item) => (item && item.branch) || false)
                .filter(Boolean)
            );
            // setBranchId(result.data.data[1].id);
            // a = result.data.data[0].id
            // b = result.data.data[0].id
          } else {
            setAlert('error', result.data.message);
            setSubjectDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSubjectDropdown([]);
        });
    }
  }, [filterData.year]);

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleAcademicYear}
          id='academic-year'
          className='dropdownIcon'
          value={filterData?.year}
          options={academicYearDropdown}
          getOptionLabel={(option) => option?.session_year}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Academic Year'
              placeholder='Academic Yaer'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleVolume}
          id='academic-year'
          className='dropdownIcon'
          value={filterData?.volume}
          options={volumeDropdown}
          getOptionLabel={(option) => option?.volume_name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Volume'
              placeholder='Volume'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleBranch}
          id='academic-year'
          className='dropdownIcon'
          value={filterData?.branch}
          options={branchDropdown}
          getOptionLabel={(option) => option?.branch_name}
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
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='volume'
          className='dropdownIcon'
          value={filterData?.grade}
          options={gradeDropdown}
          getOptionLabel={(option) => option?.grade__grade_name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          multiple
          style={{ width: '100%' }}
          size='small'
          onChange={handleSubject}
          id='subj'
          className='dropdownIcon'
          value={selectedSubjects || []}
          options={subjectDropdown || {}}
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
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <LocalizationProvider dateAdapter={MomentUtils}>
          <DateRangePicker
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
                      value: `${moment(inputProps.value).format('MM-DD-YYYY')} - ${moment(
                        endProps.inputProps.value
                      ).format('MM-DD-YYYY')}`,
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
      {/* {!isMobile && <Grid item xs sm={4} />} */}
      <Grid item xs={12} sm={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          className='cancelButton labelColor'
          style={{ width: '100%' }}
          size='medium'
          onClick={handleClear}
        >
          Clear All
        </Button>
      </Grid>
      <Grid item xs={12} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white', width: '100%' }}
          color='primary'
          size='medium'
          type='submit'
          onClick={handleFilter}
        >
          Filter
        </Button>
      </Grid>
    </Grid>
  );
};

export default LessonViewFilters;
