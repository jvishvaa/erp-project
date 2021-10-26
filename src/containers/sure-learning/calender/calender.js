/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useState,useEffect} from 'react';
import 'date-fns';
import {addMonths,subMonths,format,startOfWeek,addDays, isSameDay,startOfMonth,endOfMonth,isSameMonth,parse,endOfWeek,parseISO } from 'date-fns';
import './calender.css';
import {
  IconButton,withStyles, Button, Grid, Typography, DialogContent, Dialog, TextField,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TodayIcon from '@material-ui/icons/Today';
import TodayOutlinedIcon from '@material-ui/icons/TodayOutlined';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import urls from 'config/endpoints';
import axios from 'axios';

const Calendar = ({ meetingData, wibenarData, onlineClassData, allMeetingsFunction, allwibenarsFunction, AddMeetingAndWibenar, viewMultipleWibenars, viewMultipleMeetings, viewOnlineClass, viewAllOnlineClass }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [permission, setPermission] = useState([]);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  const StyledButton = withStyles((theme) => ({
    root: {
      backgroundColor: 'white',
      color: '#FFFFFF',
      padding: '8px 15px',
      '&:hover': {
        backgroundColor: 'white',
      },
    },
  }))(Button);
  const StyledButton1 = withStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFFFFF',
      padding: '8px 15px',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }))(Button);
  const getAccess = () => {
    let moduleId = localStorage.getItem('Meeting') !== "null" ? localStorage.getItem('Meeting') : localStorage.getItem('Webinar')
    axios.get(urls.sureLearning.getPermissons, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.personal_info.token}`,
        module : "166"
      },
    })
    .then(response => {
      setPermission(response.data.response);
    }).catch(error => {
      console.log(error.response, "auth response");
    })
  };

  useEffect(() => {
    getAccess()
  }, [])

  const {
    data: modulePermission,
    isLoading: modulePermissionLoading,
    doFetch: fetchModulePermission,
  } = axios(null)
    useEffect(() => {
   const fetchModulePermission=()=>({
      url: `${urls.sureLearning.getPermissons}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: '166'
      },
    });
  },[])

  // function handleDateChange(e) {
  //   console.log(format(parseISO(e.target.value)),'date-fns');
  //   setCurrentMonth(format(parseISO(e.target.value ))|| new Date());
  //   setSelectedDate(format(parseISO(e.target.value) )|| new Date());
  // }
  function handleDateChange(data) {
    console.log(new Date(data),'date');
    setCurrentMonth(new Date(data) || new Date());
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
      setCurrentMonth(addMonths(currentMonth, 1));
    };
    const prevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
    };

    return (
      <Grid container style={{ padding: '10px' }}>
        <Grid item md={1} xs={1}>
          <StyledButton1 style={{ textTransform: 'initial' }} onClick={() => handleToday()}>
            <TodayIcon />
            Today
          </StyledButton1>
        </Grid>
        <Grid item md={1} xs={1}>
          <StyledButton1 style={{ textTransform: 'initial' }} onClick={() => setOpen(true)}>
            <TodayOutlinedIcon size="large" />
            Jump
          </StyledButton1>
        </Grid>
        <Grid item md={3} xs={3}>
          <IconButton className="nextBackButtons" onClick={prevMonth}>
            <ArrowBackIosIcon size="large" />
          </IconButton>
          <span style={{ fontSize: '24px', color: 'steelblue', fontFamily: 'Arial', paddingLeft: '15px', paddingRight: '15px' }}>{format(new Date(currentMonth), dateFormat)}</span>
          <IconButton className="nextBackButtons" onClick={nextMonth}>
            <ArrowForwardIosIcon size="large" />
          </IconButton>
        </Grid>
        <Grid item md={3} xs={3}>
          <Typography className="understandColor">
            <span className="dot">....</span>
            &nbsp;
            Meeting, Webinar & Online Class
          </Typography>
        </Grid>
        <Grid item md={1} xs={1}>
          <Typography className="understandColor">
            <span className="dot1">....</span>
            &nbsp;
            Meeting
          </Typography>
        </Grid>
        <Grid item md={1} xs={1}>
          <Typography className="understandColor">
            <span className="dot2">....</span>
            &nbsp;
            Webinar
          </Typography>
        </Grid>
        <Grid item md={2} xs={2}>
          <Typography className="understandColor">
            <span className="dot3">....</span>
            &nbsp;
            Online Class
          </Typography>
        </Grid>
      </Grid>
    );
  }

  const onDateClick = (day) => {
    setSelectedDate(day);
    console.log('onDateClick',day)

  };

  function renderDays() {
    const dateFormat = 'EEEE';
    const days = [];
    // className="col col-center"
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i += 1) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      console.log(days,'daysdays')

      );
    }

    return (
      <Grid container>
        <Grid item md={12} xs={12}>
          <div className="days row">{days}</div>
        </Grid>
      </Grid>
    );
  }

  function webFunction(day) {
    if (wibenarData && wibenarData.length >= 0) {
      for (let i = 0; i < wibenarData.length; i += 1) {
        if (isSameDay(day, new Date(wibenarData[i].meeting_date))) {
          console.log("wibenarData",wibenarData[i])
          return wibenarData[i];

        }
      }
    }
    return null;
  }
  function metFunction(day) {
    if (meetingData && meetingData.length >= 0) {
      for (let i = 0; i < meetingData.length; i += 1) {
        if (isSameDay(day, new Date(wibenarData[i].meeting_date))) {
          return meetingData[i];
        }
      }
    }
    return null;
  }
  function onlineFunction(day) {
    if (onlineClassData && onlineClassData.length >= 0) {
      for (let i = 0; i < onlineClassData.length; i += 1) {
        if (isSameDay(day, new Date(wibenarData[i].meeting_date))) {
          return onlineClassData[i];
        }
      }
    }
    return null;
  }

  const converTime = (time) => {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    const part = hour > 11 ? 'PM' : 'AM';
    min = (`${min}`).length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (`${hour}`).length === 1 ? `0${hour}` : hour;
    return (`${hour}:${min} ${part}`);
  };

  function functionAddValidation(dateValid) {
    if (new Date(dateValid).getDate() === new Date().getDate()) {
      return false;
    } if (new Date(dateValid) > new Date()) {
      return false;
    }
    return true;
  }

  function renderCells() {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = 'dd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i += 1) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const wibenarInformation = webFunction(day);
        const meetingInformation = metFunction(day);
        const onlineClassInformation = onlineFunction(day);
        console.log('day',formattedDate)
        days.push(
          <StyledButton
            variant="outlined"
            style={{ textAlign: 'center', height: auth && auth.personal_info && auth.personal_info.role === 'ContentWriter' ? '100px' : '120px', padding: '5px 5px 0px 0px', cursor: 'default' }}
            className={`col cell ${
              !isSameMonth(day, new Date(monthStart))
                ? 'disabled'
                : isSameDay(day, new Date(selectedDate)) ? 'selected' : ''
            }`}
            id={`${
              (isSameMonth(day, monthStart)) && ((wibenarInformation && wibenarInformation.webinar.length === 0 && meetingInformation && meetingInformation.meetings.length !== 0 && onlineClassInformation && onlineClassInformation.online_classes.length === 0) // meeting
                ? 'meetingRec'
                : (wibenarInformation && wibenarInformation.webinar.length !== 0 && meetingInformation && meetingInformation.meetings.length === 0 && onlineClassInformation && onlineClassInformation.online_classes.length === 0) // Webinar
                  ? 'webniarRec'
                  : (wibenarInformation && wibenarInformation.webinar.length === 0 && meetingInformation && meetingInformation.meetings.length === 0 && onlineClassInformation && onlineClassInformation.online_classes.length !== 0) // online Class
                    ? 'onlineClassRec'
                    : (wibenarInformation && wibenarInformation.webinar.length !== 0 && meetingInformation && meetingInformation.meetings.length !== 0 && onlineClassInformation && onlineClassInformation.online_classes.length === 0) // webinar Meeting
                      ? 'meetingWebinar'
                      : (wibenarInformation && wibenarInformation.webinar.length !== 0 && meetingInformation && meetingInformation.meetings.length === 0 && onlineClassInformation && onlineClassInformation.online_classes.length !== 0) // webinar OnlineClass
                        ? 'meetingOnline'
                        : (wibenarInformation && wibenarInformation.webinar.length === 0 && meetingInformation && meetingInformation.meetings.length !== 0 && onlineClassInformation && onlineClassInformation.online_classes.length !== 0) // Meeting OnlineClass
                          ? 'WebinarOnline'
                          : (wibenarInformation && wibenarInformation.webinar.length !== 0 && meetingInformation && meetingInformation.meetings.length !== 0 && onlineClassInformation && onlineClassInformation.online_classes.length !== 0)// all
                            ? 'allRes' : '')
            }`}
            key={day}
            
            // onClick={() => {onDateClick(parse(cloneDay));console.log('cloneDay',cloneDay)} }
          >
            <Grid container style={{ textAlign: 'center' }}>
              <Grid item md={6} xs={12}>
                <Typography
                  className="number"
                  style={{
                    color: isSameDay(day, new Date()) && isSameMonth(day, monthStart) && 'red',
                  }}
                >
                  {formattedDate}

                </Typography>
              </Grid>
              {functionAddValidation(day) === false
                && (
                <Grid item md={6} xs={12}>
                  {/* {auth && auth.personal_info && auth.personal_info.role === 'ContentWriter' */}
                  {permission && permission.can_add ?
                <div className="overlaySure">
                  <button title="Schedule Webinar" disabled={functionAddValidation(day)} type="submit" className="buttonstyle" onClick={() => AddMeetingAndWibenar(parse(cloneDay))}>
                    <AddIcon />
                  </button>
                </div>
                :null}
                </Grid>
                )}
              {meetingInformation && meetingInformation.meetings.length >= 1 && (isSameMonth(day, new Date(monthStart)))
              
            && (
              
            <Grid item md={12} xs={12} style={{ marginTop: '15px' }}>
              <Typography className="scheduledText" style={{ lineHeight: '0.1', fontSize: '0.5rem' }}>
                <button type="submit" className="buttonstyle" onClick={() => allMeetingsFunction(meetingInformation && meetingInformation.meetings[0], meetingInformation.user_id, meetingInformation.meeting_date)}>
                  {(isSameMonth(day, new Date(monthStart)) && isSameDay(day, new Date(meetingInformation && meetingInformation.meetings && meetingInformation.meetings.length >= 1 && meetingInformation.meetings[0].zoom_details.start_time)) ? `${converTime(new Date(meetingInformation.meetings[0].zoom_details.start_time).toTimeString())} Meeting` : '')}
                </button>
                <br />
                <button type="submit" className="buttonstyle" style={{ color: 'tomato', fontSize: '15px' }} onClick={() => viewMultipleMeetings(meetingInformation, 'meetings')}>
                  {meetingInformation && meetingInformation.meetings && meetingInformation.meetings.length !== 0
                && meetingInformation.meetings.length - 1 !== 0 ? ` ${meetingInformation.meetings.length - 1}  more` : ''}
                </button>
              </Typography>
            </Grid>
            )}
              {wibenarInformation && wibenarInformation.webinar.length >= 1 && (isSameMonth(day, new Date(monthStart)))
            && (
            <Grid item md={12} xs={12}>
              <Typography className="scheduledText" style={{ lineHeight: '0.1', fontSize: '0.5rem' }}>
                <button type="submit" className="buttonstyle" onClick={() => allwibenarsFunction(wibenarInformation && wibenarInformation.webinar[0], wibenarInformation.user_id, wibenarInformation.meeting_date)}>
                  {(isSameMonth(day, new Date(monthStart)) && isSameDay(day, new Date(wibenarInformation && wibenarInformation.webinar && wibenarInformation.webinar.length >= 1 && wibenarInformation.webinar[0].zoom_details.start_time)) ? `${converTime(new Date(wibenarInformation.webinar[0].zoom_details.start_time).toTimeString())} Webinar` : '')}
                </button>
                <br />
                <button type="submit" className="buttonstyle" style={{ color: 'violet', fontSize: '15px' }} onClick={() => viewMultipleWibenars(wibenarInformation, 'webinar')}>
                  {wibenarInformation && wibenarInformation.webinar && wibenarInformation.webinar.length !== 0
                && wibenarInformation.webinar.length - 1 !== 0 ? `${wibenarInformation.webinar.length - 1} more` : ''}
                </button>
              </Typography>
            </Grid>
            )}
              {onlineClassInformation && onlineClassInformation.online_classes && onlineClassInformation.online_classes.length >= 1 && ((day, new Date(monthStart)))
              && (
              <Grid item md={12} xs={12}>
                <Typography className="scheduledText" style={{ lineHeight: '0.1', fontSize: '0.5rem' }}>
                  <button type="submit" className="buttonstyle" onClick={() => viewOnlineClass(onlineClassInformation && onlineClassInformation.online_classes[0], onlineClassInformation.user_id, onlineClassInformation.meeting_date)}>
                    {(isSameMonth(day, new Date(monthStart)) && isSameDay(day, new Date(onlineClassInformation && onlineClassInformation.online_classes && onlineClassInformation.online_classes.length >= 1 && onlineClassInformation.online_classes[0].zoom_details.start_time)) ? `${converTime(new Date(onlineClassInformation.online_classes[0].zoom_details.start_time).toTimeString())} Online Class` : '')}
                  </button>
                  <br />
                  <button type="submit" className="buttonstyle" style={{ color: 'green', fontSize: '15px' }} onClick={() => viewAllOnlineClass(onlineClassInformation, 'onlineClass')}>
                    {onlineClassInformation && onlineClassInformation.online_classes && onlineClassInformation.online_classes.length !== 0
                  && onlineClassInformation.online_classes.length - 1 !== 0 ? ` ${onlineClassInformation.online_classes.length - 1}  more` : ''}
                  </button>
                </Typography>
              </Grid>
              )}
            </Grid>
          </StyledButton>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="body" style={{ padding: '10px' }}>{rows}</div>;
  }

  return (
    <Grid container className="calendar" style={{ width: auth?.personal_info.role === 'ContentWriter' ? '1150px' : '1250px', overflow: 'auto' }}>
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
          maxWidth="xl"
          open={open}
          close={handleClose}
          disableEnforceFocus
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
        >
          <DialogContent>
            <Grid container style={{ textAlign: 'center' }}>
              <Grid item md={12} xs={12}>
                <Typography variant="h4" style={{ float: 'left', textAlign: 'left' }}>Jump To</Typography>
                <IconButton onClick={() => handleClose()} style={{ float: 'right', textAlign: 'right' }}><CloseIcon /></IconButton>
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  value={selectedDate}
                  variant="outlined"
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Button onClick={handleClose} variant="contained" color="primary">Jump</Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

Calendar.propTypes = {
  meetingData: PropTypes.instanceOf(Object).isRequired,
  wibenarData: PropTypes.instanceOf(Object).isRequired,
  onlineClassData: PropTypes.instanceOf(Object).isRequired,
  allMeetingsFunction: PropTypes.func.isRequired,
  allwibenarsFunction: PropTypes.func.isRequired,
  AddMeetingAndWibenar: PropTypes.func.isRequired,
  viewMultipleWibenars: PropTypes.func.isRequired,
  viewMultipleMeetings: PropTypes.func.isRequired,
  viewOnlineClass: PropTypes.func.isRequired,
  viewAllOnlineClass: PropTypes.func.isRequired,
};

export default Calendar;
