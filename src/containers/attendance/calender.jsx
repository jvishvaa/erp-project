import React, { useState, useEffect } from 'react';
import { DateRangePicker , Calendar } from 'react-date-range';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calender.scss';
import { addDays } from 'date-fns';
import moment from 'moment';

let myFutureDate;
let postSeven;

const RangeCalender = (props) => {
  const [state, setState] = useState([
    { endDate: props.endDate || new Date(), startDate: addDays(new Date(), -6), key: 'selection' },
  ]);
  const [stateMonthly, setStateMonthly] = useState([
    {
      startDate: props.startDate || new Date(),
      endDate: props.endDate || new Date().setDate(new Date().getDate() + 1),
      key: 'selection',
    },
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();



  postSeven = state[0].startDate;
  useEffect(() => {
    getAttendance();
    if (props.counter === 3) {
      setStartDate(moment(stateMonthly[0].startDate).format('YYYY-MM-DD'));
    }
    if (props.counter === 2) {
      setStartDate(moment(state[0].startDate).format('YYYY-MM-DD'));
    }
  }, [state, stateMonthly]);

  useEffect(() => {
    getfuture();
  }, []);

  useEffect(() => {
    passData()
  },[props.counter])

  const getfuture = () => {
    var myCurrentDate = new Date();
    myFutureDate = new Date(myCurrentDate);
    myFutureDate.setDate(myFutureDate.getDate() + 7);
    setEndDate(myFutureDate);
    if (props.counter === 2) {
      setStartDate(moment(state[0].startDate).format('YYYY-MM-DD'));
    }
    if (props.counter === 3) {
      setStartDate(moment(stateMonthly[0].startDate).format('YYYY-MM-DD'));
    }
  };

  const getAttendance = () => {
    if (props.counter === 2) {
      if (state[0].endDate === state[0].startDate || state[0].endDate === null) {
        console.log('end null');
      } else {
        console.log(state, 'state');
        passData();
      }
    }
    if (props.counter === 3) {
      if (
        stateMonthly[0].endDate === stateMonthly[0].startDate ||
        stateMonthly[0].endDate === null
      ) {
        console.log('end null');
      } else {
        console.log(state, 'state');
        passData();
      }
    }
  };
  const passData = () => {
    if (props.counter === 2) {
      let starttime = moment(state[0].startDate).format('YYYY-MM-DD');
      let endtime = moment(state[0].endDate).format('YYYY-MM-DD');
      props.handlePassData(endtime, startDate, starttime);
    }
    if (props.counter === 3) {
      let starttime = moment(stateMonthly[0].startDate).format('YYYY-MM-DD');
      let endtime = moment(stateMonthly[0].endDate).format('YYYY-MM-DD');
      props.handlePassData(endtime, startDate, starttime);
    }
  };

  const handleDateRange = (item) => {
    console.log(item);
    if (item.selection.startDate === item.selection.endDate) {
      setState([
        {
          endDate: item.selection.startDate,
          startDate: addDays(new Date(item.selection.startDate), -6),
          key: 'selection',
        },
      ]);
    }
    if (item.selection.startDate !== item.selection.endDate) {
      setState([
        {
          endDate: item.selection.endDate,
          startDate: addDays(new Date(item.selection.endDate), -6),
          key: 'selection',
        },
      ]);
    }
  };

  return (
    <div className='calender-container'>
      {props.counter === 2 ? (
        <div className='weeklyCalendar'>
          <DateRangePicker
            onChange={(item) => handleDateRange(item)}
            moveRangeOnFirstSelection={false}
            ranges={state}
            direction='horizontal'
          />
        </div>
      ) : props.counter === 3 ? (
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setStateMonthly([item.selection])}
          moveRangeOnFirstSelection={true}
          ranges={stateMonthly}
        />
      ) :  (
        
       <Calendar minDate={moment().toDate()} maxDate={moment().toDate()}   />
      )
    }
    </div>
  );
};
export default RangeCalender;
