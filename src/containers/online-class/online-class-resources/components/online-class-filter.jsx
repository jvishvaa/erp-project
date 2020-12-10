import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import GetAppIcon from '@material-ui/icons/GetApp';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../../config/axios';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';
import endpoints from '../../../../config/endpoints';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 100,
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

const OnlineClassFilter = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isCancelSelected, setIsCancelSelected] = useState(false);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [gradeIds, setGradeIds] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);
  const [clearKey, setClearKey] = useState(new Date());
  const [subjects, setSubjects] = useState([]);
  const [moduleId, setModuleId] = useState();
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [sectionMappingIds,setSectionMappingIds]=useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const {
    resourceView: { currentPage },
    listOnlineClassesResourceView,
    dispatch,
    listGrades,
    listSections,
    grades,
    sections,
    setCurrentResourceTab,
  } = useContext(OnlineclassViewContext);

  const { setAlert } = useContext(AlertNotificationContext);

  const { role_details: roleDetails } = JSON.parse(localStorage.getItem('userDetails'));

  const handleTabChange = (event, tab) => {
    setCurrentTab(tab);
    setCurrentResourceTab(tab);
  };

  const handleDateChange = (name, date) => {
    if (name === 'startDate') setStartDate(date);
    else setEndDate(date);
  };

  const listSubjects = async (gradeids, sectionIds) => {
    try {
      const { data } = await axiosInstance(
        `${endpoints.academics.subjects}?branch=${roleDetails.branch.join(
          ','
        )}&grade=${gradeids.join(',')}&section=${sectionIds.join(
          ','
        )}&module_id=${moduleId}`
      );
      setSubjects(data.data);
    } catch (error) {
      setAlert('error', 'Failed to load subjects');
    }
  };

  const handleGrade = (event, value) => {
    setSelectedGrades(value);
    if (value.length) {
      const ids = value.map((el) => el.grade_id);
      setGradeIds(ids);
      // listSubjects(ids);
      dispatch(listSections(ids, moduleId));
    } else {
      setGradeIds([]);
      setSubjects([]);
      setSectionIds([]);
    }
  };

  const handleSection = (event, value) => {
    setSelectedSections(value);
    if (value.length) {
      const ids = value.map((el) => el.section_id);
      setSectionIds(ids);
      const mapIds = value.map((el) => el.id);
      setSectionMappingIds(mapIds)
      listSubjects(gradeIds, ids);
    } else {
      setSectionIds([]);
    }
  };

  const handleGetClasses = () => {
    const { role_details: roleDetails, is_superuser: isSuperUser } = JSON.parse(
      localStorage.getItem('userDetails')
    );
    const isCompleted = !!currentTab;
    let url = '';
    if (isSuperUser) {
      url += `module_id=${moduleId}&page_number=${currentPage}&page_size=10&branch_ids=${roleDetails.branch.join(
        ','
      )}&is_completed=${isCompleted}&is_cancelled=${isCancelSelected}&start_date=${startDate}&end_date=${endDate}`;
    } else {
      url += `module_id=${moduleId}&page_number=${currentPage}&page_size=10&branch_ids=${roleDetails.branch.join(
        ','
      )}&is_completed=${isCompleted}&user_id=${
        roleDetails.erp_user_id
      }&is_cancelled=${isCancelSelected}&start_date=${startDate}&end_date=${endDate}`;
    }

    if (subjectIds.length) {
      url += `&subject_id=${subjectIds.join(',')}`;
    }

    if (sectionMappingIds.length) {
      url += `&section_mapping_ids=${sectionMappingIds.join(',')}`;
    } else if (gradeIds.length) {
      url += `&grade_ids=${gradeIds.join(',')}`;
    }
    dispatch(listOnlineClassesResourceView(url));
  };

  const handleSubject = (event, value) => {
    setSelectedSubjects(value);
    const ids = value.map((el) => el.subject__id);
    setSubjectIds(ids);
  };

  const handleClear = () => {
    setGradeIds([]);
    setSectionIds([]);
    setSubjectIds([]);
    setSectionMappingIds([])
    setSelectedGrades([])
    setSelectedSections([])
    setIsCancelSelected(false);
    setStartDate(moment().format('YYYY-MM-DD'));
    setEndDate(moment().format('YYYY-MM-DD'));
    setClearKey(new Date());
  };

  useEffect(() => {
    if (moduleId) {
      handleGetClasses();
      dispatch(listGrades(moduleId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, clearKey, moduleId, currentPage]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Resources') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    const filteredSelectedSubjects = subjects.filter(
      (subject) =>
        selectedSubjects.findIndex((data) => data.subject__id == subject.subject__id) > -1
    );

    setSelectedSubjects(filteredSelectedSubjects);
  }, [subjects]);

  useEffect(() => {
    const filteredSelectedSections = sections.filter(
      (data) =>
        selectedSections.findIndex((sec) => sec.section_id == data.section_id) > -1
    );
    setSelectedSections(filteredSelectedSections);
  }, [sections]);

  return (
    <div className='filters__container'>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={2}>
          <Autocomplete
            key={clearKey}
            multiple
            size='small'
            onChange={handleGrade}
            id='create__class-branch'
            options={grades}
            getOptionLabel={(option) => option?.grade__grade_name}
            filterSelectedOptions
            value={selectedGrades}
            renderInput={(params) => (
              <TextField
                className='create__class-textfield'
                {...params}
                variant='outlined'
                label='Grades'
                placeholder='Grades'
              />
            )}
          />
        </Grid>
        {gradeIds.length ? (
          <Grid item xs={12} sm={2}>
            <Autocomplete
              key={clearKey}
              size='small'
              multiple
              onChange={handleSection}
              id='create__class-section'
              options={sections}
              getOptionLabel={(option) => {
                return `${option.section__section_name}`;
              }}
              filterSelectedOptions
              value={selectedSections}
              renderInput={(params) => (
                <TextField
                  className='create__class-textfield'
                  {...params}
                  variant='outlined'
                  label='Sections'
                  placeholder='Sections'
                />
              )}
            />
          </Grid>
        ) : (
          ''
        )}
        {sectionIds.length ? (
          <Grid item xs={12} sm={4}>
            <Autocomplete
              key={clearKey}
              multiple
              id='tags-outlined'
              options={subjects}
              onChange={handleSubject}
              getOptionLabel={(option) => option.subject__subject_name}
              filterSelectedOptions
              value={selectedSubjects}
              size='small'
              renderInput={(params) => (
                <TextField
                  className='create__class-textfield'
                  {...params}
                  variant='outlined'
                  label='Subject'
                  placeholder='Subject'
                  color='primary'
                />
              )}
            />
          </Grid>
        ) : (
          ''
        )}
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
              size='small'
              color='primary'
              // disableToolbar
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker-start-date'
              label='Start date'
              value={startDate}
              onChange={(event, date) => {
                handleDateChange('startDate', date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{ marginTop: -6 }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
              size='small'
              // disableToolbar
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker-end-date'
              name='endDate'
              label='End date'
              value={endDate}
              onChange={(event, date) => {
                handleDateChange('endDate', date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{ marginTop: -6 }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        {/* <Grid item xs={12} sm={2}>
          <Button className='viewclass__management-btn'>
            bulk excel
          </Button>
        </Grid> */}
      </Grid>
      <Grid container spacing={5} style={{ marginTop: 20 }}>
        <Grid item xs={12} sm={2}>
          <Button
            className='viewclass__management-btn'
            variant='contained'
            onClick={handleClear}
            disabled={!gradeIds.length && !subjectIds.length}
            style={{ color: '#8c8c8c' }}
          >
            Clear all
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            className='viewclass__management-btn'
            variant='contained'
            color='primary'
            onClick={handleGetClasses}
          >
            get classes
          </Button>
        </Grid>
      </Grid>
      <hr style={{ margin: '40px auto 20px auto' }} />
      <Grid container spacing={0} className='viewmanagement-tabs-container'>
        <Grid item xs={12} sm={6}>
          <StyledTabs
            variant='standard'
            value={currentTab}
            onChange={handleTabChange}
            aria-label='styled tabs example'
          >
            <StyledTab label={<Typography variant='h6'>Upcoming</Typography>} />
            <StyledTab label={<Typography variant='h6'>Completed</Typography>} />
          </StyledTabs>
        </Grid>
      </Grid>
    </div>
  );
};

export default OnlineClassFilter;
