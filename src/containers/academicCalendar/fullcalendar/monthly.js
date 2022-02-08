import React, { useRef, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
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

const MyCalendar = () => {
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openEvent, setOpenEvent] = React.useState(false);
  const [calRef, setCalRef] = useState([]);
  const [jumpTo, setJumpTo] = useState();
  const [isDay, setIsDay] = useState(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const toggleCreateClass = () => {
    setIsCreateClassOpen((prevState) => !prevState);
  };

  const { user_level: userLevel = 5 } =
    JSON.parse(localStorage.getItem('userDetails')) || {};

  const handleDateClick = (e) => {
    const cal = calendarRef.current.getApi();
    cal.changeView('day', e?.dateStr);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEvent = () => {
    setOpenEvent(true);
  };

  useEffect(() => {
    if (isDay === false) {
      axios({
        method: 'get',
        url: `${endpoints.period.getDate}`,
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      })
        .then((res) => {
          // setEvents(res.data.result);
          let eventsArray = [];
          res.data.result.forEach((items, index) => {
            eventsArray.push({
              start: items?.start || items?.date,
              end: items?.end,
              title: items?.info?.name || items?.holidays,
              color:
                items?.info?.type_name === 'Examination'
                  ? '#F0485B'
                  : items?.info?.type_name === 'Lecture'
                  ? '#A7A09B'
                  : items?.type?.name === 'Holiday'
                  ? '#308143'
                  : '#BD78F9',
              extendedProps: items,
              id: items?.id,
            });
          });
          setEvents(eventsArray);
        })
        .catch((error) => {
          // setAlert('error', 'Something Wrong!');
        });
    }
  }, [endDate, isCreateClassOpen]);

  const getEvent = (info) => {
    info.jsEvent.preventDefault();
    const cal = calendarRef.current.getApi();
    cal.changeView('day', info?.event?.extendedProps?.date);
  };

  const getView = (e) => {
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
        eventClick={getEvent}
        headerToolbar={{
          left: 'today myCustomButton',
          center: 'prev,title,next',
          right: 'dayGridMonth,timeGridWeek,day',
        }}
        dayHeaderFormat={{ weekday: 'long' }}
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
            <Button onClick={handleClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={jumpDate} color='primary' autoFocus>
              Submit
            </Button>
          </DialogActions>
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
