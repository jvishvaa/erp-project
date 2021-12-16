import React, { useState, useEffect } from 'react';
import { DateRangePicker, Calendar } from 'react-date-range';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FlagIcon from '@material-ui/icons/Flag';
import { addDays, format } from 'date-fns';
import moment from 'moment';
import './index.scss';
import RCAPI from './RCconfig/RCapi';
import RCENDPOINTS from './RCconfig/RCendpoints';
import apiRequest from '../../containers/dashboard/StudentDashboard/config/apiRequest';
import endpoints from '../../containers/dashboard/StudentDashboard/config/Endpoint';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  themeBg: {
    backgroundColor: theme.palette.primary.main,
  },
  calcss: {
    margin: '0px !important',
  },
}));

export default function RangeCalender(props) {
  const classes = useStyles();
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  const branchIds = role_details?.branch ? role_details?.branch.map((obj) => obj.id) : [];
  const gradeIds = role_details?.grades
    ? role_details?.grades.map((obj) => obj.grade_id)
    : [];
  const [selectedType, setSelectedType] = useState('today');
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [holidayDetailsList, setHolidayDetailsList] = useState([]);
  const [holidayDates, setHolidaydates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);

  const getHolidayDates = (holidayDetail) => {
    let dateList = [];
    holidayDetail.map((item) => {
      var startDate = moment(item.holiday_start_date, 'YYYY-MM-DD');
      var endDate = moment(item.holiday_end_date, 'YYYY-MM-DD');
      const diff = endDate.diff(startDate, 'days');
      if (diff > 0) {
        const diffDate = Array.from(
          { length: endDate.date() - startDate.date() + 1 },
          (v, k) => k + startDate.date()
        );
        dateList.push(diffDate);
      } else {
        dateList.push(startDate.date());
      }
    });
    setHolidaydates(dateList.flat());
  };

  const getCurrentMonthDetails = () => {
    const uniqueGrades = gradeIds.filter((val, id, array) => array.indexOf(val) == id);
    const date = currentMonth,
      y = date.getFullYear(),
      m = date.getMonth();
    const firstDate = new Date(y, m, 1);
    const lastDate = new Date(y, m + 1, 0);
    // RCAPI(
    //   'get',
    //   `${RCENDPOINTS.RANGECALENDAR.getHolidayList}?start_date=${moment(firstDate).format(
    //     'YYYY-MM-DD'
    //   )}&end_date=${moment(lastDate).format(
    //     'YYYY-MM-DD'
    //   )}&branch=${branchIds}&grade=${uniqueGrades}`
    // ).then((res) => {
    //   if (res.data.status_code === 200) {
    //     getHolidayDates(res.data.holiday_detail);
    //     setHolidayDetailsList(res.data.holiday_detail);
    //     props.setEventList(res.data.holiday_detail);
    //   }
    // });
    apiRequest('get', `${endpoints.dashboard.student.calendar}?start_date=${moment(firstDate).format(
      'YYYY-MM-DD'
    )}&end_date=${moment(lastDate).format(
      'YYYY-MM-DD'
    )}&branch=${branchIds}&grade=${uniqueGrades}`, null, null, true, 5000)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          getHolidayDates(res?.data?.holiday_detail);
          setIsEnabled(res?.data?.is_enabled);
          setHolidayDetailsList(res?.data?.holiday_detail);
          props.setEventList(res?.data?.holiday_detail);
        }
      })
      .catch((error) => {
        console.log('error');
        // setAlert('error', 'Failed to mark attendance');
      });
  };
  useEffect(() => {
    getCurrentMonthDetails();
  }, []);

  useEffect(() => {
    setHolidaydates([]);
    setHolidayDetailsList([]);
    getCurrentMonthDetails();
  }, [currentMonth]);

  useEffect(() => {
    if (selectedType) {
      const seletedDateRangeList = holidayDetailsList.filter((item) => {
        let hs = moment(item.holiday_start_date, 'YYYY-MM-DD').date();
        let he = moment(item.holiday_end_date, 'YYYY-MM-DD').date();
        let sd = state[0].startDate.getDate();
        if (state[0]?.endDate?.getDate) {
          let ed = state[0].endDate.getDate();
          return (hs >= sd && hs <= ed) || (he >= sd && he <= ed);
        } else {
          return sd >= hs && sd <= he;
        }
      });
      props.setEventList(seletedDateRangeList);
    }
    !selectedType && setSelectedType('today');
  }, [state]);

  useEffect(() => {
    if (selectedType === 'today') {
      setState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
      ]);
    } else if (selectedType === 'weekly') {
      setState([
        {
          startDate: new Date(moment().subtract(3, 'days')),
          endDate: new Date(moment().add(3, 'days')),
          key: 'selection',
        },
      ]);
    }
  }, [selectedType]);

  const handleChange = (item) => {
    console.log(item);
    if (selectedType == 'today' || selectedType === undefined) {
      item.selection.startDate = new Date(moment(item.selection.startDate));
      item.selection.endDate = new Date(moment(item.selection.startDate));
    } else if (selectedType === 'weekly') {
      item.selection.endDate = addDays(new Date(item.selection.startDate), 6);
    }
    setState([item.selection]);
  };

  const handleChangeToday = (id) => {
    setDate(id)
    setState([
      {
        startDate: id,
        endDate: id,
        key: 'selection',
      },
    ])
  }

  const FlagComponent = () => {
    return (
      <FlagIcon
        style={{
          position: 'absolute',
          color: 'red',
          fontSize: 9,
          top: '-1px',
          marginLeft: '2px',
        }}
        fontSize='small'
      />
    );
  };

  const customDayContent = (day) => {
    return (
      <div>
        {currentMonth.getMonth() === day.getMonth() &&
          holidayDates.indexOf(day.getDate()) != -1 && <FlagComponent />}
        <span
          style={{
            color:
              day.getDay() === 0 && currentMonth.getMonth() === day.getMonth()
                ? 'red'
                : null,
          }}
        >
          {format(day, 'd')}
        </span>
      </div>
    );
  };

  return (
    <>
      {isEnabled ? (
        <Grid
          className={clsx(classes.themeBg, classes.calcss)}
          container
          direction='row'
          justifyContent='space-evenly'
          alignItems='center'
          style={{ padding: '0.5rem', margin: '0px !important' }}
        >
          <Grid item>
            <Button
              style={{ fontSize: '1rem', padding: '0px 2px' }}
              size={'small'}
              variant={'contained'}
              color={
                selectedType === 'today' || selectedType === undefined
                  ? 'primary'
                  : 'secondry'
              }
              onClick={() => {
                setSelectedType('today');
              }}
            >
              Today
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{ fontSize: '1rem', padding: '0px 2px' }}
              size={'small'}
              variant={'contained'}
              color={selectedType === 'weekly' ? 'primary' : 'secondry'}
              onClick={() => {
                setSelectedType('weekly');
              }}
            >
              Weekly
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{ fontSize: '1rem', padding: '0px 2px' }}
              size={'small'}
              variant={'contained'}
              color={selectedType === 'custom' ? 'primary' : 'secondry'}
              onClick={() => {
                setSelectedType('custom');
              }}
            >
              Custom
            </Button>
          </Grid>
        </Grid>) : ''}
      {selectedType === 'today' ? <Calendar
        editableDateInputs={true}
        dayContentRenderer={customDayContent}
        className='rangeCalendar'
        // ranges={state}
        date={date}
        onChange={handleChangeToday}
        onShownDateChange={(day) => {
          setCurrentMonth(day);
        }}
      /> :
        <DateRangePicker
          editableDateInputs={true}
          dayContentRenderer={customDayContent}
          className='rangeCalendar'
          ranges={state}
          onChange={handleChange}
          onShownDateChange={(day) => {
            setCurrentMonth(day);
          }}
        />
      }
    </>
  );
}