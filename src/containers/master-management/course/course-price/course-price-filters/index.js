import React, { useState, useContext, useEffect } from 'react';
import { TextField, Grid, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import './course-price-filters.css';

const CoursePriceFilters = (props) => {
  const {
    timeSlotDisplay,
    timeSlot,
    setTimeSlot,
    setCourseId,
    setCollectData,
    resetContent,
    selectedCourse,
    setSelectedCourse,
    courseKey,
    gradeKey,
    isEdit,
  } = props;
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedGrade, setSelectedGrade] = useState('');
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [gradeList, setGradeList] = useState([]);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.academics.grades}?branch_id=5`)
      .then((result) => {
        setGradeList([]);
        if (result.data.status_code === 200) {
          setGradeList(result.data?.data);
          if (courseKey && gradeKey) {
            const gradeObj = result.data?.data?.find(
              ({ grade_id }) => grade_id === Number(gradeKey)
            );
            setSelectedGrade(gradeObj);
            getCourseList(gradeKey);
          }
        }
      })
      .catch((error) => {
        setGradeList([]);
        setAlert('error', error.message);
      });
  }, []);

  const handleGrade = (event, value) => {
    setSelectedGrade('');
    setCourseList([]);
    setSelectedCourse('');
    resetContent();
    setCourseId('');
    if (value) {
      setSelectedGrade(value);
      getCourseList(value?.grade_id);
    }
  };

  const handleCourse = (event, value) => {
    setSelectedCourse('');
    resetContent();
    setCourseId('');
    if (value) {
      setSelectedCourse(value);
      setCourseId(value?.id);
    }
  };

  const getCourseList = (gradeId) => {
    axiosInstance
      .get(`${endpoints.academics.courses}?grade=${gradeId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setCourseList(result.data?.result);
          if (gradeKey && courseKey) {
            const courseObj = result.data?.result?.find(
              ({ id }) => id === Number(courseKey)
            );
            setSelectedCourse(courseObj);
          }
        } else {
          setCourseList([]);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setCourseList([]);
        setAlert('error', error.message);
      });
  };

  const [timeSlotList, setTimeSlotList] = useState([
    { slot: '12-3PM' },
    { slot: '3-6PM' },
    { slot: '6-9AM' },
    { slot: '9-12AM' },
  ]);

  const handleTimeSlot = (event, value) => {
    setTimeSlot([]);
    if (value.length > 0) {
      setTimeSlot(value);
    }
  };

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{ width: widerWidth, margin: wider }}
    >
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          size='small'
          id='grades'
          className='dropdownIcon'
          options={gradeList}
          getOptionLabel={(option) => option?.grade__grade_name}
          filterSelectedOptions
          value={selectedGrade}
          onChange={handleGrade}
          disabled={isEdit}
          renderInput={(params) => (
            <TextField
              {...params}
              size='small'
              variant='outlined'
              label='Grade'
              placeholder='Grade'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          size='small'
          id='courseName'
          className='dropdownIcon'
          options={courseList}
          getOptionLabel={(option) => option?.course_name}
          filterSelectedOptions
          value={selectedCourse}
          onChange={handleCourse}
          disabled={isEdit}
          renderInput={(params) => (
            <TextField
              {...params}
              size='small'
              variant='outlined'
              label='Course'
              placeholder='Course'
            />
          )}
        />
      </Grid>
      {!isMobile && <Grid item xs={0} sm={6} />}
      {timeSlotDisplay?.length > 0
        ? selectedCourse && (
            <Grid
              item
              xs={12}
              sm={9}
              className={isMobile ? 'timeSlotWrapper' : 'timeSlotWrapper filterPadding'}
            >
              <div className='timeSlotTag'>Time Slots:</div>
              {timeSlotDisplay.map((value) => (
                <div className='timeSlotValue'>{value}</div>
              ))}
            </Grid>
          )
        : selectedCourse && (
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                multiple
                size='small'
                id='timeSlots'
                className='dropdownIcon'
                options={timeSlotList}
                getOptionLabel={(option) => option?.slot}
                filterSelectedOptions
                value={timeSlot}
                onChange={handleTimeSlot}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    placeholder='Time Slot'
                    label='Time Slot'
                  />
                )}
              />
            </Grid>
          )}
    </Grid>
  );
};

export default CoursePriceFilters;
