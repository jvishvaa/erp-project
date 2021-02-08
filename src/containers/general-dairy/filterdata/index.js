import React, { useContext, useEffect, useState, useStyles } from 'react';
import Divider from '@material-ui/core/Divider';
import {useHistory} from 'react-router-dom'
import { Grid, TextField, Button, useTheme, withStyles, Tabs, Tab, Typography} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
// import './lesson-report.css';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 85,
      width: '80%',
      backgroundColor: '#ff6b6b',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#014b7e',
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
  const [volumeDropdown, setVolumeDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionDropdown,setSectionDropdown] = useState([])
  const [branchDropdown, setBranchDropdown] = useState([]);
//   const [subjectIds, setSubjectIds] = useState([]);
const [sectionIds,setSectionIds] = useState([])
  const [branchId, setBranchId] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [isEmail, setIsEmail] = useState(false);
  const [selectAll, setSelectAll] = useState(false);


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
const history=useHistory()

  const [filterData, setFilterData] = useState({
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
      grade: '',
      branch: '',
    });
    setPeriodData([]);
    setSectionDropdown([]);
    // setViewMoreData({});
    // setViewMore(false);
  };
  const handleTabChange = (event, tab) => {
    debugger
    setCurrentTab(tab);
    setIsEmail(!isEmail);
    
  
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', subject: '', chapter: '' });
    // setOverviewSynopsis([]);
    if (value && filterData.branch) {
        setFilterData({ ...filterData, grade: value, subject: '', chapter: '' });
        axiosInstance.get(`${endpoints.masterManagement.sections}?branch_id=${filterData.branch.id}&grade_id=${value.grade_id}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    console.log(result.data)
                    setSectionDropdown(result.data.data);
                }
                else {
                    setAlert('error', result.data.message);
                   setSectionDropdown([])
                }
            })
            .catch(error => {
                setAlert('error', error.message);
                setSectionDropdown([])
            })
    }
    else {
        setSectionDropdown([])
    }
};


  const handleSection = (event, value) => {
    setFilterData({ ...filterData });
    if (value.length) {
      const ids = value.map((el) => el.id);
    //   setSubjectIds(ids);
    setSectionIds(ids)
    }
  };


  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '' });
    // setOverviewSynopsis([]);
    if (value) {
        setFilterData({ ...filterData, branch: value, grade: '', subject: '', chapter: '' });
        axiosInstance.get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=8`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setGradeDropdown(result.data.data);
                }
                else {
                    setAlert('error', result.data.message);
                    setGradeDropdown([]);
                }
            })
            .catch(error => {
                setAlert('error', error.message);
                setGradeDropdown([]);
            })
    }
    else {
        setGradeDropdown([]);
    }
};

  const handleFilter = () => {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    // alert(filterData.grade.grade_id,sectionIds,startDateTechPer,endDateTechPer)
    handleDairyList(
        filterData.branch.id,
      filterData.grade.grade_id,
        sectionIds,
      startDateTechPer,
      endDateTechPer
    );
  };

    useEffect(() => {
        axiosInstance.get(`${endpoints.communication.branches}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setBranchDropdown(result.data.data);
                } else {
                    setAlert('error', result.data.message);
                }
            }).catch(error => {
                setBranchDropdown('error', error.message);
            })
  }, []);

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          multiple
          style={{ width: '100%' }}
          size='small'
          onChange={handleSection}
          id='subj'
          className='dropdownIcon'
          // value={filterData?.subject}
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
      </Grid>
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
      <Grid item xs={6} sm={3} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          className='custom_button_master'
          size='medium'
          type='submit'
          onClick={()=>history.push("/create/general-dairy")}
        >
          CREATE GENERAL DAIRY
        </Button>
      </Grid>
      <Grid item xs={6} sm={3} className={isMobile ? '' : 'addButtonPadding'}>
        <Button
          variant='contained'
          style={{ color: 'white' }}
          color='primary'
          className='custom_button_master'
          size='medium'
          type='submit'
          onClick={()=>history.push("/create/general-dairy")}
        >
          CREATE DAILY DAIRY
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
            <StyledTabs
              variant='standard'
              value={currentTab}
              onChange={handleTabChange}
              aria-label='styled tabs example'
            >
              <StyledTab label={<Typography variant='h8'>All</Typography>} />
              <StyledTab label={<Typography variant='h8'>Daily Dairy</Typography>} />
              <StyledTab label={<Typography variant='h8'>General Dairy</Typography>} />
            </StyledTabs>
          </Grid>
    </Grid>
  );
};
export default GeneralDairyFilter;
