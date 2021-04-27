import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calender.scss';
import { addDays } from 'date-fns';
import DateRangeSelector from '../../components/date-range-selector/index';
import axiosInstance from '../../config/axios';
import moment from 'moment';

let myFutureDate;
let postSeven;

const RangeCalender = (props) => {
  // let date = new Date();
  const [state, setState] = useState([
    { startDate: new Date(), endDate: addDays(new Date(), -6), key: 'selection' },
  ]);
  console.log(state.startDate, state.endDate, 'wadawda');
  const [stateMonthly, setStateMonthly] = useState([
    {
      startDate: new Date(),
      endDate: new Date().setDate(new Date().getDate() + 1),
      key: 'selection',
    },
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [student, setStudent] = useState([]);

  postSeven = state[0].startDate;
  useEffect(() => {
    getAttendance();
    if (props.counter === 3) {
      setStartDate(moment(stateMonthly[0].startDate).format('YYYY-MM-DD'));
    }
    if (props.counter === 2) {
      setStartDate(moment(state[0].startDate).format('YYYY-MM-DD'));
    }
    console.log(postSeven, 'dcdcdcdccdd');
    // autoEndDate();
    // setState(endDate : postSeven.setDate(postSeven).getDate()+7);
    // setEndDate((moment(state[0].endDate).format("YYYY-MM-DD")));
  }, [state, stateMonthly]);

  const autoEndDate = () => {
    if (props.counter == 3) {
      if (state[0].endDate === state[0].startDate || state[0].endDate === null) {
        console.log(JSON.stringify(state), 'hittttt');
      }
    }
  };

  useEffect(() => {
    getfuture();
  }, []);

  const getfuture = () => {
    var myCurrentDate = new Date();
    myFutureDate = new Date(myCurrentDate);
    myFutureDate.setDate(myFutureDate.getDate() + 7);
    console.log(myFutureDate, 'futuree');
    setEndDate(myFutureDate);
    console.log(moment(state[0].startDate).format('YYYY-MM-DD'), 'starttttttttttttt');
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
      console.log(startDate, 'start');
      console.log(endtime, 'end');
      props.handlePassData(endtime, startDate, starttime);
    }
    if (props.counter === 3) {
      let starttime = moment(stateMonthly[0].startDate).format('YYYY-MM-DD');
      let endtime = moment(stateMonthly[0].endDate).format('YYYY-MM-DD');
      console.log(startDate, 'start');
      console.log(endtime, 'end');
      props.handlePassData(endtime, startDate, starttime);
    }
  };

  const handleDateRange = (item) => {
    console.log(item);
    if(item.selection.startDate === item.selection.endDate){
      setState([{
        startDate: item.selection.startDate,
        endDate: addDays(new Date(item.selection.startDate), -6),
        key: 'selection',
      }])
    }
    if(item.selection.startDate !== item.selection.endDate) {
      setState([{
        startDate: item.selection.endDate,
        endDate: addDays(new Date(item.selection.endDate), -6),
        key: 'selection',
      }])
    }
  }

  return (
    <div className='calender-container'>
      {props.counter === 2 ? (
        <div className='weeklyCalendar'>
          <DateRangePicker
            onChange={(item) => handleDateRange(item) }
            //showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            //months={1}
            ranges={state}
            direction='horizontal'
          />
        </div>
      ) : props.counter === 3 ? (
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setStateMonthly([item.selection])}
          // onchange= {(item) => getAttendance(item)}
          moveRangeOnFirstSelection={true}
          ranges={stateMonthly}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
export default RangeCalender;
