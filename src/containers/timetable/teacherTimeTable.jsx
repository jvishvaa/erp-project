import React, { useEffect, useState, useContext } from 'react';
import Layout from 'containers/Layout';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import { Grid, Button, TextField } from '@material-ui/core';
import MyCalendar from '../time-table/date-and-calander/monthly';
import { useHistory } from 'react-router-dom';
import axiosInstance from 'config/axios';
import moment from 'moment';
import endpoints from 'config/endpoints';
import Loader from './../../components/loader/loader';
import TeacherDetailsDialogue from './teacherDetailsDialogue';
import { AlertNotificationContext } from './../../context-api/alert-context/alert-state';

const TeacherTimeTable = () => {
  const history = useHistory();
  const [timeTableEvents, setTimeTableEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPeriod, setOpenPeriod] = useState(false);
  const [periodData, setPeriodData] = useState([]);
  const sessionYear = JSON.parse(sessionStorage.getItem('acad_session'));

  const { setAlert } = useContext(AlertNotificationContext);

  function convert(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  const ResponseConverter = (ResponseEvents) => {
    let tempArray = [];
    var curr = new Date();
    var firstDateOfWeek = curr.getDate() - curr.getDay();
    ResponseEvents.forEach((item, index) => {
      var currDate = new Date();
      let setColor =
        item?.period_type === 1
          ? 'paleyellow'
          : item?.period_type === 2
          ? 'tomato'
          : item?.period_type === 3
          ? 'green'
          : item?.period_type === 5
          ? '#956dbf'
          : '#d2d86e';
      let setDate =
        item?.day === 0
          ? firstDateOfWeek + 1
          : item?.day === 1
          ? firstDateOfWeek + 2
          : item?.day === 2
          ? firstDateOfWeek + 3
          : item?.day === 3
          ? firstDateOfWeek + 4
          : item?.day === 4
          ? firstDateOfWeek + 5
          : item?.day === 5
          ? firstDateOfWeek + 6
          : firstDateOfWeek;
      let setConvertDate = convert(currDate.setDate(setDate));
      let pType =
        item?.period_type_name === 'Examination' ? 'Exam' : item?.period_type_name;
      let subName = item?.subject_name;
      let title =
        item?.period_type === 3 || item?.period_type === 2
          ? subName
            ? `${pType} : ${subName}`
            : `${pType}`
          : item?.period_type_name;
      let tempObj = {
        title: title,
        start: setConvertDate + 'T' + item?.start_time,
        end: setConvertDate + 'T' + item?.end_time,
        extendedProps: item,
        color: setColor,
      };
      tempArray.push(tempObj);
    });
    setTimeTableEvents(tempArray);
  };

  const startDateOfWeek = moment().startOf('week').format('YYYY-MM-DD');
  const endDateOfWeek = moment().endOf('week').format('YYYY-MM-DD');

  const handlesetPeriodDetails = (data) => {
    // Trigger's on clicking
    setPeriodData(data?.event?.extendedProps);
    setOpenPeriod(true);
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints?.timeTable?.teacherTimeTable}?session_year=${sessionYear?.id}&start_date=${startDateOfWeek}&end_date=${endDateOfWeek}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          ResponseConverter(result?.data?.result);
          setLoading(false);
          setAlert('success', result?.data?.message);
        } else {
          setLoading(false);
          setAlert('error', result?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleClosePeriod = (val) => {
    setOpenPeriod(val);
  };

  return (
    <Layout>
      {loading && <Loader />}
      <CommonBreadcrumbs componentName='Time Table' isAcademicYearVisible={true} />
      <Grid container justifyContent='flex-end'>
        <Grid item xs={3} md={1}>
          <Button color='primary' variant='contained' onClick={() => history.goBack()}>
            Back
          </Button>
        </Grid>
      </Grid>
      <h2 style={{ textAlign: 'center' }}>Teacher's Time Table</h2>
      <h2 style={{ textAlign: 'center' }}>
        ({`${moment().startOf('week').format('MMMM D[,] YYYY')}`} -{' '}
        {`${moment().endOf('week').format('MMMM D[,] YYYY')}`})
      </h2>
      <MyCalendar
        defaultView={'timeGridWeek'}
        timeTableEvents={timeTableEvents}
        startSchoolTime={'07:00:00'}
        endSchoolTime={'17:00:00'}
        heading={'false'}
        eventClick={handlesetPeriodDetails}
      />
      <TeacherDetailsDialogue
        openPeriod={openPeriod}
        periodData={periodData}
        handleClosePeriod={handleClosePeriod}
      />
    </Layout>
  );
};

export default TeacherTimeTable;
