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
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import GetAppIcon from '@material-ui/icons/GetApp';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { OnlineclassViewContext } from '../../../online-class-context/online-class-state';

const ViewClassManagementFilters = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isCancelSelected, setIsCancelSelected] = useState(false);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [gradeIds, setGradeIds] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);

  const { subjects = [] } = useSelector((state) => state.academic);

  const {
    listOnlineClassesManagementView,
    dispatch,
    listGrades,
    listSections,
    grades,
    sections,
  } = useContext(OnlineclassViewContext);

  const handleTabChange = (event, tab) => {
    setCurrentTab(tab);
  };

  const handleCancel = (event, data) => {
    setIsCancelSelected(data);
  };

  const handleDateChange = (name, date) => {
    if (name === 'startDate') setStartDate(date);
    else setEndDate(date);
  };

  const handleGrade = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el.grade_id);
      setGradeIds(ids);
      dispatch(listSections(ids));
    } else {
      setGradeIds([]);
    }
  };

  const handleSection = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el.section_id);
      setSectionIds(ids);
    } else {
      setSectionIds([]);
    }
  };

  const handleGetClasses = () => {
    const isCompleted = !!currentTab;
    let url = `page_number=1&page_size=10&branch_ids=1&is_completed=${isCompleted}&user_id=60&is_cancelled=${isCancelSelected}&start_date=${startDate}&end_date=${endDate}`;

    if (subjectIds.length) {
      url += `&subject_id=${subjectIds.join(',')}`;
    }

    if (sectionIds.length) {
      url += `&section_mapping_ids${sectionIds.join(',')}`;
    } else if (gradeIds.length) {
      url += `&grade_ids=${gradeIds.join(',')}`;
    }
    dispatch(listOnlineClassesManagementView(url));
  };

  const handleSubject = (event, value) => {
    const ids = value.map((el) => el.id);
    setSubjectIds(ids);
  };

  useEffect(() => {
    handleGetClasses();
    dispatch(listGrades());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  return (
    <div className='filters__container'>
      <Grid container spacing={3}>
        <Grid item>
          <Autocomplete
            multiple
            size='small'
            onChange={handleGrade}
            id='create__class-branch'
            options={grades}
            getOptionLabel={(option) => option?.grade__grade_name}
            filterSelectedOptions
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
        <Grid item>
          {gradeIds.length ? (
            <Autocomplete
              size='small'
              multiple
              onChange={handleSection}
              id='create__class-section'
              options={sections}
              getOptionLabel={(option) => {
                return `${option.section__section_name}`;
              }}
              filterSelectedOptions
              // value={[]}
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
          ) : (
            ''
          )}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            multiple
            id='tags-outlined'
            options={subjects}
            onChange={handleSubject}
            getOptionLabel={(option) => option.subject_name}
            filterSelectedOptions
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
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
              size='small'
              color='primary'
              disableToolbar
              variant='inline'
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
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
              size='small'
              disableToolbar
              variant='inline'
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
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={12} sm={2}>
          <Button className='viewclass__management-btn' variant='contained' disabled>
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
        <Grid item xs={12} sm={2}>
          <Button
            className='viewclass__management-btn'
            startIcon={<GetAppIcon />}
            variant='outlined'
            color='primary'
          >
            bulk excel
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant='fullWidth'
            indicatorColor='primary'
            textColor='primary'
            aria-label='icon label tabs example'
            className='managementview-tabs'
          >
            <Tab
              // disabled={loadingStudentOnlineClasses}
              label={<Typography variant='h6'>Upcoming</Typography>}
            />
            <Tab
              // disabled={loadingStudentOnlineClasses}
              label={<Typography variant='h6'>Completed</Typography>}
            />
          </Tabs>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            className='cancelled-class-check'
            control={
              <Checkbox
                checked={isCancelSelected}
                onChange={handleCancel}
                name='cancel'
                color='primary'
              />
            }
            label='Cancelled class'
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClassManagementFilters;
