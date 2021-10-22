/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles, Divider, Grid } from '@material-ui/core';
import axios from 'axios';
import styles from './inhouseWebinarCalender.style';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import urls from 'config/endpoints';
import Loader from '../../../../components/loader/loader';
import Calendar from '../calender';
import ViewIndividualWibenae from './viewInhouseWibenar';
import ViewAllWibenars from './viewInhouseAllWibenar';
import ViewInhouseMeeting from './viewInhouseMeeting';
import ViewInhouseAllMeetings from './viewInhouseAllMeetings';
import './inhouseWebinarCalendar.css';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import { rest } from 'lodash';

const InhouseCalendar = ({ classes }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  // const { alert } = useContext(AlertNotificationContext);
  const [auth] = useState(JSON.parse(localStorage.getItem('udaanDetails')));
  const [Loading, setLoading] = useState(false);
  // const alert = useAlert();
  const [open, setOpen] = useState(false);
  const [creteteUpdateWibenarFullData, setCretateUpdateWibenarFullData] = useState({});
  const [openAllWibenars, setViewAllWibenars] = useState(false);
  const [allWibenarsData, setAllWibenarsData] = useState({});
  const [webinaarInformation, setWebinaarInformation] = useState([]);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [openAllMeetings, setOpenAllmeetings] = useState(false);
  const [singleMeetingData, setSingelMeetingData] = useState({});
  const [allMeetingsData, setAllMeetingsData] = useState([]);
  const [type, setType] = useState('');
  const [moduleId, setModuleId] = useState('');
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  let loader = null;
  if (Loading) {
    loader = <Loader open />;
  }
  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'Meeting') {
          setModuleId(item.module);
          console.log(moduleId, 'module Ids');
        }
      });
    }
  }, []);
  const getData = () => {
    setLoading(true);
    console.log('module Ids', moduleId);
    if (moduleId && udaanToken) {
      axios
        .get(`${urls.sureLearning.getAllWibenarScheduledContentWritterApi}`, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res, 'WebinaarInformation');
          if (res.status === 200) {
            setWebinaarInformation(res.data);
            console.log(res, 'WebinaarInformation');
            setLoading(false);
            setAlert('success', 'Data Received');
            // alert.success('Data Received');
            // return res.json();
          }
          if (res.status !== 200) {
            setLoading(false);
          }
          return 0;
        });
    }
  };

  useEffect(() => {
    if (udaanDetails) {
      getData();
    }
  }, [moduleId]);

  const closeViewAllWibenars = (data) => {
    setViewAllWibenars(false);
    if (data === 'success') {
      getData();
    }
  };

  const closeCreateUpdateModel = (data) => {
    setOpen(false);
    if (data === 'success') {
      getData();
      closeViewAllWibenars();
    }
    setCretateUpdateWibenarFullData({
      date: '',
      speakerErp: '',
      topicName: '',
      duration: '',
      schedule: '',
      aboutSpeaker: '',
      aboutSession: '',
      profileImage: '',
      user_id: '',
      createdBy: '',
      joinLink: '',
    });
  };

  function openMeetings(data, userId, day) {
    const scheduleTime =
      (data.zoom_details.start_time &&
        data.zoom_details.start_time.split('T')[1].slice(0, 5)) ||
      '';
    setCretateUpdateWibenarFullData({
      date: day,
      speakerErp: data.user.first_name,
      topicName: data.zoom_details.topic,
      duration: data.zoom_details.duration,
      schedule: scheduleTime || '',
      aboutSpeaker: data.about_speaker,
      aboutSession: data.about_session,
      profileImage: data.speaker_photo,
      user_id: userId,
      createdBy: data.created_by,
      idNo: data.id,
      joinLink: data && data.zoom_details && data.zoom_details.join_url,
      startTime: data.zoom_details.start_time,
      isSpeaker: (data.zoom_details && data.zoom_details.is_speaker) || false,
      speakerLink: data && data.zoom_details && data.zoom_details.start_url,
      user_attendence_id: data.zoom_details.id,
      type: 'meeting',
    });

    setOpen(true);
  }

  function openOnlineClass(data, userId, date) {
    setOpenMeeting(true);
    setSingelMeetingData({ data, userId, date });
  }

  function handleCloseSingleMeeting() {
    setOpenMeeting(false);
    setSingelMeetingData({});
  }

  function viewAllMeetingsFunc(data, TypedData) {
    setViewAllWibenars(true);
    setAllWibenarsData(data);
    console.log(data, '_blank');
    setType(TypedData);
  }

  function viewAllOnlineMeetings(data) {
    setOpenAllmeetings(true);
    setAllMeetingsData(data);
  }

  function handelCloseMultipleMeetings() {
    setOpenAllmeetings(false);
    setAllMeetingsData([]);
  }

  function openWibenar(data, userId, day) {
    const scheduleTime =
      (data.zoom_details.start_time &&
        data.zoom_details.start_time.split('T')[1].slice(0, 5)) ||
      '';
    setCretateUpdateWibenarFullData({
      date: day,
      speakerErp: data.user.first_name,
      topicName: data.zoom_details.topic,
      duration: data.zoom_details.duration,
      schedule: scheduleTime || '',
      aboutSpeaker: data.about_speaker,
      aboutSession: data.about_session,
      profileImage: data.speaker_photo,
      user_id: userId,
      createdBy: data.created_by,
      idNo: data.id,
      joinLink: data && data.zoom_details && data.zoom_details.join_url,
      startTime: data.zoom_details.start_time,
      isSpeaker: (data.zoom_details && data.zoom_details.is_speaker) || false,
      speakerLink: data && data.zoom_details && data.zoom_details.start_url,
      user_attendence_id: data.zoom_details.id,
      type: 'webinar',
    });
    setOpen(true);
  }
  function viewAllWibenarsFunc(data, TypedData) {
    setViewAllWibenars(true);
    setAllWibenarsData(data);
    setType(TypedData);
  }

  function addMeetingandWibenar(day) {
    setCretateUpdateWibenarFullData({
      date: day,
      speakerErp: '',
      topicName: '',
      duration: '',
      schedule: '',
      aboutSpeaker: '',
      aboutSession: '',
      profileImage: '',
      user_id: '',
      createdBy: '',
      joinLink: '',
    });
    setOpen(true);
  }

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv} id='blogContainer'>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Calender'
          isAcademicYearVisible={true}
        />
        <div>
          <Grid container>
            <Grid item md={12} xs={12} style={{ padding: '10px' }}>
              <Calendar
                meetingData={webinaarInformation}
                wibenarData={webinaarInformation}
                onlineClassData={webinaarInformation}
                allMeetingsFunction={openMeetings}
                allwibenarsFunction={openWibenar}
                viewOnlineClass={openOnlineClass}
                AddMeetingAndWibenar={addMeetingandWibenar}
                viewMultipleWibenars={viewAllWibenarsFunc}
                viewMultipleMeetings={viewAllMeetingsFunc}
                viewAllOnlineClass={viewAllOnlineMeetings}
              />
            </Grid>
          </Grid>
          <ViewIndividualWibenae
            open={open}
            fullData={creteteUpdateWibenarFullData}
            handleClose={closeCreateUpdateModel}
          />
          <ViewAllWibenars
            open={openAllWibenars}
            handleClose={closeViewAllWibenars}
            fullData={allWibenarsData}
            setEditfromModel={openWibenar}
            setEditModelForMeeting={openMeetings}
            type={type}
          />
          <ViewInhouseMeeting
            open={openMeeting}
            fullData={singleMeetingData}
            handleClose={handleCloseSingleMeeting}
          />
          <ViewInhouseAllMeetings
            open={openAllMeetings}
            fullData={allMeetingsData}
            handleClose={handelCloseMultipleMeetings}
          />
          {loader}
        </div>
      </div>
    </Layout>
  );
};
InhouseCalendar.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(InhouseCalendar);
