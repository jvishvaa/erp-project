import React, { useContext, useEffect, useState, useStyles } from 'react';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  withStyles,
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import { useLocation } from 'react-router-dom';

const StyledTabs = withStyles((theme) => ({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 85,
      width: '80%',
      backgroundColor: theme.palette.primary.main,
    },
  },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(0),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const GeneralDairyFilter = ({
  handleDairyList,
  setPeriodData,
  isTeacher,
  showSubjectDropDown,
  sessionYear,
  // studentModuleId,
  // setCurrentTab,
  setViewMore,
  setViewMoreData,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  //   const [subjectIds, setSubjectIds] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);
  const [gradeIds,setGradeIds] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [isEmail, setIsEmail] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [page, setPage] = useState(1);
  const [clicked, setClicked] = useState(false);
  const history = useHistory();
  const [studentModuleId, setStudentModuleId] = useState();
  // const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const location = useLocation();
  // const [academicYearDropdown,setAcademicYearDropdown] = useState([])

  const [filterData, setFilterData] = useState({
    grade: '',
    branch: '',
    subject: '',
    sectionIds: [],
    sections: [],
    year: '',
    // setSectionDropdown([])
  });
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Diary' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item?.child_name === 'Student Diary' &&
              window.location.pathname === '/diary/student'
            ) {
              setModuleId(item.child_id);
            }
            if (
              item?.child_name === 'Teacher Diary' &&
              window.location.pathname === '/diary/teacher'
            ) {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  // useEffect(() => {
  //   if (NavData && NavData.length) {
  //     NavData.forEach((item) => {
  //       if (
  //         item.parent_modules === 'Diary' &&
  //         item.child_module &&
  //         item.child_module.length > 0
  //       ) {
  //         item.child_module.forEach((item) => {
  //           if(location.pathname === "/diary/student" && item.child_name === "Student View") {
  //               setStudentModuleId(item?.child_id);
  //           } else if(location.pathname === "/diary/teacher" && item.child_name === "Teacher Diary") {
  //               setTeacherModuleId(item?.child_id);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, [location.pathname]);

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
      grade: '',
      branch: '',
      sectionIds: [],
      sections: [],
      year: '',
      // setSectionDropdown([])
    });
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
    setDateRange([moment().subtract(6, 'days'), moment()]);
    setFilterData({ subject: '', chapter: '' });
    setSectionDropdown([]);
    setSectionIds([]);
    setPeriodData([]);
    setSectionDropdown([]);
    // setViewMoreData({});
    // setViewMore(false);
  };
  const handleTabChange = (event, tab) => {
    //handleFilter();
    setCurrentTab(tab);
    setIsEmail(!isEmail);
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    if (tab === 2 && !isTeacher) {
      axiosInstance
        .get(`${endpoints.dailyDairy.chapterList}?module_id=${moduleId}&session_year=${sessionYear?.id}`)
        .then((res) => {
          if (res.data.status_code === 200) {
            setSubjectDropdown(res.data.result);
          } else {
            setAlert('error', res.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
    // else if(tab === 0){
    //   handleFilter(tab)
    // }
  };

  useEffect(() => {
    if (clicked) {
      handleFilter(activeTab);
    }
  }, [activeTab]);

  let sectionId = [];
  let allSectionIds = [];
  const handleGrade = (event, value) => {
    value =
      value.filter(({ grade__grade_name }) => grade__grade_name === 'Select All').length === 1
        ? [...gradeDropdown].filter(({ grade__grade_name }) => grade__grade_name !== 'Select All')
        : value;
    setFilterData({
      ...filterData,
      grade: '',
      subject: '',
      chapter: '',
      sections: [],
      sectionIds: [],
    });
    if (value && filterData.branch) {
      // https://erpnew.letseduvate.com/qbox/academic/general-dairy-messages/?branch=5&grades=25&sections=44&page=1&start_date=2021-02-02&end_date=2021-02-08&dairy_type=2
      setFilterData({
        ...filterData,
        grade: value,
        subject: '',
        chapter: '',
        sections: [],
        sectionIds: [],
      });
      if (value.length > 0) {
        setGradeIds(value.map(gradeObj => gradeObj.grade_id).join(','))
        axiosInstance
          .get(
            `${endpoints.masterManagement.sections}?session_year=${filterData?.year?.id}&branch_id=${filterData?.branch?.branch?.id}&grade_id=${value.map(gradeObj => gradeObj.grade_id).join(',')}&module_id=${moduleId}`
          )
          .then((result) => {
            if (result?.data?.status_code === 200) {
              const sectionData = result?.data?.data || [];
              for (let i = 0; i < sectionData?.length; i++) {
                allSectionIds.push(sectionData[i]?.section_id)
              }
              sectionData.unshift({
                section__section_name: 'Select All',
                section_id: allSectionIds,
              });
              setSectionDropdown(result?.data?.data);
              setSectionIds([]);
            } else {
              setAlert('error', result.data.message);
              setSectionDropdown([]);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setSectionDropdown([]);
          });
      }
    } else {
      setSectionDropdown([]);
    }
  };

  const handleAcademicYear = (event = {}, value = '') => {
    setFilterData({
      ...filterData,
      year: '',
      branch: '',
      grade: '',
      sectionIds: [],
      sections: [],
    });
    if (value) {
      setFilterData({ ...filterData, year: value, branch: '', grade: '' });
      axiosInstance
        .get(
          `${endpoints.masterManagement.branchMappingTable}?session_year=${value?.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result?.data?.status_code) {
            setBranchDropdown(result?.data?.data?.results);
          } else {
            setAlert('error', result?.message);
          }
        })
        .catch((error) => setAlert('error', error?.message));
    }
  };

  const handleSection = (event, value) => {
    // sectionId = [];
    setFilterData({ ...filterData,
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      sections: [],
      sectionIds: [],});
    if (value) {
      const ids =
        value &&
        value.map((el) => {
          sectionId.push(el.id);
          return el.section_id;
        });
      setFilterData({ ...filterData, sections: value });
      setSectionIds(ids);
      // setSectionDropdown([])
    }
  };
  let allGradeIds = []
  const handleBranch = (event, value) => {
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      sections: [],
      sectionIds: [],
    });
    // setOverviewSynopsis([]);
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
        grade: [],
        subject: '',
        chapter: '',
        sections: [],
        sectionIds: [],
      });
      axiosInstance
        .get(
          `${endpoints.communication.grades}?session_year=${filterData?.year?.id}&branch_id=${value?.branch?.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            const gradeData = result?.data?.data || [];
            for (let i = 0; i < gradeData.length; i++) {
              allGradeIds.push(gradeData[i].grade_id)
            }
            gradeData.unshift({
              grade__grade_name: 'Select All',
              grade_id: allGradeIds,
            });
            setGradeDropdown(gradeData);
          } else {
            setAlert('error', result.data.message);
            setGradeDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setGradeDropdown([]);
        });
    } else {
      setGradeDropdown([]);
    }
  };
  // console.log('The grade id', userDetails);

  const handleFilter = (e) => {
    setClicked(true);
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    if (e === undefined && activeTab === 0) {
      return;
    }
    if (isTeacher) {
      if (
        filterData.year === '' ||
        filterData.branch === '' ||
        filterData.grade === '' ||
        sectionIds.length === 0
      ) {
        setAlert('warning', 'Please select filters');
      } else {
        handleDairyList(
          filterData.branch.branch.id,
          filterData?.grade[0]?.grade_id,
          sectionIds,
          startDateTechPer,
          endDateTechPer,
          activeTab,
          page,
          filterData.subject,
          moduleId,
          filterData?.year,
          gradeIds
        );
      }
    } else if (userDetails?.personal_info?.role !== 'SuperUser' && !isTeacher) {
      const grade_id = userDetails.role_details?.grades?.grade_id;
      const branch_id = userDetails.role_details?.branch[0]?.id;

      handleDairyList(
        branch_id,
        grade_id,
        sectionIds,
        startDateTechPer,
        endDateTechPer,
        activeTab,
        page,
        filterData.subject,
        moduleId,
        filterData?.year,
        gradeIds
      );
    }
  };

  const handleSubject = (event, value) => {
    setFilterData({ ...filterData, subject: value, chapter: '' });
  };

  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setAcademicYearDropdown(result?.data?.data);
            const defaultValue = result.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      {isTeacher && (
        <>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleAcademicYear}
              id='academic-year'
              className='dropdownIcon'
              value={filterData?.year || {}}
              options={academicYearDropdown || []}
              getOptionLabel={(option) => option?.session_year}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                required
                  label='Academic Year'
                  placeholder='Academic Year'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBranch}
              id='academic-year'
              className='dropdownIcon'
              value={filterData?.branch || {}}
              options={branchDropdown}
              getOptionLabel={(option) => option?.branch?.branch_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  required
                  placeholder='Branch'
                />
              )}
            />
          </Grid>
        </>
      )}

      {isTeacher && (
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            multiple
            style={{ width: '100%' }}
            limit={2}
            size='small'
            onChange={handleGrade}
            id='volume'
            className='dropdownIcon'
            value={filterData?.grade || {}}
            options={gradeDropdown}
            getOptionLabel={(option) => option?.grade__grade_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
                required
              />
            )}
          />
        </Grid>
      )}
      {isTeacher && (
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            multiple
            style={{ width: '100%' }}
            size='small'
            onChange={handleSection}
            id='subj'
            className='dropdownIcon'
            value={filterData?.sections || {}}
            options={sectionDropdown}
            getOptionLabel={(option) => option?.section__section_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
                required
              />
            )}
          />
        </Grid>
      )}
      {showSubjectDropDown && activeTab === 2 ? (
        <Grid
          item
          xs={12}
          sm={4}
          className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
        >
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleSubject}
            id='subject'
            className='dropdownIcon'
            value={filterData?.subject}
            options={subjectDropdown}
            getOptionLabel={(option) => option?.subject_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subject'
                placeholder='Subject'
                required
              />
            )}
          />
        </Grid>
      ) : (
        ''
      )}
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
                required
                  />
                </>
              );
            }}
          />
        </LocalizationProvider>
      </Grid>

      {!isMobile && <Grid item xs sm={3} />}
      <Grid item xs={12} sm={12}>
        <Divider />
      </Grid>

      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
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
      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white', width: '100%' }}
          color='primary'
          size='medium'
          type='submit'
          // disabled={!filterData?.grade}
          onClick={(event) => handleFilter(event)}
        >
          Filter
        </Button>
      </Grid>
      {isTeacher && (
        <Grid item xs={6} sm={4} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white', width: '100%' }}
            color='primary'
            size='medium'
            type='submit'
            onClick={() => history.push('/create/general-diary')}
          >
            Create General Diary
          </Button>
        </Grid>
      )}
      {isTeacher && (
        <Grid item xs={6} sm={4} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white', width: '100%' }}
            color='primary'
            size='medium'
            type='submit'
            onClick={() => history.push('/create/daily-diary')}
          >
            Create Daily Diary
          </Button>
        </Grid>
      )}
      <Grid item xs={12} sm={12}>
        <StyledTabs
          variant='standard'
          value={currentTab}
          onChange={handleTabChange}
          aria-label='styled tabs example'
        >
          <StyledTab
            label={<Typography variant='h8'>All</Typography>}
            onClick={(e) => handleActiveTab(0)}
          />
          <StyledTab
            label={<Typography variant='h8'>Daily Diary</Typography>}
            onClick={(e) => handleActiveTab(2)}
          />
          <StyledTab
            label={<Typography variant='h8'>General Diary</Typography>}
            onClick={(e) => handleActiveTab(1)}
          />
        </StyledTabs>
      </Grid>
    </Grid>
  );
};
export default GeneralDairyFilter;
