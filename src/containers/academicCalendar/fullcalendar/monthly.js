import React, { useRef, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import FullCalendar, { filterEventStoreDefs } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import CustomViewConfig from './temp';
import './acadCalendar.scss';
import axios from 'config/axios';
import endpoints from '../../../config/endpoints';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CreateClass from '../dialogs/createClass';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Typography } from '@material-ui/core';
import { connect, useSelector } from 'react-redux';

const MyCalendar = ({ selectedGrade, selectedSubject, acadyear, filtered, setFiltered, counter, erpConfig ,selectedBranch }) => {
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openMonth, setOpenMonth] = React.useState(false);
  const [openEvent, setOpenEvent] = React.useState(false);
  const [calRef, setCalRef] = useState([]);
  const [jumpTo, setJumpTo] = useState();
  const [isDay, setIsDay] = useState(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [filterData, setFilterData] = useState([])
  const [isMonth, setIsMonth] = useState(false)
  const [viewCal, setViewCal] = useState('')
  const [periodDataEach, setPeriodDataEach] = useState([])
  const [dialogDate, setDialogDate] = useState()
  const toggleCreateClass = () => {
    setIsCreateClassOpen((prevState) => !prevState);
  };

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const branchIds =
    JSON.parse(localStorage.getItem('userDetails'))?.role_details?.branch || {};


  const { user_level: userLevel = 5 } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const handleDateClick = (e) => {
    const cal = calendarRef.current.getApi();
    cal.changeView('day', e?.dateStr);
  };

  const handleEventClick = (e) => {
    if(e?.start) {
    const cal = calendarRef.current.getApi();
    cal.changeView('day', e?.start);
    setOpenMonth(false)
    } else {
      const cal = calendarRef.current.getApi();
      cal.changeView('day', e?.date);
      setOpenMonth(false)
    }
  };

  const handleClickOpenMonth = (e) => {
    setOpenMonth(true);
    setDialogDate(moment(e.event.start).format('DD-MM-YYYY'))
    if (e.event.start) {
      if (!filtered) {
        let params = {
          start_date: moment(e.event.start).format('YYYY-MM-DD'),
          end_date: moment(e.event.start).format('YYYY-MM-DD'),
          branch: (branchIds.map((el) => el?.id)).toString()
        }
        axios({
          method: 'get',
          url: `${endpoints.period.getDate}`,
          params: params,
        })
          .then((res) => {
            console.log(res);
            setPeriodDataEach(res.data.result)
          })
          .catch((error) => {
            console.log(error);
          })
      }
      else {
        let params = {
          start_date: moment(e.event.start).format('YYYY-MM-DD'),
          end_date: moment(e.event.start).format('YYYY-MM-DD'),
          subject_mapping: selectedSubject.toString(),
          grade: selectedGrade.toString()
        }
        axios({
          method: 'get',
          url: `${endpoints.period.getDate}`,
          params: params,
        })
          .then((res) => {
            setPeriodDataEach(res.data.result)
          })
          .catch((error) => {
            console.log(error);
          })
      }
    }

  };


  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseMonth = () => {
    setOpenMonth(false);
    setDialogDate()
    setPeriodDataEach([])
  };

  const handleOpenEvent = () => {
    setOpenEvent(true);
  };

  useEffect(() => {
    if (!filtered) {
      let params = {
        start_date: startDate,
        end_date: endDate,
        branch: (branchIds.map((el) => el?.id)).toString()
      }
      setFilterData(params)
      if (params?.end_date.length != 0) {
        axios({
          method: 'get',
          url: isMonth ? `${endpoints.period.periodV2}` : `${endpoints.period.getDate}`,
          params: params,
        })
          .then((res) => {
            // setEvents(res.data.result);
            let eventsArray = [];
            if (isMonth) {
              res.data.result && res.data.result.forEach((items, index) => {
                eventsArray.push({
                  start: items?.date,
                  // end: items?.end,
                  title: items?.info?.name || items?.total_periods ? 'periods ' + items?.total_periods : items?.total_holidays ? "holiday " + items?.total_holidays : '',
                  color:
                    items?.info?.type_name === 'Examination'
                      ? '#F0485B'
                      : items?.info?.type_name === 'Lecture'
                        ? '#A7A09B'
                        : items?.type?.name === 'Holiday'
                          ? '#308143'
                          : items?.total_holidays ? '#308143' : items?.total_periods ? '#A7A09B' : '#BD78F9',
                  extendedProps: res.data.result,
                  id: items?.index,
                });
              });
            }
            if (!isMonth) {
              res.data.result && res.data.result.forEach((items, index) => {
                eventsArray.push({
                  start: items?.start || items?.date,
                  end: items?.end,
                  title: items?.info?.name || items?.gradewise_holidays[0]?.holiday_name,
                  color:
                    items?.info?.type_name === 'Examination'
                      ? '#F0485B'
                      : items?.info?.type_name === 'Lecture'
                        ? '#A7A09B'
                        : items?.type?.name === 'Holiday'
                          ? '#308143'
                          : '#BD78F9',
                  extendedProps: res.data.result,
                  id: items?.id,
                });
              });
            }
            setEvents(eventsArray);
          })
          .catch((error) => {
            // setAlert('error', 'Something Wrong!');
            let eventsArray = [];
            eventsArray.push({
              extendedProps: null,
            });
            setEvents(eventsArray)
          });
      }
    }
    else {
      let params = {
        start_date: startDate,
        end_date: endDate,
        subject_mapping: selectedSubject.toString(),
        grade: selectedGrade.toString(),
        acad_session: selectedBranch?.id
      }

      setFilterData(params)
      if (params?.start_date) {
        axios({
          method: 'get',
          url: isMonth ? `${endpoints.period.periodV2}` : `${endpoints.period.getDate}`,
          params: params,
        })
          .then((res) => {
            // setEvents(res.data.result);
            let eventsArray = [];
            if (isMonth) {
              res.data.result && res.data.result.forEach((items, index) => {
                eventsArray.push({
                  start: items?.date,
                  // end: items?.end,
                  title: items?.info?.name || items?.total_periods ? 'periods ' + items?.total_periods : items?.total_holidays ? "holiday " + items?.total_holidays : '',
                  color:
                    items?.info?.type_name === 'Examination'
                      ? '#F0485B'
                      : items?.info?.type_name === 'Lecture'
                        ? '#A7A09B'
                        : items?.type?.name === 'Holiday'
                          ? '#308143'
                          : items?.total_holidays ? '#308143' : items?.total_periods ? '#A7A09B' : '#BD78F9',
                  extendedProps: res.data.result,
                  id: items?.index,
                });
              });
            }
            if (!isMonth) {
              res.data.result.forEach((items, index) => {
                eventsArray.push({
                  start: items?.start || items?.date,
                  end: items?.end,
                  title: items?.info?.name || items?.gradewise_holidays[0]?.holiday_name,
                  color:
                    items?.info?.type_name === 'Examination'
                      ? '#F0485B'
                      : items?.info?.type_name === 'Lecture'
                        ? '#A7A09B'
                        : items?.type?.name === 'Holiday'
                          ? '#308143'
                          : '#BD78F9',
                  extendedProps: res.data.result,
                  id: items?.id,
                });
              });
            }
            setEvents(eventsArray);
          })
          .catch((error) => {
            // setAlert('error', 'Something Wrong!');
            let eventsArray = [];
            eventsArray.push({
              extendedProps: null,
            });
            setEvents(eventsArray)
          });
      }
    }
    // }
  }, [endDate, isCreateClassOpen, filtered, counter, viewCal]);

  const getEvent = (info) => {
    // info.jsEvent.preventDefault();
    const cal = calendarRef.current.getApi();
    cal.changeView('day', info?.event?._instance?.range?.start);
  };

  const getView = (e) => {
    setViewCal(e.view.type)
    if (e.view.type === 'dayGridMonth') {
      setIsMonth(true)
    } else {
      setIsMonth(false)
    }
    if (e.view.type === 'day') {
      setIsDay(true);
    } else {
      setIsDay(false);
      sessionStorage.removeItem('dailyData');
    }
  };

  const calendarRef = useRef(null);

  let calendarApi;

  const handleDate = (e) => {
    setJumpTo(e.target.value);
  };

  const jumpDate = () => {
    calRef.gotoDate(jumpTo);
    setOpen(false);
  };

  return (
    <div style={{ margin: '30px', cursor: 'pointer' }}>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
          listPlugin,
          CustomViewConfig,
        ]}
        initialView='dayGridMonth'
        contentHeight='600'
        // initialView= 'timeGridWeek'
        defaultView='timeGridWeek'
        height='600px'
        events={events}
        eventDisplay='block'
        displayEventTime={true}
        eventTimeFormat={{
          // like '14:30:00'
          hour: '2-digit',
          minute: '2-digit',
          meridiem: true,
        }}
        // eventContent={renderEventContent}
        dateClick={handleDateClick}
        ref={calendarRef}
        // eventContent={RenderEventContent}
        eventClick={handleClickOpenMonth}
        headerToolbar={{
          left: 'today myCustomButton',
          center: 'prev,title,next',
          right: 'dayGridMonth,timeGridWeek,day',
        }}
        dayHeaderFormat={{ weekday: 'long' }}
        counter={counter}
        customButtons={{
          myCustomButton: {
            text: 'Calendar',
            click: function () {
              setOpen(true);
              setCalRef(calendarRef.current.getApi());
            },
            // icon: "far fa-calendar",
          },
        }}
        // viewDisplay={getView}
        datesSet={(dateInfo) => {
          setStartDate(moment(dateInfo.start).format('YYYY-MM-DD'));
          setEndDate(moment(dateInfo.end).subtract(1, 'days').format('YYYY-MM-DD'));
        }}
        viewDidMount={getView}
        dayMaxEventRows={4}
        extendedProps={filterData}
        content={filterData}
      // allDaySlot={false}
      // eventMinHeight={30}
      />

      <div>
        <Card
          style={{ marginTop: '2%', display: 'flex', justifyContent: 'space-between' }}
        >
          <div
            className='colorArea'
            style={{
              width: '50%',
              flexWrap: 'wrap',
              padding: '1% 2%',
              display: 'flex',
              margin: 5,
              justifyContent: 'space-around',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className='colorDiv'
                style={{ background: '#308143', marginRight: '1%' }}
              ></div>
              <p> Holidays </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className='colorDiv'
                style={{ background: '#F0485B', marginRight: '1%' }}
              ></div>
              <p> Examination </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className='colorDiv'
                style={{ background: '#BD78F9', marginRight: '1%' }}
              ></div>
              <p style={{ width: '100%' }}> Miscellaneous Event </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className='colorDiv'
                style={{ background: '#F96E34', marginRight: '1%' }}
              ></div>
              <p> Competitions </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className='colorDiv'
                style={{ background: '#A7A09B', marginRight: '1%' }}
              ></div>
              <p> Period </p>
            </div>
          </div>

          <div
            className='ButtonArea'
            style={{ alignItems: 'center', display: 'flex', margin: '0 5%' }}
          >
            <div>
              {userLevel === 13 ? (
                ''
              ) : (
                <Button
                  variant='contained'
                  type='submit'
                  value='Submit'
                  color='primary'
                  onClick={toggleCreateClass}
                >
                  Add Period
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'> Go to Date</DialogTitle>
          <DialogContent>
            <TextField
              id='date'
              label='Jump To Date'
              type='date'
              defaultValue='2022-01-21'
              onChange={handleDate}
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary' variant='contained'>
              Cancel
            </Button>
            <Button onClick={jumpDate} color='primary' autoFocus >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>

      <>
        <Dialog
          open={openMonth}
          onClose={handleCloseMonth}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' ><div style={{display: 'flex' , justifyContent: 'space-between'}}><div style={{fontSize: '15px' , margin: 'auto 0' }} >{dialogDate}</div> <IconButton onClick={handleCloseMonth} style={{fontSize: '15px'}} ><CloseIcon /></IconButton> </div></DialogTitle>
          <DialogContent style={{minWidth: '450px' , paddingBottom: '5%'}} >
            <div style={{overflowX: 'hidden' , overflowY: 'auto' , height:'400px' }} >
            <div style={{display: 'flex' , justifyContent: 'space-between'}} >
              <div style={{fontSize: '15px' , fontWeight: '600'}} >
                Event Start Date
              </div>
              <div style={{fontSize: '15px' , fontWeight: '600'}}>
                Event Time
              </div>
            </div>
            <Divider />
            <div>
              {periodDataEach && periodDataEach.map((item) => (
                <>
                <div style={{display: 'flex' , justifyContent: 'space-between' , margin: '2% 0' , cursor: 'pointer' }} onClick={() => handleEventClick(item)} >
                <div>
                  <div>{item?.info?.name ? item?.info?.name : item?.gradewise_holidays[0]?.holiday_name}</div>
                </div>
                <div>
                <div>{item?.start ? moment(item?.start).format('hh:mm a') : item?.date }</div>
              </div>
              </div>
              <Divider />
              </>
              ))}
            </div>
            </div>
          </DialogContent>
         
        </Dialog>
      </>

      <CreateClass
        toggleCreateClass={toggleCreateClass}
        isCreateClassOpen={isCreateClassOpen}
      />
    </div>
  );
};
export default MyCalendar;
