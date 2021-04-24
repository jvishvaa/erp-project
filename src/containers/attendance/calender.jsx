import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calender.scss';
import axiosInstance from '../../config/axios';
import moment from 'moment';

let myFutureDate;
let postSeven;
const RangeCalender = (props) => {

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date()).setDate(new Date(new Date()).getDate()+ 7),
      key: 'selection'
    }
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [student, setStudent] = useState([]);

  postSeven = state[0].startDate;
  useEffect(() => {
    getAttendance()
    setStartDate((moment(state[0].startDate).format("YYYY-MM-DD")));
    console.log(postSeven , "dcdcdcdccdd");
    // autoEndDate();
    // setState(endDate : postSeven.setDate(postSeven).getDate()+7);
    // setEndDate((moment(state[0].endDate).format("YYYY-MM-DD")));
  }, state);

  // const autoEndDate = () => {
  // if (props.counter == 3) {
  //   setState([{ ...state, [endDate]: "hello"}])
  // }
  // }

  useEffect(()=>{
    getfuture();
  },[]);

  const getfuture = () => {
    var myCurrentDate=new Date();
    myFutureDate=new Date(myCurrentDate);
    myFutureDate.setDate(myFutureDate.getDate()+ 7);
    console.log(myFutureDate , "futuree");
    setEndDate(myFutureDate);
    console.log(moment(state[0].startDate).format("YYYY-MM-DD") , "starttttttttttttt");
    setStartDate(moment(state[0].startDate).format("YYYY-MM-DD"))
  }

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
    let starttime = (moment(state[0].startDate).format("YYYY-MM-DD"))
    let endtime = (moment(state[0].endDate).format("YYYY-MM-DD"));
    console.log(startDate , "start");
    console.log(endtime , "end");
    props.handlePassData(endtime , startDate , starttime)

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
