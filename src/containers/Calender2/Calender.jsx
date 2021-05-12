/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */

import React, { useState } from 'react';
import * as dateFns from 'date-fns';
import Layout from '../Layout';

import './calender.css';
import {
  IconButton,
  Button,
  Grid,
  Typography,
  DialogContent,
  Dialog,
  TextField,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TodayIcon from '@material-ui/icons/Today';
import TodayOutlinedIcon from '@material-ui/icons/TodayOutlined';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { moment } from 'moment';

const Calendar = ({ meetingData, AddEvents }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));

  function handleDateChange(data) {
    setCurrentMonth(data || new Date());
    setSelectedDate(data || new Date());
  }
  function handleClose() {
    setOpen(false);
  }

  function handleToday() {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  }

  function renderHeader() {
    const dateFormat = 'MMMM yyyy';
    const nextMonth = () => {
      setCurrentMonth(dateFns.addMonths(currentMonth, 1));
    };
    const prevMonth = () => {
      setCurrentMonth(dateFns.subMonths(currentMonth, 1));
    };
    return (
      <Grid container style={{ padding: '10px' }}>
        <Grid item md={1} xs={1}>
          <Button style={{ textTransform: 'initial' }} onClick={() => handleToday()}>
            <TodayIcon />
            Today
          </Button>
        </Grid>
        <Grid item md={1} xs={1}>
          <Button style={{ textTransform: 'initial' }} onClick={() => setOpen(true)}>
            <TodayOutlinedIcon size='large' />
            Jump
          </Button>
        </Grid>
        <Grid item md={3} xs={3}>
          <IconButton className='nextBackButtons' onClick={prevMonth}>
            <ArrowBackIosIcon size='large' />
          </IconButton>
          <span
            style={{
              fontSize: '24px',
              color: 'steelblue',
              fontFamily: 'Arial',
              paddingLeft: '15px',
              paddingRight: '15px',
            }}
          >
            {dateFns.format(currentMonth, dateFormat)}
          </span>
          <IconButton className='nextBackButtons' onClick={nextMonth}>
            <ArrowForwardIosIcon size='large' />
          </IconButton>
        </Grid>
        <Grid item md={3} xs={3}>
          <Typography className='understandColor'>
            <span className='dot'>....</span>
            &nbsp; Events/Holydays
          </Typography>
        </Grid>
      </Grid>
    );
  }

  const onDateClick = (day) => {
    console.log('onDateClick');
    setSelectedDate(day);
  };

  function renderDays() {
    const dateFormat = 'dddd';
    const days = [];

    const startDate = dateFns.startOfWeek(currentMonth);
    for (let i = 0; i < 7; i += 1) {
      days.push(
        <div className='col col-center' key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return (
      <Grid container>
        <Grid item md={12} xs={12}>
          <div className='days row'> </div>
        </Grid>
      </Grid>
    );
  }

  // function webFunction(day) {
  //   if (wibenarData && wibenarData.length !== 0) {
  //     for (let i = 0; i < wibenarData.length; i += 1) {
  //       if (dateFns.isSameDay(day, wibenarData[i].meeting_date)) {
  //         return wibenarData[i];
  //       }
  //     }
  //   }
  //   return null;
  // }
  function metFunction(day) {
    if (meetingData && meetingData.length !== 0) {
      // console.log('meetingDate', meetingData);
      for (let i = 0; i < meetingData.length; i += 1) {
        // console.log(meetingData[i].start_time.split('T'));
        let dateconvert = new Date(`${meetingData[i].start_time.split('T')[0]}`);
        // console.log('day : ', day, 'dateCon : ', dateconvert);
        if (
          dateFns.isSameDay(day, new Date(`${meetingData[i].start_time.split('T')[0]}`))
        ) {
          return meetingData[i];
        }
      }
    }
    return null;
  }

  const converTime = (time) => {
    let hour = time.split(':')[0];
    let min = time.split(':')[1];
    const part = hour > 12 ? 'PM' : 'AM';
    min = `${min}`.length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = `${hour}`.length === 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  };

  function functionAddValidation(dateValid) {
    if (new Date(dateValid).getDate() === new Date().getDate()) {
      return false;
    }
    if (new Date(dateValid) > new Date()) {
      return false;
    }
    return true;
  }

  function renderCells() {
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);

    const endDate = dateFns.endOfWeek(monthEnd);
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    // console.log('day', startDate);

    // console.log('moment', new Date('2020-10-22'));
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i += 1) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        // console.log('clonday:', dateFns.toDate(cloneDay));
        const meetingInformation = metFunction(day);
        // console.log('meetingInformation : ', meetingInformation);

        days.push(
          <Button
            variant='outlined'
            style={{
              textAlign: 'center',
              height:
                auth && auth.personal_info && auth.personal_info.role === 'ContentWriter'
                  ? '100px'
                  : '120px',
              padding: '5px 5px 0px 0px',
              cursor: 'default',
              backgroundColor: 'white',
            }}
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? 'disabled'
                : dateFns.isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <Grid container style={{ textAlign: 'center' }}>
              <Grid item md={6} xs={12}>
                <Typography
                  className='number'
                  style={{
                    color:
                      dateFns.isSameDay(day, new Date()) &&
                      dateFns.isSameMonth(day, monthStart) &&
                      'red',
                  }}
                >
                  {formattedDate}
                </Typography>
              </Grid>
              {functionAddValidation(day) === false && (
                <Grid item md={6} xs={12}>
                  {/* {auth &&
                    auth.personal_info &&
                    auth.personal_info.role === 'Admin' && ( */}
                  <div className='overlay'>
                    <button
                      title='Schedule Webinar'
                      disabled={functionAddValidation(day)}
                      type='submit'
                      className='buttonstyle'
                      onClick={() => {
                        AddEvents(dateFns.toDate(cloneDay)); //parse is renamed to toDate
                      }}
                    >
                      <AddIcon />
                    </button>
                  </div>
                  {/* // )} */}
                </Grid>
              )}
              {meetingInformation &&
                meetingInformation.length !== 0 &&
                dateFns.isSameMonth(day, monthStart) && (
                  <Grid item md={12} xs={12} style={{ marginTop: '15px' }}>
                    <Typography
                      className='scheduledText'
                      style={{ lineHeight: '0.1', fontSize: '0.5rem' }}
                    >
                      <button type='submit' className='buttonstyle'>
                        {meetingInformation ? meetingInformation.event_name : 'no event'}
                        {/* {dateFns.isSameMonth(day, monthStart) &&
                        dateFns.isSameDay(
                          day,
                          meetingInformation && meetingInformation.length !== 0
                            ? `${meetingInformation.start_time.split('T')[0]}`
                            : null
                        )
                          ? `${converTime(
                              new Date(
                                meetingInformation.start_time.split('T')[0]
                              ).toTimeString()
                            )} Meeting`
                          : 'nodata'} */}
                      </button>
                      <br />
                      <button
                        type='submit'
                        className='buttonstyle'
                        style={{ color: 'tomato', fontSize: '15px' }}
                      >
                        {/* {meetingInformation &&
                        meetingInformation.start_time &&
                        meetingInformation.length !== 0 &&
                        meetingInformation.meetings.length - 1 !== 0
                          ? ` ${meetingInformation.meetings.length - 1}  more`
                          : ''} */}
                      </button>
                    </Typography>
                  </Grid>
                )}
            </Grid>
          </Button>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className='row' key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return (
      <div className='body' style={{ padding: '10px' }}>
        {rows}
      </div>
    );
  }

  return (
    <Layout>
      {' '}
      <Grid
        container
        className='calendar'
        // style={{
        //   width: auth.personal_info.role === 'ContentWriter' ? '1150px' : '1250px',
        //   overflow: 'auto',
        // }}
      >
        <Grid item md={12} xs={12} sm={12}>
          {renderHeader()}
        </Grid>
        <Grid item md={12} xs={12} sm={12}>
          {renderDays()}
        </Grid>
        <Grid item md={12} xs={12} sm={12}>
          {renderCells()}
        </Grid>
        <Grid item md={12} xs={12} sm={12}>
          <Dialog
            maxWidth='xl'
            open={open}
            close={handleClose}
            disableEnforceFocus
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            closeAfterTransition
          >
            <DialogContent>
              <Grid container style={{ textAlign: 'center' }}>
                <Grid item md={12} xs={12}>
                  <Typography variant='h4' style={{ float: 'left', textAlign: 'left' }}>
                    Jump To
                  </Typography>
                  <IconButton
                    onClick={() => handleClose()}
                    style={{ float: 'right', textAlign: 'right' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    type='date'
                    value={selectedDate}
                    variant='outlined'
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Button onClick={handleClose} variant='contained' color='primary'>
                    Jump
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </Layout>
  );
};

Calendar.propTypes = {
  meetingData: PropTypes.instanceOf(Object).isRequired,
};

export default Calendar;
