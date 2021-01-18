import React, { useContext, useEffect, useState, useStyles } from 'react';
import Divider from '@material-ui/core/Divider';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import './lesson-report.css';

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

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedCol, setSelectedCol] = useState({});
  const [loading, setLoading] = useState(false);
  // const [moduleId, setModuleId] = useState();
  // const [modulePermision, setModulePermision] = useState(true);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 7));

  const [startDateTechPer, setStartDateTechPer] = useState(moment().format('YYYY-MM-DD'));
  const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [selectedCoTeacherOptValue, setselectedCoTeacherOptValue] = useState([]);
  const [selectedCoTeacherOpt, setSelectedCoTeacherOpt] = useState([]);
  const [selectedTeacherUser_id, setSelectedTeacherUser_id] = useState();

  const [datePopperOpen, setDatePopperOpen] = useState(false);

  const [teacherModuleId, setTeacherModuleId] = useState(null);
  // const themeContext = useTheme();
  // const isMobile = useMediaQuery(themeContext.breakpoints.down('md'));

  const [filterData, setFilterData] = useState({
    year: '',
    volume: '',
    grade: '',
    branch: '',
  });

  function getDaysAfter(date, amount) {
    // TODO: replace with implementation for your date library
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    // TODO: replace with implementation for your date library
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }

  let a;
  const handleClear = () => {
    setFilterData({
      year: '',
      volume: '',
      grade: '',
      branch: '',
    });
    setPeriodData([]);
    setSubjectDropdown([]);
    setViewMoreData({});
    setViewMore(false);
  };

  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '' });
    if (value) {
      setFilterData({ ...filterData, year: value });
    }
  };

  const handleVolume = (event, value) => {
    setFilterData({ ...filterData, volume: '' });
    if (value) {
      setFilterData({ ...filterData, volume: value });
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '' });
    if (value) {
      setFilterData({ ...filterData, grade: value });
      axiosInstance
        .get(
          `${endpoints.lessonReport.subjects}?branch=${branchId}&grade=${value.grade_id}`
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
    setFilterData({ ...filterData });
    // if (value) {
    //     setFilterData({ ...filterData });
    // }
    if (value.length) {
      const ids = value.map((el) => el.id);
      setSubjectIds(ids);
    }
  };
  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '' });
    if (value) {
      setFilterData({ ...filterData, branch: value });
    }
  };

  const handleFilter = () => {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    handleLessonList(
      filterData.grade.grade_id,
      subjectIds,
      filterData.volume.id,
      startDateTechPer,
      endDateTechPer
    );
  };

  useEffect(() => {
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

    axiosInstance
      .get(`${endpoints.communication.branches}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setBranchDropdown(result.data.data);
          setBranchId(result.data.data[0].id);
          // a = result.data.data[0].id
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  useEffect(() => {
    if (branchId) {
      axiosInstance
        .get(`${endpoints.academics.grades}?branch_id=${branchId}&module_id=8`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [branchId]);

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
          // value={filterData?.subject}
          options={subjectDropdown}
          getOptionLabel={(option) => option?.subject_name}
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
                      value: `${inputProps.value} - ${endProps.inputProps.value}`,
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

      {!isMobile && <Grid item xs sm={4} />}
      <Grid item xs={12} sm={12}>
        <Divider />
      </Grid>
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          className='custom_button_master labelColor'
          size='medium'
          onClick={handleClear}
        >
          CLEAR ALL
        </Button>
      </Grid>
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          className='custom_button_master'
          size='medium'
          type='submit'
          onClick={handleFilter}
        >
          FILTER
        </Button>
      </Grid>
    </Grid>
  );
};

export default LessonViewFilters;
