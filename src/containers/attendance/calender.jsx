import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calender.scss';
import axiosInstance from '../../config/axios';
import moment from 'moment';


const RangeCalender = (props) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [student, setStudent] = useState([]);

  useEffect(() => {
    getAttendance()
    console.log(props.sectionID, "branch");
    setStartDate((moment(state[0].startDate).format("YYYY-MM-DD")));
    console.log(state[0].endDate, "end date");
    // setEndDate((moment(state[0].endDate).format("YYYY-MM-DD")));
  }, state);

  const getAttendance = () => {
    if (state[0].endDate === state[0].startDate || state[0].endDate === null) {
      console.log("end null");
    } else {
      console.log(state, "state");
      passData();
    }
  }
  const passData = () => {
    // console.log(student , "student absent");
    // setTimeout(function () {
    //   console.log(student, "student data passsss");
    //   props.handlePassData(student)
    // }, 6000);
    let endtime = (moment(state[0].endDate).format("YYYY-MM-DD"));
    console.log(startDate , "start");
    console.log(endtime , "end");
    props.handlePassData(endtime , startDate)

  }

  console.log(state[0].endDate, "date");
  console.log(state[0].startDate, "start");


  return (
    <div className="calender-container" >
      <DateRange
        editableDateInputs={true}
        onChange={item => setState([item.selection])}
        // onchange= {(item) => getAttendance(item)}
        moveRangeOnFirstSelection={false}
        ranges={state}
      />
    </div>
  )
}
export default RangeCalender;
