/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles, Divider, Grid } from '@material-ui/core';
import styles from './wibenarSchedule.style';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
// import Loader from '../../../hoc/loader';
// import urls from '../../../url';
// import TinyTextEditor from '../../../hoc/tinyMce/tinyTextEditor';
import Calendar from './Calender';
import CreateUpdateEvents from './CreateUpdateEvents';
// import ViewAllWibenars from './viewMoreWibenars';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

const ScheduleWebinar = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [Loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [eventsHolydays, setEventsHolydays] = useState({});
  const [openAllWibenars, setViewAllWibenars] = useState(false);
  const [allWibenarsData, setAllWibenarsData] = useState({});
  const [type, setType] = useState('');
  // const [allMeetingData, setAllMeetingData] = useState({});
  const [eventsInformation, setEventsInformation] = useState([]);

  let loader = null;
  if (Loading) {
    // loader = <Loader open />;
  }

  function getData() {
    setLoading(true);
    // fetch(`${urls.getAllWibenarScheduledContentWritterApi}`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //     'Content-Type': 'application/json',
    //   },
    // })
    axiosInstance
      .get(endpoints.calender.events)
      .then((res) => {
        console.log(res.data.Events, 'data');
        setEventsInformation(res.data.Events);
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const closeViewAllWibenars = (data) => {
    setViewAllWibenars(false);
    if (data === 'success') {
      getData();
    }
  };

  const closeCreateUpdateModel = (data) => {
    setOpen(false);
    if (data === 'success') {
      closeViewAllWibenars();
      getData();
    }
    setEventsHolydays({
      date: '',
    });
  };

  function addEvents(day) {
    setEventsHolydays({
      date: day,
    });
    setOpen(true);
    setEdit(false);
  }

  // console.log('eventsInformation:-', eventsInformation);
  return (
    <>
      <Typography variant='h4' className={classes.typographys}>
        Calender
      </Typography>
      <Divider className={classes.divider} />
      <Grid container>
        <Grid item md={12} xs={12}>
          <Calendar meetingData={eventsInformation} AddEvents={addEvents} />
        </Grid>
      </Grid>
      <CreateUpdateEvents
        open={open}
        fullData={eventsHolydays}
        handleClose={closeCreateUpdateModel}
        // edit={edit}
      />
      {/* <ViewAllWibenars
        open={openAllWibenars}
        handleClose={closeViewAllWibenars}
        fullData={allWibenarsData}
        setEditfromModel={openWibenar}
        setEditModelForMeeting={openMeetings}
        type={type}
      /> */}
      <div style={{ display: 'none' }}>
        {/* <TinyTextEditor id='aboutSpeakerDescId' /> */}
      </div>
      {loader}
    </>
  );
};
ScheduleWebinar.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(ScheduleWebinar);
