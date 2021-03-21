import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
// import download from '../../assets/images/downloadAll.svg';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import axios from 'axios';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
// import './lesson.css';
import '../circular/create-circular/create-circular.css';
import communicationStyles from 'containers/Finance/src/components/Finance/BranchAccountant/Communication/communication.styles';

const CircularFilters = ({
  handlePeriodList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
  setFilterDataDown,
  setSelectedIndex,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const history = useHistory();
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [volumeDropdown, setVolumeDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [overviewSynopsis, setOverviewSynopsis] = useState([]);
  const [centralGsMappingId, setCentralGsMappingId] = useState();
  const [sectionDropdown, setSectionDropdown] = useState([]);

  const [startDateTechPer, setStartDateTechPer] = useState(moment().format('YYYY-MM-DD'));
  const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);

  const [filterData, setFilterData] = useState({
    branch: '',
    year: '',
    volume: '',
    grade: '',
    subject: '',
    chapter: '',
    section: '',
  });
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Circular' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Circular' && window.location.pathname === '/teacher-circular') {
              setModuleId(item.child_id);
            }
            if (item.child_name === 'Student Circular' && window.location.pathname === '/student-circular') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  // DATE RANGE FUNCTION
  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }

  const handleClear = () => {
    setFilterData({
      year: '',
      grade: '',
      section: '',
      branch: '',
    });
    setPeriodData([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setViewMoreData({});
    setViewMore(false);
    setFilterDataDown({});
    setOverviewSynopsis([]);
    setSelectedIndex(-1);
    setCentralGsMappingId();
    setDateRangeTechPer([ moment().subtract(6, 'days'),
    moment(),])
  };

  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '' });
    if (value) {
      setFilterData({ ...filterData, year: value });
      axiosInstance
        .get(`${endpoints.communication.branches}?session_year=${value.id}&module_id=${moduleId}`)
        .then((result) => {
          if (result?.data?.status_code) {
            setBranchDropdown(result?.data?.data?.results);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => setAlert('error', error?.message));
    }
  };

  const handleSection = (event, value) => {
    setFilterData({ ...filterData, section: '' });
    if (value) {
      setFilterData({ ...filterData, section: value });
    }
  };
  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
        grade: '',
        subject: '',
        chapter: '',
      });
      axiosInstance
      //for teacher_module_id=167 ><<<admin=8
      
        .get(`${endpoints.communication.grades}?branch_id=${value.id}&session_year=${filterData.year.id}&module_id=${moduleId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result?.data?.data);
          } else {
            setAlert('error', result.data.message);
            setGradeDropdown([]);
            setSubjectDropdown([]);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setGradeDropdown([]);
          setSubjectDropdown([]);
          setChapterDropdown([]);
        });
    } else {
      setGradeDropdown([]);
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value && filterData.branch) {
      setFilterData({ ...filterData, grade: value, subject: '', chapter: '' });
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?branch_id=${filterData.branch.id}&session_year=${filterData.year.id}&grade_id=${value.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            console.log(result.data);
            setSectionDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setSectionDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSectionDropdown([]);
        });
    } else {
      setSectionDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleFilter = () => {
    if(window.location.pathname === '/teacher-circular'){
    if (!filterData.year) {
      return setAlert('warning', 'Select Academic Year');
    }
    if (!filterData.branch) {
      return setAlert('warning', 'Select Branch');
    }
    if (!filterData.grade) {
      return setAlert('warning', 'Select Grade');
    }
    if (!filterData.section) {
      return setAlert('warning', 'Select Section');
    }
    if (filterData.year && filterData.branch && filterData.grade && filterData.section) {
      setSelectedIndex(-1);
      const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
      handlePeriodList(filterData.grade, filterData.branch, filterData.section,filterData.year,startDateTechPer,endDateTechPer);
    }
  }else{

    setSelectedIndex(-1);
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    handlePeriodList(startDateTechPer,endDateTechPer);
  }

  };

  useEffect(() => {
    axiosInstance.get(`${endpoints.userManagement.academicYear}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAcademicYearDropdown(result?.data?.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);
  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      {window.location.pathname === '/teacher-circular' && <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleAcademicYear}
          id='grade'
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
              placeholder='Academic Year'
            />
          )}
        />
      </Grid>}
      {/* <<<<<<<DATE>>>>>>>> */}
      {/* {window.location.pathname === '/teacher-circular' && */}
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}> 
        <LocalizationProvider dateAdapter={MomentUtils} className='dropdownIcon'>
          <DateRangePicker
            startText='Select-Date-Range'
            size='small'
            value={dateRangeTechPer}
            onChange={(newValue) => {
              setDateRangeTechPer(newValue);
            }}
            renderInput={({ inputProps, ...startProps }, endProps) => {
              return (
                <>
                  <TextField
                    {...startProps}
                    format={(date) => moment(date).format('DD-MM-YYYY')}
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

      {window.location.pathname === '/teacher-circular' && <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleBranch}
          id='grade'
          className='dropdownIcon'
          value={filterData?.branch}
          options={branchDropdown}
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
      </Grid>}
      {window.location.pathname === '/teacher-circular' && <Grid
        item
        xs={12}
        sm={3}
        className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
      >
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='grade'
          className='dropdownIcon'
          value={filterData?.grade}
          options={gradeDropdown}
          getOptionLabel={(option) => option?.grade__grade_name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' />
          )}
        />
      </Grid>}

     {window.location.pathname ==='/teacher-circular' && <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleSection}
          id='grade'
          className='dropdownIcon'
          value={filterData?.section}
          options={sectionDropdown}
          getOptionLabel={(option) => option?.section__section_name}
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
      </Grid>}

      {!isMobile && (
        <Grid item xs={12} sm={12}>
          <Divider />
        </Grid>
      )}
      {isMobile && <Grid item xs={3} sm={0} />}
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
      {isMobile && <Grid item xs={3} sm={0} />}
      {isMobile && <Grid item xs={3} sm={0} />}
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          className='custom_button_master'
          size='medium'
          onClick={handleFilter}
        >
          FILTER
        </Button>
      </Grid>
      {window.location.pathname ==='/teacher-circular' && (
      <>
      <div>
        <Divider
          orientation='vertical'
          style={{
            backgroundColor: '#014e7b',
            height: '40px',
            marginTop: '1rem',
            marginLeft: '2rem',
            marginRight: '1.25rem',
          }}
        />
      </div>
      {isMobile && <Grid item xs={3} sm={0} />}
      <Grid
        item
        xs={6}
        sm={2}
        className={isMobile ? 'createButton' : 'createButton addButtonPadding'}
      >
        <Button
          startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          className='custom_button_master'
          onClick={() => history.push('/create-circular')}
          size='medium'
        >
          CREATE
        </Button>
      </Grid>
      </>
      )}
      {isMobile && <Grid item xs={3} sm={0} />}
    </Grid>
  );
};

export default CircularFilters;
